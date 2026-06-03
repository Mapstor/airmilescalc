import { Metadata } from 'next';
import Link from 'next/link';
import { getCountriesWithAirports, getStats, getTopAirportsByRouteCount } from '@/lib/queries';
import AirportDirectorySearch from '@/components/airports/AirportDirectorySearch';
import { slugify } from '@/lib/slug';
import { displayCountryName } from '@/lib/country';
import { InternalLinks, Sources, Lede } from '@/components/content/blocks';
import { ogDefaults, ogImageMeta, twitterMeta } from '@/lib/og';

export const metadata: Metadata = {
  title: 'Airport directory',
  description: 'Browse 3,000+ commercial airports worldwide by country. IATA / ICAO codes, coordinates, route counts, and links to per-airport distance and CO₂ pages.',
  alternates: { canonical: '/airports' },
  openGraph: {
    ...ogDefaults(),
    title: 'Airport directory',
    description: 'Browse 3,000+ commercial airports worldwide by country, with IATA codes and route counts.',
    url: '/airports',
    type: 'website',
    images: ogImageMeta({ title: 'Airport directory', subtitle: '3,000+ commercial airports worldwide, by country.', category: 'Airports' }),
  },
  twitter: twitterMeta({ title: 'Airport directory', subtitle: '3,000+ commercial airports worldwide, by country.', category: 'Airports' }),
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
    // Group by the canonical display name's first letter so e.g. "North
    // Macedonia" lives under "N" not "M".
    const letter = displayCountryName(country.country)[0]?.toUpperCase() ?? '#';
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

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://airmilescalc.com' },
      { '@type': 'ListItem', position: 2, name: 'Airports', item: 'https://airmilescalc.com/airports' },
    ],
  };

  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': 'https://airmilescalc.com/airports#collection',
    name: 'Airport directory',
    description: 'Browse 3,000+ commercial airports worldwide by country, with IATA codes and route counts.',
    url: 'https://airmilescalc.com/airports',
    inLanguage: 'en',
    // Reference the WebSite by @id so this CollectionPage joins the site
    // graph defined in src/app/layout.tsx, instead of declaring an inline
    // duplicate (which Schema.org consumers cannot deduplicate).
    isPartOf: { '@id': 'https://airmilescalc.com/#website' },
    about: { '@id': 'https://airmilescalc.com/#organization' },
  };

  // ItemList of the top airports (by route count) on the directory page so
  // the previously-orphaned `/airports` collection has a machine-readable
  // index of its primary entities. Caps at the first 20 to stay focused.
  const topAirportsItemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Top 20 busiest airports by destinations',
    numberOfItems: topAirports.length,
    itemListElement: topAirports.map((entry, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://airmilescalc.com/airport/${entry.airport.iata.toLowerCase()}`,
      name: `${entry.airport.name} (${entry.airport.iata.toUpperCase()})`,
    })),
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* JSON-LD schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(topAirportsItemList) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <ol className="flex items-center gap-2 text-slate-600">
            <li><Link href="/" className="hover:text-[#0B2447]">Home</Link></li>
            <li>/</li>
            <li><span className="text-[#0B2447]">Airports</span></li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[24px] md:text-[28px] font-semibold text-[#0B2447] tracking-tight mb-2">
            All Airports
          </h1>
          <p className="text-lg text-slate-600">
            Browse {stats.airports.toLocaleString()} airports in {countries.length} countries worldwide
          </p>
        </div>

        <Lede>
          Every commercial airport in the OpenFlights database, organised by
          country, with a live IATA / city / name search. Each airport links
          to a dedicated page showing routes, airlines, country context, and a
          distance calculator pre-filled with that airport as origin.
        </Lede>

        <Sources
          items={[
            {
              id: 1,
              label: 'OpenFlights — Airports, airlines, and routes',
              note: 'Open Database License (ODbL) v1.0; ~7,698 airports, ~6,162 airlines, 67,663 routes captured in the final third-party feed update of June 2014',
              venue: 'openflights.org/data.php',
              date: 'Community-maintained',
              url: 'https://openflights.org/data.php',
            },
            {
              id: 2,
              label: 'IATA Airline Coding Directory',
              note: 'Authoritative list of IATA two-letter airline codes and three-letter airport codes',
              venue: 'International Air Transport Association',
              date: 'Updated periodically',
              url: 'https://www.iata.org/en/publications/directories/code-search/',
            },
            {
              id: 3,
              label: 'ICAO Doc 7910 — Location Indicators',
              note: 'Authoritative list of four-letter ICAO location indicators for aerodromes worldwide',
              venue: 'International Civil Aviation Organization',
              date: 'Updated quarterly',
              url: 'https://www.icao.int/safety/OPS/OPS-Section/Pages/doc7910.aspx',
            },
            {
              id: 4,
              label: 'ACI World — Top 20 busiest airports',
              note: 'Annual passenger-traffic ranking; ATL led 2023 with 104.6 M passengers',
              venue: 'Airports Council International',
              date: 'July 2024 (for 2023 data)',
              url: 'https://aci.aero/2024/07/16/top-20-busiest-airports-in-the-world-confirmed-by-aci-world/',
            },
          ]}
        />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-md border border-slate-200 p-4 text-center">
            <div className="text-[22px] font-semibold text-[#0B2447] font-mono tabular-nums leading-none">{stats.airports.toLocaleString()}</div>
            <div className="text-sm text-slate-600">Airports</div>
          </div>
          <div className="bg-white rounded-md border border-slate-200 p-4 text-center">
            <div className="text-[22px] font-semibold text-[#0B2447] font-mono tabular-nums leading-none">{countries.length}</div>
            <div className="text-sm text-slate-600">Countries</div>
          </div>
          <div className="bg-white rounded-md border border-slate-200 p-4 text-center">
            <div className="text-[22px] font-semibold text-[#0B2447] font-mono tabular-nums leading-none">{stats.routes.toLocaleString()}</div>
            <div className="text-sm text-slate-600">Routes</div>
          </div>
        </div>

        {/* Live airport search (client-side, hits /api/airports/search) */}
        <AirportDirectorySearch />

        {/* Letter Navigation */}
        <div className="bg-white rounded-md border border-slate-200 p-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {letters.map(letter => (
              <a
                key={letter}
                href={`#${letter}`}
                className="w-8 h-8 flex items-center justify-center rounded bg-slate-100 hover:bg-[#EEF2F7] hover:text-[#0B2447] text-sm font-medium transition-colors"
              >
                {letter}
              </a>
            ))}
          </div>
        </div>

        {/* Intro Text */}
        <div className="bg-white rounded-md border border-slate-200 p-6 mb-8">
          <h2 className="text-[16px] font-semibold text-[#0B2447] tracking-tight mb-3">About This Airport Directory</h2>
          <div className="space-y-4 text-slate-700 leading-relaxed">
            <p>
              Welcome to the AirMilesCalc global airport directory. This page catalogues every commercial airport in our database,
              organized by country, so you can quickly look up airport codes, locations, and route connections.
              Whether you are planning a multi-city itinerary or researching flight options, this directory is a
              practical starting point.
            </p>
            <p>
              The underlying data comes from the{' '}
              <a href="https://openflights.org/" target="_blank" rel="noopener noreferrer" className="text-[#0B2447] hover:underline underline-offset-2 font-medium">
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
        <div className="bg-white rounded-md border border-slate-200 p-6 mb-8">
          <h2 className="text-[16px] font-semibold text-[#0B2447] tracking-tight mb-1">Top 20 Busiest Airports by Destinations</h2>
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
                        className="text-[#0B2447] hover:underline underline-offset-2 font-medium font-medium"
                      >
                        {entry.airport.name}
                      </Link>
                    </td>
                    <td className="py-2 pr-3 font-mono text-slate-700">{entry.airport.iata.toUpperCase()}</td>
                    <td className="py-2 pr-3 text-slate-700">{entry.airport.city}</td>
                    <td className="py-2 pr-3 text-slate-700">{displayCountryName(entry.airport.country)}</td>
                    <td className="py-2 pl-3 text-right font-semibold text-[#0B2447]">{entry.route_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Airports by Continent */}
        <div className="mb-8">
          <h2 className="text-[16px] font-semibold text-[#0B2447] tracking-tight mb-4">Airports by Continent</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {continents.map((continent) => (
              <div
                key={continent.name}
                className="bg-white rounded-md border border-slate-200 p-4 hover:border-[#0B2447]/40 hover:bg-stone-50 transition-colors"
              >
                <h3 className="text-[15px] font-semibold text-[#0B2447] tracking-tight mb-2">{continent.name}</h3>
                <div className="flex gap-6 text-sm text-slate-600">
                  <div>
                    <span className="text-[22px] font-semibold text-[#0B2447] font-mono tabular-nums leading-none block">{continent.countries.toLocaleString()}</span>
                    Countries
                  </div>
                  <div>
                    <span className="text-[22px] font-semibold text-[#0B2447] font-mono tabular-nums leading-none block">~{continent.airports.toLocaleString()}</span>
                    Airports
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Airport Hub Types */}
        <div className="bg-white rounded-md border border-slate-200 p-6 mb-8">
          <h2 className="text-[16px] font-semibold text-[#0B2447] tracking-tight mb-2">Airport Hub Types</h2>
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
                  <td className="py-2 pr-3 text-[#0B2447] font-medium">Primary Hub</td>
                  <td className="py-2 pr-3 text-slate-700">Major connection point for one or more airlines</td>
                  <td className="py-2 pr-3 text-slate-700">100+ destinations</td>
                  <td className="py-2 pr-3 font-mono text-[#0B2447]">ATL, LHR, DXB</td>
                </tr>
                <tr className="border-b border-slate-100 bg-white">
                  <td className="py-2 pr-3 text-[#0B2447] font-medium">Secondary Hub</td>
                  <td className="py-2 pr-3 text-slate-700">Regional connection serving a geographic area</td>
                  <td className="py-2 pr-3 text-slate-700">50&ndash;100 destinations</td>
                  <td className="py-2 pr-3 font-mono text-[#0B2447]">CLT, MUC, DOH</td>
                </tr>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <td className="py-2 pr-3 text-[#0B2447] font-medium">Focus City</td>
                  <td className="py-2 pr-3 text-slate-700">Significant airline operations without full hub status</td>
                  <td className="py-2 pr-3 text-slate-700">30&ndash;50 destinations</td>
                  <td className="py-2 pr-3 font-mono text-[#0B2447]">AUS, BHX</td>
                </tr>
                <tr className="border-b border-slate-100 bg-white">
                  <td className="py-2 pr-3 text-[#0B2447] font-medium">Regional Airport</td>
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
              className="text-[#0B2447] hover:underline underline-offset-2 font-medium"
            >
              FAA
            </a>{' '}
            for detailed airport classification criteria.
          </p>
        </div>

        {/* Airport Runway Facts */}
        <div className="bg-white rounded-md border border-slate-200 p-6 mb-8">
          <h2 className="text-[16px] font-semibold text-[#0B2447] tracking-tight mb-2">Airport Runway Facts</h2>
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
                  <td className="py-2 pr-3 text-[#0B2447] font-medium">Highest airport</td>
                  <td className="py-2 pr-3 text-slate-700">El Alto, La Paz</td>
                  <td className="py-2 pr-3 font-mono text-[#0B2447]">LPB</td>
                  <td className="py-2 pr-3 text-slate-700">4,061 m / 13,323 ft elevation</td>
                </tr>
                <tr className="border-b border-slate-100 bg-white">
                  <td className="py-2 pr-3 text-[#0B2447] font-medium">Lowest airport</td>
                  <td className="py-2 pr-3 text-slate-700">Bar Yehuda (Dead Sea)</td>
                  <td className="py-2 pr-3 font-mono text-[#0B2447]">MTZ</td>
                  <td className="py-2 pr-3 text-slate-700">-389 m / -1,276 ft elevation</td>
                </tr>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <td className="py-2 pr-3 text-[#0B2447] font-medium">Longest runway</td>
                  <td className="py-2 pr-3 text-slate-700">Qamdo Bamda</td>
                  <td className="py-2 pr-3 font-mono text-[#0B2447]">BPX</td>
                  <td className="py-2 pr-3 text-slate-700">5,500 m / 18,045 ft</td>
                </tr>
                <tr className="border-b border-slate-100 bg-white">
                  <td className="py-2 pr-3 text-[#0B2447] font-medium">Busiest single runway</td>
                  <td className="py-2 pr-3 text-slate-700">London Gatwick</td>
                  <td className="py-2 pr-3 font-mono text-[#0B2447]">LGW</td>
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
              className="text-[#0B2447] hover:underline underline-offset-2 font-medium"
            >
              ACI World
            </a>{' '}
            for comprehensive airport traffic and infrastructure data.
          </p>
        </div>

        {/* Understanding Airport Codes */}
        <div className="bg-white rounded-md border border-slate-200 p-6 mb-8">
          <h2 className="text-[16px] font-semibold text-[#0B2447] tracking-tight mb-2">Understanding Airport Codes</h2>
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
                    <td className="py-2 pr-3 text-[#0B2447] font-medium">{row.airport}</td>
                    <td className="py-2 pr-3 text-slate-700">{row.city}</td>
                    <td className="py-2 pr-3 font-mono text-[#0B2447] font-semibold">{row.iata}</td>
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
              <h2 className="text-[20px] font-semibold text-[#0B2447] tracking-tight mb-4 pb-2 border-b border-slate-200">
                {letter}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {groupedCountries[letter].map(country => (
                  <Link
                    key={country.country}
                    href={`/airports/${slugify(country.country)}`}
                    className="bg-white rounded-md border border-slate-200 p-3.5 hover:border-[#0B2447]/40 hover:bg-stone-50 transition-colors"
                  >
                    <div className="font-medium text-[#0B2447]">{displayCountryName(country.country)}</div>
                    <div className="text-sm text-slate-500">{country.count} airports</div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-md border border-slate-200 p-6 mt-12 mb-8">
          <h2 className="text-[16px] font-semibold text-[#0B2447] tracking-tight mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <div key={index} className={index < faqItems.length - 1 ? 'pb-6 border-b border-slate-100' : ''}>
                <h3 className="text-base font-semibold text-[#0B2447] mb-2">{item.question}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <InternalLinks
          heading="Where to go next"
          links={[
            { href: '/', title: 'Distance calculator', description: 'Compute air miles, flight time, and CO₂ between any two airports.' },
            { href: '/methodology', title: 'Methodology & sources', description: 'Vincenty, WGS-84, DEFRA 2024, Lee 2021 — every formula and primary source.' },
            { href: '/learn/busiest-airports-in-the-world', title: "World's busiest airports", description: 'ACI World 2023 top ten with passenger numbers — Atlanta at 104.6 M leads.' },
            { href: '/learn/longest-flights-in-the-world', title: "World's longest flights", description: 'SQ23 SIN → JFK at 15,349 km and the rest of the ultra-long-haul top ten.' },
            { href: '/learn/airline-alliances', title: 'Airline alliances', description: 'Star, oneworld, SkyTeam — member rosters, hubs, and benefits.' },
            { href: '/learn', title: 'Learn — full index', description: 'Deep dives on aviation operations, emissions, and travel science.' },
          ]}
        />

        {/* External Links / References */}
        <div className="bg-white rounded-md border border-slate-200 p-6 mb-8">
          <h2 className="text-[16px] font-semibold text-[#0B2447] tracking-tight mb-3">External References</h2>
          <p className="text-sm text-slate-600 mb-4">
            Official resources for airport codes and aviation data:
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="https://www.iata.org/en/publications/directories/code-search/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0B2447] hover:underline underline-offset-2 font-medium"
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
                className="text-[#0B2447] hover:underline underline-offset-2 font-medium"
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
                className="text-[#0B2447] hover:underline underline-offset-2 font-medium"
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
                className="text-[#0B2447] hover:underline underline-offset-2 font-medium"
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
                className="text-[#0B2447] hover:underline underline-offset-2 font-medium"
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
                className="text-[#0B2447] hover:underline underline-offset-2 font-medium"
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
                className="text-[#0B2447] hover:underline underline-offset-2 font-medium"
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
                className="text-[#0B2447] hover:underline underline-offset-2 font-medium"
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
