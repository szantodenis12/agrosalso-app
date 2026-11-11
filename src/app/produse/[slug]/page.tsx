import { notFound } from 'next/navigation';
import { getFullProductBySlug, getRelatedProducts } from '@/lib/seo/product-data';
import ProductView from './ProductView';

// ISR: produsul (si "Produse similare") se randeaza pe server, deci H1, descrierea si
// linkurile sunt in HTML. Black Friday se evalueaza in continuare pe client (hook-uri).
export const revalidate = 300;

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getFullProductBySlug(slug);
  if (!product) notFound();
  const relatedProducts = await getRelatedProducts(product, 4);
  return <ProductView product={product} relatedProducts={relatedProducts} />;
}
