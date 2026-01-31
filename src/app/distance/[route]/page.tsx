import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PrintButton } from '@/components/PrintButton';
import { getAirportByIata, getPopularRoutesFrom, getAirlinesForRoute, routeExists } from '@/lib/queries';
import {
  calculateDistance,
  calculateFlightTime,
  calculateCO2AllClasses,
  getTimezoneInfo,
  calculateTimeDifference,
  calculateBearing,
  classifyRoute,
  formatCoordinatesDMS,
  calculateMidpoint,
  calculateDrivingTime,
  calculateCruisingAltitude,
  getJetLagInfo,
  getSeatRecommendation,
  getDistanceComparisons,
  estimateFuelConsumption,
  getGeographicContext
} from '@/lib/calculations';
import GlobeWrapper from '@/components/globe/GlobeWrapper';

interface PageProps {
  params: Promise<{ route: string }>;
}

function parseRoute(route: string): { from: string; to: string } | null {
  const match = route.match(/^([a-z]{3})-to-([a-z]{3})$/i);
  if (!match) return null;
  return { from: match[1].toLowerCase(), to: match[2].toLowerCase() };
}

export const revalidate = 86400; // revalidate daily

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { route } = await params;
  const parsed = parseRoute(route);
  if (!parsed) return { title: 'Route Not Found' };

  const fromAirport = getAirportByIata(parsed.from);
  const toAirport = getAirportByIata(parsed.to);

  if (!fromAirport || !toAirport) return { title: 'Route Not Found' };

  const distance = calculateDistance(
    fromAirport.latitude, fromAirport.longitude,
    toAirport.latitude, toAirport.longitude
  );
  const flightTime = calculateFlightTime(distance.km);

  const routeSlug = `${fromAirport.iata.toLowerCase()}-to-${toAirport.iata.toLowerCase()}`;

  return {
    title: `${fromAirport.city} to ${toAirport.city} - Flight Distance ${distance.miles.toLocaleString()} Miles | Air Miles Calculator`,
    description: `Flight distance from ${fromAirport.name} (${fromAirport.iata.toUpperCase()}) to ${toAirport.name} (${toAirport.iata.toUpperCase()}) is ${distance.miles.toLocaleString()} miles (${distance.km.toLocaleString()} km). Estimated flight time: ${flightTime.display}. Calculate CO2 emissions, view airlines, and plan your journey.`,
    alternates: { canonical: `/distance/${routeSlug}` },
  };
}

export default async function DistancePage({ params }: PageProps) {
  const { route } = await params;
  const parsed = parseRoute(route);
  if (!parsed) notFound();

  const fromAirport = getAirportByIata(parsed.from);
  const toAirport = getAirportByIata(parsed.to);

  if (!fromAirport || !toAirport) notFound();

  // Calculate all metrics
  const distance = calculateDistance(
    fromAirport.latitude, fromAirport.longitude,
    toAirport.latitude, toAirport.longitude
  );
  const flightTime = calculateFlightTime(distance.km);
  const co2AllClasses = calculateCO2AllClasses(distance.km);
  const bearing = calculateBearing(
    fromAirport.latitude, fromAirport.longitude,
    toAirport.latitude, toAirport.longitude
  );
  const routeClass = classifyRoute(distance.km);

  // Get timezone info
  const fromTz = fromAirport.timezone ? getTimezoneInfo(fromAirport.timezone) : null;
  const toTz = toAirport.timezone ? getTimezoneInfo(toAirport.timezone) : null;
  const timeDiff = fromAirport.timezone && toAirport.timezone
    ? calculateTimeDifference(fromAirport.timezone, toAirport.timezone)
    : null;

  // Format coordinates
  const fromCoords = formatCoordinatesDMS(fromAirport.latitude, fromAirport.longitude);
  const toCoords = formatCoordinatesDMS(toAirport.latitude, toAirport.longitude);

  // New calculations
  const midpoint = calculateMidpoint(
    fromAirport.latitude, fromAirport.longitude,
    toAirport.latitude, toAirport.longitude
  );
  const midpointCoords = formatCoordinatesDMS(midpoint.lat, midpoint.lng);
  const drivingTime = calculateDrivingTime(distance.km);
  const cruisingAltitude = calculateCruisingAltitude(distance.km);
  const jetLagInfo = timeDiff ? getJetLagInfo(timeDiff.hours) : null;
  const seatRecommendation = getSeatRecommendation(bearing.degrees, flightTime.totalMinutes);
  const distanceComparisons = getDistanceComparisons(distance.km);
  const fuelEstimate = estimateFuelConsumption(distance.km);
  const geoContext = getGeographicContext(
    fromAirport.latitude, fromAirport.longitude,
    toAirport.latitude, toAirport.longitude
  );

  // Get airlines operating this route (both directions)
  const airlinesOutbound = getAirlinesForRoute(fromAirport.iata, toAirport.iata);
  const airlinesInbound = getAirlinesForRoute(toAirport.iata, fromAirport.iata);
  const allAirlines = [...new Map([...airlinesOutbound, ...airlinesInbound].map(a => [a.iata, a])).values()];
  const hasDirectFlights = routeExists(fromAirport.iata, toAirport.iata);

  // Get similar routes from origin
  const similarRoutesFrom = getPopularRoutesFrom(fromAirport.iata, 6)
    .filter(r => r.dest_iata !== toAirport.iata);

  // Get similar routes to destination
  const similarRoutesTo = getPopularRoutesFrom(toAirport.iata, 6)
    .filter(r => r.dest_iata !== fromAirport.iata);

  // Round trip calculations
  const roundTripDistance = {
    km: distance.km * 2,
    miles: distance.miles * 2,
    nauticalMiles: distance.nauticalMiles * 2
  };
  const roundTripFlightTime = {
    hours: Math.floor(flightTime.totalMinutes * 2 / 60),
    minutes: (flightTime.totalMinutes * 2) % 60,
    display: `${Math.floor(flightTime.totalMinutes * 2 / 60)}h ${(flightTime.totalMinutes * 2) % 60}m`
  };

  // Generate Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://airmilescalc.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Distance Calculator',
        item: 'https://airmilescalc.com'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${fromAirport.iata.toUpperCase()} to ${toAirport.iata.toUpperCase()}`,
        item: `https://airmilescalc.com/distance/${fromAirport.iata.toLowerCase()}-to-${toAirport.iata.toLowerCase()}`
      }
    ]
  };

  // Generate FAQ schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How far is it from ${fromAirport.city} to ${toAirport.city}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The flight distance from ${fromAirport.name} (${fromAirport.iata.toUpperCase()}) to ${toAirport.name} (${toAirport.iata.toUpperCase()}) is ${distance.miles.toLocaleString()} miles (${distance.km.toLocaleString()} km).`
        }
      },
      {
        '@type': 'Question',
        name: `How long is the flight from ${fromAirport.iata.toUpperCase()} to ${toAirport.iata.toUpperCase()}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `A direct flight takes approximately ${flightTime.display}. This is classified as a ${routeClass.type} flight.`
        }
      },
      {
        '@type': 'Question',
        name: `What is the time difference between ${fromAirport.city} and ${toAirport.city}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: timeDiff
            ? `${toAirport.city} is ${Math.abs(timeDiff.hours)} hours ${timeDiff.hours >= 0 ? 'ahead of' : 'behind'} ${fromAirport.city}.`
            : 'Timezone information is not available.'
        }
      },
      {
        '@type': 'Question',
        name: `What airlines fly from ${fromAirport.iata.toUpperCase()} to ${toAirport.iata.toUpperCase()}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: allAirlines.length > 0
            ? `${allAirlines.length} airlines operate this route: ${allAirlines.slice(0, 5).map(a => a.name).join(', ')}${allAirlines.length > 5 ? ` and ${allAirlines.length - 5} more` : ''}.`
            : 'Airline information for this specific route is not available.'
        }
      },
      {
        '@type': 'Question',
        name: `What is the carbon footprint of flying from ${fromAirport.city} to ${toAirport.city}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `An economy class passenger produces approximately ${co2AllClasses.economy.kgCO2} kg of CO2. Business class: ${co2AllClasses.business.kgCO2} kg.`
        }
      },
      {
        '@type': 'Question',
        name: `Can I drive from ${fromAirport.city} to ${toAirport.city}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: distance.km < 3000
            ? `Driving is possible but would take approximately ${Math.round(distance.km / 80)} hours at average highway speed. Flying saves significant time.`
            : `Driving is not practical for this ${distance.km.toLocaleString()} km distance. Flying is the recommended option.`
        }
      },
      {
        '@type': 'Question',
        name: `What aircraft fly from ${fromAirport.iata.toUpperCase()} to ${toAirport.iata.toUpperCase()}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `This ${routeClass.type} route is typically served by ${routeClass.typicalAircraft.join(', ')} aircraft.`
        }
      },
      {
        '@type': 'Question',
        name: `How can I offset the carbon from flying ${fromAirport.iata.toUpperCase()} to ${toAirport.iata.toUpperCase()}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `An economy class seat produces ${co2AllClasses.economy.kgCO2} kg CO2. You can offset this by planting approximately ${co2AllClasses.treesNeeded} trees or purchasing verified carbon credits.`
        }
      }
    ]
  };

  // Calculate route category percentage for visual bar
  const maxUltraLongDistance = 18000; // km - longest commercial routes
  const distancePercentage = Math.min((distance.km / maxUltraLongDistance) * 100, 100);

  // Get route category thresholds for visual
  const routeCategories = [
    { name: 'Short', max: 1500, color: 'bg-green-500' },
    { name: 'Medium', max: 4000, color: 'bg-blue-500' },
    { name: 'Long', max: 12000, color: 'bg-orange-500' },
    { name: 'Ultra-Long', max: 18000, color: 'bg-purple-500' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 print:bg-white print:py-4">
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6 print:hidden">
          <ol className="flex items-center gap-2 text-slate-600">
            <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
            <li>/</li>
            <li><span className="text-slate-900">Distance</span></li>
            <li>/</li>
            <li><span className="text-slate-900">{fromAirport.iata.toUpperCase()} to {toAirport.iata.toUpperCase()}</span></li>
          </ol>
        </nav>

        {/* Header with Print Button */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              {fromAirport.city} to {toAirport.city} Flight Distance
            </h1>
            <p className="text-lg text-slate-600">
              {fromAirport.name} ({fromAirport.iata.toUpperCase()}) to {toAirport.name} ({toAirport.iata.toUpperCase()})
            </p>
          </div>
          <PrintButton />
        </div>

        {/* Route badges */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            routeClass.type === 'short-haul' ? 'bg-green-100 text-green-700' :
            routeClass.type === 'medium-haul' ? 'bg-yellow-100 text-yellow-800' :
            routeClass.type === 'long-haul' ? 'bg-orange-100 text-orange-700' :
            'bg-purple-100 text-purple-700'
          }`}>
            {routeClass.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600">{bearing.description} ({bearing.degrees}°)</span>
          {hasDirectFlights && (
            <>
              <span className="text-slate-400">•</span>
              <span className="text-green-600 font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Direct flights available
              </span>
            </>
          )}
        </div>

        {/* Main Distance Display */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 md:p-8 text-white mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold">{distance.miles.toLocaleString()}</div>
              <div className="text-blue-200 mt-1">miles</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold">{distance.km.toLocaleString()}</div>
              <div className="text-blue-200 mt-1">kilometers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold">{distance.nauticalMiles.toLocaleString()}</div>
              <div className="text-blue-200 mt-1">nautical miles</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold">{flightTime.display}</div>
              <div className="text-blue-200 mt-1">flight time</div>
            </div>
          </div>
        </div>

        {/* Visual Distance Scale */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-700">Route Distance Scale</span>
            <span className="text-sm text-slate-500">{distance.km.toLocaleString()} km of {maxUltraLongDistance.toLocaleString()} km max</span>
          </div>
          <div className="relative h-10 bg-slate-100 rounded-lg overflow-hidden">
            {/* Background segments */}
            <div className="absolute inset-0 flex">
              <div className="h-full bg-green-100" style={{ width: `${(1500/maxUltraLongDistance)*100}%` }} />
              <div className="h-full bg-blue-100" style={{ width: `${((4000-1500)/maxUltraLongDistance)*100}%` }} />
              <div className="h-full bg-orange-100" style={{ width: `${((12000-4000)/maxUltraLongDistance)*100}%` }} />
              <div className="h-full bg-purple-100" style={{ width: `${((18000-12000)/maxUltraLongDistance)*100}%` }} />
            </div>
            {/* Progress bar */}
            <div
              className={`absolute top-0 left-0 h-full transition-all duration-500 ${
                routeClass.type === 'short-haul' ? 'bg-green-500' :
                routeClass.type === 'medium-haul' ? 'bg-yellow-500' :
                routeClass.type === 'long-haul' ? 'bg-orange-500' :
                'bg-purple-500'
              }`}
              style={{ width: `${distancePercentage}%` }}
            />
            {/* Marker */}
            <div
              className="absolute top-0 h-full w-1 bg-slate-800"
              style={{ left: `${distancePercentage}%`, transform: 'translateX(-50%)' }}
            />
          </div>
          {/* Labels */}
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>0</span>
            <span className="text-green-600">Short &lt;1,500km</span>
            <span className="text-blue-600">Medium &lt;4,000km</span>
            <span className="text-orange-600">Long &lt;12,000km</span>
            <span className="text-purple-600">Ultra-Long</span>
          </div>
        </div>

        {/* Your Route Summary - Input verification */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Route Summary</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
              <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">{fromAirport.iata.toUpperCase()}</span>
              </div>
              <div>
                <div className="text-xs text-emerald-600 font-medium uppercase tracking-wide">Origin</div>
                <div className="font-semibold text-slate-900">{fromAirport.name}</div>
                <div className="text-sm text-slate-600">{fromAirport.city}, {fromAirport.country}</div>
                <div className="text-xs text-slate-500 font-mono mt-1">{fromAirport.latitude.toFixed(4)}°, {fromAirport.longitude.toFixed(4)}°</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-red-50 rounded-lg border border-red-100">
              <div className="w-14 h-14 bg-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">{toAirport.iata.toUpperCase()}</span>
              </div>
              <div>
                <div className="text-xs text-red-600 font-medium uppercase tracking-wide">Destination</div>
                <div className="font-semibold text-slate-900">{toAirport.name}</div>
                <div className="text-sm text-slate-600">{toAirport.city}, {toAirport.country}</div>
                <div className="text-xs text-slate-500 font-mono mt-1">{toAirport.latitude.toFixed(4)}°, {toAirport.longitude.toFixed(4)}°</div>
              </div>
            </div>
          </div>
        </div>

        {/* What This Means - Plain English Interpretation */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            What This Means For Your Trip
          </h2>
          <div className="space-y-4 text-slate-700">
            <p>
              <strong>Flight Duration:</strong> At {distance.miles.toLocaleString()} miles, this {routeClass.type} flight will take approximately <strong>{flightTime.display}</strong>.
              {routeClass.type === 'short-haul' && ' This is a relatively quick flight where you may not even need entertainment.'}
              {routeClass.type === 'medium-haul' && ' Consider bringing a book or downloading entertainment for the journey.'}
              {routeClass.type === 'long-haul' && ' Plan for a substantial flight with meals, entertainment, and rest time.'}
              {routeClass.type === 'ultra-long-haul' && ' This is one of the world\'s longest routes. Plan for significant rest and multiple meals on board.'}
            </p>
            {timeDiff && jetLagInfo && (
              <p>
                <strong>Time Adjustment:</strong> {toAirport.city} is {Math.abs(timeDiff.hours)} hour{Math.abs(timeDiff.hours) !== 1 ? 's' : ''} {timeDiff.hours >= 0 ? 'ahead of' : 'behind'} {fromAirport.city}.
                {jetLagInfo.severity === 'none' && ' You should experience minimal jet lag.'}
                {jetLagInfo.severity === 'mild' && ` Expect mild jet lag with 1-2 days to fully adjust.`}
                {jetLagInfo.severity === 'moderate' && ` Plan for moderate jet lag—give yourself ${jetLagInfo.recoveryDays} days to adjust before important activities.`}
                {jetLagInfo.severity === 'severe' && ` Prepare for significant jet lag. Allow ${jetLagInfo.recoveryDays}+ days for recovery and avoid scheduling important meetings on arrival day.`}
              </p>
            )}
            <p>
              <strong>Environmental Impact:</strong> An economy class seat produces approximately {co2AllClasses.economy.kgCO2} kg of CO2.
              {co2AllClasses.economy.kgCO2 < 200 && ' This is relatively low for air travel.'}
              {co2AllClasses.economy.kgCO2 >= 200 && co2AllClasses.economy.kgCO2 < 500 && ' Consider carbon offset programs if environmental impact is a concern.'}
              {co2AllClasses.economy.kgCO2 >= 500 && ' Consider carbon offset programs—planting ' + co2AllClasses.treesNeeded + ' trees could offset this flight.'}
            </p>
            {allAirlines.length > 0 && (
              <p>
                <strong>Flight Options:</strong> {allAirlines.length} airline{allAirlines.length > 1 ? 's' : ''} serve{allAirlines.length === 1 ? 's' : ''} this route, giving you options for schedule and price comparison.
              </p>
            )}
          </div>
        </div>

        {/* Key Results Summary Table */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6 overflow-hidden">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Complete Flight Analysis</h2>
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-3 pr-4 font-semibold text-slate-700">Metric</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">Value</th>
                  <th className="text-left py-3 pl-4 font-semibold text-slate-700">Category / Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="bg-blue-50/50">
                  <td className="py-3 pr-4 font-medium text-slate-900">Distance (Miles)</td>
                  <td className="py-3 px-4 text-right font-bold text-blue-700">{distance.miles.toLocaleString()} mi</td>
                  <td className="py-3 pl-4 text-slate-600">Primary frequent flyer unit</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-slate-900">Distance (Kilometers)</td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-900">{distance.km.toLocaleString()} km</td>
                  <td className="py-3 pl-4 text-slate-600">International standard</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-slate-900">Distance (Nautical Miles)</td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-900">{distance.nauticalMiles.toLocaleString()} nm</td>
                  <td className="py-3 pl-4 text-slate-600">Aviation standard</td>
                </tr>
                <tr className="bg-blue-50/50">
                  <td className="py-3 pr-4 font-medium text-slate-900">Flight Time</td>
                  <td className="py-3 px-4 text-right font-bold text-blue-700">{flightTime.display}</td>
                  <td className="py-3 pl-4 text-slate-600">Based on 850 km/h cruise + ground time</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-slate-900">Route Classification</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      routeClass.type === 'short-haul' ? 'bg-green-100 text-green-700' :
                      routeClass.type === 'medium-haul' ? 'bg-yellow-100 text-yellow-800' :
                      routeClass.type === 'long-haul' ? 'bg-orange-100 text-orange-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {routeClass.type.replace('-', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 pl-4 text-slate-600">{routeClass.description}</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-slate-900">Flight Direction</td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-900">{bearing.degrees}° {bearing.cardinal}</td>
                  <td className="py-3 pl-4 text-slate-600">{bearing.description}</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-slate-900">Cruising Altitude</td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-900">{cruisingAltitude.feet.toLocaleString()} ft</td>
                  <td className="py-3 pl-4 text-slate-600">{cruisingAltitude.flightLevel} ({cruisingAltitude.meters.toLocaleString()} m)</td>
                </tr>
                {timeDiff && (
                  <tr>
                    <td className="py-3 pr-4 font-medium text-slate-900">Time Difference</td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-900">{timeDiff.display}</td>
                    <td className="py-3 pl-4 text-slate-600">{jetLagInfo ? `Jet lag: ${jetLagInfo.severity}` : ''}</td>
                  </tr>
                )}
                <tr className="bg-emerald-50/50">
                  <td className="py-3 pr-4 font-medium text-slate-900">CO2 (Economy)</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-700">{co2AllClasses.economy.kgCO2} kg</td>
                  <td className="py-3 pl-4 text-slate-600">DEFRA 2024 factors</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-slate-900">CO2 (Business)</td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-900">{co2AllClasses.business.kgCO2} kg</td>
                  <td className="py-3 pl-4 text-slate-600">2.9x economy</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-slate-900">CO2 (First Class)</td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-900">{co2AllClasses.first.kgCO2} kg</td>
                  <td className="py-3 pl-4 text-slate-600">4x economy</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-slate-900">Trees to Offset</td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-900">{co2AllClasses.treesNeeded}</td>
                  <td className="py-3 pl-4 text-slate-600">Economy class, per passenger</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-slate-900">Fuel per Passenger</td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-900">{fuelEstimate.litersPerPassenger} L</td>
                  <td className="py-3 pl-4 text-slate-600">~{fuelEstimate.litersTotal.toLocaleString()} L total (180 pax)</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-slate-900">Operating Airlines</td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-900">{allAirlines.length || 'N/A'}</td>
                  <td className="py-3 pl-4 text-slate-600">{hasDirectFlights ? 'Direct flights available' : 'May require connection'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Actionable Travel Tips */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Tips for This Route</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Tip 1 - Booking */}
            <div className="flex gap-3 p-4 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-slate-900 text-sm">Book Early</div>
                <div className="text-xs text-slate-600 mt-1">
                  {routeClass.type === 'long-haul' || routeClass.type === 'ultra-long-haul'
                    ? 'Book 2-3 months ahead for best prices on this long-haul route.'
                    : 'Book 3-6 weeks ahead for competitive fares on this route.'}
                </div>
              </div>
            </div>

            {/* Tip 2 - Seat Selection */}
            <div className="flex gap-3 p-4 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-slate-900 text-sm">Best Window Seat</div>
                <div className="text-xs text-slate-600 mt-1">
                  Choose the <strong>{seatRecommendation.windowView}</strong> side for views with less sun glare on this {bearing.description.toLowerCase()} flight.
                </div>
              </div>
            </div>

            {/* Tip 3 - Time Zone */}
            {timeDiff && jetLagInfo && (
              <div className="flex gap-3 p-4 bg-slate-50 rounded-lg">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-slate-900 text-sm">Adjust Your Clock</div>
                  <div className="text-xs text-slate-600 mt-1">
                    {jetLagInfo.severity === 'none' || jetLagInfo.severity === 'mild'
                      ? 'Minimal time change—no special preparation needed.'
                      : `Start adjusting your sleep 2-3 days before departure. Move bedtime ${timeDiff.hours > 0 ? 'earlier' : 'later'} gradually.`}
                  </div>
                </div>
              </div>
            )}

            {/* Tip 4 - Flight Length */}
            <div className="flex gap-3 p-4 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-slate-900 text-sm">Pack Smart</div>
                <div className="text-xs text-slate-600 mt-1">
                  {flightTime.totalMinutes < 180
                    ? 'Short flight—light carry-on with essentials is sufficient.'
                    : flightTime.totalMinutes < 480
                    ? 'Bring entertainment, snacks, and a neck pillow for comfort.'
                    : 'Pack compression socks, eye mask, and entertainment for this long journey.'}
                </div>
              </div>
            </div>

            {/* Tip 5 - Carbon Offset */}
            <div className="flex gap-3 p-4 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-slate-900 text-sm">Offset Your Impact</div>
                <div className="text-xs text-slate-600 mt-1">
                  Consider offsetting {co2AllClasses.economy.kgCO2} kg CO2 through verified programs—equivalent to planting {co2AllClasses.treesNeeded} trees.
                </div>
              </div>
            </div>

            {/* Tip 6 - Airlines */}
            <div className="flex gap-3 p-4 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-slate-900 text-sm">Compare Prices</div>
                <div className="text-xs text-slate-600 mt-1">
                  {allAirlines.length > 3
                    ? `With ${allAirlines.length} airlines on this route, compare prices across carriers for the best deal.`
                    : 'Check multiple booking sites and set price alerts for the best fares.'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Globe Visualization */}
            <GlobeWrapper
              fromLat={fromAirport.latitude}
              fromLng={fromAirport.longitude}
              toLat={toAirport.latitude}
              toLng={toAirport.longitude}
              fromName={`${fromAirport.city} (${fromAirport.iata.toUpperCase()})`}
              toName={`${toAirport.city} (${toAirport.iata.toUpperCase()})`}
              height={450}
              distanceMiles={distance.miles}
              flightTime={flightTime.display}
            />

            {/* Origin Airport Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xl">{fromAirport.iata.toUpperCase()}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded">DEPARTURE</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{fromAirport.name}</h2>
                  <p className="text-slate-600">{fromAirport.city}, {fromAirport.country}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200">
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">IATA / ICAO</div>
                  <div className="font-semibold text-slate-900">{fromAirport.iata.toUpperCase()} / {fromAirport.icao?.toUpperCase() || 'N/A'}</div>
                </div>
                {fromAirport.altitude && (
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide">Elevation</div>
                    <div className="font-semibold text-slate-900">{fromAirport.altitude.toLocaleString()} ft ({Math.round(fromAirport.altitude * 0.3048)} m)</div>
                  </div>
                )}
                {fromTz && (
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide">Local Time</div>
                    <div className="font-semibold text-slate-900">{fromTz.currentTime}</div>
                    <div className="text-xs text-slate-500">{fromTz.utcOffset}</div>
                  </div>
                )}
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">Coordinates</div>
                  <div className="font-mono text-sm text-slate-900">{fromAirport.latitude.toFixed(4)}°, {fromAirport.longitude.toFixed(4)}°</div>
                </div>
              </div>

              <Link
                href={`/airport/${fromAirport.iata}`}
                className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View full airport details
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Destination Airport Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xl">{toAirport.iata.toUpperCase()}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">ARRIVAL</span>
                    {timeDiff && (
                      <span className="text-sm text-slate-500">{timeDiff.display} from departure</span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{toAirport.name}</h2>
                  <p className="text-slate-600">{toAirport.city}, {toAirport.country}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200">
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">IATA / ICAO</div>
                  <div className="font-semibold text-slate-900">{toAirport.iata.toUpperCase()} / {toAirport.icao?.toUpperCase() || 'N/A'}</div>
                </div>
                {toAirport.altitude && (
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide">Elevation</div>
                    <div className="font-semibold text-slate-900">{toAirport.altitude.toLocaleString()} ft ({Math.round(toAirport.altitude * 0.3048)} m)</div>
                  </div>
                )}
                {toTz && (
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide">Local Time</div>
                    <div className="font-semibold text-slate-900">{toTz.currentTime}</div>
                    <div className="text-xs text-slate-500">{toTz.utcOffset}</div>
                  </div>
                )}
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">Coordinates</div>
                  <div className="font-mono text-sm text-slate-900">{toAirport.latitude.toFixed(4)}°, {toAirport.longitude.toFixed(4)}°</div>
                </div>
              </div>

              <Link
                href={`/airport/${toAirport.iata}`}
                className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View full airport details
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Airlines Operating This Route */}
            {allAirlines.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-2">
                  Airlines Flying This Route
                </h2>
                <p className="text-slate-600 text-sm mb-4">
                  {allAirlines.length} airline{allAirlines.length > 1 ? 's' : ''} operate flights between {fromAirport.city} and {toAirport.city}.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {allAirlines.map((airline) => (
                    <div
                      key={airline.iata}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center">
                        <span className="text-xs font-bold text-slate-600">{airline.iata.toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900 text-sm truncate">{airline.name}</div>
                        {airline.country && (
                          <div className="text-xs text-slate-500 truncate">{airline.country}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Flight Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Flight Details</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-sm text-slate-500 mb-1">Cruising Altitude</div>
                    <div className="font-semibold text-slate-900">{cruisingAltitude.feet.toLocaleString()} ft ({cruisingAltitude.meters.toLocaleString()} m)</div>
                    <div className="text-xs text-slate-500">{cruisingAltitude.flightLevel}</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-sm text-slate-500 mb-1">Flight Direction</div>
                    <div className="font-semibold text-slate-900">{bearing.description}</div>
                    <div className="text-xs text-slate-500">Initial bearing: {bearing.degrees}°</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-sm text-slate-500 mb-1">Route Type</div>
                    <div className="font-semibold text-slate-900">{routeClass.description}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-sm text-slate-500 mb-1">Typical Aircraft</div>
                    <div className="flex flex-wrap gap-2">
                      {routeClass.typicalAircraft.map((aircraft) => (
                        <span key={aircraft} className="px-2 py-1 bg-white border border-slate-200 rounded text-sm text-slate-700">
                          {aircraft}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-sm text-slate-500 mb-1">Fuel Consumption</div>
                    <div className="font-semibold text-slate-900">{fuelEstimate.litersPerPassenger} L per passenger</div>
                    <div className="text-xs text-slate-500">~{fuelEstimate.litersTotal.toLocaleString()} L total (180 passengers)</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-sm text-slate-500 mb-1">Geographic Context</div>
                    <div className="font-semibold text-slate-900 text-sm">{geoContext.routeDescription}</div>
                    <div className="text-xs text-slate-500 mt-2">
                      {fromAirport.latitude >= 0 && toAirport.latitude >= 0 && 'Both airports are in the Northern Hemisphere.'}
                      {fromAirport.latitude < 0 && toAirport.latitude < 0 && 'Both airports are in the Southern Hemisphere.'}
                      {fromAirport.latitude >= 0 && toAirport.latitude < 0 && 'This route crosses the Equator from the Northern to the Southern Hemisphere.'}
                      {fromAirport.latitude < 0 && toAirport.latitude >= 0 && 'This route crosses the Equator from the Southern to the Northern Hemisphere.'}
                      {' '}
                      {fromAirport.longitude >= 0 && toAirport.longitude >= 0 && 'Both airports are in the Eastern Hemisphere.'}
                      {fromAirport.longitude < 0 && toAirport.longitude < 0 && 'Both airports are in the Western Hemisphere.'}
                      {fromAirport.longitude >= 0 && toAirport.longitude < 0 && 'This route crosses from the Eastern to the Western Hemisphere.'}
                      {fromAirport.longitude < 0 && toAirport.longitude >= 0 && 'This route crosses from the Western to the Eastern Hemisphere.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Midpoint Information */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Flight Midpoint</h2>
              <p className="text-slate-600 text-sm mb-4">
                The geographic midpoint of this flight is located at:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-sm text-blue-600 mb-1">Latitude</div>
                  <div className="font-mono font-semibold text-blue-900">{midpointCoords.latitude}</div>
                  <div className="text-xs text-blue-500">{midpoint.lat.toFixed(4)}°</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-sm text-blue-600 mb-1">Longitude</div>
                  <div className="font-mono font-semibold text-blue-900">{midpointCoords.longitude}</div>
                  <div className="text-xs text-blue-500">{midpoint.lng.toFixed(4)}°</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-sm text-blue-600 mb-1">Halfway Point</div>
                  <div className="font-semibold text-blue-900">{Math.round(distance.miles / 2).toLocaleString()} mi</div>
                  <div className="text-xs text-blue-500">{Math.round(flightTime.totalMinutes / 2)} min into flight</div>
                </div>
              </div>
            </div>

            {/* CO2 Emissions by Cabin Class */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Carbon Emissions by Cabin Class</h2>
              <p className="text-slate-600 text-sm mb-6">
                CO2 emissions vary by cabin class due to seat space allocation. Based on DEFRA 2024 emission factors.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="text-sm font-medium text-emerald-700 mb-1">Economy</div>
                  <div className="text-2xl font-bold text-emerald-800">{co2AllClasses.economy.kgCO2} kg</div>
                  <div className="text-xs text-emerald-600 mt-1">CO2e: {co2AllClasses.economy.kgCO2e} kg</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm font-medium text-blue-700 mb-1">Premium Economy</div>
                  <div className="text-2xl font-bold text-blue-800">{co2AllClasses.premiumEconomy.kgCO2} kg</div>
                  <div className="text-xs text-blue-600 mt-1">CO2e: {co2AllClasses.premiumEconomy.kgCO2e} kg</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-sm font-medium text-orange-700 mb-1">Business</div>
                  <div className="text-2xl font-bold text-orange-800">{co2AllClasses.business.kgCO2} kg</div>
                  <div className="text-xs text-orange-600 mt-1">CO2e: {co2AllClasses.business.kgCO2e} kg</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-sm font-medium text-purple-700 mb-1">First Class</div>
                  <div className="text-2xl font-bold text-purple-800">{co2AllClasses.first.kgCO2} kg</div>
                  <div className="text-xs text-purple-600 mt-1">CO2e: {co2AllClasses.first.kgCO2e} kg</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">Carbon Offset</div>
                    <div className="text-sm text-slate-600">
                      To offset an economy class seat, plant approximately <strong>{co2AllClasses.treesNeeded} trees</strong>.
                      {co2AllClasses.comparison && <span className="block mt-1">{co2AllClasses.comparison}</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Jet Lag & Travel Tips */}
            {jetLagInfo && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Jet Lag & Travel Tips</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className={`p-4 rounded-lg ${
                      jetLagInfo.severity === 'none' ? 'bg-green-50 border border-green-200' :
                      jetLagInfo.severity === 'mild' ? 'bg-yellow-50 border border-yellow-200' :
                      jetLagInfo.severity === 'moderate' ? 'bg-orange-50 border border-orange-200' :
                      'bg-red-50 border border-red-200'
                    }`}>
                      <div className="text-sm text-slate-600 mb-1">Jet Lag Severity</div>
                      <div className={`text-xl font-bold capitalize ${
                        jetLagInfo.severity === 'none' ? 'text-green-700' :
                        jetLagInfo.severity === 'mild' ? 'text-yellow-700' :
                        jetLagInfo.severity === 'moderate' ? 'text-orange-700' :
                        'text-red-700'
                      }`}>
                        {jetLagInfo.severity}
                      </div>
                      {jetLagInfo.recoveryDays > 0 && (
                        <div className="text-sm text-slate-600 mt-2">
                          Recovery time: ~{jetLagInfo.recoveryDays} day{jetLagInfo.recoveryDays > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>

                    {timeDiff && (
                      <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                        <div className="text-sm text-slate-600 mb-1">Time Zone Change</div>
                        <div className="font-semibold text-slate-900">
                          {Math.abs(timeDiff.hours)} hour{Math.abs(timeDiff.hours) !== 1 ? 's' : ''} {jetLagInfo.direction === 'east' ? 'forward' : jetLagInfo.direction === 'west' ? 'back' : ''}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          Flying {jetLagInfo.direction}ward
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="text-sm font-medium text-slate-700 mb-3">Tips for This Journey</div>
                    <ul className="space-y-2">
                      {jetLagInfo.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                          <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Seat Recommendations */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Seat Recommendations</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <div className="font-medium text-slate-900">Best Window for Views</div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-1 capitalize">{seatRecommendation.windowView} Side</div>
                  <div className="text-sm text-slate-600">{seatRecommendation.sunPosition}</div>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <div className="font-medium text-slate-900">Recommendation</div>
                  </div>
                  <div className="text-sm text-slate-600">{seatRecommendation.recommendation}</div>
                </div>
              </div>
            </div>

            {/* Distance Comparisons */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Distance in Perspective</h2>

              <div className="grid md:grid-cols-2 gap-4">
                {distanceComparisons.map((comparison, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-sm">{idx + 1}</span>
                    </div>
                    <div className="text-sm text-slate-700">{comparison}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Unit Conversion Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Distance & Speed Reference</h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Measurement</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-600">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 px-4 text-slate-700">Statute Miles</td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-900">{distance.miles.toLocaleString()} mi</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-slate-700">Kilometers</td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-900">{distance.km.toLocaleString()} km</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-slate-700">Nautical Miles</td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-900">{distance.nauticalMiles.toLocaleString()} nm</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-slate-700">Meters</td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-900">{(distance.km * 1000).toLocaleString()} m</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-slate-700">Feet</td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-900">{Math.round(distance.miles * 5280).toLocaleString()} ft</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="py-3 px-4 text-slate-700">Flight Time (850 km/h)</td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-900">{flightTime.display}</td>
                    </tr>
                    {drivingTime.practical && (
                      <tr className="bg-slate-50">
                        <td className="py-3 px-4 text-slate-700">Driving Time (80 km/h avg)</td>
                        <td className="py-3 px-4 text-right font-semibold text-slate-900">{drivingTime.display}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Travel Speed Comparison */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Travel Speed Comparison</h2>
              <p className="text-slate-600 text-sm mb-4">
                How long would it take to cover the {distance.km.toLocaleString()} km between {fromAirport.city} and {toAirport.city} at different speeds?
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Mode</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-600">Speed</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-600">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="bg-blue-50/50">
                      <td className="py-3 px-4 text-slate-700 font-medium">Commercial Jet</td>
                      <td className="py-3 px-4 text-right text-slate-900">850 km/h</td>
                      <td className="py-3 px-4 text-right font-semibold text-blue-700">{flightTime.display}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-slate-700">Turboprop Aircraft</td>
                      <td className="py-3 px-4 text-right text-slate-900">500 km/h</td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-900">{Math.floor(distance.km / 500)}h {Math.round((distance.km / 500 % 1) * 60)}m</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-slate-700">Bullet Train</td>
                      <td className="py-3 px-4 text-right text-slate-900">320 km/h</td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-900">{Math.floor(distance.km / 320)}h {Math.round((distance.km / 320 % 1) * 60)}m</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-slate-700">Car (highway)</td>
                      <td className="py-3 px-4 text-right text-slate-900">100 km/h</td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-900">{Math.floor(distance.km / 100)}h {Math.round((distance.km / 100 % 1) * 60)}m</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-slate-700">Walking</td>
                      <td className="py-3 px-4 text-right text-slate-900">5 km/h</td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-900">{Math.round(distance.km / 5).toLocaleString()}h ({Math.round(distance.km / 5 / 24)} days)</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="py-3 px-4 text-slate-700">Speed of Sound</td>
                      <td className="py-3 px-4 text-right text-slate-900">1,235 km/h</td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-900">{Math.floor(distance.km / 1235)}h {Math.round((distance.km / 1235 % 1) * 60)}m</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Round Trip Summary */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 text-white">
              <h2 className="text-lg font-semibold mb-4">Round Trip Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-3xl font-bold">{roundTripDistance.miles.toLocaleString()}</div>
                  <div className="text-slate-400 text-sm">total miles</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{roundTripDistance.km.toLocaleString()}</div>
                  <div className="text-slate-400 text-sm">total km</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{roundTripFlightTime.display}</div>
                  <div className="text-slate-400 text-sm">total flight time</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{(co2AllClasses.economy.kgCO2 * 2).toLocaleString()}</div>
                  <div className="text-slate-400 text-sm">kg CO2 (economy)</div>
                </div>
              </div>
            </div>

            {/* Return Route Link */}
            <Link
              href={`/distance/${toAirport.iata}-to-${fromAirport.iata}`}
              className="block w-full text-center py-4 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition-colors"
            >
              View Return Flight: {toAirport.iata.toUpperCase()} to {fromAirport.iata.toUpperCase()}
            </Link>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
              <h3 className="font-semibold text-slate-900 mb-4">Quick Facts</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">Distance</span>
                  <span className="font-semibold text-slate-900">{distance.miles.toLocaleString()} mi</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">Flight Time</span>
                  <span className="font-semibold text-slate-900">{flightTime.display}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">Route Type</span>
                  <span className="font-semibold text-slate-900 capitalize">{routeClass.type.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">Direction</span>
                  <span className="font-semibold text-slate-900">{bearing.cardinal}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">Altitude</span>
                  <span className="font-semibold text-slate-900">{cruisingAltitude.flightLevel}</span>
                </div>
                {timeDiff && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600">Time Diff</span>
                    <span className="font-semibold text-slate-900">{timeDiff.display}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">CO2 (Economy)</span>
                  <span className="font-semibold text-slate-900">{co2AllClasses.economy.kgCO2} kg</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-600">Airlines</span>
                  <span className="font-semibold text-slate-900">{allAirlines.length || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Other Routes from Origin */}
            {similarRoutesFrom.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">
                  Routes from {fromAirport.iata.toUpperCase()}
                </h3>
                <div className="space-y-2">
                  {similarRoutesFrom.slice(0, 5).map((r) => {
                    const d = calculateDistance(
                      fromAirport.latitude, fromAirport.longitude,
                      r.dest_airport!.latitude, r.dest_airport!.longitude
                    );
                    return (
                      <Link
                        key={r.dest_iata}
                        href={`/distance/${fromAirport.iata}-to-${r.dest_iata}`}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-emerald-600">{r.dest_iata.toUpperCase()}</span>
                          <span className="text-slate-500 text-sm truncate">{r.dest_airport?.city}</span>
                        </div>
                        <span className="text-sm text-slate-600">{d.miles.toLocaleString()} mi</span>
                      </Link>
                    );
                  })}
                </div>
                <Link
                  href={`/airport/${fromAirport.iata}`}
                  className="mt-4 block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all routes
                </Link>
              </div>
            )}

            {/* Other Routes from Destination */}
            {similarRoutesTo.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">
                  Routes from {toAirport.iata.toUpperCase()}
                </h3>
                <div className="space-y-2">
                  {similarRoutesTo.slice(0, 5).map((r) => {
                    const d = calculateDistance(
                      toAirport.latitude, toAirport.longitude,
                      r.dest_airport!.latitude, r.dest_airport!.longitude
                    );
                    return (
                      <Link
                        key={r.dest_iata}
                        href={`/distance/${toAirport.iata}-to-${r.dest_iata}`}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-red-600">{r.dest_iata.toUpperCase()}</span>
                          <span className="text-slate-500 text-sm truncate">{r.dest_airport?.city}</span>
                        </div>
                        <span className="text-sm text-slate-600">{d.miles.toLocaleString()} mi</span>
                      </Link>
                    );
                  })}
                </div>
                <Link
                  href={`/airport/${toAirport.iata}`}
                  className="mt-4 block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all routes
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-12 bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                How far is {fromAirport.city} from {toAirport.city}?
              </h3>
              <p className="text-slate-600 text-sm">
                The flight distance from {fromAirport.name} ({fromAirport.iata.toUpperCase()}) to {toAirport.name} ({toAirport.iata.toUpperCase()}) is <strong>{distance.miles.toLocaleString()} miles</strong> ({distance.km.toLocaleString()} km). This is the great circle distance calculated using the Vincenty formula.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                How long is the flight?
              </h3>
              <p className="text-slate-600 text-sm">
                A direct flight takes approximately <strong>{flightTime.display}</strong>. This is a {routeClass.type} flight typically cruising at {cruisingAltitude.feet.toLocaleString()} feet ({cruisingAltitude.flightLevel}).
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                What is the time difference?
              </h3>
              <p className="text-slate-600 text-sm">
                {timeDiff ? (
                  <>
                    {toAirport.city} is <strong>{Math.abs(timeDiff.hours)} hour{Math.abs(timeDiff.hours) !== 1 ? 's' : ''} {timeDiff.hours >= 0 ? 'ahead of' : 'behind'}</strong> {fromAirport.city}.
                    {jetLagInfo && jetLagInfo.severity !== 'none' && (
                      <> Expect {jetLagInfo.severity} jet lag with ~{jetLagInfo.recoveryDays} day{jetLagInfo.recoveryDays !== 1 ? 's' : ''} recovery time.</>
                    )}
                  </>
                ) : (
                  <>Timezone information is not available for this route.</>
                )}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                What airlines fly this route?
              </h3>
              <p className="text-slate-600 text-sm">
                {allAirlines.length > 0 ? (
                  <>
                    <strong>{allAirlines.length} airline{allAirlines.length > 1 ? 's' : ''}</strong> operate this route: {allAirlines.slice(0, 3).map(a => a.name).join(', ')}{allAirlines.length > 3 ? ` and ${allAirlines.length - 3} more` : ''}.
                  </>
                ) : (
                  <>Specific airline information for this route is not available in our database.</>
                )}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                What is the carbon footprint?
              </h3>
              <p className="text-slate-600 text-sm">
                Economy class: <strong>{co2AllClasses.economy.kgCO2} kg CO2</strong> per passenger. Business class: {co2AllClasses.business.kgCO2} kg. First class: {co2AllClasses.first.kgCO2} kg. Offset with ~{co2AllClasses.treesNeeded} trees.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Which seat side is best?
              </h3>
              <p className="text-slate-600 text-sm">
                For this {bearing.description} flight, the <strong>{seatRecommendation.windowView} side</strong> offers the best views away from sun glare. {flightTime.totalMinutes > 360 && 'Consider an aisle seat for easier movement on this long flight.'}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Can I drive from {fromAirport.city} to {toAirport.city} instead of flying?
              </h3>
              <p className="text-slate-600 text-sm">
                {distance.km < 500 ? (
                  <>Driving is a practical alternative at only <strong>{distance.km.toLocaleString()} km</strong>. It would take approximately <strong>{Math.round(distance.km / 80)} hours</strong> at average highway speed. For shorter distances like this, driving can be more convenient when factoring in airport check-in time.</>
                ) : distance.km < 3000 ? (
                  <>While driving is technically possible at <strong>{distance.km.toLocaleString()} km</strong>, it would take approximately <strong>{Math.round(distance.km / 80)} hours</strong> of non-stop driving. Flying saves you significant time, reducing travel to just <strong>{flightTime.display}</strong>.</>
                ) : (
                  <>Driving is not practical for this <strong>{distance.km.toLocaleString()} km</strong> distance{fromAirport.country !== toAirport.country ? ', especially across international borders' : ''}. It would theoretically take over <strong>{Math.round(distance.km / 80)} hours</strong> of driving. Flying at <strong>{flightTime.display}</strong> is the recommended option.</>
                )}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                What aircraft typically fly this route?
              </h3>
              <p className="text-slate-600 text-sm">
                This {routeClass.type} route is typically served by <strong>{routeClass.typicalAircraft.join(', ')}</strong> aircraft. {routeClass.type === 'short-haul' && 'These are narrow-body aircraft designed for efficient short-distance travel.'}
                {routeClass.type === 'medium-haul' && 'A mix of narrow-body and wide-body aircraft may operate this route depending on demand.'}
                {routeClass.type === 'long-haul' && 'Wide-body aircraft are standard for this distance, offering more comfort for the longer journey.'}
                {routeClass.type === 'ultra-long-haul' && 'Only the most capable long-range wide-body aircraft can serve routes of this distance non-stop.'}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                How can I offset the carbon from this flight?
              </h3>
              <p className="text-slate-600 text-sm">
                An economy class seat on this route produces <strong>{co2AllClasses.economy.kgCO2} kg CO2</strong>. You can offset this by planting approximately <strong>{co2AllClasses.treesNeeded} trees</strong>, purchasing verified carbon credits through programs like Gold Standard or Verra, or supporting renewable energy projects. Many airlines also offer built-in carbon offset options during booking.
              </p>
            </div>
          </div>
        </section>

        {/* External Authority Links */}
        <section className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">External Resources & References</h2>
          <p className="text-slate-600 text-sm mb-6">
            Learn more about the airports, aviation data, and carbon emissions methodology used in this calculation.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a href={`https://en.wikipedia.org/wiki/${fromAirport.city.replace(/ /g, '_')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-sm">W</span>
              </div>
              <div>
                <div className="font-medium text-slate-900 text-sm">{fromAirport.city} on Wikipedia</div>
                <div className="text-xs text-slate-500">City information & history</div>
              </div>
            </a>
            <a href={`https://en.wikipedia.org/wiki/${toAirport.city.replace(/ /g, '_')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-sm">W</span>
              </div>
              <div>
                <div className="font-medium text-slate-900 text-sm">{toAirport.city} on Wikipedia</div>
                <div className="text-xs text-slate-500">City information & history</div>
              </div>
            </a>
            <a href="https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold text-sm">D</span>
              </div>
              <div>
                <div className="font-medium text-slate-900 text-sm">DEFRA Emission Factors</div>
                <div className="text-xs text-slate-500">UK Government carbon data</div>
              </div>
            </a>
            <a href="https://www.iata.org/en/publications/directories/code-search/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold text-sm">I</span>
              </div>
              <div>
                <div className="font-medium text-slate-900 text-sm">IATA Code Search</div>
                <div className="text-xs text-slate-500">Official airport & airline codes</div>
              </div>
            </a>
            <a href="https://openflights.org/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600 font-bold text-sm">O</span>
              </div>
              <div>
                <div className="font-medium text-slate-900 text-sm">OpenFlights Database</div>
                <div className="text-xs text-slate-500">Airport & route data source</div>
              </div>
            </a>
            <a href="https://en.wikipedia.org/wiki/Vincenty%27s_formulae" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-slate-600 font-bold text-sm">V</span>
              </div>
              <div>
                <div className="font-medium text-slate-900 text-sm">Vincenty Formula</div>
                <div className="text-xs text-slate-500">Distance calculation method</div>
              </div>
            </a>
          </div>
        </section>

        {/* Explore More */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <Link href={`/airport/${fromAirport.iata}`} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-slate-900 mb-2">{fromAirport.iata.toUpperCase()} Airport Details</h3>
            <p className="text-slate-600 text-sm">View all routes, airlines, and information for {fromAirport.name}.</p>
          </Link>
          <Link href={`/airport/${toAirport.iata}`} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-slate-900 mb-2">{toAirport.iata.toUpperCase()} Airport Details</h3>
            <p className="text-slate-600 text-sm">View all routes, airlines, and information for {toAirport.name}.</p>
          </Link>
          <Link href="/about" className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-slate-900 mb-2">Our Methodology</h3>
            <p className="text-slate-600 text-sm">Learn about the Vincenty formula and DEFRA emission factors we use.</p>
          </Link>
        </div>

        {/* Calculate Another Route */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Calculate Another Distance
          </Link>
        </div>
      </div>
    </div>
  );
}
