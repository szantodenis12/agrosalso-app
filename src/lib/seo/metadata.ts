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
}

export function productMetadata(p: ProdusMeta): Metadata {
  return {
    title: { absolute: `${p.nume} — ${p.categorie} ${p.producator} | Agro Salso` },
    description: `${p.nume}, ${p.categorie.toLowerCase()} de la ${p.producator}.${
      p.pret ? ` Preț ${p.pret},` : ''
    } specificații complete și disponibilitate pe pagină.`,
    alternates: { canonical: `/produse/${p.slug}` },
  };
}
