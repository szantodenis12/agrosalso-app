'use client';
import { use, useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Send, Phone, Info, ShieldCheck, Truck, Cog, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

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
      toast({ variant: "destructive", title: "Eroare", description: "Nu s-a putut trimite cererea." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent-lime border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="pt-40 pb-24 text-center bg-neutral-50 min-h-screen">
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
      <main className="bg-neutral-50 min-h-screen">
        {/* Immersive Header */}
        <section className="relative h-[60vh] md:h-[75vh] w-full overflow-hidden bg-neutral-900">
          <Image 
            src={product.mainImage || 'https://picsum.photos/seed/placeholder/1920/1080'} 
            alt={product.name} 
            fill 
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-50 via-transparent to-black/40" />
          
          <div className="absolute bottom-0 left-0 right-0 max-w-[1440px] mx-auto px-6 md:px-14 pb-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 max-w-4xl"
            >
              <div className="flex items-center gap-3">
                <span className="text-accent-lime font-extrabold text-[12px] uppercase tracking-[0.4em]">{product.brand}</span>
                <div className="w-1.5 h-1.5 bg-accent-lime rounded-full" />
                <span className="text-white/60 font-bold text-[12px] uppercase tracking-widest">{product.category}</span>
              </div>
              <h1 className="font-headline font-extrabold text-5xl md:text-8xl text-neutral-900 tracking-tighter leading-none">{product.name}</h1>
              <div className="flex flex-wrap gap-4 pt-4">
                 {product.isNew && <span className="bg-blue-600 text-white text-[10px] font-extrabold px-6 py-2.5 rounded-full tracking-widest uppercase">Utilaj Nou</span>}
                 {product.isOnSale && <span className="bg-yellow-400 text-black text-[10px] font-extrabold px-6 py-2.5 rounded-full tracking-widest uppercase">Ofertă Specială</span>}
                 <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-6 py-2.5 rounded-full border border-white">
                   <Star size={14} className="fill-yellow-500 text-yellow-500" />
                   <span className="text-[10px] font-extrabold text-neutral-900 tracking-widest uppercase">Calitate Garantată</span>
                 </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="max-w-[1440px] mx-auto px-6 md:px-14 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Content Column */}
            <div className="lg:col-span-7 space-y-16">
              
              {/* Detailed Content - The SEO description */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-white rounded-[3.5rem] p-10 md:p-16 border border-neutral-100 shadow-sm space-y-10"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-accent-lime/10 rounded-2xl flex items-center justify-center">
                    <Sparkles className="text-accent-lime" size={24} />
                  </div>
                  <h2 className="font-headline font-extrabold text-3xl text-neutral-900 tracking-tight">Despre acest utilaj</h2>
                </div>
                
                <div 
                  className="prose prose-neutral max-w-none text-neutral-500 font-body leading-relaxed text-xl"
                  dangerouslySetInnerHTML={{ __html: product.detailedDescription || product.description }}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
                   {[
                     { icon: <ShieldCheck size={28} />, title: "Garanție RO", sub: "Service autorizat" },
                     { icon: <Truck size={28} />, title: "Livrare Rapidă", sub: "În toată țara" },
                     { icon: <Cog size={28} />, title: "Piese Originale", sub: "Stoc permanent" },
                   ].map((item, i) => (
                     <div key={i} className="space-y-3">
                       <div className="text-accent-lime">{item.icon}</div>
                       <h4 className="font-headline font-bold text-lg text-neutral-900 leading-tight">{item.title}</h4>
                       <p className="text-sm text-neutral-400 font-medium">{item.sub}</p>
                     </div>
                   ))}
                </div>
              </motion.div>

              {/* Gallery / Extra Images if any */}
              <div className="grid grid-cols-2 gap-8">
                <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-white shadow-xl">
                   <Image src={product.mainImage} alt={product.name} fill className="object-cover" />
                </div>
                <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-neutral-900 flex items-center justify-center text-center p-8">
                   <div className="space-y-4">
                      <Star className="text-accent-lime mx-auto" size={40} />
                      <h3 className="text-white font-headline font-bold text-2xl tracking-tight">Performanță fără compromis</h3>
                      <p className="text-white/40 text-sm font-medium">Fiecare utilaj din catalogul AgroSalso este verificat riguros înainte de livrare.</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Sticky Action Column */}
            <aside className="lg:col-span-5 space-y-8 sticky top-[120px]">
              
              {/* Pricing Card */}
              <div className="bg-white rounded-[3.5rem] p-10 md:p-14 border border-neutral-100 shadow-sm space-y-10 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-lime/5 rounded-full translate-x-10 -translate-y-10" />
                
                <div className="space-y-8 relative z-10">
                  <div className="space-y-2">
                    <span className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-widest">Preț Catalog (fără TVA)</span>
                    <div className="font-headline font-extrabold text-6xl text-neutral-900 tracking-tighter">
                      {product.priceOnRequest ? "LA CERERE" : `${product.price.toLocaleString()} RON`}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[11px] font-extrabold text-neutral-900 uppercase tracking-[0.2em] flex items-center gap-2">
                      <div className="w-1 h-1 bg-accent-lime rounded-full" /> Specificații Tehnice
                    </h4>
                    <div className="space-y-4">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center group border-b border-neutral-50 pb-2">
                          <span className="text-sm font-bold text-neutral-400">{key}</span>
                          <span className="text-sm font-extrabold text-neutral-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-neutral-900 rounded-[3.5rem] p-10 md:p-14 text-white space-y-10 shadow-2xl shadow-black/20">
                <div className="space-y-4">
                  <h3 className="font-headline font-extrabold text-3xl tracking-tight">Solicită Ofertă</h3>
                  <p className="text-white/50 text-sm font-medium">Un expert AgroSalso te va contacta în cel mai scurt timp pentru detalii și finanțare.</p>
                </div>

                <form onSubmit={handleInquirySubmit} className="space-y-6">
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
                    placeholder="Mesajul tău..." 
                    value={inquiry.message}
                    onChange={(e) => setInquiry({...inquiry, message: e.target.value})}
                    required
                    className="min-h-[120px] bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-2xl focus:ring-accent-lime"
                  />

                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full bg-accent-lime hover:bg-accent-lime/90 text-black font-extrabold h-16 rounded-full flex items-center justify-between pl-10 pr-2 group transition-all"
                  >
                    {submitting ? 'SE TRIMITE...' : 'TRIMITE SOLICITAREA'}
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center transition-transform group-hover:rotate-45 shadow-lg">
                      <Send size={20} className="text-black" />
                    </div>
                  </Button>
                </form>

                <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
                   <a href="tel:+40751234567" className="flex items-center gap-4 text-white/60 hover:text-accent-lime transition-colors group">
                     <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-accent-lime/20"><Phone size={16} /></div>
                     <span className="text-xs font-bold">+40 751 234 567</span>
                   </a>
                   <div className="flex items-center gap-4 text-white/60">
                     <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center"><Info size={16} /></div>
                     <span className="text-xs font-bold">Consultanță specializată gratuită</span>
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
