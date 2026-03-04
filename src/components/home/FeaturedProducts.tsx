'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { ArrowUpRight, Calendar } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const CATEGORIES = ['Toate', 'Tractoare', 'Combine', 'Irigații', 'Echipamente'];

export function FeaturedProducts() {
  const [activeCategory, setActiveCategory] = useState('Toate');

  return (
    <section className="py-24 px-6 md:px-14 bg-white">
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 bg-accent-lime/10 text-accent-lime rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            Utilaje de Top
          </div>
          <h2 className="font-headline font-extrabold text-5xl md:text-6xl text-neutral-900 tracking-tight mb-12">
            Produse Recomandate
          </h2>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 bg-neutral-50 p-2 rounded-full w-fit mx-auto border border-neutral-100">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-8 py-3 rounded-full text-sm font-bold transition-all duration-300",
                  activeCategory === cat 
                    ? "bg-accent-lime text-black shadow-lg" 
                    : "text-neutral-500 hover:text-neutral-900"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {MOCK_PRODUCTS.slice(0, 3).map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="group flex flex-col h-full bg-white rounded-[2.5rem] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-neutral-100 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500"
            >
              {/* Product Image Container */}
              <div className="relative aspect-[4/3] w-full rounded-[2rem] overflow-hidden mb-8">
                <Image 
                  src={product.mainImage} 
                  alt={product.name} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-6 left-6 flex items-center gap-2 bg-neutral-900/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                  <div className="w-2 h-2 bg-accent-lime rounded-full animate-pulse" />
                  <span className="text-white text-[10px] font-bold uppercase tracking-widest">Inovație</span>
                </div>
              </div>
              
              {/* Product Content */}
              <div className="px-4 pb-4 flex flex-col flex-1">
                <h3 className="font-headline font-extrabold text-3xl text-neutral-900 mb-6 group-hover:text-accent-lime transition-colors leading-tight">
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-2 text-neutral-400 mb-10">
                  <Calendar size={16} />
                  <span className="text-sm font-medium tracking-tight">Postat la 14 Mai, 2024</span>
                </div>
                
                {/* Custom "See More" Button Style */}
                <div className="mt-auto">
                  <Link href={`/produse/${product.slug}`}>
                    <div className="bg-neutral-900 hover:bg-black text-white rounded-full p-1.5 flex items-center justify-between transition-all duration-300 group/btn">
                      <span className="pl-8 text-sm font-bold uppercase tracking-wider">Vezi detalii</span>
                      <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center transition-transform group-hover/btn:scale-95 group-hover/btn:rotate-12">
                        <ArrowUpRight size={20} className="text-black" strokeWidth={2.5} />
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
