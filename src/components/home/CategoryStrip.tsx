
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MOCK_CATEGORIES } from '@/lib/mock-data';

export function CategoryStrip() {
  return (
    <section className="bg-neutral-900 border-y border-white/5">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-white/5">
          {MOCK_CATEGORIES.map((cat, idx) => (
            <Link 
              key={cat.id} 
              href={`/produse?categorie=${cat.slug}`}
              className="group relative flex flex-col items-center justify-center py-12 px-6 transition-all hover:bg-white/5 overflow-hidden"
            >
              <motion.span 
                whileHover={{ y: -5, scale: 1.1 }}
                className="text-4xl mb-4 block"
              >
                {cat.icon}
              </motion.span>
              <h3 className="text-white/60 group-hover:text-white font-bold text-[10px] uppercase tracking-[0.2em] text-center transition-colors mb-1">
                {cat.name}
              </h3>
              <span className="text-white/20 text-[9px] font-medium tracking-widest">
                {cat.productCount} PRODUSE
              </span>
              
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-yellow-400 transition-all duration-300 group-hover:w-[60%]" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
