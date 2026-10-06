'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { OFFER_I18N } from './homeAddonsContent';

export function OferteCurente() {
  const { lang } = useLanguage();
  const offer = OFFER_I18N[lang];

  return (
    <section className="py-20 md:py-32 px-6 md:px-14 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="bg-green-50 rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 space-y-6 md:space-y-8 border border-green-100"
        >
          <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full w-fit">
            <div className="w-1.5 h-1.5 bg-accent-lime rounded-full" />
            <span className="text-accent-lime text-[10px] font-bold uppercase tracking-widest">
              {offer.overline}
            </span>
          </div>

          <h2 className="font-headline font-extrabold text-3xl md:text-5xl lg:text-6xl text-neutral-900 tracking-tight leading-[1.1] max-w-3xl">
            {offer.title}
          </h2>

          <div className="space-y-3 text-neutral-600 font-body text-base md:text-lg leading-relaxed max-w-2xl">
            <p>{offer.text1}</p>
            <p className="font-bold text-neutral-900">{offer.text2}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <a href="https://wa.me/40761927076" target="_blank" rel="noopener noreferrer">
              <motion.div
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="bg-neutral-900 hover:bg-black text-white rounded-full p-1.5 flex items-center justify-between transition-all duration-300 group/btn w-fit gap-10 shadow-2xl shadow-black/10"
              >
                <span className="pl-6 text-sm font-bold uppercase tracking-widest">{offer.cta1}</span>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center transition-transform group-hover/btn:rotate-45">
                  <ArrowUpRight size={20} className="text-black" strokeWidth={3} />
                </div>
              </motion.div>
            </a>
            <Link href="/noutati/dr-14-afir-2026">
              <motion.div
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white border-2 border-neutral-900 text-neutral-900 rounded-full p-1.5 flex items-center justify-between transition-all duration-300 group/btn w-fit gap-10"
              >
                <span className="pl-6 text-sm font-bold uppercase tracking-widest">{offer.cta2}</span>
                <div className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center transition-transform group-hover/btn:rotate-45">
                  <ArrowUpRight size={20} className="text-white" strokeWidth={3} />
                </div>
              </motion.div>
            </Link>
          </div>

          <p className="text-sm text-neutral-500 font-body">{offer.footnote}</p>
        </motion.div>
      </div>
    </section>
  );
}
