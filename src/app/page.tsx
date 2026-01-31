import { Calculator } from '@/components/calculator';
import { getPopularRoutes } from '@/lib/queries';
import { calculateDistance } from '@/lib/calculations';
import Link from 'next/link';
import { getTopAirportsByRouteCount } from '@/lib/queries';

// Homepage-specific JSON-LD structured data (WebSite, Organization, WebApplication are in layout.tsx)

// HowTo schema for calculator instructions
const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Calculate Flight Distance Between Airports",
  "description": "Step-by-step guide to using AirMilesCalc to find the distance between any two airports worldwide.",
  "totalTime": "PT1M",
  "tool": {
    "@type": "HowToTool",
    "name": "AirMilesCalc Flight Distance Calculator"
  },
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Enter Origin Airport",
      "text": "In the 'From' field, start typing your departure city, airport name, or IATA code. Select the correct airport from the dropdown list.",
      "url": "https://airmilescalc.com/#step1"
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Enter Destination Airport",
      "text": "In the 'To' field, enter your arrival airport using city name, airport name, or IATA code. The 3D globe will update to show both locations.",
      "url": "https://airmilescalc.com/#step2"
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Calculate Distance",
      "text": "Click the 'Calculate Distance' button to view your results.",
      "url": "https://airmilescalc.com/#step3"
    },
    {
      "@type": "HowToStep",
      "position": 4,
      "name": "Review Results",
      "text": "View comprehensive results including distance (miles, km, nautical miles), flight time estimate, CO2 emissions by cabin class, route classification, and 3D visualization.",
      "url": "https://airmilescalc.com/#step4"
    }
  ]
};

// BreadcrumbList schema
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://airmilescalc.com"
    }
  ]
};

// FAQPage schema
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does AirMilesCalc calculate flight distances?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AirMilesCalc uses the Vincenty formula for geodesic distance calculations, which is accurate to within 0.5mm on Earth's surface. This formula accounts for the Earth's ellipsoidal shape rather than treating it as a perfect sphere, providing the most accurate great circle distance between two airports."
      }
    },
    {
      "@type": "Question",
      "name": "What is a great circle distance?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A great circle distance is the shortest distance between two points on a sphere, measured along the surface of the sphere. For flights, this represents the most direct route an aircraft would take, following the curvature of the Earth rather than a straight line on a flat map."
      }
    },
    {
      "@type": "Question",
      "name": "How accurate are the flight time estimates?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Flight time estimates are based on an average cruising speed of 850 km/h (528 mph) for commercial aircraft, plus 30-50 minutes for taxi, takeoff, and landing procedures. Actual flight times may vary based on aircraft type, wind conditions, flight routing, and air traffic."
      }
    },
    {
      "@type": "Question",
      "name": "How many airports does AirMilesCalc cover?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AirMilesCalc includes over 3,000 commercial airports worldwide with IATA codes. Our data is sourced from the OpenFlights database and includes major international airports as well as regional airports with scheduled commercial service."
      }
    },
    {
      "@type": "Question",
      "name": "How are CO2 emissions calculated?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "CO2 emissions are calculated using DEFRA 2024 emission factors which account for fuel burn, radiative forcing, and the full lifecycle of aviation fuel. Economy class emissions are approximately 0.255 kg CO2e per kilometer per passenger, with business and first class using multipliers of 2.9x and 4x respectively due to increased space per passenger."
      }
    },
    {
      "@type": "Question",
      "name": "Is AirMilesCalc free to use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, AirMilesCalc is completely free to use with no registration required. You can calculate unlimited flight distances, view 3D globe visualizations, and access all features without any cost."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use this for frequent flyer calculations?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, the distances shown are the same great circle distances used by most airline frequent flyer programs. However, actual miles earned may vary based on fare class, promotions, and airline-specific rules."
      }
    },
    {
      "@type": "Question",
      "name": "Why do actual flight times differ from estimates?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our estimates assume direct routing and average conditions. Real flights may take longer due to jet stream headwinds, air traffic control routing, weather diversions, or airport congestion. Tailwinds can also make flights shorter than estimated."
      }
    }
  ]
};

// ItemList schema for popular routes
const popularRoutesSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Popular Flight Routes",
  "description": "Most frequently searched flight routes on AirMilesCalc",
  "itemListOrder": "https://schema.org/ItemListOrderDescending",
  "numberOfItems": 8,
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "url": "https://airmilescalc.com/distance/jfk-to-lhr",
      "name": "New York (JFK) to London (LHR)"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "url": "https://airmilescalc.com/distance/lax-to-nrt",
      "name": "Los Angeles (LAX) to Tokyo (NRT)"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "url": "https://airmilescalc.com/distance/sfo-to-sin",
      "name": "San Francisco (SFO) to Singapore (SIN)"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "url": "https://airmilescalc.com/distance/ord-to-cdg",
      "name": "Chicago (ORD) to Paris (CDG)"
    },
    {
      "@type": "ListItem",
      "position": 5,
      "url": "https://airmilescalc.com/distance/mia-to-gru",
      "name": "Miami (MIA) to Sao Paulo (GRU)"
    },
    {
      "@type": "ListItem",
      "position": 6,
      "url": "https://airmilescalc.com/distance/dfw-to-fra",
      "name": "Dallas (DFW) to Frankfurt (FRA)"
    },
    {
      "@type": "ListItem",
      "position": 7,
      "url": "https://airmilescalc.com/distance/sea-to-icn",
      "name": "Seattle (SEA) to Seoul (ICN)"
    },
    {
      "@type": "ListItem",
      "position": 8,
      "url": "https://airmilescalc.com/distance/bos-to-dub",
      "name": "Boston (BOS) to Dublin (DUB)"
    }
  ]
};

export const revalidate = 86400; // revalidate daily

export default function Home() {
  // Get popular routes from database
  const popularRoutes = getPopularRoutes(8).map(route => {
    const distance = calculateDistance(
      route.source.latitude,
      route.source.longitude,
      route.dest.latitude,
      route.dest.longitude
    );
    return {
      ...route,
      distance
    };
  });

  // Get top airports by route count
  const topAirports = getTopAirportsByRouteCount(10);

  return (
    <>
      {/* Homepage-specific JSON-LD (site-wide schemas in layout.tsx) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(popularRoutesSchema) }}
      />

      <div className="min-h-screen bg-slate-50">
        {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-600 to-blue-700 text-white">
        <div className="max-w-[800px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Calculate Flight Distance Instantly
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-6">
              Find the exact air miles between any two airports worldwide using our free flight distance calculator.
              Get precise geodesic distances calculated with the Vincenty formula, estimated flight times, CO2 emissions
              by cabin class, and visualize your route on an interactive 3D globe—all without creating an account.
            </p>

            {/* Key Takeaways Box */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 max-w-2xl mx-auto mb-8 text-left">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">3,000+</div>
                  <div className="text-blue-200 text-sm">Airports</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">0.5mm</div>
                  <div className="text-blue-200 text-sm">Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-blue-200 text-sm">Free</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-blue-200 text-sm">Data Stored</div>
                </div>
              </div>
            </div>
          </div>

          {/* Calculator */}
          <Calculator />

          {/* Last Updated */}
          <div className="text-center mt-6 text-blue-200 text-sm">
            Calculator last updated: January 2026 • Data verified from OpenFlights
          </div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="max-w-[800px] mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Popular Routes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularRoutes.map((route) => (
            <Link
              key={`${route.source.iata}-${route.dest.iata}`}
              href={`/distance/${route.source.iata}-to-${route.dest.iata}`}
              className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-lg text-slate-900">
                  {route.source.iata.toUpperCase()}
                </span>
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <span className="font-bold text-lg text-slate-900">
                  {route.dest.iata.toUpperCase()}
                </span>
              </div>
              <div className="text-sm text-slate-600">
                {route.source.city} to {route.dest.city}
              </div>
              <div className="text-sm font-medium text-blue-600 mt-1">
                {route.distance.miles.toLocaleString()} miles
              </div>
            </Link>
          ))}
        </div>

        {/* Did You Know Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-5">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Did You Know?</h3>
              <p className="text-slate-600 text-sm">
                Great circle routes often look curved on flat maps, but they&apos;re actually the shortest path between two points
                on Earth. A flight from New York to Tokyo appears to curve north over Alaska on a map, but this is actually the
                most direct route—saving over 2,000 miles compared to flying &ldquo;straight&rdquo; across the Pacific!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white border-t border-slate-200">
        <div className="max-w-[800px] mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Why Use AirMilesCalc?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">Precise Calculations</h3>
              <p className="text-slate-600">
                Using the Vincenty formula for geodesic distance, accurate to within 0.5mm on Earth&apos;s surface.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">3D Globe Visualization</h3>
              <p className="text-slate-600">
                See the great circle route between airports on an interactive 3D globe.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">3,000+ Airports</h3>
              <p className="text-slate-600">
                Real data from OpenFlights database covering airports worldwide with IATA codes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* World's Longest Commercial Flights */}
      <section className="max-w-[800px] mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">World&apos;s Longest Commercial Flights</h2>
        <p className="text-slate-600 mb-6">
          These are the longest non-stop commercial routes currently operating, measured by great circle distance.
          Data based on scheduled airline services as of 2025 ({' '}
          <a href="https://www.oag.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OAG</a>).
        </p>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">#</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Route</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Airline</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">Distance</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">Flight Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Aircraft</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-500 font-medium">1</td>
                  <td className="py-3 px-4"><Link href="/distance/jfk-to-sin" className="text-blue-600 hover:underline font-medium">New York (JFK) &rarr; Singapore (SIN)</Link></td>
                  <td className="py-3 px-4 text-slate-700">Singapore Airlines</td>
                  <td className="py-3 px-4 text-right font-semibold">9,537 mi</td>
                  <td className="py-3 px-4 text-right text-slate-600">~18h 30m</td>
                  <td className="py-3 px-4 text-slate-600">A350-900ULR</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-500 font-medium">2</td>
                  <td className="py-3 px-4"><Link href="/distance/sin-to-ewr" className="text-blue-600 hover:underline font-medium">Singapore (SIN) &rarr; Newark (EWR)</Link></td>
                  <td className="py-3 px-4 text-slate-700">Singapore Airlines</td>
                  <td className="py-3 px-4 text-right font-semibold">9,534 mi</td>
                  <td className="py-3 px-4 text-right text-slate-600">~18h 30m</td>
                  <td className="py-3 px-4 text-slate-600">A350-900ULR</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-500 font-medium">3</td>
                  <td className="py-3 px-4"><Link href="/distance/per-to-lhr" className="text-blue-600 hover:underline font-medium">Perth (PER) &rarr; London (LHR)</Link></td>
                  <td className="py-3 px-4 text-slate-700">Qantas</td>
                  <td className="py-3 px-4 text-right font-semibold">9,009 mi</td>
                  <td className="py-3 px-4 text-right text-slate-600">~17h 15m</td>
                  <td className="py-3 px-4 text-slate-600">787-9</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-500 font-medium">4</td>
                  <td className="py-3 px-4"><Link href="/distance/auh-to-lax" className="text-blue-600 hover:underline font-medium">Abu Dhabi (AUH) &rarr; Los Angeles (LAX)</Link></td>
                  <td className="py-3 px-4 text-slate-700">Etihad Airways</td>
                  <td className="py-3 px-4 text-right font-semibold">8,390 mi</td>
                  <td className="py-3 px-4 text-right text-slate-600">~16h 30m</td>
                  <td className="py-3 px-4 text-slate-600">777-200LR</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-500 font-medium">5</td>
                  <td className="py-3 px-4"><Link href="/distance/dxb-to-lax" className="text-blue-600 hover:underline font-medium">Dubai (DXB) &rarr; Los Angeles (LAX)</Link></td>
                  <td className="py-3 px-4 text-slate-700">Emirates</td>
                  <td className="py-3 px-4 text-right font-semibold">8,339 mi</td>
                  <td className="py-3 px-4 text-right text-slate-600">~16h 20m</td>
                  <td className="py-3 px-4 text-slate-600">A380</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-500 font-medium">6</td>
                  <td className="py-3 px-4"><Link href="/distance/dfw-to-syd" className="text-blue-600 hover:underline font-medium">Dallas (DFW) &rarr; Sydney (SYD)</Link></td>
                  <td className="py-3 px-4 text-slate-700">Qantas</td>
                  <td className="py-3 px-4 text-right font-semibold">8,578 mi</td>
                  <td className="py-3 px-4 text-right text-slate-600">~17h 00m</td>
                  <td className="py-3 px-4 text-slate-600">787-9</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-500 font-medium">7</td>
                  <td className="py-3 px-4"><Link href="/distance/doh-to-akl" className="text-blue-600 hover:underline font-medium">Doha (DOH) &rarr; Auckland (AKL)</Link></td>
                  <td className="py-3 px-4 text-slate-700">Qatar Airways</td>
                  <td className="py-3 px-4 text-right font-semibold">9,032 mi</td>
                  <td className="py-3 px-4 text-right text-slate-600">~17h 30m</td>
                  <td className="py-3 px-4 text-slate-600">777-200LR</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-500 font-medium">8</td>
                  <td className="py-3 px-4"><Link href="/distance/dxb-to-sfo" className="text-blue-600 hover:underline font-medium">Dubai (DXB) &rarr; San Francisco (SFO)</Link></td>
                  <td className="py-3 px-4 text-slate-700">Emirates</td>
                  <td className="py-3 px-4 text-right font-semibold">8,103 mi</td>
                  <td className="py-3 px-4 text-right text-slate-600">~15h 45m</td>
                  <td className="py-3 px-4 text-slate-600">A380</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Distances are great circle measurements. Actual flight paths may differ slightly due to air traffic routing and weather.
          Source: Airline schedules and {' '}
          <a href="https://www.flightradar24.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Flightradar24</a>.
        </p>
      </section>

      {/* Airline Alliance Guide */}
      <section className="bg-white border-t border-slate-200">
        <div className="max-w-[800px] mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Airline Alliance Guide</h2>
          <p className="text-slate-600 mb-6">
            The three major airline alliances let you earn and redeem frequent flyer miles across partner carriers. Understanding alliances
            helps you maximize the value of your air miles. Learn more at{' '}
            <a href="https://www.iata.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">IATA.org</a>.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-700 font-bold text-sm">SA</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Star Alliance</h3>
                  <p className="text-xs text-slate-500">Founded 1997</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <tbody className="text-slate-600">
                    <tr className="border-b border-slate-200"><td className="py-1.5 font-medium text-slate-700">Members</td><td className="py-1.5 text-right">26 airlines</td></tr>
                    <tr className="border-b border-slate-200"><td className="py-1.5 font-medium text-slate-700">Destinations</td><td className="py-1.5 text-right">1,200+</td></tr>
                    <tr className="border-b border-slate-200"><td className="py-1.5 font-medium text-slate-700">Countries</td><td className="py-1.5 text-right">195</td></tr>
                    <tr><td className="py-1.5 font-medium text-slate-700">Key Members</td><td className="py-1.5 text-right">United, Lufthansa, ANA</td></tr>
                  </tbody>
                </table>
              </div>
              <a href="https://www.staralliance.com/" target="_blank" rel="noopener noreferrer" className="block mt-3 text-xs text-blue-600 hover:underline">staralliance.com &rarr;</a>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-red-700 font-bold text-sm">OW</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">oneworld</h3>
                  <p className="text-xs text-slate-500">Founded 1999</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <tbody className="text-slate-600">
                    <tr className="border-b border-slate-200"><td className="py-1.5 font-medium text-slate-700">Members</td><td className="py-1.5 text-right">14 airlines</td></tr>
                    <tr className="border-b border-slate-200"><td className="py-1.5 font-medium text-slate-700">Destinations</td><td className="py-1.5 text-right">900+</td></tr>
                    <tr className="border-b border-slate-200"><td className="py-1.5 font-medium text-slate-700">Countries</td><td className="py-1.5 text-right">170</td></tr>
                    <tr><td className="py-1.5 font-medium text-slate-700">Key Members</td><td className="py-1.5 text-right">AA, BA, Qantas, JAL</td></tr>
                  </tbody>
                </table>
              </div>
              <a href="https://www.oneworld.com/" target="_blank" rel="noopener noreferrer" className="block mt-3 text-xs text-blue-600 hover:underline">oneworld.com &rarr;</a>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-700 font-bold text-sm">ST</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">SkyTeam</h3>
                  <p className="text-xs text-slate-500">Founded 2000</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <tbody className="text-slate-600">
                    <tr className="border-b border-slate-200"><td className="py-1.5 font-medium text-slate-700">Members</td><td className="py-1.5 text-right">19 airlines</td></tr>
                    <tr className="border-b border-slate-200"><td className="py-1.5 font-medium text-slate-700">Destinations</td><td className="py-1.5 text-right">1,060+</td></tr>
                    <tr className="border-b border-slate-200"><td className="py-1.5 font-medium text-slate-700">Countries</td><td className="py-1.5 text-right">175</td></tr>
                    <tr><td className="py-1.5 font-medium text-slate-700">Key Members</td><td className="py-1.5 text-right">Delta, Air France, KLM</td></tr>
                  </tbody>
                </table>
              </div>
              <a href="https://www.skyteam.com/" target="_blank" rel="noopener noreferrer" className="block mt-3 text-xs text-blue-600 hover:underline">skyteam.com &rarr;</a>
            </div>
          </div>
        </div>
      </section>

      {/* Global Aviation Statistics */}
      <section className="max-w-[800px] mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Global Aviation by the Numbers</h2>
        <p className="text-slate-600 mb-6">
          Key statistics about the worldwide aviation industry. Data from{' '}
          <a href="https://www.icao.int/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ICAO</a>,{' '}
          <a href="https://www.iata.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">IATA</a>, and{' '}
          <a href="https://aci.aero/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ACI World</a>.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
            <div className="text-3xl font-bold text-blue-600">4.7B</div>
            <div className="text-sm text-slate-600 mt-1">Passengers per Year</div>
            <div className="text-xs text-slate-400 mt-1">IATA 2024 forecast</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
            <div className="text-3xl font-bold text-blue-600">23,000+</div>
            <div className="text-sm text-slate-600 mt-1">Commercial Aircraft</div>
            <div className="text-xs text-slate-400 mt-1">In active service globally</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
            <div className="text-3xl font-bold text-blue-600">41,000+</div>
            <div className="text-sm text-slate-600 mt-1">Airports Worldwide</div>
            <div className="text-xs text-slate-400 mt-1">Including private &amp; military</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
            <div className="text-3xl font-bold text-blue-600">2-3%</div>
            <div className="text-sm text-slate-600 mt-1">Global CO2 Emissions</div>
            <div className="text-xs text-slate-400 mt-1">Aviation&apos;s share (<a href="https://www.atag.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ATAG</a>)</div>
          </div>
        </div>

        {/* World's Busiest Airports */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-1">World&apos;s Busiest Airports by Passenger Traffic (2024)</h3>
          <p className="text-xs text-slate-500 mb-4">Source: <a href="https://aci.aero/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Airports Council International (ACI)</a></p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 pr-3 font-semibold text-slate-700 w-10">#</th>
                  <th className="text-left py-2 pr-3 font-semibold text-slate-700">Airport</th>
                  <th className="text-left py-2 pr-3 font-semibold text-slate-700 w-16">Code</th>
                  <th className="text-right py-2 pr-3 font-semibold text-slate-700">Passengers</th>
                  <th className="text-left py-2 font-semibold text-slate-700">Visual</th>
                </tr>
              </thead>
              <tbody className="text-slate-600 divide-y divide-slate-100">
                {[
                  { rank: 1, name: 'Hartsfield-Jackson Atlanta', code: 'ATL', pax: '95.5M', pct: 100 },
                  { rank: 2, name: 'Dubai International', code: 'DXB', pax: '92.3M', pct: 97 },
                  { rank: 3, name: 'Dallas/Fort Worth', code: 'DFW', pax: '81.8M', pct: 86 },
                  { rank: 4, name: 'London Heathrow', code: 'LHR', pax: '81.4M', pct: 85 },
                  { rank: 5, name: 'Denver International', code: 'DEN', pax: '77.8M', pct: 81 },
                  { rank: 6, name: 'Istanbul Airport', code: 'IST', pax: '76.5M', pct: 80 },
                  { rank: 7, name: 'Los Angeles International', code: 'LAX', pax: '75.1M', pct: 79 },
                  { rank: 8, name: "Chicago O'Hare", code: 'ORD', pax: '74.0M', pct: 77 },
                  { rank: 9, name: 'Tokyo Haneda', code: 'HND', pax: '72.5M', pct: 76 },
                  { rank: 10, name: 'Delhi Indira Gandhi', code: 'DEL', pax: '71.2M', pct: 75 },
                ].map(a => (
                  <tr key={a.code} className="hover:bg-slate-50">
                    <td className="py-2 pr-3 font-medium text-slate-500">{a.rank}</td>
                    <td className="py-2 pr-3"><Link href={`/airport/${a.code.toLowerCase()}`} className="text-blue-600 hover:underline font-medium">{a.name}</Link></td>
                    <td className="py-2 pr-3 font-mono text-slate-700">{a.code}</td>
                    <td className="py-2 pr-3 text-right font-semibold text-slate-900">{a.pax}</td>
                    <td className="py-2 w-32">
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${a.pct}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How to Use This Calculator Section */}
      <section className="max-w-[800px] mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">How to Use This Calculator</h2>
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <p className="text-slate-700 mb-6">
            Using AirMilesCalc is straightforward. Follow these steps to calculate the distance between any two airports:
          </p>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Enter Your Origin Airport</h3>
                <p className="text-slate-600">
                  In the &ldquo;From&rdquo; field, start typing your departure city or airport. You can search by:
                </p>
                <ul className="text-slate-600 mt-2 ml-4 list-disc space-y-1">
                  <li><strong>City name:</strong> &ldquo;London&rdquo;, &ldquo;New York&rdquo;, &ldquo;Tokyo&rdquo;</li>
                  <li><strong>Airport name:</strong> &ldquo;Heathrow&rdquo;, &ldquo;JFK&rdquo;, &ldquo;Narita&rdquo;</li>
                  <li><strong>IATA code:</strong> &ldquo;LHR&rdquo;, &ldquo;JFK&rdquo;, &ldquo;NRT&rdquo;</li>
                </ul>
                <p className="text-slate-600 mt-2">Select the correct airport from the dropdown list that appears.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Enter Your Destination Airport</h3>
                <p className="text-slate-600">
                  In the &ldquo;To&rdquo; field, repeat the same process for your arrival airport. As you select airports,
                  the 3D globe below the calculator will update to show both locations.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Click Calculate Distance</h3>
                <p className="text-slate-600">
                  Once both airports are selected, click the blue &ldquo;Calculate Distance&rdquo; button. You&apos;ll be
                  taken to a detailed results page with comprehensive flight information.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Review Your Results</h3>
                <p className="text-slate-600 mb-2">
                  The results page provides comprehensive information including:
                </p>
                <ul className="text-slate-600 ml-4 list-disc space-y-1">
                  <li>Distance in miles, kilometers, and nautical miles</li>
                  <li>Estimated flight time based on commercial aircraft speeds</li>
                  <li>CO2 emissions by cabin class (economy, business, first)</li>
                  <li>Route classification (short-haul, medium-haul, long-haul)</li>
                  <li>Flight direction and bearing</li>
                  <li>Time zone difference and jet lag assessment</li>
                  <li>Airlines operating the route</li>
                  <li>An animated 3D visualization of the flight path</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-semibold text-slate-900 mb-2">Tips for Accurate Results</h4>
            <ul className="text-slate-600 space-y-1">
              <li>• For cities with multiple airports (like London or New York), select the specific airport you&apos;re interested in</li>
              <li>• Use the swap button (↔) to quickly reverse your route for return flight calculations</li>
              <li>• Clear the input field using the X button if you need to start a new search</li>
              <li>• Flight times are estimates—actual times vary with weather, aircraft type, and routing</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Real-World Examples Section */}
      <section className="bg-white border-t border-slate-200">
        <div className="max-w-[800px] mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Real-World Examples</h2>
          <p className="text-slate-600 mb-8">
            Here are some practical scenarios showing how travelers use AirMilesCalc for their journey planning:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Example 1 */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">Business Travel</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Transatlantic Business Trip</h3>
              <p className="text-slate-600 text-sm mb-4">
                Maria, a marketing executive based in New York, needs to plan a client meeting in London. She wants to
                understand the flight duration and time difference to schedule her meetings appropriately.
              </p>
              <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Route:</span>
                  <span className="font-medium">JFK → LHR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Distance:</span>
                  <span className="font-medium">3,459 miles (5,567 km)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Flight Time:</span>
                  <span className="font-medium">~7h 0m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Time Difference:</span>
                  <span className="font-medium">+5 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">CO2 (Economy):</span>
                  <span className="font-medium">868 kg</span>
                </div>
              </div>
              <p className="text-slate-600 text-sm mt-4">
                <strong>Takeaway:</strong> With a 5-hour time difference, Maria should schedule morning meetings in London
                to align with her natural energy levels after eastward travel.
              </p>
            </div>

            {/* Example 2 */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">Eco-Conscious Travel</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Comparing Carbon Footprints</h3>
              <p className="text-slate-600 text-sm mb-4">
                David is environmentally conscious and wants to understand the carbon impact of his upcoming vacation.
                He&apos;s comparing a trip from San Francisco to Honolulu versus driving to Los Angeles.
              </p>
              <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Route:</span>
                  <span className="font-medium">SFO → HNL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Distance:</span>
                  <span className="font-medium">2,397 miles (3,857 km)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Flight Time:</span>
                  <span className="font-medium">~5h 30m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">CO2 (Economy):</span>
                  <span className="font-medium">602 kg CO2e</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Trees to offset:</span>
                  <span className="font-medium">29 trees/year</span>
                </div>
              </div>
              <p className="text-slate-600 text-sm mt-4">
                <strong>Takeaway:</strong> David can use this information to purchase carbon offsets or make informed
                decisions about his travel frequency.
              </p>
            </div>

            {/* Example 3 */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">Frequent Flyer</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Tracking Qualifying Miles</h3>
              <p className="text-slate-600 text-sm mb-4">
                Jennifer is 15,000 miles short of elite status renewal. She needs to find a route that will earn her
                enough qualifying miles while visiting family in Miami.
              </p>
              <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Route:</span>
                  <span className="font-medium">LAX → MIA (round trip)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">One-way Distance:</span>
                  <span className="font-medium">2,342 miles (3,769 km)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Round Trip:</span>
                  <span className="font-medium">4,684 miles</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Flight Time:</span>
                  <span className="font-medium">~5h 20m each way</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Route Type:</span>
                  <span className="font-medium">Medium-haul</span>
                </div>
              </div>
              <p className="text-slate-600 text-sm mt-4">
                <strong>Takeaway:</strong> The round trip earns 4,684 base miles, but Jennifer may need additional
                multipliers or another trip to reach her goal.
              </p>
            </div>

            {/* Example 4 */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">Long-Haul Planning</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Planning for Jet Lag</h3>
              <p className="text-slate-600 text-sm mb-4">
                Tom and his family are planning a vacation from Chicago to Tokyo. They want to understand the jet lag
                impact so they can plan recovery time into their itinerary.
              </p>
              <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Route:</span>
                  <span className="font-medium">ORD → NRT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Distance:</span>
                  <span className="font-medium">6,299 miles (10,137 km)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Flight Time:</span>
                  <span className="font-medium">~12h 40m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Time Difference:</span>
                  <span className="font-medium">+14 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jet Lag Severity:</span>
                  <span className="font-medium text-red-600">Severe</span>
                </div>
              </div>
              <p className="text-slate-600 text-sm mt-4">
                <strong>Takeaway:</strong> With a 14-hour difference, Tom should plan 7-10 days of recovery time and
                avoid scheduling important activities on arrival day.
              </p>
            </div>

            {/* Example 5 */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">Corporate Travel</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Expense Report Documentation</h3>
              <p className="text-slate-600 text-sm mb-4">
                Sarah is a consultant who needs to document flight distances for her expense reports and corporate
                carbon accounting. Her company requires accurate mileage for reimbursement calculations.
              </p>
              <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Route:</span>
                  <span className="font-medium">ATL → DFW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Distance:</span>
                  <span className="font-medium">721 miles (1,161 km)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Flight Time:</span>
                  <span className="font-medium">~2h 20m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Route Type:</span>
                  <span className="font-medium">Short-haul</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nautical Miles:</span>
                  <span className="font-medium">627 NM</span>
                </div>
              </div>
              <p className="text-slate-600 text-sm mt-4">
                <strong>Takeaway:</strong> AirMilesCalc provides distance in multiple units (miles, km, nautical miles)
                suitable for different corporate reporting requirements.
              </p>
            </div>

            {/* Example 6 */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-cyan-100 text-cyan-700 text-xs font-medium rounded">Student Travel</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Study Abroad Planning</h3>
              <p className="text-slate-600 text-sm mb-4">
                Alex is a college student planning a semester abroad in Barcelona. He wants to understand how far
                he&apos;ll be from home and estimate costs for visiting family.
              </p>
              <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Route:</span>
                  <span className="font-medium">BOS → BCN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Distance:</span>
                  <span className="font-medium">3,650 miles (5,874 km)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Flight Time:</span>
                  <span className="font-medium">~7h 30m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Time Difference:</span>
                  <span className="font-medium">+6 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Route Type:</span>
                  <span className="font-medium">Long-haul</span>
                </div>
              </div>
              <p className="text-slate-600 text-sm mt-4">
                <strong>Takeaway:</strong> At 3,650 miles each way, Alex can use this to estimate fuel surcharges and
                plan the best times to call home given the 6-hour difference.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* When to Use This Calculator Section */}
      <section className="max-w-[800px] mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">When to Use This Calculator</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Planning Scenarios
            </h3>
            <ul className="text-slate-600 space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Trip planning:</strong> Understand flight duration and jet lag before booking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Route comparison:</strong> Compare distances for different connection options</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Meeting scheduling:</strong> Calculate time differences for international meetings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Layover decisions:</strong> Determine if a connection makes geographic sense</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Professional Use Cases
            </h3>
            <ul className="text-slate-600 space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>Expense reports:</strong> Document accurate flight distances for reimbursement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>Carbon accounting:</strong> Calculate emissions for corporate sustainability reports</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>Frequent flyer tracking:</strong> Verify qualifying miles before booking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>Travel policy compliance:</strong> Check if routes meet company guidelines</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Educational Purposes
            </h3>
            <ul className="text-slate-600 space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>Geography lessons:</strong> Visualize distances and great circle routes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>Math projects:</strong> Explore geodesic calculations and spherical geometry</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>Environmental studies:</strong> Research aviation&apos;s carbon footprint</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Personal Interest
            </h3>
            <ul className="text-slate-600 space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span><strong>Curiosity:</strong> Find out exactly how far your favorite destinations are</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span><strong>Travel logging:</strong> Track total miles traveled over your lifetime</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span><strong>Eco awareness:</strong> Understand your personal flight carbon footprint</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Pro Tip Box */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-5">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Pro Tip: Mileage Run Planning</h3>
              <p className="text-slate-600 text-sm">
                If you&apos;re chasing frequent flyer status, use our calculator to find routes that maximize qualifying miles
                per dollar. Look for long-haul routes on sale—a round trip from the US to Asia or Australia can earn 15,000-25,000
                miles. Compare the cost per mile for different routes to find the best value for your status goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Reference Tables Section */}
      <section className="bg-white border-t border-slate-200">
        <div className="max-w-[800px] mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Reference Tables</h2>
          <p className="text-slate-600 mb-8">
            Use these reference tables to quickly understand flight classifications, CO2 emissions by cabin class,
            and distance conversions.
          </p>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Route Classification Table */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Flight Route Classifications</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-300">
                      <th className="text-left py-2 pr-4 font-semibold text-slate-700">Classification</th>
                      <th className="text-left py-2 pr-4 font-semibold text-slate-700">Distance</th>
                      <th className="text-left py-2 font-semibold text-slate-700">Typical Aircraft</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-600">
                    <tr className="border-b border-slate-200">
                      <td className="py-2 pr-4">
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">Short-haul</span>
                      </td>
                      <td className="py-2 pr-4">&lt; 1,500 km</td>
                      <td className="py-2">A320, 737, E190</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 pr-4">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">Medium-haul</span>
                      </td>
                      <td className="py-2 pr-4">1,500 - 4,000 km</td>
                      <td className="py-2">A321, 737 MAX</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 pr-4">
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium">Long-haul</span>
                      </td>
                      <td className="py-2 pr-4">4,000 - 12,000 km</td>
                      <td className="py-2">777, A350, 787</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">Ultra-long</span>
                      </td>
                      <td className="py-2 pr-4">&gt; 12,000 km</td>
                      <td className="py-2">A350-900ULR, 777-200LR</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* CO2 Emissions by Cabin Class */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-4">CO2 Emissions by Cabin Class</h3>
              <p className="text-slate-500 text-xs mb-3">Based on DEFRA 2024 emission factors with radiative forcing</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-300">
                      <th className="text-left py-2 pr-4 font-semibold text-slate-700">Cabin Class</th>
                      <th className="text-left py-2 pr-4 font-semibold text-slate-700">Multiplier</th>
                      <th className="text-left py-2 font-semibold text-slate-700">kg CO2e/km</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-600">
                    <tr className="border-b border-slate-200">
                      <td className="py-2 pr-4 font-medium">Economy</td>
                      <td className="py-2 pr-4">1.0x</td>
                      <td className="py-2">0.255</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 pr-4 font-medium">Premium Economy</td>
                      <td className="py-2 pr-4">1.6x</td>
                      <td className="py-2">0.408</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 pr-4 font-medium">Business</td>
                      <td className="py-2 pr-4">2.9x</td>
                      <td className="py-2">0.740</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium">First Class</td>
                      <td className="py-2 pr-4">4.0x</td>
                      <td className="py-2">1.020</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-slate-500 text-xs mt-3">
                Multipliers reflect seat space allocation per passenger
              </p>
            </div>

            {/* Distance Conversion Table */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Distance Unit Conversions</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-300">
                      <th className="text-left py-2 pr-4 font-semibold text-slate-700">From</th>
                      <th className="text-left py-2 pr-4 font-semibold text-slate-700">To</th>
                      <th className="text-left py-2 font-semibold text-slate-700">Multiply by</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-600">
                    <tr className="border-b border-slate-200">
                      <td className="py-2 pr-4">Kilometers</td>
                      <td className="py-2 pr-4">Miles</td>
                      <td className="py-2 font-mono">0.621371</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 pr-4">Kilometers</td>
                      <td className="py-2 pr-4">Nautical Miles</td>
                      <td className="py-2 font-mono">0.539957</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 pr-4">Miles</td>
                      <td className="py-2 pr-4">Kilometers</td>
                      <td className="py-2 font-mono">1.60934</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Nautical Miles</td>
                      <td className="py-2 pr-4">Kilometers</td>
                      <td className="py-2 font-mono">1.852</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Jet Lag Severity Table */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Jet Lag Severity Guide</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-300">
                      <th className="text-left py-2 pr-4 font-semibold text-slate-700">Time Zones</th>
                      <th className="text-left py-2 pr-4 font-semibold text-slate-700">Severity</th>
                      <th className="text-left py-2 font-semibold text-slate-700">Recovery</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-600">
                    <tr className="border-b border-slate-200">
                      <td className="py-2 pr-4">0-2 hours</td>
                      <td className="py-2 pr-4">
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">None</span>
                      </td>
                      <td className="py-2">Immediate</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 pr-4">3-5 hours</td>
                      <td className="py-2 pr-4">
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">Mild</span>
                      </td>
                      <td className="py-2">1-2 days</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 pr-4">6-9 hours</td>
                      <td className="py-2 pr-4">
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium">Moderate</span>
                      </td>
                      <td className="py-2">3-5 days</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">10+ hours</td>
                      <td className="py-2 pr-4">
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">Severe</span>
                      </td>
                      <td className="py-2">7-10 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-slate-500 text-xs mt-3">
                Eastward travel is typically harder to adjust to than westward
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Formula Reference Section */}
      <section className="max-w-[800px] mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Formula Reference</h2>
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <h3 className="font-semibold text-slate-900 mb-4">The Vincenty Formula</h3>
          <p className="text-slate-600 mb-6">
            AirMilesCalc uses the Vincenty formula to calculate geodesic distances on an ellipsoid. This provides
            sub-millimeter accuracy by accounting for Earth&apos;s true shape (oblate spheroid) rather than treating
            it as a perfect sphere.
          </p>

          <div className="bg-slate-900 rounded-lg p-4 mb-6 overflow-x-auto">
            <pre className="text-green-400 text-sm font-mono">
{`// WGS-84 Ellipsoid Parameters
a = 6,378,137 m           // Semi-major axis (equatorial radius)
f = 1/298.257223563       // Flattening
b = a × (1 - f)           // Semi-minor axis (polar radius)

// Distance calculation (iterative)
distance = b × A × (σ - Δσ)

where A and Δσ are derived through iteration
until convergence (Δλ < 10⁻¹² radians)`}
            </pre>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Variables Explained</h4>
              <ul className="text-slate-600 text-sm space-y-2">
                <li><strong>a:</strong> Earth&apos;s equatorial radius (6,378.137 km)</li>
                <li><strong>b:</strong> Earth&apos;s polar radius (6,356.752 km)</li>
                <li><strong>f:</strong> Flattening factor (how &ldquo;squashed&rdquo; Earth is)</li>
                <li><strong>σ:</strong> Angular distance on the sphere</li>
                <li><strong>λ:</strong> Difference in longitude</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Worked Example</h4>
              <p className="text-slate-600 text-sm mb-2">
                <strong>New York (JFK) to London (LHR):</strong>
              </p>
              <ul className="text-slate-600 text-sm space-y-1">
                <li>JFK: 40.6413° N, 73.7781° W</li>
                <li>LHR: 51.4700° N, 0.4543° W</li>
                <li>Result: <strong>5,567 km</strong> (3,459 miles)</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-slate-900 mb-2">Why Not Use the Simpler Haversine Formula?</h4>
            <p className="text-slate-600 text-sm">
              The Haversine formula treats Earth as a perfect sphere, which introduces errors of up to 0.5% on
              long distances. For a 10,000 km flight, that&apos;s a 50 km error. Vincenty accounts for Earth&apos;s
              ellipsoidal shape and is accurate to within 0.5mm—though we round results to whole kilometers
              since sub-meter precision isn&apos;t meaningful for flights.
            </p>
          </div>
        </div>
      </section>

      {/* Understanding Your Results Section */}
      <section className="bg-slate-100 border-t border-slate-200">
        <div className="max-w-[800px] mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Understanding Your Results</h2>

          {/* Did You Know Box */}
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-5">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Did You Know?</h3>
                <p className="text-slate-600 text-sm">
                  The jet stream can add or subtract over an hour from your flight time! Flights from the US to Europe
                  typically take 1-2 hours less than the return trip because westbound flights fight against the jet
                  stream (winds up to 250 mph), while eastbound flights ride it. That&apos;s why our estimates
                  represent average times—your actual flight could be faster or slower.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-3">Distance Values</h3>
              <ul className="text-slate-600 text-sm space-y-3">
                <li>
                  <strong>Miles:</strong> Standard unit for US frequent flyer programs
                </li>
                <li>
                  <strong>Kilometers:</strong> Standard unit worldwide, used for international reporting
                </li>
                <li>
                  <strong>Nautical Miles:</strong> Aviation industry standard, used in flight planning
                </li>
              </ul>
              <p className="text-slate-500 text-xs mt-4">
                All three represent the same great circle distance, just in different units.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-3">Flight Time Estimates</h3>
              <ul className="text-slate-600 text-sm space-y-3">
                <li>
                  <strong>Short-haul (&lt;3h):</strong> Usually accurate within ±15 minutes
                </li>
                <li>
                  <strong>Medium-haul (3-7h):</strong> May vary ±30 minutes due to routing
                </li>
                <li>
                  <strong>Long-haul (&gt;7h):</strong> Can vary ±1 hour based on jet stream
                </li>
              </ul>
              <p className="text-slate-500 text-xs mt-4">
                Always check airline schedules for actual flight times.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-3">CO2 Emissions</h3>
              <ul className="text-slate-600 text-sm space-y-3">
                <li>
                  <strong>&lt;500 kg:</strong> Typical short-haul economy flight
                </li>
                <li>
                  <strong>500-1,500 kg:</strong> Medium to long-haul economy
                </li>
                <li>
                  <strong>&gt;1,500 kg:</strong> Ultra-long-haul or premium cabins
                </li>
              </ul>
              <p className="text-slate-500 text-xs mt-4">
                For context: Average tree absorbs ~21 kg CO2 per year.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Airports Section */}
      <section className="max-w-[800px] mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Popular Airports</h2>
        <p className="text-slate-600 mb-6">
          Explore detailed information for the busiest airports in our database, ranked by number of destinations served.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {topAirports.map(({ airport, route_count }) => (
            <Link
              key={airport.iata}
              href={`/airport/${airport.iata}`}
              className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-blue-200 transition-all text-center"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-sm">{airport.iata.toUpperCase()}</span>
              </div>
              <div className="font-semibold text-slate-900 text-sm">{airport.city}</div>
              <div className="text-xs text-slate-500 mt-1">{airport.country}</div>
              <div className="text-xs text-blue-600 font-medium mt-2">{route_count} destinations</div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link href="/airports" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            View all airports &rarr;
          </Link>
        </div>
      </section>

      {/* Trusted Sources & References */}
      <section className="bg-white border-t border-slate-200">
        <div className="max-w-[800px] mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Trusted Sources &amp; References</h2>
          <p className="text-slate-600 mb-8">
            AirMilesCalc relies on authoritative, peer-reviewed data sources and scientifically validated calculation methods.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a href="https://openflights.org/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600 font-bold">OF</span>
              </div>
              <div>
                <div className="font-semibold text-slate-900">OpenFlights</div>
                <div className="text-xs text-slate-500">Airport, airline &amp; route data (ODbL License)</div>
              </div>
            </a>
            <a href="https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">UK</span>
              </div>
              <div>
                <div className="font-semibold text-slate-900">DEFRA 2024</div>
                <div className="text-xs text-slate-500">UK Government emission factors for carbon accounting</div>
              </div>
            </a>
            <a href="https://en.wikipedia.org/wiki/Vincenty%27s_formulae" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">V</span>
              </div>
              <div>
                <div className="font-semibold text-slate-900">Vincenty Formula</div>
                <div className="text-xs text-slate-500">Geodesic distance calculation (0.5mm accuracy)</div>
              </div>
            </a>
            <a href="https://www.iata.org/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold">IA</span>
              </div>
              <div>
                <div className="font-semibold text-slate-900">IATA</div>
                <div className="text-xs text-slate-500">International Air Transport Association codes</div>
              </div>
            </a>
            <a href="https://www.icao.int/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold">IC</span>
              </div>
              <div>
                <div className="font-semibold text-slate-900">ICAO</div>
                <div className="text-xs text-slate-500">International Civil Aviation Organization</div>
              </div>
            </a>
            <a href="https://en.wikipedia.org/wiki/World_Geodetic_System" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">84</span>
              </div>
              <div>
                <div className="font-semibold text-slate-900">WGS-84</div>
                <div className="text-xs text-slate-500">World Geodetic System used by GPS worldwide</div>
              </div>
            </a>
            <a href="https://www.faa.gov/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 font-bold">FA</span>
              </div>
              <div>
                <div className="font-semibold text-slate-900">FAA</div>
                <div className="text-xs text-slate-500">US Federal Aviation Administration</div>
              </div>
            </a>
            <a href="https://www.eurocontrol.int/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 font-bold">EC</span>
              </div>
              <div>
                <div className="font-semibold text-slate-900">Eurocontrol</div>
                <div className="text-xs text-slate-500">European air traffic management</div>
              </div>
            </a>
            <a href="https://aci.aero/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">AC</span>
              </div>
              <div>
                <div className="font-semibold text-slate-900">ACI World</div>
                <div className="text-xs text-slate-500">Airports Council International (airport data)</div>
              </div>
            </a>
            <a href="https://www.flightradar24.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600 font-bold">FR</span>
              </div>
              <div>
                <div className="font-semibold text-slate-900">Flightradar24</div>
                <div className="text-xs text-slate-500">Real-time flight tracking data</div>
              </div>
            </a>
            <a href="https://www.atag.org/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">AT</span>
              </div>
              <div>
                <div className="font-semibold text-slate-900">ATAG</div>
                <div className="text-xs text-slate-500">Air Transport Action Group (sustainability)</div>
              </div>
            </a>
            <a href="https://www.oag.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">OG</span>
              </div>
              <div>
                <div className="font-semibold text-slate-900">OAG</div>
                <div className="text-xs text-slate-500">Official Airline Guide (schedules &amp; analytics)</div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Understanding Air Miles for Loyalty Programs */}
      <section className="max-w-[800px] mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Understanding Air Miles for Loyalty Programs</h2>
        <p className="text-slate-600 mb-6">
          Frequent flyer programs award miles based on the great circle distance between airports&mdash;the same distances
          AirMilesCalc calculates. Here&apos;s how the major programs work and how to maximize your earning potential.
        </p>

        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h3 className="font-semibold text-slate-900 mb-4">Major Frequent Flyer Programs</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-3 pr-4 font-semibold text-slate-700">Program</th>
                  <th className="text-left py-3 pr-4 font-semibold text-slate-700">Airline</th>
                  <th className="text-left py-3 pr-4 font-semibold text-slate-700">Alliance</th>
                  <th className="text-left py-3 pr-4 font-semibold text-slate-700">Earning Basis</th>
                  <th className="text-left py-3 font-semibold text-slate-700">More Info</th>
                </tr>
              </thead>
              <tbody className="text-slate-600 divide-y divide-slate-100">
                <tr><td className="py-2 pr-4 font-medium text-slate-900">MileagePlus</td><td className="py-2 pr-4">United Airlines</td><td className="py-2 pr-4">Star Alliance</td><td className="py-2 pr-4">Revenue-based + distance</td><td className="py-2"><a href="https://www.united.com/en/us/fly/mileageplus.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">united.com</a></td></tr>
                <tr><td className="py-2 pr-4 font-medium text-slate-900">SkyMiles</td><td className="py-2 pr-4">Delta Air Lines</td><td className="py-2 pr-4">SkyTeam</td><td className="py-2 pr-4">Revenue-based</td><td className="py-2"><a href="https://www.delta.com/us/en/skymiles/overview" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">delta.com</a></td></tr>
                <tr><td className="py-2 pr-4 font-medium text-slate-900">AAdvantage</td><td className="py-2 pr-4">American Airlines</td><td className="py-2 pr-4">oneworld</td><td className="py-2 pr-4">Revenue-based + distance</td><td className="py-2"><a href="https://www.aa.com/i18n/aadvantage-program/aadvantage-program.jsp" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">aa.com</a></td></tr>
                <tr><td className="py-2 pr-4 font-medium text-slate-900">Executive Club</td><td className="py-2 pr-4">British Airways</td><td className="py-2 pr-4">oneworld</td><td className="py-2 pr-4">Distance-based (Avios)</td><td className="py-2"><a href="https://www.britishairways.com/en-gb/executive-club" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">ba.com</a></td></tr>
                <tr><td className="py-2 pr-4 font-medium text-slate-900">Flying Blue</td><td className="py-2 pr-4">Air France / KLM</td><td className="py-2 pr-4">SkyTeam</td><td className="py-2 pr-4">Revenue-based</td><td className="py-2"><a href="https://www.flyingblue.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">flyingblue.com</a></td></tr>
                <tr><td className="py-2 pr-4 font-medium text-slate-900">Miles &amp; More</td><td className="py-2 pr-4">Lufthansa Group</td><td className="py-2 pr-4">Star Alliance</td><td className="py-2 pr-4">Distance-based + status</td><td className="py-2"><a href="https://www.miles-and-more.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">miles-and-more.com</a></td></tr>
                <tr><td className="py-2 pr-4 font-medium text-slate-900">Skywards</td><td className="py-2 pr-4">Emirates</td><td className="py-2 pr-4">Independent</td><td className="py-2 pr-4">Distance-based + class</td><td className="py-2"><a href="https://www.emirates.com/english/skywards/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">emirates.com</a></td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Programs frequently change their earning structures. Always verify current rules with the airline directly.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Tip: Distance-Based vs Revenue-Based Programs</h3>
              <p className="text-slate-600 text-sm">
                Distance-based programs (like British Airways Avios or Lufthansa Miles &amp; More) award miles per kilometer flown,
                making our calculator directly useful for estimating earnings. Revenue-based programs (like Delta SkyMiles) award
                miles based on ticket price, but understanding the flight distance still helps with redemption planning.
                Use our <Link href="/" className="text-blue-600 hover:underline">distance calculator</Link> to plan the most
                efficient routes for your loyalty goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Flight vs Driving Comparison */}
      <section className="bg-white border-t border-slate-200">
        <div className="max-w-[800px] mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Flight vs Driving: When Does Flying Make Sense?</h2>
          <p className="text-slate-600 mb-6">
            For shorter distances, driving can be faster when you factor in airport check-in, security, and boarding.
            Here&apos;s a general comparison based on door-to-door travel time. For specific routes, check our{' '}
            <Link href="/" className="text-blue-600 hover:underline">distance calculator</Link> which includes driving time estimates.
          </p>
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="text-left py-3 pr-4 font-semibold text-slate-700">Distance</th>
                    <th className="text-left py-3 pr-4 font-semibold text-slate-700">Driving Time</th>
                    <th className="text-left py-3 pr-4 font-semibold text-slate-700">Flying Time (door-to-door)</th>
                    <th className="text-left py-3 pr-4 font-semibold text-slate-700">CO2 Driving</th>
                    <th className="text-left py-3 pr-4 font-semibold text-slate-700">CO2 Flying (Economy)</th>
                    <th className="text-left py-3 font-semibold text-slate-700">Recommendation</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 divide-y divide-slate-100">
                  <tr><td className="py-2 pr-4 font-medium text-slate-900">&lt; 200 km</td><td className="py-2 pr-4">~2.5h</td><td className="py-2 pr-4">~3-4h</td><td className="py-2 pr-4">~30 kg</td><td className="py-2 pr-4">~51 kg</td><td className="py-2"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">Drive</span></td></tr>
                  <tr><td className="py-2 pr-4 font-medium text-slate-900">200-500 km</td><td className="py-2 pr-4">~3-6h</td><td className="py-2 pr-4">~3-4h</td><td className="py-2 pr-4">~50-75 kg</td><td className="py-2 pr-4">~51-128 kg</td><td className="py-2"><span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">Either</span></td></tr>
                  <tr><td className="py-2 pr-4 font-medium text-slate-900">500-1,000 km</td><td className="py-2 pr-4">~6-12h</td><td className="py-2 pr-4">~3.5-5h</td><td className="py-2 pr-4">~75-150 kg</td><td className="py-2 pr-4">~128-255 kg</td><td className="py-2"><span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">Fly</span></td></tr>
                  <tr><td className="py-2 pr-4 font-medium text-slate-900">&gt; 1,000 km</td><td className="py-2 pr-4">12h+</td><td className="py-2 pr-4">~4-6h</td><td className="py-2 pr-4">150+ kg</td><td className="py-2 pr-4">255+ kg</td><td className="py-2"><span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">Fly</span></td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              CO2 estimates: Driving based on average car (~150 g/km). Flying based on DEFRA 2024 economy class factors.
              Door-to-door flying time includes ~2h for airport procedures. Train may be optimal for 200-800 km in Europe.
              See <a href="https://www.eea.europa.eu/en/topics/in-depth/transport-and-mobility" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">European Environment Agency</a> data.
            </p>
          </div>
        </div>
      </section>

      {/* Learn More Section */}
      <section className="max-w-[800px] mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Learn More About AirMilesCalc</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/about" className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow group">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">About Our Calculator</h3>
            <p className="text-slate-600 text-sm">
              Learn about our methodology, the science behind geodesic calculations, and how we ensure accuracy
              using the Vincenty formula.
            </p>
          </Link>

          <Link href="/contact" className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow group">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Contact Us</h3>
            <p className="text-slate-600 text-sm">
              Have questions, found a bug, or want to suggest a feature? We&apos;d love to hear from you.
              We aim to respond within 48-72 hours.
            </p>
          </Link>

          <Link href="/privacy" className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow group">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Privacy & Data</h3>
            <p className="text-slate-600 text-sm">
              All calculations happen in your browser. We don&apos;t track your searches or store your data.
              Read our full privacy policy.
            </p>
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white border-t border-slate-200">
        <div className="max-w-[800px] mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">How does AirMilesCalc calculate flight distances?</h3>
                <p className="text-slate-600">
                  We use the Vincenty formula for geodesic distance calculations, which is accurate to within 0.5mm
                  on Earth&apos;s surface. This formula accounts for Earth&apos;s ellipsoidal shape using WGS-84 parameters,
                  providing the most accurate great circle distance between two airports. Learn more on our{' '}
                  <Link href="/about" className="text-blue-600 hover:underline">About page</Link>.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">What is a great circle distance?</h3>
                <p className="text-slate-600">
                  A great circle distance is the shortest path between two points on Earth&apos;s surface, following
                  the planet&apos;s curvature. This is the route aircraft actually fly (with minor adjustments for
                  wind and airspace), unlike straight lines on flat maps which can be deceiving.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">How accurate are the flight time estimates?</h3>
                <p className="text-slate-600">
                  Flight times are calculated using an average cruise speed of 850 km/h (528 mph) plus ground time
                  for taxi, takeoff, and landing (30-50 minutes depending on route length). Actual times vary with
                  aircraft type, wind conditions, and routing.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">How are CO2 emissions calculated?</h3>
                <p className="text-slate-600">
                  We use DEFRA 2024 emission factors, which are internationally recognized standards. These include
                  a radiative forcing multiplier (1.9x) to account for non-CO2 effects at altitude. Emissions vary
                  by cabin class due to different seat space allocations. See our{' '}
                  <Link href="/about" className="text-blue-600 hover:underline">methodology page</Link> for details.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Should I consult a professional for important decisions?</h3>
                <p className="text-slate-600">
                  Yes. AirMilesCalc provides estimates for informational purposes only. For official documentation,
                  carbon accounting, or business decisions, consult airline schedules and certified environmental
                  consultants. Read our full{' '}
                  <Link href="/terms" className="text-blue-600 hover:underline">terms of service</Link> for more details.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">How many airports does AirMilesCalc cover?</h3>
                <p className="text-slate-600">
                  Our database includes over 3,000 commercial airports worldwide with IATA codes. Data is sourced
                  from OpenFlights and includes major international hubs as well as regional airports with scheduled
                  commercial service.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Is AirMilesCalc free to use?</h3>
                <p className="text-slate-600">
                  Yes, completely free with no registration required. All calculations happen in your browser,
                  and we don&apos;t store your search history or require any personal information. Read our{' '}
                  <Link href="/privacy" className="text-blue-600 hover:underline">privacy policy</Link> to learn more.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Can I use this for frequent flyer calculations?</h3>
                <p className="text-slate-600">
                  Yes, the distances shown are the same great circle distances used by most airline frequent flyer
                  programs. However, actual miles earned may vary based on fare class, promotions, and airline-specific
                  rules. Always check with your airline for exact earning rates.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Why do actual flight times differ from estimates?</h3>
                <p className="text-slate-600">
                  Our estimates assume direct routing and average conditions. Real flights may take longer due to
                  jet stream headwinds, air traffic control routing, weather diversions, or airport congestion.
                  Tailwinds can also make flights shorter than estimated.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Can I embed AirMilesCalc on my website?</h3>
                <p className="text-slate-600">
                  Linking to AirMilesCalc is welcome without permission. For embedding the calculator directly on your
                  site, please{' '}
                  <Link href="/contact" className="text-blue-600 hover:underline">contact us</Link> to discuss options.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">How do I report a bug or request a feature?</h3>
                <p className="text-slate-600">
                  We welcome feedback! Use our{' '}
                  <Link href="/contact" className="text-blue-600 hover:underline">contact form</Link> to report bugs
                  (include browser and device info) or suggest new features. We aim to respond within 48-72 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
