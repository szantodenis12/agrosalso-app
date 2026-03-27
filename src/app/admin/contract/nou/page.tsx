'use client';
import { useState, useMemo, useRef, useEffect, Suspense } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Product, Inquiry, Contract } from '@/types';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Printer, Send, ChevronLeft, Loader2, FileText, ShieldCheck, AlertCircle, CheckCircle2, Circle, Package, User, Building2, CreditCard, Hash, Calendar, Shield, Gavel } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { ContractPDF } from '@/components/admin/ContractPDF';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';

function NewContractContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inquiryId = searchParams.get('inquiryId');
  const editId = searchParams.get('editId');
  const db = useFirestore();
  const contractRef = useRef<HTMLDivElement>(null);

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
  const [unitPrice, setUnitPrice] = useState(0);
  const [vatRate, setVatRate] = useState(19);

  const [deliveryDate, setDeliveryDate] = useState(format(new Date(), 'dd.MM.yyyy'));
  const [paymentDate, setPaymentDate] = useState(format(new Date(), 'dd.MM.yyyy'));
  const [warrantyMonths, setWarrantyMonths] = useState(24);
  
  const [invoiceSeries, setInvoiceSeries] = useState("ASFC");
  const [invoiceNumber, setInvoiceNumber] = useState("");

  const [contractNumber, setContractNumber] = useState("");
  const [contractDate, setContractDate] = useState(format(new Date(), 'dd.MM.yyyy'));

  const [isGenerating, setIsGenerating] = useState(false);

  // Load inquiry data
  useEffect(() => {
    if (inquiryId && db && !editId) {
      getDoc(doc(db, 'inquiries', inquiryId)).then((snap) => {
        if (snap.exists()) {
          const data = snap.data() as Inquiry;
          setCustomerName(data.name);
          setSelectedProductId(data.productId);
        }
      });
    }
  }, [inquiryId, db, editId]);

  // Load existing contract for editing
  useEffect(() => {
    if (editId && db) {
      getDoc(doc(db, 'contracts', editId)).then((snap) => {
        if (snap.exists()) {
          const data = snap.data() as any;
          setContractNumber(data.number);
          setContractDate(data.date);
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
          setUnitPrice(data.obiect.unitPrice);
          setVatRate(data.obiect.vatRate);
          setDeliveryDate(data.termeni.deliveryDate);
          setPaymentDate(data.termeni.paymentDate);
          setWarrantyMonths(data.termeni.warrantyMonths);
          setInvoiceSeries(data.termeni.invoiceSeries);
          setInvoiceNumber(data.termeni.invoiceNumber);
        }
      });
    }
  }, [editId, db]);

  const product = useMemo(() => products?.find(p => p.id === selectedProductId), [products, selectedProductId]);

  useEffect(() => {
    if (product) {
        setUnitPrice(product.price);
    }
  }, [product]);

  const totalPrice = useMemo(() => unitPrice * quantity, [unitPrice, quantity]);
  const totalPriceWithVat = useMemo(() => totalPrice * (1 + vatRate / 100), [totalPrice, vatRate]);

  const isFormValid = useMemo(() => {
    return (
      selectedProductId &&
      customerName &&
      customerAddress &&
      customerCui &&
      customerBank &&
      customerIban &&
      customerRepresentative &&
      serialNumber &&
      contractNumber &&
      unitPrice > 0
    );
  }, [selectedProductId, customerName, customerAddress, customerCui, customerBank, customerIban, customerRepresentative, serialNumber, contractNumber, unitPrice]);

  const handleSave = async (showToast = true) => {
    if (!db) return null;
    try {
      const docData = {
        number: contractNumber,
        date: contractDate,
        inquiryId: inquiryId || null,
        productId: selectedProductId,
        productName: product?.name || '',
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
          unitPrice,
          vatRate,
          totalPrice,
          totalPriceWithVat
        },
        termeni: {
          deliveryDate,
          paymentDate,
          warrantyMonths,
          invoiceSeries,
          invoiceNumber
        },
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      };

      if (editId) {
        await updateDoc(doc(db, 'contracts', editId), docData);
        if (showToast) toast({ title: "Modificări salvate!", description: "Contractul a fost actualizat." });
        return editId;
      } else {
        const docRef = await addDoc(collection(db, 'contracts'), docData);
        if (showToast) toast({ title: "Contract salvat!", description: "Îl poți vedea acum în consola cererii." });
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
    if (!contractRef.current) return;
    setIsGenerating(true);
    try {
      // Force save first
      await handleSave(false);

      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;

      const pages = document.getElementById('print-version')?.querySelectorAll('.contract-page');
      if (!pages || pages.length === 0) return;

      const pdf = new jsPDF('p', 'mm', 'a4');

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        const canvas = await html2canvas(page, {
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
      
      pdf.save(`Contract_${contractNumber.replace(/\//g, '_')}.pdf`);
      toast({ title: "Contract emis!", description: "PDF-ul a fost descărcat." });
      router.push('/admin/cereri');
    } catch (err: any) {
      toast({ variant: "destructive", title: "Eroare", description: err.message });
    } finally {
      setIsGenerating(false);
    }
  };

  const contractData: Contract = {
    id: 'preview',
    number: contractNumber,
    date: contractDate,
    productId: selectedProductId,
    productName: product?.name || '',
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
      unitPrice,
      vatRate,
      totalPrice,
      totalPriceWithVat
    },
    termeni: {
      deliveryDate,
      paymentDate,
      warrantyMonths,
      invoiceSeries,
      invoiceNumber
    },
    emitent: {
      name: "SC AGRO SALSO SRL",
      regCom: "J05/1081/2012",
      cui: "30425879",
      address: "Salonta, str. Al. P. Paulescu, bl. Q6, ap. U, jud. Bihor",
      workPoint: "Madaras nr 409, jud. Bihor",
      bank: "Banca Transilvania",
      iban: "RO19BTRL00501202W8121XX",
      representative: "Sacarea Simona Maria"
    },
    createdAt: null
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <div className="bg-white border-b border-neutral-200 p-6 sticky top-0 z-[100] shadow-sm">
        <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}><ChevronLeft /></Button>
            <h1 className="font-headline font-extrabold text-xl tracking-tight uppercase">Generator Contract Vânzare</h1>
          </div>
          
          <Button 
            className="bg-neutral-900 hover:bg-black text-white rounded-xl h-11 px-8 shadow-lg shadow-black/10" 
            onClick={generatePdf} 
            disabled={isGenerating || !isFormValid}
          >
            {isGenerating ? <Loader2 className="animate-spin size-4 mr-2" /> : <Printer size={18} className="mr-2" />} 
            DESCARCĂ CONTRACT (3 PAGINI)
          </Button>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto mt-10 grid grid-cols-1 xl:grid-cols-[450px_1fr] gap-10 px-6">
        {/* Form Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-neutral-100 space-y-8 max-h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar">
            
            <section className="space-y-4">
                <h3 className="font-headline font-extrabold text-xs uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-accent-lime rounded-full" /> 1. Identificare Document
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-neutral-400">Nr. Contract</Label>
                        <Input placeholder="01" value={contractNumber} onChange={e => setContractNumber(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 h-10 text-sm font-bold" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-neutral-400">Data Contract</Label>
                        <Input value={contractDate} onChange={e => setContractDate(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 h-10 text-sm" />
                    </div>
                </div>
            </section>

            <section className="space-y-4 pt-4 border-t border-neutral-50">
              <h3 className="font-headline font-extrabold text-xs uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" /> 2. Utilaj & Preț
              </h3>
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger className="w-full h-12 rounded-xl bg-neutral-50 border-none text-sm font-bold">
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
                    <Label className="text-[10px] uppercase font-bold text-neutral-400">Cantitate</Label>
                    <Input type="number" value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 1)} className="rounded-xl border-neutral-100 bg-neutral-50 h-10 text-sm font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-neutral-400">Preț Unitar (Net)</Label>
                    <Input type="number" value={unitPrice} onChange={e => setUnitPrice(parseFloat(e.target.value) || 0)} className="rounded-xl border-neutral-100 bg-neutral-50 h-10 text-sm font-bold" />
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-neutral-400">Cota TVA (%)</Label>
                    <Input type="number" value={vatRate} onChange={e => setVatRate(parseFloat(e.target.value) || 19)} className="rounded-xl border-neutral-100 bg-neutral-50 h-10 text-sm h-10" />
                </div>
              </div>
              <div className="p-4 bg-neutral-900 rounded-2xl text-white">
                <div className="flex justify-between text-[10px] font-bold opacity-50 uppercase mb-1">Total cu TVA</div>
                <div className="text-xl font-headline font-extrabold">{totalPriceWithVat.toLocaleString()} RON</div>
              </div>
            </section>

            <section className="space-y-4 pt-4 border-t border-neutral-50">
              <h3 className="font-headline font-extrabold text-xs uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" /> 3. Date Beneficiar
              </h3>
              <div className="space-y-3">
                <Input placeholder="Nume / Firmă" value={customerName} onChange={e => setCustomerName(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 text-sm font-bold h-10" />
                <Input placeholder="Adresă" value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 text-sm h-10" />
                <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="CUI / CNP" value={customerCui} onChange={e => setCustomerCui(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 text-sm font-bold h-10" />
                    <Input placeholder="Reg. Com." value={customerRegCom} onChange={e => setCustomerRegCom(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 text-sm h-10" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Banca" value={customerBank} onChange={e => setCustomerBank(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 text-sm h-10" />
                    <Input placeholder="IBAN" value={customerIban} onChange={e => setCustomerIban(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 text-sm font-bold h-10" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Reprezentant" value={customerRepresentative} onChange={e => setCustomerRepresentative(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 text-sm font-bold h-10" />
                    <Input placeholder="Funcție (ex: administrator)" value={customerPosition} onChange={e => setCustomerPosition(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 text-sm h-10" />
                </div>
              </div>
            </section>

            <section className="space-y-4 pt-4 border-t border-neutral-50 pb-4">
              <h3 className="font-headline font-extrabold text-xs uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" /> 4. Termeni & Factură
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-[9px] uppercase font-bold text-neutral-400">Garanție (luni)</Label>
                  <Input type="number" value={warrantyMonths} onChange={e => setWarrantyMonths(parseInt(e.target.value) || 24)} className="rounded-xl border-neutral-100 bg-neutral-50 text-sm h-10 font-bold" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[9px] uppercase font-bold text-neutral-400">Data Plată</Label>
                  <Input value={paymentDate} onChange={e => setPaymentDate(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 text-sm h-10" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-[9px] uppercase font-bold text-neutral-400">Serie Fact.</Label>
                  <Input value={invoiceSeries} onChange={e => setInvoiceSeries(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 text-sm h-10" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[9px] uppercase font-bold text-neutral-400">Nr. Fact.</Label>
                  <Input value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 text-sm h-10" />
                </div>
              </div>
            </section>

            {!isFormValid && (
              <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-start gap-3">
                <AlertCircle className="text-orange-500 shrink-0 mt-0.5" size={18} />
                <p className="text-[11px] text-orange-700 leading-snug">Asigurați-vă că ați completat Nr. Contract, Datele Beneficiarului și Prețul pentru a activa butonul de descărcare.</p>
              </div>
            )}
          </div>
        </div>

        {/* Preview Area */}
        <div className="bg-neutral-800 rounded-[3rem] p-12 flex justify-center items-start overflow-y-auto min-h-screen custom-scrollbar relative">
          <div ref={contractRef} className="scale-[0.7] origin-top">
            <ContractPDF contract={contractData} />
          </div>

          {/* Hidden Print Version (1:1 scale, no transforms) */}
          <div className="absolute opacity-0 pointer-events-none" style={{ left: '-5000px', top: 0 }}>
            <div id="print-version" style={{ width: '210mm' }}>
                <ContractPDF contract={contractData} className="!p-0 !bg-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewContractPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin" /></div>}>
      <NewContractContent />
    </Suspense>
  );
}
