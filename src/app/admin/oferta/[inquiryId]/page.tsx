'use client';
import { use, useEffect, useState, useMemo, useRef } from 'react';
import { useFirestore } from '@/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Inquiry, Product } from '@/types';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Printer, Send, ChevronLeft, Loader2, FileText, Clock, ShieldCheck, AlertCircle, Plus, Trash2, Type } from 'lucide-react';
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
  const [imageSize, setImageSize] = useState<'large' | 'small' | 'none'>('large');
  const [textSize, setTextSize] = useState<'sm' | 'base' | 'lg'>('base');

  const [editPrice, setEditPrice] = useState<number>(0);
  const [contactPerson, setContactPerson] = useState("Dorina Ile");
  const [contactPosition, setContactPosition] = useState("Manager Vânzări");
  const [contactPhone, setContactPhone] = useState("+40 761 927 076");
  const [deliveryTerm, setDeliveryTerm] = useState("2-5 zile lucrătoare");
  const [paymentTerms, setPaymentTerms] = useState("Transfer Bancar / Ordin de plată la livrare");

  const [beneficiaryCui, setBeneficiaryCui] = useState("CUI / CNP beneficiar...");
  const [beneficiaryAddress, setBeneficiaryAddress] = useState("Adresă completă beneficiar...");

  const [extraItems, setExtraItems] = useState<{id: string, name: string, price: number}[]>([]);

  // Inline editing state
  const [editDescription, setEditDescription] = useState('');
  const [editedCells, setEditedCells] = useState<Record<string, string>>({});
  const [customSections, setCustomSections] = useState<{id: string, title: string, content: string}[]>([]);
  const [editSpecsTitle, setEditSpecsTitle] = useState('Specificații Tehnice');
  const [editExtrasTitle, setEditExtrasTitle] = useState('Echipamente opționale');
  const [editAfirText, setEditAfirText] = useState('Prezenta ofertă este întocmită în conformitate cu cerințele tehnice minimale specifice ghidurilor de finanțare nerambursabilă (AFIR). Utilajul ofertat respectă standardele de siguranță, eficiență energetică și protecția mediului impuse de legislația europeană în vigoare.');
  const [editUrgentText, setEditUrgentText] = useState('Această ofertă beneficiază de procesare prioritară în centrul nostru logistic. Rezervarea utilajului în stoc este garantată timp de 48 de ore de la emitere. Livrare estimată imediat după confirmarea plății.');

  // Subtle inline-edit styling
  const EDITABLE = "hover:bg-accent-lime/5 focus:outline-none focus:ring-1 focus:ring-accent-lime/30 rounded-sm cursor-text transition-colors print:bg-transparent print:ring-0";

  const today = useMemo(() => new Date(), []);
  const offerNumber = useMemo(() => `AS-${today.getFullYear()}-${format(today, 'MMdd')}`, [today]);

  useEffect(() => {
    async function load() {
      try {
        const iSnap = await getDoc(doc(db, 'inquiries', inquiryId));
        if (iSnap.exists()) {
          const inq = { id: iSnap.id, ...iSnap.data() } as Inquiry;
          setInquiry(inq);
          
          if (inq.tavalug) {
             setExtraItems([{ id: Math.random().toString(), name: `Tăvălug: ${inq.tavalug}`, price: 0 }]);
          }

          const pSnap = await getDoc(doc(db, 'products', inq.productId));
          if (pSnap.exists()) {
            const prod = { id: pSnap.id, ...pSnap.data() } as Product;
            setProduct(prod);
            setEditPrice(prod.price);
            setEditDescription(prod.detailedDescription || prod.description || '');
            setEditedCells({});
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
    if (!inquiry || !product) return;
    setSending(true);
    
    try {
      const pdfBase64 = await generatePdfBase64();
      if (!pdfBase64) throw new Error("Generarea PDF a eșuat");

      await updateDoc(doc(db, 'inquiries', inquiryId), {
        status: 'replied',
        repliedAt: serverTimestamp(),
        offerId: offerNumber,
        offeredPrice: editPrice,
        offerType: offerType,
        beneficiaryCui: beneficiaryCui.includes('...') ? '' : beneficiaryCui,
        beneficiaryAddress: beneficiaryAddress.includes('...') ? '' : beneficiaryAddress,
        updatedAt: serverTimestamp()
      });

      const response = await fetch('/api/trimite-oferta', {
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

      toast({ title: "Ofertă trimisă!", description: "Email-ul cu oferta a fost expediat către client." });
      router.push('/admin/cereri');
    } catch (err: any) {
      toast({ variant: "destructive", title: "Eroare", description: err.message });
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-accent-lime size-10" /></div>;
  if (!inquiry || !product) return <div className="p-10 text-center font-bold text-neutral-400">Datele nu au fost găsite.</div>;

  const subtotalExtras = extraItems.reduce((acc, item) => acc + item.price, 0);
  const totalNet = editPrice + subtotalExtras;
  const tva = totalNet * 0.21;
  const total = totalNet + tva;

  return (
    <div className="min-h-screen bg-neutral-100 pb-20 print:bg-white print:pb-0 print:min-h-0">
      {/* Toolbar */}
      <div className="bg-white border-b border-neutral-200 p-6 sticky top-0 z-[100] shadow-md print:hidden toolbar">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}><ChevronLeft /></Button>
            <h1 className="font-headline font-extrabold text-xl tracking-tight uppercase">Generator Ofertă</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-neutral-50 p-1 rounded-xl flex gap-1 mr-4">
              <Button variant={offerType === 'standard' ? 'default' : 'ghost'} size="sm" onClick={() => setOfferType('standard')}>Standard</Button>
              <Button variant={offerType === 'afir' ? 'default' : 'ghost'} size="sm" onClick={() => setOfferType('afir')}>AFIR</Button>
              <Button variant={offerType === 'urgent' ? 'default' : 'ghost'} size="sm" onClick={() => setOfferType('urgent')} className={cn(offerType !== 'urgent' && "text-red-500")}>Urgență</Button>
            </div>
            
            {/* Design Controls */}
            <div className="flex items-center gap-2 mr-2">
              <span className="text-[10px] uppercase font-bold text-neutral-400">Imagine:</span>
              <select 
                value={imageSize} 
                onChange={e => setImageSize(e.target.value as any)} 
                className="bg-neutral-50 text-xs font-bold rounded-lg border border-neutral-200 p-1.5 focus:outline-none"
              >
                <option value="large">Mare</option>
                <option value="small">Mică</option>
                <option value="none">Fără</option>
              </select>
            </div>
            <div className="flex items-center gap-2 mr-4">
              <span className="text-[10px] uppercase font-bold text-neutral-400">Text:</span>
              <select 
                value={textSize} 
                onChange={e => setTextSize(e.target.value as any)} 
                className="bg-neutral-50 text-xs font-bold rounded-lg border border-neutral-200 p-1.5 focus:outline-none"
              >
                <option value="sm">Mic</option>
                <option value="base">Normal</option>
                <option value="lg">Mare</option>
              </select>
            </div>

            <Button variant="outline" className="rounded-xl h-11 px-6 border-2" onClick={() => window.print()}><Printer size={18} className="mr-2" /> PDF LOCAL</Button>
            <Button className="bg-neutral-900 hover:bg-black text-white rounded-xl h-11 px-6" onClick={handleSendEmail} disabled={sending}>
              {sending ? <Loader2 className="animate-spin size-4 mr-2" /> : <Send size={18} className="mr-2" />} SALVEAZĂ & TRIMITE
            </Button>
          </div>
        </div>
      </div>

      <div ref={offerRef} className="space-y-10 print:space-y-0 print:block print:p-0 print:m-0 print:w-full">
        
        {/* PAGINA 1: PREZENTARE */}
        <div className="offer-page max-w-[210mm] mx-auto my-10 bg-white shadow-2xl min-h-[297mm] p-[15mm] print:m-0 print:shadow-none relative border border-neutral-200 print:border-none flex flex-col">
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
              <p className="font-headline font-extrabold text-sm text-neutral-900 uppercase">{inquiry.name}</p>
              <div className="text-[11px] font-bold text-neutral-500 space-y-2 mt-2">
                <p contentEditable suppressContentEditableWarning className="focus:outline-accent-lime min-w-[100px] hover:bg-white border-b border-dashed border-neutral-200 px-1 rounded transition-colors" onBlur={e => { const v = e.currentTarget?.innerText; if (v != null) setBeneficiaryCui(v); }}>{beneficiaryCui}</p>
                <p contentEditable suppressContentEditableWarning className="focus:outline-accent-lime hover:bg-white border-b border-dashed border-neutral-200 px-1 rounded transition-colors" onBlur={e => { const v = e.currentTarget?.innerText; if (v != null) setBeneficiaryAddress(v); }}>{beneficiaryAddress}</p>
                <p className="text-neutral-900 font-extrabold">{inquiry.phone}</p>
              </div>
            </div>
          </div>

          <div className="space-y-8 flex-1">
            {imageSize !== 'none' && (
              <div className={cn(
                "relative w-full rounded-[2rem] overflow-hidden bg-neutral-100 border border-neutral-100 shadow-xl transition-all duration-300",
                imageSize === 'large' ? "aspect-[16/9]" : "aspect-[21/9] max-h-[160px]"
              )}>
                <Image src={product.mainImage} alt={product.name} fill className="object-cover" />
              </div>
            )}
            <div className="space-y-4">
              <h3 className="font-headline font-extrabold text-4xl tracking-tight uppercase leading-tight">
                <span className="text-accent-lime mr-4">{product.brand}</span>
                <span className="text-neutral-900">{product.name}</span>
              </h3>
              <div contentEditable suppressContentEditableWarning
                className={cn(
                  "text-neutral-600 font-medium leading-relaxed max-w-3xl border-l-4 border-accent-lime pl-6 italic whitespace-pre-wrap",
                  textSize === 'sm' ? "text-xs" : textSize === 'lg' ? "text-base" : "text-sm",
                  EDITABLE
                )}
                onBlur={e => { const v = e.currentTarget?.innerText; if (v != null) setEditDescription(v); }}
              >
                {editDescription}
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
        <div className="offer-page max-w-[210mm] mx-auto my-10 bg-white shadow-2xl min-h-[297mm] p-[15mm] print:m-0 print:shadow-none relative border border-neutral-200 print:border-none flex flex-col justify-between">
          <div>
            <div className="mb-10 opacity-30">
              <Image src="/logo.png" alt="AgroSalso" width={120} height={36} className="h-8 w-auto object-contain" />
            </div>

            {/* Secțiune specială AFIR */}
            {offerType === 'afir' && (
              <div className="mb-8 p-6 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4">
                <ShieldCheck className="text-blue-600 shrink-0 mt-1" size={24} />
                <div className="space-y-1">
                  <p className="text-[10px] font-extrabold text-blue-800 uppercase tracking-widest">Conformitate Tehnică Finanțare</p>
                  <p contentEditable suppressContentEditableWarning
                    className={cn("text-[11px] text-blue-600 leading-relaxed font-medium", EDITABLE)}
                    onBlur={e => { const v = e.currentTarget?.innerText; if (v != null) setEditAfirText(v); }}
                  >{editAfirText}</p>
                </div>
              </div>
            )}

            {/* Secțiune specială Urgență */}
            {offerType === 'urgent' && (
              <div className="mb-8 p-6 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-4">
                <AlertCircle className="text-red-600 shrink-0 mt-1" size={24} />
                <div className="space-y-1">
                  <p className="text-[10px] font-extrabold text-red-800 uppercase tracking-widest">Atenție: Stoc Limitat</p>
                  <p contentEditable suppressContentEditableWarning
                    className={cn("text-[11px] text-red-600 leading-relaxed font-bold", EDITABLE)}
                    onBlur={e => { const v = e.currentTarget?.innerText; if (v != null) setEditUrgentText(v); }}
                  >{editUrgentText}</p>
                </div>
              </div>
            )}

            {product.specTable && displayRows.length > 0 && (
              <div className="mb-12">
                <h4 className="font-headline font-extrabold text-sm uppercase tracking-tight border-b-2 border-neutral-900 pb-2 mb-6 flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent-lime rounded-full shrink-0" />
                  <span contentEditable suppressContentEditableWarning className={EDITABLE} onBlur={e => { const v = e.currentTarget?.innerText; if (v != null) setEditSpecsTitle(v); }}>{editSpecsTitle}</span>
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
                    {displayRows.map((row, ri) => (
                      <tr key={ri} className={cn("transition-colors", row.isPopular ? "bg-accent-lime/10" : "even:bg-neutral-50")}>
                        {row.values.map((v, ci) => (
                          <td key={ci}
                            contentEditable suppressContentEditableWarning
                            className={cn("p-3 border border-neutral-100 font-bold text-neutral-700", EDITABLE)}
                            onBlur={e => { const v = e.currentTarget?.innerText; if (v != null) setEditedCells(prev => ({...prev, [`${ri}-${ci}`]: v})); }}
                          >{editedCells[`${ri}-${ci}`] ?? v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {product.specTable.footerNote && (
                  <p className="mt-3 text-[9px] text-neutral-400 italic">*{product.specTable.footerNote}</p>
                )}
              </div>
            )}

            {extraItems.length > 0 && (
              <div className="mb-12">
                <h4 className="font-headline font-extrabold text-sm uppercase tracking-tight border-b-2 border-neutral-900 pb-2 mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent-lime rounded-full shrink-0" />
                    <span contentEditable suppressContentEditableWarning className={EDITABLE} onBlur={e => { const v = e.currentTarget?.innerText; if (v != null) setEditExtrasTitle(v); }}>{editExtrasTitle}</span>
                  </div>
                </h4>
                <table className="w-full text-left text-[10px] border-collapse shadow-sm mb-4">
                  <thead className="bg-neutral-900 text-white">
                    <tr>
                      <th className="p-3 font-extrabold border border-neutral-800 uppercase tracking-widest text-[9px]">Denumire Echipament / Accesoriu</th>
                      <th className="p-3 font-extrabold border border-neutral-800 uppercase tracking-widest text-[9px] w-[150px] text-right">Preț Net (EUR)</th>
                      <th className="p-3 font-extrabold border border-neutral-800 uppercase tracking-widest text-[9px] w-[50px] print:hidden"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {extraItems.map((item, index) => (
                      <tr key={item.id} className="even:bg-neutral-50 group">
                        <td className="p-3 border border-neutral-100 font-bold text-neutral-700">
                          <span contentEditable suppressContentEditableWarning className="focus:outline-accent-lime px-1 min-w-[200px] inline-block" onBlur={(e) => {
                             const newExtras = [...extraItems];
                             newExtras[index].name = e.currentTarget.innerText;
                             setExtraItems(newExtras);
                          }}>{item.name}</span>
                        </td>
                        <td className="p-3 border border-neutral-100 font-bold text-neutral-900 text-right">
                          <span contentEditable suppressContentEditableWarning className="focus:outline-accent-lime px-1 min-w-[50px] inline-block" onBlur={(e) => {
                             const newExtras = [...extraItems];
                             newExtras[index].price = parseFloat(e.currentTarget.innerText.replace(/[^0-9.]/g, '')) || 0;
                             setExtraItems(newExtras);
                          }}>{item.price.toLocaleString()}</span>
                        </td>
                        <td className="p-3 border border-neutral-100 text-center print:hidden">
                          <button onClick={() => setExtraItems(extraItems.filter(i => i.id !== item.id))} className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Custom text sections */}
            {customSections.map(section => (
              <div key={section.id} className="mb-8">
                <h4 className="font-headline font-extrabold text-sm uppercase tracking-tight border-b-2 border-neutral-900 pb-2 mb-4 flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent-lime rounded-full shrink-0" />
                  <span contentEditable suppressContentEditableWarning className={EDITABLE}
                    onBlur={e => { const v = e.currentTarget?.innerText; if (v != null) setCustomSections(prev => prev.map(s => s.id === section.id ? {...s, title: v} : s)); }}
                  >{section.title}</span>
                </h4>
                <p contentEditable suppressContentEditableWarning
                  className={cn("text-[11px] font-medium text-neutral-600 leading-relaxed whitespace-pre-wrap min-h-[2em]", EDITABLE)}
                  onBlur={e => { const v = e.currentTarget?.innerText; if (v != null) setCustomSections(prev => prev.map(s => s.id === section.id ? {...s, content: v} : s)); }}
                >{section.content}</p>
                <button className="mt-2 print:hidden text-red-400 hover:text-red-600 text-[10px] font-bold flex items-center gap-1"
                  onClick={() => setCustomSections(prev => prev.filter(s => s.id !== section.id))}
                ><Trash2 size={12} /> Șterge secțiunea</button>
              </div>
            ))}

            <div className="print:hidden mb-12 border-t border-dashed border-neutral-200 mt-[-20px] pt-4 flex justify-end gap-2">
               <Button variant="outline" size="sm" onClick={() => setCustomSections([...customSections, { id: Math.random().toString(), title: 'Secțiune nouă', content: 'Introduceți textul aici...' }])}>
                 <Type size={14} className="mr-1" /> Adaugă secțiune text
               </Button>
               <Button variant="outline" size="sm" onClick={() => setExtraItems([...extraItems, { id: Math.random().toString(), name: 'Echipament opțional nou', price: 0 }])}>
                 <Plus size={14} className="mr-1" /> Adaugă opțional / serviciu extra
               </Button>
            </div>

            <div className="flex justify-end mb-16">
              <div className="w-[380px] space-y-4 bg-neutral-50 p-8 rounded-[2rem] border border-neutral-100 shadow-sm">
                <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
                  <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">Preț Utilaj (Net)</span>
                  <span contentEditable suppressContentEditableWarning className="font-headline font-extrabold text-2xl text-neutral-900 focus:outline-accent-lime" onBlur={e => { const v = e.currentTarget?.innerText?.replace(/[^0-9.]/g, ''); if (v != null) setEditPrice(parseFloat(v) || 0); }}>{editPrice.toLocaleString()} EUR</span>
                </div>
                {extraItems.length > 0 && (
                  <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
                    <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">Opționale (Net)</span>
                    <span className="font-bold text-neutral-600 text-lg">{subtotalExtras.toLocaleString()} EUR</span>
                  </div>
                )}
                <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
                  <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">Total Net</span>
                  <span className="font-bold text-neutral-800 text-lg">{totalNet.toLocaleString()} EUR</span>
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
                   <p className="text-[11px] font-bold text-neutral-700">Livrare: <span contentEditable suppressContentEditableWarning className="text-neutral-900 border-b border-dashed border-neutral-300" onBlur={e => { const v = e.currentTarget?.innerText; if (v != null) setDeliveryTerm(v); }}>{deliveryTerm}</span></p>
                   <p className="text-[11px] font-bold text-neutral-700">Plată: <span contentEditable suppressContentEditableWarning className="text-neutral-900 border-b border-dashed border-neutral-300" onBlur={e => { const v = e.currentTarget?.innerText; if (v != null) setPaymentTerms(v); }}>{paymentTerms}</span></p>
                   <div className="flex items-center gap-2 pt-1 border-t border-neutral-100 mt-2">
                     <Clock size={12} className="text-accent-lime" />
                     <p className="text-[11px] font-bold text-neutral-900">Valabilitate ofertă: <span className="font-extrabold">15 zile calendaristice</span></p>
                   </div>
                 </div>
              </div>
              <div className="space-y-4">
                 <h4 className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest">Persoană de contact:</h4>
                 <div className="space-y-1">
                   <p contentEditable suppressContentEditableWarning className="font-headline font-extrabold text-lg text-neutral-900" onBlur={e => { const v = e.currentTarget?.innerText; if (v != null) setContactPerson(v); }}>{contactPerson}</p>
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
      </div>
    </div>
  );
}
