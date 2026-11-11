// Slug-uri vechi (cu litere lipsă) -> slug-uri corecte. Redirecturi 301 active în next.config.ts; normalizeSlug e folosit în link-uri, sitemap și căutarea produselor.

export const SLUGURI_CORECTATE: Record<string, string> = {
  'semntoare-zefir': 'semanatoare-zefir',
  'bomet-semntoare-pioase-s004': 'bomet-semanatoare-paioase-s004',
  'frez-tf': 'freza-tf',
  'frez-tfl': 'freza-tfl',
  'distribuitor-ngrminte-1-disc-rg': 'distribuitor-ingrasaminte-1-disc-rg',
  'distribuitor-ngrminte-2-discuri-rg': 'distribuitor-ingrasaminte-2-discuri-rg',
  'distribuitor-tajfun-tj600-tj1200-1-disc-var-i-ngrminte':
    'distribuitor-tajfun-tj600-tj1200-1-disc-var-si-ingrasaminte',
  'sacrificator-piorun': 'scarificator-piorun',
  'scarifactor-piorun-junior': 'scarificator-piorun-junior',
  'distribuitor-dexwal-funnel-l200l500-1-disc-tip-plnie':
    'distribuitor-dexwal-funnel-l200-l500-1-disc-tip-palnie',
  'distribuitor-tajfun-600s-1200s-1-disc-livad': 'distribuitor-tajfun-600s-1200s-1-disc-livada',
  'distribuitor-funnel-l200sl500s-1-disc-livad': 'distribuitor-funnel-l200s-l500s-1-disc-livada',
  'tocator-umb-profesional': 'tocator-umb-profesionala',
};

/** Alias explicit pentru lookup: slug vechi -> slug nou. */
export const slugMap = SLUGURI_CORECTATE;

/** Slug canonic (nou). Slug-urile deja corecte / necunoscute rămân neschimbate. */
export function normalizeSlug(slug: string): string {
  return SLUGURI_CORECTATE[slug] ?? slug;
}

export const slugRedirects = Object.entries(SLUGURI_CORECTATE).map(([vechi, nou]) => ({
  source: `/produse/${vechi}`,
  destination: `/produse/${nou}`,
  permanent: true,
}));
