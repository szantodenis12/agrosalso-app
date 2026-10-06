'use client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Headphones, Tractor, Wrench, Truck, FileCheck, Banknote, ArrowUpRight } from 'lucide-react';
import { content } from './content';

const ICONS = [Headphones, Tractor, Wrench, Truck, FileCheck, Banknote];

export default function ServiciiPage() {
  const { lang } = useLanguage();
  const c = content[lang];

  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen">
        {/* Hero */}
        <section className="relative h-[50vh] md:h-[65vh] w-full flex flex-col justify-end overflow-hidden bg-neutral-900">
          <Image
            src="/thumb-0-v2.jpg"
            alt="Utilaj agricol Agro Salso la lucru pe câmp"
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
              <p className="text-white/70 text-base md:text-xl max-w-2xl font-body leading-relaxed">
                {c.heroSub}
              </p>
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

        {/* Services grid */}
        <section className="max-w-[1440px] mx-auto px-6 md:px-14 py-14 md:py-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {c.services.map((service, i) => {
              const Icon = ICONS[i];
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="bg-white p-6 md:p-8 rounded-[1.5rem] space-y-4 hover:shadow-xl transition-shadow border border-neutral-100"
                >
                  <div className="w-10 h-10 bg-accent-lime/10 rounded-xl flex items-center justify-center">
                    <Icon size={20} className="text-accent-lime" />
                  </div>
                  <div className="space-y-1.5">
                    <h2 className="font-headline font-bold text-lg text-neutral-900">{service.title}</h2>
                    <p className="text-neutral-500 font-medium text-sm leading-relaxed">{service.text}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Closing CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden bg-neutral-900 rounded-[3rem] p-8 md:p-16 mt-16 md:mt-24"
          >
            <div className="relative z-10 max-w-2xl space-y-6">
              <p className="font-headline font-extrabold text-xl md:text-2xl text-accent-lime">
                {c.heroSub}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a href="https://wa.me/40761927076" target="_blank" rel="noopener noreferrer">
                  <motion.div
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-accent-lime hover:bg-accent-lime/90 text-black rounded-full p-1.5 flex items-center justify-between transition-all duration-300 group/btn w-fit gap-10 shadow-2xl shadow-accent-lime/20"
                  >
                    <span className="pl-6 text-sm font-bold uppercase tracking-widest">{c.ctaWhatsapp}</span>
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center transition-transform group-hover/btn:rotate-45">
                      <ArrowUpRight size={20} className="text-white" strokeWidth={3} />
                    </div>
                  </motion.div>
                </a>
                <Link href="/produse">
                  <motion.div
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full p-1.5 flex items-center justify-between transition-all duration-300 group/btn w-fit gap-10"
                  >
                    <span className="pl-6 text-sm font-bold uppercase tracking-widest">{c.ctaProducts}</span>
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center transition-transform group-hover/btn:rotate-45">
                      <ArrowUpRight size={20} className="text-black" strokeWidth={3} />
                    </div>
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
