'use client';

// Mici componente client pentru textele de interfață ("chrome") ale paginilor
// /noutati, localizate cu hook-ul de limbă existent al site-ului. Conținutul
// articolelor (randat din content/noutati.ts, direct în componentele server)
// NU trece prin acest fișier — rămâne verbatim în română.

import { useLanguage } from '@/context/LanguageContext';
import { noutatiDict, noutatiLocaleMap, type NoutatiDictEntry } from './dictionary';

export function ChromeText({ k }: { k: keyof NoutatiDictEntry }) {
  const { lang } = useLanguage();
  return <>{noutatiDict[lang][k]}</>;
}

export function ArticleDate({
  iso,
  className,
}: {
  iso: string;
  className?: string;
}) {
  const { lang } = useLanguage();
  const locale = noutatiLocaleMap[lang];
  const formatted = new Date(iso).toLocaleDateString(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  return (
    <time dateTime={iso} className={className}>
      {formatted}
    </time>
  );
}
