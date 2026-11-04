// Black Friday 2026 - SINGLE source of truth for the promotion.
//
// PERIOADA OFERTEI se schimbă DOAR aici (START / END), cu offset-ul Europe/Bucharest.
// Iarna (după 25.10.2026) România e pe UTC+2, deci +02:00.
// Perioada confirmată de client: toată luna noiembrie 2026 (1-30 noiembrie).
//
// Comportament (3 faze, toate pe dată):
//   - upcoming (de la deploy până la START): secțiunea BF pe homepage ca teaser
//     ("Oferta începe pe ..."), fără prețuri BF pe paginile de produs / JSON-LD
//   - active (START-END): secțiunea BF ("Oferta e valabilă până pe ...") + prețuri BF
//     pe paginile TURAN / GRUNT + JSON-LD
//   - ended (după END): secțiunea dispare, paginile de produs revin la normal
//   AFIR (OferteCurente) nu se mai randează în nicio fază.
//
// Preview local: în `next dev` faza e FORȚATĂ 'active'. NEXT_PUBLIC_BF_PREVIEW poate fi
// 'upcoming' | 'active' | 'ended' | 'off' (off = logica reală pe dată). Pe homepage, doar
// în dev, merge și ?bfphase=upcoming|active|ended în URL (fără restart). În producție
// decide doar data.

export const BLACK_FRIDAY_START = '2026-11-01T00:00:00+02:00';
export const BLACK_FRIDAY_END = '2026-11-30T23:59:59+02:00';

/** Data de final (YYYY-MM-DD, ora României) pentru JSON-LD priceValidUntil. */
export const BLACK_FRIDAY_END_DATE = BLACK_FRIDAY_END.slice(0, 10);

export const BLACK_FRIDAY_TIMEZONE = 'Europe/Bucharest';

export const BF_WHATSAPP_NUMBER = '40761927076';
export const BF_PHONE_DISPLAY = '0742 936 959';
export const BF_PHONE_HREF = 'tel:+40742936959';

export type BfProductId = 'leko' | 'turan' | 'grunt';

export interface BfProduct {
  id: BfProductId;
  /** Nume de brand/model (rămâne la fel în toate limbile). */
  name: string;
  /** Slug-ul paginii de produs; lipsă = fără pagină (LEKO -> WhatsApp). */
  slug?: string;
  /**
   * replace: prețul BF înlocuiește prețul de pe pagină (TURAN);
   * variant: bloc separat sub prețul de bază, care NU se schimbă (GRUNT cu tăvălug).
   */
  priceMode: 'replace' | 'variant' | 'none';
  /** Euro, fără TVA. */
  oldPrice: number;
  newPrice: number;
  /** Procent reducere afișat (rotunjit). */
  discount: number;
  image: string;
  imageAlt: string;
  /** Linia de specificații (RO, din pachet). Traducerile sunt în blackFridayContent.ts. */
  spec: string;
}

export const BF_PRODUCTS: BfProduct[] = [
  {
    id: 'leko',
    name: 'Scarificator LEKO',
    priceMode: 'none',
    oldPrice: 5500,
    newPrice: 4200,
    discount: 24,
    image: '/images/black-friday/bf-leko.webp',
    imageAlt: 'Scarificator LEKO',
    spec: 'Cadru greu 160×160 · 60 cm · 5 ancore · 150 CP',
  },
  {
    id: 'turan',
    name: 'Plug reversibil TURAN',
    slug: 'plug-reversibil',
    priceMode: 'replace',
    oldPrice: 8500,
    newPrice: 6500,
    discount: 24,
    image: '/images/black-friday/bf-turan.webp',
    imageAlt: 'Plug reversibil TURAN',
    spec: 'Reversare hidraulică · cadru din oțel tratat termic',
  },
  {
    id: 'grunt',
    name: 'Gruber DEXWAL GRUNT cu tăvălug',
    slug: 'gruber-grunt',
    priceMode: 'variant',
    oldPrice: 5000,
    newPrice: 3650,
    discount: 27,
    image: '/images/black-friday/bf-grunt.webp',
    imageAlt: 'Gruber DEXWAL GRUNT cu tăvălug',
    spec: 'Organe labă de gâscă pe 2 rânduri · cadru 80×80 mm',
  },
];

export function getBfProductBySlug(slug: string): BfProduct | undefined {
  return BF_PRODUCTS.find((p) => p.slug === slug);
}

export type BlackFridayPhase = 'upcoming' | 'active' | 'ended';

function previewPhase(): BlackFridayPhase | null {
  if (process.env.NODE_ENV !== 'development') return null;
  const v = process.env.NEXT_PUBLIC_BF_PREVIEW;
  if (v === 'off') return null;
  if (v === 'upcoming' || v === 'active' || v === 'ended') return v;
  return 'active';
}

export function getBlackFridayPhase(now: Date = new Date()): BlackFridayPhase {
  const forced = previewPhase();
  if (forced) return forced;
  const t = now.getTime();
  if (t < new Date(BLACK_FRIDAY_START).getTime()) return 'upcoming';
  if (t <= new Date(BLACK_FRIDAY_END).getTime()) return 'active';
  return 'ended';
}

/** Oferta e în vigoare (prețuri BF pe pagini de produs + JSON-LD). */
export function isBlackFridayActive(now: Date = new Date()): boolean {
  return getBlackFridayPhase(now) === 'active';
}

/** Secțiunea de homepage se arată în fazele upcoming și active. */
export function isBlackFridaySectionVisible(now: Date = new Date()): boolean {
  return getBlackFridayPhase(now) !== 'ended';
}

/** "1 000" style RO thousands: 6500 -> "6.500". Deterministic (no ICU dependency). */
export function formatEuro(n: number): string {
  return `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} €`;
}

const DATE_LOCALES: Record<string, string> = {
  ro: 'ro-RO',
  en: 'en-GB',
  hu: 'hu-HU',
  it: 'it-IT',
  de: 'de-DE',
  es: 'es-ES',
};

/** Data de final, formatată per limbă (ex. RO "30 noiembrie 2026"). */
export function formatBfEndDate(lang: string): string {
  return formatBfDate(lang, BLACK_FRIDAY_END);
}

/** Data de start, formatată per limbă (ex. RO "24 noiembrie 2026"). */
export function formatBfStartDate(lang: string): string {
  return formatBfDate(lang, BLACK_FRIDAY_START);
}

function formatBfDate(lang: string, iso: string): string {
  return new Intl.DateTimeFormat(DATE_LOCALES[lang] ?? 'ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: BLACK_FRIDAY_TIMEZONE,
  }).format(new Date(iso));
}
