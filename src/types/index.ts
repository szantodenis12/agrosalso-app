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

export interface SpecTableRow {
  values: string[];
  isPopular?: boolean;
  note?: string;
}

export interface SpecTable {
  headers: string[];
  rows: SpecTableRow[];
  footerNote?: string;
}

export interface ProductTranslation {
  name?: string;
  shortDescription?: string;
  description?: string;
  detailedDescription?: string;
  whyBrand?: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  brandSlug: string;
  category: ProductCategory;
  subcategory?: string;
  description: string;
  detailedDescription: string;
  shortDescription: string;
  whyBrand?: string[];
  price: number;
  priceOnRequest: boolean;
  currency: 'EUR';
  images: string[];
  mainImage: string;
  specifications: Record<string, string>;
  specTable?: SpecTable;
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
  translations?: {
    [key: string]: ProductTranslation;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
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

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  productId: string;
  productName: string;
  selectedModel?: string;
  status: 'new' | 'read' | 'replied';
  createdAt: any;
  repliedAt?: any;
  offerId?: string;
}
