import { cache } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, query, where, limit, getDocs, orderBy } from 'firebase/firestore';
import type { Product } from '@/types';
import { firebaseConfig } from '@/firebase/config';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import { SLUGURI_CORECTATE, normalizeSlug } from '@/lib/slug-redirects';

// slug nou -> slug vechi (pentru lookup tolerant inainte de migrarea Firestore)
const SLUGURI_VECHI: Record<string, string> = Object.fromEntries(
  Object.entries(SLUGURI_CORECTATE).map(([vechi, nou]) => [nou, vechi]),
);

/** Slug-ul alternativ (nou<->vechi) sau undefined daca nu are alias. */
function aliasSlug(slug: string): string | undefined {
  return SLUGURI_VECHI[slug] ?? SLUGURI_CORECTATE[slug];
}

// Fetch de produs pentru SEO (metadata + JSON-LD), rulat pe server în
// app/produse/[slug]/layout.tsx. NU folosește firebase-admin și NU importă
// hook-urile client (@/firebase/provider, @/firebase/client-provider) — doar
// SDK-ul modular "firebase/app" + "firebase/firestore", care funcționează și
// în Node. Colecția `products` e publică la citire (vezi firestore.rules),
// deci nu e nevoie de autentificare.
//
// Orice eșec (rețea, document lipsă, câmp lipsă) întoarce `null` în loc să
// arunce o eroare — pagina de produs (client component, neschimbată) trebuie
// să se randeze normal indiferent de rezultatul acestui fetch.

function getServerFirestore() {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return getFirestore(app);
}

function plainText(v: unknown, max = 300): string {
  if (typeof v !== 'string') return '';
  const s = v.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  return cut.slice(0, Math.max(cut.lastIndexOf(' '), 0) || max).trim() + '…';
}

export interface SeoProduct {
  name: string;
  slug: string;
  brand: string;
  category: string;
  price?: number;
  priceOnRequest: boolean;
  currency: string;
  mainImage?: string;
  inStock: boolean;
  /** Text simplu (fara HTML) pentru JSON-LD description. */
  description?: string;
}

export const getProductBySlugForSeo = cache(async (slug: string): Promise<SeoProduct | null> => {
  const direct = await fetchSeoProduct(slug);
  if (direct) return direct;
  const alias = aliasSlug(slug);
  return alias ? fetchSeoProduct(alias) : null;
});

async function fetchSeoProduct(slug: string): Promise<SeoProduct | null> {
  try {
    const db = getServerFirestore();
    const q = query(collection(db, 'products'), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;

    const data = snap.docs[0].data() as Record<string, unknown>;
    const name = typeof data.name === 'string' ? data.name : undefined;
    if (!name) return null;

    return {
      name,
      slug: normalizeSlug(typeof data.slug === 'string' ? data.slug : slug),
      brand: typeof data.brand === 'string' ? data.brand : '',
      category: typeof data.category === 'string' ? data.category : '',
      price: typeof data.price === 'number' ? data.price : undefined,
      priceOnRequest: data.priceOnRequest === true,
      currency: typeof data.currency === 'string' ? data.currency : 'EUR',
      mainImage: typeof data.mainImage === 'string' ? data.mainImage : undefined,
      inStock: data.inStock !== false,
      description: plainText(data.shortDescription) || plainText(data.description) || undefined,
    };
  } catch (error) {
    console.error(`[seo] product-data fetch failed for slug "${slug}":`, error);
    return null;
  }
}

/** Numele de categorie afișat pe site pentru un slug de categorie (fallback: slug-ul brut). */
export function categoryLabel(categorySlug: string): string | undefined {
  if (!categorySlug) return undefined;
  return PRODUCT_CATEGORIES.find((c) => c.slug === categorySlug)?.name ?? categorySlug;
}

/** Normalizează un câmp de dată Firestore (Timestamp, {seconds}, string ISO) la Date. */
function toDate(val: unknown): Date | undefined {
  if (!val) return undefined;
  if (typeof val === 'object') {
    const v = val as { toMillis?: () => number; seconds?: number };
    if (typeof v.toMillis === 'function') {
      const ms = v.toMillis();
      return Number.isFinite(ms) ? new Date(ms) : undefined;
    }
    if (typeof v.seconds === 'number') {
      return new Date(v.seconds * 1000);
    }
    return undefined;
  }
  if (typeof val === 'string' || typeof val === 'number') {
    const d = new Date(val);
    return Number.isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
}

export interface ProductSlugEntry {
  slug: string;
  lastModified?: Date;
}

/**
 * Toate slug-urile de produse din Firestore, pentru sitemap.ts. Folosit cu
 * cache() ca generarea sitemap-ului să facă o singură citire per request.
 * Fără slug → produsul e sărit. Slug-uri duplicate → păstrat primul.
 * Orice eroare de rețea/parsare → listă goală (niciodată aruncă), iar
 * sitemap.ts decide fallback-ul static.
 */
export const getAllProductSlugs = cache(async (): Promise<ProductSlugEntry[]> => {
  try {
    const db = getServerFirestore();
    const snap = await getDocs(collection(db, 'products'));
    const seen = new Set<string>();
    const result: ProductSlugEntry[] = [];

    snap.forEach((doc) => {
      const data = doc.data() as Record<string, unknown>;
      const slug = typeof data.slug === 'string' ? data.slug.trim() : '';
      const norm = normalizeSlug(slug);
      if (!slug || seen.has(norm)) return;
      seen.add(norm);
      result.push({
        slug: norm,
        lastModified: toDate(data.updatedAt) ?? toDate(data.createdAt),
      });
    });

    return result;
  } catch (error) {
    console.error('[seo] getAllProductSlugs fetch failed:', error);
    return [];
  }
});

// ---------------------------------------------------------------------------
// Date complete (server) pentru randarea HTML-ului: /produse, homepage, pagina
// de produs si "Produse similare". Obiecte serializabile (Timestamp -> ISO).
// ---------------------------------------------------------------------------

function serialize(val: unknown): unknown {
  if (val === null || val === undefined) return val;
  if (Array.isArray(val)) return val.map(serialize);
  if (typeof val === 'object') {
    const v = val as { toMillis?: () => number; seconds?: number };
    if (typeof v.toMillis === 'function') {
      const ms = v.toMillis();
      return Number.isFinite(ms) ? new Date(ms).toISOString() : undefined;
    }
    if (typeof v.seconds === 'number' && Object.keys(val).length <= 2) {
      return new Date(v.seconds * 1000).toISOString();
    }
    const out: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(val as Record<string, unknown>)) {
      const s = serialize(x);
      if (s !== undefined) out[k] = s;
    }
    return out;
  }
  return val;
}

function docToProduct(id: string, data: Record<string, unknown>): Product {
  return { ...(serialize(data) as object), id } as Product;
}

/** Toate produsele, ordonate dupa createdAt asc (ca useProducts). Eroare -> []. */
export const getAllProducts = cache(async (): Promise<Product[]> => {
  try {
    const db = getServerFirestore();
    const snap = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'asc')));
    return snap.docs
      .map((d) => docToProduct(d.id, d.data() as Record<string, unknown>))
      .filter((p) => typeof p.slug === 'string' && p.slug && typeof p.name === 'string');
  } catch (error) {
    console.error('[seo] getAllProducts fetch failed:', error);
    return [];
  }
});

/** Produsul complet dupa slug (pentru pagina de produs). Lipsa/eroare -> null. */
export const getFullProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const direct = await fetchFullProduct(slug);
  if (direct) return direct;
  const alias = aliasSlug(slug);
  return alias ? fetchFullProduct(alias) : null;
});

async function fetchFullProduct(slug: string): Promise<Product | null> {
  try {
    const db = getServerFirestore();
    const snap = await getDocs(query(collection(db, 'products'), where('slug', '==', slug), limit(1)));
    if (snap.empty) return null;
    return docToProduct(snap.docs[0].id, snap.docs[0].data() as Record<string, unknown>);
  } catch (error) {
    console.error(`[seo] getFullProductBySlug failed for "${slug}":`, error);
    return null;
  }
}

/** Produse similare: aceeasi categorie intai, apoi completare cu restul. */
export async function getRelatedProducts(product: Pick<Product, 'id' | 'slug' | 'category'>, max = 4): Promise<Product[]> {
  const all = await getAllProducts();
  const others = all.filter((p) => normalizeSlug(p.slug) !== normalizeSlug(product.slug));
  const same = others.filter((p) => p.category === product.category);
  const rest = others.filter((p) => p.category !== product.category);
  return [...same, ...rest].slice(0, max);
}

/**
 * Produsele "featured" pentru homepage, in aceeasi ordine ca interogarea client
 * (isFeatured == true, limit 10, ordine implicita), primele 3. createdAt se
 * elimina intentionat: sortarea client pe createdAt nu poate parsa Timestamp-uri,
 * deci ordinea ramane cea a interogarii; asa serverul si clientul aleg aceleasi 3.
 */
export const getFeaturedProducts = cache(async (): Promise<Product[]> => {
  try {
    const db = getServerFirestore();
    const snap = await getDocs(query(collection(db, 'products'), where('isFeatured', '==', true), limit(10)));
    return snap.docs.slice(0, 3).map((d) => {
      const p = docToProduct(d.id, d.data() as Record<string, unknown>);
      return { ...p, createdAt: '', updatedAt: '' };
    });
  } catch (error) {
    console.error('[seo] getFeaturedProducts failed:', error);
    return [];
  }
});
