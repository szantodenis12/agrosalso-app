'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { ShieldCheck, X } from 'lucide-react';
import Link from 'next/link';

const CONSENT_KEY = 'agro_cookie_consent_v1';
const EXPIRY_DAYS = 90;

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    const savedConsent = localStorage.getItem(CONSENT_KEY);
    
    if (savedConsent) {
      const { timestamp } = JSON.parse(savedConsent);
      const now = Date.now();
      const diffDays = (now - timestamp) / (1000 * 60 * 60 * 24);
      
      if (diffDays > EXPIRY_DAYS) {
        setIsVisible(true);
      }
    } else {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    const consentData = {
      accepted: true,
      timestamp: Date.now()
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consentData));
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-6 right-6 md:left-14 md:right-auto md:max-w-md z-[100]"
        >
          <div className="bg-neutral-950 border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-2xl shadow-black/50 backdrop-blur-xl relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent-lime/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-lime rounded-xl flex items-center justify-center text-black">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="font-headline font-extrabold text-white text-lg tracking-tight uppercase">
                  {t[lang].cookieTitle}
                </h3>
              </div>

              <p className="text-white/60 text-xs md:text-sm leading-relaxed font-medium">
                {t[lang].cookieText}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  onClick={handleAccept}
                  className="bg-accent-lime hover:bg-accent-lime/90 text-black font-extrabold rounded-full px-8 h-12 text-xs tracking-widest transition-all"
                >
                  {t[lang].cookieAccept}
                </Button>
                <Link href="/politica-de-confidentialitate" className="flex-1">
                  <Button 
                    variant="ghost" 
                    className="w-full text-white/40 hover:text-white hover:bg-white/5 font-bold rounded-full h-12 text-[10px] tracking-widest uppercase"
                  >
                    {t[lang].cookiePolicy}
                  </Button>
                </Link>
              </div>
            </div>

            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
