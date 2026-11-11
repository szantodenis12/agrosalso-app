
'use client';
import { useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { doc, updateDoc, increment, setDoc } from 'firebase/firestore';
import { usePathname } from 'next/navigation';

/**
 * Component invizibil care monitorizează vizitele pe site.
 * Incrementează un contor în Firestore pentru fiecare accesare a paginilor publice.
 */
export function VisitorTracker() {
  const db = useFirestore();
  const pathname = usePathname();

  useEffect(() => {
    // Nu numărăm vizitele făcute de administratori în panoul de control
    if (pathname.startsWith('/admin')) return;

    // Scrierea în Firestore e amânată până când browserul e liber (nu concurează cu încărcarea paginii).
    const run = () => {
      const statsRef = doc(db, 'siteMetadata', 'stats');
      // Încercăm să incrementăm. Dacă documentul nu există (prima vizită ever), îl creăm.
      updateDoc(statsRef, {
        visitCount: increment(1)
      }).catch(() => {
        setDoc(statsRef, { visitCount: 1 }, { merge: true });
      });
    };
    const w = window as any;
    if (typeof w.requestIdleCallback === 'function') {
      const id = w.requestIdleCallback(run, { timeout: 5000 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(run, 3000);
    return () => window.clearTimeout(id);
  }, [db, pathname]);

  return null;
}
