
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, LANGUAGES } from '@/context/LanguageContext';
import { t } from '@/lib/translations';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang } = useLanguage();

  const NAV_LINKS = [
    { name: t[lang].products, href: '/produse' },
    { name: t[lang].about, href: '/despre' },
    { name: t[lang].services, href: '/servicii' },
    { name: t[lang].prices, href: '/preturi' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const isProductsPage = pathname?.startsWith('/produse');
  const isPrivacyPage = pathname === '/politica-de-confidentialitate';
  const isTermsPage = pathname === '/termeni-si-conditii';
  const shouldBeVisible = scrolled || isOpen || isProductsPage || isPrivacyPage || isTermsPage;

  const activeLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  const LanguageSwitcher = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition-all focus:outline-none backdrop-blur-sm">
          <div className="relative w-5 h-3.5 rounded-sm overflow-hidden border border-white/20 shrink-0">
            <Image 
              src={`https://flagcdn.com/w40/${activeLang.countryCode}.png`}
              alt={activeLang.label}
              fill
              className="object-cover"
            />
          </div>
          <span className="text-[10px] font-extrabold text-white uppercase tracking-widest">{activeLang.short}</span>
          <ChevronDown size={12} className="text-white/40" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-neutral-900/95 backdrop-blur-xl border-white/10 rounded-2xl p-1.5 shadow-2xl z-[100]">
        {LANGUAGES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLang(l.code)}
            className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all focus:bg-accent-lime/10 mb-0.5 last:mb-0",
              lang === l.code ? "bg-accent-lime/10" : "hover:bg-white/5"
            )}
          >
            <div className="relative w-6 h-4 rounded-sm overflow-hidden border border-white/10 shrink-0">
              <Image 
                src={`https://flagcdn.com/w40/${l.countryCode}.png`}
                alt={l.label}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <span className={cn(
                "text-[10px] font-extrabold uppercase tracking-widest leading-normal",
                lang === l.code ? "text-accent-lime" : "text-white"
              )}>
                {l.label}
              </span>
              <span className={cn(
                "text-[8px] font-bold uppercase tracking-tight leading-tight",
                lang === l.code ? "text-accent-lime/60" : "text-white/40"
              )}>
                {l.short}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

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

          <div className="hidden lg:flex items-center gap-6">
            <LanguageSwitcher />

            <Link href="/contact">
              <button className="bg-accent-lime hover:bg-accent-lime/95 text-black font-bold h-12 pl-6 pr-1 rounded-full flex items-center gap-4 transition-all text-sm group">
                {t[lang].contactUs}
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center transition-transform group-hover:rotate-45">
                  <ArrowUpRight size={18} className="text-black" strokeWidth={2.5} />
                </div>
              </button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-4 lg:hidden">
             <LanguageSwitcher />

             <button 
              className="text-white relative z-[70] p-2 hover:bg-white/10 rounded-full transition-colors" 
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Închide meniu" : "Deschide meniu"}
            >
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
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
                <button className="bg-accent-lime hover:bg-accent-lime/95 text-black font-bold h-14 pl-8 pr-1.5 rounded-full flex items-center justify-between transition-all text-sm group w-full shadow-2xl shadow-accent-lime/20">
                  <span className="font-extrabold uppercase tracking-widest">{t[lang].contactUs}</span>
                  <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center transition-transform group-hover:rotate-45">
                    <ArrowUpRight size={20} className="text-black" strokeWidth={3} />
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
