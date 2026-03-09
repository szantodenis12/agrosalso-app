'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Product } from '@/types';

/**
 * Hook for retrieving translations from the Product object.
 * Returns the localized fields if available, otherwise falls back to Romanian.
 */
export function useTranslation(product: Product | null | undefined) {
  const { lang } = useLanguage();
  const [translatedData, setTranslatedData] = useState<any>(null);

  useEffect(() => {
    if (!product) return;

    if (lang === 'ro') {
      setTranslatedData({
        name: product.name,
        shortDescription: product.shortDescription,
        description: product.description,
        detailedDescription: product.detailedDescription,
        whyBrand: product.whyBrand || []
      });
      return;
    }

    // Try to find translation in the 'translations' object
    const translation = product.translations?.[lang];

    setTranslatedData({
      name: translation?.name ?? product.name,
      shortDescription: translation?.shortDescription ?? product.shortDescription,
      description: translation?.description ?? product.description,
      detailedDescription: translation?.detailedDescription ?? product.detailedDescription,
      whyBrand: translation?.whyBrand ?? product.whyBrand ?? []
    });
  }, [lang, product]);

  return { translatedData, isTranslating: false };
}
