
'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Truck } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="min-h-screen pt-[72px] grid grid-cols-1 lg:grid-cols-2">
      {/* Left Column */}
      <div className="bg-neutral-50 flex flex-col justify-center px-6 md:px-14 lg:pr-24 py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#1A4D2E 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-300 bg-green-50 text-green-800 text-xs font-bold mb-8">
            <span className="w-2 h-2 rounded-full bg-green-800" />
            PARTENERUL TĂU AGRICOL DIN 2005
          </div>

          <h1 className="font-headline font-extrabold text-5xl md:text-7xl lg:text-8xl text-neutral-900 leading-[0.95] tracking-tighter mb-8">
            Utilaje care <br /> 
            <span className="relative inline-block">
              muncesc
              <motion.span 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="absolute bottom-2 left-0 w-full h-2 bg-yellow-400 -z-10 origin-left"
              />
            </span> <br />
            pentru tine
          </h1>

          <p className="text-neutral-500 text-lg md:text-xl max-w-lg mb-12 font-body">
            Distribuim tehnologie agricolă de ultimă oră pentru performanță maximă în câmp. Expertiză tehnică și service autorizat.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Button className="bg-green-800 hover:bg-green-700 text-white font-bold h-14 px-8 text-lg rounded-none group">
              EXPLOREAZĂ CATALOGUL <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" className="border-green-800 text-green-800 font-bold h-14 px-8 text-lg rounded-none">
              SOLICITĂ OFERTĂ
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-10 border-t border-neutral-200">
            <div>
              <div className="font-headline font-extrabold text-3xl text-neutral-900">18+</div>
              <div className="text-neutral-400 text-sm uppercase tracking-wider">Ani de activitate</div>
            </div>
            <div>
              <div className="font-headline font-extrabold text-3xl text-neutral-900">500+</div>
              <div className="text-neutral-400 text-sm uppercase tracking-wider">Clienți fericiți</div>
            </div>
            <div>
              <div className="font-headline font-extrabold text-3xl text-neutral-900">12</div>
              <div className="text-neutral-400 text-sm uppercase tracking-wider">Branduri de top</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Column */}
      <div className="bg-green-800 relative hidden lg:flex items-center justify-center overflow-hidden">
        {/* AG Watermark */}
        <div className="absolute bottom-[-50px] right-[-50px] font-headline font-extrabold text-[30rem] text-white opacity-[0.03] select-none pointer-events-none">
          AG
        </div>

        {/* Floating Product Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-10 w-[420px] bg-white p-6 shadow-2xl rounded-sm animate-card-float"
        >
          <div className="relative aspect-[4/3] bg-neutral-100 mb-6 overflow-hidden">
             <Image 
               src="https://picsum.photos/seed/ag123/600/450" 
               alt="Featured Machine" 
               fill 
               className="object-cover"
               data-ai-hint="tractor agricultural"
             />
             <div className="absolute top-4 left-4 bg-yellow-400 text-neutral-900 px-3 py-1 text-xs font-bold uppercase">
               RECOMANDAT
             </div>
          </div>
          <div className="flex flex-col">
            <span className="text-green-500 font-bold text-xs uppercase tracking-widest mb-1">JOHN DEERE</span>
            <h3 className="font-headline font-bold text-2xl text-neutral-900 mb-2">Seria 6R - Putere pură</h3>
            <div className="flex items-center justify-between mt-4">
              <span className="text-neutral-900 font-extrabold text-2xl">De la 125.000 €</span>
              <Button size="sm" className="bg-green-800 rounded-none">VEZI DETALII</Button>
            </div>
          </div>
        </motion.div>

        {/* Floating Badges */}
        <div className="absolute bottom-20 left-10 z-20 animate-pill-float">
          <div className="bg-white px-5 py-3 rounded-full shadow-lg flex items-center gap-3 border border-neutral-100">
            <CheckCircle className="text-green-600" size={20} />
            <span className="font-bold text-neutral-900">STOC DISPONIBIL</span>
          </div>
        </div>

        <div className="absolute top-20 right-10 z-20 animate-pill-float" style={{ animationDelay: '1.5s' }}>
          <div className="bg-white px-5 py-3 rounded-full shadow-lg flex items-center gap-3 border border-neutral-100">
            <Truck className="text-yellow-500" size={20} />
            <span className="font-bold text-neutral-900">LIVRARE 72H</span>
          </div>
        </div>
      </div>
    </section>
  );
}
