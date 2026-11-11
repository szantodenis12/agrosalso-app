import { getAllProducts } from '@/lib/seo/product-data';
import ProduseClient from './ProduseClient';

// ISR: lista de produse se randeaza pe server (linkuri <a href="/produse/slug"> in HTML),
// clientul pastreaza filtrele/cautarea/sortarea si reimprospateaza live din Firestore.
export const revalidate = 300;

export default async function CatalogPage() {
  const initialProducts = await getAllProducts();
  return <ProduseClient initialProducts={initialProducts} />;
}
