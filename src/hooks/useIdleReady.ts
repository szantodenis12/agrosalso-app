'use client';
import { useEffect, useState } from 'react';

/**
 * Devine true dupa ce browserul e liber (requestIdleCallback, cu fallback pe timeout).
 * Folosit pentru a amana listener-ele Firestore live: datele initiale vin deja din server (SSR),
 * deci abonarea nu trebuie sa concureze cu hidratarea / primul paint.
 */
export function useIdleReady(timeoutMs = 3000): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const w = window as any;
    if (typeof w.requestIdleCallback === 'function') {
      const id = w.requestIdleCallback(() => setReady(true), { timeout: timeoutMs });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = setTimeout(() => setReady(true), 1500);
    return () => clearTimeout(id);
  }, [timeoutMs]);
  return ready;
}
