'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Hook for translating dynamic content from Firestore.
 * Caches results in sessionStorage to minimize API calls.
 * Supports both string fields and arrays of strings (like whyBrand).
 */
export function useTranslation<T extends Record<string, any>>(
  data: T | null,
  id?: string,
  fields: (keyof T)[] = ['name', 'shortDescription', 'description', 'detailedDescription', 'whyBrand']
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
        // Create a flat queue of all strings that need translation
        const translationQueue: { field: keyof T, index?: number, value: string }[] = [];
        
        fields.forEach(f => {
          const val = data[f];
          if (Array.isArray(val)) {
            val.forEach((v, i) => {
              if (v && typeof v === 'string') {
                translationQueue.push({ field: f, index: i, value: v });
              }
            });
          } else if (typeof val === 'string' && val) {
            translationQueue.push({ field: f, value: val });
          }
        });

        if (translationQueue.length === 0) {
          setIsTranslating(false);
          return;
        }

        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            text: translationQueue.map(q => q.value), 
            target: 'en' 
          }),
        });

        const result = await response.json();
        
        if (result.translatedText) {
          const translatedValues = Array.isArray(result.translatedText) 
            ? result.translatedText 
            : [result.translatedText];

          const updatedFields: Partial<T> = {};
          
          // Re-assemble the translated values back into their original structure
          translationQueue.forEach((item, i) => {
            const translatedVal = translatedValues[i];
            if (item.index !== undefined) {
              // It's an array field
              if (!updatedFields[item.field]) {
                updatedFields[item.field] = [...(data[item.field] as any)] as any;
              }
              (updatedFields[item.field] as any)[item.index] = translatedVal;
            } else {
              // It's a string field
              updatedFields[item.field] = translatedVal as any;
            }
          });

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
