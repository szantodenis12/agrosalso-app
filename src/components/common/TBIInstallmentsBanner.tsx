'use client';

import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

interface TBIInstallmentsBannerProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export function TBIInstallmentsBanner({ variant = 'full', className = '' }: TBIInstallmentsBannerProps) {
  const { lang } = useLanguage();
  const isRo = lang === 'ro';

  const options = isRo
    ? ['TBI Credit', 'UniCredit', 'Rate sezoniere']
    : ['TBI Credit', 'UniCredit', 'Seasonal installments'];

  const description = isRo
    ? 'Modernizează-ți ferma fără efort financiar major. Alege finanțare rapidă și transparentă prin partenerii noștri sau optează pentru rate sezoniere, adaptate activității fermei tale.'
    : 'Modernize your farm without tying up capital. Choose fast, transparent financing through our partners, or opt for seasonal installments adapted to your farm’s activity.';

  const compactTitle = isRo
    ? 'Utilaje agricole în rate'
    : 'Farm equipment in installments';

  const compactDescription = isRo
    ? 'Poți achiziționa acest utilaj prin TBI Credit, UniCredit sau rate sezoniere, adaptate activității fermei tale.'
    : 'You can purchase this equipment through TBI Credit, UniCredit or seasonal installments adapted to your farm’s activity.';

  const partnersLabel = isRo ? 'Parteneri de finanțare' : 'Financing partners';

  // The two source files are not equally "tight" crops: logo_tbi_Rectangle.webp
  // is a 600x300 canvas whose visible mark+text only fills ~205px of that
  // height (~68%), while logo_unicredit.svg's wordmark fills its box edge to
  // edge. Sizing both <img> boxes to the same CSS height therefore makes the
  // UniCredit wordmark read as much bolder/heavier. To balance them visually,
  // TBI gets a taller box (to compensate for its internal padding) and
  // UniCredit gets a shorter one, so the actual ink heights end up similar.
  const Logos = ({
    tbiHeight = 'h-12 md:h-14',
    unicreditHeight = 'h-7 md:h-[34px]',
    dividerHeight = 'h-9 md:h-11',
  }: { tbiHeight?: string; unicreditHeight?: string; dividerHeight?: string }) => (
    <div className="flex items-center gap-3 md:gap-4">
      <a
        href="https://tbibank.ro"
        target="_blank"
        rel="noopener noreferrer"
        title="Vizitează tbibank.ro"
        className="inline-flex items-center transition-opacity duration-300 hover:opacity-80 cursor-pointer"
      >
        <Image
          src="/logo_tbi_Rectangle.webp"
          alt="TBI Credit"
          width={240}
          height={80}
          className={`${tbiHeight} w-auto object-contain`}
        />
      </a>
      <div className={`w-px ${dividerHeight} bg-neutral-200`} aria-hidden="true" />
      <a
        href="https://www.unicredit.ro"
        target="_blank"
        rel="noopener noreferrer"
        title="Vizitează unicredit.ro"
        className="inline-flex items-center transition-opacity duration-300 hover:opacity-80 cursor-pointer"
      >
        <Image
          src="/logo_unicredit.svg"
          alt="UniCredit"
          width={175}
          height={35}
          unoptimized
          className={`${unicreditHeight} w-auto object-contain`}
        />
      </a>
    </div>
  );

  if (variant === 'compact') {
    return (
      <div className={`bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 text-neutral-900 border border-neutral-100 shadow-xl space-y-5 ${className}`}>
        <div className="space-y-1.5">
          <h4 className="font-headline font-extrabold text-base md:text-lg text-neutral-900 tracking-tight leading-snug">
            {compactTitle}
          </h4>
          <p className="text-neutral-500 text-xs font-body leading-relaxed">
            {compactDescription}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {options.map((opt) => (
            <span
              key={opt}
              className="inline-flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 rounded-full px-3 py-1.5 text-[11px] font-headline font-bold text-neutral-700"
            >
              <span className="w-1 h-1 rounded-full bg-accent-lime" />
              {opt}
            </span>
          ))}
        </div>

        <div className="pt-1 border-t border-neutral-100">
          <div className="pt-4">
            <Logos tbiHeight="h-7 md:h-8" unicreditHeight="h-4 md:h-5" dividerHeight="h-5 md:h-6" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className={`py-16 md:py-24 px-6 md:px-14 bg-neutral-50 border-y border-neutral-200/60 ${className}`}>
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] gap-10 lg:gap-16 items-center">
        <div className="space-y-5 md:space-y-6 max-w-2xl">
          <h2 className="font-headline font-extrabold text-3xl md:text-5xl text-neutral-900 tracking-tight leading-[1.1]">
            {isRo ? (
              <>
                Utilaje agricole <span className="text-accent-lime">în rate</span>
              </>
            ) : (
              <>
                Farm equipment <span className="text-accent-lime">in installments</span>
              </>
            )}
          </h2>

          <p className="text-neutral-600 text-base md:text-lg font-body leading-relaxed">
            {description}
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            {options.map((opt) => (
              <div
                key={opt}
                className="inline-flex items-center gap-2 bg-white border border-neutral-200 rounded-full px-4 py-2.5 md:px-5 md:py-3 shadow-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent-lime shrink-0" />
                <span className="font-headline font-bold text-sm md:text-base text-neutral-900 whitespace-nowrap">
                  {opt}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start lg:items-end gap-3 lg:border-l lg:border-neutral-200/60 lg:pl-10">
          <span className="text-neutral-400 text-[10px] md:text-xs font-body uppercase tracking-widest">
            {partnersLabel}
          </span>
          <Logos />
        </div>
      </div>
    </section>
  );
}
