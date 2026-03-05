'use client';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { deleteProduct } from '@/lib/firestore/products';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Edit, Trash2, ExternalLink, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';
import { collection, query, orderBy } from 'firebase/firestore';

export default function AdminProductsPage() {
  const db = useFirestore();

  // Folosim useCollection pentru a avea o lista reactiva. 
  // Orice modificare in baza de date (sau cache local) se va reflecta imediat aici.
  const productsQuery = useMemoFirebase(() => {
    return query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Ștergi produsul "${name}"?`)) return;
    
    // Apelam functia de stergere. 
    // Fiind non-blocking, UI-ul va reactiona imediat daca stergerea este pornita.
    deleteProduct(db, id);
    
    toast({ 
      title: "Acțiune inițiată", 
      description: `Cererea de ștergere pentru ${name} a fost trimisă.` 
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-headline font-extrabold text-4xl text-neutral-900 tracking-tighter uppercase">Catalog Produse</h1>
          <p className="text-neutral-400 font-medium">Gestionați toate utilajele agricole disponibile.</p>
        </div>
        <Link href="/admin/produse/nou">
          <Button className="bg-accent-lime hover:bg-accent-lime/90 text-black font-extrabold rounded-2xl h-14 pl-8 pr-2 group transition-all">
            ADĂUGARE PRODUS
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center ml-6 transition-transform group-hover:rotate-90">
              <Plus size={20} className="text-black" />
            </div>
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-neutral-100">
        <Table>
          <TableHeader className="bg-neutral-50">
            <TableRow className="border-b border-neutral-100 h-16 hover:bg-transparent">
              <TableHead className="pl-8 text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">Imagine</TableHead>
              <TableHead className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">Produs</TableHead>
              <TableHead className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">Categorie</TableHead>
              <TableHead className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">Preț</TableHead>
              <TableHead className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">Status</TableHead>
              <TableHead className="pr-8 text-right text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">Acțiuni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin text-accent-lime" size={32} />
                    <span className="text-neutral-300 font-bold uppercase tracking-widest text-xs">Se încarcă catalogul...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : !products || products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center text-neutral-300 font-bold uppercase tracking-widest text-xs">Niciun produs găsit.</TableCell>
              </TableRow>
            ) : products.map((product) => (
              <TableRow key={product.id} className="hover:bg-neutral-50/50 transition-colors border-b border-neutral-50">
                <TableCell className="pl-8 py-4">
                  <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-100">
                    {product.mainImage ? (
                      <Image src={product.mainImage} alt={product.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-300">
                        <Plus size={16} />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-headline font-bold text-sm text-neutral-900">{product.name}</div>
                  <div className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">{product.brand}</div>
                </TableCell>
                <TableCell>
                  <span className="text-[10px] font-extrabold bg-neutral-100 px-3 py-1 rounded-full uppercase tracking-widest text-neutral-500">
                    {product.category}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="font-headline font-bold text-sm">
                    {product.priceOnRequest ? "LA CERERE" : `${product.price.toLocaleString()} RON`}
                  </div>
                </TableCell>
                <TableCell>
                  {product.inStock ? (
                    <span className="text-[9px] font-extrabold text-green-700 bg-green-50 px-2 py-1 rounded uppercase">ÎN STOC</span>
                  ) : (
                    <span className="text-[9px] font-extrabold text-red-700 bg-red-50 px-2 py-1 rounded uppercase">STOC EPUIZAT</span>
                  )}
                </TableCell>
                <TableCell className="pr-8 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/produse/${product.slug}`} target="_blank">
                      <Button size="icon" variant="ghost" title="Vezi pe site" className="rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all"><ExternalLink size={18} /></Button>
                    </Link>
                    <Link href={`/admin/produse/${product.id}`}>
                      <Button size="icon" variant="ghost" title="Editează" className="rounded-xl hover:bg-accent-lime hover:text-black transition-all"><Edit size={18} /></Button>
                    </Link>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      title="Șterge"
                      className="rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
                      onClick={() => handleDelete(product.id, product.name)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
