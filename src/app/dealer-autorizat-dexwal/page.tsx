'use client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowUpRight, Disc3, Layers, Pickaxe, Droplets, ShieldCheck } from 'lucide-react';
import { content } from './content';

const ICONS = [Disc3, Layers, Pickaxe, Droplets];

export default function DealerDexwalPage() {
  const { lang } = useLanguage();
  const c = content[lang];

  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen">
        {/* Hero */}
        <section className="relative h-[50vh] md:h-[65vh] w-full flex flex-col justify-end overflow-hidden bg-neutral-900">
          <Image
            src="/thumb-2-v2.jpg"
            alt="Utilaj Dexwal la lucru pe câmp"
            fill
            priority
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10" />

          <div className="relative z-20 max-w-[1440px] mx-auto w-full px-6 md:px-14 pb-14 md:pb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="max-w-3xl space-y-5"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-lime rounded-full" />
                <span className="text-accent-lime text-xs font-bold uppercase tracking-[0.3em]">{c.label}</span>
              </div>
              <h1 className="font-headline font-extrabold text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tighter">
                {c.heroTitle}
              </h1>
            </motion.div>
          </div>
        </section>

        {/* Breadcrumb */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-14 pt-6 md:pt-8">
          <nav aria-label="Breadcrumb" className="text-xs font-bold uppercase tracking-widest text-neutral-400">
            <Link href="/" className="hover:text-neutral-900 transition-colors">{c.breadcrumbHome}</Link>
            <span className="mx-2">/</span>
            <span className="text-neutral-900">{c.breadcrumbCurrent}</span>
          </nav>
        </div>

        {/* Intro + warranty */}
        <section className="max-w-[1440px] mx-auto px-6 md:px-14 py-14 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-8 space-y-6 text-neutral-500 text-lg leading-relaxed"
            >
              <p>{c.intro}</p>
              <p>{c.helpText}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-4 bg-neutral-900 rounded-[2rem] p-8 flex items-start gap-4"
            >
              <div className="w-11 h-11 shrink-0 bg-accent-lime/10 rounded-xl flex items-center justify-center">
                <ShieldCheck size={22} className="text-accent-lime" />
              </div>
              <p className="font-headline font-bold text-lg md:text-xl text-white leading-snug">
                {c.warranty}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Gama Dexwal */}
        <section className="max-w-[1440px] mx-auto px-6 md:px-14 pb-14 md:pb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-headline font-extrabold text-2xl md:text-4xl text-neutral-900 tracking-tight mb-10"
          >
            {c.sectionTitle}
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {c.categorii.map((cat, i) => {
              const Icon = ICONS[i];
              return (
                <motion.div
                  key={cat.categorie}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <Link
                    href="/produse"
                    className="group flex items-start gap-4 bg-white p-6 md:p-8 rounded-[1.5rem] border border-neutral-100 hover:shadow-xl transition-shadow h-full"
                  >
                    <div className="w-10 h-10 shrink-0 bg-accent-lime/10 rounded-xl flex items-center justify-center">
                      <Icon size={20} className="text-accent-lime" />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <h3 className="font-headline font-bold text-lg text-neutral-900">{cat.categorie}</h3>
                      <p className="text-neutral-500 font-medium text-sm leading-relaxed">{cat.modele}</p>
                    </div>
                    <ArrowUpRight size={18} className="text-neutral-300 group-hover:text-neutral-900 group-hover:rotate-45 transition-all shrink-0 mt-1" />
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <p className="text-neutral-500 font-body text-lg mt-10">
            {c.closingPrefix}{' '}
            <Link href="/produse" className="font-bold text-neutral-900 underline underline-offset-4">
              {c.closingLinkText}
            </Link>
            .
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <a href="https://wa.me/40761927076" target="_blank" rel="noopener noreferrer">
              <motion.div
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="bg-neutral-900 hover:bg-black text-white rounded-full p-1.5 flex items-center justify-between transition-all duration-300 group/btn w-fit gap-10 shadow-xl shadow-black/10"
              >
                <span className="pl-6 text-sm font-bold uppercase tracking-widest">{c.ctaWhatsapp}</span>
                <div className="w-10 h-10 bg-accent-lime rounded-full flex items-center justify-center transition-transform group-hover/btn:rotate-45">
                  <ArrowUpRight size={20} className="text-black" strokeWidth={3} />
                </div>
              </motion.div>
            </a>
            <a href="tel:+40742936959">
              <motion.div
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white border-2 border-neutral-900 text-neutral-900 rounded-full px-8 py-4 flex items-center gap-4 transition-all duration-300 hover:bg-neutral-900 hover:text-white"
              >
                <span className="text-sm font-bold uppercase tracking-widest">{c.ctaCallLabel}</span>
              </motion.div>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
