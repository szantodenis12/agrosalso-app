import { notFound } from 'next/navigation';
import { getAllProductSlugs, getFullProductBySlug, getRelatedProducts } from '@/lib/seo/product-data';
import ProductView from './ProductView';

// ISR: produsul (si "Produse similare") se randeaza pe server, deci H1, descrierea si
// linkurile sunt in HTML. Black Friday se evalueaza in continuare pe client (hook-uri).
export const revalidate = 300;
// Slug-urile necunoscute (produse noi) se genereaza la prima cerere si apoi se cacheaza.
export const dynamicParams = true;

export async function generateStaticParams() {
  const entries = await getAllProductSlugs();
  return entries.map((e) => ({ slug: e.slug }));
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getFullProductBySlug(slug);
  if (!product) notFound();
  const relatedProducts = await getRelatedProducts(product, 4);
  return <ProductView product={product} relatedProducts={relatedProducts} />;
}
