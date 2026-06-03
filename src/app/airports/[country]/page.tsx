import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getCountriesWithAirports,
  getAirportsByCountryWithRoutes,
  type AirportWithRouteCount,
} from '@/lib/queries';
import { slugify } from '@/lib/slug';
import { displayCountryName } from '@/lib/country';
import AirportMap from '@/components/maps/AirportMap';
import { InternalLinks, Callout } from '@/components/content/blocks';
import { ogDefaults, ogImageMeta, twitterMeta } from '@/lib/og';

type AirportTier =
  | { label: 'Major hub'; tone: 'major' }
  | { label: 'International'; tone: 'intl' }
  | { label: 'Regional'; tone: 'regional' }
  | { label: 'Local'; tone: 'local' }
  | null;

function airportTier(routeCount: number): AirportTier {
  if (routeCount >= 200) return { label: 'Major hub', tone: 'major' };
  if (routeCount >= 50) return { label: 'International', tone: 'intl' };
  if (routeCount >= 10) return { label: 'Regional', tone: 'regional' };
  if (routeCount >= 1) return { label: 'Local', tone: 'local' };
  return null;
}

const TIER_CHIP: Record<NonNullable<AirportTier>['tone'], string> = {
  major: 'bg-[#0B2447] text-white border-[#0B2447]',
  intl: 'bg-blue-50 text-blue-800 border-blue-200',
  regional: 'bg-stone-100 text-stone-700 border-stone-200',
  local: 'bg-slate-50 text-slate-600 border-slate-200',
};

interface FaqArgs {
  countryName: string;
  airportCount: number;
  withRoutes: number;
  totalRoutes: number;
  top1?: AirportWithRouteCount;
  top2?: AirportWithRouteCount;
  topHubs: AirportWithRouteCount[];
}

interface FaqItem {
  question: string;
  answerPlain: string;
  answer: React.ReactNode;
}

function buildFaqItems(args: FaqArgs): FaqItem[] {
  const { countryName, airportCount, withRoutes, totalRoutes, top1, top2, topHubs } = args;
  const items: FaqItem[] = [];

  const allHaveRoutes = withRoutes === airportCount && airportCount > 0;
  const aps = (n: number) => (n === 1 ? 'airport' : 'airports');
  const has = (n: number) => (n === 1 ? 'has' : 'have');

  if (airportCount === 1) {
    items.push({
      question: `How many airports are in ${countryName}?`,
      answerPlain: top1
        ? `${countryName} has just one IATA-coded airport in our OpenFlights snapshot: ${top1.name} (${top1.iata.toUpperCase()}), serving ${top1.routeCount.toLocaleString()} scheduled destinations.`
        : `${countryName} has just one IATA-coded airport listed in our OpenFlights snapshot.`,
      answer: top1 ? (
        <>
          <strong>{countryName}</strong> has just one IATA-coded airport in our OpenFlights snapshot:{' '}
          <Link
            href={`/airport/${top1.iata.toLowerCase()}`}
            className="text-[#0B2447] underline-offset-2 hover:underline font-medium"
          >
            {top1.name} ({top1.iata.toUpperCase()})
          </Link>
          , serving <strong>{top1.routeCount.toLocaleString()}</strong> scheduled destinations.
        </>
      ) : (
        <>
          <strong>{countryName}</strong> has just one IATA-coded airport listed in our OpenFlights
          snapshot.
        </>
      ),
    });
  } else {
    items.push({
      question: `How many airports are in ${countryName}?`,
      answerPlain: allHaveRoutes
        ? `${countryName} has ${airportCount} ${aps(airportCount)} with active IATA codes in our database, sourced from OpenFlights — all of them with scheduled commercial routes.`
        : `${countryName} has ${airportCount} ${aps(airportCount)} with active IATA codes in our database, sourced from OpenFlights. Of those, ${withRoutes} ${has(withRoutes)} scheduled commercial routes; the remainder are general-aviation or smaller regional airfields.`,
      answer: allHaveRoutes ? (
        <>
          <strong>{countryName}</strong> has <strong>{airportCount.toLocaleString()}</strong>{' '}
          {aps(airportCount)} with active IATA codes listed in our database (sourced from OpenFlights) —
          all of them with scheduled commercial routes.
        </>
      ) : (
        <>
          <strong>{countryName}</strong> has <strong>{airportCount.toLocaleString()}</strong>{' '}
          {aps(airportCount)} with active IATA codes listed in our database (sourced from OpenFlights).
          Of those, <strong>{withRoutes.toLocaleString()}</strong> currently {has(withRoutes)} scheduled
          commercial routes; the remainder are general-aviation or smaller regional airfields.
        </>
      ),
    });
  }

  if (top1) {
    items.push({
      question: `What is the largest airport in ${countryName}?`,
      answerPlain:
        `By scheduled-route count in the OpenFlights dataset, ${top1.name} (${top1.iata.toUpperCase()}) in ${top1.city} is the most-connected airport in ${countryName}, with ${top1.routeCount} unique destinations served. Note that "largest" can also be measured by passenger throughput or aircraft movements, which are not in this dataset; if you need those metrics, official sources such as the airport's published annual report or ACI World traffic rankings are more authoritative.`,
      answer: (
        <>
          By scheduled-route count in the OpenFlights dataset,{' '}
          <Link
            href={`/airport/${top1.iata.toLowerCase()}`}
            className="text-[#0B2447] underline-offset-2 hover:underline font-medium"
          >
            {top1.name} ({top1.iata.toUpperCase()})
          </Link>{' '}
          in {top1.city} is the most-connected airport in {countryName}, serving{' '}
          <strong>{top1.routeCount.toLocaleString()}</strong> unique destinations.{' '}
          <span className="text-slate-500">
            &ldquo;Largest&rdquo; can also be measured by passenger throughput or aircraft movements,
            which are not in this dataset — for those metrics, see the airport&apos;s published annual
            report or the ACI World traffic rankings.
          </span>
        </>
      ),
    });
  }

  if (topHubs.length > 0) {
    const codes = topHubs.map((h) => h.iata.toUpperCase()).join(', ');
    const isSingleHub = topHubs.length === 1;
    const codeNoun = airportCount === 1 ? 'IATA code' : 'IATA codes';
    items.push({
      question: `What are the main IATA codes for airports in ${countryName}?`,
      answerPlain: isSingleHub
        ? `${countryName}'s primary IATA code is ${codes}, used by ${topHubs[0].name}.`
        : `The most-connected airports in ${countryName} by scheduled-route count use these IATA codes: ${codes}. The complete list of ${airportCount} ${codeNoun} is in the directory above.`,
      answer: isSingleHub ? (
        <>
          {countryName}&apos;s primary IATA code is{' '}
          <span className="font-mono tabular-nums text-[#0B2447]">{codes}</span>, used by{' '}
          <Link
            href={`/airport/${topHubs[0].iata.toLowerCase()}`}
            className="text-[#0B2447] underline-offset-2 hover:underline font-medium"
          >
            {topHubs[0].name}
          </Link>
          .
        </>
      ) : (
        <>
          The most-connected airports in {countryName} by scheduled-route count use these IATA codes:{' '}
          <span className="font-mono tabular-nums text-[#0B2447]">{codes}</span>. The complete list of{' '}
          <strong>{airportCount}</strong> {codeNoun} is in the airport directory grid above.
        </>
      ),
    });
  }

  if (top1 && top2) {
    items.push({
      question: `Can I calculate the distance between any two ${countryName} airports?`,
      answerPlain:
        `Yes — AirMilesCalc computes the distance, flight time, and CO₂ emissions for any pair of airports. For example, ${top1.iata.toUpperCase()} to ${top2.iata.toUpperCase()} can be calculated in one click.`,
      answer: (
        <>
          Yes — use the{' '}
          <Link
            href={`/?from=${top1.iata.toLowerCase()}&to=${top2.iata.toLowerCase()}`}
            className="text-[#0B2447] underline-offset-2 hover:underline font-medium"
          >
            distance calculator
          </Link>{' '}
          and enter any two IATA codes (for example,{' '}
          <span className="font-mono tabular-nums">{top1.iata.toUpperCase()} → {top2.iata.toUpperCase()}</span>) to get
          geodesic distance in miles, kilometers, and nautical miles, plus flight time and CO₂ estimates
          by cabin class.
        </>
      ),
    });
  }

  items.push({
    question: `How accurate are the ${countryName} airport coordinates and distances?`,
    answerPlain:
      `Airport coordinates come from the OpenFlights airports.dat dataset, which aggregates community-contributed records cross-referenced against official AIPs and ICAO codes. Distances between any two airports are computed in-app using the Vincenty geodesic formula on the WGS-84 reference ellipsoid, which converges to within roughly 0.5 mm — well below any practical flight-planning tolerance. Coordinates can be cross-checked against ourairports.org or the airport's official AIP for verification.`,
    answer: (
      <>
        Airport coordinates come from the OpenFlights{' '}
        <code className="text-[12px] bg-slate-100 border border-slate-200 px-1 py-0.5 rounded">airports.dat</code>{' '}
        dataset, a community-contributed reference cross-checked against official AIPs and ICAO codes.
        Distances between any two airports are computed in-app with the{' '}
        <span className="font-medium text-[#0B2447]">Vincenty geodesic formula</span> on the WGS-84
        reference ellipsoid, converging to within roughly 0.5 mm — well below any practical
        flight-planning tolerance. For independent verification of coordinates, see{' '}
        <a
          href="https://ourairports.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0B2447] underline-offset-2 hover:underline"
        >
          ourairports.org
        </a>{' '}
        or the airport&apos;s official Aeronautical Information Publication.
      </>
    ),
  });

  if (totalRoutes > 0) {
    if (airportCount === 1 && top1) {
      items.push({
        question: `How many flight routes operate from ${countryName} airports?`,
        answerPlain:
          `From ${countryName}'s single IATA-coded airport (${top1.iata.toUpperCase()}), there are ${totalRoutes.toLocaleString()} unique scheduled destinations in the OpenFlights snapshot.`,
        answer: (
          <>
            From {countryName}&apos;s single IATA-coded airport (
            <span className="font-mono tabular-nums text-[#0B2447]">{top1.iata.toUpperCase()}</span>),
            there are <strong>{totalRoutes.toLocaleString()}</strong> unique scheduled destinations in
            the OpenFlights snapshot.
          </>
        ),
      });
    } else {
      items.push({
        question: `How many flight routes operate from ${countryName} airports?`,
        answerPlain:
          `Across all ${countryName} airports in our database, there are ${totalRoutes.toLocaleString()} scheduled commercial routes (unique source-airport → destination pairs) in the OpenFlights snapshot.`,
        answer: (
          <>
            Across all <strong>{countryName}</strong> airports in our database, there are{' '}
            <strong>{totalRoutes.toLocaleString()}</strong> scheduled commercial routes to destinations
            worldwide (sum of all unique source-airport → destination pairs).
          </>
        ),
      });
    }
  }

  return items;
}

// Pre-render every country with at least one airport at build time
export function generateStaticParams() {
  const countries = getCountriesWithAirports();
  return countries.map((c) => ({ country: slugify(c.country) }));
}

export const revalidate = 86400;

function findCountryName(slug: string): string | null {
  const countries = getCountriesWithAirports();
  const match = countries.find((c) => slugify(c.country) === slug);
  return match?.country ?? null;
}

interface PageProps {
  params: Promise<{ country: string }>;
}

// Match sitemap thin-page threshold: countries with fewer than this many
// IATA-coded airports get a noindex,follow robots directive so they don't
// compete in SERPs against substantive country pages.
const MIN_AIRPORTS_FOR_INDEX = 3;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country: slug } = await params;
  const stored = findCountryName(slug);
  if (!stored) {
    return { title: 'Country not found' };
  }
  const name = displayCountryName(stored);

  // Count IATA airports for this country to decide indexing posture
  const countryAirports = getAirportsByCountryWithRoutes(stored, 1000);
  const isThin = countryAirports.length < MIN_AIRPORTS_FOR_INDEX;

  return {
    // Title trimmed: was 84ch ("Airports in United States — Full IATA Code
    // List & Distance Calculator") plus the layout's " | AirMilesCalc" suffix
    // pushed past Google's ~60ch SERP truncation. Shorter form fits the
    // budget even for long country names like Bosnia and Herzegovina.
    title: `Airports in ${name} — IATA codes & distances`,
    description: `All ${name} airports with IATA codes, coordinates, and route counts. Calculate flight distance from any ${name} airport to anywhere worldwide.`,
    keywords: [
      `airports in ${name}`,
      `${name} airports`,
      `${name} IATA codes`,
      `list of airports in ${name}`,
      `international airports in ${name}`,
      `${name} airport map`,
    ],
    alternates: { canonical: `/airports/${slug}` },
    ...(isThin && { robots: { index: false, follow: true } }),
    openGraph: {
      ...ogDefaults(),
      title: `Airports in ${name}`,
      description: `Every airport in ${name} with IATA code, city, coordinates, and one-click distance calculations.`,
      url: `/airports/${slug}`,
      type: 'website',
      images: ogImageMeta({ title: `Airports in ${name}`, subtitle: `IATA codes, coordinates, route networks, and per-airport distance pages.`, category: 'Country' }),
    },
    twitter: twitterMeta({ title: `Airports in ${name}`, subtitle: `IATA codes, coordinates, route networks, and per-airport distance pages.`, category: 'Country' }),
  };
}

export default async function CountryAirportsPage({ params }: PageProps) {
  const { country: slug } = await params;
  const countryNameStored = findCountryName(slug);
  if (!countryNameStored) {
    notFound();
  }

  // Stored value is the DB join key (passed to queries below); displayed value
  // is the canonical modern country name (see src/lib/country.ts).
  const countryName = displayCountryName(countryNameStored);
  const airports = getAirportsByCountryWithRoutes(countryNameStored, 1000);

  // Ranked view for the "major hubs" section + FAQ answers
  const byRoutes = [...airports].sort((a, b) => b.routeCount - a.routeCount);
  const topHubs = byRoutes.filter((a) => a.routeCount > 0).slice(0, 5);
  const top1 = topHubs[0];
  const top2 = topHubs[1];

  const airportCount = airports.length;
  const withRoutes = airports.filter((a) => a.routeCount > 0).length;
  const totalRoutes = airports.reduce((sum, a) => sum + a.routeCount, 0);

  // ItemList structured data — each airport is a list item. @id matches the
  // hasPart reference on the CollectionPage above so both schemas join.
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `https://airmilescalc.com/airports/${slug}#itemlist`,
    name: `Airports in ${countryName}`,
    numberOfItems: airports.length,
    itemListElement: airports.slice(0, 50).map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://airmilescalc.com/airport/${a.iata.toLowerCase()}`,
      name: a.name,
    })),
  };

  // CollectionPage schema wrapping the country directory. Joins the site
  // graph via isPartOf → WebSite @id, and points at the ItemList emitted in
  // its own <script> block via hasPart → ItemList @id (the previous version
  // declared an empty inline ItemList that didn't reference the real one).
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `https://airmilescalc.com/airports/${slug}#collection`,
    name: `Airports in ${countryName}`,
    description: `Complete list of commercial airports in ${countryName}, with IATA codes, coordinates, and route networks.`,
    url: `https://airmilescalc.com/airports/${slug}`,
    inLanguage: 'en',
    isPartOf: { '@id': 'https://airmilescalc.com/#website' },
    about: {
      '@type': 'Country',
      name: countryName,
    },
    hasPart: { '@id': `https://airmilescalc.com/airports/${slug}#itemlist` },
  };

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
        name: countryName,
        item: `https://airmilescalc.com/airports/${slug}`,
      },
    ],
  };

  const faqItems = buildFaqItems({
    countryName,
    airportCount,
    withRoutes,
    totalRoutes,
    top1,
    top2,
    topHubs,
  });

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answerPlain },
    })),
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-5xl mx-auto px-5 py-7">
        {/* Breadcrumb */}
        <nav className="text-[11.5px] uppercase tracking-[0.1em] font-mono text-slate-500 mb-5">
          <Link href="/" className="hover:text-[#0B2447]">Home</Link>
          <span className="mx-2 text-slate-300">/</span>
          <Link href="/airports" className="hover:text-[#0B2447]">Airports</Link>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-[#0B2447]">{countryName}</span>
        </nav>

        <div className="mb-6 pb-5 border-b border-slate-200">
          <h1 className="text-[24px] md:text-[28px] font-semibold text-[#0B2447] tracking-tight mb-1">
            Airports in {countryName}
          </h1>
          <p className="text-[13.5px] text-slate-600">
            <span className="font-mono tabular-nums text-[#0B2447] font-semibold">{airportCount}</span>{' '}
            {airportCount === 1 ? 'airport' : 'airports'} with IATA codes
            {withRoutes > 0 && withRoutes < airportCount && (
              <>
                {' · '}
                <span className="font-mono tabular-nums text-[#0B2447] font-semibold">{withRoutes}</span> with scheduled routes
              </>
            )}
            {totalRoutes > 0 && (
              <>
                {' · '}
                <span className="font-mono tabular-nums text-[#0B2447] font-semibold">{totalRoutes.toLocaleString()}</span> routes total
              </>
            )}
          </p>
        </div>

        {/* SEO intro prose — figures all computed from the DB so claims stay sourced */}
        <section className="mb-6 bg-white border border-slate-200 rounded-md p-5 text-[13.5px] leading-relaxed text-slate-700 space-y-3">
          <p>
            This directory lists every IATA-coded airport in <strong>{countryName}</strong> recorded in
            the OpenFlights dataset, with city, exact latitude/longitude, the count of unique
            destinations served, and one-click flight-distance tools to anywhere in the world.{' '}
            {airportCount === 1 ? (
              <>{countryName} has just one IATA-coded airport listed below.</>
            ) : (
              <>
                The range spans from major international hubs serving hundreds of distinct destinations
                down to small regional and local airports serving a handful of short-haul links —{' '}
                {airportCount} {countryName} airports in total.
              </>
            )}
          </p>
          {topHubs.length === 1 ? (
            <p>
              The most-connected airport in {countryName} is{' '}
              <Link
                href={`/airport/${topHubs[0].iata.toLowerCase()}`}
                className="text-[#0B2447] font-medium hover:underline underline-offset-2"
              >
                {topHubs[0].name} ({topHubs[0].iata.toUpperCase()})
              </Link>
              , serving <strong>{topHubs[0].routeCount.toLocaleString()}</strong> unique destinations in the
              OpenFlights snapshot. On the map above, the{' '}
              <span
                className="inline-flex items-center justify-center rounded-full text-white text-[9px] font-bold align-middle"
                style={{ width: 14, height: 14, background: '#DC2626', border: '1.5px solid white' }}
              >
                1
              </span>{' '}
              numbered pin marks this hub. Click the pin or card for full details — IATA + ICAO codes,
              elevation, timezone, airlines operating there, popular routes, and nearby alternative
              airports.
            </p>
          ) : topHubs.length >= 2 ? (
            <p>
              The {topHubs.length >= 3 ? 'three' : 'two'} most-connected airports in {countryName} by
              scheduled-route count are{' '}
              {topHubs.slice(0, topHubs.length >= 3 ? 3 : 2).map((h, i, arr) => (
                <span key={h.iata}>
                  <Link
                    href={`/airport/${h.iata.toLowerCase()}`}
                    className="text-[#0B2447] font-medium hover:underline underline-offset-2"
                  >
                    {h.name} ({h.iata.toUpperCase()})
                  </Link>
                  {i < arr.length - 2 ? ', ' : i === arr.length - 2 ? ', and ' : ''}
                </span>
              ))}
              , together accounting for{' '}
              <strong>
                {topHubs
                  .slice(0, topHubs.length >= 3 ? 3 : 2)
                  .reduce((s, h) => s + h.routeCount, 0)
                  .toLocaleString()}
              </strong>{' '}
              of the {totalRoutes.toLocaleString()} unique source-airport → destination pairs from{' '}
              {countryName} in the dataset. On the map above, pins{' '}
              <span
                className="inline-flex items-center justify-center rounded-full text-white text-[9px] font-bold align-middle"
                style={{ width: 14, height: 14, background: '#DC2626', border: '1.5px solid white' }}
              >
                1
              </span>
              {topHubs.length >= 2 && (
                <>
                  &nbsp;–&nbsp;
                  <span
                    className="inline-flex items-center justify-center rounded-full text-white text-[9px] font-bold align-middle"
                    style={{ width: 14, height: 14, background: '#DC2626', border: '1.5px solid white' }}
                  >
                    {Math.min(topHubs.length, 5)}
                  </span>
                </>
              )}{' '}
              mark the top hubs; small dots are every other listed airport. Click any pin or card for
              full details — IATA + ICAO codes, elevation, timezone, airlines operating there, popular
              routes, and nearby alternative airports.
            </p>
          ) : null}
        </section>

        {airports.length > 0 && (
          <div className="mb-6">
            <AirportMap
              airports={airports.map((a) => {
                const hubIndex = topHubs.findIndex((h) => h.iata === a.iata);
                return {
                  iata: a.iata,
                  name: a.name,
                  city: a.city,
                  latitude: a.latitude,
                  longitude: a.longitude,
                  rank: hubIndex >= 0 ? hubIndex + 1 : undefined,
                  routeCount: a.routeCount,
                };
              })}
              height={420}
            />
          </div>
        )}

        {/* Major hubs — structured highlight of top airports by route network */}
        {topHubs.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[15px] font-semibold text-[#0B2447] tracking-tight mb-2">
              Major airports in {countryName}
            </h2>
            <p className="text-[12.5px] text-slate-600 mb-3">
              Ranked by the number of unique scheduled destinations served (route count from OpenFlights). The numbers below match the <span className="inline-flex items-center justify-center rounded-full text-white text-[9px] font-bold align-middle" style={{ width: 14, height: 14, background: '#DC2626', border: '1.5px solid white' }}>#</span> pins on the map.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {topHubs.map((h, i) => {
                const tier = airportTier(h.routeCount);
                return (
                  <Link
                    key={h.iata}
                    href={`/airport/${h.iata.toLowerCase()}`}
                    className="bg-white rounded-md border border-slate-200 hover:border-[#0B2447]/40 hover:bg-stone-50 transition-colors p-3"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono tabular-nums text-[10px] uppercase tracking-[0.1em] text-slate-400">#{i + 1}</span>
                      <span className="font-mono tabular-nums text-[12px] font-semibold text-[#0B2447] bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 tracking-wider">
                        {h.iata.toUpperCase()}
                      </span>
                      {tier && (
                        <span className={`text-[9.5px] uppercase tracking-[0.08em] px-1.5 py-[1px] rounded font-mono border ${TIER_CHIP[tier.tone]}`}>
                          {tier.label}
                        </span>
                      )}
                    </div>
                    <div className="font-medium text-[#0B2447] text-[13px] leading-tight truncate">
                      {h.name}
                    </div>
                    <div className="text-[11.5px] text-slate-500 mt-0.5 truncate">{h.city}</div>
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-baseline justify-between text-[11px] text-slate-500 font-mono tabular-nums">
                      <span>
                        <span className="text-[#0B2447] font-semibold">{h.routeCount.toLocaleString()}</span> routes
                      </span>
                      {h.altitude !== null && h.altitude !== undefined && (
                        <span title="Field elevation">{h.altitude.toLocaleString()} ft</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Full directory — sortable grid */}
        <section className="mb-7">
          <h2 className="text-[15px] font-semibold text-[#0B2447] tracking-tight mb-2">
            Complete list of airports in {countryName}
          </h2>
          <p className="text-[12.5px] text-slate-600 mb-3">
            {airportCount === 1
              ? `The single IATA-coded airport in ${countryName}.`
              : `All ${airportCount.toLocaleString()} IATA-coded ${countryName} airports, sorted alphabetically by city.`}
          </p>
          {airportCount === 0 ? (
            <div className="bg-white rounded-md border border-slate-200 p-6 text-center text-[13px] text-slate-600">
              No airports listed for this country.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {airports.map((a) => {
                const tier = airportTier(a.routeCount);
                return (
                  <Link
                    key={a.iata}
                    href={`/airport/${a.iata.toLowerCase()}`}
                    className="flex items-start gap-2.5 p-2.5 bg-white rounded-md border border-slate-200 hover:border-[#0B2447]/40 hover:bg-stone-50 transition-colors"
                  >
                    <span className="flex-shrink-0 font-mono tabular-nums text-[11px] font-semibold text-[#0B2447] bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 tracking-wider mt-0.5">
                      {a.iata.toUpperCase()}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-[#0B2447] text-[13px] truncate leading-tight">
                        {a.name}
                      </div>
                      <div className="text-[11.5px] text-slate-500 truncate mt-0.5">{a.city}</div>
                      <div className="flex items-center gap-1.5 mt-1 min-w-0">
                        {tier && (
                          <span className={`flex-shrink-0 text-[9.5px] uppercase tracking-[0.08em] px-1.5 py-[1px] rounded font-mono border ${TIER_CHIP[tier.tone]}`}>
                            {tier.label}
                          </span>
                        )}
                        <span className="text-[10.5px] font-mono tabular-nums text-slate-500 truncate">
                          {a.routeCount > 0
                            ? `${a.routeCount.toLocaleString()} ${a.routeCount === 1 ? 'route' : 'routes'}`
                            : 'No scheduled routes'}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* About / additional SEO prose */}
        <section className="mb-7 bg-white border border-slate-200 rounded-md p-5 text-[13.5px] leading-relaxed text-slate-700 space-y-3">
          <h2 className="text-[15px] font-semibold text-[#0B2447] tracking-tight">
            About flying via {countryName}
          </h2>
          <p>
            Distances between any two airports — within {countryName} or to anywhere else in the world — are
            computed on this site with the <strong>Vincenty geodesic formula</strong>, which models Earth&apos;s
            oblate-spheroid shape (WGS-84) and converges to within roughly 0.5&nbsp;mm. Flight times are
            estimated against typical aircraft cruise speeds for each distance band (short, medium, long, and
            ultra-long-haul); they are first-order approximations, not Air Traffic Control flight-plan times,
            and exclude taxi, holding, and routing detours. CO₂ emissions use the UK DEFRA 2024 conversion
            factors for business travel by air, broken down by economy, premium economy, business, and first
            class, including the radiative-forcing uplift.
          </p>
          <p>
            Click any airport in the directory above to open its detail page — exact coordinates, elevation,
            time zone, operating airlines, scheduled destinations, and nearby alternative airports, plus an
            embedded distance calculator. Note that this dataset is a snapshot: schedules change frequently, so
            always confirm current operations with the airline or the airport&apos;s own website before booking
            or planning.
          </p>
          <div className="pt-3 border-t border-slate-100">
            <h3 className="text-[10.5px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-1.5">
              Data sources
            </h3>
            <ul className="text-[12.5px] text-slate-600 space-y-1 list-disc list-inside marker:text-slate-400">
              <li>
                <strong>Airports &amp; routes:</strong>{' '}
                <a
                  href="https://openflights.org/data.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0B2447] underline-offset-2 hover:underline"
                >
                  OpenFlights
                </a>{' '}
                — community-maintained dataset of airports and scheduled routes (ODbL licensed).
              </li>
              <li>
                <strong>IATA / ICAO codes:</strong> official IATA and ICAO public airport-code registries.
              </li>
              <li>
                <strong>Distance:</strong> Vincenty&apos;s formulae (1975) on the WGS-84 reference ellipsoid.
              </li>
              <li>
                <strong>CO₂ factors:</strong>{' '}
                <a
                  href="https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0B2447] underline-offset-2 hover:underline"
                >
                  UK DEFRA 2024 GHG conversion factors
                </a>
                {' '}for business travel by air, including radiative forcing.
              </li>
              <li>
                <strong>Map tiles:</strong> &copy;{' '}
                <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="text-[#0B2447] underline-offset-2 hover:underline">OpenStreetMap</a>{' '}
                contributors, &copy;{' '}
                <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer" className="text-[#0B2447] underline-offset-2 hover:underline">CARTO</a>.
              </li>
            </ul>
          </div>
        </section>

        {/* FAQ */}
        {faqItems.length > 0 && (
          <section className="mb-7">
            <h2 className="text-[15px] font-semibold text-[#0B2447] tracking-tight mb-3">
              Frequently asked questions about airports in {countryName}
            </h2>
            <div className="space-y-2">
              {faqItems.map((f, i) => (
                <details
                  key={i}
                  className="bg-white border border-slate-200 rounded-md group"
                  open={i === 0}
                >
                  <summary className="cursor-pointer list-none px-4 py-3 flex items-center justify-between gap-3 text-[13.5px] font-semibold text-[#0B2447]">
                    <span>{f.question}</span>
                    <svg className="w-3.5 h-3.5 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-4 pb-4 pt-1 text-[13px] leading-relaxed text-slate-700 border-t border-slate-100">
                    {f.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        <Callout type="note" term="Where this data comes from">
          The airport list, IATA codes, coordinates, and route counts for {countryName} come from the OpenFlights open-data project. Hub rankings are derived by counting distinct destinations served from each airport in the OpenFlights routes table. Methodology and primary sources are at <Link href="/methodology" className="text-blue-700 hover:underline underline-offset-2 font-medium">/methodology</Link>.
        </Callout>

        <InternalLinks
          heading={`Continue exploring ${countryName} and beyond`}
          links={[
            {
              href: '/airports',
              title: 'All countries',
              description: 'Browse airports by country — the full OpenFlights catalogue.',
            },
            {
              href: '/',
              title: 'Distance calculator',
              description: `Compute distance, time, and CO₂ to or from any ${countryName} airport.`,
            },
            {
              href: '/methodology',
              title: 'Methodology & sources',
              description: 'Vincenty on WGS-84, DEFRA 2024, Lee 2021 — every formula and citation.',
            },
            {
              href: '/learn/airline-alliances',
              title: 'Airline alliances',
              description: 'Star, oneworld, SkyTeam — which alliances dominate which countries.',
            },
            {
              href: '/learn/busiest-airports-in-the-world',
              title: "World's busiest airports",
              description: 'ACI World 2023 ranked list — see how this country compares.',
            },
            {
              href: '/learn/longest-flights-in-the-world',
              title: "World's longest flights",
              description: 'Ultra-long-range routes and the aircraft that make them possible.',
            },
          ]}
        />

        <div className="mt-7">
          <Link
            href="/airports"
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#0B2447] hover:text-[#1A3160] border border-slate-200 hover:border-[#0B2447]/40 rounded-md px-3 py-1.5 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to all airports
          </Link>
        </div>
      </div>
    </div>
  );
}
