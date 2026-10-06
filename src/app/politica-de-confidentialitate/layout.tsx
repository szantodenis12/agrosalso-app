import type { Metadata } from 'next';
import { META } from '@/lib/seo/metadata';

export const metadata: Metadata = META.politicaDeConfidentialitate;

export default function PoliticaDeConfidentialitateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
