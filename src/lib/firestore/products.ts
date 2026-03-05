'use client';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  orderBy, 
  serverTimestamp,
  type Firestore,
  type QueryConstraint,
  where
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Product } from '@/types';

export interface ProductFilters {
  category?: string;
  brand?: string;
  inStock?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
}

/**
 * Fetches products based on filters.
 */
export async function getProducts(db: Firestore, filters?: ProductFilters): Promise<Product[]> {
  const constraints: QueryConstraint[] = [];

  if (filters?.category && filters.category !== 'toate') {
    constraints.push(where('category', '==', filters.category));
  }
  if (filters?.isFeatured === true) {
    constraints.push(where('isFeatured', '==', true));
  }

  constraints.push(orderBy('createdAt', 'desc'));

  const q = query(collection(db, 'products'), ...constraints);
  try {
    const snapshot = await getDocs(q);
    let products = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));

    // Client-side filtering for search
    if (filters?.searchQuery) {
      const search = filters.searchQuery.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.brand.toLowerCase().includes(search) ||
        p.shortDescription?.toLowerCase().includes(search)
      );
    }

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

/**
 * Adds a new product to Firestore.
 */
export async function addProduct(db: Firestore, data: any) {
  return addDoc(collection(db, 'products'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Updates an existing product.
 */
export async function updateProduct(db: Firestore, id: string, data: any) {
  const docRef = doc(db, 'products', id);
  return updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Deletes a product.
 * Uses a non-blocking pattern internally to ensure UI responsiveness.
 */
export function deleteProduct(db: Firestore, id: string) {
  const docRef = doc(db, 'products', id);
  
  // Initiem stergerea fara await pentru a permite cache-ului local sa updateze UI-ul instant
  deleteDoc(docRef).catch(async (err) => {
    // Daca esueaza (ex: permisiuni), emitem eroarea pentru a fi captata de listener-ul global
    errorEmitter.emit('permission-error', new FirestorePermissionError({
      path: docRef.path,
      operation: 'delete'
    }));
  });
}
