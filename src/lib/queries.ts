// lib/queries.ts
import { getDb, Airport, Airline, Route } from './db';

/**
 * Search airports by IATA code, city, or name
 */
export function searchAirports(query: string, limit: number = 10): Airport[] {
  const db = getDb();
  const searchTerm = `%${query.toLowerCase()}%`;

  const results = db.prepare(`
    SELECT id, iata, icao, name, city, country, latitude, longitude, altitude, timezone, timezone_offset
    FROM airports
    WHERE iata LIKE ? OR LOWER(city) LIKE ? OR LOWER(name) LIKE ?
    ORDER BY
      CASE
        WHEN iata = ? THEN 1
        WHEN iata LIKE ? THEN 2
        WHEN LOWER(city) LIKE ? THEN 3
        ELSE 4
      END,
      name
    LIMIT ?
  `).all(
    searchTerm,
    searchTerm,
    searchTerm,
    query.toLowerCase(),
    query.toLowerCase() + '%',
    query.toLowerCase() + '%',
    limit
  ) as Airport[];

  return results;
}

/**
 * Get airport by IATA code
 */
export function getAirportByIata(iata: string): Airport | null {
  const db = getDb();
  const result = db.prepare(`
    SELECT id, iata, icao, name, city, country, latitude, longitude, altitude, timezone, timezone_offset
    FROM airports
    WHERE iata = ?
  `).get(iata.toLowerCase()) as Airport | undefined;

  return result || null;
}

/**
 * Get multiple airports by IATA codes
 */
export function getAirportsByIata(iataCodes: string[]): Airport[] {
  const db = getDb();
  const placeholders = iataCodes.map(() => '?').join(',');
  const results = db.prepare(`
    SELECT id, iata, icao, name, city, country, latitude, longitude, altitude, timezone, timezone_offset
    FROM airports
    WHERE iata IN (${placeholders})
  `).all(...iataCodes.map(c => c.toLowerCase())) as Airport[];

  return results;
}

/**
 * Get airports by country
 */
export function getAirportsByCountry(country: string, limit: number = 100): Airport[] {
  const db = getDb();
  const results = db.prepare(`
    SELECT id, iata, icao, name, city, country, latitude, longitude, altitude, timezone, timezone_offset
    FROM airports
    WHERE LOWER(country) = ?
    ORDER BY city, name
    LIMIT ?
  `).all(country.toLowerCase(), limit) as Airport[];

  return results;
}

export interface AirportWithRouteCount extends Airport {
  routeCount: number;
}

/**
 * Get airports by country, each annotated with its scheduled-route count.
 * Single SQL statement (correlated subquery hits the routes(source_iata) index).
 */
export function getAirportsByCountryWithRoutes(
  country: string,
  limit: number = 1000,
): AirportWithRouteCount[] {
  const db = getDb();
  const results = db.prepare(`
    SELECT
      a.id, a.iata, a.icao, a.name, a.city, a.country,
      a.latitude, a.longitude, a.altitude, a.timezone, a.timezone_offset,
      (SELECT COUNT(DISTINCT dest_iata)
         FROM routes r
        WHERE r.source_iata = a.iata) AS routeCount
    FROM airports a
    WHERE LOWER(a.country) = ?
      AND a.iata IS NOT NULL AND a.iata != ''
    ORDER BY a.city, a.name
    LIMIT ?
  `).all(country.toLowerCase(), limit) as AirportWithRouteCount[];

  return results;
}

/**
 * Get all unique countries with airport count
 */
export function getCountriesWithAirports(): { country: string; count: number }[] {
  const db = getDb();
  const results = db.prepare(`
    SELECT country, COUNT(*) as count
    FROM airports
    GROUP BY country
    ORDER BY country
  `).all() as { country: string; count: number }[];

  return results;
}

/**
 * Get popular routes from an airport
 */
export function getPopularRoutesFrom(iata: string, limit: number = 10): (Route & { dest_airport?: Airport })[] {
  const db = getDb();
  const routes = db.prepare(`
    SELECT r.*, COUNT(*) as airline_count
    FROM routes r
    WHERE r.source_iata = ?
    GROUP BY r.dest_iata
    ORDER BY airline_count DESC
    LIMIT ?
  `).all(iata.toLowerCase(), limit) as (Route & { airline_count: number })[];

  // Get destination airport details
  if (routes.length > 0) {
    const destIatas = routes.map(r => r.dest_iata);
    const airports = getAirportsByIata(destIatas);
    const airportMap = new Map(airports.map(a => [a.iata, a]));

    return routes.map(r => ({
      ...r,
      dest_airport: airportMap.get(r.dest_iata)
    }));
  }

  return routes;
}

/**
 * Get popular routes overall (most served routes)
 */
export function getPopularRoutes(limit: number = 20): { source: Airport; dest: Airport; airline_count: number }[] {
  const db = getDb();
  const routes = db.prepare(`
    SELECT source_iata, dest_iata, COUNT(*) as airline_count
    FROM routes
    GROUP BY source_iata, dest_iata
    ORDER BY airline_count DESC
    LIMIT ?
  `).all(limit) as { source_iata: string; dest_iata: string; airline_count: number }[];

  // Get airport details
  const allIatas = [...new Set([...routes.map(r => r.source_iata), ...routes.map(r => r.dest_iata)])];
  const airports = getAirportsByIata(allIatas);
  const airportMap = new Map(airports.map(a => [a.iata, a]));

  return routes
    .filter(r => airportMap.has(r.source_iata) && airportMap.has(r.dest_iata))
    .map(r => ({
      source: airportMap.get(r.source_iata)!,
      dest: airportMap.get(r.dest_iata)!,
      airline_count: r.airline_count
    }));
}

/**
 * Get airline by IATA code
 */
export function getAirlineByIata(iata: string): Airline | null {
  const db = getDb();
  const result = db.prepare(`
    SELECT id, iata, icao, name, alias, callsign, country, active
    FROM airlines
    WHERE iata = ?
  `).get(iata.toLowerCase()) as Airline | undefined;

  return result || null;
}

/**
 * Search airlines by name or IATA code
 */
export function searchAirlines(query: string, limit: number = 10): Airline[] {
  const db = getDb();
  const searchTerm = `%${query.toLowerCase()}%`;

  const results = db.prepare(`
    SELECT id, iata, icao, name, alias, callsign, country, active
    FROM airlines
    WHERE iata LIKE ? OR LOWER(name) LIKE ?
    ORDER BY
      CASE
        WHEN iata = ? THEN 1
        WHEN iata LIKE ? THEN 2
        ELSE 3
      END,
      name
    LIMIT ?
  `).all(
    searchTerm,
    searchTerm,
    query.toLowerCase(),
    query.toLowerCase() + '%',
    limit
  ) as Airline[];

  return results;
}

/**
 * Get all airlines with pagination
 */
export function getAllAirlines(page: number = 1, limit: number = 50): { airlines: Airline[]; total: number } {
  const db = getDb();
  const offset = (page - 1) * limit;

  const airlines = db.prepare(`
    SELECT id, iata, icao, name, alias, callsign, country, active
    FROM airlines
    WHERE active = 1
    ORDER BY name
    LIMIT ? OFFSET ?
  `).all(limit, offset) as Airline[];

  const total = (db.prepare('SELECT COUNT(*) as count FROM airlines WHERE active = 1').get() as { count: number }).count;

  return { airlines, total };
}

/**
 * Check if a route exists (any airline)
 */
export function routeExists(fromIata: string, toIata: string): boolean {
  const db = getDb();
  const result = db.prepare(`
    SELECT 1 FROM routes
    WHERE source_iata = ? AND dest_iata = ?
    LIMIT 1
  `).get(fromIata.toLowerCase(), toIata.toLowerCase());

  return !!result;
}

/**
 * Get airlines operating a route
 */
export function getAirlinesForRoute(fromIata: string, toIata: string): Airline[] {
  const db = getDb();
  const results = db.prepare(`
    SELECT DISTINCT a.id, a.iata, a.icao, a.name, a.alias, a.callsign, a.country, a.active
    FROM routes r
    JOIN airlines a ON r.airline_iata = a.iata
    WHERE r.source_iata = ? AND r.dest_iata = ?
    ORDER BY a.name
  `).all(fromIata.toLowerCase(), toIata.toLowerCase()) as Airline[];

  return results;
}

/**
 * Get total counts for stats
 */
export function getStats(): { airports: number; airlines: number; routes: number } {
  const db = getDb();
  const airports = (db.prepare('SELECT COUNT(*) as count FROM airports').get() as { count: number }).count;
  const airlines = (db.prepare('SELECT COUNT(*) as count FROM airlines WHERE active = 1').get() as { count: number }).count;
  const routes = (db.prepare('SELECT COUNT(*) as count FROM routes').get() as { count: number }).count;

  return { airports, airlines, routes };
}

/**
 * Find nearby airports within ~5° bounding box, ordered by proximity
 */
export function getNearbyAirports(lat: number, lng: number, excludeIata: string, limit: number = 10): Airport[] {
  const db = getDb();
  const delta = 5; // degrees bounding box
  const results = db.prepare(`
    SELECT id, iata, icao, name, city, country, latitude, longitude, altitude, timezone, timezone_offset,
           ABS(latitude - ?) + ABS(longitude - ?) AS approx_dist
    FROM airports
    WHERE latitude BETWEEN ? AND ?
      AND longitude BETWEEN ? AND ?
      AND iata != ?
    ORDER BY approx_dist
    LIMIT ?
  `).all(
    lat, lng,
    lat - delta, lat + delta,
    lng - delta, lng + delta,
    excludeIata.toLowerCase(),
    limit
  ) as Airport[];

  return results;
}

/**
 * Get distinct active airlines operating from an airport
 */
export function getAirlinesAtAirport(iata: string): Airline[] {
  const db = getDb();
  const results = db.prepare(`
    SELECT DISTINCT a.id, a.iata, a.icao, a.name, a.alias, a.callsign, a.country, a.active
    FROM routes r
    JOIN airlines a ON r.airline_iata = a.iata
    WHERE r.source_iata = ? AND a.active = 1
    ORDER BY a.name
  `).all(iata.toLowerCase()) as Airline[];

  return results;
}

/**
 * Get top airports ranked by number of distinct destinations
 */
export function getTopAirportsByRouteCount(limit: number = 20): { airport: Airport; route_count: number }[] {
  const db = getDb();
  const results = db.prepare(`
    SELECT a.id, a.iata, a.icao, a.name, a.city, a.country, a.latitude, a.longitude, a.altitude, a.timezone, a.timezone_offset,
           COUNT(DISTINCT r.dest_iata) AS route_count
    FROM airports a
    JOIN routes r ON a.iata = r.source_iata
    GROUP BY a.iata
    ORDER BY route_count DESC
    LIMIT ?
  `).all(limit) as (Airport & { route_count: number })[];

  return results.map(r => ({
    airport: {
      id: r.id, iata: r.iata, icao: r.icao, name: r.name, city: r.city, country: r.country,
      latitude: r.latitude, longitude: r.longitude, altitude: r.altitude, timezone: r.timezone, timezone_offset: r.timezone_offset
    },
    route_count: r.route_count
  }));
}

/**
 * Get count of distinct destinations from an airport
 */
export function getRouteCountForAirport(iata: string): number {
  const db = getDb();
  const result = db.prepare(`
    SELECT COUNT(DISTINCT dest_iata) AS count
    FROM routes
    WHERE source_iata = ?
  `).get(iata.toLowerCase()) as { count: number };

  return result.count;
}
