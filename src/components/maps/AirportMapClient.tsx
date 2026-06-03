'use client';

import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import L, { LatLngBoundsExpression, LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { AirportMapProps } from './AirportMap';

const PIN_HTML = `<div style="
  width: 14px; height: 14px; border-radius: 50%;
  background: #0B2447; border: 2px solid white;
  box-shadow: 0 1px 4px rgba(0,0,0,0.35);
"></div>`;

const PIN_HTML_LARGE = `<div style="
  width: 22px; height: 22px; border-radius: 50%;
  background: #DC2626; border: 3px solid white;
  box-shadow: 0 2px 6px rgba(0,0,0,0.45);
"></div>`;

function rankedPinHtml(rank: number): string {
  return `<div style="
    width: 28px; height: 28px; border-radius: 50%;
    background: #DC2626; border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.45);
    color: white; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 14px; line-height: 1;
  ">${rank}</div>`;
}

function buildIcon(html: string, size: number): L.DivIcon {
  return L.divIcon({
    className: '',
    html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function AirportMapClient({
  airports,
  height = 380,
  singleZoom = 9,
  showRankLegend = true,
}: AirportMapProps) {
  const isSingle = airports.length === 1;
  const hasRanks = airports.some((a) => a.rank !== undefined);

  // Render order: unranked dots first, then ranked pins, so numbered hubs always
  // sit on top of nearby small pins.
  const orderedAirports = useMemo(
    () => [...airports].sort((a, b) => (a.rank ?? 99999) - (b.rank ?? 99999)),
    [airports],
  );

  const { bounds, center, zoom } = useMemo(() => {
    if (airports.length === 0) {
      return { bounds: undefined, center: [0, 0] as LatLngTuple, zoom: 2 };
    }
    if (airports.length === 1) {
      const a = airports[0];
      return {
        bounds: undefined,
        center: [a.latitude, a.longitude] as LatLngTuple,
        zoom: singleZoom,
      };
    }

    // Outlier-resilient bounds via Tukey IQR fences on lat and lng independently.
    // Keeps overseas territories (e.g. SBH for France) on the map but excludes them
    // from the initial zoom-to-fit so the mainland reads at a useful scale.
    const quantile = (sortedArr: number[], q: number) => {
      const pos = (sortedArr.length - 1) * q;
      const lo = Math.floor(pos);
      const hi = Math.ceil(pos);
      return lo === hi
        ? sortedArr[lo]
        : sortedArr[lo] + (sortedArr[hi] - sortedArr[lo]) * (pos - lo);
    };
    const fence = (sortedArr: number[]): [number, number] => {
      const q1 = quantile(sortedArr, 0.25);
      const q3 = quantile(sortedArr, 0.75);
      const iqr = q3 - q1;
      return [q1 - 1.5 * iqr, q3 + 1.5 * iqr];
    };

    const latsSorted = [...airports.map((a) => a.latitude)].sort((x, y) => x - y);
    const lngsSorted = [...airports.map((a) => a.longitude)].sort((x, y) => x - y);
    const [latLo, latHi] = airports.length >= 4 ? fence(latsSorted) : [-Infinity, Infinity];
    const [lngLo, lngHi] = airports.length >= 4 ? fence(lngsSorted) : [-Infinity, Infinity];

    const core = airports.filter(
      (a) =>
        a.latitude >= latLo &&
        a.latitude <= latHi &&
        a.longitude >= lngLo &&
        a.longitude <= lngHi,
    );
    const fitSet = core.length >= 3 ? core : airports;

    const fitLats = fitSet.map((a) => a.latitude);
    const fitLngs = fitSet.map((a) => a.longitude);
    const b: LatLngBoundsExpression = [
      [Math.min(...fitLats), Math.min(...fitLngs)],
      [Math.max(...fitLats), Math.max(...fitLngs)],
    ];
    return { bounds: b, center: [0, 0] as LatLngTuple, zoom: 2 };
  }, [airports, singleZoom]);

  const smallIcon = useMemo(() => buildIcon(PIN_HTML, 14), []);
  const largeIcon = useMemo(() => buildIcon(PIN_HTML_LARGE, 22), []);
  const iconByRank = useMemo(() => {
    const map = new Map<number, L.DivIcon>();
    for (const a of airports) {
      if (a.rank !== undefined && !map.has(a.rank)) {
        map.set(a.rank, buildIcon(rankedPinHtml(a.rank), 28));
      }
    }
    return map;
  }, [airports]);

  if (airports.length === 0) {
    return (
      <div
        className="w-full bg-slate-100 border border-slate-200 rounded-md flex items-center justify-center text-[12px] text-slate-500"
        style={{ height }}
      >
        No airports to display.
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-md overflow-hidden border border-slate-200" style={{ height }}>
      <MapContainer
        bounds={bounds}
        center={bounds ? undefined : center}
        zoom={bounds ? undefined : zoom}
        boundsOptions={{ padding: [30, 30], maxZoom: 8 }}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {orderedAirports.map((a) => {
          const icon =
            a.rank !== undefined
              ? iconByRank.get(a.rank) ?? smallIcon
              : isSingle
                ? largeIcon
                : smallIcon;
          return (
            <Marker
              key={a.iata}
              position={[a.latitude, a.longitude]}
              icon={icon}
              zIndexOffset={a.rank !== undefined ? 1000 - a.rank : 0}
            >
              <Tooltip direction="top" offset={[0, a.rank !== undefined ? -14 : -8]} opacity={0.95} sticky>
                {a.rank !== undefined && (
                  <span
                    style={{
                      display: 'inline-block',
                      background: '#DC2626',
                      color: 'white',
                      borderRadius: 3,
                      padding: '1px 5px',
                      marginRight: 6,
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    #{a.rank}
                  </span>
                )}
                <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontWeight: 600 }}>
                  {a.iata.toUpperCase()}
                </span>
                {' · '}
                {a.name}
              </Tooltip>
              <Popup>
                <div style={{ minWidth: 200 }}>
                  <div style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {a.rank !== undefined && (
                      <span
                        style={{
                          background: '#DC2626',
                          color: 'white',
                          borderRadius: 4,
                          padding: '2px 7px',
                          fontWeight: 700,
                          fontSize: 11,
                          letterSpacing: '0.04em',
                        }}
                        title={`Rank #${a.rank} in this country by scheduled-route count`}
                      >
                        #{a.rank}
                      </span>
                    )}
                    <span
                      style={{
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                        fontWeight: 600,
                        background: '#F1F5F9',
                        border: '1px solid #E2E8F0',
                        color: '#0B2447',
                        padding: '2px 6px',
                        borderRadius: 4,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {a.iata.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontWeight: 600, color: '#0B2447', lineHeight: 1.3 }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{a.city}</div>
                  <div style={{ fontSize: 11, color: '#64748B', fontFamily: 'monospace', marginTop: 4 }}>
                    {a.latitude.toFixed(4)}°, {a.longitude.toFixed(4)}°
                  </div>
                  {typeof a.routeCount === 'number' && a.routeCount > 0 && (
                    <div style={{ fontSize: 11, color: '#334155', marginTop: 4 }}>
                      <strong>{a.routeCount.toLocaleString()}</strong> scheduled{' '}
                      {a.routeCount === 1 ? 'route' : 'routes'}
                    </div>
                  )}
                  <a
                    href={`/airport/${a.iata.toLowerCase()}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      marginTop: 10,
                      color: '#0B2447',
                      fontWeight: 500,
                      fontSize: 12,
                      textDecoration: 'none',
                      borderBottom: '1px solid currentColor',
                      paddingBottom: 1,
                    }}
                  >
                    View airport details →
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      {showRankLegend && hasRanks && (
        <div
          className="absolute top-3 right-3 z-[400] bg-white/95 backdrop-blur-sm border border-slate-200 rounded-md px-3 py-2 shadow-sm text-[11px] text-slate-700 leading-tight pointer-events-none"
          style={{ maxWidth: 220 }}
        >
          <div className="flex items-center gap-1.5 font-semibold text-[#0B2447]">
            <span
              className="inline-flex items-center justify-center rounded-full text-white text-[10px] font-bold"
              style={{
                width: 16,
                height: 16,
                background: '#DC2626',
                border: '1.5px solid white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}
            >
              1
            </span>
            <span>Top 5 by route count</span>
          </div>
          <div className="text-slate-500 mt-1">Numbered pins rank the busiest hubs by scheduled-route network. Small dots are all other airports.</div>
        </div>
      )}
    </div>
  );
}
