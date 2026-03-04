'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function HeroSection() {
  const bgImage = PlaceHolderImages.find(img => img.id === 'hero-tractor');
  const thumbs = PlaceHolderImages.filter(img => img.id.startsWith('thumb-'));

  return (
    <section className="relative h-screen min-h-[900px] w-full flex flex-col justify-center px-6 md:px-14 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={bgImage?.imageUrl || "https://picsum.photos/seed/ag123/1920/1080"} 
          alt="Agriculture Background" 
          fill 
          className="object-cover"
          priority
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
          className="max-w-5xl"
        >
          <h1 className="font-headline font-bold text-6xl md:text-8xl lg:text-[110px] text-white leading-[1.05] tracking-tight mb-12">
            Smart. <span className="text-accent-lime">Sustainable.</span> <br /> 
            <span className="text-accent-lime">Future-Ready</span> <br />
            Farming.
          </h1>

          <p className="text-white/80 text-lg md:text-2xl max-w-3xl mb-16 font-body leading-relaxed">
            AgroSalso sprijină fermierii și afacerile agricole cu soluții inteligente și sustenabile, care cresc productivitatea și profitabilitatea — protejând în același timp planeta.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <button className="bg-white hover:bg-neutral-100 text-black font-bold h-20 px-10 rounded-full flex items-center gap-4 transition-all text-xl shadow-2xl group">
              Începe Acum
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center group-hover:bg-accent-lime transition-colors">
                <ArrowUpRight size={22} className="text-white group-hover:text-black transition-colors" />
              </div>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Interface Elements */}
      <div className="absolute bottom-16 left-6 md:left-14 right-6 md:right-14 z-20 flex flex-col md:flex-row justify-between items-end gap-12">
        {/* Progress Slider Indicator */}
        <div className="flex gap-6 items-center">
           <div className="w-40 h-[3px] bg-white relative rounded-full">
              <div className="absolute top-0 left-0 h-full w-1/2 bg-accent-lime rounded-full" />
           </div>
           <div className="w-40 h-[3px] bg-white/20 rounded-full" />
           <div className="w-40 h-[3px] bg-white/20 rounded-full" />
        </div>

        {/* Thumbnails */}
        <div className="hidden lg:flex gap-6">
          {thumbs.map((thumb, idx) => (
            <div key={idx} className="w-28 h-20 rounded-2xl border-2 border-white/20 overflow-hidden relative group cursor-pointer hover:border-accent-lime transition-all duration-300">
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
