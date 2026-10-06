import type { Metadata } from 'next';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

// Title + description + canonical pentru /servicii, din pachetul SEO
// (app/servicii/page.tsx din pachet). `{ absolute }` ca să nu treacă prin
// template-ul `%s | Agro Salso` din layout-ul rădăcină — titlul de mai jos
// e deja final (conține deja „— Agro Salso”).
export const metadata: Metadata = {
  title: { absolute: 'Servicii — Agro Salso' },
  description:
    'Consultanță tehnică, utilaje agricole, piese de schimb, livrare în toată România, oferte conforme AFIR în maximum 24 de ore și soluții de finanțare.',
  alternates: { canonical: '/servicii' },
};

export default function ServiciiLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        trasee={[
          { nume: 'Acasă', url: '/' },
          { nume: 'Servicii', url: '/servicii' },
        ]}
      />
      {children}
    </>
  );
}
