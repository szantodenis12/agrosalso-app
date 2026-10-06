import type { Metadata } from 'next';
import { META } from '@/lib/seo/metadata';

export const metadata: Metadata = META.termeniSiConditii;

export default function TermeniSiConditiiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
