'use client';

import dynamic from 'next/dynamic';

export interface MapAirport {
  iata: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  /** 1-based rank among the country's busiest hubs by route count. If set, marker
   *  is drawn as a larger numbered badge and rendered above the unranked dots. */
  rank?: number;
  /** Optional route count, shown in the popup if provided. */
  routeCount?: number;
}

export interface AirportMapProps {
  airports: MapAirport[];
  height?: number;
  /** Used when there's a single airport — controls the initial zoom level (city-level by default). */
  singleZoom?: number;
  /** When true and ≥1 airport has a rank, renders a small in-map legend explaining the numbered pins. */
  showRankLegend?: boolean;
}

const AirportMapClient = dynamic(() => import('./AirportMapClient'), {
  ssr: false,
  loading: () => (
    <div className="w-full bg-slate-100 border border-slate-200 rounded-md flex items-center justify-center text-[12px] text-slate-500 font-mono uppercase tracking-[0.12em]" style={{ height: 380 }}>
      Loading map…
    </div>
  ),
});

export default function AirportMap(props: AirportMapProps) {
  return <AirportMapClient {...props} />;
}
