'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { name: 'Produse', href: '/produse' },
  { name: 'Despre noi', href: '/despre' },
  { name: 'Servicii', href: '/servicii' },
  { name: 'Prețuri', href: '/preturi' },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Previne scroll-ul paginii când meniul este deschis
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Pe pagina de produse header-ul trebuie să fie mereu vizibil deoarece fundalul paginii este deschis
  const isProductsPage = pathname?.startsWith('/produse');
  const shouldBeVisible = scrolled || isOpen || isProductsPage;

  return (
    <>
      <nav 
        className={cn(
          "fixed top-0 left-0 right-0 z-[60] transition-all duration-500 px-6 py-6 md:px-14",
          shouldBeVisible ? "bg-neutral-950/95 backdrop-blur-md py-4 shadow-lg" : "bg-transparent"
        )}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group relative z-[70]">
            <div className="flex items-center gap-1">
               <div className="w-6 h-4 bg-accent-lime rounded-sm rotate-12" />
               <span className="font-headline font-extrabold text-2xl tracking-tighter text-white">
                 AgroSalso
               </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-accent-lime",
                  pathname === link.href ? "text-accent-lime" : "text-white/80"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link href="/contact">
              <button className="bg-accent-lime hover:bg-accent-lime/95 text-black font-bold h-12 pl-6 pr-1 rounded-full flex items-center gap-4 transition-all text-sm group">
                Contactează-ne
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center transition-transform group-hover:rotate-45">
                  <ArrowUpRight size={18} className="text-black" strokeWidth={2.5} />
                </div>
              </button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden text-white relative z-[70] p-2 hover:bg-white/10 rounded-full transition-colors" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Închide meniu" : "Deschide meniu"}
          >
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-neutral-950 z-[50] lg:hidden flex flex-col pt-32 px-8 pb-12 overflow-y-auto"
          >
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <Link 
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-4xl font-headline font-bold block py-5 border-b border-white/5 transition-colors",
                      pathname === link.href ? "text-accent-lime" : "text-white"
                    )}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-auto pt-12"
            >
              <Link href="/contact" onClick={() => setIsOpen(false)}>
                <button className="bg-accent-lime hover:bg-accent-lime/95 text-black font-bold h-12 pl-6 pr-1 rounded-full flex items-center gap-4 transition-all text-sm group">
                  Contactează-ne
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center transition-transform group-hover:rotate-45">
                    <ArrowUpRight size={18} className="text-black" strokeWidth={2.5} />
                  </div>
                </button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
