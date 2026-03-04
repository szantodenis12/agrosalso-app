'use client';
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/lib/mock-data';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ChevronDown, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function CatalogPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <Navbar />
      <main className="pt-[140px] pb-24 px-6 md:px-14 bg-neutral-50 min-h-screen">
        <div className="max-w-[1440px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex gap-2 text-xs text-neutral-400 uppercase font-bold tracking-widest mb-8">
            <Link href="/" className="hover:text-green-800">Acasă</Link>
            <span>/</span>
            <span className="text-neutral-900">Produse</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Filters */}
            <aside className="lg:w-72 shrink-0 space-y-10 sticky top-[100px] h-fit">
              <div>
                <h3 className="font-headline font-bold text-xl mb-6">Căutare</h3>
                <div className="relative">
                  <Input 
                    placeholder="Ex: John Deere..." 
                    className="pl-10 h-12 bg-white border-neutral-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                </div>
              </div>

              <div>
                <h3 className="font-headline font-bold text-xl mb-6">Categorii</h3>
                <div className="space-y-4">
                  {MOCK_CATEGORIES.map(cat => (
                    <div key={cat.id} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <Checkbox id={cat.slug} />
                        <label htmlFor={cat.slug} className="text-sm font-medium text-neutral-600 group-hover:text-green-800 cursor-pointer">{cat.name}</label>
                      </div>
                      <span className="text-[10px] font-bold text-neutral-300">{cat.productCount}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-headline font-bold text-xl mb-6">Disponibilitate</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox id="inStock" />
                    <label htmlFor="inStock" className="text-sm font-medium text-neutral-600">În stoc</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox id="new" />
                    <label htmlFor="new" className="text-sm font-medium text-neutral-600">Produse noi</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox id="sale" />
                    <label htmlFor="sale" className="text-sm font-medium text-neutral-600">Promoții</label>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-green-800 font-bold h-12">RESETEAZĂ FILTRELE</Button>
            </aside>

            {/* Catalog Grid */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b border-neutral-200">
                <h1 className="font-headline font-extrabold text-3xl text-neutral-900 uppercase tracking-tighter">
                  Catalog Echipamente <span className="text-neutral-300 ml-2 font-normal text-xl italic">(148 rezultate)</span>
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-neutral-200 bg-white rounded-md overflow-hidden">
                    <button 
                      onClick={() => setViewMode('grid')}
                      className={cn("p-2 transition-colors", viewMode === 'grid' ? "bg-neutral-100 text-green-800" : "text-neutral-400")}
                    >
                      <LayoutGrid size={20} />
                    </button>
                    <button 
                      onClick={() => setViewMode('list')}
                      className={cn("p-2 transition-colors", viewMode === 'list' ? "bg-neutral-100 text-green-800" : "text-neutral-400")}
                    >
                      <List size={20} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 text-sm font-bold text-neutral-600 cursor-pointer rounded-md">
                    SORTARE <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              <div className={cn(
                "grid gap-6",
                viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              )}>
                {MOCK_PRODUCTS.map(product => (
                  <div 
                    key={product.id} 
                    className={cn(
                      "bg-white group border border-neutral-100 hover:shadow-xl transition-all overflow-hidden rounded-xl",
                      viewMode === 'list' ? "flex flex-col md:flex-row" : "flex flex-col"
                    )}
                  >
                    <div className={cn(
                      "relative bg-neutral-100 overflow-hidden",
                      viewMode === 'list' ? "w-full md:w-80 h-60 shrink-0" : "aspect-[4/3]"
                    )}>
                      <Image 
                        src={product.mainImage} 
                        alt={product.name} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    
                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-green-500 font-extrabold text-[10px] uppercase tracking-[0.2em]">{product.brand}</span>
                        {product.inStock ? (
                          <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">ÎN STOC</span>
                        ) : (
                          <span className="text-[10px] font-bold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">LA COMANDĂ</span>
                        )}
                      </div>
                      <h2 className="font-headline font-bold text-xl text-neutral-900 mb-4 group-hover:text-green-800 transition-colors">{product.name}</h2>
                      <p className="text-neutral-500 text-sm line-clamp-2 mb-8 font-body">{product.shortDescription}</p>
                      
                      <div className="mt-auto pt-6 border-t border-neutral-50 flex items-center justify-between">
                         <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest">Preț</span>
                            <span className="font-headline font-extrabold text-xl text-neutral-900">
                              {product.priceOnRequest ? "LA CERERE" : `${product.price.toLocaleString()} RON`}
                            </span>
                         </div>
                         <Link href={`/produse/${product.slug}`}>
                            <Button className="bg-green-800 hover:bg-green-700 h-11 px-6 font-bold uppercase tracking-wider text-xs">
                              VEZI DETALII
                            </Button>
                         </Link>
                      </div>
                    </div>
                  </div>
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
