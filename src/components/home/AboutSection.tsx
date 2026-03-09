'use client';
import { Check, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';

export function AboutSection() {
  const { lang } = useLanguage();
  
  const revealVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="py-24 md:py-32 px-6 md:px-14 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto space-y-24 md:space-y-40">
        
        {/* Vision Block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={revealVariants}
            className="space-y-6 md:space-y-8"
          >
            <div className="inline-block px-4 py-1.5 bg-accent-lime/10 text-accent-lime rounded-full text-[10px] font-bold uppercase tracking-widest">
              {t[lang].aboutStory}
            </div>
            <h2 className="font-headline font-extrabold text-4xl md:text-5xl lg:text-6xl text-neutral-900 tracking-tighter leading-[1]">
              {t[lang].aboutTitle}
            </h2>
            <p className="text-neutral-500 text-base md:text-xl font-body leading-relaxed max-w-lg">
              {t[lang].aboutText}
            </p>
            <div className="pt-4">
              <Link href="/contact">
                <motion.div 
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-neutral-900 hover:bg-black text-white rounded-full p-1.5 flex items-center justify-between transition-all duration-300 group/btn w-fit gap-10 shadow-2xl shadow-black/10"
                >
                  <span className="pl-6 text-sm font-bold uppercase tracking-widest">{t[lang].aboutBtn}</span>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center transition-transform group-hover/btn:rotate-45">
                    <ArrowUpRight size={20} className="text-black" strokeWidth={3} />
                  </div>
                </motion.div>
              </Link>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative aspect-[4/3] w-full rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl"
          >
            <Image 
              src="https://picsum.photos/seed/vision_farm/1200/900" 
              alt="Echipa AgroSalso" 
              fill 
              className="object-cover hover:scale-105 transition-transform duration-1000"
              data-ai-hint="farming team"
            />
          </motion.div>
        </div>

        {/* Mission Block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariants}
            className="space-y-6 md:space-y-8"
          >
            <div className="inline-block px-4 py-1.5 bg-accent-lime/10 text-accent-lime rounded-full text-[10px] font-bold uppercase tracking-widest">
              {t[lang].aboutValues}
            </div>
            <h2 className="font-headline font-extrabold text-4xl md:text-5xl lg:text-6xl text-neutral-900 tracking-tighter leading-[1]">
              {t[lang].aboutMission}
            </h2>
          </motion.div>
          <div className="space-y-8 md:space-y-12 pt-0 lg:pt-16">
            {t[lang].aboutMissionPoints.map((text, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.8 }}
                className="flex items-start gap-6 md:gap-8 group"
              >
                <div className="mt-1 w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent-lime flex items-center justify-center shrink-0 shadow-lg shadow-accent-lime/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <Check size={18} className="text-black md:w-[22px] md:h-[22px]" strokeWidth={4} />
                </div>
                <p className="font-headline font-bold text-xl md:text-2xl lg:text-3xl text-neutral-900 leading-[1.2] tracking-tight">
                  {text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
