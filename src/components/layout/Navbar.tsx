
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { name: 'Produse', href: '/produse' },
  { name: 'Categorii', href: '/categorii' },
  { name: 'Marci', href: '/marci' },
  { name: 'Promoții', href: '/promotii' },
  { name: 'Despre noi', href: '/despre' },
  { name: 'Contact', href: '/contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 md:px-14",
        scrolled ? "bg-white shadow-md py-3" : "bg-transparent"
      )}
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-green-800 flex items-center justify-center rounded-lg group-hover:bg-green-700 transition-colors">
            <span className="font-headline font-extrabold text-white text-xl">A</span>
          </div>
          <span className="font-headline font-extrabold text-2xl tracking-tighter text-neutral-900">
            AGROSALSO
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={cn(
                "text-sm font-medium uppercase tracking-wider transition-colors hover:text-green-800",
                pathname === link.href ? "text-green-800 font-bold" : "text-neutral-500"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <a href="tel:+40751234567" className="flex items-center gap-2 text-green-800 font-bold">
            <Phone size={16} />
            <span>0751 234 567</span>
          </a>
          <Button className="bg-green-800 hover:bg-green-700 text-white font-bold px-6">
            SOLICITĂ OFERTĂ
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden text-neutral-900" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="fixed inset-0 top-[72px] bg-white z-40 lg:hidden p-8 flex flex-col gap-6"
          >
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-2xl font-headline font-bold text-neutral-900 border-b border-neutral-100 pb-4"
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-auto flex flex-col gap-4">
              <Button className="bg-green-800 w-full py-6 text-lg font-bold">
                SOLICITĂ OFERTĂ
              </Button>
              <a href="tel:+40751234567" className="text-center text-xl font-bold text-green-800 flex items-center justify-center gap-2 py-4">
                <Phone /> 0751 234 567
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
