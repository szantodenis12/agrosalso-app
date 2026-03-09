'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

export const LANGUAGES = [
  { code: 'ro', label: 'RO' },
  { code: 'en', label: 'EN' },
  { code: 'hu', label: 'HU' },
  { code: 'it', label: 'IT' },
  { code: 'de', label: 'DE' },
  { code: 'es', label: 'ES' },
] as const;

export type Language = typeof LANGUAGES[number]['code'];

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('ro');

  useEffect(() => {
    const saved = localStorage.getItem('agro_lang') as Language;
    if (saved && LANGUAGES.some(l => l.code === saved)) {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('agro_lang', newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
