import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
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

interface PageProps {
  params: Promise<{ iata: string }>;
}

export const revalidate = 86400; // revalidate daily

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { iata } = await params;
  const airport = getAirportByIata(iata);

  if (!airport) return { title: 'Airport Not Found' };

  return {
    title: `${airport.name} (${airport.iata.toUpperCase()}) - ${airport.city}, ${airport.country}`,
    description: `Airport information for ${airport.name} (${airport.iata.toUpperCase()}) in ${airport.city}, ${airport.country}. Find flight distances, routes, and more.`,
    alternates: { canonical: `/airport/${airport.iata.toLowerCase()}` },
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

  // Get nearby airports
  const nearbyAirports = getNearbyAirports(airport.latitude, airport.longitude, airport.iata, 8);

  // Get other airports in the same country (exclude current)
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
      answer: `The IATA code for ${airport.name} is ${airport.iata.toUpperCase()}${airport.icao ? `, and its ICAO code is ${airport.icao.toUpperCase()}` : ''}. The airport is located in ${airport.city}, ${airport.country}.`,
    },
    {
      question: `How many destinations can you fly to from ${airport.iata.toUpperCase()}?`,
      answer: `There are ${routeCount} direct destinations available from ${airport.name} (${airport.iata.toUpperCase()}) in ${airport.city}, ${airport.country}.`,
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
      addressCountry: airport.country
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

  // Route type badge color helper
  const getRouteTypeBadge = (type: string) => {
    switch (type) {
      case 'short-haul':
        return 'bg-green-100 text-green-800';
      case 'medium-haul':
        return 'bg-yellow-100 text-yellow-800';
      case 'long-haul':
        return 'bg-orange-100 text-orange-800';
      case 'ultra-long-haul':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <ol className="flex items-center gap-2 text-slate-600">
            <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
            <li>/</li>
            <li><Link href="/airports" className="hover:text-blue-600">Airports</Link></li>
            <li>/</li>
            <li><span className="text-slate-900">{airport.iata.toUpperCase()}</span></li>
          </ol>
        </nav>

        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xl">{airport.iata.toUpperCase()}</span>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              {airport.name}
            </h1>
            <p className="text-lg text-slate-600 mt-1">
              {airport.city}, {airport.country}
            </p>
          </div>
        </div>

        {/* Airport Overview Paragraph */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <p className="text-slate-700 leading-relaxed">
            {airport.name} ({airport.iata.toUpperCase()}) is an airport serving {airport.city}, {airport.country},
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 text-center">
            <div className="text-3xl font-bold text-blue-600">{routeCount}</div>
            <div className="text-sm text-slate-500 mt-1">Destinations</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 text-center">
            <div className="text-3xl font-bold text-blue-600">{airlines.length}</div>
            <div className="text-sm text-slate-500 mt-1">Airlines</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {airport.altitude ? airport.altitude.toLocaleString() : 'N/A'}
            </div>
            <div className="text-sm text-slate-500 mt-1">
              Elevation {airport.altitude ? `ft (${elevationM.toLocaleString()} m)` : ''}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {tzInfo ? tzInfo.utcOffset : 'N/A'}
            </div>
            <div className="text-sm text-slate-500 mt-1">
              {airport.timezone ? airport.timezone.replace(/_/g, ' ') : 'Timezone'}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Airport Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Airport Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-slate-500">IATA Code</div>
                  <div className="font-semibold text-slate-900">{airport.iata.toUpperCase()}</div>
                </div>
                {airport.icao && (
                  <div>
                    <div className="text-sm text-slate-500">ICAO Code</div>
                    <div className="font-semibold text-slate-900">{airport.icao.toUpperCase()}</div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-slate-500">City</div>
                  <div className="font-semibold text-slate-900">{airport.city}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Country</div>
                  <div className="font-semibold text-slate-900">{airport.country}</div>
                </div>
                {airport.altitude && (
                  <div>
                    <div className="text-sm text-slate-500">Elevation</div>
                    <div className="font-semibold text-slate-900">{airport.altitude.toLocaleString()} ft</div>
                  </div>
                )}
                {tzInfo && (
                  <div>
                    <div className="text-sm text-slate-500">Local Time</div>
                    <div className="font-semibold text-slate-900">{tzInfo.currentTime} ({tzInfo.utcOffset})</div>
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
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
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
                            <span className="font-semibold text-slate-900">
                              {route!.dest_iata.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 text-slate-600">
                            {route!.dest_airport?.city}, {route!.dest_airport?.country}
                          </td>
                          <td className="py-3 text-right text-slate-900">
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
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
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
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  Airlines Operating at {airport.iata.toUpperCase()}
                </h2>
                <p className="text-sm text-slate-600 mb-4">
                  {airlines.length} active airline{airlines.length !== 1 ? 's' : ''} serving {airport.name}.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {airlines.map((airline) => (
                    <div
                      key={airline.id}
                      className="border border-slate-200 rounded-lg p-3 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className="font-semibold text-slate-900 text-sm">{airline.name}</div>
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
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">
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
                        <td className="py-3 text-right text-slate-900 font-medium">
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
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
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
                                className="font-semibold text-blue-600 hover:text-blue-700"
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
                            <td className="py-3 text-right text-slate-900">
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
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  Other Airports in {airport.country}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {countryAirports.map((ca) => (
                    <Link
                      key={ca.iata}
                      href={`/airport/${ca.iata}`}
                      className="border border-slate-200 rounded-lg p-3 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className="font-semibold text-slate-900 text-sm">{ca.name}</div>
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
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Geographic &amp; Timezone Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Position</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Latitude (DMS)</dt>
                      <dd className="font-mono text-slate-900">{dmsCoords.latitude}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Longitude (DMS)</dt>
                      <dd className="font-mono text-slate-900">{dmsCoords.longitude}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Latitude (Decimal)</dt>
                      <dd className="font-mono text-slate-900">{airport.latitude.toFixed(6)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Longitude (Decimal)</dt>
                      <dd className="font-mono text-slate-900">{airport.longitude.toFixed(6)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Hemisphere</dt>
                      <dd className="text-slate-900">{latHemisphere} / {lngHemisphere}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Timezone</h3>
                  <dl className="space-y-2 text-sm">
                    {airport.timezone && (
                      <div className="flex justify-between">
                        <dt className="text-slate-500">IANA Timezone</dt>
                        <dd className="text-slate-900">{airport.timezone}</dd>
                      </div>
                    )}
                    {tzInfo && (
                      <>
                        <div className="flex justify-between">
                          <dt className="text-slate-500">UTC Offset</dt>
                          <dd className="font-mono text-slate-900">{tzInfo.utcOffset}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-500">Current Local Time</dt>
                          <dd className="text-slate-900">{tzInfo.currentTime}</dd>
                        </div>
                      </>
                    )}
                    {airport.altitude != null && (
                      <>
                        <div className="flex justify-between">
                          <dt className="text-slate-500">Elevation (ft)</dt>
                          <dd className="text-slate-900">{airport.altitude.toLocaleString()} ft</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-500">Elevation (m)</dt>
                          <dd className="text-slate-900">{elevationM.toLocaleString()} m</dd>
                        </div>
                      </>
                    )}
                  </dl>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqItems.map((faq, index) => (
                  <details
                    key={index}
                    className="group border border-slate-200 rounded-lg"
                  >
                    <summary className="flex items-center justify-between cursor-pointer p-4 text-sm font-medium text-slate-900 hover:bg-slate-50 rounded-lg">
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
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Explore More
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href={`/?from=${airport.iata}`}
                  className="block border border-slate-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="font-semibold text-slate-900 text-sm">Distance Calculator</div>
                  <p className="text-xs text-slate-500 mt-1">
                    Calculate distance from {airport.iata.toUpperCase()} to any airport
                  </p>
                </Link>
                <Link
                  href="/airports"
                  className="block border border-slate-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="font-semibold text-slate-900 text-sm">Airports Directory</div>
                  <p className="text-xs text-slate-500 mt-1">
                    Browse all airports worldwide
                  </p>
                </Link>
                <Link
                  href="/about"
                  className="block border border-slate-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="font-semibold text-slate-900 text-sm">About Air Miles Calculator</div>
                  <p className="text-xs text-slate-500 mt-1">
                    Learn about our data sources and methodology
                  </p>
                </Link>
              </div>
            </div>

            {/* External Links / References */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                External References
              </h2>
              <p className="text-sm text-slate-600 mb-4">
                Learn more about {airport.name} from these external sources.
              </p>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href={`https://en.wikipedia.org/wiki/${airport.name.replace(/ /g, '_')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 hover:underline"
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
                    className="text-blue-600 hover:text-blue-700 hover:underline"
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
                    className="text-blue-600 hover:text-blue-700 hover:underline"
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
                    className="text-blue-600 hover:text-blue-700 hover:underline"
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

            {/* Quick Distance Calculator */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">
                Calculate Distance from {airport.iata.toUpperCase()}
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                Use our calculator to find the distance from {airport.city} to any airport worldwide.
              </p>
              <Link
                href={`/?from=${airport.iata}`}
                className="block w-full text-center py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Open Calculator
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
