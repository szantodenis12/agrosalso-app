import type { Metadata } from 'next';
import { META } from '@/lib/seo/metadata';

export const metadata: Metadata = META.produse;

export default function ProduseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
