import type { Metadata } from 'next';
import { META, productMetadata } from '@/lib/seo/metadata';
import { getProductBySlugForSeo, categoryLabel } from '@/lib/seo/product-data';
import ProductJsonLd from '@/components/seo/ProductJsonLd';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

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

  if (!product) {
    // Fallback: metadata generică de catalog, nu text inventat.
    return { ...META.produse, alternates: { canonical: `/produse/${slug}` } };
  }

  return productMetadata({
    nume: product.name,
    categorie: categoryLabel(product.category) ?? product.category,
    producator: product.brand,
    slug: product.slug,
    pret: priceLabel(product),
  });
}

export default async function ProductLayout({ params, children }: ProductLayoutProps) {
  const { slug } = await params;
  const product = await getProductBySlugForSeo(slug);

  if (!product) {
    return <>{children}</>;
  }

  const categorie = categoryLabel(product.category) ?? product.category;

  return (
    <>
      <ProductJsonLd
        nume={product.name}
        producator={product.brand}
        categorie={categorie}
        slug={product.slug}
        imagine={product.mainImage}
        pret={product.priceOnRequest ? undefined : product.price}
        moneda={product.currency}
        inStoc={product.inStock}
      />
      <BreadcrumbJsonLd
        trasee={[
          { nume: 'Acasă', url: '/' },
          { nume: 'Produse', url: '/produse' },
          { nume: product.name, url: `/produse/${product.slug}` },
        ]}
      />
      {children}
    </>
  );
}
