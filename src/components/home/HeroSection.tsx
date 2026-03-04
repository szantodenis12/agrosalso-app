'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function HeroSection() {
  const bgImage = PlaceHolderImages.find(img => img.id === 'hero-tractor');
  const thumbs = PlaceHolderImages.filter(img => img.id.startsWith('thumb-'));

  return (
    <section className="relative h-screen min-h-[700px] w-full flex flex-col justify-center px-6 md:px-14 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={bgImage?.imageUrl || "/hero-tractor.jpg"} 
          alt="Tractor in Field" 
          fill 
          className="object-cover"
          priority
          data-ai-hint={bgImage?.imageHint || "tractor field"}
        />
        {/* Dark Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 z-10" />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-[1440px] mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <h1 className="font-headline font-bold text-4xl md:text-6xl lg:text-8xl text-white leading-[1.05] tracking-tight mb-12">
            Smart. <span className="text-accent-lime">Sustainable.</span> <br className="hidden md:block" /> 
            <span className="text-accent-lime">Future-Ready</span> <br className="hidden md:block" />
            Farming.
          </h1>

          <p className="text-white/80 text-base md:text-xl max-w-2xl mb-12 font-body leading-relaxed">
            AgroSalso sprijină fermierii și afacerile agricole cu soluții inteligente și sustenabile, care cresc productivitatea și profitabilitatea — protejând în același timp planeta.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <button className="bg-white hover:bg-neutral-50 text-neutral-900 font-bold h-14 pl-8 pr-1.5 rounded-full flex items-center gap-8 transition-all text-base shadow-2xl group border border-white/20">
              Începe Acum
              <div className="w-11 h-11 bg-neutral-900 rounded-full flex items-center justify-center transition-transform group-hover:scale-95">
                <ArrowUpRight size={20} className="text-white" strokeWidth={2.5} />
              </div>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Interface Elements */}
      <div className="absolute bottom-12 left-6 md:left-14 right-6 md:right-14 z-20 flex flex-col md:flex-row justify-between items-end gap-12">
        {/* Progress Slider Indicator */}
        <div className="flex gap-4 items-center scale-75 md:scale-100 origin-left">
           <div className="w-32 md:w-40 h-[2px] bg-white relative rounded-full">
              <div className="absolute top-0 left-0 h-full w-1/2 bg-accent-lime rounded-full" />
           </div>
           <div className="w-32 md:w-40 h-[2px] bg-white/20 rounded-full" />
           <div className="w-32 md:w-40 h-[2px] bg-white/20 rounded-full" />
        </div>

        {/* Thumbnails */}
        <div className="hidden lg:flex gap-4">
          {thumbs.map((thumb, idx) => (
            <div key={idx} className="w-24 h-16 rounded-xl border border-white/20 overflow-hidden relative group cursor-pointer hover:border-accent-lime transition-all duration-300">
              <Image 
                src={thumb.imageUrl} 
                alt={`Slide ${idx + 1}`} 
                fill 
                className="object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
