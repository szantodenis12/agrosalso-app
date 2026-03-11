'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';

export function Footer() {
  const { lang } = useLanguage();

  return (
    <footer className="w-full">
      {/* Top CTA Section */}
      <section className="relative h-[600px] w-full flex items-center px-6 md:px-14 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/thumb-0.jpg" 
            alt="Ready to Transform" 
            fill 
            className="object-cover"
            priority
          />
          {/* Main Overlay */}
          <div className="absolute inset-0 bg-black/50" />
          
          {/* Fade to Black transition overlay */}
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        </div>

        <div className="relative z-20 max-w-[1440px] mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl space-y-8"
          >
            <div className="flex items-center gap-2 px-3 py-1 bg-accent-lime/20 rounded-full w-fit backdrop-blur-sm border border-accent-lime/30">
              <div className="w-1.5 h-1.5 bg-accent-lime rounded-full" />
              <span className="text-accent-lime text-[10px] font-bold uppercase tracking-widest">{t[lang].contactUs}</span>
            </div>
            
            <h2 className="font-headline font-bold text-4xl md:text-7xl text-white leading-[1.1] tracking-tight">
              {t[lang].readyToTransform}
            </h2>
            
            <p className="text-white/70 text-base md:text-lg max-w-md font-body leading-relaxed">
              {t[lang].transformSub}
            </p>

            <Link href="/contact" className="block w-fit">
              <motion.button 
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-accent-lime hover:bg-accent-lime/95 text-black font-bold h-14 pl-8 pr-1.5 rounded-full flex items-center gap-8 transition-all text-base group"
              >
                {t[lang].heroBtn}
                <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center transition-transform group-hover:rotate-45">
                  <ArrowUpRight size={20} className="text-black" strokeWidth={2.5} />
                </div>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Bottom Navigation Section */}
      <section className="bg-black text-white pt-24 pb-12 px-6 md:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-24">
            {/* Brand Column */}
            <div className="lg:col-span-1 space-y-8">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-6 h-4 bg-accent-lime rounded-sm rotate-12" />
                <span className="font-headline font-extrabold text-2xl tracking-tighter text-accent-lime">
                  AgroSalso
                </span>
              </Link>
              <div className="space-y-4">
                <a href="mailto:contact@agrosalso.ro" className="flex items-center gap-3 text-white font-bold hover:text-accent-lime transition-colors">
                  contact@agrosalso.ro
                </a>
                <a href="tel:+40742936959" className="flex items-center gap-3 text-white font-bold hover:text-accent-lime transition-colors">
                  +40 742 936 959
                </a>
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="text-neutral-500 font-bold text-sm mb-8">{t[lang].footerQuickLinks}</h4>
              <ul className="space-y-4">
                <li><Link href="/servicii" className="text-white/60 hover:text-white transition-colors text-sm">{t[lang].services}</Link></li>
                <li><Link href="/produse" className="text-white/60 hover:text-white transition-colors text-sm">{t[lang].products}</Link></li>
                <li><Link href="/contact" className="text-white/60 hover:text-white transition-colors text-sm">{t[lang].contact}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-neutral-500 font-bold text-sm mb-8">{t[lang].footerCompany}</h4>
              <ul className="space-y-4">
                <li><Link href="/despre" className="text-white/60 hover:text-white transition-colors text-sm">{t[lang].about}</Link></li>
                <li><Link href="/echipa" className="text-white/60 hover:text-white transition-colors text-sm">{t[lang].team}</Link></li>
                <li><Link href="/recenzii" className="text-white/60 hover:text-white transition-colors text-sm">{t[lang].reviews}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-neutral-500 font-bold text-sm mb-8">{t[lang].footerOthers}</h4>
              <ul className="space-y-4">
                <li><Link href="/termeni-si-conditii" className="text-white/60 hover:text-white transition-colors text-sm">Termeni și Condiții</Link></li>
                <li><Link href="/contact" className="text-white/60 hover:text-white transition-colors text-sm">{t[lang].contact}</Link></li>
                <li><Link href="/politica-de-confidentialitate" className="text-white/60 hover:text-white transition-colors text-sm">Politica de Confidențialitate</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-neutral-500 font-bold text-sm mb-8">{t[lang].footerSocial}</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-white/60 hover:text-white transition-colors text-sm">Instagram</Link></li>
                <li><Link href="#" className="text-white/60 hover:text-white transition-colors text-sm">Facebook</Link></li>
                <li><Link href="#" className="text-white/60 hover:text-white transition-colors text-sm">TikTok</Link></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-12 border-t border-white/10 text-center">
            <p className="text-white/40 text-xs tracking-widest font-body">
              © {new Date().getFullYear()} AgroSalso. {t[lang].footerRights}
            </p>
          </div>
        </div>
      </section>
    </footer>
  );
}
