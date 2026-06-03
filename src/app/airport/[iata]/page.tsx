import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import AirportPageCalculator from '@/components/calculator/AirportPageCalculator';
import {
  getAirportByIata,
  getPopularRoutesFrom,
  getNearbyAirports,
  getAirlinesAtAirport,
  getRouteCountForAirport,
  getAirportsByCountry,
} from '@/lib/queries';
import {
  calculateDistance,
  calculateFlightTime,
  getTimezoneInfo,
  formatCoordinatesDMS,
  classifyRoute,
  calculateCO2,
} from '@/lib/calculations';
import GlobeWrapper from '@/components/globe/GlobeWrapper';
import AirportMap from '@/components/maps/AirportMap';
import { displayCountryName } from '@/lib/country';
import { slugify } from '@/lib/slug';
import { InternalLinks, Sources, Callout } from '@/components/content/blocks';
import { ogImageMeta, twitterMeta } from '@/lib/og';

interface PageProps {
  params: Promise<{ iata: string }>;
}

export const revalidate = 86400; // revalidate daily

// Match the sitemap thin-page threshold: airports with fewer than this many
// outbound routes are excluded from sitemap (see sitemap.ts) AND emit a
// noindex meta robots tag so they don't compete for SERP placement against
// substantive airport pages.
const MIN_ROUTES_FOR_INDEX = 3;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { iata } = await params;
  const airport = getAirportByIata(iata);

  if (!airport) return { title: 'Airport Not Found' };

  const displayedCountry = displayCountryName(airport.country);
  const ogTitle = `${airport.iata.toUpperCase()} — ${airport.city}`;
  const ogSubtitle = `${airport.name}, ${displayedCountry} · ${airport.latitude.toFixed(2)}°, ${airport.longitude.toFixed(2)}°`;

  // Thin-content gating: count outbound routes; if below the threshold,
  // emit a noindex,follow robots directive so crawlers can still follow
  // outgoing links but don't index this page itself.
  const routeCount = getRouteCountForAirport(airport.iata);
  const isThin = routeCount < MIN_ROUTES_FOR_INDEX;

  return {
    title: `${airport.name} (${airport.iata.toUpperCase()}) - ${airport.city}, ${displayedCountry}`,
    description: `Airport information for ${airport.name} (${airport.iata.toUpperCase()}) in ${airport.city}, ${displayedCountry}. Find flight distances, routes, and more.`,
    alternates: { canonical: `/airport/${airport.iata.toLowerCase()}` },
    ...(isThin && { robots: { index: false, follow: true } }),
    openGraph: {
      title: `${airport.iata.toUpperCase()} — ${airport.city} — AirMilesCalc`,
      description: `${airport.name} in ${airport.city}, ${displayedCountry}. Flight distances, routes, and CO₂.`,
      url: `/airport/${airport.iata.toLowerCase()}`,
      type: 'website',
      images: ogImageMeta({ title: ogTitle, subtitle: ogSubtitle, category: 'Airport' }),
    },
    twitter: twitterMeta({ title: ogTitle, subtitle: ogSubtitle, category: 'Airport' }),
  };
}

export default async function AirportPage({ params }: PageProps) {
  const { iata } = await params;
  const airport = getAirportByIata(iata.toLowerCase());

  if (!airport) notFound();

  // Get popular routes from this airport
  const routes = getPopularRoutesFrom(airport.iata, 10);

  // Calculate distances for routes
  const routesWithDistance = routes.map(route => {
    if (!route.dest_airport) return null;
    const distance = calculateDistance(
      airport.latitude, airport.longitude,
      route.dest_airport.latitude, route.dest_airport.longitude
    );
    const flightTime = calculateFlightTime(distance.km);
    const co2 = calculateCO2(distance.km);
    const routeType = classifyRoute(distance.km);
    return {
      ...route,
      distance,
      flightTime,
      co2,
      routeType,
    };
  }).filter(Boolean);

  // Get timezone info
  const tzInfo = airport.timezone ? getTimezoneInfo(airport.timezone) : null;

  // Get DMS coordinates
  const dmsCoords = formatCoordinatesDMS(airport.latitude, airport.longitude);

  // Get key stats
  const routeCount = getRouteCountForAirport(airport.iata);
  const airlines = getAirlinesAtAirport(airport.iata);

  // Canonical/modern country name for all UI + SEO mentions; the raw stored
  // value is still the DB join key for getAirportsByCountry().
  const displayedCountry = displayCountryName(airport.country);

  // Get nearby airports
  const nearbyAirports = getNearbyAirports(airport.latitude, airport.longitude, airport.iata, 8);

  // Get other airports in the same country (exclude current). Uses the stored
  // value, not the display override — this is the DB key.
  const countryAirports = getAirportsByCountry(airport.country, 13).filter(
    a => a.iata !== airport.iata
  ).slice(0, 12);

  // Hemisphere info
  const latHemisphere = airport.latitude >= 0 ? 'Northern' : 'Southern';
  const lngHemisphere = airport.longitude >= 0 ? 'Eastern' : 'Western';

  // Elevation in meters
  const elevationFt = airport.altitude ?? 0;
  const elevationM = Math.round(elevationFt * 0.3048);

  // CO2 reference samples
  const co2Samples = [
    { label: 'Short-haul', km: 800, type: 'short-haul' as const },
    { label: 'Medium-haul', km: 3000, type: 'medium-haul' as const },
    { label: 'Long-haul', km: 8000, type: 'long-haul' as const },
  ].map(s => ({
    ...s,
    economy: calculateCO2(s.km, 'economy'),
    premiumEconomy: calculateCO2(s.km, 'premium_economy'),
    business: calculateCO2(s.km, 'business'),
    first: calculateCO2(s.km, 'first'),
  }));

  // FAQ data
  const faqItems = [
    {
      question: `What is the IATA code for ${airport.name}?`,
      answer: `The IATA code for ${airport.name} is ${airport.iata.toUpperCase()}${airport.icao ? `, and its ICAO code is ${airport.icao.toUpperCase()}` : ''}. The airport is located in ${airport.city}, ${displayedCountry}.`,
    },
    {
      question: `How many destinations can you fly to from ${airport.iata.toUpperCase()}?`,
      answer: `There are ${routeCount} direct destinations available from ${airport.name} (${airport.iata.toUpperCase()}) in ${airport.city}, ${displayedCountry}.`,
    },
    {
      question: `What airlines fly from ${airport.iata.toUpperCase()}?`,
      answer: airlines.length > 0
        ? `There are ${airlines.length} airlines operating from ${airport.iata.toUpperCase()}, including ${airlines.slice(0, 5).map(a => a.name).join(', ')}${airlines.length > 5 ? ', and more' : ''}.`
        : `Airline information for ${airport.iata.toUpperCase()} is currently not available in our database.`,
    },
    {
      question: `What timezone is ${airport.name} in?`,
      answer: airport.timezone
        ? `${airport.name} is in the ${airport.timezone} timezone${tzInfo ? ` (${tzInfo.utcOffset})` : ''}. The airport is located in the ${latHemisphere} and ${lngHemisphere} hemispheres.`
        : `Timezone information for ${airport.name} is currently not available.`,
    },
    {
      question: `What is the elevation of ${airport.name}?`,
      answer: airport.altitude
        ? `${airport.name} sits at an elevation of ${airport.altitude.toLocaleString()} feet (${elevationM.toLocaleString()} meters) above sea level.`
        : `Elevation data for ${airport.name} is currently not available.`,
    },
  ];

  // Airport schema
  const airportSchema = {
    '@context': 'https://schema.org',
    '@type': 'Airport',
    name: airport.name,
    iataCode: airport.iata.toUpperCase(),
    icaoCode: airport.icao?.toUpperCase(),
    address: {
      '@type': 'PostalAddress',
      addressLocality: airport.city,
      addressCountry: displayedCountry
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: airport.latitude,
      longitude: airport.longitude,
      elevation: airport.altitude ? `${airport.altitude} feet` : undefined
    }
  };

  // FAQ schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  // BreadcrumbList schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://airmilescalc.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Airports',
        item: 'https://airmilescalc.com/airports',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${airport.iata.toUpperCase()} — ${airport.name}`,
        item: `https://airmilescalc.com/airport/${airport.iata.toLowerCase()}`,
      },
    ],
  };

  // Route type badge color helper
  const getRouteTypeBadge = (type: string) => {
    switch (type) {
      case 'short-haul':
        return 'bg-emerald-50 text-emerald-800 border border-emerald-200';
      case 'medium-haul':
        return 'bg-[#EEF2F7] text-[#0B2447] border border-slate-200';
      case 'long-haul':
        return 'bg-amber-50 text-amber-900 border border-amber-200';
      case 'ultra-long-haul':
        return 'bg-red-50 text-red-800 border border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(airportSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-6xl mx-auto px-5 pt-5">
        {/* Breadcrumb */}
        <nav className="text-[11.5px] uppercase tracking-[0.1em] font-mono mb-5">
          <ol className="flex items-center gap-1.5 text-slate-500">
            <li><Link href="/" className="hover:text-[#0B2447]">Home</Link></li>
            <li className="text-slate-300">/</li>
            <li><Link href="/airports" className="hover:text-[#0B2447]">Airports</Link></li>
            <li className="text-slate-300">/</li>
            <li><span className="text-[#0B2447]">{airport.iata.toUpperCase()}</span></li>
          </ol>
        </nav>

        {/* Header */}
        <div className="flex items-start gap-3 mb-6 pb-5 border-b border-slate-200">
          <div className="flex-shrink-0 px-3 py-2 bg-[#0B2447] rounded-md">
            <span className="text-white font-mono tabular-nums font-semibold text-[18px] tracking-wider">
              {airport.iata.toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-[22px] md:text-[26px] font-semibold text-[#0B2447] tracking-tight leading-tight">
              {airport.name}
            </h1>
            <p className="text-[13.5px] text-slate-600 mt-0.5">
              {airport.city} · {displayedCountry}
              {airport.icao && (
                <span className="ml-2 text-[10.5px] font-mono uppercase tracking-[0.1em] text-slate-400">
                  ICAO {airport.icao}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Airport Overview Paragraph */}
        <div className="bg-white rounded-md border border-slate-200 p-5 mb-6">
          <p className="text-[13.5px] text-slate-700 leading-relaxed">
            {airport.name} ({airport.iata.toUpperCase()}) is an airport serving {airport.city}, {displayedCountry},
            located in the {latHemisphere} and {lngHemisphere} hemispheres at coordinates {dmsCoords.latitude}, {dmsCoords.longitude}.
            {airport.altitude
              ? ` The airport sits at an elevation of ${airport.altitude.toLocaleString()} feet (${elevationM.toLocaleString()} meters) above sea level.`
              : ''}
            {routeCount > 0
              ? ` With ${routeCount} direct destinations served by ${airlines.length} airline${airlines.length !== 1 ? 's' : ''}, it is a ${routeCount > 100 ? 'major international' : routeCount > 30 ? 'significant regional' : 'regional'} hub for air travel.`
              : ''}
            {tzInfo
              ? ` The local timezone is ${airport.timezone} (${tzInfo.utcOffset}).`
              : ''}
          </p>
        </div>

        {/* Key Statistics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 border border-slate-200 rounded-md bg-white divide-x divide-y md:divide-y-0 divide-slate-200 mb-6">
          <div className="px-4 py-3.5">
            <div className="text-[10.5px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-1">Destinations</div>
            <div className="text-[22px] font-semibold text-[#0B2447] font-mono tabular-nums leading-none">{routeCount}</div>
          </div>
          <div className="px-4 py-3.5">
            <div className="text-[10.5px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-1">Airlines</div>
            <div className="text-[22px] font-semibold text-[#0B2447] font-mono tabular-nums leading-none">{airlines.length}</div>
          </div>
          <div className="px-4 py-3.5">
            <div className="text-[10.5px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-1">
              Elevation {airport.altitude ? <span className="font-mono normal-case tracking-normal text-slate-400">ft</span> : ''}
            </div>
            <div className="text-[22px] font-semibold text-[#0B2447] font-mono tabular-nums leading-none">
              {airport.altitude ? airport.altitude.toLocaleString() : 'N/A'}
              {airport.altitude && <span className="text-[12px] text-slate-500 ml-1">/ {elevationM.toLocaleString()}m</span>}
            </div>
          </div>
          <div className="px-4 py-3.5">
            <div className="text-[10.5px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-1">
              {airport.timezone ? airport.timezone.replace(/_/g, ' ') : 'Timezone'}
            </div>
            <div className="text-[22px] font-semibold text-[#0B2447] font-mono tabular-nums leading-none">
              {tzInfo ? tzInfo.utcOffset : 'N/A'}
            </div>
          </div>
        </div>

        {/* Airport location map */}
        <div className="mb-6">
          <AirportMap
            airports={[{
              iata: airport.iata,
              name: airport.name,
              city: airport.city,
              latitude: airport.latitude,
              longitude: airport.longitude,
            }]}
            height={340}
            singleZoom={10}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Airport Details */}
            <div className="bg-white rounded-md border border-slate-200 p-5">
              <h2 className="text-[15px] font-semibold text-[#0B2447] tracking-tight mb-4">Airport Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-[10.5px] uppercase tracking-[0.1em] text-slate-500 font-semibold">IATA Code</div>
                  <div className="font-semibold text-[#0B2447]">{airport.iata.toUpperCase()}</div>
                </div>
                {airport.icao && (
                  <div>
                    <div className="text-[10.5px] uppercase tracking-[0.1em] text-slate-500 font-semibold">ICAO Code</div>
                    <div className="font-semibold text-[#0B2447]">{airport.icao.toUpperCase()}</div>
                  </div>
                )}
                <div>
                  <div className="text-[10.5px] uppercase tracking-[0.1em] text-slate-500 font-semibold">City</div>
                  <div className="font-semibold text-[#0B2447]">{airport.city}</div>
                </div>
                <div>
                  <div className="text-[10.5px] uppercase tracking-[0.1em] text-slate-500 font-semibold">Country</div>
                  <div className="font-semibold text-[#0B2447]">{displayedCountry}</div>
                </div>
                {airport.altitude && (
                  <div>
                    <div className="text-[10.5px] uppercase tracking-[0.1em] text-slate-500 font-semibold">Elevation</div>
                    <div className="font-semibold text-[#0B2447]">{airport.altitude.toLocaleString()} ft</div>
                  </div>
                )}
                {tzInfo && (
                  <div>
                    <div className="text-[10.5px] uppercase tracking-[0.1em] text-slate-500 font-semibold">Local Time</div>
                    <div className="font-semibold text-[#0B2447]">{tzInfo.currentTime} ({tzInfo.utcOffset})</div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="text-sm font-medium text-slate-700 mb-2">Coordinates</h3>
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="text-slate-500">Latitude:</span>
                    <span className="ml-2 font-mono">{airport.latitude.toFixed(4)}°</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Longitude:</span>
                    <span className="ml-2 font-mono">{airport.longitude.toFixed(4)}°</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Popular Routes */}
            {routesWithDistance.length > 0 && (
              <div className="bg-white rounded-md border border-slate-200 p-5">
                <h2 className="text-[15px] font-semibold text-[#0B2447] tracking-tight mb-4">
                  Popular Routes from {airport.iata.toUpperCase()}
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-slate-600 border-b border-slate-200">
                        <th className="pb-3 font-medium">Destination</th>
                        <th className="pb-3 font-medium">City</th>
                        <th className="pb-3 font-medium text-right">Distance</th>
                        <th className="pb-3 font-medium text-right">Flight Time</th>
                        <th className="pb-3 font-medium text-center">Type</th>
                        <th className="pb-3 font-medium text-right">CO2 (Economy)</th>
                        <th className="pb-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {routesWithDistance.map((route) => (
                        <tr key={route!.dest_iata} className="hover:bg-slate-50">
                          <td className="py-3">
                            <span className="font-semibold text-[#0B2447]">
                              {route!.dest_iata.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 text-slate-600">
                            {route!.dest_airport?.city}, {route!.dest_airport?.country}
                          </td>
                          <td className="py-3 text-right text-[#0B2447]">
                            {route!.distance.miles.toLocaleString()} mi
                          </td>
                          <td className="py-3 text-right text-slate-600">
                            {route!.flightTime.display}
                          </td>
                          <td className="py-3 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getRouteTypeBadge(route!.routeType.type)}`}>
                              {route!.routeType.type}
                            </span>
                          </td>
                          <td className="py-3 text-right text-slate-600">
                            {route!.co2.kgCO2} kg
                          </td>
                          <td className="py-3 text-right">
                            <Link
                              href={`/distance/${airport.iata}-to-${route!.dest_iata}`}
                              className="text-[#0B2447] hover:text-[#1A3160] text-sm font-medium"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Airlines Operating Here */}
            {airlines.length > 0 && (
              <div className="bg-white rounded-md border border-slate-200 p-5">
                <h2 className="text-[15px] font-semibold text-[#0B2447] tracking-tight mb-4">
                  Airlines Operating at {airport.iata.toUpperCase()}
                </h2>
                <p className="text-sm text-slate-600 mb-4">
                  {airlines.length} active airline{airlines.length !== 1 ? 's' : ''} serving {airport.name}.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {airlines.map((airline) => (
                    <div
                      key={airline.id}
                      className="border border-slate-200 rounded-md p-2.5 hover:border-[#0B2447]/40 hover:bg-stone-50 transition-colors"
                    >
                      <div className="font-semibold text-[#0B2447] text-sm">{airline.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          {airline.iata.toUpperCase()}
                        </span>
                        {airline.country && (
                          <span className="text-xs text-slate-500">{airline.country}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CO2 Emissions Reference Table */}
            <div className="bg-white rounded-md border border-slate-200 p-5">
              <h2 className="text-[15px] font-semibold text-[#0B2447] tracking-tight mb-2">
                CO2 Emissions Reference
              </h2>
              <p className="text-sm text-slate-600 mb-4">
                Estimated carbon dioxide emissions per passenger for sample flight distances, based on DEFRA 2024 emission factors.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-slate-600 border-b border-slate-200">
                      <th className="pb-3 font-medium">Route Type</th>
                      <th className="pb-3 font-medium text-right">Distance</th>
                      <th className="pb-3 font-medium text-right">Economy</th>
                      <th className="pb-3 font-medium text-right">Premium Eco</th>
                      <th className="pb-3 font-medium text-right">Business</th>
                      <th className="pb-3 font-medium text-right">First</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {co2Samples.map((sample) => (
                      <tr key={sample.km} className="hover:bg-slate-50">
                        <td className="py-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getRouteTypeBadge(sample.type)}`}>
                            {sample.label}
                          </span>
                        </td>
                        <td className="py-3 text-right text-[#0B2447] font-medium">
                          {sample.km.toLocaleString()} km
                        </td>
                        <td className="py-3 text-right text-slate-600">
                          {sample.economy.kgCO2} kg
                        </td>
                        <td className="py-3 text-right text-slate-600">
                          {sample.premiumEconomy.kgCO2} kg
                        </td>
                        <td className="py-3 text-right text-slate-600">
                          {sample.business.kgCO2} kg
                        </td>
                        <td className="py-3 text-right text-slate-600">
                          {sample.first.kgCO2} kg
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-400 mt-3">
                Values are estimates based on average emission factors. Actual emissions vary by aircraft type, load factor, and routing.
              </p>
            </div>

            {/* Nearby Airports */}
            {nearbyAirports.length > 0 && (
              <div className="bg-white rounded-md border border-slate-200 p-5">
                <h2 className="text-[15px] font-semibold text-[#0B2447] tracking-tight mb-4">
                  Nearby Airports
                </h2>
                <p className="text-sm text-slate-600 mb-4">
                  Airports closest to {airport.name} that may serve as alternatives.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-slate-600 border-b border-slate-200">
                        <th className="pb-3 font-medium">Airport</th>
                        <th className="pb-3 font-medium">IATA</th>
                        <th className="pb-3 font-medium">City</th>
                        <th className="pb-3 font-medium">Country</th>
                        <th className="pb-3 font-medium text-right">Distance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {nearbyAirports.map((nearby) => {
                        const dist = calculateDistance(
                          airport.latitude, airport.longitude,
                          nearby.latitude, nearby.longitude
                        );
                        return (
                          <tr key={nearby.iata} className="hover:bg-slate-50">
                            <td className="py-3">
                              <Link
                                href={`/airport/${nearby.iata}`}
                                className="font-semibold text-[#0B2447] hover:text-[#1A3160]"
                              >
                                {nearby.name}
                              </Link>
                            </td>
                            <td className="py-3">
                              <span className="font-mono text-sm text-slate-700">
                                {nearby.iata.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-3 text-slate-600">{nearby.city}</td>
                            <td className="py-3 text-slate-600">{nearby.country}</td>
                            <td className="py-3 text-right text-[#0B2447]">
                              {dist.km.toLocaleString()} km
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Other Airports in Country */}
            {countryAirports.length > 0 && (
              <div className="bg-white rounded-md border border-slate-200 p-5">
                <h2 className="text-[15px] font-semibold text-[#0B2447] tracking-tight mb-4">
                  Other Airports in {displayedCountry}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {countryAirports.map((ca) => (
                    <Link
                      key={ca.iata}
                      href={`/airport/${ca.iata}`}
                      className="border border-slate-200 rounded-md p-2.5 hover:border-[#0B2447]/40 hover:bg-stone-50 transition-colors"
                    >
                      <div className="font-semibold text-[#0B2447] text-sm">{ca.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          {ca.iata.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-500">{ca.city}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Geographic & Timezone Details */}
            <div className="bg-white rounded-md border border-slate-200 p-5">
              <h2 className="text-[15px] font-semibold text-[#0B2447] tracking-tight mb-4">
                Geographic &amp; Timezone Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Position</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Latitude (DMS)</dt>
                      <dd className="font-mono text-[#0B2447]">{dmsCoords.latitude}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Longitude (DMS)</dt>
                      <dd className="font-mono text-[#0B2447]">{dmsCoords.longitude}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Latitude (Decimal)</dt>
                      <dd className="font-mono text-[#0B2447]">{airport.latitude.toFixed(6)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Longitude (Decimal)</dt>
                      <dd className="font-mono text-[#0B2447]">{airport.longitude.toFixed(6)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Hemisphere</dt>
                      <dd className="text-[#0B2447]">{latHemisphere} / {lngHemisphere}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Timezone</h3>
                  <dl className="space-y-2 text-sm">
                    {airport.timezone && (
                      <div className="flex justify-between">
                        <dt className="text-slate-500">IANA Timezone</dt>
                        <dd className="text-[#0B2447]">{airport.timezone}</dd>
                      </div>
                    )}
                    {tzInfo && (
                      <>
                        <div className="flex justify-between">
                          <dt className="text-slate-500">UTC Offset</dt>
                          <dd className="font-mono text-[#0B2447]">{tzInfo.utcOffset}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-500">Current Local Time</dt>
                          <dd className="text-[#0B2447]">{tzInfo.currentTime}</dd>
                        </div>
                      </>
                    )}
                    {airport.altitude != null && (
                      <>
                        <div className="flex justify-between">
                          <dt className="text-slate-500">Elevation (ft)</dt>
                          <dd className="text-[#0B2447]">{airport.altitude.toLocaleString()} ft</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-500">Elevation (m)</dt>
                          <dd className="text-[#0B2447]">{elevationM.toLocaleString()} m</dd>
                        </div>
                      </>
                    )}
                  </dl>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-md border border-slate-200 p-5">
              <h2 className="text-[15px] font-semibold text-[#0B2447] tracking-tight mb-4">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqItems.map((faq, index) => (
                  <details
                    key={index}
                    className="group border border-slate-200 rounded-md"
                  >
                    <summary className="flex items-center justify-between cursor-pointer p-3.5 text-[13px] font-medium text-[#0B2447] hover:bg-stone-50 rounded-md">
                      <span>{faq.question}</span>
                      <span className="ml-4 flex-shrink-0 text-slate-400 group-open:rotate-180 transition-transform">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </summary>
                    <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>

            {/* Interlinking Block */}
            <Callout type="note" term="Airport data provenance">
              Coordinates, IATA / ICAO codes, city, country, and time zone for {airport.name} are sourced from OpenFlights, the community-maintained open aviation database. Distance, flight time, and CO₂e for routes from {airport.iata.toUpperCase()} are computed using Vincenty on WGS-84 and the DESNZ 2024 conversion factors. See <Link href="/methodology" className="text-blue-700 hover:underline underline-offset-2 font-medium">/methodology</Link> for every formula and primary source.
            </Callout>

            <InternalLinks
              heading={`Dig deeper from ${airport.iata.toUpperCase()}`}
              links={[
                {
                  href: `/?from=${airport.iata}`,
                  title: 'Distance calculator',
                  description: `Compute distance from ${airport.iata.toUpperCase()} to any other airport, with CO₂ and flight time.`,
                },
                {
                  href: `/airports/${slugify(airport.country)}`,
                  title: `Airports in ${displayedCountry}`,
                  description: `Browse the full list of ${displayedCountry} airports and their hub rankings.`,
                },
                {
                  href: '/airports',
                  title: 'Airport directory',
                  description: 'Browse the 3,000-plus commercial airports worldwide.',
                },
                {
                  href: '/methodology',
                  title: 'Methodology & sources',
                  description: 'Vincenty on WGS-84, DEFRA 2024, Lee 2021 — every formula and primary source.',
                },
                {
                  href: '/learn/airline-alliances',
                  title: 'Airline alliances',
                  description: 'Star, oneworld, SkyTeam — the alliances that operate most international routes from major hubs.',
                },
                {
                  href: '/learn/busiest-airports-in-the-world',
                  title: "World's busiest airports",
                  description: 'ACI World 2023 top ten by passenger traffic and where this airport sits in the global rank.',
                },
              ]}
            />

            {/* External Links / References */}
            <div className="bg-white rounded-md border border-slate-200 p-5">
              <h2 className="text-[15px] font-semibold text-[#0B2447] tracking-tight mb-4">
                External References
              </h2>
              <p className="text-sm text-slate-600 mb-4">
                Learn more about {airport.name} from these external sources.
              </p>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href={`https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(airport.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0B2447] hover:text-[#1A3160] hover:underline"
                  >
                    {airport.name} on Wikipedia
                  </a>
                  <span className="text-slate-400 ml-1">&#8599;</span>
                </li>
                <li>
                  <a
                    href="https://www.iata.org/en/publications/directories/code-search/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0B2447] hover:text-[#1A3160] hover:underline"
                  >
                    IATA Airport Code Search
                  </a>
                  <span className="text-slate-400 ml-1">&#8599;</span>
                </li>
                <li>
                  <a
                    href="https://openflights.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0B2447] hover:text-[#1A3160] hover:underline"
                  >
                    OpenFlights Airport Database
                  </a>
                  <span className="text-slate-400 ml-1">&#8599;</span>
                </li>
                <li>
                  <a
                    href="https://www.timeanddate.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0B2447] hover:text-[#1A3160] hover:underline"
                  >
                    timeanddate.com - World Clocks &amp; Timezones
                  </a>
                  <span className="text-slate-400 ml-1">&#8599;</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Globe */}
          <div className="space-y-6">
            <GlobeWrapper
              fromLat={airport.latitude}
              fromLng={airport.longitude}
              fromName={`${airport.city} (${airport.iata.toUpperCase()})`}
              height={350}
            />

            {/* Quick Distance Calculator (inline, from this airport) */}
            <AirportPageCalculator
              fromAirport={{
                iata: airport.iata,
                name: airport.name,
                city: airport.city,
                country: displayedCountry,
                latitude: airport.latitude,
                longitude: airport.longitude,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
