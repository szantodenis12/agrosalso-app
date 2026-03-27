'use client';
import { useState, useMemo } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Inquiry } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { InquiryCard } from '@/components/admin/InquiryCard';
import { Input } from '@/components/ui/input';

export default function AdminInquiriesPage() {
  const db = useFirestore();
  const [searchTerm, setSearchTerm] = useState('');

  const inquiriesQuery = useMemoFirebase(() => {
    return query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: rawInquiries, isLoading } = useCollection<Inquiry>(inquiriesQuery);

  const inquiries = useMemo(() => {
    const filtered = rawInquiries?.filter(i => i.productId !== 'general') || [];
    if (!searchTerm) return filtered;
    return filtered.filter(i => 
      i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      i.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [rawInquiries, searchTerm]);

  return (
    <div className="space-y-10 lg:space-y-14">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="font-headline font-extrabold text-4xl lg:text-5xl text-neutral-900 tracking-tighter uppercase leading-tight">Cereri Utilaje</h1>
          <p className="text-neutral-400 text-base font-medium mt-2">Gestionați fluxul de lead-uri și documentele de vânzare.</p>
        </div>
        <Link href="/admin/oferta/noua">
          <Button className="bg-neutral-900 hover:bg-black text-white rounded-2xl h-14 px-8 flex items-center gap-3 shadow-xl transition-all hover:scale-105 active:scale-95">
            <Plus size={20} />
            <span className="font-bold uppercase tracking-widest text-xs">Ofertă Nouă</span>
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-[2rem] shadow-sm border border-neutral-100">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-300" size={18} />
          <Input 
            placeholder="Caută după nume, utilaj sau email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-14 h-14 rounded-xl border-none bg-neutral-50 focus-visible:ring-accent-lime font-medium"
          />
        </div>
        <Button variant="ghost" className="h-14 px-6 rounded-xl gap-2 font-bold text-neutral-400 hover:text-neutral-900 transition-colors">
          <Filter size={18} />
          FILTREAZĂ
        </Button>
      </div>

      <div>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="w-12 h-12 animate-spin text-accent-lime mb-4" />
            <p className="text-neutral-300 font-extrabold uppercase tracking-[0.2em] text-xs">Se încarcă cererile...</p>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="bg-white rounded-[3rem] border border-dashed border-neutral-200 p-20 text-center">
            <p className="text-neutral-300 font-extrabold uppercase tracking-[0.2em] text-sm">Nicio cerere găsită.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {inquiries.map((inq) => (
              <InquiryCard key={inq.id} inquiry={inq} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
