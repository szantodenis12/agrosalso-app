
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryStrip } from '@/components/home/CategoryStrip';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { PromoBanner } from '@/components/home/PromoBanner';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CategoryStrip />
        <FeaturedProducts />
        <PromoBanner />
        
        {/* Why Choose Us Section */}
        <section className="py-24 px-6 md:px-14 bg-white">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <div className="relative">
                <div className="aspect-[4/5] bg-green-800 relative overflow-hidden">
                   <img 
                    src="https://picsum.photos/seed/farmer/800/1000" 
                    alt="Why Us" 
                    className="object-cover w-full h-full opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
                    data-ai-hint="agricultural technology"
                   />
                </div>
                <div className="absolute -bottom-10 -right-10 bg-yellow-400 p-10 shadow-2xl hidden md:block">
                   <div className="font-headline font-extrabold text-5xl text-neutral-900 mb-1">18+</div>
                   <div className="text-neutral-900/60 font-bold text-sm uppercase tracking-widest">Ani Experiență</div>
                </div>
             </div>

             <div>
                <div className="text-green-800 font-extrabold text-sm uppercase tracking-widest mb-6">Excelență în agricultură</div>
                <h2 className="font-headline font-extrabold text-5xl text-neutral-900 mb-10 leading-[1.1] tracking-tight">De ce fermierii aleg AgroSalso?</h2>
                
                <div className="space-y-8">
                   <div className="flex gap-6">
                      <div className="w-14 h-14 bg-green-50 flex items-center justify-center shrink-0">
                         <Star className="text-green-800" fill="currentColor" size={24} />
                      </div>
                      <div>
                         <h4 className="font-headline font-bold text-xl text-neutral-900 mb-2">Utilaje de top mondial</h4>
                         <p className="text-neutral-500 font-body">Parteneriate directe cu producători consacrați pentru a asigura cel mai bun randament.</p>
                      </div>
                   </div>
                   <div className="flex gap-6">
                      <div className="w-14 h-14 bg-green-50 flex items-center justify-center shrink-0">
                         <Star className="text-green-800" fill="currentColor" size={24} />
                      </div>
                      <div>
                         <h4 className="font-headline font-bold text-xl text-neutral-900 mb-2">Service și piese originale</h4>
                         <p className="text-neutral-500 font-body">Intervenții rapide în câmp și stoc permanent de piese pentru a minimiza timpul de nefuncționare.</p>
                      </div>
                   </div>
                   <div className="flex gap-6">
                      <div className="w-14 h-14 bg-green-50 flex items-center justify-center shrink-0">
                         <Star className="text-green-800" fill="currentColor" size={24} />
                      </div>
                      <div>
                         <h4 className="font-headline font-bold text-xl text-neutral-900 mb-2">Consultanță specializată</h4>
                         <p className="text-neutral-500 font-body">Echipa noastră te ajută să alegi utilajul potrivit nevoilor și bugetului fermei tale.</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 md:px-14 bg-neutral-900 relative overflow-hidden text-center">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(26,77,46,0.3)_0%,_transparent_70%)]" />
           <div className="relative z-10 max-w-3xl mx-auto">
              <div className="text-green-300 font-extrabold text-sm uppercase tracking-widest mb-6">Contactează-ne astăzi</div>
              <h2 className="font-headline font-extrabold text-5xl text-white mb-8 tracking-tighter">Pregătit să modernizezi ferma? <br /> <span className="text-yellow-400">Hai să discutăm.</span></h2>
              <p className="text-white/40 text-lg mb-12 font-body">Suntem aici pentru a-ți oferi cea mai bună ofertă personalizată și soluții de finanțare adaptate.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                 <Button className="bg-yellow-400 hover:bg-yellow-500 text-neutral-900 font-bold h-16 px-10 text-xl rounded-none">
                    📞 SUNĂ ACUM: 0751 234 567
                 </Button>
                 <Button variant="outline" className="border-white text-white hover:bg-white/10 font-bold h-16 px-10 text-xl rounded-none">
                    ✉️ TRIMITE O CERERE
                 </Button>
              </div>
           </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
