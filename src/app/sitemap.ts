import { MetadataRoute } from 'next';
import { getDb } from '@/lib/db';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://airmilescalc.com';
  const db = getDb();

  // Get all airports
  const airports = db.prepare('SELECT iata FROM airports').all() as { iata: string }[];

  // Get popular routes (top 1000)
  const routes = db.prepare(`
    SELECT source_iata, dest_iata, COUNT(*) as cnt
    FROM routes
    GROUP BY source_iata, dest_iata
    ORDER BY cnt DESC
    LIMIT 1000
  `).all() as { source_iata: string; dest_iata: string }[];

  const sitemap: MetadataRoute.Sitemap = [
    // Static pages
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/airports`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.2,
    },
  ];

  const iataPattern = /^[A-Za-z]{3}$/;

  // Add airport pages
  for (const airport of airports) {
    if (!iataPattern.test(airport.iata)) continue;
    sitemap.push({
      url: `${baseUrl}/airport/${airport.iata.toLowerCase()}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  // Add distance pages for popular routes
  for (const route of routes) {
    if (!iataPattern.test(route.source_iata) || !iataPattern.test(route.dest_iata)) continue;
    sitemap.push({
      url: `${baseUrl}/distance/${route.source_iata.toLowerCase()}-to-${route.dest_iata.toLowerCase()}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  return sitemap;
}
