// Schema Article, randată server-side pe pagina unei noutăți (semnal de
// prospețime pentru motoarele AI, care citesc doar HTML-ul inițial).
// Folosire: app/noutati/[slug]/page.tsx, lângă BreadcrumbJsonLd.

export interface ArticleJsonLdProps {
  headline: string;
  description: string;
  datePublished: string;
  url: string;
}

export default function ArticleJsonLd({
  headline,
  description,
  datePublished,
  url,
}: ArticleJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    datePublished,
    dateModified: datePublished,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@type': 'Organization', name: 'Agro Salso' },
    publisher: {
      '@type': 'Organization',
      name: 'Agro Salso',
      url: 'https://agrosalso.ro/',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
