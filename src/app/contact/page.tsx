
'use client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ContactSection } from '@/components/home/ContactSection';
import { motion } from 'framer-motion';

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#E9F5E1] min-h-screen">
        {/* Spacer for fixed navbar */}
        <div className="h-20 md:h-32" />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ContactSection />
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
