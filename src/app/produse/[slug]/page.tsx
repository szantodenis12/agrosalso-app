'use client';
import { use, useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Check, Send, Phone, Info, ShieldCheck, Truck, Cog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const db = useFirestore();

  const [inquiry, setInquiry] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  useEffect(() => {
    async function loadProduct() {
      const q = query(collection(db, 'products'), where('slug', '==', slug), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        setProduct({ id: snap.docs[0].id, ...snap.docs[0].data() } as Product);
      }
      setLoading(false);
    }
    loadProduct();
  }, [db, slug]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'inquiries'), {
        ...inquiry,
        productId: product.id,
        productName: product.name,
        status: 'new',
        createdAt: serverTimestamp(),
      });
      toast({
        title: "Cerere trimisă!",
        description: "Vă vom contacta în cel mai scurt timp posibil.",
      });
      setInquiry({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Eroare",
        description: "Nu s-a putut trimite cererea. Vă rugăm încercați din nou.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent-lime border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="pt-40 pb-24 text-center">
          <h1 className="text-4xl font-headline font-extrabold mb-4">Produsul nu a fost găsit</h1>
          <Link href="/produse">
            <Button className="bg-neutral-900 text-white rounded-full px-8 h-12">Înapoi la catalog</Button>
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-[120px] pb-24 bg-neutral-50 min-h-screen">
        <div className="max-w-[1440px] mx-auto px-6 md:px-14">
          
          {/* Breadcrumbs & Navigation */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex gap-2 text-[10px] text-neutral-400 uppercase font-extrabold tracking-widest">
              <Link href="/" className="hover:text-accent-lime transition-colors">Acasă</Link>
              <span className="opacity-30">/</span>
              <Link href="/produse" className="hover:text-accent-lime transition-colors">Catalog</Link>
              <span className="opacity-30">/</span>
              <span className="text-neutral-900">{product.name}</span>
            </div>
            <Link href="/produse">
              <Button variant="ghost" className="text-[10px] font-extrabold uppercase tracking-widest gap-2 hover:bg-white rounded-full h-10 px-6">
                <ChevronLeft size={16} /> Înapoi la catalog
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Visuals Column */}
            <div className="lg:col-span-7 space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative aspect-[4/3] bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-black/5 group"
              >
                <Image 
                  src={product.mainImage || 'https://picsum.photos/seed/placeholder/1200/900'} 
                  alt={product.name} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  priority
                />
                <div className="absolute top-8 left-8 flex gap-3">
                  {product.isNew && (
                    <span className="bg-blue-600 text-white text-[10px] font-extrabold px-6 py-2.5 rounded-full tracking-widest uppercase shadow-xl shadow-blue-600/20">NOU</span>
                  )}
                  {product.isOnSale && (
                    <span className="bg-yellow-400 text-black text-[10px] font-extrabold px-6 py-2.5 rounded-full tracking-widest uppercase shadow-xl shadow-yellow-400/20">PROMOȚIE</span>
                  )}
                </div>
              </motion.div>

              {/* Benefits Icons */}
              <div className="grid grid-cols-3 gap-6 pt-4">
                {[
                  { icon: <ShieldCheck className="text-accent-lime" />, label: "Garanție", sub: "2 ani extinsă" },
                  { icon: <Truck className="text-accent-lime" />, label: "Livrare", sub: "În toată țara" },
                  { icon: <Cog className="text-accent-lime" />, label: "Service", sub: "Autorizat 24/7" },
                ].map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded-[2rem] flex flex-col items-center text-center gap-3 border border-neutral-100">
                    <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center">{item.icon}</div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-extrabold text-neutral-900 uppercase tracking-widest">{item.label}</div>
                      <div className="text-[10px] font-bold text-neutral-400">{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="bg-white rounded-[3rem] p-10 md:p-14 space-y-8 border border-neutral-100">
                <h3 className="font-headline font-extrabold text-3xl text-neutral-900 tracking-tight">Descriere Produs</h3>
                <div 
                  className="prose prose-neutral max-w-none text-neutral-500 font-body leading-relaxed text-lg"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            </div>

            {/* Content & Action Column */}
            <aside className="lg:col-span-5 space-y-8">
              {/* Product Intro */}
              <div className="bg-white rounded-[3.5rem] p-10 md:p-14 border border-neutral-100 shadow-sm space-y-10">
                <div className="space-y-6">
                  <span className="text-accent-lime font-extrabold text-[12px] uppercase tracking-[0.4em] block">{product.brand}</span>
                  <h1 className="font-headline font-extrabold text-4xl md:text-5xl text-neutral-900 tracking-tighter leading-none">{product.name}</h1>
                  <p className="text-neutral-500 font-medium text-lg leading-relaxed">{product.shortDescription}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-widest">Preț estimativ</span>
                  <div className="font-headline font-extrabold text-5xl text-neutral-900 tracking-tighter">
                    {product.priceOnRequest ? "LA CERERE" : `${product.price.toLocaleString()} RON`}
                  </div>
                </div>

                <div className="pt-10 border-t border-neutral-50 space-y-6">
                  <h4 className="text-[11px] font-extrabold text-neutral-900 uppercase tracking-[0.2em]">Specificații Cheie</h4>
                  <div className="space-y-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center group">
                        <span className="text-sm font-bold text-neutral-400 group-hover:text-neutral-600 transition-colors">{key}</span>
                        <span className="text-sm font-extrabold text-neutral-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Inquiry Form */}
              <div className="bg-neutral-900 rounded-[3.5rem] p-10 md:p-14 text-white space-y-10">
                <div className="space-y-4 text-center">
                  <h3 className="font-headline font-extrabold text-3xl tracking-tight">Solicită Ofertă</h3>
                  <p className="text-white/50 text-sm font-medium">Completează formularul și un expert AgroSalso te va contacta în max. 2 ore.</p>
                </div>

                <form onSubmit={handleInquirySubmit} className="space-y-6">
                  <div className="space-y-4">
                    <Input 
                      placeholder="Nume Complet" 
                      value={inquiry.name}
                      onChange={(e) => setInquiry({...inquiry, name: e.target.value})}
                      required
                      className="h-14 bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-2xl focus:ring-accent-lime"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input 
                        type="email" 
                        placeholder="Email" 
                        value={inquiry.email}
                        onChange={(e) => setInquiry({...inquiry, email: e.target.value})}
                        required
                        className="h-14 bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-2xl focus:ring-accent-lime"
                      />
                      <Input 
                        type="tel" 
                        placeholder="Telefon" 
                        value={inquiry.phone}
                        onChange={(e) => setInquiry({...inquiry, phone: e.target.value})}
                        required
                        className="h-14 bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-2xl focus:ring-accent-lime"
                      />
                    </div>
                    <Textarea 
                      placeholder="Mesajul tău (ex: detalii finanțare, accesorii...)" 
                      value={inquiry.message}
                      onChange={(e) => setInquiry({...inquiry, message: e.target.value})}
                      required
                      className="min-h-[120px] bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-2xl focus:ring-accent-lime"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full bg-accent-lime hover:bg-accent-lime/90 text-black font-extrabold h-16 rounded-full flex items-center justify-between pl-10 pr-2 group transition-all"
                  >
                    {submitting ? 'SE TRIMITE...' : 'TRIMITE SOLICITAREA'}
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center transition-transform group-hover:rotate-45">
                      <Send size={20} className="text-black" />
                    </div>
                  </Button>
                </form>

                <div className="flex items-center justify-center gap-6 pt-4 text-white/40">
                   <div className="flex items-center gap-2">
                     <Phone size={16} />
                     <span className="text-xs font-bold">+40 751 234 567</span>
                   </div>
                   <div className="w-1 h-1 bg-white/20 rounded-full" />
                   <div className="flex items-center gap-2">
                     <Info size={16} />
                     <span className="text-xs font-bold">Consultanță gratuită</span>
                   </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
