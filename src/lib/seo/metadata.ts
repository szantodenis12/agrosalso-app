import type { Metadata } from 'next';

// Title + meta description + canonical pentru fiecare pagină, plus helper
// productMetadata() pentru paginile de produs.
//
// IMPORTANT: title, description și canonical trebuie să fie în HTML-ul servit
// de server (SSR). Motoarele AI (Perplexity, ChatGPT) nu execută JavaScript.

export const BASE_URL = 'https://agrosalso.ro';

// Titlurile sunt `{ absolute }` ca să nu treacă prin template-ul
// `%s | Agro Salso` din layout-ul rădăcină — textele de mai jos sunt deja
// titluri finale, complete (unele includ deja „Agro Salso"), iar template-ul
// le-ar dubla sufixul („... — Agro Salso | Agro Salso").
export const META = {
  home: {
    title: { absolute: 'Agro Salso — utilaje agricole în Bihor' },
    description:
      'Dealer de utilaje agricole în Bihor, din 2012. Grape cu discuri, grubere, combinatoare, semănători și piese de schimb. Prețuri afișate pe site.',
    alternates: { canonical: '/' },
  },
  produse: {
    title: { absolute: 'Catalog utilaje agricole cu prețuri — Agro Salso' },
    description:
      'Utilaje tractate și purtate, cu preț și specificații: grape cu discuri, grubere, freze, pluguri, semănători. Dexwal, Helagro, Strumyk, Tolmet, Bomet.',
    alternates: { canonical: '/produse' },
  },
  despre: {
    title: { absolute: 'Despre Agro Salso — dealer de utilaje agricole din 2012' },
    description:
      'Firmă din Bihor, înființată în 2012. Vindem și întreținem utilaje agricole tractate și purtate și livrăm piese de schimb.',
    alternates: { canonical: '/despre' },
  },
  contact: {
    title: { absolute: 'Contact Agro Salso — telefon, WhatsApp, adresă' },
    description:
      'Telefon 0742 936 959, WhatsApp 0761 927 076, program Luni–Vineri 08:00–17:00. Adresă: DN79, Mădăras, Bihor.',
    alternates: { canonical: '/contact' },
  },
  termeniSiConditii: {
    title: { absolute: 'Termeni și condiții — Agro Salso' },
    description:
      'Termenii și condițiile de utilizare a site-ului agrosalso.ro: comenzi, prețuri, livrare și garanție pentru utilajele agricole.',
    alternates: { canonical: '/termeni-si-conditii' },
  },
  politicaDeConfidentialitate: {
    title: { absolute: 'Politica de confidențialitate — Agro Salso' },
    description:
      'Politica de confidențialitate Agro Salso: ce date colectăm pe agrosalso.ro, cum le folosim și cum vă puteți exercita drepturile GDPR.',
    alternates: { canonical: '/politica-de-confidentialitate' },
  },
} satisfies Record<string, Metadata>;

export interface ProdusMeta {
  nume: string;
  categorie: string;
  producator: string;
  slug: string;
  /** Prețul afișat pe site, cu moneda — ex. „4.000 EUR". Lipsă = fără preț în description. */
  pret?: string;
  /** true = prețul e cel de Black Friday (descrierea își păstrează formularea proprie). */
  bf?: boolean;
  /** Imaginea principală a produsului, pentru openGraph.images. */
  imagine?: string;
}

const TITLE_SUFFIX = ' | Agro Salso';
const TITLE_MAX = 60;

/** Taie la limita de cuvânt, fără semne de punctuație rămase la capăt. */
function truncateWords(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max + 1);
  const at = cut.lastIndexOf(' ');
  const base = at > max * 0.5 ? cut.slice(0, at) : text.slice(0, max);
  return base.replace(/[\s,;:.\-–—/(]+$/, '');
}

/** Categoria „Altele" nu spune nimic în title/description. */
function usefulCategory(categorie: string): string {
  return /^altele$/i.test(categorie.trim()) ? '' : categorie.trim();
}

/** Title ≤ 60 caractere: scoate întâi categoria, păstrează producătorul și brandul. */
export function productTitle(p: Pick<ProdusMeta, 'nume' | 'categorie' | 'producator'>): string {
  const cat = usefulCategory(p.categorie);
  const candidates = [
    cat ? `${p.nume} — ${cat} ${p.producator}` : `${p.nume} — ${p.producator}`,
    `${p.nume} — ${p.producator}`,
    p.nume,
  ];
  for (const c of candidates) {
    const full = `${c}${TITLE_SUFFIX}`;
    if (full.length <= TITLE_MAX) return full;
  }
  return `${truncateWords(p.nume, TITLE_MAX - TITLE_SUFFIX.length)}${TITLE_SUFFIX}`;
}

export function productMetadata(p: ProdusMeta): Metadata {
  const cat = usefulCategory(p.categorie);
  const what = cat ? `${cat.toLowerCase()} de la ${p.producator}` : `utilaj agricol de la ${p.producator}`;
  const description = p.bf
    ? `${p.nume}, ${what}.${p.pret ? ` Preț ${p.pret},` : ''} specificații complete și disponibilitate pe pagină.`
    : p.pret
      ? `Preț de la ${p.pret}: ${p.nume}, ${what}. Specificații complete și disponibilitate pe pagină.`
      : `${p.nume}, ${what}. Specificații complete și disponibilitate pe pagină.`;
  const title = productTitle(p);
  const canonical = `/produse/${p.slug}`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      locale: 'ro_RO',
      siteName: 'Agro Salso',
      title,
      description,
      url: canonical,
      ...(p.imagine ? { images: [{ url: p.imagine, alt: p.nume }] } : {}),
    },
  };
}

/**
 * Metadata pentru paginile de aterizare SEO (/utilaje/*, /marci/*, /utilaje-agricole-bihor).
 * Titlul e `{ absolute }` (contine deja "Agro Salso", iar layout-ul radacina are
 * template `%s | Agro Salso`), cu canonical + openGraph.
 */
export function landingMetadata(p: { title: string; description: string; path: string }): Metadata {
  return {
    title: { absolute: p.title },
    description: p.description,
    alternates: { canonical: p.path },
    openGraph: {
      type: 'website',
      locale: 'ro_RO',
      siteName: 'Agro Salso',
      title: p.title,
      description: p.description,
      url: `${BASE_URL}${p.path}`,
    },
  };
}
