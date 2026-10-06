import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { AboutSection } from '@/components/home/AboutSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { ContactSection } from '@/components/home/ContactSection';
import { Footer } from '@/components/layout/Footer';
import { TBIInstallmentsBanner } from '@/components/common/TBIInstallmentsBanner';
import OrganizationJsonLd from '@/components/seo/OrganizationJsonLd';

export default function Home() {
  return (
    <>
      <OrganizationJsonLd />
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <AboutSection />
        <TestimonialsSection />
        <ContactSection />
        <TBIInstallmentsBanner />
      </main>
      <Footer />
    </>
  );
}
