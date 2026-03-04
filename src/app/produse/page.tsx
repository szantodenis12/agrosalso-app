
'use client';
import { useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ChevronDown, LayoutGrid, List, ArrowUpRight, FilterX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function CatalogPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const db = useFirestore();

  // Categories query
  const categoriesQuery = useMemoFirebase(() => {
    return query(collection(db, 'categories'), orderBy('order', 'asc'));
  }, [db]);
  const { data: categories } = useCollection(categoriesQuery);

  // Products query with filters
  const productsQuery = useMemoFirebase(() => {
    let q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    if (selectedCategory) {
      q = query(collection(db, 'products'), where('category', '==', selectedCategory), orderBy('createdAt', 'desc'));
    }
    return q;
  }, [db, selectedCategory]);
  
  const { data: allProducts, isLoading } = useCollection(productsQuery);

  // Client-side search filtering
  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];
    if (!searchQuery) return allProducts;
    const search = searchQuery.toLowerCase();
    return allProducts.filter(p => 
      p.name.toLowerCase().includes(search) || 
      p.brand.toLowerCase().includes(search)
    );
  }, [allProducts, searchQuery]);

  return (
    <>
      <Navbar />
      <main className="pt-[140px] pb-24 px-6 md:px-14 bg-neutral-50 min-h-screen">
        <div className="max-w-[1440px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex gap-2 text-[10px] text-neutral-400 uppercase font-extrabold tracking-widest mb-12">
            <Link href="/" className="hover:text-green-800 transition-colors">Acasă</Link>
            <span className="opacity-30">/</span>
            <span className="text-neutral-900">Produse</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 shrink-0 space-y-12 sticky top-[120px] h-fit">
              <div>
                <h3 className="font-headline font-extrabold mb-6 text-neutral-900 uppercase text-[12px] tracking-widest">Căutare</h3>
                <div className="relative group">
                  <Input 
                    placeholder="Ex: John Deere..." 
                    className="pl-10 h-14 bg-white border-neutral-100 rounded-2xl shadow-sm group-hover:border-accent-lime transition-all focus-visible:ring-accent-lime"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-accent-lime transition-colors" size={18} />
                </div>
              </div>

              <div>
                <h3 className="font-headline font-extrabold mb-6 text-neutral-900 uppercase text-[12px] tracking-widest">Categorii</h3>
                <div className="space-y-4">
                  <div 
                    className="flex items-center space-x-3 group cursor-pointer"
                    onClick={() => setSelectedCategory(null)}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center transition-all",
                      !selectedCategory ? "bg-accent-lime border-accent-lime" : "border-neutral-200"
                    )}>
                      {!selectedCategory && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                    </div>
                    <span className={cn("text-sm font-bold transition-colors", !selectedCategory ? "text-neutral-900" : "text-neutral-500 group-hover:text-neutral-900")}>Toate Produsele</span>
                  </div>

                  {categories?.map(cat => (
                    <div 
                      key={cat.id} 
                      className="flex items-center justify-between group cursor-pointer"
                      onClick={() => setSelectedCategory(cat.slug)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={cn(
                          "w-4 h-4 rounded border flex items-center justify-center transition-all",
                          selectedCategory === cat.slug ? "bg-accent-lime border-accent-lime" : "border-neutral-200"
                        )}>
                          {selectedCategory === cat.slug && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                        </div>
                        <span className={cn("text-sm font-bold transition-colors", selectedCategory === cat.slug ? "text-neutral-900" : "text-neutral-500 group-hover:text-neutral-900")}>
                          {cat.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-extrabold text-neutral-300">{cat.productCount}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-neutral-200/50" />

              <Button 
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery('');
                }}
                className="w-full bg-neutral-900 hover:bg-black text-white font-extrabold h-14 rounded-2xl tracking-widest text-[10px] uppercase transition-all shadow-lg"
              >
                RESETEAZĂ FILTRELE
              </Button>
            </aside>

            {/* Catalog Grid */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-8 border-b border-neutral-200/50">
                <h1 className="font-headline font-extrabold text-4xl md:text-5xl text-neutral-900 tracking-tighter uppercase leading-none">
                  Catalog <br className="md:hidden" /> <span className="text-accent-lime">Echipamente</span>
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-neutral-100 bg-white rounded-xl p-1 shadow-sm overflow-hidden">
                    <button 
                      onClick={() => setViewMode('grid')}
                      className={cn("p-2.5 rounded-lg transition-all", viewMode === 'grid' ? "bg-neutral-900 text-white shadow-lg" : "text-neutral-400 hover:bg-neutral-50")}
                    >
                      <LayoutGrid size={18} />
                    </button>
                    <button 
                      onClick={() => setViewMode('list')}
                      className={cn("p-2.5 rounded-lg transition-all", viewMode === 'list' ? "bg-neutral-900 text-white shadow-lg" : "text-neutral-400 hover:bg-neutral-50")}
                    >
                      <List size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div 
                    key="loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-10"
                  >
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="bg-white rounded-[2.5rem] h-[400px] animate-pulse border border-neutral-100" />
                    ))}
                  </motion.div>
                ) : filteredProducts.length === 0 ? (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-40 text-center"
                  >
                    <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
                      <FilterX size={32} className="text-neutral-300" />
                    </div>
                    <h2 className="font-headline font-extrabold text-2xl text-neutral-900 mb-2">Niciun utilaj găsit</h2>
                    <p className="text-neutral-500 font-medium">Încercați alte filtre sau resetați căutarea.</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(
                      "grid gap-10",
                      viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                    )}
                  >
                    {filteredProducts.map((product, idx) => (
                      <motion.div 
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        className={cn(
                          "bg-white group border border-neutral-100 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.06)] transition-all duration-500 overflow-hidden rounded-[2.5rem] p-6 md:p-8 flex flex-col",
                          viewMode === 'list' ? "md:flex-row gap-8" : ""
                        )}
                      >
                        <div className={cn(
                          "relative bg-neutral-100 overflow-hidden rounded-[2rem]",
                          viewMode === 'list' ? "w-full md:w-[320px] h-[240px] shrink-0" : "aspect-[4/3] mb-8"
                        )}>
                          <Image 
                            src={product.mainImage} 
                            alt={product.name} 
                            fill 
                            className="object-cover group-hover:scale-110 transition-transform duration-1000"
                          />
                          <div className="absolute top-4 left-4">
                            {product.inStock ? (
                              <span className="text-[9px] font-extrabold text-black bg-accent-lime px-3 py-1.5 rounded-full tracking-widest uppercase">ÎN STOC</span>
                            ) : (
                              <span className="text-[9px] font-extrabold text-white bg-neutral-900/60 backdrop-blur-md px-3 py-1.5 rounded-full tracking-widest uppercase">LA COMANDĂ</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col flex-1">
                          <div className="mb-4">
                            <span className="text-green-700 font-extrabold text-[10px] uppercase tracking-[0.3em] block mb-2">{product.brand}</span>
                            <h2 className="font-headline font-extrabold text-2xl text-neutral-900 group-hover:text-green-800 transition-colors tracking-tight leading-tight">{product.name}</h2>
                          </div>
                          
                          <p className="text-neutral-500 text-sm line-clamp-2 mb-8 font-body leading-relaxed">{product.shortDescription}</p>
                          
                          <div className="mt-auto pt-6 border-t border-neutral-100 flex items-center justify-between gap-4">
                             <div className="flex flex-col">
                                <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mb-1 leading-none">Preț estimativ</span>
                                <span className="font-headline font-extrabold text-lg md:text-xl text-neutral-900 tracking-tight">
                                  {product.priceOnRequest ? "LA CERERE" : `${product.price.toLocaleString()} RON`}
                                </span>
                             </div>
                             <Link href={`/produse/${product.slug}`} className="shrink-0">
                                <Button className="bg-neutral-900 hover:bg-black text-white rounded-full h-12 pl-6 pr-1.5 flex items-center gap-8 transition-all group/btn shadow-xl shadow-black/5">
                                  <span className="text-[9px] font-extrabold uppercase tracking-widest">VEZI DETALII</span>
                                  <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center transition-transform group-hover/btn:rotate-45">
                                    <ArrowUpRight size={16} className="text-black" strokeWidth={3} />
                                  </div>
                                </Button>
                             </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
