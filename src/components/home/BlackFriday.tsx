'use client';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import type { CarouselApi } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import {
  BF_PHONE_DISPLAY,
  BF_PHONE_HREF,
  BF_PRODUCTS,
  BF_WHATSAPP_NUMBER,
  formatBfEndDate,
  formatBfStartDate,
  formatEuro,
  type BlackFridayPhase,
} from '@/lib/promo/blackFriday';
import { BF_I18N } from './blackFridayContent';

const wa = (text: string) =>
  `https://wa.me/${BF_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

interface BlackFridayProps {
  /** Faza calculată pe server (page.tsx, revalidate 300). Secțiunea nu se montează în 'ended'. */
  phase: Exclude<BlackFridayPhase, 'ended'>;
}

export function BlackFriday({ phase: serverPhase }: BlackFridayProps) {
  const { lang } = useLanguage();
  const c = BF_I18N[lang];
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [phase, setPhase] = useState<BlackFridayPhase>(serverPhase);

  // Doar în `next dev`: ?bfphase=upcoming|active|ended pentru preview fără restart.
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    const q = new URLSearchParams(window.location.search).get('bfphase');
    if (q === 'upcoming' || q === 'active' || q === 'ended') setPhase(q);
  }, []);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on('select', onSelect);
    api.on('reInit', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  const scrollTo = useCallback((i: number) => api?.scrollTo(i), [api]);

  if (phase === 'ended') return null;

  const upcoming = phase === 'upcoming';
  const dateLine = (upcoming ? c.textStart : c.textEnd).replace(
    '{date}',
    upcoming ? formatBfStartDate(lang) : formatBfEndDate(lang),
  );
  const mainWa = wa(upcoming ? c.whatsappReserve : c.whatsappGeneral);
  const n = BF_PRODUCTS.length;

  const reveal = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <div className="bg-white pt-16 md:pt-24">
    <section
      id="black-friday"
      className="relative py-16 md:py-24 px-6 md:px-14 bg-neutral-950 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute -bottom-6 md:-bottom-10 left-0 right-0 text-center font-headline font-extrabold uppercase tracking-tighter leading-none text-[18vw] text-white/[0.04] whitespace-nowrap"
      >
        Black Friday
      </div>

      <div className="relative max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={reveal}
            className="space-y-6 md:space-y-8"
          >
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-accent-lime/10 border border-accent-lime/30 rounded-full w-fit">
                <div className="w-1.5 h-1.5 bg-accent-lime rounded-full" />
                <span className="text-accent-lime text-[10px] font-bold uppercase tracking-widest">
                  {c.overline}
                </span>
              </div>
              {upcoming && (
                <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                  {c.comingSoon}
                </span>
              )}
            </div>

            <h2 className="font-headline font-extrabold text-3xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] max-w-xl [text-wrap:balance]">
              {c.title}
            </h2>

            <div className="space-y-3 text-neutral-300 font-body text-base md:text-lg leading-relaxed max-w-lg">
              <p>{c.text1}</p>
              <p className="font-bold text-white">{dateLine}</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 pt-2">
              <a href={mainWa} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto shrink-0">
                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-accent-lime hover:brightness-110 text-neutral-950 rounded-full p-1.5 flex items-center justify-between transition-all duration-300 group/btn w-full sm:w-fit gap-3 sm:gap-10 shadow-2xl shadow-accent-lime/20"
                >
                  <span className="pl-5 sm:pl-6 text-[13px] sm:text-sm font-bold uppercase tracking-wider sm:tracking-widest whitespace-nowrap">{c.ctaWhatsapp}</span>
                  <div className="w-10 h-10 bg-neutral-950 rounded-full flex items-center justify-center transition-transform group-hover/btn:rotate-45 shrink-0">
                    <ArrowUpRight size={20} className="text-white" strokeWidth={3} />
                  </div>
                </motion.div>
              </a>
              <a href={BF_PHONE_HREF} className="w-full sm:w-auto shrink-0">
                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-transparent border-2 border-white text-white rounded-full p-1.5 flex items-center justify-between transition-all duration-300 group/btn w-full sm:w-fit gap-3 sm:gap-10"
                >
                  <span className="pl-5 sm:pl-6 text-[13px] sm:text-sm font-bold uppercase tracking-wider sm:tracking-widest whitespace-nowrap">
                    {c.ctaCall} {BF_PHONE_DISPLAY}
                  </span>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center transition-transform group-hover/btn:rotate-45 shrink-0">
                    <ArrowUpRight size={20} className="text-black" strokeWidth={3} />
                  </div>
                </motion.div>
              </a>
            </div>

            <p className="text-sm text-neutral-400 font-body">{c.footnote}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="min-w-0"
          >
            <Carousel opts={{ loop: true }} setApi={setApi} aria-label={c.carouselLabel}>
              <CarouselContent>
                {BF_PRODUCTS.map((p, i) => {
                  const t = c.products[p.id];
                  const href = p.slug ? `/produse/${p.slug}` : wa(t.whatsappText ?? c.whatsappGeneral);
                  const external = !p.slug;
                  const cta = p.slug ? c.linkDetails : c.linkWhatsapp;
                  const body = (
                    <>
                      <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-neutral-900">
                        <Image
                          src={p.image}
                          alt={t.name}
                          fill
                          sizes="(max-width: 1024px) 100vw, 700px"
                          priority={false}
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                        <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white text-neutral-950 text-sm md:text-base font-extrabold tracking-wide">
                          −{p.discount}%
                        </span>
                      </div>
                      <div className="pt-6 md:pt-8">
                        <h3 className="font-headline font-bold text-xl md:text-2xl text-white">{t.name}</h3>
                        <p className="mt-1 text-neutral-400 font-body text-sm md:text-base">{t.spec}</p>
                        <div className="mt-4 flex items-baseline gap-4 flex-wrap">
                          <span className="font-headline font-extrabold text-5xl md:text-6xl text-accent-lime tracking-tight leading-none">
                            {formatEuro(p.newPrice)}
                          </span>
                          <span className="font-headline font-bold text-xl md:text-2xl text-neutral-500 line-through">
                            {formatEuro(p.oldPrice)}
                          </span>
                          <span className="text-neutral-400 font-body text-sm md:text-base">{c.vat}</span>
                        </div>
                        <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white group-hover:text-accent-lime transition-colors">
                          {cta} <ArrowRight size={16} strokeWidth={3} />
                        </span>
                      </div>
                    </>
                  );
                  return (
                    <CarouselItem
                      key={p.id}
                      aria-label={c.slideOf.replace('{n}', String(i + 1)).replace('{total}', String(n))}
                    >
                      {external ? (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="group block">
                          {body}
                        </a>
                      ) : (
                        <Link href={href} className="group block">
                          {body}
                        </Link>
                      )}
                    </CarouselItem>
                  );
                })}
              </CarouselContent>

              <div className="mt-8 flex items-center justify-between lg:justify-start lg:gap-10">
                <div className="flex gap-2">
                  {BF_PRODUCTS.map((p, i) => (
                    <button
                      key={p.id}
                      type="button"
                      aria-label={c.slide.replace('{n}', String(i + 1))}
                      aria-current={i === current}
                      onClick={() => scrollTo(i)}
                      className={cn(
                        'h-2 rounded-full transition-all',
                        i === current ? 'w-8 bg-accent-lime' : 'w-2 bg-white/30 hover:bg-white/50',
                      )}
                    />
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    aria-label={c.prev}
                    onClick={() => api?.scrollPrev()}
                    className="w-12 h-12 rounded-full border-2 border-white/30 text-white hover:border-white transition-colors flex items-center justify-center"
                  >
                    <ArrowLeft size={18} strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    aria-label={c.next}
                    onClick={() => api?.scrollNext()}
                    className="w-12 h-12 rounded-full bg-white text-neutral-950 hover:bg-accent-lime transition-colors flex items-center justify-center"
                  >
                    <ArrowRight size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </Carousel>
          </motion.div>
        </div>
      </div>
    </section>
    </div>
  );
}
