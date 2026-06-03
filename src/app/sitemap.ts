import { MetadataRoute } from 'next';
import { getDb } from '@/lib/db';
import { slugify } from '@/lib/slug';

/**
 * Sitemap policy:
 *  - Static pages: always include.
 *  - Country pages (/airports/[country]): include every country with ≥ 3
 *    IATA-coded airports. Countries with 1–2 IATA airports produce thin
 *    pages (~860w) and are excluded from the sitemap (still reachable via
 *    direct navigation but not declared as valuable inventory). This avoids
 *    triggering AdSense / Search Console thin-content flags.
 *  - Airport pages (/airport/[iata]): include only airports that have at
 *    least 3 outbound scheduled routes. 1–2 route airports produce thin
 *    pages and are excluded for the same reason.
 *  - Distance pages (/distance/[a-to-b]): include only the top-1000 most-
 *    flown city pairs. The full combinatorial space (~9M pairs) is left out
 *    of the sitemap deliberately; uncommon routes are still reachable
 *    on-demand via dynamic rendering.
 */

// Minimum-content thresholds. Pages below these levels are excluded from
// the sitemap but remain reachable via direct navigation. Tune here.
const MIN_AIRPORTS_PER_COUNTRY = 3;
const MIN_ROUTES_PER_AIRPORT = 3;
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://airmilescalc.com';
  const db = getDb();
  const now = new Date();
  const iataPattern = /^[A-Za-z]{3}$/;

  // Static editorial pages and content cluster.
  const methodologyTopics = [
    'vincenty-formula', 'haversine-formula', 'great-circle-distance',
    'wgs84-ellipsoid', 'rhumb-line', 'co2-emissions-calculation',
    'defra-emission-factors', 'radiative-forcing', 'flight-time-calculation',
  ];
  const learnTopics = [
    'nautical-miles', 'aircraft-cruise-speeds', 'cruising-altitude',
    'cabin-class-emissions', 'jet-lag-science', 'corsia',
    'sustainable-aviation-fuel', 'longest-flights-in-the-world',
    'busiest-airports-in-the-world', 'airline-alliances',
  ];

  const items: MetadataRoute.Sitemap = [
    { url: baseUrl,                  lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${baseUrl}/airports`,    lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${baseUrl}/methodology`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/learn`,       lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${baseUrl}/about`,         lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/contact`,       lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/privacy`,       lastModified: now, changeFrequency: 'monthly', priority: 0.2 },
    { url: `${baseUrl}/terms`,         lastModified: now, changeFrequency: 'monthly', priority: 0.2 },
    { url: `${baseUrl}/accessibility`,     lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/editorial-process`,  lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];

  for (const slug of methodologyTopics) {
    items.push({
      url: `${baseUrl}/methodology/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }
  for (const slug of learnTopics) {
    items.push({
      url: `${baseUrl}/learn/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  // Country pages — every country with at least MIN_AIRPORTS_PER_COUNTRY
  // IATA-coded airports. Smaller countries (≤ 2 airports) produce thin
  // pages (~860w) and are excluded from the sitemap to avoid thin-content
  // flags during AdSense and search-engine review.
  const countries = db.prepare(`
    SELECT country, COUNT(*) as cnt
    FROM airports
    WHERE country IS NOT NULL
      AND country != ''
      AND iata IS NOT NULL
      AND iata != ''
    GROUP BY country
    HAVING cnt >= ?
  `).all(MIN_AIRPORTS_PER_COUNTRY) as { country: string; cnt: number }[];

  for (const { country } of countries) {
    const slug = slugify(country);
    if (!slug) continue;
    items.push({
      url: `${baseUrl}/airports/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  // Airport pages — only airports that (a) exist in the airports table (so
  // the detail page resolves) AND (b) have at least MIN_ROUTES_PER_AIRPORT
  // outbound scheduled routes. 1–2 route airports produce thin pages
  // (~937w) and are excluded for the same thin-content reason as small
  // countries. Destination-only airports are excluded entirely.
  const airportsWithRoutes = db.prepare(`
    SELECT a.iata, COUNT(DISTINCT r.dest_iata) as routes
    FROM airports a
    JOIN routes r ON r.source_iata = a.iata
    WHERE a.iata IS NOT NULL AND a.iata != ''
    GROUP BY a.iata
    HAVING routes >= ?
  `).all(MIN_ROUTES_PER_AIRPORT) as { iata: string; routes: number }[];

  for (const { iata } of airportsWithRoutes) {
    if (!iataPattern.test(iata)) continue;
    items.push({
      url: `${baseUrl}/airport/${iata.toLowerCase()}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  // Distance pages — top 1000 city pairs by frequency. INNER JOIN to both
  // endpoints in the airports table guarantees every URL in the sitemap
  // resolves to a real page (no 404s from orphan route entries).
  const routes = db.prepare(`
    SELECT r.source_iata, r.dest_iata, COUNT(*) as cnt
    FROM routes r
    INNER JOIN airports src ON src.iata = r.source_iata
    INNER JOIN airports dst ON dst.iata = r.dest_iata
    WHERE r.source_iata != r.dest_iata
      AND r.source_iata != '' AND r.dest_iata != ''
    GROUP BY r.source_iata, r.dest_iata
    ORDER BY cnt DESC
    LIMIT 1000
  `).all() as { source_iata: string; dest_iata: string }[];

  for (const route of routes) {
    if (!iataPattern.test(route.source_iata) || !iataPattern.test(route.dest_iata)) continue;
    items.push({
      url: `${baseUrl}/distance/${route.source_iata.toLowerCase()}-to-${route.dest_iata.toLowerCase()}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  return items;
}
