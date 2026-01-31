import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://airmilescalc.com"),
  title: {
    default: "AirMilesCalc - Flight Distance Calculator",
    template: "%s | AirMilesCalc"
  },
  description: "Calculate flight distances between airports worldwide. Get precise air miles, flight times, and CO2 emissions with our free calculator.",
  keywords: ["flight distance", "air miles calculator", "flight time", "airport distance", "travel calculator"],
  authors: [{ name: "AirMilesCalc" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "AirMilesCalc",
    title: "AirMilesCalc - Flight Distance Calculator",
    description: "Calculate flight distances between airports worldwide with precise calculations.",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "AirMilesCalc - Flight Distance Calculator",
      },
    ],
  },
};

function Header() {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <span className="font-bold text-xl text-slate-900">AirMilesCalc</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/airports" className="text-slate-600 hover:text-slate-900 text-sm font-medium">
            Airports
          </Link>
          <Link href="/about" className="text-slate-600 hover:text-slate-900 text-sm font-medium">
            About
          </Link>
          <Link href="/contact" className="text-slate-600 hover:text-slate-900 text-sm font-medium">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <span className="font-bold text-lg text-white">AirMilesCalc</span>
            </div>
            <p className="text-sm">
              Calculate flight distances instantly with precision. Real data, no approximations.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Calculator</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white">Distance Calculator</Link></li>
              <li><Link href="/airports" className="hover:text-white">All Airports</Link></li>
              <li><Link href="/about" className="hover:text-white">Our Methodology</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Popular Routes</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/distance/jfk-to-lhr" className="hover:text-white">JFK &rarr; LHR</Link></li>
              <li><Link href="/distance/lax-to-nrt" className="hover:text-white">LAX &rarr; NRT</Link></li>
              <li><Link href="/distance/lhr-to-dxb" className="hover:text-white">LHR &rarr; DXB</Link></li>
              <li><Link href="/distance/sfo-to-sin" className="hover:text-white">SFO &rarr; SIN</Link></li>
              <li><Link href="/distance/cdg-to-jfk" className="hover:text-white">CDG &rarr; JFK</Link></li>
              <li><Link href="/distance/mia-to-gru" className="hover:text-white">MIA &rarr; GRU</Link></li>
              <li><Link href="/distance/dfw-to-fra" className="hover:text-white">DFW &rarr; FRA</Link></li>
              <li><Link href="/distance/ord-to-cdg" className="hover:text-white">ORD &rarr; CDG</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.iata.org/" target="_blank" rel="noopener noreferrer" className="hover:text-white">IATA</a></li>
              <li><a href="https://www.icao.int/" target="_blank" rel="noopener noreferrer" className="hover:text-white">ICAO</a></li>
              <li><a href="https://openflights.org/" target="_blank" rel="noopener noreferrer" className="hover:text-white">OpenFlights</a></li>
              <li><a href="https://www.flightradar24.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white">Flightradar24</a></li>
              <li><a href="https://www.faa.gov/" target="_blank" rel="noopener noreferrer" className="hover:text-white">FAA</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8 text-sm">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 mb-4 text-slate-500">
            <span>3,000+ airports</span>
            <span>1,000+ airlines</span>
            <span>66,000+ routes</span>
          </div>
          <p className="text-center">&copy; {new Date().getFullYear()} AirMilesCalc. Data from OpenFlights (ODbL License).</p>
        </div>
      </div>
    </footer>
  );
}

// Site-wide JSON-LD structured data
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "AirMilesCalc",
  "alternateName": "Air Miles Calculator",
  "url": "https://airmilescalc.com",
  "description": "Free flight distance calculator. Calculate air miles between airports worldwide using precise geodesic calculations."
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AirMilesCalc",
  "url": "https://airmilescalc.com",
  "logo": "https://airmilescalc.com/favicon.ico",
  "email": "info@airmilescalc.com",
  "description": "Free flight distance calculator with accurate geodesic calculations, CO2 emissions estimates, and 3D globe visualization."
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
