// Server component — renders the FAQPage JSON-LD for the homepage FAQ section.
// Kept separate from IntrebariFrecvente.tsx (a 'use client' component for the
// interactive, multi-language accordion) so the schema always lands in the
// server-rendered HTML regardless of hydration/client state.
//
// The data mirrors FAQ_RO exactly (the Romanian/default-language Q&A), per the
// package's requirement that the visible Q&A and the JSON-LD stay in sync.

import { FAQ_RO } from '@/components/home/homeAddonsContent';

const data = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_RO.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: f.answer,
    },
  })),
};

export default function FaqJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
