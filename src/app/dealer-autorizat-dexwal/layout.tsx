import type { Metadata } from 'next';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

// Title + description + canonical pentru /dealer-autorizat-dexwal, din
// pachetul SEO (app/dealer-autorizat-dexwal/page.tsx din pachet). `{ absolute }`
// ca să nu treacă prin template-ul `%s | Agro Salso` din layout-ul rădăcină.
export const metadata: Metadata = {
  title: { absolute: 'Dealer autorizat Dexwal în România — Agro Salso' },
  description:
    'Agro Salso este dealer autorizat Dexwal în România. Terradiscuri, combinatoare, grubere și distribuitoare de îngrășăminte Dexwal, cu 3 ani garanție și piese de schimb pe stoc.',
  alternates: { canonical: '/dealer-autorizat-dexwal' },
};

export default function DealerDexwalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        trasee={[
          { nume: 'Acasă', url: '/' },
          { nume: 'Dealer autorizat Dexwal', url: '/dealer-autorizat-dexwal' },
        ]}
      />
      {children}
    </>
  );
}
