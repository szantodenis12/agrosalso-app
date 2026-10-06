'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { OFFER_I18N } from './homeAddonsContent';

export function OferteCurente() {
  const { lang } = useLanguage();
  const offer = OFFER_I18N[lang];

  const revealVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section className="py-20 md:py-32 px-6 md:px-14 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={revealVariants}
            className="space-y-6 md:space-y-8"
          >
            <div className="flex items-center gap-2 px-3 py-1 bg-accent-lime/10 rounded-full w-fit">
              <div className="w-1.5 h-1.5 bg-accent-lime rounded-full" />
              <span className="text-accent-lime text-[10px] font-bold uppercase tracking-widest">
                {offer.overline}
              </span>
            </div>

            <h2 className="font-headline font-extrabold text-3xl md:text-5xl lg:text-6xl text-neutral-900 tracking-tight leading-[1.1] max-w-xl">
              {offer.title}
            </h2>

            <div className="space-y-3 text-neutral-500 font-body text-base md:text-lg leading-relaxed max-w-lg">
              <p>{offer.text1}</p>
              <p className="font-bold text-neutral-900">{offer.text2}</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 pt-2">
              <a href="https://wa.me/40761927076" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto shrink-0">
                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-neutral-900 hover:bg-black text-white rounded-full p-1.5 flex items-center justify-between transition-all duration-300 group/btn w-full sm:w-fit gap-10 shadow-2xl shadow-black/10"
                >
                  <span className="pl-6 text-sm font-bold uppercase tracking-widest whitespace-nowrap">{offer.cta1}</span>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center transition-transform group-hover/btn:rotate-45 shrink-0">
                    <ArrowUpRight size={20} className="text-black" strokeWidth={3} />
                  </div>
                </motion.div>
              </a>
              <Link href="/noutati/dr-14-afir-2026" className="w-full sm:w-auto shrink-0">
                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white border-2 border-neutral-900 text-neutral-900 rounded-full p-1.5 flex items-center justify-between transition-all duration-300 group/btn w-full sm:w-fit gap-10"
                >
                  <span className="pl-6 text-sm font-bold uppercase tracking-widest whitespace-nowrap">{offer.cta2}</span>
                  <div className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center transition-transform group-hover/btn:rotate-45 shrink-0">
                    <ArrowUpRight size={20} className="text-white" strokeWidth={3} />
                  </div>
                </motion.div>
              </Link>
            </div>

            <p className="text-sm text-neutral-500 font-body">{offer.footnote}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="space-y-8 md:space-y-10"
          >
            {offer.stats.map((stat, i) => (
              <div
                key={stat.label}
                className={
                  i < offer.stats.length - 1
                    ? 'pb-8 md:pb-10 border-b border-neutral-100'
                    : ''
                }
              >
                <div className="font-headline font-extrabold text-4xl md:text-5xl lg:text-6xl text-neutral-900 tracking-tight leading-[1.05]">
                  {stat.value}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-1.5 h-1.5 bg-accent-lime rounded-full shrink-0" />
                  <span className="text-neutral-500 font-body text-sm md:text-base">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
