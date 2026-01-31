import { Metadata } from 'next';
import Link from 'next/link';
import { getCountriesWithAirports, getStats, getTopAirportsByRouteCount } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'All Airports',
  description: 'Browse airports worldwide by country. Find airport codes, locations, and calculate flight distances.',
  alternates: { canonical: '/airports' },
  openGraph: {
    title: 'Airport Directory - AirMilesCalc',
    description: 'Browse 3,000+ airports worldwide by country. Find IATA codes, locations, and calculate flight distances.',
  },
};

const continents = [
  { name: 'Africa', countries: 50, airports: 350, emoji: 'AF' },
  { name: 'Asia', countries: 45, airports: 700, emoji: 'AS' },
  { name: 'Europe', countries: 45, airports: 600, emoji: 'EU' },
  { name: 'North America', countries: 25, airports: 450, emoji: 'NA' },
  { name: 'Oceania', countries: 15, airports: 150, emoji: 'OC' },
  { name: 'South America', countries: 12, airports: 200, emoji: 'SA' },
];

const airportCodeExamples = [
  { airport: 'John F. Kennedy Intl', city: 'New York', iata: 'JFK', icao: 'KJFK' },
  { airport: 'Heathrow', city: 'London', iata: 'LHR', icao: 'EGLL' },
  { airport: 'Narita Intl', city: 'Tokyo', iata: 'NRT', icao: 'RJAA' },
  { airport: 'Dubai Intl', city: 'Dubai', iata: 'DXB', icao: 'OMDB' },
  { airport: 'Kingsford Smith', city: 'Sydney', iata: 'SYD', icao: 'YSSY' },
];

const faqItems = [
  {
    question: 'How many airports does AirMilesCalc cover?',
    answer:
      'AirMilesCalc maintains a comprehensive directory of over 3,000 airports across more than 200 countries and territories. Our database is sourced from OpenFlights and includes international airports, regional hubs, and smaller domestic airports that serve scheduled airline routes.',
  },
  {
    question: 'What is an IATA airport code?',
    answer:
      'An IATA airport code is a three-letter identifier assigned by the International Air Transport Association (IATA) to airports worldwide. These codes are used on boarding passes, luggage tags, and reservation systems. For example, LAX represents Los Angeles International Airport and LHR represents London Heathrow.',
  },
  {
    question: 'How is airport data sourced?',
    answer:
      'Our airport data is sourced from the OpenFlights database, a community-maintained open-data project. The dataset includes IATA and ICAO codes, geographic coordinates, timezone information, and altitude for each airport. Route data reflects scheduled airline services between airports.',
  },
  {
    question: 'Can I search for airports by city?',
    answer:
      'Yes. You can use the search feature on our homepage to look up airports by city name, airport name, or IATA code. You can also browse this directory by country to find all airports in a particular region.',
  },
];

export const revalidate = 86400; // revalidate daily

export default function AirportsPage() {
  const countries = getCountriesWithAirports();
  const stats = getStats();
  const topAirports = getTopAirportsByRouteCount(20);

  // Group countries by first letter
  const groupedCountries = countries.reduce((acc, country) => {
    const letter = country.country[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(country);
    return acc;
  }, {} as Record<string, typeof countries>);

  const letters = Object.keys(groupedCountries).sort();

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* FAQ JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <ol className="flex items-center gap-2 text-slate-600">
            <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
            <li>/</li>
            <li><span className="text-slate-900">Airports</span></li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            All Airports
          </h1>
          <p className="text-lg text-slate-600">
            Browse {stats.airports.toLocaleString()} airports in {countries.length} countries worldwide
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.airports.toLocaleString()}</div>
            <div className="text-sm text-slate-600">Airports</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{countries.length}</div>
            <div className="text-sm text-slate-600">Countries</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.routes.toLocaleString()}</div>
            <div className="text-sm text-slate-600">Routes</div>
          </div>
        </div>

        {/* Letter Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {letters.map(letter => (
              <a
                key={letter}
                href={`#${letter}`}
                className="w-8 h-8 flex items-center justify-center rounded bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                {letter}
              </a>
            ))}
          </div>
        </div>

        {/* Intro Text */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">About This Airport Directory</h2>
          <div className="space-y-4 text-slate-700 leading-relaxed">
            <p>
              Welcome to the AirMilesCalc global airport directory. This page catalogues every commercial airport in our database,
              organized by country, so you can quickly look up airport codes, locations, and route connections.
              Whether you are planning a multi-city itinerary or researching flight options, this directory is a
              practical starting point.
            </p>
            <p>
              The underlying data comes from the{' '}
              <a href="https://openflights.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                OpenFlights
              </a>{' '}
              open-data project, which compiles airport records from public aviation sources worldwide. Each
              airport entry includes its three-letter IATA code (used on boarding passes and booking systems),
              its four-letter ICAO code (used in flight planning and air traffic control), geographic
              coordinates, and timezone data.
            </p>
            <p>
              IATA codes are the shorthand travellers encounter most often &mdash; think LAX, JFK, or CDG. They
              are assigned by the International Air Transport Association and appear on luggage tags, departure
              boards, and booking confirmations. Use the letter index above or browse the country list below to
              find any airport in our directory.
            </p>
          </div>
        </div>

        {/* Top 20 Busiest Airports */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-1">Top 20 Busiest Airports by Destinations</h2>
          <p className="text-sm text-slate-500 mb-4">Ranked by number of unique route destinations served</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600">
                  <th className="py-2 pr-3 font-medium w-12">#</th>
                  <th className="py-2 pr-3 font-medium">Airport</th>
                  <th className="py-2 pr-3 font-medium w-16">IATA</th>
                  <th className="py-2 pr-3 font-medium">City</th>
                  <th className="py-2 pr-3 font-medium">Country</th>
                  <th className="py-2 pl-3 font-medium text-right w-28">Destinations</th>
                </tr>
              </thead>
              <tbody>
                {topAirports.map((entry, index) => (
                  <tr
                    key={entry.airport.iata}
                    className={`border-b border-slate-100 ${index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}
                  >
                    <td className="py-2 pr-3 text-slate-500 font-medium">{index + 1}</td>
                    <td className="py-2 pr-3">
                      <Link
                        href={`/airport/${entry.airport.iata.toLowerCase()}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {entry.airport.name}
                      </Link>
                    </td>
                    <td className="py-2 pr-3 font-mono text-slate-700">{entry.airport.iata.toUpperCase()}</td>
                    <td className="py-2 pr-3 text-slate-700">{entry.airport.city}</td>
                    <td className="py-2 pr-3 text-slate-700">{entry.airport.country}</td>
                    <td className="py-2 pl-3 text-right font-semibold text-slate-900">{entry.route_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Airports by Continent */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Airports by Continent</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {continents.map((continent) => (
              <div
                key={continent.name}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{continent.name}</h3>
                <div className="flex gap-6 text-sm text-slate-600">
                  <div>
                    <span className="text-2xl font-bold text-blue-600 block">{continent.countries.toLocaleString()}</span>
                    Countries
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-blue-600 block">~{continent.airports.toLocaleString()}</span>
                    Airports
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Airport Hub Types */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Airport Hub Types</h2>
          <div className="space-y-4 text-slate-700 leading-relaxed mb-5">
            <p>
              Airports are classified into hub types based on the volume of connections they handle and the
              number of destinations served. Airlines designate certain airports as hubs to consolidate
              passenger traffic through central routing points, improving schedule frequency and network
              coverage. Understanding hub classification helps travellers anticipate connection options
              and service levels at each airport.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600">
                  <th className="py-2 pr-3 font-medium">Hub Type</th>
                  <th className="py-2 pr-3 font-medium">Description</th>
                  <th className="py-2 pr-3 font-medium">Destinations</th>
                  <th className="py-2 pr-3 font-medium">Examples</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <td className="py-2 pr-3 text-slate-900 font-medium">Primary Hub</td>
                  <td className="py-2 pr-3 text-slate-700">Major connection point for one or more airlines</td>
                  <td className="py-2 pr-3 text-slate-700">100+ destinations</td>
                  <td className="py-2 pr-3 font-mono text-blue-600">ATL, LHR, DXB</td>
                </tr>
                <tr className="border-b border-slate-100 bg-white">
                  <td className="py-2 pr-3 text-slate-900 font-medium">Secondary Hub</td>
                  <td className="py-2 pr-3 text-slate-700">Regional connection serving a geographic area</td>
                  <td className="py-2 pr-3 text-slate-700">50&ndash;100 destinations</td>
                  <td className="py-2 pr-3 font-mono text-blue-600">CLT, MUC, DOH</td>
                </tr>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <td className="py-2 pr-3 text-slate-900 font-medium">Focus City</td>
                  <td className="py-2 pr-3 text-slate-700">Significant airline operations without full hub status</td>
                  <td className="py-2 pr-3 text-slate-700">30&ndash;50 destinations</td>
                  <td className="py-2 pr-3 font-mono text-blue-600">AUS, BHX</td>
                </tr>
                <tr className="border-b border-slate-100 bg-white">
                  <td className="py-2 pr-3 text-slate-900 font-medium">Regional Airport</td>
                  <td className="py-2 pr-3 text-slate-700">Serves the local market with limited connections</td>
                  <td className="py-2 pr-3 text-slate-700">&lt;30 destinations</td>
                  <td className="py-2 pr-3 text-slate-500">&mdash;</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-slate-500 mt-4">
            See the{' '}
            <a
              href="https://www.faa.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              FAA
            </a>{' '}
            for detailed airport classification criteria.
          </p>
        </div>

        {/* Airport Runway Facts */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Airport Runway Facts</h2>
          <div className="space-y-4 text-slate-700 leading-relaxed mb-5">
            <p>
              Airport runways vary enormously in length, elevation, and throughput depending on geography,
              climate, and traffic demand. High-altitude airports need longer runways because thinner air
              reduces engine performance and wing lift, while busy single-runway airports push scheduling
              technology to its limits. Here are some notable records from around the world.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600">
                  <th className="py-2 pr-3 font-medium">Record</th>
                  <th className="py-2 pr-3 font-medium">Airport</th>
                  <th className="py-2 pr-3 font-medium w-16">IATA</th>
                  <th className="py-2 pr-3 font-medium">Detail</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <td className="py-2 pr-3 text-slate-900 font-medium">Highest airport</td>
                  <td className="py-2 pr-3 text-slate-700">El Alto, La Paz</td>
                  <td className="py-2 pr-3 font-mono text-blue-600">LPB</td>
                  <td className="py-2 pr-3 text-slate-700">4,061 m / 13,323 ft elevation</td>
                </tr>
                <tr className="border-b border-slate-100 bg-white">
                  <td className="py-2 pr-3 text-slate-900 font-medium">Lowest airport</td>
                  <td className="py-2 pr-3 text-slate-700">Bar Yehuda (Dead Sea)</td>
                  <td className="py-2 pr-3 font-mono text-blue-600">MTZ</td>
                  <td className="py-2 pr-3 text-slate-700">-389 m / -1,276 ft elevation</td>
                </tr>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <td className="py-2 pr-3 text-slate-900 font-medium">Longest runway</td>
                  <td className="py-2 pr-3 text-slate-700">Qamdo Bamda</td>
                  <td className="py-2 pr-3 font-mono text-blue-600">BPX</td>
                  <td className="py-2 pr-3 text-slate-700">5,500 m / 18,045 ft</td>
                </tr>
                <tr className="border-b border-slate-100 bg-white">
                  <td className="py-2 pr-3 text-slate-900 font-medium">Busiest single runway</td>
                  <td className="py-2 pr-3 text-slate-700">London Gatwick</td>
                  <td className="py-2 pr-3 font-mono text-blue-600">LGW</td>
                  <td className="py-2 pr-3 text-slate-700">~55 movements/hour</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-slate-500 mt-4">
            Visit{' '}
            <a
              href="https://aci.aero/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              ACI World
            </a>{' '}
            for comprehensive airport traffic and infrastructure data.
          </p>
        </div>

        {/* Understanding Airport Codes */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Understanding Airport Codes</h2>
          <div className="space-y-4 text-slate-700 leading-relaxed mb-5">
            <p>
              Two coding systems are used to identify airports globally. <strong>IATA codes</strong> are three-letter
              identifiers managed by the International Air Transport Association. They are the codes printed on
              your boarding pass and luggage tag &mdash; for example, <span className="font-mono">JFK</span>,{' '}
              <span className="font-mono">LHR</span>, or <span className="font-mono">NRT</span>. These codes
              are designed for the commercial aviation industry and passenger-facing systems.
            </p>
            <p>
              <strong>ICAO codes</strong> are four-letter identifiers assigned by the International Civil Aviation
              Organization. They are used primarily by air traffic control, flight planning software, and
              meteorological services. ICAO codes follow a regional prefix system: codes beginning with{' '}
              <span className="font-mono">K</span> denote airports in the contiguous United States,{' '}
              <span className="font-mono">EG</span> covers the United Kingdom, and{' '}
              <span className="font-mono">RJ</span> covers Japan.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600">
                  <th className="py-2 pr-3 font-medium">Airport</th>
                  <th className="py-2 pr-3 font-medium">City</th>
                  <th className="py-2 pr-3 font-medium w-20">IATA</th>
                  <th className="py-2 pr-3 font-medium w-20">ICAO</th>
                </tr>
              </thead>
              <tbody>
                {airportCodeExamples.map((row, index) => (
                  <tr
                    key={row.iata}
                    className={`border-b border-slate-100 ${index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}
                  >
                    <td className="py-2 pr-3 text-slate-900 font-medium">{row.airport}</td>
                    <td className="py-2 pr-3 text-slate-700">{row.city}</td>
                    <td className="py-2 pr-3 font-mono text-blue-600 font-semibold">{row.iata}</td>
                    <td className="py-2 pr-3 font-mono text-slate-700">{row.icao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Countries by Letter */}
        <div className="space-y-8">
          {letters.map(letter => (
            <section key={letter} id={letter}>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                {letter}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {groupedCountries[letter].map(country => (
                  <div
                    key={country.country}
                    className="bg-white rounded-lg border border-slate-200 p-4"
                  >
                    <div className="font-medium text-slate-900">{country.country}</div>
                    <div className="text-sm text-slate-500">{country.count} airports</div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mt-12 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <div key={index} className={index < faqItems.length - 1 ? 'pb-6 border-b border-slate-100' : ''}>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{item.question}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interlinking Block */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Explore More</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/"
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-blue-200 transition-all"
            >
              <h3 className="font-semibold text-slate-900 mb-1">Distance Calculator</h3>
              <p className="text-sm text-slate-600">Calculate air miles and flight distances between any two airports.</p>
            </Link>
            <Link
              href="/about"
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-blue-200 transition-all"
            >
              <h3 className="font-semibold text-slate-900 mb-1">About AirMilesCalc</h3>
              <p className="text-sm text-slate-600">Learn how we calculate distances and where our data comes from.</p>
            </Link>
            <Link
              href="/contact"
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-blue-200 transition-all"
            >
              <h3 className="font-semibold text-slate-900 mb-1">Contact Us</h3>
              <p className="text-sm text-slate-600">Report a data issue or suggest a feature for our airport tools.</p>
            </Link>
            <Link
              href="/about"
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-blue-200 transition-all"
            >
              <h3 className="font-semibold text-slate-900 mb-1">Our Methodology</h3>
              <p className="text-sm text-slate-600">Learn how we calculate distances with the Vincenty formula.</p>
            </Link>
          </div>
        </div>

        {/* External Links / References */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">External References</h2>
          <p className="text-sm text-slate-600 mb-4">
            Official resources for airport codes and aviation data:
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="https://www.iata.org/en/publications/directories/code-search/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                IATA Airport Code Search
              </a>
              <span className="text-slate-500"> &mdash; Official IATA three-letter code directory</span>
            </li>
            <li>
              <a
                href="https://www.icao.int/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                ICAO (Doc 7910)
              </a>
              <span className="text-slate-500"> &mdash; International Civil Aviation Organization location indicators</span>
            </li>
            <li>
              <a
                href="https://openflights.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                OpenFlights
              </a>
              <span className="text-slate-500"> &mdash; Open-source airport, airline, and route data</span>
            </li>
            <li>
              <a
                href="https://www.flightaware.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                FlightAware
              </a>
              <span className="text-slate-500"> &mdash; Live flight tracking and aviation data</span>
            </li>
            <li>
              <a
                href="https://www.flightradar24.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Flightradar24
              </a>
              <span className="text-slate-500"> &mdash; Real-time global flight tracking</span>
            </li>
            <li>
              <a
                href="https://aci.aero/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                ACI World
              </a>
              <span className="text-slate-500"> &mdash; Airports Council International worldwide data</span>
            </li>
            <li>
              <a
                href="https://www.faa.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                FAA
              </a>
              <span className="text-slate-500"> &mdash; US Federal Aviation Administration</span>
            </li>
            <li>
              <a
                href="https://www.eurocontrol.int/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Eurocontrol
              </a>
              <span className="text-slate-500"> &mdash; European air traffic management</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
