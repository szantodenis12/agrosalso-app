import { CATEGORII } from '@/content/categorii';
import { normalizeSlug } from '@/lib/slug-redirects';

/** Categoria de aterizare (/utilaje/{slug}) a unui produs, după slug normalizat; prima potrivire. */
export function getLandingCategoryForProduct(productSlug: string): { slug: string; name: string } | null {
  const s = normalizeSlug(productSlug);
  const c = CATEGORII.find((cat) => cat.produseSlugs.some((p) => normalizeSlug(p) === s));
  return c ? { slug: c.slug, name: c.nume } : null;
}
