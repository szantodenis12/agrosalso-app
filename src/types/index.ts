
export type ProductCategory = 
  | 'terradisc'
  | 'combinator'
  | 'gruber'
  | 'distribuitor-ingrasamant'
  | 'freza-pamant'
  | 'plug'
  | 'semanatoare-paioase'
  | 'masina-plantat-usturoi'
  | 'tavalug-neted'
  | 'scalificator'
  | 'masina-recoltat'
  | 'tocatoare-resturi'
  | 'instalatie-erbicidat'
  | 'plantator-cartofi'
  | 'cultivator-prasitoare'
  | 'altele';

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  brandSlug: string;
  category: ProductCategory;
  subcategory?: string;
  description: string;
  detailedDescription: string; // Nou: Conținut SEO bogat
  shortDescription: string;
  price: number;
  priceOnRequest: boolean;
  currency: 'RON';
  images: string[];
  mainImage: string;
  specifications: Record<string, string>;
  inStock: boolean;
  stockQuantity: number;
  isNew: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  salePercent?: number;
  tags: string[];
  relatedProducts?: string[];
  metaTitle: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  productCount: number;
  order: number;
  isActive: boolean;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  isPartner: boolean;
  order: number;
}
