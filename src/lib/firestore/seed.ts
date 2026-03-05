
'use client';
import { doc, setDoc, serverTimestamp, type Firestore } from 'firebase/firestore';
import { PRODUCT_CATEGORIES } from '@/lib/constants';

export async function seedDatabase(db: Firestore) {
  console.log('Starting seed...');

  for (const cat of PRODUCT_CATEGORIES) {
    await setDoc(doc(db, 'categories', cat.id), { 
      ...cat, 
      order: PRODUCT_CATEGORIES.indexOf(cat),
      isActive: true,
      productCount: 0,
      description: `Utilaje din categoria ${cat.name}`,
      createdAt: serverTimestamp() 
    });
  }

  const demoProduct = {
    id: 'demo-tractor',
    name: 'Tractor Premium Model X',
    slug: 'tractor-premium-model-x',
    brand: 'Brand Demo',
    brandSlug: 'brand-demo',
    category: 'terradisc',
    description: 'Un utilaj performant pentru agricultura modernă.',
    detailedDescription: '<p>Tractorul Premium Model X este echipat cu tehnologie de ultimă oră pentru a maximiza eficiența în fermă.</p>',
    shortDescription: 'Tractor performant cu 150 CP și transmisie automată.',
    price: 150000,
    priceOnRequest: false,
    currency: 'RON',
    images: ['https://picsum.photos/seed/1/800/600'],
    mainImage: 'https://picsum.photos/seed/1/800/600',
    specifications: { 'Putere': '150 CP', 'An': '2024' },
    inStock: true,
    stockQuantity: 1,
    isNew: true,
    isFeatured: true,
    isOnSale: false,
    tags: ['tractor', 'premium'],
    metaTitle: 'Tractor Premium | AgroSalso',
    metaDescription: 'Descoperă cel mai nou model de tractor.',
  };

  await setDoc(doc(db, 'products', demoProduct.id), { 
    ...demoProduct, 
    createdAt: serverTimestamp(), 
    updatedAt: serverTimestamp() 
  });

  await setDoc(doc(db, 'siteConfig', 'main'), {
    companyName: 'AgroSalso SRL',
    phone: '+40 751 234 567',
    email: 'office@agrosalso.ro',
    address: 'Madaras, Bihor',
    updatedAt: serverTimestamp()
  });

  console.log('Seed completed!');
}
