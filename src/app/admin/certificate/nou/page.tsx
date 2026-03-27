'use client';
import { useState, useMemo, useRef, useEffect, Suspense } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Product, Inquiry, Certificate } from '@/types';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Printer, Send, ChevronLeft, Loader2, FileText, ShieldCheck, AlertCircle, CheckCircle2, Circle, Package, User, Building2, CreditCard, Hash } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { CertificatePDF } from '@/components/admin/CertificatePDF';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';

function NewCertificateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inquiryId = searchParams.get('inquiryId');
  const editId = searchParams.get('editId');
  const db = useFirestore();
  const certificateRef = useRef<HTMLDivElement>(null);

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
  const [invoiceSeries, setInvoiceSeries] = useState("asfc");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(format(new Date(), 'dd.MM.yyyy'));

  const [certificateNumber, setCertificateNumber] = useState("");
  const [certificateDate, setCertificateDate] = useState(format(new Date(), 'dd.MM.yyyy'));

  const [isGenerating, setIsGenerating] = useState(false);

  // Load inquiry data if provided
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

  // Load existing certificate for editing
  useEffect(() => {
    if (editId && db) {
      getDoc(doc(db, 'certificates', editId)).then((snap) => {
        if (snap.exists()) {
          const data = snap.data() as any;
          setCertificateNumber(data.number);
          setCertificateDate(data.date);
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
          setInvoiceSeries(data.factura.series);
          setInvoiceNumber(data.factura.number);
          setInvoiceDate(data.factura.date);
        }
      });
    }
  }, [editId, db]);

  const product = useMemo(() => products?.find(p => p.id === selectedProductId), [products, selectedProductId]);

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
      invoiceNumber &&
      certificateNumber
    );
  }, [selectedProductId, customerName, customerAddress, customerCui, customerBank, customerIban, customerRepresentative, serialNumber, invoiceNumber, certificateNumber]);

  const handleSave = async (showToast = true) => {
    if (!db) return null;
    try {
      const docData = {
        number: certificateNumber,
        date: certificateDate,
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
          serialNumber: serialNumber
        },
        factura: {
          series: invoiceSeries,
          number: invoiceNumber,
          date: invoiceDate
        },
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      };

      if (editId) {
        await updateDoc(doc(db, 'certificates', editId), docData);
        if (showToast) toast({ title: "Modificări salvate!", description: "Documentul a fost actualizat în baza de date." });
        return editId;
      } else {
        const docRef = await addDoc(collection(db, 'certificates'), docData);
        if (showToast) toast({ title: "Proiect salvat!", description: "Îl poți vedea acum în consola cererii." });
        // Update URL with editId after saving new doc to prevent duplicate creations
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
    if (!certificateRef.current) return;
    setIsGenerating(true);
    try {
      // 1. Force save first
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
      
      pdf.save(`Certificat_Conformitate_${certificateNumber.replace(/\//g, '_')}.pdf`);
      toast({ title: "Document emis!", description: "PDF-ul a fost descărcat." });
      router.push('/admin/cereri');
    } catch (err: any) {
      toast({ variant: "destructive", title: "Eroare", description: err.message });
    } finally {
      setIsGenerating(false);
    }
  };

  const certificateData: Certificate = {
    id: 'preview',
    number: certificateNumber,
    date: certificateDate,
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
      serialNumber: serialNumber
    },
    factura: {
      series: invoiceSeries,
      number: invoiceNumber,
      date: invoiceDate
    },
    emitent: {
      name: "SC AGRO SALSO SRL",
      regCom: "J05/1081/2012",
      cui: "RO30425879",
      address: "Str. Aleea Petre Paulescu, bl.Q6, Et4, ap U, Salonta, jud Bihor",
      workPoint: "P.1.Madaras nr 409 jud Bihor",
      bank: "Banca Transilvania Ag. Salonta",
      iban: "RO19BTRL00501202W8121XX",
      representative: "Sacarea Simona Maria"
    },
    createdAt: null
  };

  return (
    <div className="min-h-screen bg-neutral-100 pb-20 print:bg-white print:pb-0">
      <div className="bg-white border-b border-neutral-200 p-6 sticky top-0 z-[100] shadow-md print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}><ChevronLeft /></Button>
            <h1 className="font-headline font-extrabold text-xl tracking-tight uppercase">Certificat de Conformitate</h1>
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

      <div className="max-w-[1600px] mx-auto mt-10 grid grid-cols-1 xl:grid-cols-[450px_1fr] gap-10 px-6">
        {/* Form Sidebar */}
        <div className="space-y-6 print:hidden">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-neutral-100 space-y-8">
            <section className="space-y-4">
                <h3 className="font-headline font-extrabold text-xs uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-accent-lime rounded-full" /> 1. Identificare Document
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-neutral-400">Nr. Certificat</Label>
                        <Input placeholder="04" value={certificateNumber} onChange={e => setCertificateNumber(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 h-10 text-sm font-bold" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-neutral-400">Data emiterii</Label>
                        <Input value={certificateDate} onChange={e => setCertificateDate(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 h-10 text-sm" />
                    </div>
                </div>
            </section>

            <section className="space-y-4 pt-4 border-t border-neutral-50">
              <h3 className="font-headline font-extrabold text-xs uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" /> 2. Selectare Produs
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
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-neutral-400">Serie Utilaj</Label>
                <Input placeholder="Ex: 1/ZUK/2026" value={serialNumber} onChange={e => setSerialNumber(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 h-10 text-sm font-bold" />
              </div>
            </section>

            <section className="space-y-4 pt-4 border-t border-neutral-50">
              <h3 className="font-headline font-extrabold text-xs uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" /> 3. Date Beneficiar
              </h3>
              <div className="space-y-4">
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
                    <Input placeholder="Funcție" value={customerPosition} onChange={e => setCustomerPosition(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 text-sm h-10" />
                </div>
              </div>
            </section>

            <section className="space-y-4 pt-4 border-t border-neutral-50 pb-4">
                <h3 className="font-headline font-extrabold text-xs uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" /> 4. Detalii Factură
                </h3>
                <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-neutral-400">Serie</Label>
                        <Input value={invoiceSeries} onChange={e => setInvoiceSeries(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 text-sm font-bold h-10" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-neutral-400">Număr</Label>
                        <Input value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 text-sm font-bold h-10" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-neutral-400">Dată</Label>
                        <Input value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} className="rounded-xl border-neutral-100 bg-neutral-50 text-sm h-10" />
                    </div>
                </div>
            </section>

            {!isFormValid && (
              <div className="p-4 bg-red-50 rounded-2xl flex items-start gap-3 border border-red-100">
                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                <p className="text-[11px] text-red-600 leading-snug font-medium">Toate câmpurile marcate sunt obligatorii pentru emiterea certificatului legal.</p>
              </div>
            )}
          </div>
        </div>

        {/* Preview Area */}
        <div className="bg-neutral-200/50 rounded-[3rem] p-12 flex justify-center items-start overflow-hidden min-h-screen relative">
          <div ref={certificateRef} className="scale-[0.85] origin-top">
            <CertificatePDF certificate={certificateData} />
          </div>

          {/* Hidden Print Version (1:1 scale, no transforms) */}
          <div className="absolute opacity-0 pointer-events-none" style={{ left: '-5000px', top: 0 }}>
            <div id="print-version" style={{ width: '210mm' }}>
                <CertificatePDF certificate={certificateData} className="!p-0 !bg-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewCertificatePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin" /></div>}>
      <NewCertificateContent />
    </Suspense>
  );
}
