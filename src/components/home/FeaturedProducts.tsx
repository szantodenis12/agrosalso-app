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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="py-24 px-6 md:px-14 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-accent-lime/10 text-accent-lime rounded-full text-[10px] font-bold uppercase tracking-widest mb-4"
          >
            Utilaje de Top
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-headline font-extrabold text-4xl md:text-6xl text-neutral-900 tracking-tight mb-10"
          >
            Produse Recomandate
          </motion.h2>

          {/* Category Filters */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 md:gap-4 bg-neutral-50 p-2 rounded-full w-fit mx-auto border border-neutral-100 mb-16"
          >
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-6 py-2.5 md:px-8 md:py-3 rounded-full text-xs md:text-sm font-bold transition-all duration-300",
                  activeCategory === cat 
                    ? "bg-accent-lime text-black shadow-lg shadow-accent-lime/20" 
                    : "text-neutral-500 hover:text-neutral-900"
                )}
              >
                {cat}
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Product Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {MOCK_PRODUCTS.slice(0, 3).map((product) => (
            <motion.div
              key={product.id}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="group flex flex-col h-full bg-white rounded-[2.5rem] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-neutral-100 hover:shadow-[0_30px_70px_rgba(0,0,0,0.08)] transition-all duration-500"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full rounded-[2rem] overflow-hidden mb-8">
                <Image 
                  src={product.mainImage} 
                  alt={product.name} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute top-5 left-5 flex items-center gap-2 bg-neutral-900/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                  <div className="w-2 h-2 bg-accent-lime rounded-full animate-pulse" />
                  <span className="text-white text-[10px] font-bold uppercase tracking-widest">Inovație</span>
                </div>
              </div>
              
              {/* Content */}
              <div className="px-4 pb-4 flex flex-col flex-1">
                <h3 className="font-headline font-extrabold text-2xl md:text-3xl text-neutral-900 mb-4 group-hover:text-accent-lime transition-colors leading-tight">
                  {product.name}
                </h3>
                
                <p className="text-neutral-500 text-sm mb-10 font-body leading-relaxed line-clamp-3">
                  {product.shortDescription}
                </p>
                
                <div className="mt-auto">
                  <Link href={`/produse/${product.slug}`}>
                    <motion.div 
                      whileHover={{ x: 5 }}
                      className="bg-neutral-900 hover:bg-black text-white rounded-full p-1.5 flex items-center justify-between transition-all duration-300 group/btn shadow-xl shadow-black/10"
                    >
                      <span className="pl-6 text-[12px] font-bold uppercase tracking-wider">Vezi detalii</span>
                      <motion.div 
                        whileHover={{ rotate: 45 }}
                        className="w-11 h-11 bg-white rounded-full flex items-center justify-center transition-transform"
                      >
                        <ArrowUpRight size={20} className="text-black" strokeWidth={3} />
                      </motion.div>
                    </motion.div>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
