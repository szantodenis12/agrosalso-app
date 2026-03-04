'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const CATEGORIES = ['Toate', 'Tractoare', 'Combine', 'Irigații', 'Echipamente'];

export function FeaturedProducts() {
  const [activeCategory, setActiveCategory] = useState('Toate');

  return (
    <section className="py-20 px-6 md:px-14 bg-white">
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block px-4 py-1.5 bg-accent-lime/10 text-accent-lime rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
            Utilaje de Top
          </div>
          <h2 className="font-headline font-extrabold text-3xl md:text-5xl text-neutral-900 tracking-tight mb-8 md:mb-10">
            Produse Recomandate
          </h2>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 bg-neutral-50 p-1.5 rounded-full w-fit mx-auto border border-neutral-100 mb-12">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-5 py-2 md:px-7 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all duration-300",
                  activeCategory === cat 
                    ? "bg-accent-lime text-black shadow-md" 
                    : "text-neutral-500 hover:text-neutral-900"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {MOCK_PRODUCTS.slice(0, 3).map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="group flex flex-col h-full bg-white rounded-[2rem] p-3 shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-neutral-100 hover:shadow-[0_25px_50px_rgba(0,0,0,0.07)] transition-all duration-500"
            >
              {/* Product Image Container */}
              <div className="relative aspect-[4/3] w-full rounded-[1.5rem] overflow-hidden mb-6">
                <Image 
                  src={product.mainImage} 
                  alt={product.name} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-neutral-900/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                  <div className="w-1.5 h-1.5 bg-accent-lime rounded-full animate-pulse" />
                  <span className="text-white text-[9px] font-bold uppercase tracking-widest">Inovație</span>
                </div>
              </div>
              
              {/* Product Content */}
              <div className="px-3 pb-3 flex flex-col flex-1">
                <h3 className="font-headline font-extrabold text-xl md:text-2xl text-neutral-900 mb-3 group-hover:text-accent-lime transition-colors leading-tight">
                  {product.name}
                </h3>
                
                <p className="text-neutral-500 text-sm mb-8 font-body leading-relaxed line-clamp-3">
                  {product.shortDescription}
                </p>
                
                {/* Custom "See More" Button Style - More compact */}
                <div className="mt-auto">
                  <Link href={`/produse/${product.slug}`}>
                    <div className="bg-neutral-900 hover:bg-black text-white rounded-full p-1 flex items-center justify-between transition-all duration-300 group/btn">
                      <span className="pl-6 text-[11px] font-bold uppercase tracking-wider">Vezi detalii</span>
                      <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center transition-transform group-hover/btn:scale-95 group-hover/btn:rotate-12">
                        <ArrowUpRight size={16} className="text-black" strokeWidth={3} />
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
