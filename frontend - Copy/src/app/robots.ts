import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin-portal/', '/seller/'],
    },
    sitemap: 'https://thecandlelab.in/sitemap.xml',
  };
}
