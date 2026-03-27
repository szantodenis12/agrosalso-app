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

export interface Certificate {
  id: string;
  number: string;
  date: string;
  inquiryId?: string;
  productId: string;
  productName: string;
  beneficiar: {
    name: string;
    address: string;
    regCom: string;
    cui: string;
    bank: string;
    iban: string;
    representative: string;
    position: string;
  };
  obiect: {
    name: string;
    serialNumber: string;
  };
  factura: {
    series: string;
    number: string;
    date: string;
  };
  emitent: {
    name: string;
    regCom: string;
    cui: string;
    address: string;
    workPoint: string;
    bank: string;
    iban: string;
    representative: string;
  };
  createdAt: any;
}

export interface Contract {
  id: string;
  number: string;
  date: string;
  inquiryId?: string;
  productId: string;
  productName: string;
  beneficiar: {
    name: string;
    address: string;
    regCom: string;
    cui: string;
    bank: string;
    iban: string;
    representative: string;
    position: string;
  };
  obiect: {
    name: string;
    serialNumber: string;
    quantity: number;
    unitPrice: number;
    vatRate: number;
    totalPrice: number;
    totalPriceWithVat: number;
  };
  termeni: {
    deliveryDate: string;
    paymentDate: string;
    warrantyMonths: number;
    invoiceSeries: string;
    invoiceNumber: string;
  };
  emitent: {
    name: string;
    regCom: string;
    cui: string;
    address: string;
    workPoint: string;
    bank: string;
    iban: string;
    representative: string;
  };
  createdAt: any;
}

export interface Warranty {
  id: string;
  number: string;
  date: string;
  inquiryId?: string;
  productId: string;
  productName: string;
  beneficiar: {
    name: string;
    address: string;
    regCom: string;
    cui: string;
    bank: string;
    iban: string;
    representative: string;
    position: string;
  };
  obiect: {
    name: string;
    serialNumber: string;
  };
  factura: {
    series: string;
    number: string;
    date: string;
  };
  garantie: {
    startDate: string;
    endDate: string;
    months: number;
  };
  emitent: {
    name: string;
    address: string;
    workPoint: string;
    cui: string;
    regCom: string;
    bank: string;
    iban: string;
    representative: string;
  };
  createdAt: any;
}

export interface Reception {
  id: string;
  number: string;
  date: string;
  inquiryId?: string;
  productId: string;
  productName: string;
  contract: {
    number: string;
    date: string;
  };
  beneficiar: {
    name: string;
    address: string;
    regCom: string;
    cui: string;
    bank: string;
    iban: string;
    representative: string;
    position: string;
  };
  obiect: {
    name: string;
    serialNumber: string;
    quantity: number;
    totalPriceWithVat: number;
  };
  factura: {
    series: string;
    number: string;
    date: string;
  };
  delegat: {
    furnizor: string;
    beneficiar: string;
  };
  emitent: {
    name: string;
    regCom: string;
    cui: string;
    address: string;
    representative: string;
  };
  createdAt: any;
}
