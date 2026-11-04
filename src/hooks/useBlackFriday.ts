'use client';
import { useEffect, useState } from 'react';
import { isBlackFridayActive } from '@/lib/promo/blackFriday';

/**
 * Starea ofertei Black Friday evaluată pe client, după mount (la fiecare vizualizare,
 * nu înghețată la build). Înainte de mount întoarce false, ca SSR și primul render să
 * coincidă (fără hydration mismatch).
 */
export function useBlackFridayActive(): boolean {
  const [active, setActive] = useState(false);
  useEffect(() => {
    setActive(isBlackFridayActive());
  }, []);
  return active;
}
