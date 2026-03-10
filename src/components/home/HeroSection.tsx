'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';

const SLIDE_DURATION = 8000;

const BACKGROUNDS = [
  {
    id: 'bg-video',
    type: 'video',
    src: '/hero-video-tractor.mp4',
    thumbnail: '/thumb-0.jpg'
  },
  {
    id: 'bg-image-1',
    type: 'image',
    src: '/thumb-1.jpg',
    thumbnail: '/thumb-1.jpg'
  },
  {
    id: 'bg-image-2',
    type: 'image',
    src: '/thumb-2.jpg',
    thumbnail: '/thumb-2.jpg'
  },
  {
    id: 'bg-image-3',
    type: 'image',
    src: '/thumb-3.jpg',
    thumbnail: '/thumb-3.jpg'
  }
];

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const { lang } = useLanguage();

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % BACKGROUNDS.length);
  }, []);

  useEffect(() => {
    setProgress(0);
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(newProgress);

      if (elapsed >= SLIDE_DURATION) {
        clearInterval(interval);
        nextSlide();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentIndex, nextSlide]);

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  const currentBg = BACKGROUNDS[currentIndex];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    },
  };

  return (
    <section className="relative h-screen min-h-[700px] w-full flex flex-col justify-center px-6 md:px-14 overflow-hidden bg-black">
      {/* Background Media Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBg.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="w-full h-full"
          >
            {currentBg.type === 'video' ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
              >
                <source src={currentBg.src} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={currentBg.src}
                alt="AgroSalso Background"
                fill
                priority
                className="object-cover"
              />
            )}
          </motion.div>
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 z-10" />
      </div>

      {/* Static Content Layer */}
      <div className="relative z-20 max-w-[1440px] mx-auto w-full">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          <motion.h1 
            variants={itemVariants}
            className="font-headline font-bold text-3xl sm:text-4xl md:text-6xl lg:text-8xl text-white leading-[1.1] tracking-tight mb-8"
          >
            {t[lang].heroTitle.split('.').map((part, i, arr) => {
              const isLast = i === arr.length - 1;
              return (
                <span key={i}>
                  {isLast ? <span className="text-accent-lime">{part.trim()}</span> : part.trim()}
                  {i < arr.length - 1 && '.'}
                  {i < arr.length - 1 && <br className="hidden md:block" />}
                </span>
              );
            })}
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-white/80 text-base md:text-lg max-w-xl mb-10 font-body leading-relaxed"
          >
            {t[lang].heroSub}
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 items-start">
            <Link href="/produse">
              <motion.button 
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white hover:bg-neutral-50 text-neutral-900 font-bold h-14 pl-8 pr-1.5 rounded-full flex items-center gap-8 transition-all text-base shadow-2xl group border border-white/20"
              >
                {t[lang].heroBtn}
                <div className="w-11 h-11 bg-neutral-900 rounded-full flex items-center justify-center transition-transform group-hover:rotate-45">
                  <ArrowUpRight size={20} className="text-white" strokeWidth={2.5} />
                </div>
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Interface Elements Layer */}
      <div className="absolute bottom-12 left-6 md:left-14 right-6 md:right-14 z-20 flex flex-col md:flex-row justify-between items-end gap-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex gap-4 items-center scale-75 md:scale-100 origin-left"
        >
          {BACKGROUNDS.map((_, index) => (
            <div 
              key={index} 
              className="w-24 md:w-32 h-[2px] bg-white/20 relative rounded-full overflow-hidden cursor-pointer"
              onClick={() => handleThumbnailClick(index)}
            >
              <motion.div 
                className="absolute top-0 left-0 h-full bg-accent-lime rounded-full"
                initial={{ width: "0%" }}
                animate={{ 
                  width: index === currentIndex ? `${progress}%` : index < currentIndex ? "100%" : "0%" 
                }}
                transition={{ duration: index === currentIndex ? 0.05 : 0.5 }}
              />
            </div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="hidden lg:flex gap-4"
        >
          {BACKGROUNDS.map((item, index) => (
            <motion.div 
              key={item.id} 
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleThumbnailClick(index)}
              className={`w-24 h-16 rounded-xl border-2 overflow-hidden relative group cursor-pointer transition-all duration-300 ${
                index === currentIndex ? 'border-accent-lime ring-4 ring-accent-lime/20' : 'border-white/20'
              }`}
            >
              <Image 
                src={item.thumbnail} 
                alt={`Background ${index + 1}`} 
                fill 
                className={`object-cover transition-opacity ${
                  index === currentIndex ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'
                }`} 
                sizes="100px"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
