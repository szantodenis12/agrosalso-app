import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { AboutSection } from '@/components/home/AboutSection';
import { PromoBanner } from '@/components/home/PromoBanner';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <AboutSection />
        <PromoBanner />
        
        {/* CTA Section */}
        <section className="py-24 px-6 md:px-14 bg-neutral-900 relative overflow-hidden text-center">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(26,77,46,0.3)_0%,_transparent_70%)]" />
           <div className="relative z-10 max-w-3xl mx-auto">
              <div className="text-green-300 font-extrabold text-sm uppercase tracking-widest mb-6">Contactează-ne astăzi</div>
              <h2 className="font-headline font-extrabold text-5xl text-white mb-8 tracking-tighter">Pregătit să modernizezi ferma? <br /> <span className="text-yellow-400">Hai să discutăm.</span></h2>
              <p className="text-white/40 text-lg mb-12 font-body">Suntem aici pentru a-ți oferi cea mai bună ofertă personalizată și soluții de finanțare adaptate.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                 <Button className="bg-yellow-400 hover:bg-yellow-500 text-neutral-900 font-bold h-16 px-10 text-xl">
                    📞 SUNĂ ACUM: 0751 234 567
                 </Button>
                 <Button variant="outline" className="border-white text-white hover:bg-white/10 font-bold h-16 px-10 text-xl">
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
