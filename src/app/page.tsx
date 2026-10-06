import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { OferteCurente } from '@/components/home/OferteCurente';
import { AboutSection } from '@/components/home/AboutSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { IntrebariFrecvente } from '@/components/home/IntrebariFrecvente';
import { ContactSection } from '@/components/home/ContactSection';
import { Footer } from '@/components/layout/Footer';
import { TBIInstallmentsBanner } from '@/components/common/TBIInstallmentsBanner';
import OrganizationJsonLd from '@/components/seo/OrganizationJsonLd';
import FaqJsonLd from '@/components/seo/FaqJsonLd';

export default function Home() {
  return (
    <>
      <OrganizationJsonLd />
      <FaqJsonLd />
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <OferteCurente />
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
