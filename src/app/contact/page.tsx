import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with questions, feedback, or bug reports about AirMilesCalc flight distance calculator.",
  alternates: { canonical: '/contact' },
  openGraph: {
    title: "Contact AirMilesCalc",
    description: "Get in touch with questions, feedback, or bug reports about AirMilesCalc flight distance calculator.",
  },
};

// JSON-LD structured data for Contact page
const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "Contact AirMilesCalc",
  "description": "Get in touch with questions, feedback, or bug reports about AirMilesCalc flight distance calculator.",
  "url": "https://airmilescalc.com/contact",
  "mainEntity": {
    "@type": "Organization",
    "name": "AirMilesCalc",
    "url": "https://airmilescalc.com",
    "email": "info@airmilescalc.com"
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
      "name": "Contact",
      "item": "https://airmilescalc.com/contact"
    }
  ]
};

export default function ContactPage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-slate-50 py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <ol className="flex items-center gap-2 text-slate-600">
            <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
            <li>/</li>
            <li><span className="text-slate-900">Contact</span></li>
          </ol>
        </nav>

        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Contact Us
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          Have a question, found a bug, or want to suggest a feature? We&apos;d love to hear from you.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Get in Touch */}
          <div className="space-y-6">
            {/* Email Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Get in Touch</h2>
              <p className="text-slate-600 mb-6">
                The best way to reach us is by email. We read every message and aim to respond within <strong>48-72 hours</strong>.
              </p>

              <a
                href="mailto:info@airmilescalc.com"
                className="w-full h-12 bg-blue-600 text-white font-semibold rounded-lg
                           hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Us
              </a>

              <p className="text-sm text-slate-500 mt-3 text-center">
                info@airmilescalc.com
              </p>
            </div>

            {/* What We Can Help With */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">What We Can Help With</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <div>
                    <div className="font-medium text-slate-900 text-sm">General Questions</div>
                    <div className="text-xs text-slate-500">About our calculator, data sources, or methodology</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-red-100 text-red-700 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </span>
                  <div>
                    <div className="font-medium text-slate-900 text-sm">Bug Reports</div>
                    <div className="text-xs text-slate-500">Something not working? Let us know</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-700 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </span>
                  <div>
                    <div className="font-medium text-slate-900 text-sm">Feature Requests</div>
                    <div className="text-xs text-slate-500">Suggestions for new tools or improvements</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </span>
                  <div>
                    <div className="font-medium text-slate-900 text-sm">Feedback</div>
                    <div className="text-xs text-slate-500">Tell us what you think of AirMilesCalc</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Info Sections */}
          <div className="space-y-6">
            {/* What to Expect */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-3">What to Expect</h2>
              <p className="text-slate-600">
                We read every message and aim to respond within <strong>48-72 hours</strong>. For bug reports,
                we may follow up with additional questions to help us reproduce and fix the issue.
              </p>
            </div>

            {/* Feedback Welcome */}
            <div className="bg-green-50 rounded-xl border border-green-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-3">Feedback Welcome</h2>
              <p className="text-slate-600">
                We&apos;re always looking to improve AirMilesCalc. If you have suggestions for new features,
                improvements to existing tools, or corrections to our data, we&apos;d genuinely appreciate
                hearing from you. Your feedback helps make this calculator better for everyone.
              </p>
            </div>

            {/* Bug Report Tips */}
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-3">Reporting a Bug?</h2>
              <p className="text-slate-600 mb-3">
                To help us fix the issue quickly, please include:
              </p>
              <ul className="text-slate-600 space-y-1 ml-4 list-disc text-sm">
                <li>Your browser and device</li>
                <li>Steps to reproduce the issue</li>
                <li>What you expected vs. what happened</li>
                <li>A screenshot if possible</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Before You Contact Us */}
        <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>

          <div className="space-y-6">
            {/* Question 1 */}
            <div className="border-b border-slate-100 pb-6">
              <h3 className="font-semibold text-slate-900 mb-2">
                &ldquo;Is this calculator accurate?&rdquo;
              </h3>
              <p className="text-slate-600">
                Yes, our distance calculations use the <strong>Vincenty formula</strong>, which is accurate to
                within 0.5mm on Earth&apos;s surface. This is the same mathematical model used by GPS systems
                and professional aviation software. Flight time estimates are based on industry-standard cruise
                speeds (850 km/h) plus ground time, and CO2 emissions use official DEFRA 2024 factors. While
                these are estimates that may differ from actual flight conditions, the underlying methodology
                is scientifically sound. Learn more on our <Link href="/about" className="text-blue-600 hover:underline">About page</Link>.
              </p>
            </div>

            {/* Question 2 */}
            <div className="border-b border-slate-100 pb-6">
              <h3 className="font-semibold text-slate-900 mb-2">
                &ldquo;Can I use this on my website?&rdquo;
              </h3>
              <p className="text-slate-600">
                <strong>Linking:</strong> You&apos;re welcome to link to AirMilesCalc or any of our route pages
                from your website, blog, or social media without permission.
                <br /><br />
                <strong>Embedding:</strong> If you&apos;d like to embed our calculator directly on your website
                or use our data in your own application, please contact us first to discuss options. We&apos;re
                open to partnerships but need to ensure proper attribution and usage.
              </p>
            </div>

            {/* Question 3 */}
            <div className="border-b border-slate-100 pb-6">
              <h3 className="font-semibold text-slate-900 mb-2">
                &ldquo;I have a feature request&rdquo;
              </h3>
              <p className="text-slate-600">
                We welcome suggestions for new features, additional calculators, or improvements to existing
                tools. When submitting a feature request, it helps to describe the problem you&apos;re trying
                to solve or the use case you have in mind. We can&apos;t implement every suggestion, but we
                do read them all and prioritize based on how many users would benefit.
              </p>
            </div>

            {/* Question 4 */}
            <div className="border-b border-slate-100 pb-6">
              <h3 className="font-semibold text-slate-900 mb-2">
                &ldquo;Do you offer an API?&rdquo;
              </h3>
              <p className="text-slate-600">
                We do not currently offer a public API. If you have a specific use case that requires
                programmatic access to flight distance calculations, please contact us to discuss options.
                We are open to partnerships with organizations that need bulk distance data.
              </p>
            </div>

            {/* Question 5 */}
            <div className="border-b border-slate-100 pb-6">
              <h3 className="font-semibold text-slate-900 mb-2">
                &ldquo;I found incorrect data. How do I report it?&rdquo;
              </h3>
              <p className="text-slate-600">
                We appreciate data correction reports. Please email us with the specific airport code(s),
                the incorrect data you found, and if possible, a link to the correct information from an
                official source. Airport data is sourced from OpenFlights and updated periodically.
              </p>
            </div>

            {/* Question 6 */}
            <div className="border-b border-slate-100 pb-6">
              <h3 className="font-semibold text-slate-900 mb-2">
                &ldquo;Can I use AirMilesCalc for academic research?&rdquo;
              </h3>
              <p className="text-slate-600">
                Yes. Our distance calculations use the Vincenty formula with WGS-84 parameters, which is
                suitable for academic work. If citing AirMilesCalc, please reference our methodology on the{' '}
                <Link href="/about" className="text-blue-600 hover:underline">About page</Link>.
                For bulk data needs, please contact us directly.
              </p>
            </div>

            {/* Question 7 */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                &ldquo;Why isn&apos;t my airport listed?&rdquo;
              </h3>
              <p className="text-slate-600">
                AirMilesCalc includes airports with IATA codes from the OpenFlights database. Small regional
                airports, private airfields, heliports, and military bases without IATA codes are not included.
                If you believe a commercial airport with an IATA code is missing, please let us know.
              </p>
            </div>
          </div>
        </div>

        {/* Response Time */}
        <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Typical Response Times</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-3 pr-4 font-semibold text-slate-700">Inquiry Type</th>
                  <th className="text-left py-3 font-semibold text-slate-700">Typical Response Time</th>
                </tr>
              </thead>
              <tbody className="text-slate-600 divide-y divide-slate-100">
                <tr><td className="py-3 pr-4">General questions</td><td className="py-3">48–72 hours</td></tr>
                <tr><td className="py-3 pr-4">Bug reports</td><td className="py-3">24–48 hours</td></tr>
                <tr><td className="py-3 pr-4">Data corrections</td><td className="py-3">3–5 business days</td></tr>
                <tr><td className="py-3 pr-4">Feature requests</td><td className="py-3">1–2 weeks (evaluation)</td></tr>
                <tr><td className="py-3 pr-4">Partnership inquiries</td><td className="py-3">5–7 business days</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Data Sources */}
        <div className="mt-8 bg-slate-50 rounded-xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Our Data Sources</h2>
          <p className="text-slate-700 mb-4">
            AirMilesCalc uses data from established, authoritative sources:
          </p>
          <ul className="text-slate-700 space-y-2 ml-4 list-disc">
            <li><strong>Airport Data:</strong> <a href="https://openflights.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenFlights</a> open-source database (ODbL License)</li>
            <li><strong>Emission Factors:</strong> <a href="https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">DEFRA 2024</a> UK Government conversion factors</li>
            <li><strong>Distance Formula:</strong> <a href="https://en.wikipedia.org/wiki/Vincenty%27s_formulae" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Vincenty&apos;s formulae</a> on the WGS-84 ellipsoid</li>
          </ul>
        </div>

        {/* Helpful Aviation Resources */}
        <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Helpful Aviation Resources</h2>
          <p className="text-slate-700 mb-6">
            These external aviation resources may be useful alongside our distance calculator:
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <a href="https://www.flightaware.com/" target="_blank" rel="noopener noreferrer" className="block bg-slate-50 rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow">
              <div className="font-semibold text-blue-600 text-sm">FlightAware</div>
              <div className="text-xs text-slate-500 mt-1">Track real-time flights and check delays</div>
            </a>
            <a href="https://www.flightradar24.com/" target="_blank" rel="noopener noreferrer" className="block bg-slate-50 rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow">
              <div className="font-semibold text-blue-600 text-sm">Flightradar24</div>
              <div className="text-xs text-slate-500 mt-1">Live aircraft tracking on a map</div>
            </a>
            <a href="https://www.seatguru.com/" target="_blank" rel="noopener noreferrer" className="block bg-slate-50 rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow">
              <div className="font-semibold text-blue-600 text-sm">SeatGuru</div>
              <div className="text-xs text-slate-500 mt-1">Compare airline seats and cabin layouts</div>
            </a>
            <a href="https://www.google.com/travel/flights" target="_blank" rel="noopener noreferrer" className="block bg-slate-50 rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow">
              <div className="font-semibold text-blue-600 text-sm">Google Flights</div>
              <div className="text-xs text-slate-500 mt-1">Search and compare flight prices</div>
            </a>
            <a href="https://www.iata.org/en/publications/directories/code-search/" target="_blank" rel="noopener noreferrer" className="block bg-slate-50 rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow">
              <div className="font-semibold text-blue-600 text-sm">IATA Airport Code Search</div>
              <div className="text-xs text-slate-500 mt-1">Official IATA code directory</div>
            </a>
            <a href="https://www.faa.gov/" target="_blank" rel="noopener noreferrer" className="block bg-slate-50 rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow">
              <div className="font-semibold text-blue-600 text-sm">FAA</div>
              <div className="text-xs text-slate-500 mt-1">US aviation regulations and safety data</div>
            </a>
            <a href="https://www.eurocontrol.int/" target="_blank" rel="noopener noreferrer" className="block bg-slate-50 rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow">
              <div className="font-semibold text-blue-600 text-sm">Eurocontrol</div>
              <div className="text-xs text-slate-500 mt-1">European air traffic data</div>
            </a>
          </div>
        </div>

        {/* Partnerships & Media */}
        <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Partnerships &amp; Media</h2>
          <p className="text-slate-700 mb-4">
            AirMilesCalc is open to partnerships with travel blogs, aviation websites, and educational
            institutions. Whether you&apos;re looking to integrate distance data into your platform, collaborate
            on content, or feature AirMilesCalc in your publication, we&apos;d love to explore how we can
            work together.
          </p>
          <p className="text-slate-700">
            For partnership and media inquiries, please reach out at{' '}
            <a href="mailto:info@airmilescalc.com" className="text-blue-600 hover:underline font-medium">
              info@airmilescalc.com
            </a>.
          </p>
        </div>

        {/* Interlinking */}
        <div className="mt-8 grid md:grid-cols-5 gap-4">
          <Link href="/about" className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow text-center">
            <div className="font-semibold text-slate-900 text-sm">About</div>
            <div className="text-xs text-slate-500 mt-1">Our methodology</div>
          </Link>
          <Link href="/privacy" className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow text-center">
            <div className="font-semibold text-slate-900 text-sm">Privacy</div>
            <div className="text-xs text-slate-500 mt-1">How we protect your data</div>
          </Link>
          <Link href="/terms" className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow text-center">
            <div className="font-semibold text-slate-900 text-sm">Terms</div>
            <div className="text-xs text-slate-500 mt-1">Terms of service</div>
          </Link>
          <Link href="/airports" className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow text-center">
            <div className="font-semibold text-slate-900 text-sm">Airports</div>
            <div className="text-xs text-slate-500 mt-1">Browse all airports</div>
          </Link>
          <Link href="/" className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow text-center">
            <div className="font-semibold text-slate-900 text-sm">Calculator</div>
            <div className="text-xs text-slate-500 mt-1">Distance calculator</div>
          </Link>
        </div>

        {/* Back to Calculator CTA */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Calculator
          </Link>
        </div>
      </div>
      </div>
    </>
  );
}
