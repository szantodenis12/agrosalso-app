// Folosire: pe paginile de produs, lângă ProductJsonLd.

export interface TraseuBreadcrumb {
  nume: string;
  url: string;
}

export default function BreadcrumbJsonLd({ trasee }: { trasee: TraseuBreadcrumb[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trasee.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.nume,
      item: `https://agrosalso.ro${t.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
