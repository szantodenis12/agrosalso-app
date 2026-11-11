import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MARCI } from '@/content/marci';
import { normalizeSlug } from '@/lib/slug-redirects';
import { CATEGORII } from '@/content/categorii';
import { getAllProducts } from '@/lib/seo/product-data';
import { landingMetadata } from '@/lib/seo/metadata';
import { pickProductsBySlugs } from '@/lib/seo/landing-products';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import {
  LandingPage, LandingHero, LandingBreadcrumb, LandingBody, LandingProse,
  LandingProducts, LandingLinkChips, LandingCta,
} from '@/components/landing/LandingShell';

export const revalidate = 300;

interface Props {
  params: Promise<{ marca: string }>;
}

export function generateStaticParams() {
  return MARCI.map((m) => ({ marca: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { marca } = await params;
  const m = MARCI.find((x) => x.slug === marca);
  if (!m) return {};
  return landingMetadata({ title: m.title, description: m.metaDescription, path: `/marci/${m.slug}` });
}

export default async function MarcaPage({ params }: Props) {
  const { marca } = await params;
  const m = MARCI.find((x) => x.slug === marca);
  if (!m) notFound();

  const produse = pickProductsBySlugs(await getAllProducts(), m.produseSlugs);
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Utilaje ${m.nume}`,
    itemListElement: produse.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://agrosalso.ro/produse/${normalizeSlug(p.slug)}`,
      name: p.name,
    })),
  };

  return (
    <LandingPage>
      <BreadcrumbJsonLd
        trasee={[
          { nume: 'Acasă', url: '/' },
          { nume: 'Produse', url: '/produse' },
          { nume: m.nume, url: `/marci/${m.slug}` },
        ]}
      />
      {produse.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      )}

      <LandingHero label="Mărci" title={`Utilaje ${m.nume} în România`} />
      <LandingBreadcrumb items={[{ nume: 'Acasă', url: '/' }, { nume: 'Produse', url: '/produse' }, { nume: m.nume }]} />

      <LandingBody>
        <LandingProse paragraphs={m.paragrafe} />
        <LandingProducts title={`Produse ${m.nume}`} products={produse} />
        <LandingLinkChips
          title="Categorii de utilaje"
          links={CATEGORII.map((c) => ({ href: `/utilaje/${c.slug}`, label: c.nume }))}
        />
        <LandingLinkChips
          title="Alte mărci"
          links={[
            { href: '/dealer-autorizat-dexwal', label: 'Dexwal' },
            ...MARCI.filter((x) => x.slug !== m.slug).map((x) => ({ href: `/marci/${x.slug}`, label: x.nume })),
          ]}
        />
        <LandingCta />
      </LandingBody>
    </LandingPage>
  );
}
