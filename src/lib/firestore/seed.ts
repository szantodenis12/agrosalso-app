
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

const PRODUCTS = [
  {
    id: 'john-deere-6r-150',
    name: 'John Deere 6R 150',
    slug: 'john-deere-6r-150',
    brand: 'John Deere',
    brandSlug: 'john-deere',
    category: 'tractoare',
    description: 'Un tractor versatil și puternic, perfect pentru ferme medii și mari.',
    detailedDescription: 'Tractorul John Deere 6R 150 reprezintă vârful tehnologiei pentru fermele medii din România. Echipat cu motorul PowerTech™ EWL de 150 CP, acesta oferă un echilibru perfect între putere și eficiență. Cabina CommandView™ III asigură un confort de neegalat pentru operator, în timp ce transmisia AutoPower IVT optimizează fiecare litru de combustibil consumat.',
    shortDescription: 'Tractor John Deere 6R 150 cu transmisie AutoPower și tehnologie de ultimă oră.',
    price: 145000,
    priceOnRequest: false,
    currency: 'RON',
    images: ['https://picsum.photos/seed/10/800/600'],
    mainImage: 'https://picsum.photos/seed/10/800/600',
    specifications: { 'Putere': '150 CP', 'Transmisie': 'AutoPower IVT', 'An': '2023' },
    inStock: true,
    stockQuantity: 2,
    isNew: true,
    isFeatured: true,
    isOnSale: false,
    tags: ['tractor', '6r', 'john deere'],
    metaTitle: 'John Deere 6R 150 | AgroSalso România',
    metaDescription: 'Cumpără tractorul John Deere 6R 150 de la AgroSalso. Performanță și service garantat.',
  }
];

export async function seedDatabase(db: Firestore) {
  console.log('Starting seed...');

  for (const cat of CATEGORIES) {
    await setDoc(doc(db, 'categories', cat.id), { ...cat, createdAt: serverTimestamp() });
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
