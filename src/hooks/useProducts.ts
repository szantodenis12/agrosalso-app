'use client';
import { useState, useEffect, useMemo } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, QueryConstraint } from 'firebase/firestore';
import { Product, ProductCategory } from '@/types';

export interface ProductFilters {
  category?: string;
  inStock?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  searchQuery?: string;
}

export function useProducts() {
  const db = useFirestore();
  const [filters, setFilters] = useState<ProductFilters>({});
  const [sort, setSort] = useState<string>('newest');

  // Firestore-side filtering constraints
  const constraints = useMemo(() => {
    const arr: QueryConstraint[] = [];
    if (filters.category && filters.category !== 'toate') {
      arr.push(where('category', '==', filters.category));
    }
    if (filters.inStock) {
      arr.push(where('inStock', '==', true));
    }
    if (filters.isNew) {
      arr.push(where('isNew', '==', true));
    }
    if (filters.isOnSale) {
      arr.push(where('isOnSale', '==', true));
    }
    arr.push(orderBy('createdAt', 'desc'));
    return arr;
  }, [filters]);

  const productsQuery = useMemoFirebase(() => {
    return query(collection(db, 'products'), ...constraints);
  }, [db, constraints]);

  const { data: rawProducts, isLoading, error } = useCollection<Product>(productsQuery);

  // Client-side filtering (Search) and Sorting
  const filteredAndSortedProducts = useMemo(() => {
    if (!rawProducts) return [];
    
    let result = [...rawProducts];

    // Search filter
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      switch (sort) {
        case 'price_asc':
          return (a.priceOnRequest ? 9999999 : a.price) - (b.priceOnRequest ? 9999999 : b.price);
        case 'price_desc':
          return (b.priceOnRequest ? 0 : b.price) - (a.priceOnRequest ? 0 : a.price);
        case 'name_asc':
          return a.name.localeCompare(b.name);
        default: // newest
          return 0; // Already sorted by Firestore
      }
    });

    return result;
  }, [rawProducts, filters.searchQuery, sort]);

  const updateFilter = (key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({});
    setSort('newest');
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== undefined && v !== '' && v !== false).length;

  return {
    products: filteredAndSortedProducts,
    isLoading,
    error,
    filters,
    sort,
    setSort,
    updateFilter,
    resetFilters,
    activeFilterCount
  };
}
