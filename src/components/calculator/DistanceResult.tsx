'use client';

import Link from 'next/link';

interface Airport {
  iata: string;
  name: string;
  city: string;
  country: string;
}

type CabinClass = 'economy' | 'premium_economy' | 'business' | 'first';

const CABIN_LABEL: Record<CabinClass, string> = {
  economy: 'Economy',
  premium_economy: 'Premium Eco.',
  business: 'Business',
  first: 'First',
};

interface DistanceResultProps {
  from: Airport;
  to: Airport;
  distance: {
    km: number;
    miles: number;
    nauticalMiles: number;
  };
  flightTime: {
    hours: number;
    minutes: number;
    display: string;
  };
  co2: {
    kgCO2: number;
    kgCO2e: number;
    treesNeeded: number;
  };
  cabinClass: CabinClass;
  timeDifference?: { hours: number; display: string } | null;
  jetLag?: {
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

const ROUTE_LABEL: Record<DistanceResultProps['routeType']['type'], string> = {
  'short-haul': 'Short-haul',
  'medium-haul': 'Medium-haul',
  'long-haul': 'Long-haul',
  'ultra-long-haul': 'Ultra-long-haul',
};

export default function DistanceResult({
  from,
  to,
  distance,
  flightTime,
  co2,
  cabinClass,
  timeDifference,
  jetLag,
  bearing,
  routeType,
  cruisingAltitude,
  fuelEstimate,
  midpoint,
}: DistanceResultProps) {
  const routeUrl = `/distance/${from.iata.toLowerCase()}-to-${to.iata.toLowerCase()}`;
  const routeLabel = ROUTE_LABEL[routeType.type];
  const maxDistance = 18000;
  const distancePercent = Math.min((distance.km / maxDistance) * 100, 100);

  const jetLagTone =
    jetLag?.severity === 'severe' ? 'text-[#B91C1C]' :
    jetLag?.severity === 'moderate' ? 'text-[#D97706]' :
    jetLag?.severity === 'mild' ? 'text-[#A16207]' :
    'text-[#047857]';

  return (
    <div className="mt-5 max-w-[860px] mx-auto bg-white border border-slate-200 rounded-md overflow-hidden">
      {/* Header strip */}
      <div className="bg-[#0B2447] text-white px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="font-mono tabular-nums text-[14px] font-semibold tracking-wider bg-white/10 border border-white/15 rounded px-2 py-1">
            {from.iata.toUpperCase()}
          </span>
          <svg className="w-4 h-4 text-slate-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m0 0l-5-5m5 5l-5 5" />
          </svg>
          <span className="font-mono tabular-nums text-[14px] font-semibold tracking-wider bg-white/10 border border-white/15 rounded px-2 py-1">
            {to.iata.toUpperCase()}
          </span>
          <div className="hidden sm:block ml-2 min-w-0">
            <div className="text-[13px] font-medium truncate text-white/95">
              {from.city} → {to.city}
            </div>
            <div className="text-[10.5px] uppercase tracking-[0.12em] text-slate-300 mt-0.5">
              {routeLabel} · {bearing.cardinal} {bearing.degrees}°
            </div>
          </div>
        </div>
        <Link
          href={routeUrl}
          className="hidden sm:inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-200 hover:text-white border border-white/20 hover:border-white/40 rounded px-2.5 py-1.5 transition-colors"
        >
          Full report
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* HERO — air miles dominate */}
      <div className="px-4 sm:px-6 py-7 sm:py-8 bg-gradient-to-b from-stone-50/70 to-white border-b border-slate-200">
        <div className="text-center">
          <div className="text-[10.5px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-1.5">
            Air miles
          </div>
          <div className="font-mono tabular-nums text-[#0B2447] font-semibold leading-none text-[64px] sm:text-[88px]">
            {distance.miles.toLocaleString()}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[13px] text-slate-600 font-mono tabular-nums">
            <span>
              <span className="text-[#0B2447] font-semibold">{distance.km.toLocaleString()}</span>{' '}
              <span className="text-slate-500 text-[11.5px]">km</span>
            </span>
            <span className="text-slate-300">·</span>
            <span>
              <span className="text-[#0B2447] font-semibold">{distance.nauticalMiles.toLocaleString()}</span>{' '}
              <span className="text-slate-500 text-[11.5px]">nm</span>
            </span>
            <span className="text-slate-300">·</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.1em] text-slate-600 border border-slate-200 bg-white rounded px-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0B2447]" />
              {routeLabel}
            </span>
          </div>
        </div>

        {/* Distance scale */}
        <div className="mt-5 max-w-md mx-auto">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.1em] text-slate-400 font-mono mb-1">
            <span>0</span>
            <span>9,000 km</span>
            <span>18,000+ km</span>
          </div>
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0B2447] transition-all duration-500"
              style={{ width: `${distancePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Primary metric grid — 4 cells */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-200">
        <Metric label="Flight time" value={flightTime.display} unit="" />
        <Metric
          label={`CO₂ · ${CABIN_LABEL[cabinClass].toLowerCase()}`}
          value={co2.kgCO2.toLocaleString()}
          unit="kg"
        />
        <Metric label="Bearing" value={`${bearing.cardinal}`} unit={`${bearing.degrees}°`} />
        <Metric label="Cruise altitude" value={cruisingAltitude.flightLevel} unit={`${cruisingAltitude.feet.toLocaleString()} ft`} />
      </div>

      {/* Time zone & jet lag */}
      {timeDifference && jetLag && (
        <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-slate-200 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
          <DataRow
            label="Time difference"
            value={timeDifference.hours === 0 ? 'Same TZ' : timeDifference.display}
          />
          <DataRow
            label="Jet lag"
            value={
              <>
                <span className={`capitalize font-medium ${jetLagTone}`}>{jetLag.severity}</span>
                {jetLag.recoveryDays > 0 && (
                  <span className="text-slate-500"> · {jetLag.recoveryDays}d recovery</span>
                )}
              </>
            }
          />
        </div>
      )}

      {/* Aircraft + fuel + midpoint row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-slate-200 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 text-[12px]">
        <DataRow
          label="Typical aircraft"
          value={
            <span className="text-right" title={routeType.typicalAircraft.join(', ')}>
              {routeType.typicalAircraft.slice(0, 2).join(', ')}
            </span>
          }
        />
        <DataRow
          label="Fuel · per pax"
          value={`${fuelEstimate.litersPerPassenger.toLocaleString()} L`}
        />
        <DataRow
          label="Route midpoint"
          value={
            <span className="font-mono tabular-nums text-[11px] text-slate-700" title={`${midpoint.latitude}, ${midpoint.longitude}`}>
              {midpoint.latitude.replace(/(\d+)°(\d+)'.*/, '$1°$2′')}{' '}
              {midpoint.longitude.replace(/(\d+)°(\d+)'.*/, '$1°$2′')}
            </span>
          }
        />
      </div>

      {/* Secondary CO₂ + trees row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-slate-200 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 text-[12px]">
        <DataRow label="Nautical miles" value={`${distance.nauticalMiles.toLocaleString()} nm`} />
        <DataRow label="CO₂e (well-to-wake)" value={`${co2.kgCO2e.toLocaleString()} kg`} />
        <DataRow label="Tree offset · 1 yr" value={`${co2.treesNeeded} trees`} />
      </div>

      {/* Mobile CTA */}
      <Link
        href={routeUrl}
        className="sm:hidden flex items-center justify-center gap-2 h-10 bg-[#0B2447] text-white text-[13px] font-medium border-t border-slate-200 hover:bg-[#1A3160] transition-colors"
      >
        View full report
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}

function Metric({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="px-4 sm:px-5 py-3.5">
      <div className="text-[10.5px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-1">
        {label}
      </div>
      <div className="flex items-baseline gap-1 font-mono tabular-nums">
        <span className="text-[22px] font-semibold text-[#0B2447] leading-none">{value}</span>
        {unit && <span className="text-[11.5px] text-slate-500 font-sans">{unit}</span>}
      </div>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="px-4 sm:px-5 py-2.5 flex items-baseline justify-between gap-3">
      <span className="text-[10.5px] uppercase tracking-[0.1em] text-slate-500 font-semibold whitespace-nowrap">
        {label}
      </span>
      <span className="text-[12.5px] text-[#0B2447] tabular-nums text-right min-w-0">
        {value}
      </span>
    </div>
  );
}
