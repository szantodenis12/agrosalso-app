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

  const title = isRo
    ? 'Cumpără utilaje în rate prin TBI Bank'
    : 'Buy machinery in installments via TBI Bank';

  const description = isRo
    ? 'Modernizează-ți ferma fără efort financiar major. Împreună cu partenerul nostru TBI Bank, îți oferim soluții de finanțare rapide și transparente cu rate fixe personalizate nevoilor tale.'
    : 'Modernize your farm without tying up capital. In partnership with TBI Bank, we offer fast and transparent fixed-installment financing tailored to your needs.';

  const compactDescription = isRo
    ? 'Poți achiziționa acest utilaj în rate fixe prin partenerul nostru TBI Bank.'
    : 'You can purchase this equipment in fixed installments through our partner TBI Bank.';

  if (variant === 'compact') {
    return (
      <div className={`bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 text-neutral-900 border border-neutral-100 shadow-xl space-y-4 ${className}`}>
        <div className="space-y-1.5">
          <h4 className="font-headline font-extrabold text-base md:text-lg text-neutral-900 tracking-tight leading-snug">
            {title}
          </h4>
          <p className="text-neutral-500 text-xs font-body leading-relaxed">
            {compactDescription}
          </p>
        </div>

        <div className="pt-2">
          <a
            href="https://tbibank.ro"
            target="_blank"
            rel="noopener noreferrer"
            title="Vizitează tbibank.ro"
            className="inline-block transition-transform duration-300 hover:scale-105 cursor-pointer"
          >
            <Image
              src="/logo_tbi_Rectangle.webp"
              alt="TBI Bank Logo"
              width={240}
              height={80}
              className="h-16 md:h-20 w-auto object-contain"
            />
          </a>
        </div>
      </div>
    );
  }

  return (
    <section className={`py-16 md:py-24 px-6 md:px-14 bg-neutral-50 border-y border-neutral-200/60 ${className}`}>
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-16">
        <div className="space-y-4 max-w-3xl">
          <h2 className="font-headline font-extrabold text-3xl md:text-5xl text-neutral-900 tracking-tight leading-tight">
            {isRo ? (
              <>
                Achiziționează utilaje agricole în rate prin <span className="text-accent-lime">TBI Bank</span>
              </>
            ) : (
              <>
                Buy agricultural equipment in installments through <span className="text-accent-lime">TBI Bank</span>
              </>
            )}
          </h2>

          <p className="text-neutral-600 text-base md:text-lg font-body leading-relaxed">
            {description}
          </p>
        </div>

        <div className="shrink-0 pt-2 md:pt-0">
          <a
            href="https://tbibank.ro"
            target="_blank"
            rel="noopener noreferrer"
            title="Vizitează tbibank.ro"
            className="inline-block transition-transform duration-300 hover:scale-105 cursor-pointer"
          >
            <Image
              src="/logo_tbi_Rectangle.webp"
              alt="TBI Bank Logo"
              width={380}
              height={130}
              className="h-28 md:h-36 lg:h-40 w-auto object-contain"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
