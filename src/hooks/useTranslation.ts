'use client';
import { useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Product } from '@/types';

/**
 * Hook for retrieving translations from the Product object.
 * Returns the localized fields if available, otherwise falls back to Romanian.
 * Calculat sincron (useMemo), ca textele sa fie prezente si in HTML-ul server (SSR).
 */
export function useTranslation(product: Product | null | undefined) {
  const { lang } = useLanguage();

  const translatedData = useMemo<any>(() => {
    if (!product) return null;

    if (lang === 'ro') {
      return {
        name: product.name,
        shortDescription: product.shortDescription,
        description: product.description,
        detailedDescription: product.detailedDescription,
        whyBrand: product.whyBrand || []
      };
    }

    // Try to find translation in the 'translations' object
    const translation = product.translations?.[lang];

    return {
      name: translation?.name ?? product.name,
      shortDescription: translation?.shortDescription ?? product.shortDescription,
      description: translation?.description ?? product.description,
      detailedDescription: translation?.detailedDescription ?? product.detailedDescription,
      whyBrand: translation?.whyBrand ?? product.whyBrand ?? []
    };
  }, [lang, product]);

  return { translatedData, isTranslating: false };
}
