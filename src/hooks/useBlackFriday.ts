'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { getBfProductBySlug, isBlackFridayActive } from '@/lib/promo/blackFriday';

/**
 * Valoarea initiala a starii BF calculata pe server (pagini ISR). Furnizata prin
 * <BfInitialProvider>; fara provider, initialul ramane false (comportamentul vechi).
 * Clientul reverifica oricum datele dupa mount.
 */
export const BfInitialContext = createContext<boolean>(false);

/**
 * Starea ofertei Black Friday evaluată pe client, după mount (la fiecare vizualizare,
 * nu înghețată la build). Înainte de mount întoarce valoarea calculată pe server (context), ca SSR și primul render să
 * coincidă (fără hydration mismatch).
 */
export function useBlackFridayActive(): boolean {
  const initial = useContext(BfInitialContext);
  const [active, setActive] = useState(initial);
  useEffect(() => {
    setActive(isBlackFridayActive());
  }, []);
  return active;
}

/**
 * Imaginea pentru cardurile din liste (/produse, FeaturedProducts): cât ține oferta, produsele
 * Black Friday arată coperta cu oferta (BF_<PRODUS>_01) în loc de mainImage; după ofertă (sau
 * înainte de mount) revine la mainImage. `isCover` = imaginea e pătrată, cu panou de preț în
 * partea de jos, deci se afișează întreagă (object-contain), nu decupată.
 */
export function useBfListImage(slug: string, mainImage: string): { src: string; isCover: boolean } {
  const active = useBlackFridayActive();
  const cover = active ? getBfProductBySlug(slug)?.listCover : undefined;
  return cover ? { src: cover, isCover: true } : { src: mainImage, isCover: false };
}
