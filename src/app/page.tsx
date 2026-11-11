import dynamic from 'next/dynamic';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { BlackFriday } from '@/components/home/BlackFriday';
import { BfInitialProvider } from '@/components/common/BfInitialProvider';
import { getBlackFridayPhase, isBlackFridayActive } from '@/lib/promo/blackFriday';
const AboutSection = dynamic(() => import('@/components/home/AboutSection').then((m) => m.AboutSection));
const TestimonialsSection = dynamic(() => import('@/components/home/TestimonialsSection').then((m) => m.TestimonialsSection));
const IntrebariFrecvente = dynamic(() => import('@/components/home/IntrebariFrecvente').then((m) => m.IntrebariFrecvente));
const ContactSection = dynamic(() => import('@/components/home/ContactSection').then((m) => m.ContactSection));
import { Footer } from '@/components/layout/Footer';
import { TBIInstallmentsBanner } from '@/components/common/TBIInstallmentsBanner';
import OrganizationJsonLd from '@/components/seo/OrganizationJsonLd';
import FaqJsonLd from '@/components/seo/FaqJsonLd';
import { getFeaturedProducts } from '@/lib/seo/product-data';

// Pagina e ISR: faza Black Friday (upcoming/active/ended) se recalculează pe server cel
// mult la 5 minute, deci secțiunea apare/dispare la datele din blackFriday.ts fără
// redeploy, iar HTML-ul server conține deja secțiunea (fără flash/layout shift).
export const revalidate = 300;

export default async function Home() {
  const bfPhase = getBlackFridayPhase();
  const featuredProducts = await getFeaturedProducts();
  return (
    <>
      <OrganizationJsonLd />
      <FaqJsonLd />
      <Navbar />
      <main>
        <HeroSection />
        <BfInitialProvider active={isBlackFridayActive()}>
          <FeaturedProducts initialProducts={featuredProducts} />
        </BfInitialProvider>
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
