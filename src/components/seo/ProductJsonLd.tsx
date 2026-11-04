// Folosire: în componenta server a rutei de produs (app/produse/[slug]/layout.tsx),
// cu datele din aceeași sursă din care se randează pagina.
//
// ATENȚIE la producători în date: Spring NU e marcă (gruberul SPRING e model
// Strumyk), RODA NU e marcă (Bruno/Bruno X/Borys = Tolmet, TRIPLO = Strumyk).
// Corecția se face la sursa datelor (Firestore), nu aici.

export interface ProductJsonLdProps {
  nume: string;
  producator: string;
  categorie: string;
  slug: string;
  imagine?: string;
  pret?: number | string;
  moneda?: string;
  inStoc?: boolean;
  /** Valabilitate (YYYY-MM-DD) pentru oferta de bază, când prețul e unul promoțional. */
  valabilPanaLa?: string;
  /** Variante promoționale separate (ex. GRUNT cu tăvălug), emise ca Offer suplimentar. */
  variante?: { nume: string; pret: number; valabilPanaLa: string }[];
}

export default function ProductJsonLd({
  nume,
  producator,
  categorie,
  slug,
  imagine,
  pret,
  moneda = 'EUR',
  inStoc = true,
  valabilPanaLa,
  variante,
}: ProductJsonLdProps) {
  const availability = inStoc
    ? 'https://schema.org/InStock'
    : 'https://schema.org/OutOfStock';
  const seller = { '@type': 'Organization', name: 'Agro Salso' };
  const offers: Record<string, unknown>[] = [];
  if (pret) {
    offers.push({
      '@type': 'Offer',
      price: String(pret),
      priceCurrency: moneda,
      ...(valabilPanaLa ? { priceValidUntil: valabilPanaLa } : {}),
      availability,
      seller,
    });
  }
  for (const v of variante ?? []) {
    offers.push({
      '@type': 'Offer',
      name: v.nume,
      price: String(v.pret),
      priceCurrency: moneda,
      priceValidUntil: v.valabilPanaLa,
      availability,
      seller,
    });
  }

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: nume,
    brand: { '@type': 'Brand', name: producator },
    category: categorie,
    ...(imagine ? { image: imagine } : {}),
    url: `https://agrosalso.ro/produse/${slug}`,
    ...(offers.length ? { offers: offers.length === 1 ? offers[0] : offers } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
