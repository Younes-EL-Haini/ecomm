import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/constants';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Fetch all your product slugs from the database
  const products = await prisma.product.findMany({
    select: { slug: true, updatedAt: true },
  });

  // 2. Map them into the format Google wants
  const productEntries = products.map((product) => ({
    url: `${SITE_CONFIG.url}/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  // 3. Add your static pages (Home, Cart, etc.)
  return [
    {
      url: SITE_CONFIG.url,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1, // Homepage is the most important
    },
    {
      url: `${SITE_CONFIG.url}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...productEntries, // Add all those dynamic products here
  ];
}