
'use client';
import { useState } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { Inquiry } from '@/types';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { 
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell 
} from '@/components/ui/table';
import { 
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Calendar, Package, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminInquiriesPage() {
  const db = useFirestore();
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const inquiriesQuery = useMemoFirebase(() => {
    return query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: inquiries, isLoading } = useCollection<Inquiry>(inquiriesQuery);

  const handleOpenDetails = async (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    if (inquiry.status === 'new') {
      await updateDoc(doc(db, 'inquiries', inquiry.id), { status: 'read' });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline font-extrabold text-4xl text-neutral-900 tracking-tighter uppercase">Cereri Ofertă</h1>
        <p className="text-neutral-400 font-medium">Gestionați lead-urile primite de la clienți.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-neutral-100">
        <Table>
          <TableHeader className="bg-neutral-50">
            <TableRow className="border-b border-neutral-100 h-16">
              <TableHead className="pl-8 text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">Client</TableHead>
              <TableHead className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">Produs</TableHead>
              <TableHead className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">Data</TableHead>
              <TableHead className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">Status</TableHead>
              <TableHead className="pr-8 text-right text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">Acțiuni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center text-neutral-300 font-bold uppercase tracking-widest text-xs">Se încarcă cererile...</TableCell>
              </TableRow>
            ) : inquiries?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center text-neutral-300 font-bold uppercase tracking-widest text-xs">Nicio cerere găsită.</TableCell>
              </TableRow>
            ) : inquiries?.map((inq) => (
              <TableRow 
                key={inq.id} 
                className="hover:bg-neutral-50/50 transition-colors border-b border-neutral-50 cursor-pointer"
                onClick={() => handleOpenDetails(inq)}
              >
                <TableCell className="pl-8 py-4">
                  <div className="font-bold text-sm text-neutral-900">{inq.name}</div>
                  <div className="text-[10px] font-medium text-neutral-400">{inq.email}</div>
                </TableCell>
                <TableCell>
                  <div className="font-bold text-sm text-neutral-900">{inq.productName}</div>
                </TableCell>
                <TableCell>
                  <div className="text-xs text-neutral-500">
                    {inq.createdAt?.seconds ? format(new Date(inq.createdAt.seconds * 1000), 'dd MMM yyyy, HH:mm', { locale: ro }) : 'N/A'}
                  </div>
                </TableCell>
                <TableCell>
                  {inq.status === 'new' ? (
                    <Badge className="bg-yellow-400 text-black border-none uppercase text-[9px] font-extrabold">Nou</Badge>
                  ) : inq.status === 'replied' ? (
                    <Badge className="bg-neutral-100 text-neutral-500 border-none uppercase text-[9px] font-extrabold">Trimis</Badge>
                  ) : (
                    <Badge className="bg-blue-50 text-blue-600 border-none uppercase text-[9px] font-extrabold">Citit</Badge>
                  )}
                </TableCell>
                <TableCell className="pr-8 text-right">
                  <Button size="icon" variant="ghost" className="rounded-xl"><ArrowRight size={18} /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
        <SheetContent className="w-full sm:max-w-xl bg-white border-l border-neutral-100 overflow-y-auto">
          <SheetHeader className="pb-10 border-b border-neutral-50">
            <SheetTitle className="font-headline font-extrabold text-2xl tracking-tight">Detalii Cerere</SheetTitle>
            <SheetDescription>Vizualizați informațiile trimise de client.</SheetDescription>
          </SheetHeader>

          {selectedInquiry && (
            <div className="py-10 space-y-12">
              <section className="space-y-6">
                <h3 className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-accent-lime rounded-full" /> Date Client
                </h3>
                <div className="grid grid-cols-1 gap-6 bg-neutral-50 p-8 rounded-[2rem]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-neutral-400 shadow-sm"><Mail size={18} /></div>
                    <div>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Email</p>
                      <p className="font-bold text-neutral-900">{selectedInquiry.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-neutral-400 shadow-sm"><Phone size={18} /></div>
                    <div>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Telefon</p>
                      <p className="font-bold text-neutral-900">{selectedInquiry.phone}</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h3 className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-accent-lime rounded-full" /> Utilaj Solicitat
                </h3>
                <div className="bg-neutral-900 p-8 rounded-[2.5rem] text-white flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-accent-lime"><Package size={24} /></div>
                    <div>
                      <p className="font-headline font-extrabold text-lg">{selectedInquiry.productName}</p>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">ID: {selectedInquiry.productId}</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h3 className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-accent-lime rounded-full" /> Mesaj Client
                </h3>
                <div className="bg-white border border-neutral-100 p-8 rounded-[2rem] text-neutral-600 leading-relaxed font-medium italic">
                  "{selectedInquiry.message}"
                </div>
              </section>

              <div className="pt-10 border-t border-neutral-50 space-y-4">
                <Link href={`/admin/oferta/${selectedInquiry.id}`}>
                  <Button className="w-full bg-neutral-900 hover:bg-black text-white font-extrabold h-16 rounded-3xl flex items-center justify-between pl-10 pr-2 group shadow-xl">
                    GENEREAZĂ OFERTĂ
                    <div className="w-12 h-12 bg-accent-lime rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                      <FileText size={20} className="text-black" />
                    </div>
                  </Button>
                </Link>
                {selectedInquiry.status === 'replied' && (
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      Ofertă trimisă la: {selectedInquiry.repliedAt?.seconds ? format(new Date(selectedInquiry.repliedAt.seconds * 1000), 'dd MMM yyyy, HH:mm', { locale: ro }) : 'N/A'}
                    </p>
                    <p className="text-[10px] font-extrabold text-accent-lime uppercase tracking-widest mt-1">Ref: {selectedInquiry.offerId}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
