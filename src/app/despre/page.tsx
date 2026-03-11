'use client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function AboutPage() {
  const { lang } = useLanguage();
  const [activeSection, setActiveIndex] = useState(0);

  const SECTIONS = [
    { id: 'overview', label: t[lang].aboutNavOverview },
    { id: 'mission', label: t[lang].aboutNavMission },
    { id: 'history', label: t[lang].aboutNavHistory },
    { id: 'partners', label: t[lang].aboutNavPartners },
  ];

  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen">
        {/* Hero Section - Matching the style from the image */}
        <section className="relative h-[60vh] md:h-[80vh] w-full flex flex-col justify-end overflow-hidden bg-neutral-900">
          <Image 
            src="https://picsum.photos/seed/tractor_field_99/1920/1080" 
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
                {t[lang].aboutHeroTitle}
              </h1>
              <p className="text-white/70 text-base md:text-xl max-w-2xl font-body leading-relaxed">
                {t[lang].aboutHeroSub}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Section with Sidebar - Matching the layout from the image */}
        <section className="max-w-[1440px] mx-auto px-6 md:px-14 py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
            
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-3 space-y-8">
              <div className="sticky top-32 space-y-2">
                {SECTIONS.map((section, idx) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveIndex(idx)}
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
              
              {/* Overview Section */}
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <h2 className="font-headline font-extrabold text-3xl md:text-5xl text-neutral-900 tracking-tight">
                  {t[lang].aboutOverviewTitle}
                </h2>
                <div className="prose prose-neutral max-w-none">
                  <p className="text-lg md:text-xl text-neutral-500 font-medium leading-relaxed">
                    {t[lang].aboutOverviewText}
                  </p>
                </div>
                <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <Image 
                    src="https://picsum.photos/seed/about_1/1200/800" 
                    alt="AgroSalso Operations" 
                    fill 
                    className="object-cover"
                    data-ai-hint="farming logistics"
                  />
                </div>
              </motion.section>

              {/* Mission Section */}
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
              >
                <div className="space-y-6">
                  <h3 className="font-headline font-extrabold text-2xl md:text-4xl text-neutral-900">
                    {t[lang].aboutMissionTitle}
                  </h3>
                  <p className="text-neutral-500 text-lg leading-relaxed">
                    {t[lang].aboutMissionText}
                  </p>
                  <ul className="space-y-4 pt-4">
                    {t[lang].aboutMissionPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-accent-lime flex items-center justify-center shrink-0 mt-1">
                          <div className="w-1.5 h-1.5 bg-black rounded-full" />
                        </div>
                        <span className="font-bold text-neutral-900">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-neutral-100">
                  <Image 
                    src="https://picsum.photos/seed/mission/800/800" 
                    alt="Our Mission" 
                    fill 
                    className="object-cover"
                    data-ai-hint="modern farming"
                  />
                </div>
              </motion.section>

              {/* History Section */}
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-12 bg-neutral-50 p-8 md:p-16 rounded-[3rem] border border-neutral-100"
              >
                <div className="max-w-3xl">
                  <h3 className="font-headline font-extrabold text-2xl md:text-4xl text-neutral-900 mb-6">
                    {t[lang].aboutHistoryTitle}
                  </h3>
                  <p className="text-neutral-500 text-lg leading-relaxed">
                    {t[lang].aboutHistoryText}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {[
                    { label: 'Ani Experiență', val: '12+' },
                    { label: 'Producători', val: '15+' },
                    { label: 'Utilaje Vândute', val: '2500+' },
                    { label: 'Clienți Mulțumiți', val: '98%' },
                  ].map((stat, i) => (
                    <div key={i} className="space-y-1">
                      <div className="text-3xl font-headline font-extrabold text-accent-lime">{stat.val}</div>
                      <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{stat.label}</div>
                    </div>
                  ))}
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
