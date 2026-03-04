
'use client';
import { use, useEffect, useState } from 'react';
import { useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import ProductForm from '../ProductForm';
import { Product } from '@/types';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const db = useFirestore();

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, 'products', id));
      if (snap.exists()) {
        setProduct({ id: snap.id, ...snap.data() } as Product);
      }
      setLoading(false);
    }
    load();
  }, [db, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent-lime border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return <div className="p-10 text-center text-neutral-400 font-bold">Produsul nu a fost găsit.</div>;
  }

  return (
    <div className="space-y-8">
      <ProductForm mode="edit" initialData={product} />
    </div>
  );
}
