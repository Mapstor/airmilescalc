'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import AirportSearch from './AirportSearch';
import DistanceResult from './DistanceResult';

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

interface Props {
  fromAirport: Airport;
}

export default function AirportPageCalculator({ fromAirport }: Props) {
  const [toAirport, setToAirport] = useState<Airport | null>(null);
  const [cabinClass, setCabinClass] = useState<CabinClass>('economy');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const wasResultShown = useRef(false);

  // Drop stale result when destination changes away from the calculated one
  useEffect(() => {
    if (!result) return;
    if (toAirport?.iata !== result.to.iata) {
      setResult(null);
    }
  }, [toAirport?.iata, result]);

  // Bring result into view on first appearance
  useEffect(() => {
    if (result && !wasResultShown.current) {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      wasResultShown.current = true;
    } else if (!result) {
      wasResultShown.current = false;
    }
  }, [result]);

  const runCalculation = useCallback(async (forClass: CabinClass) => {
    if (!toAirport) {
      setError('Please select a destination airport');
      return;
    }
    if (toAirport.iata.toLowerCase() === fromAirport.iata.toLowerCase()) {
      setError('Destination cannot be the same as this airport');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromIata: fromAirport.iata,
          toIata: toAirport.iata,
          cabinClass: forClass,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Calculation failed');
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed');
    } finally {
      setIsLoading(false);
    }
  }, [fromAirport, toAirport]);

  const handleCalculate = useCallback(() => {
    runCalculation(cabinClass);
  }, [runCalculation, cabinClass]);

  const handleClassChange = useCallback((newClass: CabinClass) => {
    setCabinClass(newClass);
    if (result && toAirport) {
      runCalculation(newClass);
    }
  }, [result, toAirport, runCalculation]);

  return (
    <div className="bg-white border border-slate-200 rounded-md p-5">
      <div className="flex items-center justify-between mb-3.5 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-[0.12em]">
            Distance calculator
          </h3>
          <p className="text-[13px] text-[#0B2447] font-medium mt-0.5">
            From <span className="font-mono">{fromAirport.iata.toUpperCase()}</span> → any destination
          </p>
        </div>
      </div>

      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          handleCalculate();
        }}
      >
        <div className="border border-slate-200 bg-stone-50/60 rounded-md px-3 py-2">
          <div className="text-[10.5px] text-slate-500 uppercase tracking-[0.1em] font-semibold">From</div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-mono tabular-nums text-[11px] font-semibold text-[#0B2447] bg-white border border-slate-200 rounded px-1.5 py-0.5">
              {fromAirport.iata.toUpperCase()}
            </span>
            <span className="text-[13px] text-[#0B2447] font-medium truncate">
              {fromAirport.city}
            </span>
          </div>
        </div>

        <AirportSearch
          label="To"
          placeholder="City or airport code"
          value={toAirport}
          onChange={setToAirport}
        />

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
                  className={`flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-md text-[12px] font-medium transition-colors cursor-pointer border ${
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
          disabled={!toAirport || isLoading}
          className="w-full h-10 bg-[#0B2447] text-white text-[13px] font-semibold tracking-wide rounded-md
                     hover:bg-[#1A3160] active:bg-[#08182F] disabled:bg-slate-300
                     disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2
                     cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Calculating…
            </>
          ) : (
            <>Calculate distance</>
          )}
        </button>
      </form>

      {result && (
        <div ref={resultRef} className="mt-4 -mx-1 sm:mx-0">
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

      {!result && (
        <div className="mt-3 text-[11.5px] text-slate-500 text-center">
          Or{' '}
          <Link
            href={`/?from=${fromAirport.iata.toLowerCase()}`}
            className="text-[#0B2447] hover:text-[#1A3160] font-medium underline-offset-2 hover:underline"
          >
            open the full calculator
          </Link>{' '}
          for 3D globe view and recent searches.
        </div>
      )}
    </div>
  );
}
