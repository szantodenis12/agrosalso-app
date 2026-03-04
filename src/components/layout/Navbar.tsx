
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
  { name: 'Blog', href: '/blog' },
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

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-6 md:px-14",
        scrolled ? "bg-black/80 backdrop-blur-md py-4" : "bg-transparent"
      )}
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
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
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center transition-transform group-hover:scale-95">
                <ArrowUpRight size={18} className="text-black" strokeWidth={2.5} />
              </div>
            </button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-0 bg-neutral-900 z-40 lg:hidden p-8 flex flex-col pt-24"
          >
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-3xl font-headline font-bold text-white border-b border-white/5 py-6"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="mt-auto">
              <Link href="/contact" onClick={() => setIsOpen(false)}>
                <button className="bg-accent-lime w-full h-16 pl-8 pr-1.5 rounded-full flex items-center justify-between transition-all text-xl font-bold text-black group">
                  Contactează-ne
                  <div className="w-13 h-13 bg-white rounded-full flex items-center justify-center">
                    <ArrowUpRight size={24} className="text-black" strokeWidth={2.5} />
                  </div>
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
