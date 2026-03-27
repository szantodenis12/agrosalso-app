'use client';
import { useState, useEffect, useMemo } from 'react';
import { useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { doc, getDoc, updateDoc, serverTimestamp, deleteDoc, collection, query, where, orderBy } from 'firebase/firestore';
import { Inquiry, Product } from '@/types';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, Mail, Phone, Package, Send, Loader2, FileText, 
  ShieldCheck, Trash2, CheckCircle2, Circle, Clock, Tag, ExternalLink, 
  History, Download, Edit3 
} from 'lucide-react';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function InquiryConsolePage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const db = useFirestore();
  
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Document history queries
  const certificatesQuery = useMemoFirebase(() => 
    query(collection(db, 'certificates'), where('inquiryId', '==', id)), [db, id]);
  const { data: certificates } = useCollection<any>(certificatesQuery);

  const contractsQuery = useMemoFirebase(() => 
    query(collection(db, 'contracts'), where('inquiryId', '==', id)), [db, id]);
  const { data: contracts } = useCollection<any>(contractsQuery);

  const warrantiesQuery = useMemoFirebase(() => 
    query(collection(db, 'warranties'), where('inquiryId', '==', id)), [db, id]);
  const { data: warranties } = useCollection<any>(warrantiesQuery);

  const receptionsQuery = useMemoFirebase(() => 
    query(collection(db, 'receptions'), where('inquiryId', '==', id)), [db, id]);
  const { data: receptions } = useCollection<any>(receptionsQuery);

  useEffect(() => {
    if (id && db) {
      getDoc(doc(db, 'inquiries', id)).then((snap) => {
        if (snap.exists()) {
          const data = snap.data() as Inquiry;
          setInquiry({ ...data, id: snap.id });
          if (data.status === 'new') {
            updateDoc(doc(db, 'inquiries', snap.id), { status: 'read' });
          }
        }
        setIsLoading(false);
      });
    }
  }, [id, db]);

  const handleSendReply = async () => {
    if (!inquiry || !replyMessage.trim()) return;
    setIsSendingReply(true);
    try {
      const response = await fetch('/api/trimite-raspuns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryId: inquiry.id,
          customerName: inquiry.name,
          customerEmail: inquiry.email,
          subject: inquiry.productName || 'Răspuns AgroSalso',
          replyMessage: replyMessage
        }),
      });

      if (!response.ok) throw new Error("Eroare la trimiterea email-ului");

      await updateDoc(doc(db, 'inquiries', inquiry.id), {
        status: 'replied',
        repliedAt: serverTimestamp(),
        lastReply: replyMessage,
        updatedAt: serverTimestamp()
      });

      toast({ title: "Răspuns trimis!", description: "Clientul a primit invitația pe email." });
      setReplyMessage('');
      router.refresh(); // Refresh data
    } catch (error) {
      toast({ variant: "destructive", title: "Eroare", description: "Nu s-a putut trimite răspunsul." });
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleDeleteDocument = async (collectionName: string, docId: string) => {
    if (!confirm("Sigur doriți să ștergeți acest document? Această acțiune este ireversibilă.")) return;
    
    try {
      await deleteDoc(doc(db, collectionName, docId));
      toast({ title: "Document șters", description: "Documentul a fost eliminat din istoric." });
    } catch (error) {
      toast({ variant: "destructive", title: "Eroare", description: "Nu s-a putut șterge documentul." });
    }
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="animate-spin text-accent-lime" size={40} /></div>;
  if (!inquiry) return <div className="text-center py-20 font-bold uppercase tracking-widest text-neutral-400">Cererea nu a fost găsită.</div>;

  return (
    <div className="space-y-8 lg:space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 hover:bg-white shadow-sm" onClick={() => router.back()}>
            <ArrowLeft size={24} />
          </Button>
          <div>
            <h1 className="font-headline font-extrabold text-3xl lg:text-4xl text-neutral-900 tracking-tighter uppercase leading-tight">Consolă Gestiune</h1>
            <div className="flex items-center gap-2 mt-1">
                <Badge className={cn("px-3 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest", 
                    inquiry.status === 'new' ? "bg-yellow-400 text-black" : "bg-neutral-100 text-neutral-400"
                )}>
                    Status: {inquiry.status}
                </Badge>
                <span className="text-[10px] font-bold text-neutral-300 uppercase">Lead ID: {inquiry.id.slice(0, 8)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-10">
        <div className="space-y-10">
          {/* Main Info Card */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-neutral-100 grid md:grid-cols-2 gap-10">
            <section className="space-y-6">
               <h3 className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-accent-lime rounded-full" /> Detalii Client
               </h3>
               <div className="space-y-6">
                 <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-neutral-50 rounded-2xl flex items-center justify-center text-neutral-400"><Mail size={24} /></div>
                    <div>
                        <p className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest">Adresă Email</p>
                        <p className="font-bold text-neutral-900 text-lg">{inquiry.email}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-neutral-50 rounded-2xl flex items-center justify-center text-neutral-400"><Phone size={24} /></div>
                    <div>
                        <p className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest">Număr Telefon</p>
                        <p className="font-bold text-neutral-900 text-lg">{inquiry.phone}</p>
                    </div>
                 </div>
               </div>
            </section>

            <section className="space-y-6">
               <h3 className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" /> Produs Solicitat
               </h3>
               <div className="bg-neutral-900 rounded-[2rem] p-8 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />
                  <p className="font-headline font-extrabold text-xl lg:text-2xl uppercase leading-tight relative">{inquiry.productName}</p>
                  {inquiry.selectedModel && (
                    <div className="flex items-center gap-2 mt-4 bg-accent-lime/10 px-3 py-1.5 rounded-lg border border-accent-lime/20 w-fit relative">
                        <Tag size={12} className="text-accent-lime" />
                        <p className="text-[10px] font-extrabold text-accent-lime uppercase tracking-widest">Model: {inquiry.selectedModel}</p>
                    </div>
                  )}
               </div>
            </section>
          </div>

          {/* Original Message */}
          <section className="space-y-6">
             <h3 className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-[0.2em] flex items-center gap-2 px-6">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Mesaj Primit prin Formular
             </h3>
             <div className="bg-white border border-neutral-100 p-10 rounded-[2.5rem] italic text-neutral-600 leading-relaxed text-lg shadow-sm">
               "{inquiry.message}"
             </div>
          </section>

          {/* Action Workflow */}
          <section className="space-y-8">
             <h3 className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-[0.2em] flex items-center gap-2 px-6">
                <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" /> Flux de Lucru (Workflow)
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <WorkflowStep 
                    title="Pasul 1: Ofertă" 
                    desc="Generează oferta comercială" 
                    icon={<FileText size={24} />} 
                    link={`/admin/oferta/${inquiry.id}`}
                    isDone={inquiry.status === 'replied'}
                    primary
                />
                <WorkflowStep 
                    title="Pasul 2: Contract" 
                    desc="Emite contractul de vânzare" 
                    icon={<ShieldCheck size={24} />} 
                    link={`/admin/contract/nou?inquiryId=${inquiry.id}`}
                    isDone={contracts && contracts.length > 0}
                />
                <WorkflowStep 
                    title="Pasul 3: Certificat" 
                    desc="Emite certificatul conformitate" 
                    icon={<FileText size={24} />} 
                    link={`/admin/certificate/nou?inquiryId=${inquiry.id}`}
                    isDone={certificates && certificates.length > 0}
                />
                <WorkflowStep 
                    title="Pasul 4: Garanție" 
                    desc="Emite certificatul de garanție" 
                    icon={<CheckCircle2 size={24} />} 
                    link={`/admin/garantie/nou?inquiryId=${inquiry.id}`}
                    isDone={warranties && warranties.length > 0}
                    primary
                />
                <WorkflowStep 
                    title="Pasul 5: Recepție" 
                    desc="Proces verbal de recepție" 
                    icon={<Package size={24} />} 
                    link={`/admin/receptie/nou?inquiryId=${inquiry.id}`}
                    isDone={receptions && receptions.length > 0}
                />
             </div>
          </section>

          {/* Document History */}
          {(certificates?.length || contracts?.length || warranties?.length || receptions?.length) ? (
            <section className="space-y-8">
                <h3 className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-[0.2em] flex items-center gap-2 px-6">
                    <div className="w-1.5 h-1.5 bg-accent-lime rounded-full" /> Istoric Documente Emise
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contracts?.map((doc: any) => (
                        <DocumentRecordCard 
                            key={doc.id}
                            title="Contract Vânzare" 
                            id={doc.number}
                            date={doc.date}
                            icon={<ShieldCheck className="text-blue-500" size={18} />}
                            editLink={`/admin/contract/nou?inquiryId=${id}&editId=${doc.id}`}
                            onDelete={() => handleDeleteDocument('contracts', doc.id)}
                        />
                    ))}
                    {certificates?.map((doc: any) => (
                        <DocumentRecordCard 
                            key={doc.id}
                            title="Certificat Conformitate" 
                            id={doc.number || 'N/A'}
                            date={doc.date}
                            icon={<FileText className="text-orange-500" size={18} />}
                            editLink={`/admin/certificate/nou?inquiryId=${id}&editId=${doc.id}`}
                            onDelete={() => handleDeleteDocument('certificates', doc.id)}
                        />
                    ))}
                    {receptions?.map((doc: any) => (
                        <DocumentRecordCard 
                            key={doc.id}
                            title="Proces Verbal Recepție" 
                            id={doc.number || 'N/A'}
                            date={doc.date}
                            icon={<Package className="text-purple-500" size={18} />}
                            editLink={`/admin/receptie/nou?inquiryId=${id}&editId=${doc.id}`}
                            onDelete={() => handleDeleteDocument('receptions', doc.id)}
                        />
                    ))}
                    {warranties?.map((doc: any) => (
                        <DocumentRecordCard 
                            key={doc.id}
                            title="Certificat Garanție" 
                            id={doc.number || 'N/A'}
                            date={doc.date}
                            icon={<CheckCircle2 className="text-accent-lime" size={18} />}
                            editLink={`/admin/garantie/nou?inquiryId=${id}&editId=${doc.id}`}
                            onDelete={() => handleDeleteDocument('warranties', doc.id)}
                        />
                    ))}
                </div>
            </section>
          ) : null}
        </div>

        {/* Sidebar Replies */}
        <aside className="space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-neutral-100 space-y-6">
                <h3 className="font-headline font-extrabold text-xs uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Comunicare Client
                </h3>
                <Textarea 
                    placeholder="Scrie răspunsul care va fi trimis pe email..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="min-h-[200px] rounded-2xl border-none bg-neutral-50 focus-visible:ring-accent-lime p-5 text-sm font-medium"
                />
                <Button 
                    className="w-full bg-neutral-900 hover:bg-black text-white h-14 rounded-2xl font-bold gap-3"
                    onClick={handleSendReply}
                    disabled={isSendingReply || !replyMessage.trim()}
                >
                    {isSendingReply ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    TRIMITE EMAIL
                </Button>
            </div>

            <Button 
                variant="ghost" 
                className="w-full h-14 rounded-2xl text-red-400 hover:bg-red-50 hover:text-red-600 font-bold gap-2"
                onClick={() => {
                    if (confirm("Sigur doriți să ștergeți această cerere?")) {
                        deleteDoc(doc(db, 'inquiries', inquiry.id)).then(() => router.push('/admin/cereri'));
                    }
                }}
            >
                <Trash2 size={18} />
                ȘTERGE CEREREA
            </Button>
        </aside>
      </div>
    </div>
  );
}

function WorkflowStep({ title, desc, icon, link, isDone, primary }: any) {
    return (
        <Link href={link} className="block group">
            <div className={cn(
                "h-full p-8 rounded-[2rem] border transition-all duration-300",
                isDone ? "bg-accent-lime/5 border-accent-lime/20" : 
                primary ? "bg-white border-neutral-100 shadow-sm hover:border-accent-lime hover:scale-105" :
                "bg-white border-neutral-100 shadow-sm opacity-60 hover:opacity-100 hover:border-neutral-200"
            )}>
                <div className="flex justify-between items-start mb-6">
                    <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm",
                        isDone ? "bg-white text-accent-lime" : "bg-neutral-50 text-neutral-400 group-hover:bg-accent-lime group-hover:text-black"
                    )}>
                        {icon}
                    </div>
                    {isDone ? <CheckCircle2 className="text-accent-lime" size={20} /> : <Circle className="text-neutral-200" size={20} />}
                </div>
                <h4 className="font-headline font-extrabold text-sm uppercase tracking-tight mb-2">{title}</h4>
                <p className="text-[11px] font-bold text-neutral-400 leading-snug">{desc}</p>
                <div className="mt-6 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 group-hover:text-neutral-900 transition-colors">
                    Deschide <ExternalLink size={10} />
                </div>
            </div>
        </Link>
    );
}
function DocumentRecordCard({ title, id, date, icon, editLink, onDelete }: any) {
    return (
        <div className="bg-white border border-neutral-100 p-6 rounded-[2rem] flex items-center justify-between shadow-sm hover:border-neutral-200 transition-all group">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all text-neutral-400">
                    {icon}
                </div>
                <div>
                    <h4 className="font-headline font-extrabold text-[11px] uppercase tracking-tight text-neutral-900 leading-none mb-1">{title}</h4>
                    <p className="text-[10px] font-bold text-neutral-300 uppercase">Nr. {id} / {date}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Link href={editLink}>
                    <Button variant="ghost" size="sm" className="rounded-xl h-10 px-4 gap-2 text-[10px] font-extrabold uppercase tracking-widest hover:bg-neutral-900 hover:text-white transition-all">
                        <Edit3 size={14} /> Editează
                    </Button>
                </Link>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-xl h-10 w-10 text-red-400 hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-100"
                    onClick={onDelete}
                >
                    <Trash2 size={16} />
                </Button>
            </div>
        </div>
    );
}
