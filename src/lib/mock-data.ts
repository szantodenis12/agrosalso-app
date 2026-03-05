
import { Product, Category, Brand } from '@/types';

export const MOCK_CATEGORIES: Category[] = [
  { id: 'terradisc', name: 'Terradisc', slug: 'terradisc', description: 'Utilaje pentru sol', icon: '🚜', image: 'https://picsum.photos/seed/1/400/300', productCount: 15, order: 1, isActive: true },
  { id: 'combinator', name: 'Combinator', slug: 'combinator', description: 'Combinatoare performante', icon: '🚜', image: 'https://picsum.photos/seed/2/400/300', productCount: 8, order: 2, isActive: true },
  { id: 'plug', name: 'Plug', slug: 'plug', description: 'Pluguri arătură', icon: '⛏️', image: 'https://picsum.photos/seed/5/400/300', productCount: 12, order: 6, isActive: true },
];

export const MOCK_BRANDS: Brand[] = [
  { id: 'b1', name: 'John Deere', slug: 'john-deere', logo: '', description: 'Lider mondial în utilaje', isPartner: true, order: 1 },
  { id: 'b2', name: 'CLAAS', slug: 'claas', logo: '', description: 'Performanță germană', isPartner: true, order: 2 },
  { id: 'b3', name: 'New Holland', slug: 'new-holland', logo: '', description: 'Inovație în agricultură', isPartner: true, order: 3 },
  { id: 'b4', name: 'Case IH', slug: 'case-ih', logo: '', description: 'Putere pură', isPartner: true, order: 4 },
  { id: 'b5', name: 'Fendt', slug: 'fendt', logo: '', description: 'Tehnologie premium', isPartner: true, order: 5 },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'John Deere 6R 150',
    slug: 'john-deere-6r-150',
    brand: 'John Deere',
    brandSlug: 'john-deere',
    category: 'terradisc',
    description: 'Un tractor versatil și puternic, perfect pentru ferme medii și mari.',
    shortDescription: 'Tractor John Deere 6R 150 cu transmisie AutoPower și tehnologie de ultimă oră.',
    price: 145000,
    priceOnRequest: false,
    currency: 'RON',
    images: ['https://picsum.photos/seed/10/800/600', 'https://picsum.photos/seed/11/800/600'],
    mainImage: 'https://picsum.photos/seed/10/800/600',
    specifications: {
      'Putere motor': '150 CP',
      'Transmisie': 'AutoPower IVT',
      'Ore funcționare': '1200',
      'An fabricație': '2022'
    },
    inStock: true,
    stockQuantity: 2,
    isNew: true,
    isFeatured: true,
    isOnSale: false,
    tags: ['tractor', '6r', 'john deere'],
    metaTitle: 'John Deere 6R 150 - AgroSalso',
    metaDescription: 'Cumpără tractorul John Deere 6R 150 de la AgroSalso. Performanță garantată.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
