'use client';
import { useState, useMemo, useRef, useEffect, Suspense } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Product, Inquiry, Reception } from '@/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Printer, ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { ReceptionPDF } from '@/components/admin/ReceptionPDF';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function NewReceptionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inquiryId = searchParams.get('inquiryId');
  const editId = searchParams.get('editId');
  const db = useFirestore();
  const receptionRef = useRef<HTMLDivElement>(null);

  // Data fetching
  const productsQuery = useMemoFirebase(() => collection(db, 'products'), [db]);
  const { data: products, isLoading: productsLoading } = useCollection<Product>(productsQuery);

  // State
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerRegCom, setCustomerRegCom] = useState("");
  const [customerCui, setCustomerCui] = useState("");
  const [customerBank, setCustomerBank] = useState("");
  const [customerIban, setCustomerIban] = useState("");
  const [customerRepresentative, setCustomerRepresentative] = useState("");
  const [customerPosition, setCustomerPosition] = useState("administrator");

  const [serialNumber, setSerialNumber] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [totalPriceWithVat, setTotalPriceWithVat] = useState(0);

  const [contractNumber, setContractNumber] = useState("");
  const [contractDate, setContractDate] = useState("");

  const [invoiceSeries, setInvoiceSeries] = useState("ASFC");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(format(new Date(), 'dd.MM.yyyy'));

  const [receptionNumber, setReceptionNumber] = useState("");
  const [receptionDate, setReceptionDate] = useState(format(new Date(), 'dd.MM.yyyy'));

  const [delegatFurnizor, setDelegatFurnizor] = useState("SACAREA SIMONA");
  const [delegatBeneficiar, setDelegatBeneficiar] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);

  // Load inquiry/contract data
  useEffect(() => {
    if (inquiryId && db && !editId) {
      getDoc(doc(db, 'inquiries', inquiryId)).then((snap) => {
        if (snap.exists()) {
          const data = snap.data() as Inquiry;
          setCustomerName(data.name);
          setSelectedProductId(data.productId);
          setDelegatBeneficiar(data.name);
        }
      });

      // Try to find the latest contract for this inquiry to auto-fill
      const contractsQuery = collection(db, 'contracts');
      getDoc(doc(db, 'inquiries', inquiryId)).then(async (snap) => {
        // We already did this above, but let's fetch the contract separately
        // For simplicity, we just fetch all contracts and filter manually since we don't have indexes yet
        const { getDocs, query, where } = await import('firebase/firestore');
        const q = query(collection(db, 'contracts'), where('inquiryId', '==', inquiryId));
        const qSnap = await getDocs(q);
        if (!qSnap.empty) {
            const lastContract = qSnap.docs[qSnap.docs.length - 1].data();
            setContractNumber(lastContract.number);
            setContractDate(lastContract.date);
        }
      });
    }
  }, [inquiryId, db, editId]);

  // Load existing for editing
  useEffect(() => {
    if (editId && db) {
      getDoc(doc(db, 'receptions', editId)).then((snap) => {
        if (snap.exists()) {
          const data = snap.data() as any;
          setReceptionNumber(data.number);
          setReceptionDate(data.date);
          setContractNumber(data.contract.number);
          setContractDate(data.contract.date);
          setSelectedProductId(data.productId);
          setCustomerName(data.beneficiar.name);
          setCustomerAddress(data.beneficiar.address);
          setCustomerRegCom(data.beneficiar.regCom);
          setCustomerCui(data.beneficiar.cui);
          setCustomerBank(data.beneficiar.bank);
          setCustomerIban(data.beneficiar.iban);
          setCustomerRepresentative(data.beneficiar.representative);
          setCustomerPosition(data.beneficiar.position);
          setSerialNumber(data.obiect.serialNumber);
          setQuantity(data.obiect.quantity);
          setTotalPriceWithVat(data.obiect.totalPriceWithVat);
          setInvoiceSeries(data.factura.series);
          setInvoiceNumber(data.factura.number);
          setInvoiceDate(data.factura.date);
          setDelegatFurnizor(data.delegat.furnizor);
          setDelegatBeneficiar(data.delegat.beneficiar);
        }
      });
    }
  }, [editId, db]);

  const product = useMemo(() => products?.find(p => p.id === selectedProductId), [products, selectedProductId]);

  const isFormValid = useMemo(() => {
    return (
      selectedProductId &&
      customerName &&
      customerCui &&
      serialNumber &&
      receptionNumber &&
      contractNumber
    );
  }, [selectedProductId, customerName, customerCui, serialNumber, receptionNumber, contractNumber]);

  const handleSave = async (showToast = true) => {
    if (!db) return null;
    try {
      const docData = {
        number: receptionNumber,
        date: receptionDate,
        inquiryId: inquiryId || null,
        productId: selectedProductId,
        productName: product?.name || '',
        contract: {
          number: contractNumber,
          date: contractDate
        },
        beneficiar: {
          name: customerName,
          address: customerAddress,
          regCom: customerRegCom || 'N/A',
          cui: customerCui,
          bank: customerBank,
          iban: customerIban,
          representative: customerRepresentative,
          position: customerPosition
        },
        obiect: {
          name: product?.name || '',
          serialNumber,
          quantity,
          totalPriceWithVat
        },
        factura: {
          series: invoiceSeries,
          number: invoiceNumber,
          date: invoiceDate
        },
        delegat: {
          furnizor: delegatFurnizor,
          beneficiar: delegatBeneficiar
        },
        emitent: {
          name: "SC AGRO SALSO SRL",
          regCom: "J05/1081/2012",
          cui: "RO30425879",
          address: "Salonta str.P.Paulescu Q6 jud.BIHOR",
          representative: "SACAREA SIMONA"
        },
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      };

      if (editId) {
        await updateDoc(doc(db, 'receptions', editId), docData);
        if (showToast) toast({ title: "Modificări salvate!", description: "Procesul verbal a fost actualizat." });
        return editId;
      } else {
        const docRef = await addDoc(collection(db, 'receptions'), docData);
        if (showToast) toast({ title: "Proces verbal salvat!", description: "Îl poți vedea acum în consola cererii." });
        const params = new URLSearchParams(searchParams.toString());
        params.set('editId', docRef.id);
        router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false });
        return docRef.id;
      }
    } catch (err: any) {
      if (showToast) toast({ variant: "destructive", title: "Eroare la salvare", description: err.message });
      return null;
    }
  };

  const generatePdf = async () => {
    if (!receptionRef.current) return;
    setIsGenerating(true);
    try {
      await handleSave(false);
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;

      const element = document.getElementById('print-version') as HTMLElement;
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Proces_Verbal_${receptionNumber.replace(/\//g, '_')}.pdf`);
      toast({ title: "Document emis!", description: "PDF-ul a fost descărcat." });
      router.push('/admin/cereri');
    } catch (err: any) {
      toast({ variant: "destructive", title: "Eroare", description: err.message });
    } finally {
      setIsGenerating(false);
    }
  };

  const receptionData: Reception = {
    id: 'preview',
    number: receptionNumber,
    date: receptionDate,
    productId: selectedProductId,
    productName: product?.name || '',
    contract: {
      number: contractNumber,
      date: contractDate
    },
    beneficiar: {
      name: customerName,
      address: customerAddress,
      regCom: customerRegCom || 'N/A',
      cui: customerCui,
      bank: customerBank,
      iban: customerIban,
      representative: customerRepresentative,
      position: customerPosition
    },
    obiect: {
      name: product?.name || '',
      serialNumber,
      quantity,
      totalPriceWithVat
    },
    factura: {
      series: invoiceSeries,
      number: invoiceNumber,
      date: invoiceDate
    },
    delegat: {
      furnizor: delegatFurnizor,
      beneficiar: delegatBeneficiar
    },
    emitent: {
      name: "SC AGRO SALSO SRL",
      regCom: "J05/1081/2012",
      cui: "RO30425879",
      address: "Salonta str.P.Paulescu Q6 jud.BIHOR",
      representative: "SACAREA SIMONA"
    },
    createdAt: null
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 font-body">
      <div className="bg-white border-b border-neutral-200 p-6 sticky top-0 z-[100] shadow-sm">
        <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}><ChevronLeft /></Button>
            <h1 className="font-headline font-extrabold text-xl tracking-tight uppercase">Proces Verbal Recepție</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
                variant="outline"
                className="rounded-xl h-11 px-6 border-neutral-200 hover:bg-neutral-50 font-bold"
                onClick={() => handleSave()}
                disabled={isGenerating || !isFormValid}
            >
                SALVEAZĂ PROIECT
            </Button>
            <Button 
                className="bg-neutral-900 hover:bg-black text-white rounded-xl h-11 px-8 shadow-lg shadow-black/10" 
                onClick={generatePdf} 
                disabled={isGenerating || !isFormValid}
            >
                {isGenerating ? <Loader2 className="animate-spin size-4 mr-2" /> : <Printer size={18} className="mr-2" />} 
                EMITE DOCUMENT (PDF)
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto mt-10 grid grid-cols-1 xl:grid-cols-[450px_1fr] gap-10 px-6">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-neutral-100 space-y-8 max-h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar">
            
            <section className="space-y-4">
                <h3 className="font-headline font-extrabold text-xs uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-accent-lime rounded-full" /> 1. Identificare Document
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-neutral-400">Nr. Proces Verbal</Label>
                        <Input placeholder="02" value={receptionNumber} onChange={e => setReceptionNumber(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 h-10 text-sm font-bold" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-neutral-400">Data Receptie</Label>
                        <Input value={receptionDate} onChange={e => setReceptionDate(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 h-10 text-sm" />
                    </div>
                </div>
            </section>

            <section className="space-y-4 pt-4 border-t border-neutral-50">
              <h3 className="font-headline font-extrabold text-xs uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" /> 2. Produs & Cantitate
              </h3>
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger className="w-full h-12 rounded-xl bg-neutral-50 border-none text-sm">
                  <SelectValue placeholder="Alegeți utilajul..." />
                </SelectTrigger>
                <SelectContent>
                  {products?.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.brand} {p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-neutral-400">Serie Utilaj</Label>
                    <Input placeholder="1/ZUK/2026" value={serialNumber} onChange={e => setSerialNumber(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 h-10 text-sm font-bold" />
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-neutral-400">Bucăți</Label>
                    <Input type="number" value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 1)} className="rounded-xl border-neutral-100 bg-neutral-50 h-10 text-sm font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-neutral-400">Valoare Totală cu TVA</Label>
                <Input type="number" value={totalPriceWithVat} onChange={e => setTotalPriceWithVat(parseFloat(e.target.value) || 0)} className="rounded-xl border-neutral-100 bg-neutral-50 h-10 text-sm font-extrabold text-accent-lime" />
              </div>
            </section>

            <section className="space-y-4 pt-4 border-t border-neutral-50">
              <h3 className="font-headline font-extrabold text-xs uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" /> 3. Date Beneficiar
              </h3>
              <div className="space-y-3">
                <Input placeholder="Nume / Firmă" value={customerName} onChange={e => setCustomerName(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 text-sm font-bold" />
                <Input placeholder="Adresă" value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 text-sm" />
                <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="CUI" value={customerCui} onChange={e => setCustomerCui(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 text-sm font-bold h-10" />
                    <Input placeholder="Reg. Com." value={customerRegCom} onChange={e => setCustomerRegCom(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 text-sm h-10" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Banca" value={customerBank} onChange={e => setCustomerBank(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 text-sm h-10" />
                    <Input placeholder="IBAN" value={customerIban} onChange={e => setCustomerIban(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 text-sm font-bold h-10" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Reprezentant" value={customerRepresentative} onChange={e => setCustomerRepresentative(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 text-sm font-bold h-10" />
                    <Input placeholder="Funcție" value={customerPosition} onChange={e => setCustomerPosition(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 text-sm h-10" />
                </div>
              </div>
            </section>

            <section className="space-y-4 pt-4 border-t border-neutral-50">
              <h3 className="font-headline font-extrabold text-xs uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" /> 4. Referință Contract & Factură
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label className="text-[9px] uppercase font-bold text-neutral-400 px-1">Nr. Contract</Label>
                    <Input placeholder="Nr. Contract" value={contractNumber} onChange={e => setContractNumber(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 text-sm font-bold" />
                </div>
                <div className="space-y-1">
                    <Label className="text-[9px] uppercase font-bold text-neutral-400 px-1">Data Contract</Label>
                    <Input placeholder="Data Contract" value={contractDate} onChange={e => setContractDate(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 text-sm h-10" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                   <Input placeholder="Seria FC" value={invoiceSeries} onChange={e => setInvoiceSeries(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 text-sm h-10" />
                   <Input placeholder="Nr. FC" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 text-sm h-10" />
                   <Input placeholder="Data FC" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 text-sm h-10" />
              </div>
            </section>

            <section className="space-y-4 pt-4 border-t border-neutral-50 pb-4">
              <h3 className="font-headline font-extrabold text-xs uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" /> 5. Delegați
              </h3>
              <div className="space-y-3">
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-neutral-400">Delegat Furnizor</Label>
                    <Input value={delegatFurnizor} onChange={e => setDelegatFurnizor(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 text-sm font-bold" />
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-neutral-400">Delegat Beneficiar</Label>
                    <Input value={delegatBeneficiar} onChange={e => setDelegatBeneficiar(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 text-sm font-bold" />
                </div>
              </div>
            </section>

            {!isFormValid && (
              <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-start gap-3">
                <AlertCircle className="text-orange-500 shrink-0 mt-0.5" size={18} />
                <p className="text-[11px] text-orange-700 leading-snug tracking-tight">Completati Serial Number, Nr. PV si Nr. Contract pentru a emite documentul.</p>
              </div>
            )}
          </div>
        </div>

        {/* Preview Area */}
        <div className="bg-neutral-800 rounded-[3rem] p-12 flex justify-center items-start overflow-y-auto min-h-screen custom-scrollbar relative">
          <div ref={receptionRef} className="scale-[0.8] origin-top">
            <ReceptionPDF reception={receptionData} />
          </div>

          <div className="absolute opacity-0 pointer-events-none" style={{ left: '-5000px', top: 0 }}>
            <div id="print-version" style={{ width: '210mm' }}>
                <ReceptionPDF reception={receptionData} className="!p-0 !bg-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewReceptionPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin" /></div>}>
      <NewReceptionContent />
    </Suspense>
  );
}
