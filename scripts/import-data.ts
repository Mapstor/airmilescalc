// scripts/import-data.ts
import * as fs from 'fs';
import * as path from 'path';
import Database from 'better-sqlite3';

const AIRPORTS_URL = 'https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat';
const AIRLINES_URL = 'https://raw.githubusercontent.com/jpatokal/openflights/master/data/airlines.dat';
const ROUTES_URL = 'https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat';

async function downloadFile(url: string): Promise<string> {
  console.log(`Downloading ${url}...`);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download ${url}: ${response.statusText}`);
  return response.text();
}

function parseCSVLine(line: string): (string | null)[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());

  // Convert \N to null
  return result.map(field => (field === '\\N' || field === '') ? null : field);
}

async function importAirports(db: Database.Database) {
  console.log('Downloading airports...');
  const data = await downloadFile(AIRPORTS_URL);
  const lines = data.trim().split('\n');

  const insert = db.prepare(`
    INSERT OR REPLACE INTO airports
    (id, name, city, country, iata, icao, latitude, longitude, altitude,
     timezone_offset, dst, timezone, type, source)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let imported = 0;
  let skipped = 0;

  const insertMany = db.transaction((rows: (string | number | null)[][]) => {
    for (const row of rows) {
      insert.run(...row);
    }
  });

  const validRows: (string | number | null)[][] = [];

  for (const line of lines) {
    const fields = parseCSVLine(line);
    const [id, name, city, country, iata, icao, lat, lon, alt, tzOffset, dst, tz, type, source] = fields;

    // Skip if no IATA code
    if (!iata) {
      skipped++;
      continue;
    }

    // Skip if invalid coordinates (0,0)
    if (lat === '0' && lon === '0') {
      skipped++;
      continue;
    }

    // Only include airports (not train stations, etc.)
    if (type && type !== 'airport') {
      skipped++;
      continue;
    }

    // Skip if missing essential data
    if (!name || !lat || !lon) {
      skipped++;
      continue;
    }

    validRows.push([
      id ? parseInt(id) : null,
      name,
      city || name, // Use airport name as fallback if city is null
      country || 'Unknown',
      iata.toLowerCase(),
      icao,
      parseFloat(lat),
      parseFloat(lon),
      alt ? parseInt(alt) : null,
      tzOffset ? parseFloat(tzOffset) : null,
      dst,
      tz,
      type || 'airport',
      source
    ]);

    imported++;
  }

  insertMany(validRows);
  console.log(`Imported ${imported} airports, skipped ${skipped}`);
  return imported;
}

async function importAirlines(db: Database.Database) {
  console.log('Downloading airlines...');
  const data = await downloadFile(AIRLINES_URL);
  const lines = data.trim().split('\n');

  const insert = db.prepare(`
    INSERT OR REPLACE INTO airlines
    (id, name, alias, iata, icao, callsign, country, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let imported = 0;
  let skipped = 0;

  const insertMany = db.transaction((rows: (string | number | null)[][]) => {
    for (const row of rows) {
      insert.run(...row);
    }
  });

  const validRows: (string | number | null)[][] = [];

  for (const line of lines) {
    const fields = parseCSVLine(line);
    const [id, name, alias, iata, icao, callsign, country, active] = fields;

    // Skip inactive or no IATA code
    if (active !== 'Y' || !iata) {
      skipped++;
      continue;
    }

    validRows.push([
      id ? parseInt(id) : null,
      name,
      alias,
      iata.toLowerCase(),
      icao,
      callsign,
      country,
      active === 'Y' ? 1 : 0
    ]);

    imported++;
  }

  insertMany(validRows);
  console.log(`Imported ${imported} airlines, skipped ${skipped}`);
  return imported;
}

async function importRoutes(db: Database.Database) {
  console.log('Downloading routes...');
  const data = await downloadFile(ROUTES_URL);
  const lines = data.trim().split('\n');

  // Get valid airports
  const validAirports = new Set(
    (db.prepare('SELECT iata FROM airports').all() as { iata: string }[]).map(r => r.iata)
  );

  const insert = db.prepare(`
    INSERT OR IGNORE INTO routes
    (airline_iata, source_iata, dest_iata, codeshare, stops, equipment)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  let imported = 0;
  let skipped = 0;

  const insertMany = db.transaction((rows: (string | number | null)[][]) => {
    for (const row of rows) {
      insert.run(...row);
    }
  });

  const validRows: (string | number | null)[][] = [];

  for (const line of lines) {
    const fields = parseCSVLine(line);
    const [airline, , source, , dest, , codeshare, stops, equipment] = fields;

    // Skip if airports not valid
    if (!source || !dest) {
      skipped++;
      continue;
    }

    const sourceLower = source.toLowerCase();
    const destLower = dest.toLowerCase();

    if (!validAirports.has(sourceLower) || !validAirports.has(destLower)) {
      skipped++;
      continue;
    }

    validRows.push([
      airline?.toLowerCase() || null,
      sourceLower,
      destLower,
      codeshare === 'Y' ? 1 : 0,
      stops ? parseInt(stops) : 0,
      equipment
    ]);

    imported++;
  }

  insertMany(validRows);
  console.log(`Imported ${imported} routes, skipped ${skipped}`);
  return imported;
}

async function main() {
  const dbPath = path.join(process.cwd(), 'database.sqlite');

  // Remove existing database
  if (fs.existsSync(dbPath)) {
    console.log('Removing existing database...');
    fs.unlinkSync(dbPath);
  }

  console.log('Creating new database...');
  const db = new Database(dbPath);

  // Create tables
  db.exec(`
    CREATE TABLE airports (
      id INTEGER PRIMARY KEY,
      iata TEXT UNIQUE NOT NULL,
      icao TEXT,
      name TEXT NOT NULL,
      city TEXT NOT NULL,
      country TEXT NOT NULL,
      country_code TEXT,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      altitude INTEGER,
      timezone TEXT,
      timezone_offset REAL,
      dst TEXT,
      type TEXT DEFAULT 'airport',
      source TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX idx_airports_iata ON airports(iata);
    CREATE INDEX idx_airports_country ON airports(country);
    CREATE INDEX idx_airports_city ON airports(city);

    CREATE TABLE airlines (
      id INTEGER PRIMARY KEY,
      iata TEXT,
      icao TEXT,
      name TEXT NOT NULL,
      alias TEXT,
      callsign TEXT,
      country TEXT,
      active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX idx_airlines_iata ON airlines(iata);
    CREATE INDEX idx_airlines_name ON airlines(name);

    CREATE TABLE routes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      airline_iata TEXT,
      source_iata TEXT NOT NULL,
      dest_iata TEXT NOT NULL,
      codeshare INTEGER DEFAULT 0,
      stops INTEGER DEFAULT 0,
      equipment TEXT,
      FOREIGN KEY (source_iata) REFERENCES airports(iata),
      FOREIGN KEY (dest_iata) REFERENCES airports(iata)
    );

    CREATE INDEX idx_routes_source ON routes(source_iata);
    CREATE INDEX idx_routes_dest ON routes(dest_iata);
    CREATE INDEX idx_routes_pair ON routes(source_iata, dest_iata);
  `);

  console.log('Tables created successfully.');

  // Import data
  await importAirports(db);
  await importAirlines(db);
  await importRoutes(db);

  // Get final stats
  const finalAirportCount = (db.prepare('SELECT COUNT(*) as count FROM airports').get() as { count: number }).count;
  const finalAirlineCount = (db.prepare('SELECT COUNT(*) as count FROM airlines').get() as { count: number }).count;
  const finalRouteCount = (db.prepare('SELECT COUNT(*) as count FROM routes').get() as { count: number }).count;

  console.log('\n=== Import Complete ===');
  console.log(`Airports: ${finalAirportCount}`);
  console.log(`Airlines: ${finalAirlineCount}`);
  console.log(`Routes: ${finalRouteCount}`);

  // Verification: Show sample data
  console.log('\n=== Sample Airports ===');
  const sampleAirports = db.prepare('SELECT iata, name, city, country FROM airports LIMIT 5').all();
  console.table(sampleAirports);

  console.log('\n=== Sample Airlines ===');
  const sampleAirlines = db.prepare('SELECT iata, name, country FROM airlines LIMIT 5').all();
  console.table(sampleAirlines);

  db.close();
  console.log('\nDatabase closed. Import successful!');
}

main().catch(console.error);
