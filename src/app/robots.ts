import type { MetadataRoute } from 'next';

// Generează https://agrosalso.ro/robots.txt

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://agrosalso.ro/sitemap.xml',
  };
}
