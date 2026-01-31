import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About AirMilesCalc - Free Flight Distance Calculator',
  description: 'Learn about AirMilesCalc, our precise flight distance calculations using the Vincenty formula, CO2 emissions methodology, and how our free calculator helps travelers worldwide.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About AirMilesCalc',
    description: 'Learn about our precise flight distance calculations using the Vincenty formula and DEFRA 2024 CO2 emissions methodology.',
  },
};

// JSON-LD structured data for About page
const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About AirMilesCalc",
  "description": "Learn about AirMilesCalc, our precise flight distance calculations using the Vincenty formula, CO2 emissions methodology, and how our free calculator helps travelers worldwide.",
  "url": "https://airmilescalc.com/about",
  "mainEntity": {
    "@type": "Organization",
    "@id": "https://airmilescalc.com/#organization"
  }
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://airmilescalc.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "About",
      "item": "https://airmilescalc.com/about"
    }
  ]
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://airmilescalc.com/#organization",
  "name": "AirMilesCalc",
  "url": "https://airmilescalc.com",
  "logo": "https://airmilescalc.com/favicon.ico",
  "description": "Free flight distance calculator providing precise air miles, flight times, CO2 emissions, and travel information for airports worldwide using the Vincenty geodesic formula."
};

export default function AboutPage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <div className="min-h-screen bg-slate-50 py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="text-sm mb-6">
            <ol className="flex items-center gap-2 text-slate-600">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li>/</li>
              <li><span className="text-slate-900">About</span></li>
            </ol>
          </nav>

          {/* Page Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
            About AirMilesCalc
          </h1>

          <div className="prose prose-slate max-w-none">
            {/* What This Calculator Does */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-0">What This Calculator Does</h2>
              <p className="text-slate-700 mb-4">
                AirMilesCalc is a comprehensive flight distance calculator designed to provide precise measurements
                between airports worldwide. Unlike simple straight-line calculators, our tool calculates the actual
                great circle distance that aircraft fly, accounting for Earth&apos;s curvature.
              </p>
              <p className="text-slate-700 mb-4">
                <strong>Our calculator provides:</strong>
              </p>
              <ul className="text-slate-700 space-y-2 mb-4">
                <li><strong>Flight Distance:</strong> Precise distance in miles, kilometers, and nautical miles between any two airports using geodesic calculations</li>
                <li><strong>Flight Time Estimates:</strong> Approximate flight duration based on average commercial aircraft speeds, including ground time for taxi, takeoff, and landing</li>
                <li><strong>CO2 Emissions:</strong> Carbon footprint calculations for economy, premium economy, business, and first class using official DEFRA 2024 emission factors</li>
                <li><strong>3D Globe Visualization:</strong> An interactive globe that displays the great circle route between your selected airports, showing the actual flight path aircraft follow</li>
                <li><strong>Route Classification:</strong> Automatic categorization of flights as short-haul, medium-haul, long-haul, or ultra-long-haul with typical aircraft information</li>
                <li><strong>Timezone Information:</strong> Time difference between origin and destination cities with jet lag severity assessment</li>
                <li><strong>Geographic Context:</strong> Information about flight direction, bearing, hemisphere crossings, and route characteristics</li>
              </ul>
              <p className="text-slate-700">
                With data covering over 3,000 commercial airports worldwide, you can calculate distances for virtually
                any scheduled flight route on Earth.
              </p>
            </section>

            {/* The Science Behind It */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-0">The Science Behind It</h2>
              <p className="text-slate-700 mb-4">
                Our distance calculations use the <strong>Vincenty formula</strong>, a geodesic algorithm developed
                by Thaddeus Vincenty in 1975. This formula is considered the gold standard for geographic distance
                calculations because it accounts for Earth&apos;s true shape.
              </p>
              <p className="text-slate-700 mb-4">
                Earth is not a perfect sphere—it&apos;s an oblate spheroid, slightly flattened at the poles and bulging
                at the equator. The Vincenty formula uses the WGS-84 ellipsoid model (the same reference system used
                by GPS) with these parameters:
              </p>
              <ul className="text-slate-700 space-y-2 mb-4">
                <li><strong>Semi-major axis (equatorial radius):</strong> 6,378,137 meters</li>
                <li><strong>Flattening:</strong> 1/298.257223563</li>
                <li><strong>Accuracy:</strong> Within 0.5mm on Earth&apos;s surface</li>
              </ul>
              <p className="text-slate-700 mb-4">
                For the rare case of antipodal points (locations on opposite sides of Earth) where the Vincenty
                formula may not converge, our calculator automatically falls back to the Haversine formula, which
                treats Earth as a perfect sphere but still provides excellent accuracy for practical purposes.
              </p>
              <p className="text-slate-700 mb-4">
                <strong>Flight time estimates</strong> are calculated using an average cruise speed of 850 km/h
                (528 mph), which represents typical modern commercial jet aircraft. We add ground time that varies
                by route distance: 30 minutes for short-haul flights, 40 minutes for medium-haul, and 50 minutes
                for long-haul routes, accounting for taxi, takeoff, and landing procedures.
              </p>
              <p className="text-slate-700">
                <strong>CO2 emissions</strong> are calculated using the UK Government&apos;s DEFRA 2024 emission factors,
                which are widely recognized as authoritative standards for carbon footprint calculations. These factors
                include a radiative forcing multiplier of 1.9 to account for non-CO2 climate effects of aviation at altitude.
              </p>
            </section>

            {/* Who This Is For */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-0">Who This Is For</h2>
              <p className="text-slate-700 mb-4">
                AirMilesCalc serves a diverse range of users who need accurate flight distance information:
              </p>
              <ul className="text-slate-700 space-y-3 mb-4">
                <li><strong>Frequent Flyers:</strong> Track your flight distances for frequent flyer programs, calculate qualifying miles, and understand your travel patterns</li>
                <li><strong>Travel Planners:</strong> Compare flight distances between different route options, estimate travel times, and plan multi-city itineraries</li>
                <li><strong>Business Travelers:</strong> Calculate travel time for meeting planning, assess jet lag impact for important appointments, and document business travel distances</li>
                <li><strong>Environmentally Conscious Travelers:</strong> Understand the carbon footprint of your flights, compare emissions across cabin classes, and make informed decisions about your travel</li>
                <li><strong>Aviation Enthusiasts:</strong> Explore route distances, understand great circle navigation, and visualize flight paths on our 3D globe</li>
                <li><strong>Students and Educators:</strong> Learn about geodesic calculations, spherical geometry, and the mathematics behind aviation navigation</li>
                <li><strong>Corporate Travel Managers:</strong> Calculate distances for expense reports, benchmark travel costs, and assess carbon reporting obligations</li>
              </ul>
              <p className="text-slate-700">
                Whether you&apos;re planning a single trip or managing corporate travel, our calculator provides the
                precise data you need without registration, fees, or advertising interruptions.
              </p>
            </section>

            {/* Our Methodology */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-0">Our Methodology</h2>

              <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Distance Calculation</h3>
              <p className="text-slate-700 mb-4">
                We calculate the geodesic distance—the shortest path between two points on Earth&apos;s surface—using
                the iterative Vincenty formula. This great circle route is what aircraft actually fly (adjusted
                for wind and airspace restrictions). The algorithm iteratively solves for the ellipsoidal distance
                until it converges to sub-millimeter precision.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Flight Time Estimation</h3>
              <p className="text-slate-700 mb-4">
                Flight times are estimated using industry-standard averages. Modern commercial jets cruise at
                approximately 850 km/h (Mach 0.78-0.85). We add block time for ground operations based on flight
                distance category. These estimates align with general aviation industry scheduling practices,
                though actual times vary with aircraft type, weather, and routing.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Carbon Emissions</h3>
              <p className="text-slate-700 mb-4">
                Our CO2 calculations follow DEFRA (Department for Environment, Food &amp; Rural Affairs) methodology,
                which is internationally recognized for corporate and personal carbon accounting. The emissions
                vary by flight distance (short-haul flights are less efficient per kilometer) and cabin class
                (premium cabins allocate more aircraft space per passenger, increasing per-passenger emissions).
              </p>
              <p className="text-slate-700 mb-4">
                The cabin class multipliers reflect seat space allocation: economy (1x baseline), premium economy
                (1.6x), business (2.9x), and first class (4x). The radiative forcing multiplier accounts for the
                additional warming effect of contrails, water vapor, and nitrogen oxides released at cruising altitude.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Airport Data</h3>
              <p className="text-slate-700">
                Our airport database is sourced from OpenFlights, an open-source aviation database. We include
                commercial airports with IATA codes, filtering out private airfields, heliports, and closed
                facilities. Airport coordinates are verified against official aeronautical publications.
              </p>
            </section>

            {/* Limitations & Disclaimer */}
            <section className="bg-amber-50 rounded-xl border border-amber-200 p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-0">Limitations &amp; Disclaimer</h2>
              <p className="text-slate-700 mb-4">
                <strong>AirMilesCalc provides estimates for informational purposes only.</strong> While we strive
                for accuracy using established scientific formulas and authoritative data sources, our calculations
                have inherent limitations:
              </p>
              <ul className="text-slate-700 space-y-2 mb-4">
                <li><strong>Flight distances</strong> represent great circle routes. Actual flight paths may differ due to airspace restrictions, weather diversions, and air traffic control routing</li>
                <li><strong>Flight time estimates</strong> are based on averages. Actual times vary significantly with aircraft type, wind conditions, departure delays, and specific airline procedures</li>
                <li><strong>CO2 emissions</strong> are estimates based on fleet-wide averages. Individual aircraft, load factors, and operational efficiency vary considerably between airlines and flights</li>
                <li><strong>Airport data</strong> is updated periodically but may not reflect recent changes to airport codes, closures, or coordinate corrections</li>
              </ul>
              <p className="text-slate-700 mb-4">
                <strong>This calculator is not a substitute for professional advice.</strong> For travel planning,
                consult airline schedules and booking systems. For carbon accounting in corporate contexts, consider
                working with certified environmental consultants. For aviation operations, use official aeronautical
                charts and navigation systems.
              </p>
              <p className="text-slate-700">
                Individual circumstances vary. The information provided should be used as a starting point for
                research, not as definitive guidance for important decisions.
              </p>
            </section>

            {/* How to Use the Calculator */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-0">How to Use the Calculator</h2>
              <p className="text-slate-700 mb-4">
                Using AirMilesCalc is straightforward:
              </p>
              <ol className="text-slate-700 space-y-4 mb-4 list-decimal pl-6">
                <li>
                  <strong>Enter Your Origin Airport:</strong> In the &quot;From&quot; field, start typing your departure
                  city or airport code. Our search will display matching airports as you type. You can search by
                  city name (e.g., &quot;London&quot;), airport name (e.g., &quot;Heathrow&quot;), or IATA code (e.g., &quot;LHR&quot;).
                  Click on the correct airport to select it.
                </li>
                <li>
                  <strong>Enter Your Destination Airport:</strong> In the &quot;To&quot; field, repeat the process for
                  your arrival airport. The 3D globe will update to show both airports as you select them.
                </li>
                <li>
                  <strong>Click Calculate Distance:</strong> Once both airports are selected, click the
                  &quot;Calculate Distance&quot; button. You&apos;ll be taken to a detailed results page.
                </li>
                <li>
                  <strong>Review Your Results:</strong> The results page displays comprehensive information
                  including the distance in multiple units, estimated flight time, CO2 emissions by cabin class,
                  timezone information, jet lag assessment, and an animated 3D visualization of your route.
                </li>
                <li>
                  <strong>Swap Airports (Optional):</strong> Click the swap button between the two fields to
                  reverse your origin and destination, useful for comparing round-trip information.
                </li>
              </ol>
              <p className="text-slate-700">
                <strong>Tip:</strong> Use the Popular Routes section on the homepage to quickly explore common
                flight paths, or browse our airport directory to find specific airports by country or region.
              </p>
            </section>

            {/* Why We Built This */}
            <section className="bg-blue-50 rounded-xl border border-blue-200 p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-0">Why We Built This</h2>
              <p className="text-slate-700 mb-4">
                We built AirMilesCalc because we believe accurate travel information should be freely accessible
                to everyone. Many flight distance tools online are cluttered with advertisements, require
                registration, or use simplified calculations that don&apos;t account for Earth&apos;s true shape.
              </p>
              <p className="text-slate-700 mb-4">
                <strong>Our commitments:</strong>
              </p>
              <ul className="text-slate-700 space-y-2 mb-4">
                <li><strong>Free Forever:</strong> All features are available at no cost, with no premium tiers, subscriptions, or paywalls</li>
                <li><strong>No Sign-up Required:</strong> Use the calculator immediately without creating an account or providing personal information</li>
                <li><strong>Privacy-Focused:</strong> All calculations happen in your browser. We don&apos;t track your searches, store your flight queries, or build profiles of your travel habits</li>
                <li><strong>No Data Collection:</strong> Your airport searches and calculated routes are processed locally and are not transmitted to our servers for storage</li>
                <li><strong>Clean Interface:</strong> No pop-up ads, no interruptions, no promotional content embedded in your results</li>
                <li><strong>Open Methodology:</strong> We explain exactly how our calculations work so you can understand and verify our results</li>
              </ul>
              <p className="text-slate-700">
                We&apos;re committed to maintaining AirMilesCalc as a useful tool for travelers, students,
                professionals, and anyone curious about flight distances. If you find this calculator helpful,
                we&apos;d appreciate if you shared it with others who might benefit from it.
              </p>
            </section>

            {/* Formula Accuracy Comparison */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-0">Distance Formula Comparison</h2>
              <p className="text-slate-700 mb-4">
                Several mathematical formulas exist for calculating distances on Earth. Here&apos;s how they compare:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 pr-4 font-semibold text-slate-700">Formula</th>
                      <th className="text-left py-3 pr-4 font-semibold text-slate-700">Earth Model</th>
                      <th className="text-left py-3 pr-4 font-semibold text-slate-700">Accuracy</th>
                      <th className="text-left py-3 font-semibold text-slate-700">Best Use Case</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-600 divide-y divide-slate-100">
                    <tr className="bg-blue-50/50">
                      <td className="py-3 pr-4 font-medium text-blue-700">Vincenty (used here)</td>
                      <td className="py-3 pr-4">Oblate spheroid (WGS-84)</td>
                      <td className="py-3 pr-4">0.5 mm</td>
                      <td className="py-3">Geodetic surveys, aviation, precision mapping</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">Haversine</td>
                      <td className="py-3 pr-4">Perfect sphere</td>
                      <td className="py-3 pr-4">~0.5% (up to 50 km error)</td>
                      <td className="py-3">General navigation, web applications</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">Spherical Law of Cosines</td>
                      <td className="py-3 pr-4">Perfect sphere</td>
                      <td className="py-3 pr-4">~0.5% (similar to Haversine)</td>
                      <td className="py-3">Simple calculations, short distances</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">Flat-Earth approximation</td>
                      <td className="py-3 pr-4">Flat plane</td>
                      <td className="py-3 pr-4">Varies (poor for long distances)</td>
                      <td className="py-3">Very short distances (&lt;10 km only)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* WGS-84 Reference */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-0">WGS-84 Ellipsoid Parameters</h2>
              <p className="text-slate-700 mb-4">
                The World Geodetic System 1984 (WGS-84) is the reference coordinate system used by GPS and our calculator.
                These precise parameters define Earth&apos;s shape:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 pr-4 font-semibold text-slate-700">Parameter</th>
                      <th className="text-left py-3 font-semibold text-slate-700">Value</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-600 divide-y divide-slate-100">
                    <tr><td className="py-3 pr-4 font-medium text-slate-900">Semi-major axis (equatorial radius)</td><td className="py-3 font-mono">6,378,137.0 m</td></tr>
                    <tr><td className="py-3 pr-4 font-medium text-slate-900">Semi-minor axis (polar radius)</td><td className="py-3 font-mono">6,356,752.314 m</td></tr>
                    <tr><td className="py-3 pr-4 font-medium text-slate-900">Flattening</td><td className="py-3 font-mono">1 / 298.257223563</td></tr>
                    <tr><td className="py-3 pr-4 font-medium text-slate-900">First eccentricity squared</td><td className="py-3 font-mono">0.00669437999014</td></tr>
                    <tr><td className="py-3 pr-4 font-medium text-slate-900">Mean radius</td><td className="py-3 font-mono">6,371,008.8 m</td></tr>
                    <tr><td className="py-3 pr-4 font-medium text-slate-900">Surface area</td><td className="py-3 font-mono">510,065,600 km&sup2;</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* DEFRA Emission Factors */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-0">DEFRA 2024 Emission Factors</h2>
              <p className="text-slate-700 mb-4">
                Our CO2 calculations use the UK Department for Environment, Food &amp; Rural Affairs (DEFRA) emission factors,
                widely recognized as authoritative standards for carbon footprint calculations in aviation.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 pr-4 font-semibold text-slate-700">Distance Band</th>
                      <th className="text-right py-3 pr-4 font-semibold text-slate-700">Base Factor (kg CO2/km)</th>
                      <th className="text-right py-3 pr-4 font-semibold text-slate-700">Economy</th>
                      <th className="text-right py-3 pr-4 font-semibold text-slate-700">Premium Econ (1.6x)</th>
                      <th className="text-right py-3 pr-4 font-semibold text-slate-700">Business (2.9x)</th>
                      <th className="text-right py-3 font-semibold text-slate-700">First (4x)</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-600 divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">Short-haul (&lt;1,500 km)</td>
                      <td className="py-3 pr-4 text-right font-mono">0.255</td>
                      <td className="py-3 pr-4 text-right font-mono">0.255</td>
                      <td className="py-3 pr-4 text-right font-mono">0.408</td>
                      <td className="py-3 pr-4 text-right font-mono">0.740</td>
                      <td className="py-3 text-right font-mono">1.020</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">Medium-haul (1,500–3,700 km)</td>
                      <td className="py-3 pr-4 text-right font-mono">0.156</td>
                      <td className="py-3 pr-4 text-right font-mono">0.156</td>
                      <td className="py-3 pr-4 text-right font-mono">0.250</td>
                      <td className="py-3 pr-4 text-right font-mono">0.452</td>
                      <td className="py-3 text-right font-mono">0.624</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">Long-haul (&gt;3,700 km)</td>
                      <td className="py-3 pr-4 text-right font-mono">0.150</td>
                      <td className="py-3 pr-4 text-right font-mono">0.150</td>
                      <td className="py-3 pr-4 text-right font-mono">0.240</td>
                      <td className="py-3 pr-4 text-right font-mono">0.435</td>
                      <td className="py-3 text-right font-mono">0.600</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-slate-500 text-xs mt-3">
                All values include a radiative forcing multiplier of 1.9x to account for non-CO2 climate effects at altitude (contrails, water vapor, NOx).
              </p>
            </section>

            {/* Brief History of Geodesy */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-0">A Brief History of Distance Measurement</h2>
              <div className="space-y-4 text-slate-700">
                <p>
                  <strong>~240 BC — Eratosthenes:</strong> The Greek mathematician made the first known calculation of Earth&apos;s
                  circumference by measuring shadows at two locations in Egypt. His estimate was remarkably close to modern values.
                </p>
                <p>
                  <strong>1687 — Isaac Newton:</strong> Newton proposed that Earth is not a perfect sphere but an oblate spheroid,
                  flattened at the poles due to its rotation. This insight was confirmed by French expeditions in the 1730s.
                </p>
                <p>
                  <strong>1975 — Thaddeus Vincenty:</strong> Vincenty published his formula for computing distances on an
                  ellipsoidal Earth, providing sub-millimeter accuracy. This formula remains the standard for geodetic calculations.
                </p>
                <p>
                  <strong>1984 — WGS-84:</strong> The World Geodetic System 1984 established a unified global coordinate framework,
                  adopted by GPS and now used as the international standard for mapping, navigation, and aviation.
                </p>
              </div>
            </section>

            {/* Great Circle vs Rhumb Line */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-0">Great Circle vs Rhumb Line</h2>
              <p className="text-slate-700 mb-4">
                When navigating across the globe, there are two fundamental types of routes between two points:
                the <strong>great circle route</strong> and the <strong>rhumb line</strong> (also called a loxodrome).
                Understanding the difference is essential for appreciating how aircraft navigate and why flight paths
                on a flat map often appear curved.
              </p>
              <p className="text-slate-700 mb-4">
                A <strong>great circle</strong> is the shortest path between two points on the surface of a sphere. It
                represents the intersection of the sphere with a plane that passes through both points and the center
                of the sphere. Aircraft follow great circle routes (adjusted for wind and airspace) because they
                minimize fuel consumption and flight time. On a Mercator projection map, great circle routes appear
                as curved lines, which is why flights from New York to Tokyo often pass over Alaska.
              </p>
              <p className="text-slate-700 mb-4">
                A <strong>rhumb line</strong> crosses all meridians at the same angle, making it a constant-bearing
                course. While easier to navigate with a compass (you simply maintain a fixed heading), a rhumb line
                is almost always longer than the great circle distance. Rhumb lines appear as straight lines on a
                Mercator projection, which is why this projection was historically favored by sailors.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 pr-4 font-semibold text-slate-700">Characteristic</th>
                      <th className="text-left py-3 pr-4 font-semibold text-slate-700">Great Circle</th>
                      <th className="text-left py-3 font-semibold text-slate-700">Rhumb Line</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-600 divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">Distance</td>
                      <td className="py-3 pr-4">Shortest possible route</td>
                      <td className="py-3">Usually longer (up to 30% on long routes)</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">Bearing</td>
                      <td className="py-3 pr-4">Bearing changes continuously along the route</td>
                      <td className="py-3">Constant bearing throughout the journey</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">On Mercator map</td>
                      <td className="py-3 pr-4">Appears as a curved line</td>
                      <td className="py-3">Appears as a straight line</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">On a globe</td>
                      <td className="py-3 pr-4">Appears as a straight line</td>
                      <td className="py-3">Appears as a spiral (unless along equator or meridian)</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">Primary use</td>
                      <td className="py-3 pr-4">Aviation, long-distance navigation</td>
                      <td className="py-3">Historical maritime navigation</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">Navigation ease</td>
                      <td className="py-3 pr-4">Requires continuous heading adjustments</td>
                      <td className="py-3">Simple — maintain one compass heading</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-slate-700 mt-4">
                AirMilesCalc calculates the great circle distance, which is what airlines use for fuel planning and
                scheduling. For short distances (under a few hundred kilometers), the difference between a great circle
                and rhumb line is negligible. For transoceanic flights, however, the difference can be significant.
              </p>
              <p className="text-slate-500 text-xs mt-3">
                Learn more: <a href="https://en.wikipedia.org/wiki/Great-circle_distance" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Great-circle distance (Wikipedia)</a> | <a href="https://en.wikipedia.org/wiki/Rhumb_line" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Rhumb line (Wikipedia)</a>
              </p>
            </section>

            {/* Aviation Environmental Initiatives */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-0">Aviation Environmental Initiatives</h2>
              <p className="text-slate-700 mb-4">
                The aviation industry accounts for approximately 2-3% of global CO2 emissions, and the sector has
                committed to ambitious targets to reduce its environmental impact. Understanding these initiatives
                provides important context for the CO2 calculations our tool provides.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">CORSIA — Carbon Offsetting and Reduction Scheme for International Aviation</h3>
              <p className="text-slate-700 mb-4">
                <a href="https://www.icao.int/environmental-protection/CORSIA/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">CORSIA</a> is
                a global market-based mechanism adopted by the International Civil Aviation Organization (ICAO) to
                address CO2 emissions from international aviation. Under CORSIA, airlines are required to offset
                the growth in their emissions above 2019 baseline levels by purchasing eligible emission units or
                using sustainable aviation fuels (SAF). The scheme entered its pilot phase in 2021, with mandatory
                participation for most countries beginning in 2027.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Sustainable Aviation Fuel (SAF)</h3>
              <p className="text-slate-700 mb-4">
                SAF is produced from sustainable feedstocks such as used cooking oil, agricultural residues, municipal
                solid waste, and even captured CO2. When used as a drop-in replacement for conventional jet fuel,
                SAF can reduce lifecycle carbon emissions by up to 80%. The industry target is for SAF to make up
                at least 10% of global jet fuel supply by 2030 and to scale significantly beyond that in subsequent
                decades. Current production remains below 1% of total jet fuel consumption, making rapid scaling
                one of aviation&apos;s most pressing challenges.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Net-Zero by 2050</h3>
              <p className="text-slate-700 mb-4">
                In 2021, the International Air Transport Association (IATA) committed the global airline industry
                to achieving <a href="https://www.iata.org/en/programs/environment/flynetzero/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">net-zero carbon
                emissions by 2050</a>. This target was reinforced by ICAO&apos;s adoption of a long-term aspirational
                goal at its 41st Assembly in 2022. Achieving net-zero will require a combination of new aircraft
                technology, operational improvements, SAF adoption, carbon capture, and market-based measures.
              </p>
              <p className="text-slate-700 mb-4">
                The <a href="https://www.atag.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Air Transport Action Group (ATAG)</a> coordinates
                cross-industry efforts and publishes regular progress reports on aviation&apos;s environmental performance.
                Their Waypoint 2050 report outlines multiple scenarios for how the industry can reach its climate goals.
              </p>
              <p className="text-slate-700">
                By providing per-flight CO2 estimates, AirMilesCalc helps travelers understand their individual
                contribution to aviation emissions and make more informed decisions about their air travel.
              </p>
            </section>

            {/* How Modern Aviation Navigation Works */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-0">How Modern Aviation Navigation Works</h2>
              <p className="text-slate-700 mb-4">
                Modern commercial aircraft use a combination of satellite-based and ground-based navigation systems
                to fly precise routes across the globe. Understanding these systems helps explain how the great circle
                routes calculated by AirMilesCalc translate into actual flight paths.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">GPS (Global Positioning System)</h3>
              <p className="text-slate-700 mb-4">
                GPS is the primary navigation system used in modern aviation. Aircraft equipped with GPS receivers
                determine their position by measuring signals from a constellation of at least 24 satellites orbiting
                Earth. Aviation-grade GPS provides accuracy within a few meters, and augmentation systems such as
                WAAS (Wide Area Augmentation System) and EGNOS (European Geostationary Navigation Overlay Service)
                further enhance precision for approach and landing procedures. GPS enables aircraft to fly
                Performance-Based Navigation (PBN) routes, including Required Navigation Performance (RNP) approaches
                that allow curved flight paths directly to the runway.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">VOR (VHF Omnidirectional Range)</h3>
              <p className="text-slate-700 mb-4">
                VOR stations are ground-based radio beacons that have formed the backbone of air navigation since
                the 1950s. Each VOR transmits a signal that allows aircraft to determine their magnetic bearing
                from the station. Traditional airways (the &quot;highways in the sky&quot;) are defined as corridors
                between VOR stations. While GPS has reduced reliance on VOR, these stations remain critical as
                backup navigation aids and are still used to define many published routes and instrument approaches.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">NDB (Non-Directional Beacon)</h3>
              <p className="text-slate-700 mb-4">
                NDBs are the oldest form of electronic navigation aid still in use. These ground-based transmitters
                broadcast a signal that aircraft Automatic Direction Finders (ADF) use to point toward the beacon.
                While largely being phased out in favor of GPS and VOR, NDBs are still found at many smaller airports
                and in remote regions where they serve as important approach aids.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">How Flight Paths Are Determined</h3>
              <p className="text-slate-700 mb-4">
                Actual flight paths are determined by a combination of factors beyond simple point-to-point navigation.
                Air traffic control organizations such as the <a href="https://www.faa.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">FAA</a> (in the United States)
                and <a href="https://www.eurocontrol.int/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Eurocontrol</a> (in Europe) publish
                structured airway routes that aircraft must follow. Airlines file flight plans that consider the
                most fuel-efficient route, prevailing winds (particularly the jet stream), weather avoidance,
                restricted airspace, and oceanic track systems such as the North Atlantic Tracks (NATs) that
                change daily based on wind patterns.
              </p>
              <p className="text-slate-700">
                The Flight Management System (FMS) aboard modern aircraft integrates data from GPS, VOR, NDB,
                and inertial navigation to continuously compute the aircraft&apos;s position and guide it along the
                planned route. This multi-system approach provides redundancy and ensures safe navigation even
                if individual systems fail.
              </p>
            </section>

            {/* Average Flight Speeds by Aircraft Type */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-0">Average Flight Speeds by Aircraft Type</h2>
              <p className="text-slate-700 mb-4">
                Different aircraft types cruise at different speeds, which affects flight time calculations.
                AirMilesCalc uses an average cruise speed of 850 km/h for its estimates, which represents a
                typical modern narrow-body or wide-body jet. Here is how common commercial aircraft compare:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 pr-4 font-semibold text-slate-700">Aircraft</th>
                      <th className="text-left py-3 pr-4 font-semibold text-slate-700">Type</th>
                      <th className="text-right py-3 pr-4 font-semibold text-slate-700">Cruise Speed (km/h)</th>
                      <th className="text-right py-3 pr-4 font-semibold text-slate-700">Cruise Speed (mph)</th>
                      <th className="text-right py-3 font-semibold text-slate-700">Mach</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-600 divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">Boeing 747-400</td>
                      <td className="py-3 pr-4">Wide-body</td>
                      <td className="py-3 pr-4 text-right font-mono">920</td>
                      <td className="py-3 pr-4 text-right font-mono">572</td>
                      <td className="py-3 text-right font-mono">0.85</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">Boeing 777-300ER</td>
                      <td className="py-3 pr-4">Wide-body</td>
                      <td className="py-3 pr-4 text-right font-mono">905</td>
                      <td className="py-3 pr-4 text-right font-mono">562</td>
                      <td className="py-3 text-right font-mono">0.84</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">Boeing 787-9 Dreamliner</td>
                      <td className="py-3 pr-4">Wide-body</td>
                      <td className="py-3 pr-4 text-right font-mono">903</td>
                      <td className="py-3 pr-4 text-right font-mono">561</td>
                      <td className="py-3 text-right font-mono">0.85</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">Airbus A350-900</td>
                      <td className="py-3 pr-4">Wide-body</td>
                      <td className="py-3 pr-4 text-right font-mono">903</td>
                      <td className="py-3 pr-4 text-right font-mono">561</td>
                      <td className="py-3 text-right font-mono">0.85</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">Airbus A380</td>
                      <td className="py-3 pr-4">Wide-body</td>
                      <td className="py-3 pr-4 text-right font-mono">900</td>
                      <td className="py-3 pr-4 text-right font-mono">559</td>
                      <td className="py-3 text-right font-mono">0.85</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">Boeing 737-800</td>
                      <td className="py-3 pr-4">Narrow-body</td>
                      <td className="py-3 pr-4 text-right font-mono">842</td>
                      <td className="py-3 pr-4 text-right font-mono">523</td>
                      <td className="py-3 text-right font-mono">0.79</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">Airbus A320neo</td>
                      <td className="py-3 pr-4">Narrow-body</td>
                      <td className="py-3 pr-4 text-right font-mono">833</td>
                      <td className="py-3 pr-4 text-right font-mono">518</td>
                      <td className="py-3 text-right font-mono">0.78</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">Airbus A321neo</td>
                      <td className="py-3 pr-4">Narrow-body</td>
                      <td className="py-3 pr-4 text-right font-mono">833</td>
                      <td className="py-3 pr-4 text-right font-mono">518</td>
                      <td className="py-3 text-right font-mono">0.78</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">Embraer E195-E2</td>
                      <td className="py-3 pr-4">Regional jet</td>
                      <td className="py-3 pr-4 text-right font-mono">833</td>
                      <td className="py-3 pr-4 text-right font-mono">518</td>
                      <td className="py-3 text-right font-mono">0.78</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">Bombardier CRJ-900</td>
                      <td className="py-3 pr-4">Regional jet</td>
                      <td className="py-3 pr-4 text-right font-mono">830</td>
                      <td className="py-3 pr-4 text-right font-mono">516</td>
                      <td className="py-3 text-right font-mono">0.78</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-slate-500 text-xs mt-3">
                Cruise speeds are approximate and vary with altitude, temperature, aircraft weight, and airline operating procedures. Mach numbers are at typical cruising altitude (35,000-40,000 ft).
              </p>
            </section>

            {/* External Resources */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-0">External Resources &amp; References</h2>
              <p className="text-slate-700 mb-6">
                Our data and methodology draw from these authoritative sources:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <a href="https://openflights.org/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0"><span className="text-orange-600 font-bold text-sm">OF</span></div>
                  <div><div className="font-medium text-slate-900 text-sm">OpenFlights</div><div className="text-xs text-slate-500">Airport, airline &amp; route database (ODbL)</div></div>
                </a>
                <a href="https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0"><span className="text-green-600 font-bold text-sm">UK</span></div>
                  <div><div className="font-medium text-slate-900 text-sm">DEFRA 2024 Emission Factors</div><div className="text-xs text-slate-500">UK Government carbon accounting data</div></div>
                </a>
                <a href="https://en.wikipedia.org/wiki/World_Geodetic_System" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"><span className="text-blue-600 font-bold text-sm">W</span></div>
                  <div><div className="font-medium text-slate-900 text-sm">WGS-84 Reference</div><div className="text-xs text-slate-500">World Geodetic System specification</div></div>
                </a>
                <a href="https://en.wikipedia.org/wiki/Vincenty%27s_formulae" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"><span className="text-blue-600 font-bold text-sm">V</span></div>
                  <div><div className="font-medium text-slate-900 text-sm">Vincenty&apos;s Formulae</div><div className="text-xs text-slate-500">Geodesic distance calculation method</div></div>
                </a>
                <a href="https://www.iata.org/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0"><span className="text-purple-600 font-bold text-sm">IA</span></div>
                  <div><div className="font-medium text-slate-900 text-sm">IATA</div><div className="text-xs text-slate-500">International Air Transport Association</div></div>
                </a>
                <a href="https://www.icao.int/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0"><span className="text-purple-600 font-bold text-sm">IC</span></div>
                  <div><div className="font-medium text-slate-900 text-sm">ICAO</div><div className="text-xs text-slate-500">International Civil Aviation Organization</div></div>
                </a>
                <a href="https://www.faa.gov/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0"><span className="text-red-600 font-bold text-sm">FA</span></div>
                  <div><div className="font-medium text-slate-900 text-sm">FAA</div><div className="text-xs text-slate-500">Federal Aviation Administration (US)</div></div>
                </a>
                <a href="https://www.eurocontrol.int/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0"><span className="text-red-600 font-bold text-sm">EC</span></div>
                  <div><div className="font-medium text-slate-900 text-sm">Eurocontrol</div><div className="text-xs text-slate-500">European air traffic management</div></div>
                </a>
                <a href="https://science.nasa.gov/earth/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0"><span className="text-indigo-600 font-bold text-sm">NA</span></div>
                  <div><div className="font-medium text-slate-900 text-sm">NASA Earth Science</div><div className="text-xs text-slate-500">Earth shape and measurement data</div></div>
                </a>
                <a href="https://www.nist.gov/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0"><span className="text-indigo-600 font-bold text-sm">NI</span></div>
                  <div><div className="font-medium text-slate-900 text-sm">NIST</div><div className="text-xs text-slate-500">National standards for measurement</div></div>
                </a>
                <a href="https://www.flightaware.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0"><span className="text-teal-600 font-bold text-sm">FA</span></div>
                  <div><div className="font-medium text-slate-900 text-sm">FlightAware</div><div className="text-xs text-slate-500">Live flight tracking and data</div></div>
                </a>
                <a href="https://www.flightradar24.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0"><span className="text-teal-600 font-bold text-sm">FR</span></div>
                  <div><div className="font-medium text-slate-900 text-sm">Flightradar24</div><div className="text-xs text-slate-500">Real-time flight tracking</div></div>
                </a>
                <a href="https://www.atag.org/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0"><span className="text-emerald-600 font-bold text-sm">AT</span></div>
                  <div><div className="font-medium text-slate-900 text-sm">ATAG</div><div className="text-xs text-slate-500">Air Transport Action Group</div></div>
                </a>
                <a href="https://aci.aero/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0"><span className="text-emerald-600 font-bold text-sm">AC</span></div>
                  <div><div className="font-medium text-slate-900 text-sm">ACI World</div><div className="text-xs text-slate-500">Airports Council International</div></div>
                </a>
              </div>
            </section>

            {/* More from AirMilesCalc */}
            <section className="bg-slate-50 rounded-xl border border-slate-200 p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-0">Explore AirMilesCalc</h2>
              <div className="grid md:grid-cols-4 gap-4">
                <Link href="/" className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-slate-900 mb-1">Distance Calculator</h3>
                  <p className="text-slate-600 text-sm">Calculate the distance between any two airports worldwide.</p>
                </Link>
                <Link href="/airports" className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-slate-900 mb-1">Airport Directory</h3>
                  <p className="text-slate-600 text-sm">Browse 3,000+ airports by country and region.</p>
                </Link>
                <Link href="/distance/jfk-to-lhr" className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-slate-900 mb-1">Sample Route: JFK to LHR</h3>
                  <p className="text-slate-600 text-sm">See a complete route analysis for New York to London.</p>
                </Link>
                <Link href="/privacy" className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-slate-900 mb-1">Privacy &amp; Data</h3>
                  <p className="text-slate-600 text-sm">We don&apos;t track your searches. Learn about our privacy practices.</p>
                </Link>
              </div>
            </section>

            {/* Back to Calculator CTA */}
            <div className="text-center mt-12">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Try the Calculator
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
