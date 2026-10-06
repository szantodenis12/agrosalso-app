'use client';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { FAQ_I18N, FAQ_TITLE_I18N } from './homeAddonsContent';

export function IntrebariFrecvente() {
  const { lang } = useLanguage();
  const faq = FAQ_I18N[lang];

  return (
    <section className="py-20 md:py-32 px-6 md:px-14 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 px-3 py-1 bg-accent-lime/10 rounded-full w-fit mb-6"
        >
          <div className="w-1.5 h-1.5 bg-accent-lime rounded-full" />
          <span className="text-accent-lime text-[10px] font-bold uppercase tracking-widest">FAQ</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-headline font-extrabold text-3xl md:text-6xl text-neutral-900 tracking-tight leading-[1.1] mb-12 md:mb-16 max-w-3xl"
        >
          {FAQ_TITLE_I18N[lang]}
        </motion.h2>

        <div className="space-y-4 max-w-3xl">
          {faq.map((item, i) => (
            <motion.details
              key={item.question}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group bg-neutral-50 p-6 md:p-8 rounded-[1.5rem] border border-neutral-100 hover:border-neutral-200 transition-colors"
            >
              <summary className="flex items-center justify-between gap-4 font-headline font-bold text-lg md:text-xl text-neutral-900 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                {item.question}
                <ChevronDown
                  size={20}
                  className="shrink-0 text-neutral-400 transition-transform duration-300 group-open:rotate-180"
                />
              </summary>
              <p className="text-neutral-500 font-body text-base md:text-lg leading-relaxed mt-4">
                {item.answer}
              </p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}
