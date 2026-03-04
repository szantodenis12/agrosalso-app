
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function FeaturedProducts() {
  return (
    <section className="py-24 px-6 md:px-14 bg-neutral-50">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="text-green-800 font-extrabold text-sm uppercase tracking-widest mb-4">Echipamente Premium</div>
            <h2 className="font-headline font-extrabold text-4xl md:text-5xl text-neutral-900 tracking-tight">Produse Recomandate</h2>
          </div>
          <Link href="/produse" className="inline-flex items-center gap-2 font-bold text-green-800 border-b-2 border-green-800 pb-1 group">
            VEZI TOT CATALOGUL <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_PRODUCTS.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white group border border-neutral-100 hover:shadow-xl transition-all duration-300"
            >
              <Link href={`/produse/${product.slug}`} className="block">
                <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                  <Image 
                    src={product.mainImage} 
                    alt={product.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.isNew && (
                    <Badge className="absolute top-4 left-4 bg-green-700 hover:bg-green-700 rounded-none border-none">NOU</Badge>
                  )}
                  {product.isOnSale && (
                    <Badge className="absolute top-4 right-4 bg-yellow-400 text-neutral-900 hover:bg-yellow-400 rounded-none border-none">PROMO</Badge>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="text-green-500 text-[10px] font-extrabold uppercase tracking-widest mb-1">{product.brand}</div>
                  <h3 className="font-headline font-bold text-lg text-neutral-900 mb-2 leading-tight group-hover:text-green-800 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-neutral-400 text-sm line-clamp-2 mb-6 font-body">
                    {product.shortDescription}
                  </p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-neutral-50">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-neutral-300 uppercase font-bold tracking-wider">PRET</span>
                      <span className="font-headline font-extrabold text-neutral-900">
                        {product.priceOnRequest ? "LA CERERE" : `${product.price.toLocaleString()} RON`}
                      </span>
                    </div>
                    <Button variant="ghost" className="p-0 h-auto hover:bg-transparent text-green-800 font-extrabold group/btn">
                      DETALII <ArrowRight size={14} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
