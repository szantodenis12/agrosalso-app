'use client';
import Image from 'next/image';
import Link from 'next/link';
import { normalizeSlug } from '@/lib/slug-redirects';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';
import { useTranslation } from '@/hooks/useTranslation';
import { useBfListImage } from '@/hooks/useBlackFriday';
import { useLocalePrice } from '@/hooks/useLocalePrice';

export function ProductCard({ product, viewMode, priority = false, cssEntrance = false }: { product: any, viewMode: 'grid' | 'list', priority?: boolean, cssEntrance?: boolean }) {
  const { lang } = useLanguage();
  const { translatedData, isTranslating } = useTranslation(product);
  const img = useBfListImage(product.slug, product.mainImage || 'https://picsum.photos/seed/placeholder/800/600');
  const priceText = useLocalePrice(Number(product.price) || 0);

  return (
    <Link href={`/produse/${normalizeSlug(product.slug)}`} className="block h-full group/card">
      <motion.div 
        layout
        initial={cssEntrance ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn(
          cssEntrance && "card-enter",
          "bg-white border border-neutral-100 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 flex flex-col h-full",
          viewMode === 'list' ? "md:flex-row gap-6 md:gap-10" : ""
        )}
      >
        {/* Imagine */}
        <div className={cn(
          "relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem]",
          "bg-neutral-100",
          // Coperta BF e pătrată (panoul cu prețul e în partea de jos): cadru pătrat, ca să nu fie decupată.
          img.isCover
            ? (viewMode === 'list' ? "w-full md:w-[300px] aspect-square shrink-0" : "aspect-square mb-5 md:mb-8")
            : (viewMode === 'list' ? "w-full md:w-[400px] aspect-[16/10] md:h-[300px] shrink-0" : "aspect-[16/10] md:aspect-[4/3] mb-5 md:mb-8")
        )}>
          <Image 
            src={img.src} 
            alt={product.name} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            className="object-cover group-hover/card:scale-110 transition-transform duration-1000"
          />
          <div className="absolute top-3 left-3 md:top-5 md:left-5 flex flex-wrap gap-1.5 md:gap-2">
            {product.inStock ? (
              <span className="text-[8px] md:text-[9px] font-extrabold text-black bg-accent-lime px-3 md:px-4 py-1.5 md:py-2 rounded-full tracking-widest uppercase shadow-lg shadow-black/5 backdrop-blur-sm">
                {lang === 'ro' ? 'ÎN STOC' : 'IN STOCK'}
              </span>
            ) : (
              <span className="text-[8px] md:text-[9px] font-extrabold text-white bg-neutral-900/60 backdrop-blur-md px-3 md:px-4 py-1.5 md:py-2 rounded-full tracking-widest uppercase">
                {lang === 'ro' ? 'LA COMANDĂ' : 'TO ORDER'}
              </span>
            )}
            {product.isNew && (
              <span className="text-[8px] md:text-[9px] font-extrabold text-white bg-neutral-900 px-3 md:px-4 py-1.5 md:py-2 rounded-full tracking-widest uppercase shadow-lg shadow-black/20">
                {lang === 'ro' ? 'NOU' : 'NEW'}
              </span>
            )}
          </div>
        </div>
        
        {/* Info */}
        <div className="flex flex-col flex-1">
          <div className="mb-4 md:mb-6">
            <span className="text-accent-lime font-extrabold text-[9px] md:text-[10px] uppercase tracking-[0.4em] block mb-2 md:mb-3">{product.brand}</span>
            <h2 className={cn(
              "font-headline font-extrabold text-lg md:text-2xl lg:text-3xl text-neutral-900 group-hover/card:text-green-800 transition-all tracking-tighter leading-tight",
              isTranslating && "animate-pulse blur-[2px]"
            )}>
              {translatedData?.name}
            </h2>
          </div>
          
          <p className={cn(
            "text-neutral-500 text-xs md:text-sm line-clamp-2 mb-6 md:mb-10 font-body leading-relaxed transition-all",
            isTranslating && "animate-pulse opacity-50"
          )}>
            {translatedData?.shortDescription}
          </p>
          
          <div className="mt-auto pt-5 md:pt-8 border-t border-neutral-100 flex items-center justify-between gap-4">
             <div className="flex flex-col">
                <span className="text-[8px] md:text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mb-1 leading-none">
                  {t[lang].startingFrom}
                </span>
                <span className="font-headline font-extrabold text-base md:text-2xl text-neutral-900 tracking-tighter">
                  {product.priceOnRequest ? t[lang].priceOnRequest : `${priceText} EUR`}
                </span>
             </div>
             <div className="shrink-0">
                <div className="bg-neutral-900 group-hover/card:bg-black text-white rounded-full h-10 md:h-14 pl-4 md:pl-8 pr-1 md:pr-1.5 flex items-center gap-4 md:gap-10 transition-all shadow-xl shadow-black/5">
                  <span className="text-[8px] md:text-[10px] font-extrabold uppercase tracking-widest hidden sm:inline">{t[lang].details}</span>
                  <span className="text-[8px] font-extrabold uppercase tracking-widest sm:hidden">{lang === 'ro' ? 'VEZI' : 'VIEW'}</span>
                  <div className="w-8 h-8 md:w-11 md:h-11 bg-white rounded-full flex items-center justify-center transition-transform group-hover/card:rotate-45">
                    <ArrowUpRight size={16} className="text-black md:size-5" strokeWidth={3} />
                  </div>
                </div>
             </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
