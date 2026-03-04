'use client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { Search, LayoutGrid, List, ArrowUpRight, FilterX, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '@/hooks/useProducts';
import { useState } from 'react';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Cele mai noi' },
  { value: 'price_asc', label: 'Preț crescător' },
  { value: 'price_desc', label: 'Preț descrescător' },
  { value: 'name_asc', label: 'Nume A-Z' },
];

export default function CatalogPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const db = useFirestore();
  
  // Categorii dinamice din Firestore
  const categoriesQuery = useMemoFirebase(() => query(collection(db, 'categories'), orderBy('order', 'asc')), [db]);
  const { data: categories } = useCollection(categoriesQuery);

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

  return (
    <>
      <Navbar />
      <main className="pt-[140px] pb-24 px-6 md:px-14 bg-neutral-50 min-h-screen">
        <div className="max-w-[1440px] mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16">
            <div className="space-y-4">
              <div className="flex gap-2 text-[10px] text-neutral-400 uppercase font-extrabold tracking-widest">
                <Link href="/" className="hover:text-accent-lime transition-colors">Acasă</Link>
                <span className="opacity-30">/</span>
                <span className="text-neutral-900">Catalog Produse</span>
              </div>
              <h1 className="font-headline font-extrabold text-5xl md:text-7xl text-neutral-900 tracking-tighter uppercase leading-none">
                Utilaje <span className="text-accent-lime">Agricole</span>
              </h1>
            </div>
            
            {/* Sort & View Options */}
            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:flex-none min-w-[200px]">
                <select 
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full h-14 bg-white border-none rounded-2xl px-6 text-sm font-bold appearance-none shadow-sm focus:ring-2 focus:ring-accent-lime outline-none cursor-pointer"
                >
                  {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={16} />
              </div>

              <div className="flex items-center bg-white rounded-2xl p-1 shadow-sm border border-neutral-100">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={cn("p-3 rounded-xl transition-all", viewMode === 'grid' ? "bg-neutral-900 text-white shadow-lg" : "text-neutral-400 hover:bg-neutral-50")}
                >
                  <LayoutGrid size={20} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={cn("p-3 rounded-xl transition-all", viewMode === 'list' ? "bg-neutral-900 text-white shadow-lg" : "text-neutral-400 hover:bg-neutral-50")}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Sidebar Filters */}
            <aside className="lg:w-80 shrink-0 space-y-10 sticky top-[120px] h-fit">
              {/* Search */}
              <div className="space-y-4">
                <h3 className="font-headline font-extrabold text-[12px] uppercase tracking-widest text-neutral-900">Căutare</h3>
                <div className="relative">
                  <Input 
                    placeholder="Nume utilaj, marcă..." 
                    value={filters.searchQuery || ''}
                    onChange={(e) => updateFilter('searchQuery', e.target.value)}
                    className="h-14 bg-white border-none rounded-2xl pl-12 shadow-sm focus-visible:ring-accent-lime"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-4">
                <h3 className="font-headline font-extrabold text-[12px] uppercase tracking-widest text-neutral-900">Categorii</h3>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => updateFilter('category', 'toate')}
                    className={cn(
                      "flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-bold transition-all",
                      !filters.category || filters.category === 'toate' ? "bg-accent-lime text-black" : "bg-white text-neutral-500 hover:bg-white/80"
                    )}
                  >
                    <span>Toate Produsele</span>
                    {!filters.category || filters.category === 'toate' ? <div className="w-1.5 h-1.5 bg-black rounded-full" /> : null}
                  </button>
                  {categories?.map(cat => (
                    <button 
                      key={cat.id}
                      onClick={() => updateFilter('category', cat.slug)}
                      className={cn(
                        "flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-bold transition-all",
                        filters.category === cat.slug ? "bg-accent-lime text-black" : "bg-white text-neutral-500 hover:bg-white/80"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{cat.icon}</span>
                        <span>{cat.name}</span>
                      </div>
                      {filters.category === cat.slug ? <div className="w-1.5 h-1.5 bg-black rounded-full" /> : null}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Filters */}
              <div className="space-y-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-neutral-100">
                <h3 className="font-headline font-extrabold text-[12px] uppercase tracking-widest text-neutral-900">Status</h3>
                <div className="space-y-4">
                  {[
                    { key: 'inStock', label: 'Doar în stoc' },
                    { key: 'isNew', label: 'Produse noi' },
                    { key: 'isOnSale', label: 'Promoții' },
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
                  Resetează Filtrele ({activeFilterCount})
                </Button>
              )}
            </aside>

            {/* Catalog Results */}
            <div className="flex-1">
              {isLoading ? (
                <div className={cn("grid gap-10", viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}>
                  {[1, 2, 4, 6].map(i => (
                    <div key={i} className="bg-white rounded-[2.5rem] h-[500px] animate-pulse border border-neutral-100" />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-40 text-center bg-white rounded-[3rem] border border-dashed border-neutral-200"
                >
                  <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-8">
                    <FilterX size={40} className="text-neutral-300" />
                  </div>
                  <h2 className="font-headline font-extrabold text-3xl text-neutral-900 mb-4">Niciun utilaj găsit</h2>
                  <p className="text-neutral-500 font-medium mb-10 max-w-xs">Încercați să ajustați filtrele sau căutarea pentru a găsi ceea ce doriți.</p>
                  <Button onClick={resetFilters} className="bg-neutral-900 hover:bg-black text-white h-14 px-10 rounded-2xl font-extrabold uppercase tracking-widest text-[10px]">
                    VEZI TOATE PRODUSELE
                  </Button>
                </motion.div>
              ) : (
                <div className={cn("grid gap-10", viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}>
                  <AnimatePresence mode="popLayout">
                    {products.map((product) => (
                      <motion.div 
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className={cn(
                          "bg-white group border border-neutral-100 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden rounded-[2.5rem] p-6 md:p-8 flex flex-col",
                          viewMode === 'list' ? "md:flex-row gap-10" : ""
                        )}
                      >
                        {/* Imagine */}
                        <div className={cn(
                          "relative bg-neutral-100 overflow-hidden rounded-[2rem]",
                          viewMode === 'list' ? "w-full md:w-[400px] h-[300px] shrink-0" : "aspect-[4/3] mb-8"
                        )}>
                          <Image 
                            src={product.mainImage || 'https://picsum.photos/seed/placeholder/800/600'} 
                            alt={product.name} 
                            fill 
                            className="object-cover group-hover:scale-110 transition-transform duration-1000"
                          />
                          <div className="absolute top-5 left-5 flex gap-2">
                            {product.inStock ? (
                              <span className="text-[9px] font-extrabold text-black bg-accent-lime px-4 py-2 rounded-full tracking-widest uppercase shadow-lg shadow-black/5">ÎN STOC</span>
                            ) : (
                              <span className="text-[9px] font-extrabold text-white bg-neutral-900/60 backdrop-blur-md px-4 py-2 rounded-full tracking-widest uppercase">LA COMANDĂ</span>
                            )}
                            {product.isNew && (
                              <span className="text-[9px] font-extrabold text-white bg-blue-600 px-4 py-2 rounded-full tracking-widest uppercase shadow-lg shadow-blue-600/20">NOU</span>
                            )}
                          </div>
                        </div>
                        
                        {/* Info */}
                        <div className="flex flex-col flex-1">
                          <div className="mb-6">
                            <span className="text-green-700 font-extrabold text-[10px] uppercase tracking-[0.4em] block mb-3">{product.brand}</span>
                            <h2 className="font-headline font-extrabold text-2xl md:text-3xl text-neutral-900 group-hover:text-green-800 transition-colors tracking-tighter leading-tight">{product.name}</h2>
                          </div>
                          
                          <p className="text-neutral-500 text-sm line-clamp-2 mb-10 font-body leading-relaxed">{product.shortDescription}</p>
                          
                          <div className="mt-auto pt-8 border-t border-neutral-100 flex items-center justify-between gap-6">
                             <div className="flex flex-col">
                                <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mb-1 leading-none">Preț estimativ</span>
                                <span className="font-headline font-extrabold text-2xl text-neutral-900 tracking-tighter">
                                  {product.priceOnRequest ? "LA CERERE" : `${product.price.toLocaleString()} RON`}
                                </span>
                             </div>
                             <Link href={`/produse/${product.slug}`} className="shrink-0">
                                <Button className="bg-neutral-900 hover:bg-black text-white rounded-full h-14 pl-8 pr-1.5 flex items-center gap-10 transition-all group/btn shadow-2xl shadow-black/10">
                                  <span className="text-[10px] font-extrabold uppercase tracking-widest">DETALII</span>
                                  <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center transition-transform group-hover/btn:rotate-45">
                                    <ArrowUpRight size={20} className="text-black" strokeWidth={3} />
                                  </div>
                                </Button>
                             </Link>
                          </div>
                        </div>
                      </motion.div>
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
