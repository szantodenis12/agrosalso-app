'use client';
import { useState, useMemo } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Product } from '@/types';

export interface ProductFilters {
  category?: string;
  inStock?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  searchQuery?: string;
}

/**
 * Hook optimizat pentru gestionarea produselor.
 * Încarcă toate produsele o singură dată și aplică filtrarea/sortarea local pentru viteză maximă.
 * Include gestionarea erorilor de conexiune.
 */
export function useProducts() {
  const db = useFirestore();
  const [filters, setFilters] = useState<ProductFilters>({});
  const [sort, setSort] = useState<string>('oldest');

  // Interogare stabilă: aducem toate produsele ordonate după dată
  const productsQuery = useMemoFirebase(() => {
    return query(collection(db, 'products'), orderBy('createdAt', 'asc'));
  }, [db]);

  const { data: rawProducts, isLoading, error } = useCollection<Product>(productsQuery);

  // Filtrarea și sortarea se întâmplă instantaneu pe client
  const filteredAndSortedProducts = useMemo(() => {
    if (!rawProducts) return [];
    
    let result = [...rawProducts];

    // 1. Filtrare după Categorie
    if (filters.category && filters.category !== 'toate') {
      result = result.filter(p => p.category === filters.category);
    }

    // 2. Filtrare după Status
    if (filters.inStock) {
      result = result.filter(p => p.inStock === true);
    }
    if (filters.isNew) {
      result = result.filter(p => p.isNew === true);
    }
    if (filters.isOnSale) {
      result = result.filter(p => p.isOnSale === true);
    }

    // 3. Căutare Text
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) ||
        p.shortDescription?.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    // 4. Sortare
    result.sort((a, b) => {
      switch (sort) {
        case 'price_asc':
          const priceA = a.priceOnRequest ? 999999999 : a.price;
          const priceB = b.priceOnRequest ? 999999999 : b.price;
          return priceA - priceB;
        case 'price_desc':
          const pA = a.priceOnRequest ? -1 : a.price;
          const pB = b.priceOnRequest ? -1 : b.price;
          return pB - pA;
        case 'name_asc':
          return a.name.localeCompare(b.name, 'ro');
        case 'newest': {
          const getTime = (val: any) => {
            if (!val) return 0;
            if (val.toMillis) return val.toMillis();
            if (val.seconds) return val.seconds * 1000;
            return new Date(val).getTime();
          };
          return getTime(b.createdAt) - getTime(a.createdAt);
        }
        default: // 'oldest' - ordinea naturală a interogării
          return 0;
      }
    });

    return result;
  }, [rawProducts, filters, sort]);

  const updateFilter = (key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({});
    setSort('oldest');
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== undefined && v !== '' && v !== false).length;

  return {
    products: filteredAndSortedProducts,
    isLoading, 
    error, // Expunem eroarea pentru a fi gestionată în UI
    filters,
    sort,
    setSort,
    updateFilter,
    resetFilters,
    activeFilterCount
  };
}
