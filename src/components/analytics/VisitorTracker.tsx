
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

    const statsRef = doc(db, 'siteMetadata', 'stats');
    
    // Încercăm să incrementăm. Dacă documentul nu există (prima vizită ever), îl creăm.
    updateDoc(statsRef, {
      visitCount: increment(1)
    }).catch(() => {
      setDoc(statsRef, { visitCount: 1 }, { merge: true });
    });
  }, [db, pathname]);

  return null;
}
