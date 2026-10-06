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
}: ProductJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: nume,
    brand: { '@type': 'Brand', name: producator },
    category: categorie,
    ...(imagine ? { image: imagine } : {}),
    url: `https://agrosalso.ro/produse/${slug}`,
    ...(pret
      ? {
          offers: {
            '@type': 'Offer',
            price: String(pret),
            priceCurrency: moneda,
            availability: inStoc
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            seller: { '@type': 'Organization', name: 'Agro Salso' },
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
