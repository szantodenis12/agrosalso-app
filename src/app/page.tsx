import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { BlackFriday } from '@/components/home/BlackFriday';
import { getBlackFridayPhase } from '@/lib/promo/blackFriday';
import { AboutSection } from '@/components/home/AboutSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { IntrebariFrecvente } from '@/components/home/IntrebariFrecvente';
import { ContactSection } from '@/components/home/ContactSection';
import { Footer } from '@/components/layout/Footer';
import { TBIInstallmentsBanner } from '@/components/common/TBIInstallmentsBanner';
import OrganizationJsonLd from '@/components/seo/OrganizationJsonLd';
import FaqJsonLd from '@/components/seo/FaqJsonLd';

// Pagina e ISR: faza Black Friday (upcoming/active/ended) se recalculează pe server cel
// mult la 5 minute, deci secțiunea apare/dispare la datele din blackFriday.ts fără
// redeploy, iar HTML-ul server conține deja secțiunea (fără flash/layout shift).
export const revalidate = 300;

export default function Home() {
  const bfPhase = getBlackFridayPhase();
  return (
    <>
      <OrganizationJsonLd />
      <FaqJsonLd />
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedProducts />
        {/* AFIR (OferteCurente) expirat: componenta rămâne în cod, dar nu se mai randează. */}
        {bfPhase !== 'ended' && <BlackFriday phase={bfPhase} />}
        <AboutSection />
        <TestimonialsSection />
        <IntrebariFrecvente />
        <ContactSection />
        <TBIInstallmentsBanner />
      </main>
      <Footer />
    </>
  );
}
