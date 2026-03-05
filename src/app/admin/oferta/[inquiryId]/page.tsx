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

  // Date editabile Furnizor/Contact
  const [editPrice, setEditPrice] = useState<number>(0);
  const [contactPerson, setContactPerson] = useState("Doru Salso");
  const [contactPosition, setContactPosition] = useState("Manager Vânzări");
  const [contactPhone, setContactPhone] = useState("+40 751 234 567");
  const [deliveryTerm, setDeliveryTerm] = useState("2-5 zile lucrătoare");
  const [paymentTerms, setPaymentTerms] = useState("Transfer Bancar / Ordin de plată la livrare");

  // Date editabile Beneficiar
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

      if (!response.ok) throw new Error('Eroare trimitere');

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

  // Helpers pentru verificarea prezenței datelor la print
  const showCuiOnPrint = beneficiaryCui && beneficiaryCui !== PLACEHOLDER_CUI && beneficiaryCui.trim() !== "";
  const showAddressOnPrint = beneficiaryAddress && beneficiaryAddress !== PLACEHOLDER_ADDRESS && beneficiaryAddress.trim() !== "";

  return (
    <div className="min-h-screen bg-neutral-100 pb-20 print:bg-white print:pb-0 print:min-h-0">
      {/* Toolbar - Ascuns la Print */}
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

      {/* Pagina de Ofertă - Format A4 Simulat */}
      <div className="max-w-[210mm] mx-auto my-10 bg-white shadow-2xl min-h-[297mm] p-[15mm] print:m-0 print:shadow-none print:p-[10mm] relative border border-neutral-200 print:border-none flex flex-col justify-between overflow-hidden">
        
        <div>
          {/* Header Layout */}
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
               <div className="flex items-center gap-2">
                  <div className="w-6 h-4 bg-accent-lime rounded-sm rotate-12" />
                  <span className="font-headline font-extrabold text-2xl tracking-tighter uppercase">Agro Salso</span>
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

          {/* Furnizor vs Beneficiar */}
          <div className="grid grid-cols-2 gap-12 mb-12">
            <div>
              <h4 className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest mb-4">Furnizor</h4>
              <div className="space-y-1">
                <p className="font-headline font-extrabold text-sm text-neutral-900 leading-tight">AGRO SALSO SRL</p>
                <div className="text-[11px] font-bold text-neutral-500 space-y-0.5">
                  <p>CUI: 30425879 | Reg. Com.: J05/1234/2012</p>
                  <p>DN79, Mădăras 417330, Bihor</p>
                  <p className="text-neutral-900">office@agrosalso.ro</p>
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
                      "focus:outline-accent-lime inline-block min-w-[100px]",
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
                      "focus:outline-accent-lime block",
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

          {/* Banner Urgență */}
          {offerType === 'urgent' && (
            <div className="bg-red-600 text-white p-6 rounded-2xl mb-8 flex items-center gap-4">
              <AlertTriangle className="shrink-0" size={32} />
              <div>
                <p className="font-bold text-lg uppercase tracking-tight">STOC LIMITAT - LIVRARE IMEDIATĂ</p>
                <p className="text-sm opacity-90">Prețul este valabil doar pentru utilajele aflate pe stoc în momentul emiterii.</p>
              </div>
            </div>
          )}

          {/* Detalii Utilaj */}
          <div className="space-y-8 mb-12">
            <div className="flex gap-8 items-center bg-neutral-50/50 p-6 rounded-3xl border border-neutral-50">
               <div className="relative w-[160px] h-[110px] bg-white rounded-2xl overflow-hidden border border-neutral-100 shrink-0 shadow-sm">
                 <Image src={product.mainImage} alt={product.name} fill className="object-cover" />
               </div>
               <div className="flex-1 space-y-2">
                 <div className="space-y-0.5">
                   <span className="text-[9px] font-extrabold text-accent-lime uppercase tracking-widest">{product.brand}</span>
                   <h3 className="font-headline font-extrabold text-2xl text-neutral-900 tracking-tight leading-none">{product.name}</h3>
                 </div>
                 <p className="text-[11px] text-neutral-600 leading-relaxed font-medium">{product.shortDescription}</p>
               </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-headline font-bold text-base border-b border-neutral-100 pb-2">Specificații Tehnice</h4>
              <div className="grid grid-cols-2 gap-x-12 gap-y-1 text-[11px]">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-1.5 border-b border-neutral-50">
                    <span className="font-bold text-neutral-400 uppercase text-[8px] tracking-widest">{key}</span>
                    <span className="font-bold text-neutral-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Calcul Preț */}
          <div className="flex justify-end mb-12">
            <div className="w-[300px] space-y-2">
               <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                 <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Preț Unitar (Net)</span>
                 <div className="flex items-baseline gap-1">
                   <span 
                     contentEditable 
                     suppressContentEditableWarning={true}
                     onBlur={(e) => setEditPrice(parseFloat(e.target.innerText.replace(/[^0-9]/g, '')) || 0)}
                     className="font-headline font-extrabold text-xl text-neutral-900 focus:outline-accent-lime px-1 min-w-[50px] inline-block"
                   >
                     {editPrice.toLocaleString()}
                   </span>
                   <span className="font-bold text-[10px]">RON</span>
                 </div>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                 <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">TVA (19%)</span>
                 <span className="font-bold text-xs text-neutral-900">{tva.toLocaleString()} RON</span>
               </div>
               <div className="flex justify-between items-center py-4 bg-accent-lime/10 px-6 rounded-2xl mt-4">
                 <span className="text-[10px] font-extrabold text-neutral-900 uppercase tracking-widest">Total de plată</span>
                 <span className="font-headline font-extrabold text-2xl text-neutral-900">{total.toLocaleString()} RON</span>
               </div>
            </div>
          </div>

          {/* AFIR Compliance Section */}
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

          {/* Condiții comerciale */}
          <div className="grid grid-cols-2 gap-12 pt-8 border-t border-neutral-100">
            <div className="space-y-4">
               <h4 className="text-[8px] font-extrabold text-neutral-400 uppercase tracking-widest">Condiții comerciale:</h4>
               <div className="space-y-3">
                 <div>
                   <p className="text-[8px] font-bold text-neutral-400 uppercase mb-0.5">Termen de livrare:</p>
                   <p 
                      contentEditable 
                      suppressContentEditableWarning={true}
                      className="text-[11px] font-bold text-neutral-900 focus:outline-accent-lime inline-block" 
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
                      className="text-[11px] font-bold text-neutral-900 focus:outline-accent-lime inline-block" 
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
                    className="font-headline font-extrabold text-sm text-neutral-900 focus:outline-accent-lime" 
                    onBlur={e => setContactPerson(e.currentTarget.innerText)}
                 >
                    {contactPerson}
                 </p>
                 <p 
                    contentEditable 
                    suppressContentEditableWarning={true}
                    className="text-[9px] font-bold text-neutral-400 uppercase focus:outline-accent-lime" 
                    onBlur={e => setContactPosition(e.currentTarget.innerText)}
                 >
                    {contactPosition}
                 </p>
                 <p 
                    contentEditable 
                    suppressContentEditableWarning={true}
                    className="text-[11px] font-bold text-neutral-700 mt-1.5 focus:outline-accent-lime" 
                    onBlur={e => setContactPhone(e.currentTarget.innerText)}
                 >
                    {contactPhone}
                 </p>
               </div>
            </div>
          </div>
        </div>

        {/* Footer Pagina */}
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
