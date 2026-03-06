'use client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { Search, LayoutGrid, List, ArrowUpRight, FilterX, SlidersHorizontal, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '@/hooks/useProducts';
import { useState } from 'react';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function ProductCard({ product, viewMode }: { product: any, viewMode: 'grid' | 'list' }) {
  const { lang } = useLanguage();
  const { translatedData, isTranslating } = useTranslation(product, product.id, ['name', 'shortDescription']);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "bg-white group border border-neutral-100 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-8 flex flex-col",
        viewMode === 'list' ? "md:flex-row gap-6 md:gap-10" : ""
      )}
    >
      {/* Imagine */}
      <div className={cn(
        "relative bg-neutral-100 overflow-hidden rounded-[1.5rem] md:rounded-[2rem]",
        viewMode === 'list' ? "w-full md:w-[400px] aspect-[16/10] md:h-[300px] shrink-0" : "aspect-[16/10] md:aspect-[4/3] mb-6 md:mb-8"
      )}>
        <Image 
          src={product.mainImage || 'https://picsum.photos/seed/placeholder/800/600'} 
          alt={product.name} 
          fill 
          className="object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        <div className="absolute top-3 left-3 md:top-5 md:left-5 flex gap-1.5 md:gap-2">
          {product.inStock ? (
            <span className="text-[8px] md:text-[9px] font-extrabold text-black bg-accent-lime px-3 md:px-4 py-1.5 md:py-2 rounded-full tracking-widest uppercase shadow-lg shadow-black/5">
              {product.inStock ? (lang === 'ro' ? 'ÎN STOC' : 'IN STOCK') : ''}
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
      <div className="flex flex-col flex-1 px-2 md:px-0">
        <div className="mb-4 md:mb-6">
          <span className="text-green-700 font-extrabold text-[9px] md:text-[10px] uppercase tracking-[0.4em] block mb-2 md:mb-3">{product.brand}</span>
          <h2 className={cn(
            "font-headline font-extrabold text-xl md:text-2xl lg:text-3xl text-neutral-900 group-hover:text-green-800 transition-all tracking-tighter leading-tight",
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
        
        <div className="mt-auto pt-6 md:pt-8 border-t border-neutral-100 flex items-center justify-between gap-4">
           <div className="flex flex-col">
              <span className="text-[9px] md:text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mb-1 leading-none">
                {lang === 'ro' ? 'Preț estimativ' : 'Estimated price'}
              </span>
              <span className="font-headline font-extrabold text-lg md:text-2xl text-neutral-900 tracking-tighter">
                {product.priceOnRequest ? t[lang].priceOnRequest : `${product.price.toLocaleString()} RON`}
              </span>
           </div>
           <Link href={`/produse/${product.slug}`} className="shrink-0">
              <button className="bg-neutral-900 hover:bg-black text-white rounded-full h-11 md:h-14 pl-5 md:pl-8 pr-1 md:pr-1.5 flex items-center gap-6 md:gap-10 transition-all group/btn shadow-xl shadow-black/5">
                <span className="text-[9px] md:text-[10px] font-extrabold uppercase tracking-widest">{t[lang].details}</span>
                <div className="w-9 h-9 md:w-11 md:h-11 bg-white rounded-full flex items-center justify-center transition-transform group-hover/btn:rotate-45">
                  <ArrowUpRight size={20} className="text-black" strokeWidth={3} />
                </div>
              </button>
           </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function CatalogPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const { lang } = useLanguage();
  
  const { 
    products, 
    isLoading, 
    filters, 
    sort, 
    setSort, 
    updateFilter, 
    resetFilters, 
    activeFilterCount 
  } = useProducts();

  const activeCategoryName = filters.category && filters.category !== 'toate' 
    ? (t[lang][filters.category as keyof typeof t.ro] || PRODUCT_CATEGORIES.find(c => c.slug === filters.category)?.name)
    : t[lang].allProducts;

  const SORT_OPTIONS = [
    { value: 'newest', label: t[lang].sortNewest },
    { value: 'price_asc', label: t[lang].sortPriceAsc },
    { value: 'price_desc', label: t[lang].sortPriceDesc },
    { value: 'name_asc', label: t[lang].sortNameAsc },
  ];

  const FilterContent = () => (
    <div className="space-y-10">
      <div className="space-y-4">
        <h3 className="font-headline font-extrabold text-[12px] uppercase tracking-widest text-neutral-900">{t[lang].search}</h3>
        <div className="relative">
          <Input 
            placeholder={t[lang].searchPlaceholder} 
            value={filters.searchQuery || ''}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            className="h-14 bg-white md:bg-neutral-50 border-none rounded-2xl pl-12 shadow-sm focus-visible:ring-accent-lime"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
        </div>
      </div>

      <div className="space-y-4 bg-white md:bg-neutral-50 p-6 rounded-[2.5rem] shadow-sm border border-neutral-100">
        <Accordion type="single" collapsible defaultValue="categories" className="w-full">
          <AccordionItem value="categories" className="border-none">
            <AccordionTrigger className="hover:no-underline py-0 group">
              <div className="flex flex-col items-start text-left">
                <h3 className="font-headline font-extrabold text-[12px] uppercase tracking-widest text-neutral-900 mb-1">{t[lang].category}</h3>
                <p className="text-accent-lime text-[11px] font-bold uppercase">{activeCategoryName}</p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-6">
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                <button
                  onClick={() => updateFilter('category', 'toate')}
                  className={cn(
                    "text-left px-4 py-3 rounded-xl text-xs font-bold transition-all",
                    (!filters.category || filters.category === 'toate') 
                      ? "bg-neutral-900 text-white" 
                      : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                  )}
                >
                  {t[lang].allProducts}
                </button>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => updateFilter('category', cat.slug)}
                    className={cn(
                      "text-left px-4 py-3 rounded-xl text-xs font-bold transition-all",
                      filters.category === cat.slug 
                        ? "bg-neutral-900 text-white" 
                        : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                    )}
                  >
                    {t[lang][cat.slug as keyof typeof t.ro] || cat.name}
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="space-y-4 bg-white md:bg-neutral-50 p-8 rounded-[2.5rem] shadow-sm border border-neutral-100">
        <h3 className="font-headline font-extrabold text-[12px] uppercase tracking-widest text-neutral-900">{t[lang].status}</h3>
        <div className="space-y-4">
          {[
            { key: 'inStock', label: t[lang].filterInStock },
            { key: 'isNew', label: t[lang].filterNew },
            { key: 'isOnSale', label: t[lang].filterSale },
          ].map(item => (
            <label key={item.key} className="flex items-center justify-between group cursor-pointer">
              <span className="text-sm font-bold text-neutral-500 group-hover:text-neutral-900 transition-colors">{item.label}</span>
              <input 
                type="checkbox" 
                checked={!!filters[item.key as keyof typeof filters]}
                onChange={(e) => updateFilter(item.key as any, e.target.checked)}
                className="w-5 h-5 accent-accent-lime rounded-lg cursor-pointer"
              />
            </label>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <Button 
          onClick={resetFilters}
          variant="ghost"
          className="w-full h-14 rounded-2xl text-red-500 font-extrabold text-[10px] uppercase tracking-widest hover:bg-red-50"
        >
          {t[lang].resetFilters} ({activeFilterCount})
        </Button>
      )}
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="pt-[100px] md:pt-[140px] pb-24 px-4 md:px-14 bg-neutral-50 min-h-screen">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 md:gap-8 mb-10 md:mb-16">
            <div className="space-y-2 md:space-y-4">
              <div className="flex gap-2 text-[9px] md:text-[10px] text-neutral-400 uppercase font-extrabold tracking-widest">
                <Link href="/" className="hover:text-accent-lime transition-colors">{t[lang].home}</Link>
                <span className="opacity-30">/</span>
                <span className="text-neutral-900">{t[lang].products}</span>
              </div>
              <h1 className="font-headline font-extrabold text-3xl md:text-5xl lg:text-7xl text-neutral-900 tracking-tighter uppercase leading-none">
                {lang === 'ro' ? 'Utilaje' : 'Agricultural'} <span className="text-accent-lime">{lang === 'ro' ? 'Agricole' : 'Equipment'}</span>
              </h1>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="flex-1 lg:flex-none">
                <Select value={sort} onValueChange={(val) => setSort(val)}>
                  <SelectTrigger className="w-full min-w-[160px] h-12 md:h-14 bg-white border-none rounded-xl md:rounded-2xl px-4 md:px-6 text-xs md:text-sm font-bold shadow-sm focus:ring-2 focus:ring-accent-lime outline-none">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-xl">
                    {SORT_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value} className="font-medium focus:bg-accent-lime/10">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="lg:hidden">
                <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="h-12 bg-white border-none rounded-xl px-5 gap-2 font-bold text-xs shadow-sm relative">
                      <SlidersHorizontal size={16} />
                      FILTERS
                      {activeFilterCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-accent-lime text-black text-[9px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                          {activeFilterCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[85%] sm:w-[400px] p-0 border-none bg-white">
                    <SheetHeader className="p-6 border-b border-neutral-100 flex-row justify-between items-center space-y-0">
                      <SheetTitle className="font-headline font-extrabold text-lg uppercase tracking-tight">Filtre</SheetTitle>
                    </SheetHeader>
                    <div className="p-6 h-[calc(100vh-80px)] overflow-y-auto">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="flex items-center bg-white rounded-xl md:rounded-2xl p-1 shadow-sm border border-neutral-100">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={cn("p-2 md:p-3 rounded-lg md:rounded-xl transition-all", viewMode === 'grid' ? "bg-neutral-900 text-white shadow-lg" : "text-neutral-400 hover:bg-neutral-50")}
                >
                  <LayoutGrid size={20} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={cn("p-2 md:p-3 rounded-lg md:rounded-xl transition-all", viewMode === 'list' ? "bg-neutral-900 text-white shadow-lg" : "text-neutral-400 hover:bg-neutral-50")}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            <aside className="hidden lg:block lg:w-80 shrink-0 space-y-10 sticky top-[120px] h-fit">
              <FilterContent />
            </aside>

            <div className="flex-1">
              {isLoading ? (
                <div className={cn("grid gap-6 md:gap-10", viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white rounded-[2rem] md:rounded-[2.5rem] h-[400px] md:h-[500px] animate-pulse border border-neutral-100" />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-24 md:py-40 text-center bg-white rounded-[2rem] md:rounded-[3rem] border border-dashed border-neutral-200"
                >
                  <h2 className="font-headline font-extrabold text-2xl md:text-3xl text-neutral-900 mb-3 md:mb-4">{t[lang].noProductsFound}</h2>
                  <p className="text-neutral-500 font-medium mb-8 md:mb-10 max-w-xs text-sm md:text-base px-6">{t[lang].tryAdjustFilters}</p>
                  <Button onClick={resetFilters} className="bg-neutral-900 hover:bg-black text-white h-12 md:h-14 px-8 md:px-10 rounded-xl md:rounded-2xl font-extrabold uppercase tracking-widest text-[9px] md:text-[10px]">
                    {t[lang].allProducts}
                  </Button>
                </motion.div>
              ) : (
                <div className={cn("grid gap-6 md:gap-10", viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}>
                  <AnimatePresence mode="popLayout">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} viewMode={viewMode} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
