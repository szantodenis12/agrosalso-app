import type { MetadataRoute } from 'next';
import { getAllProductSlugs } from '@/lib/seo/product-data';
import { NOUTATI } from '@/content/noutati';

// Generează https://agrosalso.ro/sitemap.xml
//
// Paginile de produs sunt citite din Firestore (colecția `products`, câmpul
// `slug`) prin getAllProductSlugs() din src/lib/seo/product-data.ts — același
// fetch server-safe (SDK modular "firebase/firestore", fără firebase-admin)
// folosit la metadata paginilor de produs. Dacă fetch-ul eșuează sau
// întoarce o listă goală, se folosește PRODUSE_FALLBACK (instantaneu manual,
// 52 de produse live la 06.10.2026) ca să nu rămână sitemap-ul gol.
//
// revalidate: ruta e regenerată cel mult o dată pe oră, ca un build de
// producție să nu înghețe sitemap-ul cu lista de produse de la momentul
// build-ului.
//
// /servicii, /dealer-autorizat-dexwal și /noutati sunt rute statice din site;
// intrările /noutati/{slug} se generează din content/noutati.ts (NOUTATI),
// ca o noutate nouă să intre automat în sitemap.

export const revalidate = 3600;

const BASE = 'https://agrosalso.ro';

const PRODUSE_FALLBACK = [
  'terradisc-mamut',
  'terradisc-zuk',
  'terradisc-tur',
  'terradisc-greu-hidraulic',
  'terradisc-greu-tractat',
  'terradisc-greu-cadru-fix',
  'combinator-k',
  'combinator-tk',
  'combinator-zubr',
  'combinator-lion',
  'gruber-dzik',
  'gruber-grunt',
  'gruber-grunt-organe-tip-lemken',
  'gruber-spring',
  'gruber-kbo',
  'frez-tfl',
  'frez-tf',
  'tocator-uml',
  'tocator-um',
  'tocator-umlb-cu-brat',
  'tocator-umb-profesional',
  'plantator-universal-automat',
  'masina-de-plantat-cartofi',
  'masina-de-recoltat-cartofi',
  'distribuitor-de-ingrasaminte-tornado-duo',
  'tavalug-neted',
  'plug-reversibil',
  'scarificator',
  'scarificator-cadru-greu',
  'scarificator-raptor',
  'distribuitor-ngrminte-1-disc-rg',
  'distribuitor-ngrminte-2-discuri-rg',
  'distribuitor-tajfun-tj600-tj1200-1-disc-var-i-ngrminte',
  'distribuitor-tajfun-600s-1200s-1-disc-livad',
  'distribuitor-dexwal-funnel-l200l500-1-disc-tip-plnie',
  'distribuitor-funnel-l200sl500s-1-disc-livad',
  'distribuitor-ingrasaminte-porumb',
  'bomet-semntoare-pioase-s004',
  'semntoare-zefir',
  'freza-rotativa-bomet',
  'scarifactor-piorun-junior',
  'sacrificator-piorun',
  'erbicidator-purtat-triplo',
  'erbicidator-purtat-hektor',
  'gruber-agile',
  'combinator-hidraulic-nietoperek',
  'gruber-kboh-helagro',
  'gruber-kbw-helagro',
  'gruber-kbo-helagro',
  'scarificator-cizel-pd-helagro',
  'erbicidator-purtat-klara',
  'erbicidator-purtat-xsara-tolmet',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pagini: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/produse`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/despre`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/contact`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/servicii`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/dealer-autorizat-dexwal`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/noutati`, changeFrequency: 'weekly', priority: 0.7 },
  ];

  const noutati: MetadataRoute.Sitemap = NOUTATI.map(({ slug, date }) => ({
    url: `${BASE}/noutati/${slug}`,
    lastModified: date,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const fetched = await getAllProductSlugs();

  const produse: MetadataRoute.Sitemap =
    fetched.length > 0
      ? fetched.map(({ slug, lastModified }) => ({
          url: `${BASE}/produse/${slug}`,
          changeFrequency: 'monthly',
          priority: 0.8,
          ...(lastModified ? { lastModified } : {}),
        }))
      : PRODUSE_FALLBACK.map((slug) => ({
          url: `${BASE}/produse/${slug}`,
          changeFrequency: 'monthly',
          priority: 0.8,
        }));

  return [...pagini, ...noutati, ...produse];
}
