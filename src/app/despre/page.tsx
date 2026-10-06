'use client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Headphones, Tractor, Wrench, Truck, FileCheck, Banknote, ArrowUpRight } from 'lucide-react';

const BRANDS = ['Dexwal', 'Helagro', 'Mega Metal', 'Strumyk', 'Tolmet', 'Bomet', 'Letak'];

export default function AboutPage() {
  const { lang } = useLanguage();
  const [activeSection, setActiveIndex] = useState(0);

  const SECTIONS = [
    { id: 'sectiunea-1', label: t[lang].despreNavSection1 },
    { id: 'sectiunea-2', label: t[lang].despreNavSection2 },
    { id: 'sectiunea-3', label: t[lang].despreNavSection3 },
    { id: 'sectiunea-4', label: t[lang].despreNavSection4 },
    { id: 'servicii', label: t[lang].despreNavServicii },
    { id: 'de-ce', label: t[lang].despreNavDeCe },
  ];

  const SERVICES = [
    { icon: Headphones, title: t[lang].despreServiciu1Title, text: t[lang].despreServiciu1Text },
    { icon: Tractor, title: t[lang].despreServiciu2Title, text: t[lang].despreServiciu2Text },
    { icon: Wrench, title: t[lang].despreServiciu3Title, text: t[lang].despreServiciu3Text },
    { icon: Truck, title: t[lang].despreServiciu4Title, text: t[lang].despreServiciu4Text },
    { icon: FileCheck, title: t[lang].despreServiciu5Title, text: t[lang].despreServiciu5Text },
    { icon: Banknote, title: t[lang].despreServiciu6Title, text: t[lang].despreServiciu6Text },
  ];

  // Funcție pentru scroll lin la secțiune
  const scrollToSection = (id: string, idx: number) => {
    setActiveIndex(idx);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll spy pentru a actualiza meniul activ în funcție de poziția paginii
  useEffect(() => {
    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 200;

      SECTIONS.forEach((section, idx) => {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveIndex(idx);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScrollSpy);
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, [lang]);

  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[60vh] md:h-[80vh] w-full flex flex-col justify-end overflow-hidden bg-neutral-900">
          <Image
            src="/despre-noi-hero.jpg"
            alt="AgroSalso Field"
            fill
            priority
            className="object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

          <div className="relative z-20 max-w-[1440px] mx-auto w-full px-6 md:px-14 pb-16 md:pb-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-4xl space-y-6"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-lime rounded-full" />
                <span className="text-accent-lime text-xs font-bold uppercase tracking-[0.3em]">{t[lang].aboutStory}</span>
              </div>
              <h1 className="font-headline font-extrabold text-4xl md:text-7xl lg:text-8xl text-white leading-[1.1] tracking-tighter">
                {t[lang].despreHeroTitle}
              </h1>
              <p className="text-white/70 text-base md:text-xl max-w-2xl font-body leading-relaxed">
                {t[lang].despreHeroSub}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Section with Sidebar */}
        <section className="max-w-[1440px] mx-auto px-6 md:px-14 py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">

            {/* Sidebar Navigation */}
            <aside className="lg:col-span-3 space-y-8">
              <div className="sticky top-32 space-y-2">
                {SECTIONS.map((section, idx) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id, idx)}
                    className={cn(
                      "w-full text-left px-8 py-4 rounded-full text-sm font-extrabold uppercase tracking-widest transition-all flex items-center justify-between group",
                      activeSection === idx
                        ? "bg-accent-lime text-black shadow-lg shadow-accent-lime/20"
                        : "text-neutral-400 hover:bg-neutral-50 hover:text-neutral-900"
                    )}
                  >
                    {section.label}
                    {activeSection === idx && (
                      <motion.div layoutId="arrow" transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                        <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-black rounded-full" />
                        </div>
                      </motion.div>
                    )}
                  </button>
                ))}

                <div className="pt-12 hidden lg:block">
                  <p className="text-[10px] font-bold text-neutral-300 uppercase tracking-[0.2em] mb-4">Contact rapid</p>
                  <a href="mailto:contact@agrosalso.ro" className="text-sm font-bold text-neutral-900 hover:text-accent-lime transition-colors">contact@agrosalso.ro</a>
                </div>
              </div>
            </aside>

            {/* Main Article Content */}
            <div className="lg:col-span-9 space-y-24">

              {/* Section 1 — Din 2012 */}
              <motion.section
                id="sectiunea-1"
                className="space-y-8 scroll-mt-32"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-headline font-extrabold text-3xl md:text-5xl text-neutral-900 tracking-tight">
                  {t[lang].despreSection1Title}
                </h2>
                <div className="prose prose-neutral max-w-none space-y-4">
                  <p className="text-lg md:text-xl text-neutral-500 font-medium leading-relaxed">
                    {t[lang].despreSection1Text1}
                  </p>
                  <p className="text-lg md:text-xl text-neutral-500 font-medium leading-relaxed">
                    {t[lang].despreSection1Text2}
                  </p>
                </div>
                <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <Image
                    src="/despre-noi-photo.jpg"
                    alt="AgroSalso Operations"
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.section>

              {/* Section 2 — Utilajul potrivit */}
              <motion.section
                id="sectiunea-2"
                className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center scroll-mt-32"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="space-y-6">
                  <h3 className="font-headline font-extrabold text-2xl md:text-4xl text-neutral-900">
                    {t[lang].despreSection2Title}
                  </h3>
                  <p className="text-neutral-500 text-lg leading-relaxed">
                    {t[lang].despreSection2Text1}
                  </p>
                  <p className="text-neutral-500 text-lg leading-relaxed">
                    {t[lang].despreSection2Text2}
                  </p>
                </div>
                <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-neutral-100">
                  <Image
                    src="/desprenoi2.png"
                    alt="Agro Salso"
                    fill
                    className="object-cover"
                    data-ai-hint="modern farming"
                  />
                </div>
              </motion.section>

              {/* Section 3 — Mai mult decât vânzarea */}
              <motion.section
                id="sectiunea-3"
                className="space-y-6 bg-neutral-50 p-8 md:p-16 rounded-[3rem] border border-neutral-100 scroll-mt-32"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="max-w-3xl space-y-4">
                  <h3 className="font-headline font-extrabold text-2xl md:text-4xl text-neutral-900 mb-6">
                    {t[lang].despreSection3Title}
                  </h3>
                  <p className="text-neutral-500 text-lg leading-relaxed">
                    {t[lang].despreSection3Text1}
                  </p>
                  <p className="text-neutral-500 text-lg leading-relaxed">
                    {t[lang].despreSection3Text2}
                  </p>
                  <p className="text-neutral-500 text-lg leading-relaxed">
                    {t[lang].despreSection3Text3}
                  </p>
                </div>
              </motion.section>

              {/* Section 4 — Producători */}
              <motion.section
                id="sectiunea-4"
                className="space-y-12 scroll-mt-32"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="max-w-3xl space-y-4">
                  <h3 className="font-headline font-extrabold text-2xl md:text-4xl text-neutral-900">
                    {t[lang].despreSection4Title}
                  </h3>
                  <p className="text-neutral-500 text-lg leading-relaxed">
                    {t[lang].despreSection4Text1}
                  </p>
                  <p className="text-neutral-500 text-lg leading-relaxed">
                    {t[lang].despreSection4Text2}
                  </p>
                  <p className="text-neutral-500 text-lg leading-relaxed">
                    {t[lang].despreSection4Text3}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                  {BRANDS.map((brand, i) => (
                    <div key={i} className="aspect-[3/2] bg-neutral-50 rounded-2xl flex items-center justify-center border border-neutral-100 group hover:bg-white hover:shadow-xl transition-all duration-500">
                      <div className="text-neutral-300 font-headline font-extrabold text-xl group-hover:text-neutral-900 transition-colors">
                        {brand}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* Services — Ce oferim fermierilor */}
              <motion.section
                id="servicii"
                className="space-y-12 scroll-mt-32"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-headline font-extrabold text-3xl md:text-5xl text-neutral-900 tracking-tight">
                  {t[lang].despreServiciiTitle}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {SERVICES.map((service, i) => {
                    const Icon = service.icon;
                    return (
                      <motion.div
                        key={i}
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
                          <h4 className="font-headline font-bold text-lg text-neutral-900">{service.title}</h4>
                          <p className="text-neutral-500 font-medium text-sm leading-relaxed">{service.text}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.section>

              {/* De ce Agro Salso — closing CTA */}
              <motion.section
                id="de-ce"
                className="relative overflow-hidden bg-neutral-900 rounded-[3rem] p-8 md:p-16 scroll-mt-32"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="relative z-10 max-w-3xl space-y-6">
                  <h2 className="font-headline font-extrabold text-3xl md:text-5xl text-white tracking-tight">
                    {t[lang].despreDeCeTitle}
                  </h2>
                  <p className="text-white/60 text-lg leading-relaxed">
                    {t[lang].despreDeCeText1}
                  </p>
                  <p className="text-white/60 text-lg leading-relaxed">
                    {t[lang].despreDeCeText2}
                  </p>
                  <p className="font-headline font-extrabold text-xl md:text-2xl text-accent-lime pt-2">
                    {t[lang].despreDeCeClosing}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <Link href="/contact">
                      <motion.div
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-accent-lime hover:bg-accent-lime/90 text-black rounded-full p-1.5 flex items-center justify-between transition-all duration-300 group/btn w-fit gap-10 shadow-2xl shadow-accent-lime/20"
                      >
                        <span className="pl-6 text-sm font-bold uppercase tracking-widest">{t[lang].despreCtaContact}</span>
                        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center transition-transform group-hover/btn:rotate-45">
                          <ArrowUpRight size={20} className="text-white" strokeWidth={3} />
                        </div>
                      </motion.div>
                    </Link>
                    <Link href="/produse">
                      <motion.div
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full p-1.5 flex items-center justify-between transition-all duration-300 group/btn w-fit gap-10"
                      >
                        <span className="pl-6 text-sm font-bold uppercase tracking-widest">{t[lang].despreCtaProduse}</span>
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center transition-transform group-hover/btn:rotate-45">
                          <ArrowUpRight size={20} className="text-black" strokeWidth={3} />
                        </div>
                      </motion.div>
                    </Link>
                  </div>
                </div>
              </motion.section>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
