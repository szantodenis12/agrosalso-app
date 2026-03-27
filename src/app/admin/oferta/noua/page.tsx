'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Product } from '@/types';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Printer, Send, ChevronLeft, Loader2, FileText, Clock, ShieldCheck, AlertCircle, CheckCircle2, Circle, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NewStandaloneOfferPage() {
  const router = useRouter();
  const db = useFirestore();
  const offerRef = useRef<HTMLDivElement>(null);

  // Data fetching
  const productsQuery = useMemoFirebase(() => collection(db, 'products'), [db]);
  const { data: products, isLoading: productsLoading } = useCollection<Product>(productsQuery);

  // State
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [beneficiaryCui, setBeneficiaryCui] = useState("");
  const [beneficiaryAddress, setBeneficiaryAddress] = useState("");
  
  const [offerType, setOfferType] = useState<'standard' | 'afir' | 'urgent'>('standard');
  const [editPrice, setEditPrice] = useState<number>(0);
  const [contactPerson, setContactPerson] = useState("Doru Salso");
  const [contactPosition, setContactPosition] = useState("Manager Vânzări");
  const [contactPhone, setContactPhone] = useState("+40 742 936 959");
  const [deliveryTerm, setDeliveryTerm] = useState("2-5 zile lucrătoare");
  const [paymentTerms, setPaymentTerms] = useState("Transfer Bancar / Ordin de plată la livrare");

  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [sending, setSending] = useState(false);

  const product = useMemo(() => products?.find(p => p.id === selectedProductId), [products, selectedProductId]);

  useEffect(() => {
    if (product) {
      setEditPrice(product.price);
      // Select all rows by default
      if (product.specTable?.rows) {
        setSelectedRows(new Set(product.specTable.rows.map((_, i) => i)));
      }
    }
  }, [product]);

  const today = useMemo(() => new Date(), []);
  const offerNumber = useMemo(() => `AS-${today.getFullYear()}-${format(today, 'MMdd')}-NEW`, [today]);

  const toggleRow = (index: number) => {
    const newSet = new Set(selectedRows);
    if (newSet.has(index)) newSet.delete(index);
    else newSet.add(index);
    setSelectedRows(newSet);
  };

  const generatePdfBase64 = async (): Promise<string | null> => {
    if (!offerRef.current) return null;
    try {
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pages = offerRef.current.querySelectorAll('.offer-page');

      for (let i = 0; i < pages.length; i++) {
        const pageElement = pages[i] as HTMLElement;
        const canvas = await html2canvas(pageElement, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      }

      return pdf.output('datauristring').split(',')[1];
    } catch (err) {
      console.error('PDF Generation Error:', err);
      return null;
    }
  };

  const handleSendEmail = async () => {
    if (!product || !customerEmail || !customerName) {
      toast({ variant: "destructive", title: "Date incomplete", description: "Vă rugăm să alegeți un produs și să introduceți datele clientului." });
      return;
    }
    setSending(true);
    
    try {
      const pdfBase64 = await generatePdfBase64();
      if (!pdfBase64) throw new Error("Generarea PDF a eșuat");

      // Salvăm o înregistrare în 'inquiries' marcată ca fiind generată manual
      const newInquiryRef = await addDoc(collection(db, 'inquiries'), {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        productId: product.id,
        productName: product.name,
        message: "Ofertă generată manual de administrator.",
        status: 'replied',
        repliedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        offerId: offerNumber,
        offeredPrice: editPrice,
        offerType: offerType,
        source: 'manual',
        updatedAt: serverTimestamp()
      });

      const response = await fetch('/api/trimite-oferta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryId: newInquiryRef.id,
          offerId: offerNumber,
          customerName: customerName,
          customerEmail: customerEmail,
          productName: product.name,
          pdfBase64
        }),
      });

      if (!response.ok) throw new Error("Eroare la trimiterea email-ului");

      toast({ title: "Ofertă trimisă!", description: "Email-ul cu oferta a fost expediat către client." });
      router.push('/admin/cereri');
    } catch (err: any) {
      toast({ variant: "destructive", title: "Eroare", description: err.message });
    } finally {
      setSending(false);
    }
  };

  const tva = editPrice * 0.21;
  const total = editPrice + tva;

  return (
    <div className="min-h-screen bg-neutral-100 pb-20 print:bg-white print:pb-0">
      {/* Toolbar */}
      <div className="bg-white border-b border-neutral-200 p-6 sticky top-0 z-[100] shadow-md print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}><ChevronLeft /></Button>
            <h1 className="font-headline font-extrabold text-xl tracking-tight uppercase">Generator Ofertă Stand-alone</h1>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
              <SelectTrigger className="w-full md:w-[300px] h-11 rounded-xl bg-neutral-50 border-none">
                <SelectValue placeholder="Selectați un produs..." />
              </SelectTrigger>
              <SelectContent>
                {products?.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.brand} {p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="bg-neutral-50 p-1 rounded-xl flex gap-1 hidden lg:flex">
              <Button variant={offerType === 'standard' ? 'default' : 'ghost'} size="sm" onClick={() => setOfferType('standard')}>Standard</Button>
              <Button variant={offerType === 'afir' ? 'default' : 'ghost'} size="sm" onClick={() => setOfferType('afir')}>AFIR</Button>
              <Button variant={offerType === 'urgent' ? 'default' : 'ghost'} size="sm" onClick={() => setOfferType('urgent')}>Urgență</Button>
            </div>
            
            <Button className="bg-neutral-900 hover:bg-black text-white rounded-xl h-11 px-6 shadow-lg shadow-black/10" onClick={handleSendEmail} disabled={sending || !product}>
              {sending ? <Loader2 className="animate-spin size-4 mr-2" /> : <Send size={18} className="mr-2" />} TRIMITE OFERTA
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-10 px-6">
        
        {/* PDF Preview Area */}
        <div ref={offerRef} className="space-y-10 print:space-y-0 print:block print:p-0">
          {!product ? (
            <div className="bg-white border-4 border-dashed border-neutral-200 rounded-[3rem] p-40 text-center flex flex-col items-center justify-center space-y-4">
              <Package size={80} className="text-neutral-100" />
              <p className="font-headline font-bold text-2xl text-neutral-300 uppercase tracking-tight">Selectați un produs pentru a începe</p>
            </div>
          ) : (
            <>
              {/* PAGINA 1: PREZENTARE */}
              <div className="offer-page max-w-[210mm] mx-auto bg-white shadow-2xl min-h-[297mm] p-[15mm] print:m-0 print:shadow-none relative border border-neutral-200 print:border-none flex flex-col">
                <div className="flex justify-between items-start mb-10">
                  <div className="space-y-1">
                    <Image src="/logo.png" alt="AgroSalso" width={160} height={48} className="h-12 w-auto object-contain" />
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-2">Dealer Utilaje Agricole din 2012 — Bihor, România</p>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      "px-4 py-1.5 rounded text-[10px] font-extrabold uppercase tracking-widest mb-1 shadow-lg",
                      offerType === 'afir' ? "bg-blue-600 text-white" :
                      offerType === 'urgent' ? "bg-red-600 text-white" :
                      "bg-neutral-900 text-accent-lime"
                    )}>
                      {offerType === 'afir' ? 'Ofertă Proiect Fonduri Europene' :
                        offerType === 'urgent' ? 'Ofertă Specială - Prioritate' :
                        'Ofertă Comercială'}
                    </div>
                    <div className="text-[11px] font-bold text-neutral-900">Referință: <span className="font-extrabold">{offerNumber}</span></div>
                    <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest flex items-center justify-end gap-1.5">
                      Emisă la: {format(today, 'dd.MM.yyyy')}
                      <div className="w-1 h-1 bg-accent-lime rounded-full" />
                      <span className="text-neutral-900 font-extrabold">Valabilitate: 15 zile</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-12 mb-12 bg-neutral-50 p-8 rounded-[2rem] border border-neutral-100">
                  <div>
                    <h4 className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest mb-4">Furnizor</h4>
                    <p className="font-headline font-extrabold text-sm text-neutral-900">AGRO SALSO SRL</p>
                    <div className="text-[11px] font-bold text-neutral-500 space-y-0.5 mt-2">
                      <p>CUI: 30425879 | Reg. Com.: J05/1081/2012</p>
                      <p>DN79, Mădăras 417330, Bihor</p>
                      <p className="text-neutral-900 font-extrabold">contact@agrosalso.ro</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest mb-4">Beneficiar</h4>
                    <p className="font-headline font-extrabold text-sm text-neutral-900 uppercase">{customerName || 'Nume Client'}</p>
                    <div className="text-[11px] font-bold text-neutral-500 space-y-2 mt-2">
                       <p className="min-w-[100px] border-b border-dashed border-neutral-200">{beneficiaryCui || 'CUI / CNP'}</p>
                       <p className="min-w-[100px] border-b border-dashed border-neutral-200">{beneficiaryAddress || 'Adresă completă'}</p>
                       <p className="text-neutral-900 font-extrabold">{customerPhone || 'Telefon'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8 flex-1">
                  <div className="relative w-full aspect-[16/9] rounded-[2rem] overflow-hidden bg-neutral-100 border border-neutral-100 shadow-xl">
                    <Image src={product.mainImage} alt={product.name} fill className="object-cover" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-headline font-extrabold text-4xl tracking-tight uppercase leading-tight">
                      <span className="text-accent-lime mr-4">{product.brand}</span>
                      <span className="text-neutral-900">{product.name}</span>
                    </h3>
                    <div className="text-sm text-neutral-600 font-medium leading-relaxed max-w-3xl border-l-4 border-accent-lime pl-6 italic whitespace-pre-wrap">
                      {product.detailedDescription || product.description}
                    </div>
                  </div>
                </div>

                <div className="pt-10 flex justify-between items-center text-[8px] font-bold text-neutral-300 uppercase tracking-widest border-t border-neutral-100">
                  <div>PAGINA 1 / 2 — AGRO SALSO</div>
                  <div className="flex items-center gap-2">
                    <FileText size={10} />
                    TEHNOLOGIE PENTRU AGRICULTURĂ
                  </div>
                </div>
              </div>

              {/* PAGINA 2: SPECIFICAȚII ȘI PREȚ */}
              <div className="offer-page max-w-[210mm] mx-auto bg-white shadow-2xl min-h-[297mm] p-[15mm] print:m-0 print:shadow-none relative border border-neutral-200 print:border-none flex flex-col justify-between">
                <div>
                  <div className="mb-10 opacity-30">
                    <Image src="/logo.png" alt="AgroSalso" width={120} height={36} className="h-8 w-auto object-contain" />
                  </div>

                  {offerType === 'afir' && (
                    <div className="mb-8 p-6 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4">
                      <ShieldCheck className="text-blue-600 shrink-0 mt-1" size={24} />
                      <div className="space-y-1">
                        <p className="text-[10px] font-extrabold text-blue-800 uppercase tracking-widest">Conformitate Tehnică Finanțare</p>
                        <p className="text-[11px] text-blue-600 leading-relaxed font-medium">Prezenta ofertă este întocmită în conformitate cu cerințele tehnice minimale AFIR.</p>
                      </div>
                    </div>
                  )}

                  {product.specTable && (
                    <div className="mb-12">
                      <h4 className="font-headline font-extrabold text-sm uppercase tracking-tight border-b-2 border-neutral-900 pb-2 mb-6 flex items-center gap-3">
                        <div className="w-2 h-2 bg-accent-lime rounded-full" /> Specificații Tehnice
                      </h4>
                      <table className="w-full text-left text-[10px] border-collapse shadow-sm">
                        <thead className="bg-neutral-900 text-white">
                          <tr>
                            {product.specTable.headers.map((h, i) => (
                              <th key={i} className="p-3 font-extrabold border border-neutral-800 uppercase tracking-widest text-[9px]">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {product.specTable.rows.filter((_, i) => selectedRows.has(i)).map((row, ri) => (
                            <tr key={ri} className={cn("transition-colors", row.isPopular ? "bg-accent-lime/10" : "even:bg-neutral-50")}>
                              {row.values.map((v, ci) => (
                                <td key={ci} className="p-3 border border-neutral-100 font-bold text-neutral-700">{v}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="flex justify-end mb-16">
                    <div className="w-[350px] space-y-4 bg-neutral-50 p-8 rounded-[2rem] border border-neutral-100 shadow-sm">
                      <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
                        <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">Preț Unitar (Net)</span>
                        <span className="font-headline font-extrabold text-2xl text-neutral-900">{editPrice.toLocaleString()} EUR</span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
                        <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">TVA (21%)</span>
                        <span className="font-bold text-neutral-600 text-lg">{tva.toLocaleString()} EUR</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-[11px] font-extrabold text-neutral-900 uppercase tracking-[0.2em]">Total de plată</span>
                        <span className="font-headline font-extrabold text-4xl text-neutral-900 tracking-tighter">{total.toLocaleString()} <span className="text-xl">EUR</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-12 pt-10 border-t-2 border-neutral-50">
                    <div className="space-y-4">
                        <h4 className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest">Condiții comerciale:</h4>
                        <div className="space-y-2">
                          <p className="text-[11px] font-bold text-neutral-700">Livrare: <span className="text-neutral-900 border-b border-dashed border-neutral-300">{deliveryTerm}</span></p>
                          <p className="text-[11px] font-bold text-neutral-700">Plată: <span className="text-neutral-900 border-b border-dashed border-neutral-300">{paymentTerms}</span></p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest">Persoană de contact:</h4>
                        <div className="space-y-1">
                          <p className="font-headline font-extrabold text-lg text-neutral-900">{contactPerson}</p>
                          <p className="text-[10px] font-bold text-accent-lime uppercase tracking-widest">{contactPosition}</p>
                          <p className="text-[12px] font-extrabold text-neutral-900 mt-2">{contactPhone}</p>
                        </div>
                    </div>
                  </div>
                </div>
                <div className="pt-10 flex justify-between items-center text-[8px] font-bold text-neutral-300 uppercase tracking-widest border-t border-neutral-100">
                  <div>PAGINA 2 / 2 — AGRO SALSO SRL</div>
                  <div>© {new Date().getFullYear()} WWW.AGROSALSO.RO</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Control Panel (Sidebar) */}
        <div className="space-y-8 print:hidden">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-neutral-100 space-y-8 sticky top-[120px]">
            <section className="space-y-4">
              <h3 className="font-headline font-extrabold text-xs uppercase tracking-widest flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-accent-lime rounded-full" /> Date Client
              </h3>
              <div className="space-y-3">
                <Input placeholder="Nume Complet" value={customerName} onChange={e => setCustomerName(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50" />
                <Input placeholder="Email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50" />
                <Input placeholder="Telefon" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50" />
                <Input placeholder="CUI / CNP" value={beneficiaryCui} onChange={e => setBeneficiaryCui(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50" />
                <Input placeholder="Adresă" value={beneficiaryAddress} onChange={e => setBeneficiaryAddress(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50" />
              </div>
            </section>

            {product && (
              <>
                <section className="space-y-4 pt-4 border-t border-neutral-50">
                  <h3 className="font-headline font-extrabold text-xs uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" /> Editare Preț Net
                  </h3>
                  <div className="relative">
                    <Input type="number" value={editPrice} onChange={e => setEditPrice(parseFloat(e.target.value) || 0)} className="rounded-xl border-neutral-100 bg-neutral-50 pl-14 font-bold text-lg h-14" />
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-neutral-400">EUR</span>
                  </div>
                </section>

                <section className="space-y-4 pt-4 border-t border-neutral-50">
                  <div className="flex justify-between items-center">
                    <h3 className="font-headline font-extrabold text-xs uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" /> Specificații
                    </h3>
                    <span className="text-[9px] font-bold text-neutral-400 capitalize">{selectedRows.size} rânduri selectate</span>
                  </div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                    {product.specTable?.rows.map((row, i) => (
                      <button 
                        key={i} 
                        onClick={() => toggleRow(i)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                          selectedRows.has(i) ? "border-accent-lime bg-accent-lime/5" : "border-neutral-100 hover:border-neutral-200"
                        )}
                      >
                        {selectedRows.has(i) ? <CheckCircle2 size={16} className="text-accent-lime shrink-0" /> : <Circle size={16} className="text-neutral-200 shrink-0" />}
                        <span className="text-[11px] font-bold text-neutral-700 leading-tight">{row.values[0]} {row.values[1]}</span>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="space-y-4 pt-4 border-t border-neutral-50">
                  <h3 className="font-headline font-extrabold text-xs uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" /> Condiții
                  </h3>
                  <div className="space-y-2">
                    <Input placeholder="Termen Livrare" value={deliveryTerm} onChange={e => setDeliveryTerm(e.target.value)} className="text-[11px] font-bold rounded-lg border-neutral-100" />
                    <Input placeholder="Condiții Plată" value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)} className="text-[11px] font-bold rounded-lg border-neutral-100" />
                  </div>
                </section>
              </>
            )}
            
            <Button variant="outline" className="w-full h-12 rounded-xl border-neutral-200 font-bold" onClick={() => window.print()} disabled={!product}>
              <Printer size={18} className="mr-2" /> PDF LOCAL
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
