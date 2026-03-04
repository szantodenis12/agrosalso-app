
'use client';
import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { seedDatabase } from '@/lib/firestore/seed';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Database, AlertTriangle } from 'lucide-react';

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const db = useFirestore();

  const handleSeed = async () => {
    if (!confirm("Acest lucru va adăuga date demo în Firestore. Sunteți sigur?")) return;
    setLoading(true);
    try {
      await seedDatabase(db);
      toast({ title: "Seed Complet", description: "Baza de date a fost populată cu succes." });
    } catch (error) {
      toast({ variant: "destructive", title: "Eroare", description: "Nu s-a putut rula seed-ul." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-headline font-extrabold text-4xl text-neutral-900 tracking-tighter uppercase">Inițializare Bază de Date</h1>
        <p className="text-neutral-400 font-medium">Populați rapid catalogul cu date de testare.</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-100 p-8 rounded-[2rem] flex items-start gap-6">
        <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center shrink-0">
          <AlertTriangle className="text-white" />
        </div>
        <div>
          <h3 className="font-headline font-bold text-xl text-yellow-900 mb-2">Atenție!</h3>
          <p className="text-yellow-800/70 text-sm leading-relaxed">
            Această operațiune va adăuga produse, categorii și mărci demo. Dacă există deja documente cu aceleași ID-uri, acestea vor fi suprascrise. Recomandat doar pentru prima inițializare.
          </p>
        </div>
      </div>

      <Button 
        onClick={handleSeed} 
        disabled={loading}
        className="bg-neutral-900 hover:bg-black text-white font-extrabold h-16 pl-10 pr-2 rounded-2xl group transition-all w-full md:w-fit"
      >
        {loading ? 'SE INIȚIALIZEAZĂ...' : 'PORNEȘTE SEED DATA'}
        <div className="w-12 h-12 bg-accent-lime rounded-full flex items-center justify-center ml-10 transition-transform group-hover:rotate-12">
          <Database size={20} className="text-black" />
        </div>
      </Button>
    </div>
  );
}
