'use client';
import { useEffect, useState } from 'react';

function fixed(n: number): string {
  // Format determinist (separator de mii "."), identic pe server si la prima randare client.
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Pretul formatat ca inainte (`n.toLocaleString()` in locale-ul browserului), dar fara
 * hydration mismatch: server + prima randare folosesc formatul fix, apoi dupa mount se
 * trece pe locale-ul browserului.
 */
export function useLocalePrice(n: number): string {
  const [text, setText] = useState(() => fixed(n));
  useEffect(() => {
    setText(n.toLocaleString());
  }, [n]);
  return text;
}
