import type { MetadataRoute } from 'next';

// Generează https://agrosalso.ro/robots.txt
// Crawlerele AI sunt permise explicit, pe lângă regula generală.

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'Googlebot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
    ],
    sitemap: 'https://agrosalso.ro/sitemap.xml',
  };
}
