'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useFirestore, useStorage } from '@/firebase';
import { addProduct, updateProduct } from '@/lib/firestore/products';
import { uploadImage } from '@/lib/firebase/storage';
import { Product, ProductCategory, ProductTranslation } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Save, ChevronLeft, Upload, Loader2, Languages, ShieldCheck } from 'lucide-react';
import { adminProductDescriptionGenerator } from '@/ai/flows/admin-product-description-generator';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import { LANGUAGES } from '@/context/LanguageContext';

interface Props {
  initialData?: Product;
  mode: 'create' | 'edit';
}

export default function ProductForm({ initialData, mode }: Props) {
  const router = useRouter();
  const db = useFirestore();
  const storage = useStorage();
  
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const [galleryImages, setGalleryImages] = useState<string[]>(initialData?.images?.filter(img => img !== initialData?.mainImage) ?? []);
  const [mainImage, setMainImage] = useState<string>(initialData?.mainImage ?? '');

  const [form, setForm] = useState({
    name: initialData?.name ?? '',
    slug: initialData?.slug ?? '',
    brand: initialData?.brand ?? '',
    brandSlug: initialData?.brandSlug ?? '',
    category: initialData?.category ?? 'terradisc' as ProductCategory,
    subcategory: initialData?.subcategory ?? '',
    shortDescription: initialData?.shortDescription ?? '',
    description: initialData?.description ?? '',
    detailedDescription: initialData?.detailedDescription ?? '',
    whyBrand: Array.isArray(initialData?.whyBrand) 
      ? initialData?.whyBrand.join('\n') 
      : (typeof initialData?.whyBrand === 'string' ? initialData.whyBrand : ''),
    price: initialData?.price?.toString() ?? '0',
    priceOnRequest: initialData?.priceOnRequest ?? false,
    inStock: initialData?.inStock ?? true,
    stockQuantity: initialData?.stockQuantity?.toString() ?? '0',
    isNew: initialData?.isNew ?? false,
    isFeatured: initialData?.isFeatured ?? false,
    isOnSale: initialData?.isOnSale ?? false,
    salePercent: initialData?.salePercent?.toString() ?? '0',
    tags: initialData?.tags?.join(', ') ?? '',
    metaTitle: initialData?.metaTitle ?? '',
    metaDescription: initialData?.metaDescription ?? '',
  });

  const set = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const handleRetranslate = async () => {
    if (!initialData?.id) return;
    setTranslating(true);
    try {
      const targetLangs = LANGUAGES.filter(l => l.code !== 'ro').map(l => l.code);
      const textsToTranslate = [
        form.name,
        form.shortDescription,
        form.description,
        form.detailedDescription,
        ...form.whyBrand.split('\n').filter(Boolean)
      ];

      for (const lang of targetLangs) {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: textsToTranslate, target_lang: lang }),
        });
        const result = await response.json();
        if (result.translatedText) {
          const [name, short, desc, detailed, ...why] = result.translatedText;
          const translationData: ProductTranslation = {
            name, shortDescription: short, description: desc, detailedDescription: detailed, whyBrand: why
          };
          await updateProduct(db, initialData.id, { [`translations.${lang}`]: translationData });
        }
      }
      toast({ title: "Traducere actualizată", description: "Toate limbile au fost re-procesate." });
    } catch (error) {
      toast({ variant: "destructive", title: "Eroare traducere", description: "Nu s-a putut completa procesul." });
    } finally {
      setTranslating(false);
    }
  };

  const handleMainImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storage) return;
    setUploadingMain(true);
    try {
      const url = await uploadImage(storage, file);
      setMainImage(url);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Eroare upload", description: error.message });
    } finally {
      setUploadingMain(false);
    }
  };

  const handleGalleryFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0 || !storage) return;
    setUploadingGallery(true);
    try {
      const urls = await Promise.all(files.map(file => uploadImage(storage, file)));
      setGalleryImages(prev => [...prev, ...urls]);
    } finally {
      setUploadingGallery(false);
    }
  };

  const generateSlug = (name: string) => name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

  const handleNameChange = (name: string) => {
    set('name', name);
    if (mode === 'create') set('slug', generateSlug(name));
  };

  const handleAiGenerate = async () => {
    if (!form.name || !form.brand) return;
    setGenerating(true);
    try {
      const response = await adminProductDescriptionGenerator({
        productName: form.name,
        brandName: form.brand,
        categoryName: form.category,
      });
      set('shortDescription', response.shortDescription);
      set('detailedDescription', response.detailedDescription);
      set('whyBrand', response.whyBrand.join('\n'));
      set('metaDescription', response.shortDescription);
      set('metaTitle', `${form.name} | AgroSalso România`);
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...form,
        mainImage,
        images: [mainImage, ...galleryImages],
        whyBrand: form.whyBrand.split('\n').map(p => p.trim()).filter(Boolean),
        brandSlug: generateSlug(form.brand),
        price: parseFloat(form.price) || 0,
        currency: 'RON',
      };
      if (mode === 'create') await addProduct(db, data);
      else if (initialData?.id) await updateProduct(db, initialData.id, data);
      router.push('/admin/produse');
    } finally {
      setSaving(false);
    }
  };

  const labelClass = "text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest ml-1 mb-2 block";
  const inputClass = "h-12 rounded-xl bg-neutral-50 border-none focus-visible:ring-accent-lime shadow-sm";

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6 lg:space-y-10 pb-20">
      <input type="file" ref={mainImageInputRef} onChange={handleMainImageFile} accept="image/*" className="hidden" />
      <input type="file" ref={galleryInputRef} onChange={handleGalleryFiles} accept="image/*" multiple className="hidden" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button type="button" variant="ghost" size="icon" className="rounded-full bg-white shadow-sm" onClick={() => router.back()}>
            <ChevronLeft size={20} />
          </Button>
          <div>
            <h1 className="font-headline font-extrabold text-2xl lg:text-3xl text-neutral-900 tracking-tighter uppercase leading-tight">
              {mode === 'create' ? 'Adăugare' : 'Editare'} Produs
            </h1>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {mode === 'edit' && (
            <Button 
              type="button"
              onClick={handleRetranslate}
              disabled={translating}
              className="flex-1 sm:flex-none bg-neutral-900 hover:bg-black text-white font-extrabold rounded-full h-12 px-4 lg:px-6 gap-2 text-xs"
            >
              {translating ? <Loader2 className="animate-spin size-4" /> : <Languages size={16} />}
              {translating ? 'TRADUCERE...' : 'RE-TRADUCE'}
            </Button>
          )}
          <Button 
            type="button"
            onClick={handleAiGenerate}
            disabled={generating}
            className="flex-1 sm:flex-none bg-accent-lime hover:bg-accent-lime/90 text-black font-extrabold rounded-full h-12 px-4 lg:px-6 gap-2 text-xs shadow-lg shadow-accent-lime/20"
          >
            {generating ? <Loader2 className="animate-spin size-4" /> : <Sparkles size={16} />}
            GENERARE AI
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
        <div className="lg:col-span-2 space-y-6 lg:space-y-10">
          <div className="bg-white rounded-[1.5rem] lg:rounded-[2.5rem] p-6 lg:p-10 shadow-sm space-y-6 lg:space-y-8 border border-neutral-100">
            <h3 className="font-headline font-extrabold text-lg lg:text-xl tracking-tight flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-accent-lime rounded-full" /> Detalii Principale
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <label className={labelClass}>Nume Produs</label>
                <Input value={form.name} onChange={e => handleNameChange(e.target.value)} required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Marcă</label>
                <Input value={form.brand} onChange={e => set('brand', e.target.value)} required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Slug URL</label>
                <Input value={form.slug} onChange={e => set('slug', e.target.value)} required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Categorie</label>
                <select className="w-full h-12 rounded-xl bg-neutral-50 border-none px-4 text-sm font-bold focus:ring-2 focus:ring-accent-lime outline-none shadow-sm" value={form.category} onChange={e => set('category', e.target.value)}>
                  {PRODUCT_CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-6 pt-4">
              <div>
                <label className={labelClass}>Scurtă Descriere (Listing)</label>
                <Input value={form.shortDescription} onChange={e => set('shortDescription', e.target.value)} className={inputClass} maxLength={160} />
              </div>
              <div>
                <label className={labelClass}>Descriere Vizibilă (Pagina Produs)</label>
                <Textarea value={form.detailedDescription} onChange={e => set('detailedDescription', e.target.value)} className="min-h-[200px] lg:min-h-[250px] rounded-[1.5rem] bg-neutral-50 border-none focus-visible:ring-accent-lime shadow-sm" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[1.5rem] lg:rounded-[2.5rem] p-6 lg:p-10 shadow-sm space-y-6 lg:space-y-8 border border-neutral-100">
             <h3 className="font-headline font-extrabold text-lg lg:text-xl tracking-tight flex items-center gap-2 text-accent-lime">
              <ShieldCheck size={22} /> Secțiunea Brand (Argumente cheie)
            </h3>
            <Textarea 
              value={form.whyBrand} 
              onChange={e => set('whyBrand', e.target.value)} 
              className="min-h-[120px] lg:min-h-[150px] rounded-[1.5rem] bg-neutral-50 border-none focus-visible:ring-accent-lime shadow-sm" 
              placeholder="Ex: Experiență de peste 30 de ani..." 
            />
          </div>

          <div className="bg-white rounded-[1.5rem] lg:rounded-[2.5rem] p-6 lg:p-10 shadow-sm space-y-6 lg:space-y-8 border border-neutral-100">
             <h3 className="font-headline font-extrabold text-lg lg:text-xl tracking-tight flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-accent-lime rounded-full" /> Galerie Media
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
              <Button type="button" variant="outline" onClick={() => mainImageInputRef.current?.click()} className="w-full h-14 border-dashed border-2 rounded-2xl">
                {uploadingMain ? <Loader2 className="animate-spin" /> : <Upload size={18} />}
                ÎNCARCĂ POZĂ PRINCIPALĂ
              </Button>
              {mainImage && (
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-neutral-100 shadow-sm">
                  <Image src={mainImage} alt="Preview" fill className="object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:space-y-10">
          <div className="bg-neutral-900 rounded-[1.5rem] lg:rounded-[2.5rem] p-6 lg:p-8 text-white space-y-6 lg:space-y-8 shadow-xl">
             <h3 className="font-headline font-extrabold text-lg lg:text-xl tracking-tight">Preț & Stoc</h3>
             <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Preț (RON)</label>
                  <Input type="number" value={form.price} onChange={e => set('price', e.target.value)} disabled={form.priceOnRequest} className="bg-white/5 border-none h-12 rounded-xl text-white" />
                </div>
                <div className="space-y-4 pt-2">
                  {['priceOnRequest', 'inStock', 'isNew', 'isFeatured', 'isOnSale'].map(field => (
                    <label key={field} className="flex items-center justify-between cursor-pointer group">
                      <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">
                        {field === 'priceOnRequest' ? 'La cerere' : 
                         field === 'inStock' ? 'În stoc' : 
                         field === 'isNew' ? 'Produs nou' : 
                         field === 'isFeatured' ? 'Recomandat' : 'Promoție'}
                      </span>
                      <input type="checkbox" checked={form[field as keyof typeof form] as boolean} onChange={e => set(field, e.target.checked)} className="w-5 h-5 accent-accent-lime rounded-md" />
                    </label>
                  ))}
                </div>
             </div>
          </div>

          <Button type="submit" disabled={saving || uploadingMain || uploadingGallery} className="w-full bg-neutral-900 hover:bg-black text-white font-extrabold h-16 rounded-[1.5rem] lg:rounded-3xl flex items-center justify-between pl-6 lg:pl-10 pr-2 group shadow-2xl">
            <span>{saving ? 'SE SALVEAZĂ...' : 'SALVEAZĂ PRODUSUL'}</span>
            <div className="w-12 h-12 bg-accent-lime rounded-full flex items-center justify-center shrink-0">
              <Save size={20} className="text-black" />
            </div>
          </Button>
        </div>
      </div>
    </form>
  );
}
