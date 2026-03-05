'use client';
import { use, useEffect, useState, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Send, Phone, Info, ShieldCheck, Truck, Cog, Sparkles, Star, Settings2, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const db = useFirestore();

  // Carousel pentru galeria de jos
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' }, [
    Autoplay({ delay: 4000, stopOnInteraction: false })
  ]);

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
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent-lime border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="pt-40 pb-24 text-center bg-neutral-50 min-h-screen">
          <h1 className="text-4xl font-headline font-extrabold mb-4 text-neutral-900">Produsul nu a fost găsit</h1>
          <Link href="/produse">
            <Button className="bg-neutral-900 text-white rounded-full px-8 h-12">Înapoi la catalog</Button>
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  // Identificăm imaginile suplimentare pentru galeria de jos
  const extraImages = product.images?.filter(img => img !== product.mainImage) || [];

  return (
    <>
      <Navbar />
      <main className="bg-neutral-50 min-h-screen">
        {/* Static Hero Header */}
        <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden bg-neutral-900">
          <Image 
            src={product.mainImage} 
            alt={product.name} 
            fill 
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-50 via-transparent to-black/40 z-10" />
          
          <div className="absolute top-32 left-6 md:left-14 z-20">
            <Link href="/produse">
              <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full h-10 px-4 gap-2 font-bold backdrop-blur-md border border-white/20">
                <ChevronLeft size={18} /> Catalog
              </Button>
            </Link>
          </div>

          <div className="absolute bottom-0 left-0 right-0 max-w-[1440px] mx-auto px-6 md:px-14 pb-20 z-20">
            <div className="space-y-4 max-w-4xl">
              <div className="flex items-center gap-3">
                <span className="text-accent-lime font-extrabold text-[11px] md:text-[12px] uppercase tracking-[0.3em]">{product.brand}</span>
                <div className="w-1.5 h-1.5 bg-accent-lime rounded-full" />
                <span className="text-white/80 font-bold text-[11px] md:text-[12px] uppercase tracking-widest">{product.category}</span>
              </div>
              <h1 className="font-headline font-extrabold text-4xl md:text-6xl text-white tracking-tighter leading-tight">
                {product.name}
              </h1>
              <div className="flex flex-wrap gap-2 pt-2">
                 {product.isNew && <span className="bg-neutral-900 text-white text-[9px] font-extrabold px-4 py-1.5 rounded-full tracking-widest uppercase shadow-lg shadow-black/20">Utilaj Nou</span>}
                 {product.isOnSale && <span className="bg-yellow-400 text-black text-[9px] font-extrabold px-4 py-1.5 rounded-full tracking-widest uppercase">Ofertă</span>}
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-[1440px] mx-auto px-6 md:px-14 py-12 md:py-16 -mt-10 relative z-30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
            
            {/* Content Column */}
            <div className="lg:col-span-12 space-y-12">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-7 space-y-10">
                  {/* Detailed Content */}
                  <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-neutral-100 shadow-sm space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent-lime/10 rounded-xl flex items-center justify-center">
                        <Sparkles className="text-accent-lime w-5 h-5" />
                      </div>
                      <h2 className="font-headline font-extrabold text-xl md:text-2xl text-neutral-900 tracking-tight">Despre acest utilaj</h2>
                    </div>
                    
                    <div 
                      className="prose prose-neutral max-w-none text-neutral-600 font-body leading-relaxed text-base md:text-lg"
                      dangerouslySetInnerHTML={{ __html: product.detailedDescription || product.description }}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-neutral-50">
                       {[
                         { icon: <ShieldCheck className="w-8 h-8" />, title: "Garanție RO", sub: "Service autorizat" },
                         { icon: <Truck className="w-8 h-8" />, title: "Livrare", sub: "Direct în fermă" },
                         { icon: <Cog className="w-8 h-8" />, title: "Piese", sub: "Stoc disponibil" },
                       ].map((item, i) => (
                         <div key={i} className="space-y-2">
                           <div className="text-accent-lime">{item.icon}</div>
                           <h4 className="font-headline font-bold text-sm text-neutral-900">{item.title}</h4>
                           <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">{item.sub}</p>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-8">
                  {/* Pricing & Inquiry Sidebar */}
                  <div className="bg-white rounded-[2.5rem] p-10 text-neutral-900 border border-neutral-100 shadow-xl overflow-hidden relative">
                    <div className="space-y-6 relative z-10">
                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">Preț Catalog (fără TVA)</span>
                        <div className="font-headline font-extrabold text-4xl md:text-5xl text-neutral-900 tracking-tighter">
                          {product.priceOnRequest ? "LA CERERE" : `${product.price.toLocaleString()} RON`}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                        <div className="w-2.5 h-2.5 bg-accent-lime rounded-full animate-pulse shadow-[0_0_10px_rgba(163,230,53,0.5)]" />
                        <span className="text-[11px] font-extrabold text-neutral-500 uppercase tracking-widest">Verificat & Gata de Livrare</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-[2.5rem] p-8 md:p-10 text-neutral-900 space-y-8 shadow-xl border border-neutral-100">
                    <div className="space-y-3">
                      <h3 className="font-headline font-extrabold text-2xl tracking-tight">Solicită Ofertă</h3>
                      <p className="text-neutral-500 text-sm font-medium">Lăsați-ne datele voastre și vă vom contacta cu o ofertă personalizată.</p>
                    </div>

                    <form onSubmit={handleInquirySubmit} className="space-y-4">
                      <Input 
                        placeholder="Nume Complet" 
                        value={inquiry.name}
                        onChange={(e) => setInquiry({...inquiry, name: e.target.value})}
                        required
                        className="h-14 bg-neutral-50 border-neutral-100 rounded-2xl focus:ring-accent-lime"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input 
                          type="email" 
                          placeholder="Email" 
                          value={inquiry.email}
                          onChange={(e) => setInquiry({...inquiry, email: e.target.value})}
                          required
                          className="h-14 bg-neutral-50 border-neutral-100 rounded-2xl focus:ring-accent-lime"
                        />
                        <Input 
                          type="tel" 
                          placeholder="Telefon" 
                          value={inquiry.phone}
                          onChange={(e) => setInquiry({...inquiry, phone: e.target.value})}
                          required
                          className="h-14 bg-neutral-50 border-neutral-100 rounded-2xl focus:ring-accent-lime"
                        />
                      </div>
                      <Textarea 
                        placeholder="Mesajul tău..." 
                        value={inquiry.message}
                        onChange={(e) => setInquiry({...inquiry, message: e.target.value})}
                        required
                        className="min-h-[120px] bg-neutral-50 border-neutral-100 rounded-2xl focus:ring-accent-lime"
                      />

                      <Button 
                        type="submit" 
                        disabled={submitting}
                        className="w-full bg-accent-lime hover:bg-accent-lime/90 text-black font-extrabold h-16 rounded-full flex items-center justify-between pl-8 pr-2 group transition-all"
                      >
                        {submitting ? 'SE TRIMITE...' : 'TRIMITE CEREREA'}
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center transition-transform group-hover:rotate-45">
                          <Send size={20} className="text-black" />
                        </div>
                      </Button>
                    </form>
                  </div>
                </div>
              </div>

              {/* TABEL SPECIFICAȚII (MODELE) */}
              {product.specTable && product.specTable.rows.length > 0 && (
                <div className="space-y-8 pt-10">
                  <div className="text-center space-y-4">
                    <h2 className="font-headline font-extrabold text-3xl md:text-5xl text-neutral-900 tracking-tight">
                      Alege <span className="text-accent-lime">modelul potrivit</span>
                    </h2>
                    <p className="text-neutral-500 font-medium max-w-2xl mx-auto text-sm md:text-base">
                      De la ferme mici cu tractor de 70 CP până la exploatații mari cu 150 CP — există un {product.name} pentru tine.
                    </p>
                  </div>

                  <div className="bg-white rounded-[2rem] shadow-2xl shadow-black/5 overflow-hidden border border-neutral-100">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-neutral-900 text-white">
                            {product.specTable.headers.map((header, i) => (
                              <th key={i} className="p-5 text-left text-[10px] font-extrabold uppercase tracking-widest border-r border-white/5 last:border-0">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {product.specTable.rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className={cn(
                              "hover:bg-neutral-50/50 transition-colors",
                              row.isPopular && "bg-accent-lime/5"
                            )}>
                              {row.values.map((val, colIndex) => (
                                <td key={colIndex} className="p-5 text-sm">
                                  {colIndex === 0 ? (
                                    <div className="flex items-center gap-3">
                                      <span className="font-bold text-accent-lime font-headline">{val}</span>
                                      {row.isPopular && (
                                        <Badge className="bg-accent-lime hover:bg-accent-lime text-black border-none text-[8px] font-extrabold px-2 py-0.5 rounded-full">POPULAR</Badge>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="font-medium text-neutral-600">{val}</span>
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {product.specTable.footerNote && (
                    <p className="text-[10px] text-neutral-400 font-bold uppercase text-center tracking-widest">
                      {product.specTable.footerNote}
                    </p>
                  )}
                </div>
              )}

              {/* Gallery Section */}
              {extraImages.length > 0 && (
                <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-neutral-100 shadow-sm space-y-8">
                   <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent-lime rounded-xl flex items-center justify-center">
                      <ImageIcon className="text-black w-5 h-5" />
                    </div>
                    <h2 className="font-headline font-extrabold text-xl md:text-2xl text-neutral-900 tracking-tight">Galerie Foto</h2>
                  </div>

                  <div className="embla overflow-hidden" ref={emblaRef}>
                    <div className="embla__container flex">
                      {extraImages.map((img, index) => (
                        <div className="embla__slide flex-[0_0_80%] md:flex-[0_0_45%] min-w-0 pl-4" key={index}>
                          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-100">
                            <Image src={img} alt={`Gallery ${index}`} fill className="object-cover" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
