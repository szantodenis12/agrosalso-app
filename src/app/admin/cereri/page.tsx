'use client';
import { useState } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Inquiry } from '@/types';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { 
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell 
} from '@/components/ui/table';
import { 
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription 
} from '@/components/ui/sheet';
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, Package, FileText, ArrowRight, Trash2, Eye, Tag, Send, MessageSquareText, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';

export default function AdminInquiriesPage() {
  const db = useFirestore();
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');

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

  const handleSendEmailReply = async () => {
    if (!selectedInquiry || !replyMessage.trim()) return;
    
    setIsSendingReply(true);
    try {
      const response = await fetch('/api/send-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryId: selectedInquiry.id,
          customerName: selectedInquiry.name,
          customerEmail: selectedInquiry.email,
          subject: selectedInquiry.productName || 'Răspuns AgroSalso',
          replyMessage: replyMessage
        }),
      });

      if (!response.ok) throw new Error("Eroare la trimiterea email-ului");

      await updateDoc(doc(db, 'inquiries', selectedInquiry.id), {
        status: 'replied',
        repliedAt: serverTimestamp(),
        lastReply: replyMessage,
        updatedAt: serverTimestamp()
      });

      toast({
        title: "Răspuns trimis",
        description: "Email-ul a fost expediat cu succes către client.",
      });
      setReplyMessage('');
      setSelectedInquiry(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Eroare",
        description: "Nu s-a putut trimite răspunsul.",
      });
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'inquiries', id));
      toast({
        title: "Cerere ștearsă",
        description: "Înregistrarea a fost eliminată definitiv din baza de date.",
      });
      setSelectedInquiry(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Eroare",
        description: "Nu s-a putut șterge cererea.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 className="font-headline font-extrabold text-3xl lg:text-4xl text-neutral-900 tracking-tighter uppercase leading-tight">Cereri & Contact</h1>
        <p className="text-neutral-400 text-sm font-medium">Gestionați lead-urile și mesajele primite.</p>
      </div>

      <div className="bg-white rounded-[1.5rem] lg:rounded-[2.5rem] shadow-sm overflow-hidden border border-neutral-100">
        <div className="overflow-x-auto custom-scrollbar">
          <Table className="min-w-[800px] lg:min-w-full">
            <TableHeader className="bg-neutral-50/50">
              <TableRow className="border-b border-neutral-100 h-16 hover:bg-transparent">
                <TableHead className="pl-8 text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">Client</TableHead>
                <TableHead className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 text-center">Subiect / Produs</TableHead>
                <TableHead className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 text-center">Data</TableHead>
                <TableHead className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 text-center">Status</TableHead>
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
                  className="hover:bg-neutral-50/30 transition-colors border-b border-neutral-50 cursor-pointer group"
                  onClick={() => handleOpenDetails(inq)}
                >
                  <TableCell className="pl-8 py-6">
                    <div className="font-bold text-sm text-neutral-900">{inq.name}</div>
                    <div className="text-[10px] font-medium text-neutral-400">{inq.email}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="font-bold text-sm text-neutral-900">{inq.productName}</div>
                    {inq.selectedModel && (
                      <div className="text-[9px] font-extrabold text-accent-lime uppercase tracking-widest mt-0.5">Model: {inq.selectedModel}</div>
                    )}
                    {inq.productId === 'general' && (
                      <Badge variant="outline" className="text-[8px] font-extrabold uppercase px-2 py-0 h-4 mt-1 border-neutral-200 text-neutral-400">Contact</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="text-xs font-medium text-neutral-500">
                      {inq.createdAt?.seconds ? format(new Date(inq.createdAt.seconds * 1000), 'dd MMM yyyy, HH:mm', { locale: ro }) : 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {inq.status === 'new' ? (
                      <Badge className="bg-yellow-400 text-black border-none uppercase text-[9px] font-extrabold px-3 py-1 shadow-sm">Nou</Badge>
                    ) : inq.status === 'replied' ? (
                      <Badge className="bg-neutral-100 text-neutral-500 border-none uppercase text-[9px] font-extrabold px-3 py-1">Trimis</Badge>
                    ) : (
                      <Badge className="bg-blue-50 text-blue-600 border-none uppercase text-[9px] font-extrabold px-3 py-1">Citit</Badge>
                    )}
                  </TableCell>
                  <TableCell className="pr-8 text-right">
                    <div className="flex justify-end gap-2">
                      {inq.productId !== 'general' && (
                        <Link href={`/admin/oferta/${inq.id}`} onClick={(e) => e.stopPropagation()}>
                          <Button size="icon" variant="ghost" title="Vezi/Generează Ofertă" className="rounded-xl hover:bg-accent-lime/10 text-accent-lime">
                            <Eye size={18} />
                          </Button>
                        </Link>
                      )}
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="rounded-xl hover:bg-red-50 text-neutral-300 hover:text-red-500 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 size={18} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-[1.5rem] lg:rounded-[2rem] border-none shadow-2xl w-[90vw] max-w-lg">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="font-headline font-bold text-xl">Ștergi această cerere?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Această acțiune este ireversibilă. Toate datele asociate acestui lead vor fi șterse definitiv.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="gap-2 mt-4 sm:mt-0">
                            <AlertDialogCancel className="rounded-xl font-bold">Anulează</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold"
                              disabled={isDeleting}
                            >
                              {isDeleting ? 'Se șterge...' : 'Da, șterge'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <Button size="icon" variant="ghost" className="rounded-xl group-hover:translate-x-1 transition-transform hidden sm:flex">
                        <ArrowRight size={18} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Sheet open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
        <SheetContent className="w-full sm:max-w-xl bg-white border-l border-neutral-100 overflow-y-auto">
          <SheetHeader className="pb-10 border-b border-neutral-50">
            <div className="flex justify-between items-start">
               <div className="space-y-1">
                <SheetTitle className="font-headline font-extrabold text-2xl tracking-tight uppercase">Detalii Cerere</SheetTitle>
                <SheetDescription>Informațiile primite de la client.</SheetDescription>
               </div>
               
               <div className="flex gap-2">
                 <AlertDialog>
                   <AlertDialogTrigger asChild>
                     <Button variant="ghost" size="icon" className="text-neutral-300 hover:text-red-500 transition-colors">
                       <Trash2 size={20} />
                     </Button>
                   </AlertDialogTrigger>
                   <AlertDialogContent className="rounded-[1.5rem] lg:rounded-[2rem] border-none shadow-2xl w-[90vw] max-w-lg">
                     <AlertDialogHeader>
                       <AlertDialogTitle className="font-headline font-bold text-xl">Ștergi această cerere?</AlertDialogTitle>
                       <AlertDialogDescription>
                         Această acțiune este ireversibilă. Toate datele asociate acestui lead vor fi șterse definitiv.
                       </AlertDialogDescription>
                     </AlertDialogHeader>
                     <AlertDialogFooter className="gap-2 mt-4 sm:mt-0">
                       <AlertDialogCancel className="rounded-xl font-bold">Anulează</AlertDialogCancel>
                       <AlertDialogAction 
                         onClick={() => selectedInquiry && handleDeleteInquiry(selectedInquiry.id)}
                         className="bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold"
                         disabled={isDeleting}
                       >
                         {isDeleting ? 'Se șterge...' : 'Da, șterge'}
                       </AlertDialogAction>
                     </AlertDialogFooter>
                   </AlertDialogContent>
                 </AlertDialog>
               </div>
            </div>
          </SheetHeader>

          {selectedInquiry && (
            <div className="py-10 space-y-10 lg:space-y-12">
              <section className="space-y-6">
                <h3 className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-accent-lime rounded-full" /> Date Contact
                </h3>
                <div className="grid grid-cols-1 gap-4 lg:gap-6 bg-neutral-50 p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-neutral-400 shadow-sm"><Mail size={18} /></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Email</p>
                      <p className="font-bold text-neutral-900 truncate">{selectedInquiry.email}</p>
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
                  <div className="w-1.5 h-1.5 bg-accent-lime rounded-full" /> {selectedInquiry.productId === 'general' ? 'Subiect Mesaj' : 'Utilaj Solicitat'}
                </h3>
                <div className="bg-neutral-900 p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] text-white flex flex-col sm:flex-row sm:items-center justify-between shadow-xl gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-accent-lime shrink-0">
                      {selectedInquiry.productId === 'general' ? <MessageSquareText size={24} /> : <Package size={24} />}
                    </div>
                    <div>
                      <p className="font-headline font-extrabold text-base lg:text-lg uppercase">{selectedInquiry.productName}</p>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                        {selectedInquiry.productId === 'general' ? 'CONTACT SITE' : `ID: ${selectedInquiry.productId.slice(0, 8)}`}
                      </p>
                      {selectedInquiry.selectedModel && (
                        <div className="flex items-center gap-2 mt-3 bg-accent-lime/10 px-3 py-1.5 rounded-lg border border-accent-lime/20 w-fit">
                          <Tag size={12} className="text-accent-lime" />
                          <p className="text-[11px] font-extrabold text-accent-lime uppercase tracking-widest">Model: {selectedInquiry.selectedModel}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h3 className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-accent-lime rounded-full" /> Mesaj Primit
                </h3>
                <div className="bg-white border border-neutral-100 p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] text-neutral-600 text-sm lg:text-base leading-relaxed font-medium italic">
                  "{selectedInquiry.message}"
                </div>
              </section>

              {/* REPLY SECTION */}
              <section className="space-y-6 pt-6 border-t border-neutral-50">
                <h3 className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Trimite Răspuns
                </h3>
                <div className="space-y-4">
                  <Textarea 
                    placeholder="Scrieți aici mesajul dumneavoastră..." 
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="min-h-[150px] rounded-[1.5rem] border-neutral-100 bg-neutral-50 focus-visible:ring-accent-lime"
                  />
                  <Button 
                    onClick={handleSendEmailReply}
                    disabled={isSendingReply || !replyMessage.trim()}
                    className="w-full bg-neutral-900 hover:bg-black text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all"
                  >
                    {isSendingReply ? <Loader2 className="animate-spin" size={20} /> : <Send size={18} />}
                    {isSendingReply ? 'Se trimite...' : 'Trimite Răspuns pe Email'}
                  </Button>
                </div>
              </section>

              {selectedInquiry.productId !== 'general' && (
                <div className="pt-10 border-t border-neutral-50 space-y-4">
                  <Link href={`/admin/oferta/${selectedInquiry.id}`}>
                    <Button className="w-full bg-neutral-900 hover:bg-black text-white font-extrabold h-14 lg:h-16 rounded-2xl lg:rounded-3xl flex items-center justify-between pl-6 lg:pl-10 pr-2 group shadow-xl">
                      <span className="text-xs lg:text-sm">{selectedInquiry.status === 'replied' ? 'VEZI / MODIFICĂ OFERTA' : 'GENEREAZĂ OFERTA PDF'}</span>
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-accent-lime rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                        <FileText size={18} className="text-black" />
                      </div>
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
