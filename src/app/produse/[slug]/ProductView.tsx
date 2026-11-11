'use client';
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Send, ShieldCheck, Truck, Cog, Sparkles, ImageIcon, CheckCircle2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';
import { useTranslation } from '@/hooks/useTranslation';
import { useBlackFridayActive } from '@/hooks/useBlackFriday';
import { getBfProductBySlug, formatEuro, formatBfEndDate } from '@/lib/promo/blackFriday';
import { BF_I18N } from '@/components/home/blackFridayContent';
import { TBIInstallmentsBanner } from '@/components/common/TBIInstallmentsBanner';
import { useLocalePrice } from '@/hooks/useLocalePrice';
import { ProductCard } from '@/components/produse/ProductCard';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import { getLandingCategoryForProduct } from '@/lib/seo/category-link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const RELATED_TITLE: Record<string, string> = {
  ro: 'Alte utilaje din aceeași categorie',
  en: 'More machines in the same category',
  hu: 'További gépek ugyanebből a kategóriából',
  it: 'Altre macchine della stessa categoria',
  de: 'Weitere Maschinen aus derselben Kategorie',
  es: 'Otras máquinas de la misma categoría',
};

const VIEW_ALL: Record<string, string> = {
  ro: 'Vezi toate',
  en: 'View all',
  hu: 'Összes megtekintése:',
  it: 'Vedi tutti:',
  de: 'Alle ansehen:',
  es: 'Ver todos:',
};

export default function ProductView({ product, relatedProducts = [] }: { product: Product; relatedProducts?: Product[] }) {
  const slug = product.slug;
  const landingCat = getLandingCategoryForProduct(product.slug);
  const [submitting, setSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);
  const db = useFirestore();
  const { lang } = useLanguage();
  const bfActive = useBlackFridayActive();
  const bf = bfActive ? getBfProductBySlug(slug) : undefined;
  const bfText = BF_I18N[lang];
  const bfVariant = bf ? bfText.products[bf.id].variant : undefined;
  const priceText = useLocalePrice(Number(product.price) || 0);

  const { translatedData, isTranslating } = useTranslation(product);

  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' }, [
    Autoplay({ delay: 4000, stopOnInteraction: false })
  ]);

  const [inquiry, setInquiry] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    selectedModel: '',
    tavalug: '',
  });

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !termsAccepted) return;
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
        title: lang === 'ro' ? "Cerere trimisă!" : "Request sent!",
        description: lang === 'ro' ? "Vă vom contacta în cel mai scurt timp posibil." : "We will contact you as soon as possible.",
      });
      setInquiry({ name: '', email: '', phone: '', message: '', selectedModel: '', tavalug: '' });
      setTermsAccepted(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not send request." });
    } finally {
      setSubmitting(false);
    }
  };



  // Black Friday (doar cât ține oferta): coperta cu oferta + pozele reale din pachet, în fața
  // galeriei din Firestore. Hero-ul rămâne pe mainImage; după ofertă dispar automat.
  const bfGallery = bf?.gallery ?? [];
  const extraImages = Array.from(new Set([...bfGallery, ...(product.images || [])]))
    .filter(img => img !== product.mainImage);

  const productModels = product.specTable?.rows?.map(row => ({
    name: row.values[0],
    isPopular: row.isPopular
  })).filter(m => m.name && m.name.trim() !== "") || [];

  return (
    <>
      <Navbar />
      <main className="bg-neutral-50 min-h-screen">
        <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden bg-neutral-900">
          <Image 
            src={product.mainImage} 
            alt={product.name} 
            fill 
            sizes="100vw"
            className="object-cover opacity-60"
            priority
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 z-10" />
          
          <div className="absolute top-32 left-6 md:left-14 z-20">
            <Link href="/produse">
              <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full h-10 px-4 gap-2 font-bold backdrop-blur-md border border-white/20">
                <ChevronLeft size={18} /> {lang === 'ro' ? 'Catalog' : 'Catalog'}
              </Button>
            </Link>
          </div>

          <div className="absolute bottom-0 left-0 right-0 max-w-[1440px] mx-auto px-6 md:px-14 pb-20 z-20">
            <div className="space-y-4 max-w-4xl">
              <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-white/50">
                <Link href="/" className="hover:text-white transition-colors">{t[lang].home}</Link>
                <span aria-hidden="true" className="opacity-50">›</span>
                <Link href="/produse" className="hover:text-white transition-colors">{t[lang].products}</Link>
                <span aria-hidden="true" className="opacity-50">›</span>
                {(() => {
                  const catLabel = t[lang][product.category as keyof typeof t.ro] || PRODUCT_CATEGORIES.find((c) => c.slug === product.category)?.name || product.category;
                  return landingCat
                    ? <Link href={`/utilaje/${landingCat.slug}`} className="hover:text-white transition-colors">{catLabel}</Link>
                    : <span>{catLabel}</span>;
                })()}
                <span aria-hidden="true" className="opacity-50">›</span>
                <span className="text-white/80" aria-current="page">{product.name}</span>
              </nav>
              <div className="flex items-center gap-3">
                <span className="text-accent-lime font-extrabold text-[11px] md:text-[12px] uppercase tracking-[0.3em]">{product.brand}</span>
                <div className="w-1.5 h-1.5 bg-accent-lime rounded-full" />
                <span className="text-white/70 font-bold text-[11px] md:text-[12px] uppercase tracking-widest">
                  {t[lang][product.category as keyof typeof t.ro] || product.category}
                </span>
              </div>
              <h1 className={cn(
                "font-headline font-extrabold text-4xl md:text-6xl text-white tracking-tighter leading-tight transition-all",
                isTranslating && "animate-pulse blur-[2px]"
              )}>
                {translatedData?.name}
              </h1>
              <div className="flex flex-wrap gap-2 pt-2">
                 {product.isNew && <span className="bg-white/10 backdrop-blur-md text-white text-[9px] font-extrabold px-4 py-1.5 rounded-full tracking-widest uppercase shadow-lg border border-white/10">{lang === 'ro' ? 'Utilaj Nou' : 'New Equipment'}</span>}
                 {product.isOnSale && <span className="bg-yellow-400 text-black text-[9px] font-extrabold px-4 py-1.5 rounded-full tracking-widest uppercase">{lang === 'ro' ? 'Ofertă' : 'Sale'}</span>}
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-[1440px] mx-auto px-4 md:px-14 py-8 md:py-16 -mt-10 relative z-30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
            
            <div className="lg:col-span-12 space-y-8 md:space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                <div className="lg:col-span-7 space-y-8 md:space-y-12">
                  <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-12 border border-neutral-100 shadow-sm space-y-6 md:space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-accent-lime/10 rounded-lg md:rounded-xl flex items-center justify-center">
                        <Sparkles className="text-accent-lime w-4 h-4 md:w-5 md:h-5" />
                      </div>
                      <h2 className="font-headline font-extrabold text-lg md:text-2xl text-neutral-900 tracking-tight">{t[lang].aboutEquipment}</h2>
                    </div>
                    
                    <div 
                      className={cn(
                        "prose prose-neutral max-w-none text-neutral-600 font-body leading-relaxed text-sm md:text-lg transition-all whitespace-pre-wrap break-words",
                        isTranslating && "animate-pulse opacity-50"
                      )}
                      dangerouslySetInnerHTML={{ __html: translatedData?.detailedDescription || translatedData?.description || '' }}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 md:pt-8 border-t border-neutral-50">
                       {[
                         { icon: <ShieldCheck className="w-6 h-6 md:w-8 md:h-8" />, title: t[lang].warranty, sub: t[lang].warrantySub },
                         { icon: <Truck className="w-6 h-6 md:w-8 md:h-8" />, title: t[lang].delivery, sub: t[lang].deliverySub },
                         { icon: <Cog className="w-6 h-6 md:w-8 md:h-8" />, title: t[lang].parts, sub: t[lang].partsSub },
                       ].map((item, i) => (
                         <div key={i} className="flex md:block items-center md:items-start gap-4 md:space-y-2">
                           <div className="text-accent-lime shrink-0">{item.icon}</div>
                           <div>
                            <h4 className="font-headline font-bold text-xs md:text-sm text-neutral-900">{item.title}</h4>
                            <p className="text-[9px] md:text-[10px] text-neutral-400 font-medium uppercase tracking-wider">{item.sub}</p>
                           </div>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-6 md:space-y-8">
                  <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-8 md:p-10 text-neutral-900 border border-neutral-100 shadow-xl overflow-hidden relative">
                    <div className="space-y-4 md:space-y-6 relative z-10">
                      {bf?.priceMode === 'replace' ? (
                        <div className="space-y-2">
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-900 text-white rounded-full text-[9px] md:text-[10px] font-extrabold uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 bg-accent-lime rounded-full" />
                            {bfText.pageLabel}
                          </span>
                          <div className="flex items-baseline gap-3 flex-wrap">
                            <span className="font-headline font-extrabold text-3xl md:text-5xl text-neutral-900 tracking-tighter">{formatEuro(bf.newPrice)}</span>
                            <span className="font-headline font-bold text-lg md:text-xl text-neutral-400 line-through">{formatEuro(bf.oldPrice)}</span>
                            <span className="text-neutral-500 font-body text-sm">{bfText.vat}</span>
                          </div>
                          <p className="text-neutral-500 text-[11px] md:text-xs font-medium">{bfText.pageValidUntil.replace('{date}', formatBfEndDate(lang))}</p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <span className="text-[9px] md:text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">{t[lang].catalogPrice}</span>
                          <div className="font-headline font-extrabold text-3xl md:text-5xl text-neutral-900 tracking-tighter">
                            {product.priceOnRequest ? t[lang].priceOnRequest : `${priceText} EUR`}
                          </div>
                        </div>
                      )}

                      {bf?.priceMode === 'variant' && bfVariant && (
                        <div className="rounded-xl md:rounded-2xl border border-neutral-200 bg-neutral-50 p-4 md:p-5 space-y-2">
                          <div className="flex items-center justify-between gap-3 flex-wrap">
                            <span className="text-[9px] md:text-[10px] font-extrabold text-neutral-500 uppercase tracking-widest">{bfVariant?.title}</span>
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-900 text-white rounded-full text-[9px] md:text-[10px] font-extrabold uppercase tracking-widest">
                              <span className="w-1.5 h-1.5 bg-accent-lime rounded-full" />
                              {bfText.pageLabel}
                            </span>
                          </div>
                          <div className="font-headline font-bold text-sm md:text-base text-neutral-900">{bfVariant?.name}</div>
                          <div className="flex items-baseline gap-3 flex-wrap">
                            <span className="font-headline font-extrabold text-2xl md:text-4xl text-neutral-900 tracking-tighter">{formatEuro(bf.newPrice)}</span>
                            <span className="font-headline font-bold text-base md:text-lg text-neutral-400 line-through">{formatEuro(bf.oldPrice)}</span>
                            <span className="text-neutral-500 font-body text-sm">{bfText.vat}</span>
                          </div>
                          <p className="text-neutral-500 text-[11px] md:text-xs font-medium leading-relaxed">{bfVariant?.note}</p>
                          <p className="text-neutral-500 text-[11px] md:text-xs font-medium">{bfText.pageValidUntil.replace('{date}', formatBfEndDate(lang))}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-3 p-3 md:p-4 bg-neutral-50 rounded-xl md:rounded-2xl border border-neutral-100">
                        <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-accent-lime rounded-full animate-pulse shadow-[0_0_10px_rgba(122,194,74,0.5)]" />
                        <span className="text-neutral-500 font-extrabold text-[10px] md:text-[11px] uppercase tracking-widest">{t[lang].readyToDeliver}</span>
                      </div>
                    </div>
                  </div>

                  <TBIInstallmentsBanner variant="compact" />

                  {/* Sidebar Inquiry Form (Desktop Only) */}
                  <div className="hidden lg:block">
                    <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 text-neutral-900 space-y-6 md:space-y-8 shadow-xl border border-neutral-100">
                      <div className="space-y-2 md:space-y-3">
                        <h3 className="font-headline font-extrabold text-xl md:text-2xl tracking-tight">{t[lang].requestOffer}</h3>
                        <p className="text-neutral-500 text-xs md:text-sm font-medium">{lang === 'ro' ? 'Lăsați-ne datele voastre și vă vom contacta cu o ofertă personalizată.' : 'Leave us your details and we will contact you with a personalized offer.'}</p>
                      </div>

                      <form onSubmit={handleInquirySubmit} className="space-y-4 product-form" data-product={product.name}>
                        <Input 
                          placeholder={t[lang].fullName} 
                          value={inquiry.name}
                          onChange={(e) => setInquiry({...inquiry, name: e.target.value})}
                          required
                          className="h-12 md:h-14 bg-neutral-50 border-neutral-100 rounded-xl md:rounded-2xl focus:ring-accent-lime text-sm"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input 
                            type="email" 
                            placeholder={t[lang].email} 
                            value={inquiry.email}
                            onChange={(e) => setInquiry({...inquiry, email: e.target.value})}
                            required
                            className="h-12 md:h-14 bg-neutral-50 border-neutral-100 rounded-xl md:rounded-2xl focus:ring-accent-lime text-sm"
                          />
                          <Input 
                            type="tel" 
                            placeholder={t[lang].phone} 
                            value={inquiry.phone}
                            onChange={(e) => setInquiry({...inquiry, phone: e.target.value})}
                            required
                            className="h-12 md:h-14 bg-neutral-50 border-neutral-100 rounded-xl md:rounded-2xl focus:ring-accent-lime text-sm"
                          />
                        </div>

                        {productModels.length > 0 && (
                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest ml-1">{lang === 'ro' ? 'Selectează Modelul' : 'Select Model'}</label>
                            <select 
                              value={inquiry.selectedModel}
                              onChange={(e) => setInquiry({...inquiry, selectedModel: e.target.value})}
                              className="w-full h-12 md:h-14 bg-neutral-50 border border-neutral-100 rounded-xl md:rounded-2xl px-4 text-sm font-bold focus:ring-2 focus:ring-accent-lime outline-none transition-all cursor-pointer"
                            >
                              <option value="" disabled>{lang === 'ro' ? 'Selectează modelul dorit...' : 'Choose model...'}</option>
                              {productModels.map((m, i) => (
                                <option key={i} value={m.name}>
                                  {m.isPopular ? `⭐ ${m.name}` : m.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest ml-1">{lang === 'ro' ? 'Tăvălug necesar (Opțional)' : 'Required Roller (Optional)'}</label>
                          <select 
                            value={inquiry.tavalug}
                            onChange={(e) => setInquiry({...inquiry, tavalug: e.target.value})}
                            className="w-full h-12 md:h-14 bg-neutral-50 border border-neutral-100 rounded-xl md:rounded-2xl px-4 text-sm font-bold focus:ring-2 focus:ring-accent-lime outline-none transition-all cursor-pointer text-neutral-700"
                          >
                            <option value="">{lang === 'ro' ? 'Fără tăvălug' : 'No roller'}</option>
                            <option value="Coarda (frontal/spate)">Coarda (frontal/spate)</option>
                            <option value="Packer cu autocuratare">Packer cu autocuratare</option>
                            <option value="Vinclu / Vinclu elicoidal / vinclu croskil">Vinclu / Vinclu elicoidal / vinclu croskil</option>
                            <option value="Tubular">Tubular</option>
                          </select>
                        </div>

                        <Textarea 
                          placeholder={t[lang].message} 
                          value={inquiry.message}
                          onChange={(e) => setInquiry({...inquiry, message: e.target.value})}
                          required
                          className="min-h-[100px] md:min-h-[120px] bg-neutral-50 border-neutral-100 rounded-xl md:rounded-2xl focus:ring-accent-lime text-sm"
                        />

                        <div className="flex items-start gap-3 py-2">
                          <Checkbox 
                            id="terms" 
                            checked={termsAccepted} 
                            onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                            className="mt-1 border-neutral-300 data-[state=checked]:bg-accent-lime data-[state=checked]:border-accent-lime data-[state=checked]:text-black"
                          />
                          <label
                            htmlFor="terms"
                            className="text-[11px] font-medium leading-tight text-neutral-500 cursor-pointer select-none"
                          >
                            {t[lang].termsAgreement}
                          </label>
                        </div>

                        <Button 
                          type="submit" 
                          disabled={submitting || !termsAccepted}
                          className="w-full bg-accent-lime hover:bg-accent-lime/90 text-black font-extrabold h-14 md:h-16 rounded-full flex items-center justify-between pl-6 md:pl-8 pr-1.5 group transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                        >
                          <span className="text-sm md:text-base">{submitting ? t[lang].sending : t[lang].requestOffer}</span>
                          <div className="w-11 h-11 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center transition-transform group-hover:rotate-45">
                            <Send size={18} className="text-black md:w-5 md:h-5" />
                          </div>
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              {product.specTable && product.specTable.rows.length > 0 && (
                <div className="space-y-6 md:space-y-8 pt-6 md:pt-10">
                  <div className="text-center space-y-3 md:space-y-4">
                    <h2 className="font-headline font-extrabold text-2xl md:text-5xl text-neutral-900 tracking-tight px-4">
                      {lang === 'ro' ? 'Alege ' : 'Choose the '} <span className="text-accent-lime">{lang === 'ro' ? 'modelul potrivit' : 'right model'}</span>
                    </h2>
                  </div>

                  <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-2xl shadow-black/5 overflow-hidden border border-neutral-100 mx-2 md:mx-0">
                    <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-neutral-900 text-white">
                            {product.specTable.headers.map((header, i) => (
                              <th key={i} className="p-2 md:p-5 text-left text-[8px] md:text-[10px] font-extrabold uppercase tracking-widest border-r border-white/5 last:border-0 whitespace-nowrap">
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
                                <td key={colIndex} className="p-2 md:p-5 text-[8px] md:text-sm whitespace-nowrap">
                                  {colIndex === 0 ? (
                                    <div className="flex items-center gap-2 md:gap-3">
                                      <span className="font-bold text-neutral-900 font-headline">{val}</span>
                                      {row.isPopular && (
                                        <Badge className="bg-accent-lime hover:bg-accent-lime text-black border-none text-[7px] md:text-[8px] font-extrabold px-1.5 md:px-2 py-0.5 rounded-full uppercase">POPULAR</Badge>
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
                </div>
              )}

              {Array.isArray(translatedData?.whyBrand) && translatedData?.whyBrand.length > 0 && (
                <section className="pt-10 md:pt-20 pb-10">
                  <div className="max-w-4xl mx-auto space-y-8 md:space-y-12">
                     <div className="text-center space-y-3 md:space-y-4">
                        <h2 className="font-headline font-extrabold text-2xl md:text-5xl text-neutral-900 tracking-tight transition-all">
                          {t[lang].whyBrand.replace('{brand}', product.brand)}
                        </h2>
                     </div>

                     <div className={cn(
                       "grid grid-cols-1 gap-6 md:gap-8 px-4 transition-all",
                       isTranslating && "animate-pulse blur-[2px]"
                     )}>
                        {translatedData?.whyBrand.map((text: string, i: number) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.6 }}
                            className="flex items-start gap-4 md:gap-6 group"
                          >
                            <div className="mt-1 w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent-lime flex items-center justify-center shrink-0 shadow-lg shadow-accent-lime/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                              <Check size={16} className="text-black md:w-5 md:h-5" strokeWidth={4} />
                            </div>
                            <p className="font-headline font-bold text-lg md:text-2xl text-neutral-900 leading-tight tracking-tight pt-1">
                              {text}
                            </p>
                          </motion.div>
                        ))}
                     </div>
                  </div>
                </section>
              )}

              {extraImages.length > 0 && (
                <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-12 border border-neutral-100 shadow-sm space-y-6 md:space-y-8">
                   <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-accent-lime rounded-lg md:rounded-xl flex items-center justify-center">
                      <ImageIcon className="text-black w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <h2 className="font-headline font-extrabold text-lg md:text-2xl text-neutral-900 tracking-tight">{t[lang].photoGallery}</h2>
                  </div>

                  <div className="embla overflow-hidden" ref={emblaRef}>
                    <div className="embla__container flex">
                      {extraImages.map((img, index) => (
                        <div className="embla__slide flex-[0_0_85%] md:flex-[0_0_45%] min-w-0 pl-4" key={index}>
                          <motion.div 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedGalleryImage(img)}
                            className="relative aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden border border-neutral-100 cursor-pointer group"
                          >
                            <Image src={img} alt={`${product.name} - Gallery ${index}`} fill className={cn('transition-transform duration-500 group-hover:scale-110', img === bf?.listCover ? 'object-cover object-bottom' : 'object-cover')} sizes="(max-width: 768px) 85vw, 45vw" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                               <ImageIcon className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                            </div>
                          </motion.div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile-Only Inquiry Form (at the bottom) */}
              <div className="lg:hidden mt-12">
                <div className="bg-white rounded-[1.5rem] p-6 text-neutral-900 space-y-6 shadow-xl border border-neutral-100">
                  <div className="space-y-2">
                    <h3 className="font-headline font-extrabold text-xl tracking-tight">{t[lang].requestOffer}</h3>
                    <p className="text-neutral-500 text-xs font-medium">{lang === 'ro' ? 'Lăsați-ne datele voastre și vă vom contacta cu o ofertă personalizată.' : 'Leave us your details and we will contact you with a personalized offer.'}</p>
                  </div>

                  <form onSubmit={handleInquirySubmit} className="space-y-4 product-form" data-product={product.name}>
                    <Input 
                      placeholder={t[lang].fullName} 
                      value={inquiry.name}
                      onChange={(e) => setInquiry({...inquiry, name: e.target.value})}
                      required
                      className="h-12 bg-neutral-50 border-neutral-100 rounded-xl focus:ring-accent-lime text-sm"
                    />
                    <div className="grid grid-cols-1 gap-4">
                      <Input 
                        type="email" 
                        placeholder={t[lang].email} 
                        value={inquiry.email}
                        onChange={(e) => setInquiry({...inquiry, email: e.target.value})}
                        required
                        className="h-12 bg-neutral-50 border-neutral-100 rounded-xl focus:ring-accent-lime text-sm"
                      />
                      <Input 
                        type="tel" 
                        placeholder={t[lang].phone} 
                        value={inquiry.phone}
                        onChange={(e) => setInquiry({...inquiry, phone: e.target.value})}
                        required
                        className="h-12 bg-neutral-50 border-neutral-100 rounded-xl focus:ring-accent-lime text-sm"
                      />
                    </div>

                    {productModels.length > 0 && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest ml-1">{lang === 'ro' ? 'Selectează Modelul' : 'Select Model'}</label>
                        <select 
                          value={inquiry.selectedModel}
                          onChange={(e) => setInquiry({...inquiry, selectedModel: e.target.value})}
                          className="w-full h-12 bg-neutral-50 border border-neutral-100 rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-accent-lime outline-none transition-all cursor-pointer"
                        >
                          <option value="" disabled>{lang === 'ro' ? 'Selectează modelul dorit...' : 'Choose model...'}</option>
                          {productModels.map((m, i) => (
                            <option key={i} value={m.name}>
                              {m.isPopular ? `⭐ ${m.name}` : m.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest ml-1">{lang === 'ro' ? 'Tăvălug necesar (Opțional)' : 'Required Roller (Optional)'}</label>
                      <select 
                        value={inquiry.tavalug}
                        onChange={(e) => setInquiry({...inquiry, tavalug: e.target.value})}
                        className="w-full h-12 bg-neutral-50 border border-neutral-100 rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-accent-lime outline-none transition-all cursor-pointer text-neutral-700"
                      >
                        <option value="">{lang === 'ro' ? 'Fără tăvălug' : 'No roller'}</option>
                        <option value="Coarda (frontal/spate)">Coarda (frontal/spate)</option>
                        <option value="Packer cu autocuratare">Packer cu autocuratare</option>
                        <option value="Vinclu / Vinclu elicoidal / vinclu croskil">Vinclu / Vinclu elicoidal / vinclu croskil</option>
                        <option value="Tubular">Tubular</option>
                      </select>
                    </div>

                    <Textarea 
                      placeholder={t[lang].message} 
                      value={inquiry.message}
                      onChange={(e) => setInquiry({...inquiry, message: e.target.value})}
                      required
                      className="min-h-[100px] bg-neutral-50 border-neutral-100 rounded-xl focus:ring-accent-lime text-sm"
                    />

                    <div className="flex items-start gap-3 py-2">
                      <Checkbox 
                        id="terms-mobile" 
                        checked={termsAccepted} 
                        onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                        className="mt-1 border-neutral-300 data-[state=checked]:bg-accent-lime data-[state=checked]:border-accent-lime data-[state=checked]:text-black"
                      />
                      <label
                        htmlFor="terms-mobile"
                        className="text-[11px] font-medium leading-tight text-neutral-500 cursor-pointer select-none"
                      >
                        {t[lang].termsAgreement}
                      </label>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={submitting || !termsAccepted}
                      className="w-full bg-accent-lime hover:bg-accent-lime/90 text-black font-extrabold h-14 rounded-full flex items-center justify-between pl-6 pr-1.5 group transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                    >
                      <span className="text-sm">{submitting ? t[lang].sending : t[lang].requestOffer}</span>
                      <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center transition-transform group-hover:rotate-45">
                        <Send size={18} className="text-black" />
                      </div>
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="max-w-[1440px] mx-auto px-4 md:px-14 pb-16 md:pb-24">
            <h2 className="font-headline font-extrabold text-2xl md:text-5xl text-neutral-900 tracking-tight text-center mb-8 md:mb-12">
              {RELATED_TITLE[lang] ?? RELATED_TITLE.ro}
            </h2>
            {landingCat && (
              <p className="text-center -mt-4 md:-mt-6 mb-8 md:mb-12">
                <Link href={`/utilaje/${landingCat.slug}`} className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors underline underline-offset-4">
                  {VIEW_ALL[lang] ?? VIEW_ALL.ro} {landingCat.name} ›
                </Link>
              </p>
            )}
            <div className="grid gap-6 md:gap-10 grid-cols-1 md:grid-cols-2">
              {relatedProducts.map((rp) => (
                <ProductCard key={rp.id} product={rp} viewMode="grid" />
              ))}
            </div>
          </section>
        )}

        <Dialog open={!!selectedGalleryImage} onOpenChange={() => setSelectedGalleryImage(null)}>
          <DialogContent className="max-w-[95vw] md:max-w-[80vw] lg:max-w-[70vw] p-0 overflow-hidden bg-transparent border-none shadow-none focus:outline-none">
            <DialogHeader className="sr-only">
              <DialogTitle>Vizualizare Imagine</DialogTitle>
            </DialogHeader>
            <div className="relative w-full aspect-[4/3] md:aspect-video rounded-3xl overflow-hidden">
              <AnimatePresence mode="wait">
                {selectedGalleryImage && (
                  <motion.div
                    key={selectedGalleryImage}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full h-full"
                  >
                    <Image 
                      src={selectedGalleryImage} 
                      alt="Gallery Full View" 
                      fill 
                      sizes="(max-width: 768px) 95vw, 80vw"
                      className="object-contain"
                      quality={90}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <button 
                onClick={() => setSelectedGalleryImage(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white transition-all border border-white/20 z-50"
              >
                <X size={20} />
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </>
  );
}
