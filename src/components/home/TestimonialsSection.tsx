'use client';
import { motion } from 'framer-motion';
import { Star, ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const TESTIMONIALS = [
  {
    id: 1,
    rating: 5,
    text: "Parteneriatul cu AgroSalso ne-a oferit siguranța de care aveam nevoie. Utilajele livrate de la Dexwal și Letak sunt de o calitate ireproșabilă, iar suportul oferit de echipa lor de familie este cu adevărat dedicat.",
    author: "Ionel Georgescu",
    location: "Fermier, Județul Brăila"
  },
  {
    id: 2,
    rating: 5,
    text: "Experiența de peste un deceniu a AgroSalso se vede în fiecare detaliu. Am primit consultanță exactă pentru alegerea plugurilor Turan, iar livrarea a fost făcută la timp, fără rabat de la calitate.",
    author: "Mihai Popescu",
    location: "AgroTerra SRL (Ialomița)"
  },
  {
    id: 3,
    rating: 5,
    text: "Suntem foarte mulțumiți de fiabilitatea pieselor comandate. Colaborarea cu MegaMetal prin AgroSalso ne-a ajutat să reducem timpii morți în plin sezon de recoltare. Recomandăm cu toată încrederea!",
    author: "Andrei Vasilescu",
    location: "Exploatație Agricolă Banat"
  }
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section className="py-24 md:py-32 px-6 md:px-14 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-16 md:mb-24">
          <div className="max-w-2xl space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 px-3 py-1 bg-accent-lime/10 rounded-full w-fit"
            >
              <div className="w-1.5 h-1.5 bg-accent-lime rounded-full" />
              <span className="text-accent-lime text-[10px] font-bold uppercase tracking-widest">Testimoniale</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-headline font-extrabold text-4xl md:text-6xl text-neutral-900 tracking-tight leading-[1.1]"
            >
              Ce spun partenerii și <br /> fermierii noștri
            </motion.h2>
          </div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-md"
          >
            <p className="text-neutral-500 text-sm md:text-base font-body leading-relaxed pt-2 md:pt-10">
              De peste un deceniu, AgroSalso sprijină afacerile agricole din România cu tehnologie de top și piese originale de la producători europeni renumiți, asigurând productivitate și performanță măsurabilă.
            </p>
          </motion.div>
        </div>

        {/* Testimonials Grid/Carousel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16">
          {[TESTIMONIALS[activeIndex], TESTIMONIALS[(activeIndex + 1) % TESTIMONIALS.length]].map((item, idx) => (
            <motion.div
              key={`${item.id}-${idx}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-neutral-50 rounded-[2rem] p-8 md:p-12 flex flex-col justify-between border border-neutral-100 hover:shadow-xl hover:shadow-neutral-500/5 transition-all duration-500 min-h-[400px]"
            >
              <div className="space-y-8">
                <div className="flex gap-1">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="font-headline font-bold text-xl md:text-2xl text-neutral-900 leading-snug">
                  {item.text}
                </p>
              </div>
              <div className="pt-8">
                <div className="font-headline font-bold text-lg text-neutral-900">{item.author}</div>
                <div className="text-neutral-400 text-sm font-body">{item.location}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation & Progress */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  activeIndex === i ? "w-12 bg-accent-lime" : "w-8 bg-neutral-200"
                )} 
              />
            ))}
          </div>
          <div className="flex gap-4">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevTestimonial}
              className="w-14 h-14 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors"
            >
              <ArrowLeft size={24} className="text-neutral-900" strokeWidth={1.5} />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextTestimonial}
              className="w-14 h-14 rounded-full bg-accent-lime flex items-center justify-center shadow-lg shadow-accent-lime/20 hover:bg-accent-lime/90 transition-colors"
            >
              <ArrowRight size={24} className="text-black" strokeWidth={2} />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
