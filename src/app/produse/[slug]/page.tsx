
'use client';
import { use, useEffect, useState, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Send, Phone, Info, ShieldCheck, Truck, Cog, Sparkles, Star, Settings2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

export default function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const db = useFirestore();

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false })
  ]);

  const [inquiry, setInquiry] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

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
          <h1 className="text-4xl font-headline font-extrabold mb-4 text-neutral-900">Produsul nu a fost găsit</h1>
          <Link href="/produse">
            <Button className="bg-neutral-900 text-white rounded-full px-8 h-12">Înapoi la catalog</Button>
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  // Logica pentru galerie: asigurăm că avem cel puțin poza principală
  const galleryImages = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : [product.mainImage];

  return (
    <>
      <Navbar />
      <main className="bg-neutral-50 min-h-screen">
        {/* Immersive Gallery Hero */}
        <section className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden bg-neutral-900">
          <div className="embla h-full" ref={emblaRef}>
            <div className="embla__container h-full">
              {galleryImages.map((img, index) => (
                <div className="embla__slide relative flex-[0_0_100%] h-full" key={index}>
                  <Image 
                    src={img} 
                    alt={`${product.name} gallery ${index}`} 
                    fill 
                    className="object-cover opacity-90"
                    priority={index === 0}
                  />
                  {/* Overlay per slide pentru contrast text */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10" />
                </div>
              ))}
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-neutral-50 via-transparent to-transparent z-20 pointer-events-none" />
          
          {/* Back Button */}
          <Link href="/produse" className="absolute top-28 left-6 md:left-14 z-40">
            <Button variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 rounded-full h-12 px-6 gap-2 font-bold transition-all">
              <ChevronLeft size={18} /> Catalog
            </Button>
          </Link>

          {/* Gallery Navigation Controls */}
          {galleryImages.length > 1 && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3">
              {galleryImages.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => emblaApi?.scrollTo(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === i ? 'w-12 bg-accent-lime' : 'w-3 bg-white/30'
                  }`}
                />
              ))}
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 max-w-[1440px] mx-auto px-6 md:px-14 pb-24 md:pb-32 z-30">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 md:space-y-6 max-w-5xl"
            >
              <div className="flex items-center gap-3">
                <span className="text-accent-lime font-extrabold text-[11px] md:text-[13px] uppercase tracking-[0.4em] drop-shadow-lg">{product.brand}</span>
                <div className="w-2 h-2 bg-accent-lime rounded-full" />
                <span className="text-white font-bold text-[11px] md:text-[13px] uppercase tracking-widest drop-shadow-lg">{product.category}</span>
              </div>
              <h1 className="font-headline font-extrabold text-5xl md:text-8xl lg:text-9xl text-white tracking-tighter leading-[0.95] drop-shadow-2xl">
                {product.name}
              </h1>
              <div className="flex flex-wrap gap-3 pt-6">
                 {product.isNew && <span className="bg-blue-600 text-white text-[10px] md:text-[11px] font-extrabold px-6 py-2.5 rounded-full tracking-widest uppercase shadow-2xl">Utilaj Nou</span>}
                 {product.isOnSale && <span className="bg-yellow-400 text-black text-[10px] md:text-[11px] font-extrabold px-6 py-2.5 rounded-full tracking-widest uppercase shadow-2xl">Ofertă Specială</span>}
                 <div className="flex items-center gap-2 bg-white/20 backdrop-blur-xl px-6 py-2.5 rounded-full border border-white/20 shadow-2xl">
                   <Star size={14} className="fill-yellow-400 text-yellow-400" />
                   <span className="text-[10px] md:text-[11px] font-extrabold text-white tracking-widest uppercase">Garanție de top</span>
                 </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="max-w-[1440px] mx-auto px-6 md:px-14 py-12 md:py-20 -mt-20 relative z-40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            
            {/* Content Column */}
            <div className="lg:col-span-7 space-y-12 md:space-y-16">
              
              {/* Detailed Content */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-14 border border-neutral-100 shadow-xl space-y-8 md:space-y-10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-accent-lime/10 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                    <Sparkles className="text-accent-lime w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <h2 className="font-headline font-extrabold text-2xl md:text-4xl text-neutral-900 tracking-tight">Detalii Utile</h2>
                </div>
                
                <div 
                  className="prose prose-neutral max-w-none text-neutral-600 font-body leading-relaxed text-lg md:text-2xl"
                  dangerouslySetInnerHTML={{ __html: product.detailedDescription || product.description }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-10 border-t border-neutral-50">
                   {[
                     { icon: <ShieldCheck className="w-8 h-8 md:w-10 md:h-10" />, title: "Garanție RO", sub: "Service în toată țara" },
                     { icon: <Truck className="w-8 h-8 md:w-10 md:h-10" />, title: "Livrare Promptă", sub: "Direct în ferma ta" },
                     { icon: <Cog className="w-8 h-8 md:w-10 md:h-10" />, title: "Piese Originale", sub: "Stoc disponibil imediat" },
                   ].map((item, i) => (
                     <div key={i} className="space-y-3">
                       <div className="text-accent-lime">{item.icon}</div>
                       <h4 className="font-headline font-bold text-lg md:text-xl text-neutral-900 leading-tight">{item.title}</h4>
                       <p className="text-xs md:text-sm text-neutral-400 font-medium">{item.sub}</p>
                     </div>
                   ))}
                </div>
              </motion.div>

              {/* Dedicated Specs Section */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-14 border border-neutral-100 shadow-xl space-y-8 md:space-y-10"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-neutral-900 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                      <Settings2 className="text-accent-lime w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <h2 className="font-headline font-extrabold text-2xl md:text-4xl text-neutral-900 tracking-tight">Specificații Tehnice</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 md:gap-y-6">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-4 md:py-6 border-b border-neutral-50 group">
                        <span className="text-xs md:text-sm font-bold text-neutral-400 uppercase tracking-widest">{key}</span>
                        <span className="text-base md:text-xl font-extrabold text-neutral-900 text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sticky Action Column */}
            <aside className="lg:col-span-5 space-y-8 sticky top-[120px]">
              
              {/* Pricing Card */}
              <div className="bg-neutral-900 rounded-[2.5rem] md:rounded-[3rem] p-10 md:p-14 text-white border border-white/5 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-48 h-48 bg-accent-lime/10 rounded-full translate-x-20 -translate-y-20 blur-3xl" />
                
                <div className="space-y-8 relative z-10">
                  <div className="space-y-2">
                    <span className="text-[10px] md:text-[12px] font-extrabold text-white/40 uppercase tracking-widest">Preț Catalog (fără TVA)</span>
                    <div className="font-headline font-extrabold text-5xl md:text-7xl text-accent-lime tracking-tighter">
                      {product.priceOnRequest ? "LA CERERE" : `${product.price.toLocaleString()} RON`}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-5 bg-white/5 rounded-3xl border border-white/10">
                    <div className="w-3 h-3 bg-accent-lime rounded-full animate-pulse shadow-[0_0_15px_rgba(163,230,53,0.5)]" />
                    <span className="text-[11px] md:text-[13px] font-extrabold text-white uppercase tracking-widest">Verificat & Gata de Livrare</span>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-14 text-neutral-900 space-y-10 shadow-2xl border border-neutral-100">
                <div className="space-y-4">
                  <h3 className="font-headline font-extrabold text-2xl md:text-4xl tracking-tight">Solicită Ofertă</h3>
                  <p className="text-neutral-500 text-sm md:text-base font-medium leading-relaxed">Primește un preț personalizat și soluții de finanțare adaptate nevoilor tale.</p>
                </div>

                <form onSubmit={handleInquirySubmit} className="space-y-4 md:space-y-6">
                  <Input 
                    placeholder="Nume Complet" 
                    value={inquiry.name}
                    onChange={(e) => setInquiry({...inquiry, name: e.target.value})}
                    required
                    className="h-14 md:h-16 bg-neutral-50 border-neutral-100 text-neutral-900 placeholder:text-neutral-400 rounded-2xl md:rounded-3xl focus:ring-accent-lime"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input 
                      type="email" 
                      placeholder="Email" 
                      value={inquiry.email}
                      onChange={(e) => setInquiry({...inquiry, email: e.target.value})}
                      required
                      className="h-14 md:h-16 bg-neutral-50 border-neutral-100 text-neutral-900 placeholder:text-neutral-400 rounded-2xl md:rounded-3xl focus:ring-accent-lime"
                    />
                    <Input 
                      type="tel" 
                      placeholder="Telefon" 
                      value={inquiry.phone}
                      onChange={(e) => setInquiry({...inquiry, phone: e.target.value})}
                      required
                      className="h-14 md:h-16 bg-neutral-50 border-neutral-100 text-neutral-900 placeholder:text-neutral-400 rounded-2xl md:rounded-3xl focus:ring-accent-lime"
                    />
                  </div>
                  <Textarea 
                    placeholder="Cum te putem ajuta?" 
                    value={inquiry.message}
                    onChange={(e) => setInquiry({...inquiry, message: e.target.value})}
                    required
                    className="min-h-[120px] md:min-h-[150px] bg-neutral-50 border-neutral-100 text-neutral-900 placeholder:text-neutral-400 rounded-2xl md:rounded-3xl focus:ring-accent-lime"
                  />

                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full bg-accent-lime hover:bg-accent-lime/90 text-black font-extrabold h-16 md:h-20 rounded-full flex items-center justify-between pl-10 md:pl-12 pr-2.5 md:pr-3 group transition-all shadow-xl shadow-accent-lime/20"
                  >
                    {submitting ? 'SE TRIMITE...' : 'TRIMITE ACUM'}
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center transition-transform group-hover:rotate-45 shadow-lg shrink-0">
                      <Send size={22} className="text-black" />
                    </div>
                  </Button>
                </form>

                <div className="flex flex-col gap-5 pt-6 border-t border-neutral-50">
                   <a href="tel:+40751234567" className="flex items-center gap-5 text-neutral-500 hover:text-accent-lime transition-colors group">
                     <div className="w-10 h-10 md:w-12 md:h-12 bg-neutral-100 rounded-full flex items-center justify-center group-hover:bg-accent-lime/20 shrink-0 transition-all"><Phone size={18} /></div>
                     <span className="text-sm md:text-base font-bold">+40 751 234 567</span>
                   </a>
                   <div className="flex items-center gap-5 text-neutral-500">
                     <div className="w-10 h-10 md:w-12 md:h-12 bg-neutral-100 rounded-full flex items-center justify-center shrink-0"><Info size={18} /></div>
                     <span className="text-sm md:text-base font-bold">Consultanță gratuită 24/7</span>
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
