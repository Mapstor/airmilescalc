'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Airport {
  iata: string;
  name: string;
  city: string;
  country: string;
}

export default function AirportDirectorySearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Airport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/airports/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.airports || []);
        } else {
          setResults([]);
        }
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
        setHasSearched(true);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="bg-white rounded-md border border-slate-200 p-4 mb-6">
      <label htmlFor="airport-directory-search" className="block text-[10.5px] font-semibold uppercase tracking-[0.1em] text-slate-500 mb-1.5">
        Find an airport
      </label>
      <div className="relative">
        <input
          id="airport-directory-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="City, airport name, or IATA code — e.g. Tokyo, Heathrow, JFK"
          className="w-full h-10 pl-9 pr-9 rounded-md border border-slate-300 bg-white text-[#0B2447] text-[13.5px]
                     placeholder:text-slate-400 focus:outline-none focus:border-[#0B2447] focus:ring-2 focus:ring-[#0B2447]/15
                     transition-colors"
          autoComplete="off"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0B2447] cursor-pointer"
            aria-label="Clear search"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {isLoading && (
        <div className="mt-2.5 text-[12px] text-slate-500 flex items-center gap-2">
          <div className="w-3.5 h-3.5 border-2 border-[#0B2447] border-t-transparent rounded-full animate-spin" />
          Searching…
        </div>
      )}

      {!isLoading && hasSearched && results.length === 0 && (
        <div className="mt-2.5 text-[12px] text-slate-500">
          No airports found for &ldquo;{query}&rdquo;.
        </div>
      )}

      {results.length > 0 && (
        <ul className="mt-3 grid sm:grid-cols-2 gap-1.5">
          {results.map((a) => (
            <li key={a.iata}>
              <Link
                href={`/airport/${a.iata.toLowerCase()}`}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-md border border-slate-200 hover:bg-stone-50 hover:border-[#0B2447]/40 transition-colors"
              >
                <span className="flex-shrink-0 font-mono tabular-nums text-[11px] font-semibold text-[#0B2447] bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 tracking-wider">
                  {a.iata.toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[#0B2447] text-[13px] truncate leading-tight">{a.name}</div>
                  <div className="text-[11.5px] text-slate-500 truncate mt-0.5">
                    {a.city} · {a.country}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
