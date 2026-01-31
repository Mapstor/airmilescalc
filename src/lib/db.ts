// lib/db.ts
import Database from 'better-sqlite3';
import path from 'path';

// Database singleton
let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'database.sqlite');
    db = new Database(dbPath, { readonly: true });
  }
  return db;
}

// Airport type
export interface Airport {
  id: number;
  iata: string;
  icao: string | null;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  altitude: number | null;
  timezone: string | null;
  timezone_offset: number | null;
}

// Airline type
export interface Airline {
  id: number;
  iata: string;
  icao: string | null;
  name: string;
  alias: string | null;
  callsign: string | null;
  country: string | null;
  active: number;
}

// Route type
export interface Route {
  id: number;
  airline_iata: string | null;
  source_iata: string;
  dest_iata: string;
  codeshare: number;
  stops: number;
  equipment: string | null;
}
