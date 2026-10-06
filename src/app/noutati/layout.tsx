import type { Metadata } from 'next';

// Metadata pentru /noutati (listare), conform pachetului SEO — title absolut
// ca să nu treacă prin template-ul `%s | Agro Salso` din layout-ul rădăcină.
export const metadata: Metadata = {
  title: { absolute: 'Noutăți — Agro Salso' },
  description:
    'Sesiuni de finanțare active, utilaje noi în catalog și anunțuri Agro Salso. Oferte conforme AFIR în maximum 24 de ore.',
  alternates: { canonical: '/noutati' },
};

export default function NoutatiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
