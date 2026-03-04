
'use client';
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/lib/mock-data';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ChevronDown, LayoutGrid, List, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function CatalogPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

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

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            {/* Sidebar Filters */}
            <aside className="lg:w-72 shrink-0 space-y-12 sticky top-[120px] h-fit">
              <div>
                <h3 className="font-headline font-extrabold text-xl mb-6 tracking-tight text-neutral-900">Căutare</h3>
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
                <h3 className="font-headline font-extrabold text-xl mb-6 tracking-tight text-neutral-900">Categorii</h3>
                <div className="space-y-4">
                  {MOCK_CATEGORIES.map(cat => (
                    <div key={cat.id} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <Checkbox id={cat.slug} className="border-neutral-200 data-[state=checked]:bg-accent-lime data-[state=checked]:border-accent-lime data-[state=checked]:text-black" />
                        <label htmlFor={cat.slug} className="text-sm font-bold text-neutral-500 group-hover:text-neutral-900 cursor-pointer transition-colors">{cat.name}</label>
                      </div>
                      <span className="text-[10px] font-extrabold text-neutral-300">{cat.productCount}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-neutral-200/50" />

              <div>
                <h3 className="font-headline font-extrabold text-xl mb-6 tracking-tight text-neutral-900">Disponibilitate</h3>
                <div className="space-y-4">
                  {[
                    { id: 'inStock', label: 'În stoc' },
                    { id: 'new', label: 'Produse noi' },
                    { id: 'sale', label: 'Promoții' }
                  ].map((filter) => (
                    <div key={filter.id} className="flex items-center space-x-3 group cursor-pointer">
                      <Checkbox id={filter.id} className="border-neutral-200 data-[state=checked]:bg-accent-lime data-[state=checked]:border-accent-lime data-[state=checked]:text-black" />
                      <label htmlFor={filter.id} className="text-sm font-bold text-neutral-500 group-hover:text-neutral-900 cursor-pointer transition-colors">{filter.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full bg-neutral-900 hover:bg-black text-white font-extrabold h-14 rounded-2xl tracking-widest text-[10px] uppercase">
                RESETEAZĂ FILTRELE
              </Button>
            </aside>

            {/* Catalog Grid */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-8 border-b border-neutral-200/50">
                <h1 className="font-headline font-extrabold text-4xl md:text-5xl text-neutral-900 tracking-tighter uppercase leading-none">
                  Catalog <br className="md:hidden" /> <span className="text-neutral-300">Echipamente</span>
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
                  <div className="flex items-center gap-2 px-5 h-12 bg-white border border-neutral-100 text-[10px] font-extrabold text-neutral-600 cursor-pointer rounded-xl hover:bg-neutral-50 transition-colors shadow-sm uppercase tracking-widest">
                    SORTARE <ChevronDown size={14} className="text-neutral-300" />
                  </div>
                </div>
              </div>

              <div className={cn(
                "grid gap-8",
                viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              )}>
                {MOCK_PRODUCTS.map((product, idx) => (
                  <motion.div 
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className={cn(
                      "bg-white group border border-neutral-100 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden rounded-[2.5rem] p-4",
                      viewMode === 'list' ? "flex flex-col md:flex-row gap-8" : "flex flex-col"
                    )}
                  >
                    <div className={cn(
                      "relative bg-neutral-100 overflow-hidden rounded-[2rem]",
                      viewMode === 'list' ? "w-full md:w-[320px] h-[240px] shrink-0" : "aspect-[4/3]"
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
                    
                    <div className="p-4 md:p-6 flex flex-col flex-1">
                      <div className="mb-4">
                        <span className="text-green-500 font-extrabold text-[10px] uppercase tracking-[0.3em] block mb-2">{product.brand}</span>
                        <h2 className="font-headline font-extrabold text-2xl text-neutral-900 group-hover:text-green-800 transition-colors tracking-tight leading-tight">{product.name}</h2>
                      </div>
                      
                      <p className="text-neutral-500 text-sm line-clamp-2 mb-8 font-body leading-relaxed">{product.shortDescription}</p>
                      
                      <div className="mt-auto pt-6 border-t border-neutral-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                         <div className="flex flex-col">
                            <span className="text-[10px] font-extrabold text-neutral-300 uppercase tracking-widest mb-1">Preț estimativ</span>
                            <span className="font-headline font-extrabold text-2xl text-neutral-900">
                              {product.priceOnRequest ? "LA CERERE" : `${product.price.toLocaleString()} RON`}
                            </span>
                         </div>
                         <Link href={`/produse/${product.slug}`} className="w-full sm:w-auto">
                            <Button className="w-full sm:w-auto bg-neutral-900 hover:bg-black text-white rounded-full h-12 pl-6 pr-1.5 flex items-center justify-between transition-all group/btn gap-6 shadow-xl shadow-black/5">
                              <span className="text-[10px] font-extrabold uppercase tracking-widest">VEZI DETALII</span>
                              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center transition-transform group-hover/btn:rotate-45">
                                <ArrowUpRight size={18} className="text-black" strokeWidth={3} />
                              </div>
                            </Button>
                         </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
