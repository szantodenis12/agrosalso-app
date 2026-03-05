
'use client';
import { doc, setDoc, serverTimestamp, type Firestore } from 'firebase/firestore';

const CATEGORIES = [
  { id: 'terradisc', name: 'Terradisc', slug: 'terradisc', icon: '🚜', order: 1, productCount: 0, isActive: true, description: 'Utilaje pentru prelucrarea solului.' },
  { id: 'combinator', name: 'Combinator', slug: 'combinator', icon: '🚜', order: 2, productCount: 0, isActive: true, description: 'Combinatoare agricole performante.' },
  { id: 'gruber', name: 'Gruber', slug: 'gruber', icon: '🚜', order: 3, productCount: 0, isActive: true, description: 'Grubere pentru scarificare.' },
  { id: 'distribuitor-ingrasamant', name: 'Distribuitor de ingrasamant', slug: 'distribuitor-ingrasamant', icon: '🌱', order: 4, productCount: 0, isActive: true, description: 'Echipamente pentru fertilizare.' },
  { id: 'freza-pamant', name: 'Freza de pamant', slug: 'freza-pamant', icon: '⛏️', order: 5, productCount: 0, isActive: true, description: 'Freze pentru pregătirea patului germinativ.' },
  { id: 'plug', name: 'Plug', slug: 'plug', icon: '⛏️', order: 6, productCount: 0, isActive: true, description: 'Pluguri pentru arătură.' },
  { id: 'semanatoare-paioase', name: 'Semanatoare paioase', slug: 'semanatoare-paioase', icon: '🌾', order: 7, productCount: 0, isActive: true, description: 'Semănători de precizie.' },
  { id: 'masina-plantat-usturoi', name: 'Masina de plantat usturoi', slug: 'masina-plantat-usturoi', icon: '🧄', order: 8, productCount: 0, isActive: true, description: 'Echipamente specializate pentru usturoi.' },
  { id: 'tavalug-neted', name: 'Tavalug neted', slug: 'tavalug-neted', icon: '🚜', order: 9, productCount: 0, isActive: true, description: 'Tăvăluguri pentru nivelarea solului.' },
  { id: 'scalificator', name: 'Scalificator', slug: 'scalificator', icon: '🚜', order: 10, productCount: 0, isActive: true, description: 'Utilaje pentru scarificare profundă.' },
  { id: 'masina-recoltat', name: 'Masina de recoltat usturoi, ceapa, cartofi', slug: 'masina-recoltat', icon: '🥔', order: 11, productCount: 0, isActive: true, description: 'Recoltatoare specializate.' },
  { id: 'tocatoare-resturi', name: 'Tocatoare resturi vegetale', slug: 'tocatoare-resturi', icon: '🌿', order: 12, productCount: 0, isActive: true, description: 'Tocători de resturi vegetale.' },
  { id: 'instalatie-erbicidat', name: 'Instalatie de erbicidat', slug: 'instalatie-erbicidat', icon: '💧', order: 13, productCount: 0, isActive: true, description: 'Echipamente pentru protecția culturilor.' },
  { id: 'plantator-cartofi', name: 'Plantator cartofi', slug: 'plantator-cartofi', icon: '🥔', order: 14, productCount: 0, isActive: true, description: 'Sisteme de plantare cartofi.' },
  { id: 'cultivator-prasitoare', name: 'Cultivator intre randuri (Prasitoare)', slug: 'cultivator-prasitoare', icon: '🌿', order: 15, productCount: 0, isActive: true, description: 'Utilaje pentru întreținerea culturilor.' },
  { id: 'altele', name: 'Altele', slug: 'altele', icon: '📦', order: 16, productCount: 0, isActive: true, description: 'Alte utilaje și accesorii.' },
];

const PRODUCTS = [
  {
    id: 'john-deere-6r-150',
    name: 'John Deere 6R 150',
    slug: 'john-deere-6r-150',
    brand: 'John Deere',
    brandSlug: 'john-deere',
    category: 'terradisc',
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
