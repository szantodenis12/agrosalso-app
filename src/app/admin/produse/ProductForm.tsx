
'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useFirestore, useStorage } from '@/firebase';
import { addProduct, updateProduct } from '@/lib/firestore/products';
import { uploadImage } from '@/lib/firebase/storage';
import { Product, ProductCategory, SpecTable, SpecTableRow } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Save, ChevronLeft, Trash2, Plus, Image as ImageIcon, X, Upload, Loader2, Table as TableIcon, Star, Info, ShieldCheck } from 'lucide-react';
import { adminProductDescriptionGenerator } from '@/ai/flows/admin-product-description-generator';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import { Checkbox } from '@/components/ui/checkbox';

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
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Stările pentru imagini
  const [galleryImages, setGalleryImages] = useState<string[]>(initialData?.images?.filter(img => img !== initialData?.mainImage) ?? []);
  const [mainImage, setMainImage] = useState<string>(initialData?.mainImage ?? '');

  // Stare pentru Tabelul Tehnic (Modele)
  const [specTable, setSpecTable] = useState<SpecTable>(
    initialData?.specTable ?? {
      headers: ['MODEL', 'LĂȚIME', 'VITEZĂ', 'EFICIENȚĂ', 'NR. DISCURI', 'PUTERE NECESARĂ'],
      rows: [],
      footerNote: '*Puterea necesară depinde de tipul de tăvălug utilizat.'
    }
  );

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
    whyBrand: initialData?.whyBrand ?? '',
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

  const handleMainImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!storage) {
      toast({ variant: "destructive", title: "Eroare Storage", description: "Serviciul de stocare nu este disponibil." });
      return;
    }

    setUploadingMain(true);
    try {
      const url = await uploadImage(storage, file);
      setMainImage(url);
      toast({ title: "Imagine încărcată", description: "Poza principală a fost salvată." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Eroare upload", description: error.message || "Nu s-a putut încărca imaginea." });
    } finally {
      setUploadingMain(false);
      if (mainImageInputRef.current) mainImageInputRef.current.value = '';
    }
  };

  const handleGalleryFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    if (!storage) {
      toast({ variant: "destructive", title: "Eroare Storage", description: "Serviciul de stocare nu este disponibil." });
      return;
    }

    setUploadingGallery(true);
    try {
      const uploadPromises = files.map(file => uploadImage(storage, file));
      const urls = await Promise.all(uploadPromises);
      setGalleryImages(prev => [...prev, ...urls]);
      toast({ title: "Galerie actualizată", description: `Au fost încărcate ${urls.length} imagini.` });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Eroare upload", description: "Unele imagini nu s-au putut încărca." });
    } finally {
      setUploadingGallery(false);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

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

  const removeImageFromGallery = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  // Logica Tabel Modele
  const addTableHeader = () => {
    setSpecTable(prev => ({
      ...prev,
      headers: [...prev.headers, 'COLOANĂ NOUĂ'],
      rows: prev.rows.map(row => ({ ...row, values: [...row.values, ''] }))
    }));
  };

  const removeTableHeader = (index: number) => {
    setSpecTable(prev => ({
      ...prev,
      headers: prev.headers.filter((_, i) => i !== index),
      rows: prev.rows.map(row => ({ ...row, values: row.values.filter((_, i) => i !== index) }))
    }));
  };

  const updateHeader = (index: number, val: string) => {
    const next = [...specTable.headers];
    next[index] = val;
    setSpecTable({ ...specTable, headers: next });
  };

  const addTableRow = () => {
    setSpecTable(prev => ({
      ...prev,
      rows: [...prev.rows, { values: prev.headers.map(() => ''), isPopular: false }]
    }));
  };

  const updateRowValue = (rowIndex: number, colIndex: number, val: string) => {
    const nextRows = [...specTable.rows];
    nextRows[rowIndex].values[colIndex] = val;
    setSpecTable({ ...specTable, rows: nextRows });
  };

  const updateRowStatus = (rowIndex: number, field: keyof SpecTableRow, val: any) => {
    const nextRows = [...specTable.rows];
    (nextRows[rowIndex] as any)[field] = val;
    setSpecTable({ ...specTable, rows: nextRows });
  };

  const removeTableRow = (index: number) => {
    setSpecTable(prev => ({
      ...prev,
      rows: prev.rows.filter((_, i) => i !== index)
    }));
  };

  const handleAiGenerate = async () => {
    if (!form.name || !form.brand) {
      toast({ variant: "destructive", title: "Lipsesc date", description: "Vă rugăm introduceți numele și marca pentru a folosi AI-ul." });
      return;
    }
    setGenerating(true);
    try {
      const response = await adminProductDescriptionGenerator({
        productName: form.name,
        brandName: form.brand,
        categoryName: form.category,
      });

      set('shortDescription', response.shortDescription);
      set('detailedDescription', response.detailedDescription);
      set('whyBrand', response.whyBrand);
      set('metaDescription', response.shortDescription);
      set('metaTitle', `${form.name} | AgroSalso România`);
      
      toast({ title: "Conținut generat!", description: "AI-ul a creat descrierile și secțiunea de brand." });
    } catch (error) {
      toast({ variant: "destructive", title: "Eroare AI", description: "Nu s-a putut genera conținutul." });
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainImage && mode === 'create') {
      toast({ variant: "destructive", title: "Lipsă imagine", description: "Vă rugăm încărcați o imagine principală." });
      return;
    }

    setSaving(true);
    try {
      const finalImages = [mainImage, ...galleryImages.filter(img => img !== mainImage)];

      const data = {
        ...form,
        mainImage,
        brandSlug: generateSlug(form.brand),
        price: parseFloat(form.price) || 0,
        stockQuantity: parseInt(form.stockQuantity) || 0,
        salePercent: parseInt(form.salePercent) || 0,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        specTable: specTable.rows.length > 0 ? specTable : null,
        currency: 'RON' as const,
        images: finalImages,
      };

      if (mode === 'create') {
        await addProduct(db, data);
      } else if (initialData?.id) {
        await updateProduct(db, initialData.id, data);
      }

      toast({ title: "Succes!", description: "Produsul a fost salvat." });
      router.push('/admin/produse');
    } catch (err: any) {
      toast({ variant: "destructive", title: "Eroare", description: "Nu s-a putut salva produsul." });
    } finally {
      setSaving(false);
    }
  };

  const labelClass = "text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest ml-1 mb-2 block";
  const inputClass = "h-12 rounded-xl bg-neutral-50 border-none focus-visible:ring-accent-lime shadow-sm";

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-10 pb-20">
      <input type="file" ref={mainImageInputRef} onChange={handleMainImageFile} accept="image/*" className="hidden" />
      <input type="file" ref={galleryInputRef} onChange={handleGalleryFiles} accept="image/*" multiple className="hidden" />

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
                <Textarea value={form.detailedDescription} onChange={e => set('detailedDescription', e.target.value)} className="min-h-[250px] rounded-2xl bg-neutral-50 border-none focus-visible:ring-accent-lime shadow-sm" placeholder="Această descriere va apărea proeminent pe pagina produsului..." />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm space-y-8 border border-neutral-100">
             <h3 className="font-headline font-extrabold text-xl tracking-tight flex items-center gap-2 text-accent-lime">
              <ShieldCheck size={22} /> Secțiunea Brand (De ce {form.brand || 'Marca'}?)
            </h3>
            <div className="space-y-4">
               <label className={labelClass}>Argumente Brand & Fiabilitate</label>
               <Textarea 
                value={form.whyBrand} 
                onChange={e => set('whyBrand', e.target.value)} 
                className="min-h-[200px] rounded-2xl bg-neutral-50 border-none focus-visible:ring-accent-lime shadow-sm text-sm" 
                placeholder="Explică de ce acest producător este o alegere sigură pentru fermieri..." 
               />
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm space-y-8 border border-neutral-100">
             <h3 className="font-headline font-extrabold text-xl tracking-tight flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-accent-lime rounded-full" /> Galerie Media
            </h3>
            
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <label className={labelClass}>Imagine Principală</label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    disabled={uploadingMain}
                    onClick={() => mainImageInputRef.current?.click()}
                    className="w-full h-14 border-dashed border-2 rounded-2xl flex items-center justify-center gap-3 hover:border-accent-lime hover:bg-accent-lime/5 transition-all"
                  >
                    {uploadingMain ? <Loader2 className="animate-spin" /> : <Upload size={18} />}
                    {uploadingMain ? 'SE ÎNCARCĂ...' : 'ÎNCARCĂ POZĂ PRINCIPALĂ'}
                  </Button>
                </div>
                {mainImage ? (
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-100">
                    <Image src={mainImage} alt="Main Preview" fill className="object-cover" />
                  </div>
                ) : (
                  <div className="aspect-video rounded-2xl bg-neutral-50 border border-dashed border-neutral-200 flex flex-col items-center justify-center text-neutral-300">
                    <ImageIcon size={32} strokeWidth={1} />
                    <span className="text-[10px] font-bold mt-2">NICIO IMAGINE</span>
                  </div>
                )}
              </div>

              <div className="pt-8 border-t border-neutral-50">
                <div className="flex justify-between items-center mb-6">
                  <label className={labelClass}>Alte Imagini ({galleryImages.length})</label>
                  <Button 
                    type="button" 
                    size="sm"
                    disabled={uploadingGallery}
                    onClick={() => galleryInputRef.current?.click()}
                    className="bg-neutral-900 text-white rounded-full h-10 px-5 gap-2"
                  >
                    {uploadingGallery ? <Loader2 className="animate-spin size-4" /> : <Plus size={16} />}
                    ADAUGĂ POZE
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                  {galleryImages.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-neutral-50 border border-neutral-100 group">
                      <Image src={url} alt={`Gallery ${i}`} fill className="object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removeImageFromGallery(i)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {uploadingGallery && (
                    <div className="aspect-square rounded-xl bg-neutral-50 border border-dashed border-neutral-200 flex items-center justify-center">
                      <Loader2 className="animate-spin text-neutral-300" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm space-y-8 border border-neutral-100 overflow-hidden">
            <div className="flex justify-between items-center">
              <h3 className="font-headline font-extrabold text-xl tracking-tight flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent-lime rounded-full" /> Tabel Modele (Variantă PDF/Site)
              </h3>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={addTableHeader} className="rounded-xl border-2 font-bold text-[10px] uppercase">
                  Adaugă Coloană
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={addTableRow} className="text-accent-lime font-extrabold gap-2">
                  <Plus size={16} /> ADAUGĂ RÂND
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto pb-4 custom-scrollbar">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-neutral-900 text-white">
                    {specTable.headers.map((header, i) => (
                      <th key={i} className="p-3 text-left min-w-[120px] relative group/header">
                        <Input 
                          value={header} 
                          onChange={e => updateHeader(i, e.target.value)} 
                          className="bg-transparent border-none text-white text-[10px] font-extrabold uppercase p-0 h-auto focus-visible:ring-0"
                        />
                        <button 
                          type="button" 
                          onClick={() => removeTableHeader(i)}
                          className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 opacity-0 group-hover/header:opacity-100 transition-opacity"
                        >
                          <X size={10} />
                        </button>
                      </th>
                    ))}
                    <th className="p-3 w-20"></th>
                    <th className="p-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {specTable.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className={row.isPopular ? "bg-accent-lime/5" : ""}>
                      {row.values.map((val, colIndex) => (
                        <td key={colIndex} className="p-2">
                          <Input 
                            value={val} 
                            onChange={e => updateRowValue(rowIndex, colIndex, e.target.value)}
                            className="bg-transparent border-none text-xs font-bold focus-visible:ring-0 h-8"
                          />
                        </td>
                      ))}
                      <td className="p-2 text-center">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Checkbox checked={row.isPopular} onCheckedChange={v => updateRowStatus(rowIndex, 'isPopular', !!v)} />
                          <span className="text-[8px] font-bold uppercase">Popular</span>
                        </label>
                      </td>
                      <td className="p-2">
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeTableRow(rowIndex)} className="h-8 w-8 text-red-400">
                          <Trash2 size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="pt-4 border-t border-neutral-50">
              <label className={labelClass}>Notă Subsol Tabel</label>
              <Input 
                value={specTable.footerNote} 
                onChange={e => setSpecTable({...specTable, footerNote: e.target.value})} 
                className={inputClass} 
              />
            </div>
          </div>
        </div>

        <div className="space-y-10">
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
                 <Input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="tractor, nou" className={inputClass} />
               </div>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={saving || uploadingMain || uploadingGallery}
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
