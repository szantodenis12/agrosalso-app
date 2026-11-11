import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CATEGORII } from '@/content/categorii';
import { MARCI } from '@/content/marci';
import { normalizeSlug } from '@/lib/slug-redirects';
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
  params: Promise<{ categorie: string }>;
}

export function generateStaticParams() {
  return CATEGORII.map((c) => ({ categorie: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorie } = await params;
  const cat = CATEGORII.find((c) => c.slug === categorie);
  if (!cat) return {};
  return landingMetadata({ title: cat.title, description: cat.metaDescription, path: `/utilaje/${cat.slug}` });
}

export default async function CategoriePage({ params }: Props) {
  const { categorie } = await params;
  const cat = CATEGORII.find((c) => c.slug === categorie);
  if (!cat) notFound();

  const produse = pickProductsBySlugs(await getAllProducts(), cat.produseSlugs);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: cat.faq.map((f) => ({
      '@type': 'Question',
      name: f.intrebare,
      acceptedAnswer: { '@type': 'Answer', text: f.raspuns },
    })),
  };
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: cat.nume,
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
          { nume: cat.nume, url: `/utilaje/${cat.slug}` },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {produse.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      )}

      <LandingHero label="Utilaje agricole" title={cat.nume} />
      <LandingBreadcrumb items={[{ nume: 'Acasă', url: '/' }, { nume: 'Produse', url: '/produse' }, { nume: cat.nume }]} />

      <LandingBody>
        <LandingProse paragraphs={cat.paragrafe} />
        <LandingProducts title={`${cat.nume} disponibile`} products={produse} />

        <section className="mt-14 md:mt-20">
          <h2 className="font-headline font-extrabold text-2xl md:text-4xl text-neutral-900 tracking-tight mb-8">
            Întrebări frecvente
          </h2>
          <div className="space-y-4 max-w-3xl">
            {cat.faq.map((f) => (
              <details key={f.intrebare} className="bg-white p-6 rounded-[1.5rem] border border-neutral-100">
                <summary className="font-headline font-bold text-lg text-neutral-900 cursor-pointer">{f.intrebare}</summary>
                <p className="text-neutral-500 font-medium text-sm md:text-base leading-relaxed mt-4">{f.raspuns}</p>
              </details>
            ))}
          </div>
        </section>

        <LandingLinkChips
          title="Alte categorii de utilaje"
          links={CATEGORII.filter((c) => c.slug !== cat.slug).map((c) => ({ href: `/utilaje/${c.slug}`, label: c.nume }))}
        />
        <LandingLinkChips
          title="Mărci"
          links={[
            { href: '/dealer-autorizat-dexwal', label: 'Dexwal' },
            ...MARCI.map((m) => ({ href: `/marci/${m.slug}`, label: m.nume })),
          ]}
        />

        <LandingCta />
      </LandingBody>
    </LandingPage>
  );
}
