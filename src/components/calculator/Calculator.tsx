'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AirportSearch from './AirportSearch';
import dynamic from 'next/dynamic';

// Dynamically import globe to avoid SSR issues
const FlightGlobe = dynamic(() => import('../globe/FlightGlobe'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] rounded-xl bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-400 text-sm">Loading globe...</p>
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

export default function Calculator() {
  const router = useRouter();
  const [fromAirport, setFromAirport] = useState<Airport | null>(null);
  const [toAirport, setToAirport] = useState<Airport | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSwap = useCallback(() => {
    const temp = fromAirport;
    setFromAirport(toAirport);
    setToAirport(temp);
  }, [fromAirport, toAirport]);

  const handleCalculate = useCallback(() => {
    if (!fromAirport || !toAirport) {
      setError('Please select both origin and destination airports');
      return;
    }

    if (fromAirport.iata === toAirport.iata) {
      setError('Origin and destination cannot be the same');
      return;
    }

    setError(null);
    setIsNavigating(true);

    // Navigate to the distance page
    const routeSlug = `${fromAirport.iata.toLowerCase()}-to-${toAirport.iata.toLowerCase()}`;
    router.push(`/distance/${routeSlug}`);
  }, [fromAirport, toAirport, router]);

  return (
    <div className="w-full">
      {/* Calculator Card - Centered and compact */}
      <div className="max-w-[800px] mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="space-y-3">
            {/* Airport Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] gap-3 items-end">
              <AirportSearch
                label="From"
                placeholder="City or airport code"
                value={fromAirport}
                onChange={setFromAirport}
              />

              {/* Swap Button - Desktop */}
              <button
                type="button"
                onClick={handleSwap}
                className="hidden sm:flex h-11 w-11 items-center justify-center rounded-lg border border-slate-300
                           bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900
                           transition-colors cursor-pointer flex-shrink-0"
                title="Swap airports"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>

              <AirportSearch
                label="To"
                placeholder="City or airport code"
                value={toAirport}
                onChange={setToAirport}
              />
            </div>

            {/* Mobile Swap Button */}
            <button
              type="button"
              onClick={handleSwap}
              className="sm:hidden w-full h-9 flex items-center justify-center gap-2 rounded-lg border border-slate-300
                         bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors text-sm cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Swap airports
            </button>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Calculate Button */}
            <button
              type="button"
              onClick={handleCalculate}
              disabled={!fromAirport || !toAirport || isNavigating}
              className="w-full h-12 bg-blue-600 text-white font-semibold rounded-lg
                         hover:bg-blue-700 active:bg-blue-800 disabled:bg-slate-300
                         disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2
                         cursor-pointer mt-1"
            >
              {isNavigating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Calculate Distance
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Globe Preview - Can be wider */}
      <div className="mt-6 max-w-4xl mx-auto">
        <FlightGlobe
          fromLat={fromAirport?.latitude}
          fromLng={fromAirport?.longitude}
          toLat={toAirport?.latitude}
          toLng={toAirport?.longitude}
          fromName={fromAirport ? `${fromAirport.city} (${fromAirport.iata.toUpperCase()})` : undefined}
          toName={toAirport ? `${toAirport.city} (${toAirport.iata.toUpperCase()})` : undefined}
        />
      </div>
    </div>
  );
}
