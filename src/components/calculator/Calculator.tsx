'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import AirportSearch from './AirportSearch';
import DistanceResult from './DistanceResult';
import dynamic from 'next/dynamic';

// Dynamically import globe to avoid SSR issues
const FlightGlobe = dynamic(() => import('../globe/FlightGlobe'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] rounded-md bg-[#0B2447] flex items-center justify-center border border-slate-200">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-slate-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-slate-400 text-[11px] uppercase tracking-[0.12em] font-mono">Loading globe…</p>
      </div>
    </div>
  )
});

interface Airport {
  iata: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

type CabinClass = 'economy' | 'premium_economy' | 'business' | 'first';

const CABIN_OPTIONS: { value: CabinClass; label: string }[] = [
  { value: 'economy', label: 'Economy' },
  { value: 'premium_economy', label: 'Premium' },
  { value: 'business', label: 'Business' },
  { value: 'first', label: 'First' },
];

interface RecentRoute {
  fromIata: string;
  fromCity: string;
  toIata: string;
  toCity: string;
}

const RECENT_KEY = 'airmilescalc:recent';
const RECENT_LIMIT = 5;

function loadRecent(): RecentRoute[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (r): r is RecentRoute =>
          !!r &&
          typeof r === 'object' &&
          typeof (r as RecentRoute).fromIata === 'string' &&
          typeof (r as RecentRoute).toIata === 'string',
      )
      .slice(0, RECENT_LIMIT);
  } catch {
    return [];
  }
}

function saveRecent(route: RecentRoute): RecentRoute[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = loadRecent();
    const filtered = current.filter(
      (r) => !(r.fromIata === route.fromIata && r.toIata === route.toIata),
    );
    const next = [route, ...filtered].slice(0, RECENT_LIMIT);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    return next;
  } catch {
    return loadRecent();
  }
}

// Resolve a single airport by IATA via the existing search endpoint.
// The endpoint orders exact-iata matches first, so the top result is the one we want.
async function fetchAirportByIata(iata: string): Promise<Airport | null> {
  try {
    const res = await fetch(`/api/airports/search?q=${encodeURIComponent(iata)}`);
    if (!res.ok) return null;
    const data = await res.json();
    const list: Airport[] = data?.airports ?? [];
    const lower = iata.toLowerCase();
    return list.find((a) => a.iata.toLowerCase() === lower) ?? null;
  } catch {
    return null;
  }
}

interface ClassCO2 {
  kgCO2: number;
  kgCO2e: number;
  treesNeeded: number;
}

interface CalculationResult {
  from: Airport;
  to: Airport;
  distance: { km: number; miles: number; nauticalMiles: number };
  flightTime: { hours: number; minutes: number; display: string };
  co2: ClassCO2;
  co2ByClass: Record<CabinClass, ClassCO2>;
  cabinClass: CabinClass;
  timeDifference: { hours: number; display: string } | null;
  jetLag: {
    severity: 'none' | 'mild' | 'moderate' | 'severe';
    recoveryDays: number;
    direction: 'east' | 'west' | 'none';
  } | null;
  bearing: { degrees: number; cardinal: string; description: string };
  routeType: {
    type: 'short-haul' | 'medium-haul' | 'long-haul' | 'ultra-long-haul';
    description: string;
    typicalAircraft: string[];
  };
  cruisingAltitude: { feet: number; meters: number; flightLevel: string };
  fuelEstimate: {
    litersTotal: number;
    litersPerPassenger: number;
    gallonsTotal: number;
    gallonsPerPassenger: number;
  };
  midpoint: { lat: number; lng: number; latitude: string; longitude: string };
}

export default function Calculator() {
  const [fromAirport, setFromAirport] = useState<Airport | null>(null);
  const [toAirport, setToAirport] = useState<Airport | null>(null);
  const [cabinClass, setCabinClass] = useState<CabinClass>('economy');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [recent, setRecent] = useState<RecentRoute[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);
  const didBootstrap = useRef(false);

  // Hydrate recent routes from localStorage on mount (empty array on SSR avoids hydration mismatch)
  useEffect(() => {
    setRecent(loadRecent());
  }, []);

  // Record each successful calculation in recent
  useEffect(() => {
    if (!result) return;
    const next = saveRecent({
      fromIata: result.from.iata,
      fromCity: result.from.city,
      toIata: result.to.iata,
      toCity: result.to.city,
    });
    setRecent(next);
  }, [result?.from.iata, result?.to.iata]);

  // Drop the displayed result only if the airports drift away from what produced it
  useEffect(() => {
    if (!result) return;
    if (
      fromAirport?.iata !== result.from.iata ||
      toAirport?.iata !== result.to.iata
    ) {
      setResult(null);
    }
  }, [fromAirport?.iata, toAirport?.iata, result]);

  // Bring the result into view when it first appears (helpful on mobile)
  const wasResultShown = useRef(false);
  useEffect(() => {
    if (result && !wasResultShown.current) {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      wasResultShown.current = true;
    } else if (!result) {
      wasResultShown.current = false;
    }
  }, [result]);

  const handleSwap = useCallback(() => {
    const temp = fromAirport;
    setFromAirport(toAirport);
    setToAirport(temp);
  }, [fromAirport, toAirport]);

  const runCalculationByIata = useCallback(async (
    fromIata: string,
    toIata: string,
    forClass: CabinClass,
  ) => {
    if (fromIata.toLowerCase() === toIata.toLowerCase()) {
      setError('Origin and destination cannot be the same');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromIata, toIata, cabinClass: forClass }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Calculation failed');
      }
      // Sync the airport selections with what the API echoed back
      setFromAirport(data.from);
      setToAirport(data.to);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const runCalculation = useCallback(async (forClass: CabinClass) => {
    if (!fromAirport || !toAirport) {
      setError('Please select both origin and destination airports');
      return;
    }
    await runCalculationByIata(fromAirport.iata, toAirport.iata, forClass);
  }, [fromAirport, toAirport, runCalculationByIata]);

  const handleCalculate = useCallback(() => {
    runCalculation(cabinClass);
  }, [runCalculation, cabinClass]);

  const handleClassChange = useCallback((newClass: CabinClass) => {
    setCabinClass(newClass);
    // If a result is already showing, refresh it for the new class
    if (result && fromAirport && toAirport) {
      runCalculation(newClass);
    }
  }, [result, fromAirport, toAirport, runCalculation]);

  // Bootstrap calculator state from URL once on mount: ?from=jfk&to=lhr&class=business
  // - Both airports → run a calculation immediately
  // - Just one airport → pre-fill that field (e.g. coming from /airport/lhr "open full calculator")
  useEffect(() => {
    if (didBootstrap.current) return;
    didBootstrap.current = true;
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const fromIata = params.get('from')?.toLowerCase();
    const toIata = params.get('to')?.toLowerCase();
    const cParam = params.get('class') as CabinClass | null;
    const validClass = CABIN_OPTIONS.find((o) => o.value === cParam)?.value ?? 'economy';
    if (cParam && validClass !== cabinClass) {
      setCabinClass(validClass);
    }
    if (fromIata && toIata) {
      runCalculationByIata(fromIata, toIata, validClass);
      return;
    }
    if (fromIata) {
      fetchAirportByIata(fromIata).then((a) => a && setFromAirport(a));
    }
    if (toIata) {
      fetchAirportByIata(toIata).then((a) => a && setToAirport(a));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the URL in sync with the current selection so refresh / share preserves state
  useEffect(() => {
    if (!didBootstrap.current) return;
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    if (fromAirport) params.set('from', fromAirport.iata.toLowerCase());
    if (toAirport) params.set('to', toAirport.iata.toLowerCase());
    if (cabinClass !== 'economy') params.set('class', cabinClass);
    const search = params.toString();
    const newUrl = search
      ? `${window.location.pathname}?${search}`
      : window.location.pathname;
    if (newUrl !== window.location.pathname + window.location.search) {
      window.history.replaceState(null, '', newUrl);
    }
  }, [fromAirport?.iata, toAirport?.iata, cabinClass]);

  return (
    <div className="w-full">
      <div className="max-w-[860px] mx-auto">
        <form
          className="bg-white border border-slate-200 rounded-md p-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleCalculate();
          }}
        >
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-[0.14em]">
                Flight distance calculator
              </h2>
              <p className="text-[13px] text-[#0B2447] font-medium mt-0.5">
                Geodesic distance · flight time · CO₂ · jet lag
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.1em] text-slate-500 font-mono">
              <span className="w-1.5 h-1.5 bg-[#047857] rounded-full" />
              Live · v1.0
            </span>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] gap-3 items-end">
              <AirportSearch
                label="From"
                placeholder="City or airport code"
                value={fromAirport}
                onChange={setFromAirport}
              />
              <button
                type="button"
                onClick={handleSwap}
                className="hidden sm:flex h-10 w-10 items-center justify-center rounded-md border border-slate-300
                           bg-white text-slate-500 hover:text-[#0B2447] hover:border-[#0B2447]/40
                           transition-colors cursor-pointer flex-shrink-0"
                title="Swap airports"
                aria-label="Swap airports"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
              <AirportSearch
                label="To"
                placeholder="City or airport code"
                value={toAirport}
                onChange={setToAirport}
              />
            </div>

            <button
              type="button"
              onClick={handleSwap}
              className="sm:hidden w-full h-9 flex items-center justify-center gap-2 rounded-md border border-slate-300
                         bg-white text-slate-600 hover:text-[#0B2447] transition-colors text-[12.5px] cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Swap airports
            </button>

            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-[0.1em]">
                  Cabin class
                </span>
                {result && (
                  <span className="text-[10px] text-slate-400 uppercase tracking-[0.08em] font-mono">
                    kg CO₂ / pax
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-1" role="radiogroup" aria-label="Cabin class">
                {CABIN_OPTIONS.map((opt) => {
                  const active = cabinClass === opt.value;
                  const classCO2 = result?.co2ByClass?.[opt.value]?.kgCO2;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => handleClassChange(opt.value)}
                      className={`flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-md text-[12.5px] font-medium transition-colors cursor-pointer border ${
                        active
                          ? 'bg-[#0B2447] text-white border-[#0B2447]'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-[#0B2447]/40 hover:bg-stone-50'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {classCO2 !== undefined && (
                        <span className={`text-[10px] font-normal tabular-nums font-mono ${active ? 'text-slate-300' : 'text-slate-500'}`}>
                          {classCO2.toLocaleString()}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-md text-red-700 text-[12.5px]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!fromAirport || !toAirport || isLoading}
              className="w-full h-11 bg-[#0B2447] text-white text-[13.5px] font-semibold tracking-wide rounded-md
                         hover:bg-[#1A3160] active:bg-[#08182F] disabled:bg-slate-300
                         disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2
                         cursor-pointer mt-1"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Calculating…
                </>
              ) : (
                <>
                  Calculate
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>

            {recent.length > 0 && (
              <div className="flex flex-wrap items-center gap-1 pt-1">
                <span className="text-[10.5px] uppercase tracking-[0.1em] text-slate-500 font-semibold mr-1">
                  Recent
                </span>
                {recent.map((r) => (
                  <button
                    key={`${r.fromIata}-${r.toIata}`}
                    type="button"
                    onClick={() => runCalculationByIata(r.fromIata, r.toIata, cabinClass)}
                    className="text-[11.5px] font-mono tabular-nums tracking-wide px-2 py-0.5 bg-white border border-slate-200 hover:border-[#0B2447]/40 hover:text-[#0B2447] text-slate-600 rounded transition-colors cursor-pointer"
                    title={`${r.fromCity} → ${r.toCity}`}
                  >
                    {r.fromIata.toUpperCase()} → {r.toIata.toUpperCase()}
                  </button>
                ))}
              </div>
            )}

            <div className="pt-2 mt-1 border-t border-slate-100 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] text-slate-400 font-mono uppercase tracking-[0.08em]">
              <span>Vincenty geodesic</span>
              <span className="text-slate-300">·</span>
              <span>DEFRA 2024 CO₂ factors</span>
              <span className="text-slate-300">·</span>
              <span>OpenFlights data</span>
            </div>
          </div>
        </form>

        {result && (
          <div ref={resultRef}>
            <DistanceResult
              from={result.from}
              to={result.to}
              distance={result.distance}
              flightTime={result.flightTime}
              co2={result.co2}
              cabinClass={result.cabinClass}
              timeDifference={result.timeDifference}
              jetLag={result.jetLag}
              bearing={result.bearing}
              routeType={result.routeType}
              cruisingAltitude={result.cruisingAltitude}
              fuelEstimate={result.fuelEstimate}
              midpoint={result.midpoint}
            />
          </div>
        )}
      </div>

      <div className="mt-6 max-w-4xl mx-auto">
        <FlightGlobe
          fromLat={fromAirport?.latitude}
          fromLng={fromAirport?.longitude}
          toLat={toAirport?.latitude}
          toLng={toAirport?.longitude}
          fromName={fromAirport ? `${fromAirport.city} (${fromAirport.iata.toUpperCase()})` : undefined}
          toName={toAirport ? `${toAirport.city} (${toAirport.iata.toUpperCase()})` : undefined}
          distanceMiles={result?.distance.miles}
          flightTime={result?.flightTime.display}
        />
      </div>
    </div>
  );
}
