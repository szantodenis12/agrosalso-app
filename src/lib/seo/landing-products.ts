import type { Product } from '@/types';
import { normalizeSlug } from '@/lib/slug-redirects';

/**
 * Produsele dintr-o lista de sluguri de referinta (content/categorii.ts /
 * content/marci.ts), in ordinea listei. Compara slug-urile normalizate (vechi
 * si nou), deci functioneaza si inainte, si dupa migrarea slug-urilor din Firestore.
 */
export function pickProductsBySlugs(all: Product[], slugs: string[]): Product[] {
  const byNorm = new Map<string, Product>();
  for (const p of all) byNorm.set(normalizeSlug(p.slug), p);
  const out: Product[] = [];
  const seen = new Set<string>();
  for (const s of slugs) {
    const n = normalizeSlug(s);
    const p = byNorm.get(n);
    if (p && !seen.has(n)) {
      seen.add(n);
      out.push(p);
    }
  }
  return out;
}
