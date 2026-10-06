import { cache } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';
import { PRODUCT_CATEGORIES } from '@/lib/constants';

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
}

export const getProductBySlugForSeo = cache(async (slug: string): Promise<SeoProduct | null> => {
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
      slug: typeof data.slug === 'string' ? data.slug : slug,
      brand: typeof data.brand === 'string' ? data.brand : '',
      category: typeof data.category === 'string' ? data.category : '',
      price: typeof data.price === 'number' ? data.price : undefined,
      priceOnRequest: data.priceOnRequest === true,
      currency: typeof data.currency === 'string' ? data.currency : 'EUR',
      mainImage: typeof data.mainImage === 'string' ? data.mainImage : undefined,
      inStock: data.inStock !== false,
    };
  } catch (error) {
    console.error(`[seo] product-data fetch failed for slug "${slug}":`, error);
    return null;
  }
});

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
      if (!slug || seen.has(slug)) return;
      seen.add(slug);
      result.push({
        slug,
        lastModified: toDate(data.updatedAt) ?? toDate(data.createdAt),
      });
    });

    return result;
  } catch (error) {
    console.error('[seo] getAllProductSlugs fetch failed:', error);
    return [];
  }
});
