import type { Metadata } from 'next';
import { META, productMetadata } from '@/lib/seo/metadata';
import { getProductBySlugForSeo, categoryLabel } from '@/lib/seo/product-data';
import ProductJsonLd from '@/components/seo/ProductJsonLd';
import { BLACK_FRIDAY_END_DATE, getBfProductBySlug, isBlackFridayActive, formatEuro } from '@/lib/promo/blackFriday';
import { normalizeSlug } from '@/lib/slug-redirects';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

// ISR: faza Black Friday se reevaluează pe server cel mult la 5 minute, ca metadata și
// JSON-LD să nu rămână înghețate la valorile din momentul build-ului / primului request.
export const revalidate = 300;

interface ProductLayoutProps {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

function priceLabel(product: { price?: number; priceOnRequest: boolean; currency: string }) {
  if (product.priceOnRequest || typeof product.price !== 'number') return undefined;
  return `${product.price.toLocaleString('ro-RO')} ${product.currency}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugForSeo(slug);
  const bf = isBlackFridayActive() ? getBfProductBySlug(normalizeSlug(slug)) : undefined;

  if (!product) {
    // Fallback: metadata generică de catalog, nu text inventat.
    return { ...META.produse, alternates: { canonical: `/produse/${normalizeSlug(slug)}` } };
  }

  return productMetadata({
    nume: product.name,
    categorie: categoryLabel(product.category) ?? product.category,
    producator: product.brand,
    slug: normalizeSlug(product.slug),
    pret: bf?.priceMode === 'replace' ? `${formatEuro(bf.newPrice)} + TVA` : priceLabel(product),
    bf: bf?.priceMode === 'replace',
    imagine: product.mainImage,
  });
}

export default async function ProductLayout({ params, children }: ProductLayoutProps) {
  const { slug } = await params;
  const product = await getProductBySlugForSeo(slug);

  if (!product) {
    return <>{children}</>;
  }

  const bf = isBlackFridayActive() ? getBfProductBySlug(normalizeSlug(product.slug)) : undefined;
  // TURAN: prețul BF înlocuiește prețul principal. GRUNT: prețul de bază rămâne oferta
  // principală, iar varianta cu tăvălug devine un Offer separat.
  const pretBf = bf?.priceMode === 'replace' ? bf.newPrice : undefined;
  const variante =
    bf?.priceMode === 'variant'
      ? [{ nume: bf.variantName ?? `${product.name} (Black Friday)`, pret: bf.newPrice, valabilPanaLa: BLACK_FRIDAY_END_DATE }]
      : undefined;

  const categorie = categoryLabel(product.category) ?? product.category;

  return (
    <>
      <ProductJsonLd
        nume={product.name}
        producator={product.brand}
        categorie={categorie}
        slug={normalizeSlug(product.slug)}
        imagine={product.mainImage}
        description={product.description}
        pret={pretBf ?? (product.priceOnRequest ? undefined : product.price)}
        valabilPanaLa={pretBf ? BLACK_FRIDAY_END_DATE : undefined}
        variante={variante}
        moneda={product.currency}
        inStoc={product.inStock}
      />
      <BreadcrumbJsonLd
        trasee={[
          { nume: 'Acasă', url: '/' },
          { nume: 'Produse', url: '/produse' },
          { nume: product.name, url: `/produse/${normalizeSlug(product.slug)}` },
        ]}
      />
      {children}
    </>
  );
}
