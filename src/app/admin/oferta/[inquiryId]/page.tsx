'use client';
import { use, useEffect, useState, useMemo } from 'react';
import { useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Inquiry, Product } from '@/types';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Printer, Send, ChevronLeft, AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type OfferType = 'standard' | 'afir' | 'urgent';

const PLACEHOLDER_CUI = "CUI / CNP beneficiar...";
const PLACEHOLDER_ADDRESS = "Adresă completă beneficiar...";

export default function GenerateOfferPage({ params }: { params: Promise<{ inquiryId: string }> }) {
  const { inquiryId } = use(params);
  const router = useRouter();
  const db = useFirestore();

  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [offerType, setOfferType] = useState<OfferType>('standard');

  const [editPrice, setEditPrice] = useState<number>(0);
  const [contactPerson, setContactPerson] = useState("Doru Salso");
  const [contactPosition, setContactPosition] = useState("Manager Vânzări");
  const [contactPhone, setContactPhone] = useState("+40 742 936 959");
  const [deliveryTerm, setDeliveryTerm] = useState("2-5 zile lucrătoare");
  const [paymentTerms, setPaymentTerms] = useState("Transfer Bancar / Ordin de plată la livrare");

  const [beneficiaryCui, setBeneficiaryCui] = useState(PLACEHOLDER_CUI);
  const [beneficiaryAddress, setBeneficiaryAddress] = useState(PLACEHOLDER_ADDRESS);

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

  // Logic to determine which rows to display in the offer table
  const displayRows = useMemo(() => {
    if (!product?.specTable?.rows) return [];
    
    // If client selected a specific model, try to find and show only that row
    if (inquiry?.selectedModel) {
      const matchedRow = product.specTable.rows.find(row => row.values[0] === inquiry.selectedModel);
      if (matchedRow) return [matchedRow];
    }
    
    // Fallback to all rows if no specific model selected or matched
    return product.specTable.rows;
  }, [product, inquiry]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleSendEmail = async () => {
    setSending(true);
    try {
      const response = await fetch('/api/send-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryId,
          offerId: offerNumber,
          price: editPrice,
          contact: contactPerson
        }),
      });

      if (!response.ok) throw new Error('Ereare trimitere');

      toast({ title: "Ofertă trimisă!", description: "Clientul va primi email-ul în curând." });
      router.push('/admin/cereri');
    } catch (err) {
      toast({ variant: "destructive", title: "Eroare", description: "Nu s-a putut trimite email-ul." });
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-accent-lime size-10" /></div>;
  if (!inquiry || !product) return <div className="p-10 text-center font-bold text-neutral-400">Datele solicitate nu au fost găsite în sistem.</div>;

  const tva = editPrice * 0.19;
  const total = editPrice + tva;

  const showCuiOnPrint = beneficiaryCui && beneficiaryCui !== PLACEHOLDER_CUI && beneficiaryCui.trim() !== "";
  const showAddressOnPrint = beneficiaryAddress && beneficiaryAddress !== PLACEHOLDER_ADDRESS && beneficiaryAddress.trim() !== "";

  return (
    <div className="min-h-screen bg-neutral-100 pb-20 print:bg-white print:pb-0 print:min-h-0">
      <div className="bg-white border-b border-neutral-200 p-6 sticky top-0 z-[100] shadow-md print:hidden toolbar">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button type="button" variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
              <ChevronLeft />
            </Button>
            <h1 className="font-headline font-extrabold text-xl tracking-tight">Generator Ofertă</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-neutral-50 p-1 rounded-xl flex gap-1 mr-4">
              <Button type="button" variant={offerType === 'standard' ? 'default' : 'ghost'} size="sm" onClick={() => setOfferType('standard')} className="rounded-lg h-9">Standard</Button>
              <Button type="button" variant={offerType === 'afir' ? 'default' : 'ghost'} size="sm" onClick={() => setOfferType('afir')} className="rounded-lg h-9">AFIR</Button>
              <Button type="button" variant={offerType === 'urgent' ? 'default' : 'ghost'} size="sm" onClick={() => setOfferType('urgent')} className="rounded-lg h-9 text-red-500 hover:text-red-600">Urgență</Button>
            </div>
            
            <Button type="button" variant="outline" className="rounded-xl h-11 px-6 gap-2 border-2" onClick={handlePrint}>
              <Printer size={18} /> DESCĂRCĂ PDF
            </Button>
            <Button type="button" className="bg-neutral-900 hover:bg-black text-white rounded-xl h-11 px-6 gap-2" onClick={handleSendEmail} disabled={sending}>
              {sending ? <Loader2 className="animate-spin size-4" /> : <Send size={18} />} TRIMITE EMAIL
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[210mm] mx-auto my-10 bg-white shadow-2xl min-h-[297mm] p-[15mm] print:m-0 print:shadow-none print:p-[10mm] relative border border-neutral-200 print:border-none flex flex-col justify-between overflow-hidden">
        <div>
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
               <div className="flex items-center gap-2">
                  <div className="w-6 h-4 bg-accent-lime rounded-sm rotate-12" />
                  <span className="font-headline font-extrabold text-2xl tracking-tighter uppercase text-neutral-900">Agro Salso</span>
               </div>
               <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                 Dealer Utilaje Agricole din 2012 — Bihor, România
               </p>
            </div>
            <div className="text-right flex flex-col items-end gap-1">
               <div className="bg-neutral-900 text-accent-lime px-4 py-1 rounded text-[10px] font-extrabold uppercase tracking-widest mb-1">
                 Ofertă de Preț
               </div>
               <div className="text-[11px] font-bold text-neutral-900">
                 Nr. <span className="font-extrabold">{offerNumber}-{inquiryId.slice(0, 4).toUpperCase()}</span>
               </div>
               <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                 Data: {format(today, 'dd.MM.yyyy')}
               </div>
               <div className="text-[10px] text-neutral-900 font-extrabold uppercase tracking-widest mt-0.5">
                 Valabilitate: 15 Zile
               </div>
            </div>
          </div>

          <div className="w-full h-px bg-neutral-100 mb-8" />

          <div className="grid grid-cols-2 gap-12 mb-12">
            <div>
              <h4 className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest mb-4">Furnizor</h4>
              <div className="space-y-1">
                <p className="font-headline font-extrabold text-sm text-neutral-900 leading-tight">AGRO SALSO SRL</p>
                <div className="text-[11px] font-bold text-neutral-500 space-y-0.5">
                  <p>CUI: 30425879 | Reg. Com.: J05/1234/2012</p>
                  <p>DN79, Mădăras 417330, Bihor</p>
                  <p className="text-neutral-900">contact@agrosalso.ro</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest mb-4">Beneficiar</h4>
              <div className="space-y-1">
                <p className="font-headline font-extrabold text-sm text-neutral-900 leading-tight uppercase">{inquiry.name}</p>
                <div className="text-[11px] font-bold text-neutral-500 space-y-1">
                  <p 
                    contentEditable 
                    suppressContentEditableWarning={true}
                    className={cn(
                      "focus:outline-accent-lime inline-block min-w-[100px] hover:bg-neutral-50 cursor-pointer px-1 rounded transition-colors",
                      !showCuiOnPrint && "print:hidden",
                      beneficiaryCui === PLACEHOLDER_CUI && "text-neutral-300 font-normal italic"
                    )}
                    onBlur={e => setBeneficiaryCui(e.currentTarget.innerText)}
                    onFocus={e => { if(beneficiaryCui === PLACEHOLDER_CUI) e.currentTarget.innerText = ""; }}
                  >
                    {beneficiaryCui}
                  </p>
                  <p 
                    contentEditable 
                    suppressContentEditableWarning={true}
                    className={cn(
                      "focus:outline-accent-lime block hover:bg-neutral-50 cursor-pointer px-1 rounded transition-colors",
                      !showAddressOnPrint && "print:hidden",
                      beneficiaryAddress === PLACEHOLDER_ADDRESS && "text-neutral-300 font-normal italic"
                    )}
                    onBlur={e => setBeneficiaryAddress(e.currentTarget.innerText)}
                    onFocus={e => { if(beneficiaryAddress === PLACEHOLDER_ADDRESS) e.currentTarget.innerText = ""; }}
                  >
                    {beneficiaryAddress}
                  </p>
                  <div className="flex gap-4">
                    <p className="text-neutral-900">{inquiry.phone}</p>
                    <p>{inquiry.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {offerType === 'urgent' && (
            <div className="bg-red-600 text-white p-6 rounded-2xl mb-8 flex items-center gap-4">
              <AlertTriangle className="shrink-0" size={32} />
              <div>
                <p className="font-bold text-lg uppercase tracking-tight">STOC LIMITAT - LIVRARE IMEDIATĂ</p>
                <p className="text-sm opacity-90">Prețul este valabil doar pentru utilajele aflate pe stoc în momentul emiterii.</p>
              </div>
            </div>
          )}

          <div className="space-y-6 mb-12">
            <div className="relative w-full aspect-[16/8] rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-100 shadow-sm">
              <Image src={product.mainImage} alt={product.name} fill className="object-cover" />
            </div>

            <div className="flex items-center justify-between gap-4 pt-2">
              <h3 className="font-headline font-extrabold text-3xl tracking-tight leading-none uppercase">
                <span className="text-accent-lime mr-3">{product.brand}</span>
                <span className="text-neutral-900">{product.name}</span>
              </h3>
              
              <div className="flex items-center gap-2 bg-neutral-50 text-neutral-900 px-4 py-2 rounded-full border border-neutral-100 shrink-0">
                <div className={cn("w-2 h-2 rounded-full", product.inStock ? "bg-accent-lime" : "bg-neutral-300")} />
                <span className="text-[10px] font-extrabold uppercase tracking-widest">
                  {product.inStock 
                    ? "Pe stoc — livrare imediată" 
                    : "În stoc furnizor, livrare confirmată după plasarea comenzii"}
                </span>
              </div>
            </div>

            <div className="prose prose-neutral max-w-none">
              <p className="text-sm text-neutral-600 font-medium leading-relaxed">
                {product.detailedDescription || product.description}
              </p>
            </div>

            {product.specTable && displayRows.length > 0 && (
              <div className="pt-4 space-y-3">
                <h4 className="font-headline font-bold text-sm uppercase tracking-tight border-b border-neutral-100 pb-1.5">
                  {inquiry.selectedModel ? `Specificații Tehnice: Model ${inquiry.selectedModel}` : 'Specificații Tehnice Modele'}
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[10px] border-collapse">
                    <thead className="bg-neutral-50">
                      <tr>
                        {product.specTable.headers.map((h, i) => (
                          <th key={i} className="p-2 font-extrabold uppercase tracking-widest border border-neutral-100">{h}</th>
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
                {product.specTable.footerNote && (
                  <p className="text-[8px] text-neutral-400 italic">{product.specTable.footerNote}</p>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end mb-12">
            <div className="w-[320px] space-y-4">
              <div className="flex justify-between items-end pb-2 border-b border-neutral-100">
                <div className="flex flex-col">
                  <span className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest">Preț Unitar (Net)</span>
                  <span className="text-[8px] text-accent-lime font-bold uppercase tracking-widest opacity-0 hover:opacity-100 transition-opacity">Editează direct →</span>
                </div>
                <div className="text-right">
                  <span 
                    contentEditable 
                    suppressContentEditableWarning={true}
                    onBlur={(e) => {
                      const val = parseFloat(e.currentTarget.innerText.replace(/[^0-9]/g, '')) || 0;
                      setEditPrice(val);
                      e.currentTarget.innerText = val.toLocaleString();
                    }}
                    className="font-headline font-extrabold text-xl text-neutral-900 focus:outline-accent-lime hover:bg-neutral-50 cursor-pointer px-2 py-0.5 rounded transition-colors"
                  >
                    {editPrice.toLocaleString()}
                  </span>
                  <span className="ml-1.5 font-bold text-[10px] text-neutral-400">EUR</span>
                </div>
              </div>

              <div className="flex justify-between items-end pb-2 border-b border-neutral-100">
                <span className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest">TVA (19%)</span>
                <div className="text-right">
                  <span className="font-bold text-sm text-neutral-600">{tva.toLocaleString()}</span>
                  <span className="ml-1.5 font-bold text-[10px] text-neutral-400">EUR</span>
                </div>
              </div>

              <div className="flex justify-between items-end pt-2">
                <span className="text-[10px] font-extrabold text-neutral-900 uppercase tracking-[0.2em]">Total de plată</span>
                <div className="text-right">
                  <span className="font-headline font-extrabold text-2xl text-neutral-900 tracking-tight">
                    {total.toLocaleString()}
                  </span>
                  <span className="ml-2 font-bold text-xs text-neutral-400">EUR</span>
                </div>
              </div>
            </div>
          </div>

          {offerType === 'afir' && (
            <div className="bg-neutral-50 p-6 rounded-[2rem] mb-12 border border-neutral-100 space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-green-600 size-4" />
                <h4 className="font-headline font-extrabold text-sm uppercase tracking-tight">Criterii Conformitate AFIR</h4>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {[
                  "Utilajul este nou și nefolosit anterior.",
                  "Sistemul îndeplinește standardele europene de siguranță (Certificare CE).",
                  "Produsul este eligibil pentru finanțare prin fonduri nerambursabile (PNDR).",
                  "Echipamentul contribuie la modernizarea exploatației agricole.",
                  "Garanția și service-ul post-vânzare sunt asigurate de AgroSalso."
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                     <div className="w-3 h-3 rounded border border-green-600 shrink-0 mt-0.5 flex items-center justify-center">
                       <div className="w-1 h-1 bg-green-600 rounded-sm" />
                     </div>
                     <p className="text-[10px] font-medium text-neutral-700">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-12 pt-8 border-t border-neutral-100">
            <div className="space-y-4">
               <h4 className="text-[8px] font-extrabold text-neutral-400 uppercase tracking-widest">Condiții comerciale:</h4>
               <div className="space-y-3">
                 <div>
                   <p className="text-[8px] font-bold text-neutral-400 uppercase mb-0.5">Termen de livrare:</p>
                   <p 
                      contentEditable 
                      suppressContentEditableWarning={true}
                      className="text-[11px] font-bold text-neutral-900 focus:outline-accent-lime inline-block hover:bg-neutral-50 cursor-pointer px-1 rounded transition-colors" 
                      onBlur={e => setDeliveryTerm(e.currentTarget.innerText)}
                   >
                      {deliveryTerm}
                   </p>
                 </div>
                 <div>
                   <p className="text-[8px] font-bold text-neutral-400 uppercase mb-0.5">Condiții de plată:</p>
                   <p 
                      contentEditable 
                      suppressContentEditableWarning={true}
                      className="text-[11px] font-bold text-neutral-900 focus:outline-accent-lime inline-block hover:bg-neutral-50 cursor-pointer px-1 rounded transition-colors" 
                      onBlur={e => setPaymentTerms(e.currentTarget.innerText)}
                   >
                      {paymentTerms}
                   </p>
                 </div>
               </div>
            </div>
            <div className="space-y-4">
               <h4 className="text-[8px] font-extrabold text-neutral-400 uppercase tracking-widest">Persoană de contact:</h4>
               <div className="space-y-0.5">
                 <p 
                    contentEditable 
                    suppressContentEditableWarning={true}
                    className="font-headline font-extrabold text-sm text-neutral-900 focus:outline-accent-lime hover:bg-neutral-50 cursor-pointer px-1 rounded transition-colors" 
                    onBlur={e => setContactPerson(e.currentTarget.innerText)}
                 >
                    {contactPerson}
                 </p>
                 <p 
                    contentEditable 
                    suppressContentEditableWarning={true}
                    className="text-[9px] font-bold text-neutral-400 uppercase focus:outline-accent-lime hover:bg-neutral-50 cursor-pointer px-1 rounded transition-colors" 
                    onBlur={e => setContactPosition(e.currentTarget.innerText)}
                 >
                    {contactPosition}
                 </p>
                 <p 
                    contentEditable 
                    suppressContentEditableWarning={true}
                    className="text-[11px] font-bold text-neutral-700 mt-1.5 focus:outline-accent-lime hover:bg-neutral-50 cursor-pointer px-1 rounded transition-colors" 
                    onBlur={e => setContactPhone(e.currentTarget.innerText)}
                 >
                    {contactPhone}
                 </p>
               </div>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-50 pt-6 flex justify-between items-center text-[7px] font-bold text-neutral-300 uppercase tracking-widest mt-8">
           <div>© {new Date().getFullYear()} AGRO SALSO SRL — BIHOR, ROMÂNIA</div>
           <div className="flex gap-6">
             <span>WWW.AGROSALSO.RO</span>
             <span className="text-neutral-200">TEHNOLOGIE PENTRU AGRICULTURĂ</span>
           </div>
        </div>
      </div>
    </div>
  );
}
