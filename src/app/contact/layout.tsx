import type { Metadata } from 'next';
import { META } from '@/lib/seo/metadata';

export const metadata: Metadata = META.contact;

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
