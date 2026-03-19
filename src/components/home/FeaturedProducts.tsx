'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { Product } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

function ProductCard({ product }: { product: Product }) {
  const { lang } = useLanguage();
  const { translatedData, isTranslating } = useTranslation(product, product.id, ['name', 'shortDescription']);

  return (
    <Link href={`/produse/${product.slug}`} className="block h-full group/card">
      <motion.div
        whileHover={{ y: -10 }}
        className="flex flex-col h-full bg-white rounded-[2.5rem] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-neutral-100 hover:shadow-[0_30px_70px_rgba(0,0,0,0.08)] transition-all duration-500"
      >
        <div className="relative aspect-[4/3] w-full rounded-[2rem] overflow-hidden mb-8">
          <Image 
            src={product.mainImage || 'https://picsum.photos/seed/placeholder/800/600'} 
            alt={product.name} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover/card:scale-110 transition-transform duration-1000"
          />
        </div>
        
        <div className="px-4 pb-4 flex flex-col flex-1">
          <h3 className={cn(
            "font-headline font-extrabold text-2xl md:text-3xl text-neutral-900 mb-4 group-hover/card:text-accent-lime transition-all leading-tight",
            isTranslating && "animate-pulse blur-[2px]"
          )}>
            {translatedData?.name}
          </h3>
          
          <p className={cn(
            "text-neutral-500 text-sm mb-10 font-body leading-relaxed line-clamp-3 transition-all",
            isTranslating && "animate-pulse opacity-50"
          )}>
            {translatedData?.shortDescription}
          </p>
          
          <div className="mt-auto">
            <div 
              className="bg-neutral-900 group-hover/card:bg-black text-white rounded-full p-1.5 flex items-center justify-between transition-all duration-300 shadow-xl shadow-black/10"
            >
              <span className="pl-6 text-[12px] font-bold uppercase tracking-wider">{t[lang].viewDetails}</span>
              <div 
                className="w-11 h-11 bg-white rounded-full flex items-center justify-center transition-transform group-hover/card:rotate-45"
              >
                <ArrowUpRight size={20} className="text-black" strokeWidth={3} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export function FeaturedProducts() {
  const db = useFirestore();
  const { lang } = useLanguage();

  const featuredQuery = useMemoFirebase(() => {
    return query(
      collection(db, 'products'),
      where('isFeatured', '==', true),
      limit(10)
    );
  }, [db]);

  const { data: products, isLoading } = useCollection<Product>(featuredQuery);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return [...products]
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 3);
  }, [products]);

  return (
    <section className="py-24 px-6 md:px-14 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-accent-lime/10 text-accent-lime rounded-full text-[10px] font-bold uppercase tracking-widest mb-4"
          >
            {t[lang].topEquipment}
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-headline font-extrabold text-4xl md:text-6xl text-neutral-900 tracking-tight mb-10"
          >
            {t[lang].featuredProducts}
          </motion.h2>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-accent-lime" />
            <p className="mt-4 text-neutral-400 font-bold uppercase tracking-widest text-xs">Loading...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 rounded-[3rem] border border-dashed border-neutral-200">
             <p className="text-neutral-400 font-bold uppercase tracking-widest text-sm">No products found.</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
