import type { Metadata } from 'next';
import { META } from '@/lib/seo/metadata';

export const metadata: Metadata = META.despre;

export default function DespreLayout({ children }: { children: React.ReactNode }) {
  return children;
}
