
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { ChevronLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const db = useFirestore();

  const [form, setForm] = useState({
    name: '',
    slug: '',
    brand: '',
    brandSlug: '',
    category: 'tractoare',
    shortDescription: '',
    description: '',
    price: 0,
    priceOnRequest: false,
    mainImage: 'https://picsum.photos/seed/new_machine/800/600',
    inStock: true,
  });

  const generateSlug = (name: string) => {
    return name.toLowerCase().trim().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, '-');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const slug = form.slug || generateSlug(form.name);
      await addDoc(collection(db, 'products'), {
        ...form,
        slug,
        brandSlug: generateSlug(form.brand),
        currency: 'RON',
        images: [form.mainImage],
        specifications: {},
        stockQuantity: form.inStock ? 1 : 0,
        isNew: true,
        isFeatured: false,
        isOnSale: false,
        salePercent: 0,
        tags: [form.category, form.brand.toLowerCase()],
        metaTitle: `${form.name} - AgroSalso`,
        metaDescription: form.shortDescription,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast({ title: "Produs adăugat", description: "Produsul a fost salvat cu succes în catalog." });
      router.push('/admin/produse');
    } catch (error) {
      toast({ variant: "destructive", title: "Eroare", description: "Nu s-a putut salva produsul." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/produse">
          <Button variant="ghost" size="icon" className="rounded-full bg-white shadow-sm"><ChevronLeft size={20} /></Button>
        </Link>
        <div>
          <h1 className="font-headline font-extrabold text-3xl text-neutral-900 tracking-tighter uppercase">Adăugare Produs</h1>
          <p className="text-neutral-400 font-medium">Introduceți detaliile noului utilaj.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="bg-white rounded-[2.5rem] border-none shadow-sm overflow-hidden">
          <CardContent className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest ml-1">Nume Produs</label>
                <Input 
                  value={form.name} 
                  onChange={(e) => setForm({...form, name: e.target.value})} 
                  placeholder="Ex: John Deere 6R 150" 
                  required
                  className="h-12 rounded-xl bg-neutral-50 border-none focus-visible:ring-accent-lime"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest ml-1">Marcă</label>
                <Input 
                  value={form.brand} 
                  onChange={(e) => setForm({...form, brand: e.target.value})} 
                  placeholder="Ex: John Deere" 
                  required
                  className="h-12 rounded-xl bg-neutral-50 border-none focus-visible:ring-accent-lime"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest ml-1">Categorie</label>
                <select 
                  className="w-full h-12 rounded-xl bg-neutral-50 border-none px-4 text-sm font-medium focus:ring-2 focus:ring-accent-lime outline-none"
                  value={form.category}
                  onChange={(e) => setForm({...form, category: e.target.value})}
                >
                  <option value="tractoare">Tractoare</option>
                  <option value="combine">Combine</option>
                  <option value="irigatii">Irigații</option>
                  <option value="semanatori">Semănători</option>
                  <option value="pluguri">Pluguri</option>
                  <option value="sprayere">Sprayere</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest ml-1">Preț (RON)</label>
                <Input 
                  type="number"
                  value={form.price} 
                  onChange={(e) => setForm({...form, price: Number(e.target.value)})} 
                  placeholder="0" 
                  required={!form.priceOnRequest}
                  disabled={form.priceOnRequest}
                  className="h-12 rounded-xl bg-neutral-50 border-none focus-visible:ring-accent-lime"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest ml-1">Scurtă Descriere</label>
              <Input 
                value={form.shortDescription} 
                onChange={(e) => setForm({...form, shortDescription: e.target.value})} 
                placeholder="Rezumat pentru listare..." 
                required
                className="h-12 rounded-xl bg-neutral-50 border-none focus-visible:ring-accent-lime"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest ml-1">Descriere Completă</label>
              <Textarea 
                value={form.description} 
                onChange={(e) => setForm({...form, description: e.target.value})} 
                placeholder="Detalii tehnice și descriere amănunțită..." 
                className="min-h-[150px] rounded-2xl bg-neutral-50 border-none focus-visible:ring-accent-lime"
              />
            </div>

            <div className="flex gap-6 items-center">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={form.priceOnRequest}
                  onChange={(e) => setForm({...form, priceOnRequest: e.target.checked})}
                  className="w-5 h-5 accent-accent-lime rounded-md"
                />
                <span className="text-sm font-bold text-neutral-600 group-hover:text-black transition-colors">Preț la cerere</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={form.inStock}
                  onChange={(e) => setForm({...form, inStock: e.target.checked})}
                  className="w-5 h-5 accent-accent-lime rounded-md"
                />
                <span className="text-sm font-bold text-neutral-600 group-hover:text-black transition-colors">Disponibil în stoc</span>
              </label>
            </div>

            <div className="pt-6 border-t border-neutral-100 flex justify-end">
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-neutral-900 hover:bg-black text-white font-extrabold h-14 pl-10 pr-2 rounded-2xl group transition-all"
              >
                {loading ? 'SE SALVEAZĂ...' : 'SALVEAZĂ PRODUSUL'}
                <div className="w-10 h-10 bg-accent-lime rounded-full flex items-center justify-center ml-10 transition-transform group-hover:scale-110">
                  <Save size={18} className="text-black" />
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
