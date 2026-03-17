
'use client';
import { use, useEffect, useState, useMemo, useRef } from 'react';
import { useFirestore } from '@/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Inquiry, Product } from '@/types';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Printer, Send, ChevronLeft, AlertTriangle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function GenerateOfferPage({ params }: { params: Promise<{ inquiryId: string }> }) {
  const { inquiryId } = use(params);
  const router = useRouter();
  const db = useFirestore();
  const offerRef = useRef<HTMLDivElement>(null);

  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [offerType, setOfferType] = useState<'standard' | 'afir' | 'urgent'>('standard');

  const [editPrice, setEditPrice] = useState<number>(0);
  const [contactPerson, setContactPerson] = useState("Doru Salso");
  const [contactPosition, setContactPosition] = useState("Manager Vânzări");
  const [contactPhone, setContactPhone] = useState("+40 742 936 959");
  const [deliveryTerm, setDeliveryTerm] = useState("2-5 zile lucrătoare");
  const [paymentTerms, setPaymentTerms] = useState("Transfer Bancar / Ordin de plată la livrare");

  const [beneficiaryCui, setBeneficiaryCui] = useState("CUI / CNP beneficiar...");
  const [beneficiaryAddress, setBeneficiaryAddress] = useState("Adresă completă beneficiar...");

  const today = useMemo(() => new Date(), []);
  const offerNumber = useMemo(() => `AS-${format(today, 'yyyy')}-${format(today, 'MMdd')}`, [today]);

  useEffect(() => {
    async function load() {
      try {
        const iSnap = await getDoc(doc(db, 'inquiries', inquiryId));
        if (iSnap.exists()) {
          const inq = { id: iSnap.id, ...iSnap.data() } as Inquiry;
          setInquiry(inq);
          
          const pSnap = await getDoc(doc(db, 'products', inq.productId));
          if (pSnap.exists()) {
            const prod = { id: pSnap.id, ...pSnap.data() } as Product;
            setProduct(prod);
            setEditPrice(prod.price);
          }
        }
      } catch (err) {
        console.error("Error loading offer data:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [db, inquiryId]);

  const displayRows = useMemo(() => {
    if (!product?.specTable?.rows) return [];
    if (inquiry?.selectedModel) {
      const matchedRow = product.specTable.rows.find(row => row.values[0] === inquiry.selectedModel);
      if (matchedRow) return [matchedRow];
    }
    return product.specTable.rows;
  }, [product, inquiry]);

  const generatePdfBase64 = async (): Promise<string | null> => {
    if (!offerRef.current) return null;
    try {
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;

      // Capturăm întregul element, indiferent de lungime
      const canvas = await html2canvas(offerRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: offerRef.current.scrollWidth,
        windowHeight: offerRef.current.scrollHeight
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Adăugăm prima pagină
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Dacă mai avem conținut, adăugăm pagini noi și shiftăm imaginea
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      return pdf.output('datauristring').split(',')[1];
    } catch (err) {
      console.error('PDF Generation Error:', err);
      return null;
    }
  };

  const handleSendEmail = async () => {
    if (!inquiry || !product) return;
    setSending(true);
    
    try {
      const pdfBase64 = await generatePdfBase64();
      if (!pdfBase64) throw new Error("Generarea PDF a eșuat");

      // 1. Update Firestore
      await updateDoc(doc(db, 'inquiries', inquiryId), {
        status: 'replied',
        repliedAt: serverTimestamp(),
        offerId: offerNumber,
        offeredPrice: editPrice,
        beneficiaryCui: beneficiaryCui.includes('...') ? '' : beneficiaryCui,
        beneficiaryAddress: beneficiaryAddress.includes('...') ? '' : beneficiaryAddress,
        updatedAt: serverTimestamp()
      });

      // 2. Call API to send Email via Resend
      const response = await fetch('/api/send-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryId,
          offerId: offerNumber,
          customerName: inquiry.name,
          customerEmail: inquiry.email,
          productName: product.name,
          pdfBase64
        }),
      });

      if (!response.ok) throw new Error("Eroare la trimiterea email-ului");

      toast({ title: "Ofertă trimisă!", description: "Email-ul cu PDF-ul complet a fost expediat către client." });
      router.push('/admin/cereri');
    } catch (err: any) {
      toast({ variant: "destructive", title: "Eroare", description: err.message });
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-accent-lime size-10" /></div>;
  if (!inquiry || !product) return <div className="p-10 text-center font-bold text-neutral-400">Datele nu au fost găsite.</div>;

  const tva = editPrice * 0.19;
  const total = editPrice + tva;

  return (
    <div className="min-h-screen bg-neutral-100 pb-20 print:bg-white print:pb-0">
      <div className="bg-white border-b border-neutral-200 p-6 sticky top-0 z-[100] shadow-md print:hidden toolbar">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}><ChevronLeft /></Button>
            <h1 className="font-headline font-extrabold text-xl tracking-tight">Generator Ofertă</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-neutral-50 p-1 rounded-xl flex gap-1 mr-4">
              <Button variant={offerType === 'standard' ? 'default' : 'ghost'} size="sm" onClick={() => setOfferType('standard')}>Standard</Button>
              <Button variant={offerType === 'afir' ? 'default' : 'ghost'} size="sm" onClick={() => setOfferType('afir')}>AFIR</Button>
              <Button variant={offerType === 'urgent' ? 'default' : 'ghost'} size="sm" onClick={() => setOfferType('urgent')} className="text-red-500">Urgență</Button>
            </div>
            <Button variant="outline" className="rounded-xl h-11 px-6 border-2" onClick={() => window.print()}><Printer size={18} className="mr-2" /> PDF LOCAL</Button>
            <Button className="bg-neutral-900 hover:bg-black text-white rounded-xl h-11 px-6" onClick={handleSendEmail} disabled={sending}>
              {sending ? <Loader2 className="animate-spin size-4 mr-2" /> : <Send size={18} className="mr-2" />} SALVEAZĂ & TRIMITE
            </Button>
          </div>
        </div>
      </div>

      <div ref={offerRef} className="max-w-[210mm] mx-auto my-10 bg-white shadow-2xl min-h-[297mm] p-[15mm] print:m-0 print:shadow-none print:p-[10mm] relative border border-neutral-200 print:border-none flex flex-col justify-between overflow-visible">
        <div>
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
               <div className="flex items-center gap-2">
                  <div className="w-6 h-4 bg-accent-lime rounded-sm rotate-12" />
                  <span className="font-headline font-extrabold text-2xl tracking-tighter uppercase text-neutral-900">Agro Salso</span>
               </div>
               <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Dealer Utilaje Agricole din 2012 — Bihor, România</p>
            </div>
            <div className="text-right">
               <div className="bg-neutral-900 text-accent-lime px-4 py-1 rounded text-[10px] font-extrabold uppercase tracking-widest mb-1">Ofertă de Preț</div>
               <div className="text-[11px] font-bold text-neutral-900">Nr. <span className="font-extrabold">{offerNumber}</span></div>
               <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Data: {format(today, 'dd.MM.yyyy')}</div>
            </div>
          </div>

          <div className="w-full h-px bg-neutral-100 mb-8" />

          <div className="grid grid-cols-2 gap-12 mb-12">
            <div>
              <h4 className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest mb-4">Furnizor</h4>
              <p className="font-headline font-extrabold text-sm text-neutral-900">AGRO SALSO SRL</p>
              <div className="text-[11px] font-bold text-neutral-500 space-y-0.5">
                <p>CUI: 30425879 | Reg. Com.: J05/1234/2012</p>
                <p>DN79, Mădăras 417330, Bihor</p>
                <p className="text-neutral-900">contact@agrosalso.ro</p>
              </div>
            </div>
            <div>
              <h4 className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest mb-4">Beneficiar</h4>
              <p className="font-headline font-extrabold text-sm text-neutral-900 uppercase">{inquiry.name}</p>
              <div className="text-[11px] font-bold text-neutral-500 space-y-1">
                <p contentEditable suppressContentEditableWarning className="focus:outline-accent-lime min-w-[100px] hover:bg-neutral-50 px-1 rounded" onBlur={e => setBeneficiaryCui(e.currentTarget.innerText)}>{beneficiaryCui}</p>
                <p contentEditable suppressContentEditableWarning className="focus:outline-accent-lime hover:bg-neutral-50 px-1 rounded" onBlur={e => setBeneficiaryAddress(e.currentTarget.innerText)}>{beneficiaryAddress}</p>
                <p className="text-neutral-900">{inquiry.phone}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 mb-12">
            <div className="relative w-full aspect-[16/8] rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-100">
              <Image src={product.mainImage} alt={product.name} fill className="object-cover" />
            </div>
            <h3 className="font-headline font-extrabold text-3xl tracking-tight uppercase">
              <span className="text-accent-lime mr-3">{product.brand}</span>
              <span className="text-neutral-900">{product.name}</span>
            </h3>
            <p className="text-sm text-neutral-600 font-medium leading-relaxed">{product.detailedDescription || product.description}</p>

            {product.specTable && displayRows.length > 0 && (
              <div className="pt-4">
                <h4 className="font-headline font-bold text-sm uppercase tracking-tight border-b pb-1.5 mb-3">Specificații Tehnice</h4>
                <table className="w-full text-left text-[10px] border-collapse">
                  <thead className="bg-neutral-50">
                    <tr>
                      {product.specTable.headers.map((h, i) => (
                        <th key={i} className="p-2 font-extrabold border border-neutral-100 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {displayRows.map((row, ri) => (
                      <tr key={ri} className={row.isPopular ? "bg-accent-lime/5" : ""}>
                        {row.values.map((v, ci) => (
                          <td key={ci} className="p-2 border border-neutral-100 font-bold">{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex justify-end mb-12">
            <div className="w-[300px] space-y-3">
              <div className="flex justify-between pb-2 border-b">
                <span className="text-[9px] font-extrabold text-neutral-400 uppercase">Preț Unitar (Net)</span>
                <span contentEditable suppressContentEditableWarning className="font-headline font-extrabold text-xl focus:outline-accent-lime" onBlur={e => setEditPrice(parseFloat(e.currentTarget.innerText.replace(/[^0-9.]/g, '')) || 0)}>{editPrice.toLocaleString()} EUR</span>
              </div>
              <div className="flex justify-between pb-2 border-b">
                <span className="text-[9px] font-extrabold text-neutral-400 uppercase">TVA (19%)</span>
                <span className="font-bold text-neutral-600">{tva.toLocaleString()} EUR</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-[10px] font-extrabold text-neutral-900 uppercase tracking-widest">Total de plată</span>
                <span className="font-headline font-extrabold text-2xl text-neutral-900">{total.toLocaleString()} EUR</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 pt-8 border-t">
            <div className="space-y-3">
               <h4 className="text-[8px] font-extrabold text-neutral-400 uppercase">Condiții comerciale:</h4>
               <p className="text-[10px] font-bold">Livrare: <span contentEditable suppressContentEditableWarning onBlur={e => setDeliveryTerm(e.currentTarget.innerText)}>{deliveryTerm}</span></p>
               <p className="text-[10px] font-bold">Plată: <span contentEditable suppressContentEditableWarning onBlur={e => setPaymentTerms(e.currentTarget.innerText)}>{paymentTerms}</span></p>
            </div>
            <div className="space-y-1">
               <h4 className="text-[8px] font-extrabold text-neutral-400 uppercase">Contact:</h4>
               <p contentEditable suppressContentEditableWarning className="font-headline font-extrabold text-sm" onBlur={e => setContactPerson(e.currentTarget.innerText)}>{contactPerson}</p>
               <p className="text-[9px] font-bold text-neutral-400 uppercase">{contactPosition}</p>
               <p className="text-[11px] font-bold text-neutral-700">{contactPhone}</p>
            </div>
          </div>
        </div>
        <div className="pt-6 flex justify-between text-[7px] font-bold text-neutral-300 uppercase tracking-widest">
           <div>© {new Date().getFullYear()} AGRO SALSO SRL — WWW.AGROSALSO.RO</div>
           <div>TEHNOLOGIE PENTRU AGRICULTURĂ</div>
        </div>
      </div>
    </div>
  );
}
