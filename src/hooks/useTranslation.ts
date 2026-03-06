'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Hook for translating dynamic content from Firestore.
 * Caches results in sessionStorage to minimize API calls.
 */
export function useTranslation<T extends Record<string, any>>(
  data: T | null,
  id?: string,
  fields: (keyof T)[] = ['name', 'shortDescription', 'description', 'detailedDescription']
) {
  const { lang } = useLanguage();
  const [translatedData, setTranslatedData] = useState<T | null>(data);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (!data) return;
    
    // Reset to original Romanian data first
    setTranslatedData(data);

    if (lang === 'ro') {
      setIsTranslating(false);
      return;
    }

    // If English, try to find in cache or translate
    const cacheKey = `translate_${id || JSON.stringify(data)}_${lang}`;
    const cached = sessionStorage.getItem(cacheKey);

    if (cached) {
      setTranslatedData({ ...data, ...JSON.parse(cached) });
      return;
    }

    // Perform translation
    const performTranslation = async () => {
      setIsTranslating(true);
      try {
        const valuesToTranslate = fields.map(f => data[f]).filter(Boolean);
        if (valuesToTranslate.length === 0) {
          setIsTranslating(false);
          return;
        }

        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: valuesToTranslate, target: 'en' }),
        });

        const result = await response.json();
        
        if (result.translatedText) {
          const translatedValues = result.translatedText;
          const updatedFields: Partial<T> = {};
          
          let translateIdx = 0;
          fields.forEach(f => {
            if (data[f]) {
              updatedFields[f] = translatedValues[translateIdx];
              translateIdx++;
            }
          });

          // Handle Spec Table if present
          if (data.specTable && Array.isArray(data.specTable.headers)) {
             // Optional: Translate spec table too if needed
          }

          const finalData = { ...data, ...updatedFields };
          sessionStorage.setItem(cacheKey, JSON.stringify(updatedFields));
          setTranslatedData(finalData);
        }
      } catch (error) {
        console.error('Translation error:', error);
      } finally {
        setIsTranslating(false);
      }
    };

    performTranslation();
  }, [lang, data, id]);

  return { translatedData, isTranslating };
}
