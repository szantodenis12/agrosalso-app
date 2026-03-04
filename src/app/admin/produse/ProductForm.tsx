'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFirestore } from '@/firebase';
import { addProduct, updateProduct } from '@/lib/firestore/products';
import { Product, ProductCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Save, ChevronLeft, Trash2, Plus, Image as ImageIcon, X } from 'lucide-react';
import { adminProductDescriptionGenerator } from '@/ai/flows/admin-product-description-generator';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'tractoare', label: 'Tractoare' },
  { value: 'combine', label: 'Combine & Recoltat' },
  { value: 'semanatori', label: 'Semănători' },
  { value: 'irigatii', label: 'Irigații' },
  { value: 'pluguri', label: 'Pluguri & Lucrări Sol' },
  { value: 'sprayere', label: 'Sprayere & Protecție' },
  { value: 'fertilizare', label: 'Fertilizare' },
  { value: 'piese', label: 'Piese & Accesorii' },
];

interface Props {
  initialData?: Product;
  mode: 'create' | 'edit';
}

export default function ProductForm({ initialData, mode }: Props) {
  const router = useRouter();
  const db = useFirestore();
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>(
    initialData?.specifications
      ? Object.entries(initialData.specifications).map(([key, value]) => ({ key, value }))
      : [{ key: '', value: '' }]
  );

  const [galleryImages, setGalleryImages] = useState<string[]>(initialData?.images ?? []);
  const [newImageUrl, setNewImageUrl] = useState('');

  const [form, setForm] = useState({
    name: initialData?.name ?? '',
    slug: initialData?.slug ?? '',
    brand: initialData?.brand ?? '',
    brandSlug: initialData?.brandSlug ?? '',
    category: initialData?.category ?? 'tractoare' as ProductCategory,
    subcategory: initialData?.subcategory ?? '',
    shortDescription: initialData?.shortDescription ?? '',
    description: initialData?.description ?? '',
    detailedDescription: initialData?.detailedDescription ?? '',
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
    mainImage: initialData?.mainImage ?? 'https://picsum.photos/seed/machine/800/600',
  });

  const set = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleNameChange = (name: string) => {
    set('name', name);
    if (mode === 'create') {
      set('slug', generateSlug(name));
    }
  };

  const addImageToGallery = () => {
    if (!newImageUrl) return;
    setGalleryImages([...galleryImages, newImageUrl]);
    setNewImageUrl('');
  };

  const removeImageFromGallery = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const handleAiGenerate = async () => {
    if (!form.name || !form.brand) {
      toast({ variant: "destructive", title: "Lipsesc date", description: "Vă rugăm introduceți numele și marca pentru a folosi AI-ul." });
      return;
    }
    setGenerating(true);
    try {
      const specsObj: Record<string, string> = {};
      specs.filter(s => s.key && s.value).forEach(s => { specsObj[s.key] = s.value; });

      const response = await adminProductDescriptionGenerator({
        productName: form.name,
        brandName: form.brand,
        categoryName: form.category,
        specifications: specsObj
      });

      set('shortDescription', response.shortDescription);
      set('detailedDescription', response.detailedDescription);
      set('metaDescription', response.shortDescription);
      set('metaTitle', `${form.name} | AgroSalso România`);
      
      toast({ title: "Conținut generat!", description: "AI-ul a creat descrierile pentru tine." });
    } catch (error) {
      toast({ variant: "destructive", title: "Eroare AI", description: "Nu s-a putut genera conținutul." });
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const specsObj: Record<string, string> = {};
      specs.filter(s => s.key && s.value).forEach(s => { specsObj[s.key] = s.value; });

      const data = {
        ...form,
        brandSlug: generateSlug(form.brand),
        price: parseFloat(form.price) || 0,
        stockQuantity: parseInt(form.stockQuantity) || 0,
        salePercent: parseInt(form.salePercent) || 0,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        specifications: specsObj,
        currency: 'RON' as const,
        images: galleryImages.length > 0 ? galleryImages : [form.mainImage],
      };

      if (mode === 'create') {
        await addProduct(db, data);
      } else if (initialData?.id) {
        await updateProduct(db, initialData.id, data);
      }

      toast({ title: "Succes!", description: "Produsul a fost salvat." });
      router.push('/admin/produse');
    } catch (err) {
      toast({ variant: "destructive", title: "Eroare", description: "Nu s-a putut salva produsul." });
    } finally {
      setSaving(false);
    }
  };

  const labelClass = "text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest ml-1 mb-2 block";
  const inputClass = "h-12 rounded-xl bg-neutral-50 border-none focus-visible:ring-accent-lime shadow-sm";

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button type="button" variant="ghost" size="icon" className="rounded-full bg-white shadow-sm" onClick={() => router.back()}>
            <ChevronLeft size={20} />
          </Button>
          <div>
            <h1 className="font-headline font-extrabold text-3xl text-neutral-900 tracking-tighter uppercase">{mode === 'create' ? 'Adăugare' : 'Editare'} Produs</h1>
            <p className="text-neutral-400 font-medium">Gestionați detaliile utilajului agricol.</p>
          </div>
        </div>
        
        <Button 
          type="button"
          onClick={handleAiGenerate}
          disabled={generating}
          className="bg-accent-lime hover:bg-accent-lime/90 text-black font-extrabold rounded-full h-12 px-6 gap-2"
        >
          {generating ? 'SE GENEREAZĂ...' : <><Sparkles size={18} /> GENERARE AI</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Main Info */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm space-y-8 border border-neutral-100">
            <h3 className="font-headline font-extrabold text-xl tracking-tight flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-accent-lime rounded-full" /> Detalii Principale
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <div>
                <label className={labelClass}>Scurtă Descriere (Listing)</label>
                <Input value={form.shortDescription} onChange={e => set('shortDescription', e.target.value)} className={inputClass} maxLength={160} />
              </div>
              <div>
                <label className={labelClass}>Descriere Vizibilă (SEO - Pagina Produs)</label>
                <Textarea value={form.detailedDescription} onChange={e => set('detailedDescription', e.target.value)} className="min-h-[250px] rounded-2xl bg-neutral-50 border-none focus-visible:ring-accent-lime shadow-sm" placeholder="Această descriere va apărea proeminent pe pagina produsului..." />
              </div>
            </div>
          </div>

          {/* Media Gallery */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm space-y-8 border border-neutral-100">
             <h3 className="font-headline font-extrabold text-xl tracking-tight flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-accent-lime rounded-full" /> Galerie Media
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className={labelClass}>Imagine Principală (URL)</label>
                <Input value={form.mainImage} onChange={e => set('mainImage', e.target.value)} className={inputClass} placeholder="https://..." />
              </div>

              <div className="pt-4 border-t border-neutral-50">
                <label className={labelClass}>Adaugă în Galerie (URL)</label>
                <div className="flex gap-4">
                  <Input value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} className={inputClass} placeholder="https://..." />
                  <Button type="button" onClick={addImageToGallery} className="bg-neutral-900 text-white rounded-xl h-12 px-6"><Plus size={18} /></Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {galleryImages.map((url, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 group">
                    <Image src={url} alt={`Gallery ${i}`} fill className="object-cover" />
                    <button 
                      type="button" 
                      onClick={() => removeImageFromGallery(i)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm space-y-8 border border-neutral-100">
            <div className="flex justify-between items-center">
              <h3 className="font-headline font-extrabold text-xl tracking-tight flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent-lime rounded-full" /> Specificații Tehnice
              </h3>
              <Button type="button" variant="ghost" size="sm" onClick={() => setSpecs([...specs, { key: '', value: '' }])} className="text-accent-lime font-extrabold gap-2">
                <Plus size={16} /> ADAUGĂ
              </Button>
            </div>
            <div className="space-y-4">
              {specs.map((spec, i) => (
                <div key={i} className="flex gap-4">
                  <Input placeholder="Cheie (ex: Putere)" value={spec.key} onChange={e => {
                    const updated = [...specs];
                    updated[i].key = e.target.value;
                    setSpecs(updated);
                  }} className={inputClass} />
                  <Input placeholder="Valoare (ex: 150 CP)" value={spec.value} onChange={e => {
                    const updated = [...specs];
                    updated[i].value = e.target.value;
                    setSpecs(updated);
                  }} className={inputClass} />
                  <Button type="button" variant="ghost" size="icon" onClick={() => setSpecs(specs.filter((_, j) => j !== i))} className="text-red-400 hover:bg-red-50 rounded-xl shrink-0">
                    <Trash2 size={18} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-10">
          {/* Pricing & Stock */}
          <div className="bg-neutral-900 rounded-[2.5rem] p-8 text-white space-y-8 shadow-xl">
             <h3 className="font-headline font-extrabold text-xl tracking-tight">Preț & Stoc</h3>
             <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-extrabold text-white/40 uppercase tracking-widest block mb-2">Preț estimativ (RON)</label>
                  <Input type="number" value={form.price} onChange={e => set('price', e.target.value)} disabled={form.priceOnRequest} className="bg-white/5 border-none h-12 rounded-xl text-white focus-visible:ring-accent-lime" />
                </div>
                
                <div className="space-y-4 pt-2">
                  {[
                    { field: 'priceOnRequest', label: 'Preț la cerere' },
                    { field: 'inStock', label: 'Disponibil în stoc' },
                    { field: 'isNew', label: 'Produs nou' },
                    { field: 'isFeatured', label: 'Recomandat (Home)' },
                    { field: 'isOnSale', label: 'În promoție' },
                  ].map(item => (
                    <label key={item.field} className="flex items-center justify-between cursor-pointer group">
                      <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">{item.label}</span>
                      <input 
                        type="checkbox" 
                        checked={form[item.field as keyof typeof form] as boolean} 
                        onChange={e => set(item.field, e.target.checked)}
                        className="w-5 h-5 accent-accent-lime rounded-md"
                      />
                    </label>
                  ))}
                </div>
             </div>
          </div>

          {/* SEO Metadata */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-neutral-100 space-y-6">
            <h3 className="font-headline font-extrabold text-xl tracking-tight">Setări SEO</h3>
            <div className="space-y-4">
               <div>
                 <label className={labelClass}>Meta Title ({form.metaTitle.length}/60)</label>
                 <Input value={form.metaTitle} onChange={e => set('metaTitle', e.target.value)} maxLength={60} className={inputClass} />
               </div>
               <div>
                 <label className={labelClass}>Meta Description ({form.metaDescription.length}/160)</label>
                 <Textarea value={form.metaDescription} onChange={e => set('metaDescription', e.target.value)} maxLength={160} className="h-24 bg-neutral-50 border-none rounded-xl text-xs focus-visible:ring-accent-lime" />
               </div>
               <div>
                 <label className={labelClass}>Tags (virgulă)</label>
                 <Input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="tractor, john deere, nou" className={inputClass} />
               </div>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={saving}
            className="w-full bg-neutral-900 hover:bg-black text-white font-extrabold h-16 rounded-3xl flex items-center justify-between pl-10 pr-2 group shadow-2xl shadow-black/20"
          >
            {saving ? 'SE SALVEAZĂ...' : 'SALVEAZĂ PRODUSUL'}
            <div className="w-12 h-12 bg-accent-lime rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
              <Save size={20} className="text-black" />
            </div>
          </Button>
        </div>
      </div>
    </form>
  );
}
