import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://airmilescalc.com"),
  title: {
    default: "AirMilesCalc — Flight Distance Calculator",
    template: "%s | AirMilesCalc"
  },
  applicationName: "AirMilesCalc",
  description: "Free flight distance calculator. Precise air miles between any two airports using Vincenty geodesic on WGS-84, with flight times and DEFRA 2024 CO₂ emissions.",
  keywords: ["flight distance", "air miles calculator", "flight time", "airport distance", "travel calculator", "vincenty formula", "great circle distance", "flight co2", "flight emissions"],
  authors: [{ name: "AirMilesCalc" }],
  category: "travel",
  alternates: {
    canonical: "/",
  },
  // Explicit robots directive. Next.js omits the <meta name="robots"> tag when
  // no override is set; some bots (Diffbot, CommonCrawl, parts of the AI bot
  // ecosystem) check the tag explicitly. Per-route metadata can override to
  // noindex (see thin-page logic in /airport/[iata] and /airports/[country]).
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "AirMilesCalc",
    url: "https://airmilescalc.com/",
    title: "AirMilesCalc — Flight Distance Calculator",
    description: "Calculate flight distances between airports worldwide with precise Vincenty geodesic + DEFRA 2024 emissions.",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "AirMilesCalc — Flight Distance Calculator",
      },
    ],
  },
  // Twitter Card defaults — used for pages that do not customise their own
  // twitter metadata. Each page that exports its own openGraph also exports
  // its own twitter (via twitterMeta() helper) so the per-page title /
  // description / image actually propagate to the Twitter Card preview.
  twitter: {
    card: "summary_large_image",
    title: "AirMilesCalc — Flight Distance Calculator",
    description: "Calculate flight distances between airports worldwide with precise Vincenty geodesic + DEFRA 2024 emissions.",
    images: ["/api/og"],
  },
  // Google Search Console verification — populate the string below with the
  // value Google Search Console gives after adding airmilescalc.com as a
  // property. Leave the placeholder if not yet registered; an empty string
  // emits no meta tag.
  verification: {
    google: "",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Cover lets the gradient extend under iOS notch / Android cutout.
  viewportFit: "cover",
  themeColor: "#0B2447",
};

function Header() {
  return (
    <header className="bg-white border-b border-slate-200">
      {/* Skip-to-content link for keyboard / screen-reader users — visible only on focus */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-[#0B2447] focus:text-white focus:px-3 focus:py-2 focus:rounded-md focus:text-[13px] focus:font-medium"
      >
        Skip to main content
      </a>
      <div className="max-w-6xl mx-auto px-5 h-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group" aria-label="AirMilesCalc home">
          <svg className="w-5 h-5 text-[#0B2447]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M21 14.5L13.5 9.5V4a1.5 1.5 0 0 0-3 0v5.5L3 14.5V16l7.5-2.2V19l-2 1.3V22l3.5-1 3.5 1v-1.7l-2-1.3v-5.2L21 16v-1.5z" />
          </svg>
          <span className="font-semibold text-[15px] tracking-tight text-[#0B2447]">
            AirMilesCalc
          </span>
          <span className="hidden sm:inline-flex items-center font-mono text-[10px] tracking-wider text-slate-400 uppercase border border-slate-200 rounded px-1.5 py-0.5 ml-1">
            v1.0
          </span>
        </Link>

        {/* Full nav — visible from md+ */}
        <nav aria-label="Primary" className="hidden md:flex items-center gap-5 text-[13px]">
          <Link href="/airports" className="text-slate-600 hover:text-[#0B2447] font-medium transition-colors">
            Airports
          </Link>
          <Link href="/methodology" className="text-slate-600 hover:text-[#0B2447] font-medium transition-colors">
            Methodology
          </Link>
          <Link href="/learn" className="text-slate-600 hover:text-[#0B2447] font-medium transition-colors">
            Learn
          </Link>
          <Link href="/about" className="text-slate-600 hover:text-[#0B2447] font-medium transition-colors">
            About
          </Link>
        </nav>

        {/* Mobile dropdown — uses native <details> so no client JS required.
            Closes on link tap because the link navigates away. */}
        <details className="md:hidden relative group">
          <summary
            className="list-none cursor-pointer flex items-center gap-1.5 text-[13px] text-slate-600 hover:text-[#0B2447] font-medium px-2 py-1.5 -mr-2"
            aria-label="Open menu"
          >
            Menu
            <svg
              className="w-3 h-3 group-open:rotate-180 transition-transform"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <nav
            aria-label="Primary mobile"
            className="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-md shadow-lg py-2 min-w-[180px] z-50"
          >
            <Link href="/airports" className="block px-4 py-2.5 text-[14px] text-slate-700 hover:bg-slate-50 hover:text-[#0B2447]">
              Airports
            </Link>
            <Link href="/methodology" className="block px-4 py-2.5 text-[14px] text-slate-700 hover:bg-slate-50 hover:text-[#0B2447]">
              Methodology
            </Link>
            <Link href="/learn" className="block px-4 py-2.5 text-[14px] text-slate-700 hover:bg-slate-50 hover:text-[#0B2447]">
              Learn
            </Link>
            <Link href="/about" className="block px-4 py-2.5 text-[14px] text-slate-700 hover:bg-slate-50 hover:text-[#0B2447]">
              About
            </Link>
            <div className="border-t border-slate-100 my-1" />
            <Link href="/contact" className="block px-4 py-2.5 text-[14px] text-slate-700 hover:bg-slate-50 hover:text-[#0B2447]">
              Contact
            </Link>
            <Link href="/privacy" className="block px-4 py-2.5 text-[14px] text-slate-700 hover:bg-slate-50 hover:text-[#0B2447]">
              Privacy
            </Link>
            <Link href="/terms" className="block px-4 py-2.5 text-[14px] text-slate-700 hover:bg-slate-50 hover:text-[#0B2447]">
              Terms
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0B2447] text-slate-300 mt-16">
      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 text-[13px]">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M21 14.5L13.5 9.5V4a1.5 1.5 0 0 0-3 0v5.5L3 14.5V16l7.5-2.2V19l-2 1.3V22l3.5-1 3.5 1v-1.7l-2-1.3v-5.2L21 16v-1.5z" />
              </svg>
              <span className="font-semibold text-white tracking-tight">AirMilesCalc</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Geodesic flight-distance and emissions data, computed from OpenFlights and DEFRA reference sources.
            </p>
          </div>
          <div>
            <h4 className="text-[10.5px] font-semibold text-slate-300 uppercase tracking-[0.12em] mb-3">Calculator</h4>
            <ul className="space-y-1.5">
              <li><Link href="/" className="hover:text-white transition-colors">Distance calculator</Link></li>
              <li><Link href="/airports" className="hover:text-white transition-colors">Airport directory</Link></li>
              <li><Link href="/methodology" className="hover:text-white transition-colors">Methodology</Link></li>
              <li><Link href="/learn" className="hover:text-white transition-colors">Learn</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10.5px] font-semibold text-slate-300 uppercase tracking-[0.12em] mb-3">Company</h4>
            <ul className="space-y-1.5">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10.5px] font-semibold text-slate-300 uppercase tracking-[0.12em] mb-3">Popular routes</h4>
            <ul className="space-y-1.5 font-mono text-[12px]">
              <li><Link href="/distance/jfk-to-lhr" className="hover:text-white transition-colors">JFK → LHR</Link></li>
              <li><Link href="/distance/lax-to-nrt" className="hover:text-white transition-colors">LAX → NRT</Link></li>
              <li><Link href="/distance/lhr-to-dxb" className="hover:text-white transition-colors">LHR → DXB</Link></li>
              <li><Link href="/distance/sfo-to-sin" className="hover:text-white transition-colors">SFO → SIN</Link></li>
              <li><Link href="/distance/cdg-to-jfk" className="hover:text-white transition-colors">CDG → JFK</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10.5px] font-semibold text-slate-300 uppercase tracking-[0.12em] mb-3">References</h4>
            <ul className="space-y-1.5">
              <li><a href="https://www.iata.org/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">IATA</a></li>
              <li><a href="https://www.icao.int/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">ICAO</a></li>
              <li><a href="https://openflights.org/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">OpenFlights</a></li>
              <li><a href="https://www.flightradar24.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Flightradar24</a></li>
              <li><a href="https://www.faa.gov/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">FAA</a></li>
            </ul>
          </div>
        </div>
        {/* Prominent legal / policy strip — AdSense reviewers and users
            both expect Privacy + Terms + Contact in obvious places. */}
        <div className="border-t border-slate-700/60 mt-8 pt-5 pb-4">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] font-medium text-slate-200">
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
            <li><Link href="/methodology" className="hover:text-white transition-colors">Methodology</Link></li>
            <li><Link href="/accessibility" className="hover:text-white transition-colors">Accessibility</Link></li>
            <li><Link href="/editorial-process" className="hover:text-white transition-colors">Editorial process</Link></li>
            <li className="text-slate-500 hidden sm:inline">·</li>
            <li className="text-slate-400">Independent editorial project</li>
          </ul>
          <p className="text-[11px] text-slate-500 mt-3 font-mono">
            Machine-readable site map for AI agents:{' '}
            <a href="/llms.txt" className="hover:text-slate-300 underline underline-offset-2">/llms.txt</a>
            {' · '}
            <a href="/sitemap.xml" className="hover:text-slate-300 underline underline-offset-2">/sitemap.xml</a>
            {' · '}
            <a href="/robots.txt" className="hover:text-slate-300 underline underline-offset-2">/robots.txt</a>
          </p>
        </div>
        <div className="border-t border-slate-700/60 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-[11.5px] text-slate-500">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono tabular-nums">
              <span><span className="text-slate-300">3,000+</span> airports</span>
              <span><span className="text-slate-300">1,000+</span> airlines</span>
              <span><span className="text-slate-300">66,000+</span> routes</span>
              <span className="text-slate-600">·</span>
              <span>Vincenty geodesic · DEFRA 2024</span>
            </div>
            <p>© {new Date().getFullYear()} AirMilesCalc · OpenFlights ODbL</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Site-wide JSON-LD structured data
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://airmilescalc.com/#website",
  "name": "AirMilesCalc",
  "alternateName": "Air Miles Calculator",
  "url": "https://airmilescalc.com",
  "description": "Free flight distance calculator. Calculate air miles between airports worldwide using Vincenty geodesic + WGS-84.",
  "inLanguage": "en",
  "publisher": { "@id": "https://airmilescalc.com/#organization" },
  // SearchAction lets Google render a sitelinks search box in SERP. The
  // urlTemplate points to /airports (the search-enabled directory page).
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://airmilescalc.com/airports?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://airmilescalc.com/#organization",
  "name": "AirMilesCalc",
  "alternateName": "Air Miles Calculator",
  "url": "https://airmilescalc.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://airmilescalc.com/logo.svg",
    "contentUrl": "https://airmilescalc.com/logo.svg",
    "caption": "AirMilesCalc logo"
  },
  "email": "info@airmilescalc.com",
  "description": "Free flight distance calculator with Vincenty geodesic distance, DEFRA 2024 CO₂ emissions, and 3D globe visualization. Independent editorial project.",
  "foundingDate": "2026",
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "email": "info@airmilescalc.com",
      "contactType": "customer support",
      "availableLanguage": ["English"],
      "areaServed": "Worldwide"
    },
    {
      "@type": "ContactPoint",
      "email": "info@airmilescalc.com",
      "contactType": "data subject requests",
      "availableLanguage": ["English"],
      "areaServed": "Worldwide"
    }
  ],
  "knowsAbout": [
    "Flight distance calculation",
    "Vincenty's formula",
    "WGS-84 ellipsoid",
    "Great-circle navigation",
    "Aviation CO₂ emissions",
    "DEFRA 2024 emission factors",
    "Jet lag and circadian re-entrainment",
    "Sustainable aviation fuel",
    "CORSIA carbon offsetting"
  ],
  "founder": {
    "@type": "Person",
    "@id": "https://airmilescalc.com/about#sam-k",
    "name": "Sam K."
  },
  "employee": {
    "@id": "https://airmilescalc.com/about#sam-k"
  }
};

const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "AirMilesCalc Flight Distance Calculator",
  "url": "https://airmilescalc.com",
  "applicationCategory": "TravelApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Calculate flight distances between 3,000+ airports",
    "Vincenty formula geodesic calculations (0.5mm accuracy)",
    "Estimated flight times",
    "CO2 emissions by cabin class (DEFRA 2024 factors)",
    "Interactive 3D globe visualization",
    "Time zone and jet lag information",
    "Distance in miles, kilometers, and nautical miles"
  ],
  "softwareVersion": "1.0",
  "description": "Free online calculator to find the exact air miles between any two airports worldwide using precise geodesic calculations."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
        />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
