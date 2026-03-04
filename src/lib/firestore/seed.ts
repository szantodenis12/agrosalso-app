
'use client';
import { doc, setDoc, serverTimestamp, type Firestore } from 'firebase/firestore';

const CATEGORIES = [
  { id: 'tractoare', name: 'Tractoare', slug: 'tractoare', icon: '🚜', order: 1, productCount: 45, isActive: true, description: 'Tractoare performante pentru orice fermă.' },
  { id: 'combine', name: 'Combine', slug: 'combine', icon: '🌾', order: 2, productCount: 12, isActive: true, description: 'Combine de recoltat de înaltă eficiență.' },
  { id: 'irigatii', name: 'Irigații', slug: 'irigatii', icon: '💧', order: 3, productCount: 8, isActive: true, description: 'Sisteme de irigații inteligente.' },
  { id: 'semanatori', name: 'Semănători', slug: 'semanatori', icon: '🌱', order: 4, productCount: 15, isActive: true, description: 'Semănat precis pentru recolte bogate.' },
  { id: 'pluguri', name: 'Pluguri', slug: 'pluguri', icon: '⛏️', order: 5, productCount: 22, isActive: true, description: 'Soluții pentru prelucrarea solului.' },
  { id: 'sprayere', name: 'Sprayere', slug: 'sprayere', icon: '🧪', order: 6, productCount: 9, isActive: true, description: 'Protecția plantelor la cel mai înalt nivel.' },
];

const BRANDS = [
  { id: 'john-deere', name: 'John Deere', slug: 'john-deere', logo: '', description: 'Lider mondial în utilaje', isPartner: true, order: 1 },
  { id: 'claas', name: 'CLAAS', slug: 'claas', logo: '', description: 'Performanță germană', isPartner: true, order: 2 },
  { id: 'new-holland', name: 'New Holland', slug: 'new-holland', logo: '', description: 'Inovație în agricultură', isPartner: true, order: 3 },
  { id: 'case-ih', name: 'Case IH', slug: 'case-ih', logo: '', description: 'Putere pură', isPartner: true, order: 4 },
];

const PRODUCTS = [
  {
    id: 'john-deere-6r-150',
    name: 'John Deere 6R 150',
    slug: 'john-deere-6r-150',
    brand: 'John Deere',
    brandSlug: 'john-deere',
    category: 'tractoare',
    description: 'Un tractor versatil și puternic, perfect pentru ferme medii și mari.',
    shortDescription: 'Tractor John Deere 6R 150 cu transmisie AutoPower și tehnologie de ultimă oră.',
    price: 145000,
    priceOnRequest: false,
    currency: 'RON',
    images: ['https://picsum.photos/seed/10/800/600'],
    mainImage: 'https://picsum.photos/seed/10/800/600',
    specifications: { 'Putere': '150 CP', 'Transmisie': 'AutoPower IVT' },
    inStock: true,
    stockQuantity: 2,
    isNew: true,
    isFeatured: true,
    isOnSale: false,
    tags: ['tractor', '6r', 'john deere'],
    metaTitle: 'John Deere 6R 150 - AgroSalso',
    metaDescription: 'Cumpără tractorul John Deere 6R 150 de la AgroSalso.',
  },
  {
    id: 'claas-lexion-6600',
    name: 'CLAAS Lexion 6600',
    slug: 'claas-lexion-6600',
    brand: 'CLAAS',
    brandSlug: 'claas',
    category: 'combine',
    description: 'Combină de recoltat de înaltă performanță pentru cereale.',
    shortDescription: 'CLAAS Lexion 6600 cu sistem APS Synflow Walker.',
    price: 320000,
    priceOnRequest: true,
    currency: 'RON',
    images: ['https://picsum.photos/seed/20/800/600'],
    mainImage: 'https://picsum.photos/seed/20/800/600',
    specifications: { 'Putere': '408 CP', 'Buncăr': '11000 L' },
    inStock: true,
    stockQuantity: 1,
    isNew: false,
    isFeatured: true,
    isOnSale: true,
    salePercent: 10,
    tags: ['combina', 'claas'],
    metaTitle: 'CLAAS Lexion 6600 - AgroSalso',
    metaDescription: 'Combină CLAAS Lexion 6600 disponibilă la cerere.',
  }
];

export async function seedDatabase(db: Firestore) {
  console.log('Starting seed...');

  for (const cat of CATEGORIES) {
    await setDoc(doc(db, 'categories', cat.id), { ...cat, createdAt: serverTimestamp() });
  }

  for (const brand of BRANDS) {
    await setDoc(doc(db, 'brands', brand.id), { ...brand, createdAt: serverTimestamp() });
  }

  for (const product of PRODUCTS) {
    await setDoc(doc(db, 'products', product.id), { 
      ...product, 
      createdAt: serverTimestamp(), 
      updatedAt: serverTimestamp() 
    });
  }

  await setDoc(doc(db, 'siteConfig', 'main'), {
    companyName: 'AgroSalso SRL',
    phone: '+40 751 234 567',
    email: 'office@agrosalso.ro',
    address: 'Madaras, Bihor',
    updatedAt: serverTimestamp()
  });

  console.log('Seed completed!');
}
