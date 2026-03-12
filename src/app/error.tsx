'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Aici s-ar putea integra un serviciu de logging precum Sentry
    console.error('System Crash:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl border border-neutral-100">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-500">
            <AlertTriangle size={40} />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="font-headline font-extrabold text-2xl text-neutral-900 tracking-tight uppercase">Ceva nu a funcționat corect</h1>
          <p className="text-neutral-500 text-sm font-medium leading-relaxed">
            A apărut o eroare neașteptată în timpul procesării datelor. Echipa noastră a fost notificată.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button 
            onClick={() => reset()}
            className="w-full bg-neutral-900 hover:bg-black text-white font-extrabold h-14 rounded-2xl gap-3 shadow-xl"
          >
            <RefreshCcw size={18} /> ÎNCEARCĂ DIN NOU
          </Button>
          
          <Link href="/" className="w-full">
            <Button variant="ghost" className="w-full h-12 text-neutral-400 font-bold rounded-xl gap-2 hover:bg-neutral-50">
              <Home size={16} /> ÎNAPOI LA ACASĂ
            </Button>
          </Link>
        </div>

        <div className="pt-4 border-t border-neutral-50">
          <p className="text-[10px] text-neutral-300 font-mono uppercase tracking-widest">
            Error ID: {error.digest || 'generic-runtime-fail'}
          </p>
        </div>
      </div>
    </div>
  );
}
