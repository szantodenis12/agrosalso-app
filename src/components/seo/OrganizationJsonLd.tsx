// Folosire: o SINGURĂ dată pe site, în app/page.tsx (homepage), componentă server.

const data = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Agro Salso',
  legalName: 'AGRO SALSO SRL',
  description:
    'Dealer de utilaje agricole tractate și purtate și piese de schimb, în Bihor, din 2012.',
  url: 'https://agrosalso.ro/',
  email: 'contact@agrosalso.ro',
  telephone: '+40742936959',
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+40742936959',
      contactType: 'customer service',
      availableLanguage: 'Romanian',
    },
    {
      '@type': 'ContactPoint',
      telephone: '+40761927076',
      contactType: 'customer service',
      name: 'WhatsApp',
      availableLanguage: 'Romanian',
    },
  ],
  foundingDate: '2012-07-12',
  openingHours: 'Mo-Fr 08:00-17:00',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'DN79',
    addressLocality: 'Mădăras',
    postalCode: '417330',
    addressRegion: 'Bihor',
    addressCountry: 'RO',
  },
  sameAs: ['https://www.facebook.com/agrosalso'],
  brand: [
    'Dexwal',
    'Helagro',
    'Mega Metal',
    'Strumyk',
    'Tolmet',
    'Bomet',
    'BT',
    'Letak',
    'Turan',
    'Renal',
  ],
};

export default function OrganizationJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
