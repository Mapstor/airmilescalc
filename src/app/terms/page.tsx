import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service - AirMilesCalc',
  description: 'Terms of Service for AirMilesCalc flight distance calculator. Free to use for personal, non-commercial purposes.',
  alternates: { canonical: '/terms' },
  openGraph: {
    title: 'Terms of Service - AirMilesCalc',
    description: 'Terms of Service for AirMilesCalc flight distance calculator.',
  },
};

// JSON-LD structured data
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
      "name": "Terms of Service",
      "item": "https://airmilescalc.com/terms"
    }
  ]
};

export default function TermsPage() {
  return (
    <>
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
              <li><span className="text-slate-900">Terms of Service</span></li>
            </ol>
          </nav>

          {/* Page Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Terms of Service
          </h1>
          <p className="text-slate-500 mb-8">Last Updated: January 2026</p>

          <div className="space-y-8">
            {/* Acceptance of Terms */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Acceptance of Terms</h2>
              <p className="text-slate-700 mb-4">
                By accessing and using AirMilesCalc (&ldquo;the website,&rdquo; &ldquo;the service,&rdquo; or &ldquo;the calculator&rdquo;),
                you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the website.
              </p>
              <p className="text-slate-700">
                These terms apply to all visitors, users, and others who access or use AirMilesCalc.
              </p>
            </section>

            {/* Description of Service */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Description of Service</h2>
              <p className="text-slate-700 mb-4">
                AirMilesCalc provides free online calculator tools for estimating flight distances, flight times,
                and CO2 emissions between airports worldwide. The service includes:
              </p>
              <ul className="text-slate-700 space-y-2 ml-4 list-disc mb-4">
                <li>A flight distance calculator using geodesic calculations</li>
                <li>Flight time estimation based on average commercial aircraft speeds</li>
                <li>CO2 emissions calculations using published emission factors</li>
                <li>An interactive 3D globe visualization</li>
                <li>Airport and route information</li>
              </ul>
              <p className="text-slate-700">
                The service is accessible via web browser without registration or account creation. All features
                are provided free of charge.
              </p>
            </section>

            {/* Disclaimer of Warranties */}
            <section className="bg-amber-50 rounded-xl border border-amber-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Disclaimer of Warranties</h2>
              <p className="text-slate-700 mb-4">
                <strong>THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND.</strong>
              </p>
              <p className="text-slate-700 mb-4">
                All calculations provided by AirMilesCalc are <strong>estimates for informational purposes only</strong>.
                They are not intended to be, and should not be relied upon as:
              </p>
              <ul className="text-slate-700 space-y-1 ml-4 list-disc mb-4">
                <li>Professional aviation or navigation advice</li>
                <li>Official flight planning data</li>
                <li>Certified carbon emissions reporting</li>
                <li>Financial, legal, or medical advice</li>
                <li>Engineering specifications</li>
              </ul>
              <p className="text-slate-700">
                Results should be verified by qualified professionals for any important decisions. Actual flight
                distances, times, and emissions may vary significantly from our estimates due to factors including
                weather, aircraft type, routing, load factors, and airline operations.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Limitation of Liability</h2>
              <p className="text-slate-700 mb-4">
                To the maximum extent permitted by applicable law, AirMilesCalc and its operators shall not be
                liable for any indirect, incidental, special, consequential, or punitive damages, including but
                not limited to:
              </p>
              <ul className="text-slate-700 space-y-1 ml-4 list-disc mb-4">
                <li>Loss of profits, data, or other intangible losses</li>
                <li>Damages resulting from your use or inability to use the service</li>
                <li>Damages resulting from any decisions, actions, or outcomes based on calculator results</li>
                <li>Damages resulting from unauthorized access to your transmissions or data</li>
                <li>Any errors, mistakes, or inaccuracies in the content</li>
              </ul>
              <p className="text-slate-700">
                <strong>Use of this service is at your own risk.</strong> You are solely responsible for any
                decisions you make based on the information provided.
              </p>
            </section>

            {/* Accuracy */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Accuracy</h2>
              <p className="text-slate-700 mb-4">
                We strive for accuracy in our calculations by using established scientific formulas and methodologies:
              </p>
              <ul className="text-slate-700 space-y-2 ml-4 list-disc mb-4">
                <li><strong>Distance calculations</strong> use the Vincenty formula with WGS-84 ellipsoid parameters</li>
                <li><strong>Flight time estimates</strong> are based on average commercial jet cruise speeds</li>
                <li><strong>CO2 emissions</strong> use DEFRA 2024 emission factors</li>
                <li><strong>Airport data</strong> is sourced from the OpenFlights database</li>
              </ul>
              <p className="text-slate-700">
                However, we do not guarantee the accuracy, completeness, or timeliness of any information provided.
                Formulas and reference data are documented on our <Link href="/about" className="text-blue-600 hover:underline">About page</Link>.
              </p>
            </section>

            {/* Permitted Use */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Permitted Use</h2>
              <p className="text-slate-700 mb-4">
                <strong>You may:</strong>
              </p>
              <ul className="text-slate-700 space-y-1 ml-4 list-disc mb-4">
                <li>Use the calculator for personal, educational, and non-commercial purposes</li>
                <li>Link to AirMilesCalc or any of our pages from your website, blog, or social media</li>
                <li>Share results with others</li>
                <li>Reference our methodology with proper attribution</li>
              </ul>
              <p className="text-slate-700 mb-4">
                <strong>You may not:</strong>
              </p>
              <ul className="text-slate-700 space-y-1 ml-4 list-disc">
                <li>Scrape, crawl, or use automated systems to access the service in bulk</li>
                <li>Embed or iframe our calculator on other websites without explicit permission</li>
                <li>Copy substantial portions of our content, design, or code</li>
                <li>Use the service for any illegal or unauthorized purpose</li>
                <li>Attempt to interfere with the proper functioning of the website</li>
                <li>Transmit any malware, viruses, or harmful code</li>
                <li>Impersonate others or misrepresent your affiliation with any entity</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Intellectual Property</h2>
              <p className="text-slate-700 mb-4">
                The AirMilesCalc website, including its design, layout, graphics, text content, and code, is
                protected by intellectual property rights. The AirMilesCalc name and logo are our intellectual property.
              </p>
              <p className="text-slate-700 mb-4">
                However, the mathematical formulas used in our calculations (such as the Vincenty formula and
                Haversine formula) are in the public domain and freely available for anyone to use.
              </p>
              <p className="text-slate-700">
                Airport data is sourced from the OpenFlights database and is available under the Open Database License (ODbL).
              </p>
            </section>

            {/* External Links */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">External Links</h2>
              <p className="text-slate-700">
                Our website may contain links to external websites that are not operated by us. We have no control
                over the content, privacy policies, or practices of third-party sites. We are not responsible for
                the content or availability of any linked external websites. Inclusion of any link does not imply
                endorsement, approval, or control of the linked site.
              </p>
            </section>

            {/* Modifications */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Modifications</h2>
              <p className="text-slate-700 mb-4">
                We reserve the right to modify or discontinue the service (or any part of it) at any time, with
                or without notice. We may also update these Terms of Service from time to time.
              </p>
              <p className="text-slate-700">
                Any changes will be posted on this page with an updated &ldquo;Last Updated&rdquo; date. Your
                continued use of the service after changes are posted constitutes your acceptance of the modified terms.
              </p>
            </section>

            {/* Termination */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Termination</h2>
              <p className="text-slate-700">
                We may terminate or suspend your access to the service immediately, without prior notice or liability,
                for any reason, including if you breach these Terms of Service. Upon termination, your right to use
                the service will cease immediately.
              </p>
            </section>

            {/* Governing Law & Dispute Resolution */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Governing Law &amp; Dispute Resolution</h2>
              <p className="text-slate-700 mb-4">
                These Terms of Service shall be governed by and construed in accordance with applicable laws,
                without regard to conflict of law principles.
              </p>
              <p className="text-slate-700 mb-4">
                Any disputes arising from your use of AirMilesCalc shall first be attempted to be resolved
                through good-faith negotiation. If a dispute cannot be resolved informally within 30 days,
                it shall be submitted to binding arbitration or the competent courts of the jurisdiction
                where AirMilesCalc operates.
              </p>
              <p className="text-slate-700">
                You agree that any claim or cause of action arising out of your use of the service must be
                filed within one (1) year after such claim or cause of action arose, or be forever barred.
              </p>
            </section>

            {/* Data Attribution */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Data Sources &amp; Attribution</h2>
              <p className="text-slate-700 mb-4">
                AirMilesCalc uses data and methodologies from the following sources. We gratefully acknowledge
                the work of these organizations:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 pr-4 font-semibold text-slate-700">Source</th>
                      <th className="text-left py-3 pr-4 font-semibold text-slate-700">License</th>
                      <th className="text-left py-3 font-semibold text-slate-700">URL</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-600 divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">OpenFlights</td>
                      <td className="py-3 pr-4">Open Database License (ODbL)</td>
                      <td className="py-3"><a href="https://openflights.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">openflights.org</a></td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">DEFRA Emission Factors</td>
                      <td className="py-3 pr-4">UK Government Open Licence</td>
                      <td className="py-3"><a href="https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">gov.uk</a></td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">Vincenty Formula</td>
                      <td className="py-3 pr-4">Public Domain</td>
                      <td className="py-3"><a href="https://en.wikipedia.org/wiki/Vincenty%27s_formulae" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Wikipedia</a></td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">WGS-84 Ellipsoid</td>
                      <td className="py-3 pr-4">Public Standard</td>
                      <td className="py-3"><a href="https://en.wikipedia.org/wiki/World_Geodetic_System" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Wikipedia</a></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Understanding Aviation Data Limitations */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Understanding Aviation Data Limitations</h2>
              <p className="text-slate-700 mb-4">
                Flight data inherently carries limitations that users should understand when interpreting
                calculator results. These limitations are not unique to AirMilesCalc but apply to all
                aviation distance and emissions tools.
              </p>
              <ul className="text-slate-700 space-y-2 ml-4 list-disc mb-4">
                <li>
                  <strong>Airport coordinates</strong> represent runway centerpoints, not terminal
                  buildings&mdash;actual taxi distances add to total travel time
                </li>
                <li>
                  <strong>Great circle distances</strong> don&apos;t account for air traffic control (ATC)
                  routing, restricted airspace, or weather-related diversions
                </li>
                <li>
                  <strong>Flight times</strong> vary significantly depending on the{' '}
                  <a href="https://en.wikipedia.org/wiki/Jet_stream" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">jet stream</a>,
                  which can add or subtract an hour or more on long-haul routes
                </li>
                <li>
                  <strong>CO2 emission factors</strong> are fleet-wide averages published by{' '}
                  <a href="https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">DEFRA</a>,
                  not calculations for a specific aircraft type or configuration
                </li>
                <li>
                  <strong>Route data</strong> may not reflect seasonal services, recently added connections,
                  or routes that have been discontinued
                </li>
              </ul>
              <p className="text-slate-700 mb-4 font-medium">
                The table below illustrates the typical variance each factor introduces:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 pr-4 font-semibold text-slate-700">Factor</th>
                      <th className="text-left py-3 font-semibold text-slate-700">Impact on Accuracy</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-600 divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">Wind / Jet Stream</td>
                      <td className="py-3">+/- 1 hour on long-haul</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">ATC Routing</td>
                      <td className="py-3">+5&ndash;15% distance vs great circle</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">Aircraft Type</td>
                      <td className="py-3">+/- 30 min flight time</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">Load Factor</td>
                      <td className="py-3">+/- 20% on CO2 per passenger</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Open Source & Data Licensing */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Open Source &amp; Data Licensing</h2>
              <p className="text-slate-700 mb-4">
                AirMilesCalc relies on publicly available data sets and well-established scientific formulas.
                Below is a summary of the licenses that govern each data source:
              </p>
              <ul className="text-slate-700 space-y-2 ml-4 list-disc">
                <li>
                  <strong>OpenFlights airport data</strong> &mdash; Licensed under the{' '}
                  <a href="https://opendatacommons.org/licenses/odbl/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Open Database License (ODbL)</a>.
                  You are free to share and adapt the data as long as you attribute the source and keep
                  derivative databases open.
                </li>
                <li>
                  <strong>Vincenty formula</strong> &mdash; Published by Thaddeus Vincenty in 1975 and
                  considered public domain. No licensing restrictions apply to implementations of this
                  geodesic calculation method.
                </li>
                <li>
                  <strong>WGS-84 ellipsoid</strong> &mdash; A public standard maintained by the{' '}
                  <a href="https://earth-info.nga.mil/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">National Geospatial-Intelligence Agency (NGA)</a>.
                  It defines the reference coordinate system used by GPS and most mapping applications worldwide.
                </li>
                <li>
                  <strong>DEFRA emission factors</strong> &mdash; Published by the UK Department for
                  Environment, Food &amp; Rural Affairs under the{' '}
                  <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">UK Government Open Licence v3.0</a>.
                  This licence permits free copying, publishing, and adaptation of the data.
                </li>
              </ul>
            </section>

            {/* Regulatory Compliance */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Regulatory Compliance</h2>
              <p className="text-slate-700 mb-4">
                AirMilesCalc is an informational tool and is not subject to aviation certification
                requirements. However, we are mindful of the following regulatory areas:
              </p>
              <ul className="text-slate-700 space-y-2 ml-4 list-disc">
                <li>
                  <strong>Web Accessibility</strong> &mdash; We are committed to meeting the{' '}
                  <a href="https://www.w3.org/WAI/standards-guidelines/wcag/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Web Content Accessibility Guidelines (WCAG)</a>{' '}
                  to ensure our calculator is usable by as many people as possible, including those who
                  rely on assistive technologies.
                </li>
                <li>
                  <strong>Aviation Data</strong> &mdash; AirMilesCalc is <em>not</em> a certified data
                  source under FAA or EASA regulations. Our results must not be used for operational flight
                  planning, air traffic management, or any purpose that requires certified aviation data.
                </li>
                <li>
                  <strong>Environmental Claims</strong> &mdash; All CO2 emission estimates are derived from
                  published government data (DEFRA 2024 conversion factors) and have not been independently
                  audited. They should not be cited as verified carbon accounting figures.
                </li>
              </ul>
            </section>

            {/* Severability */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Severability</h2>
              <p className="text-slate-700">
                If any provision of these Terms of Service is found to be unenforceable or invalid, that provision
                shall be limited or eliminated to the minimum extent necessary so that these terms shall otherwise
                remain in full force and effect.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-slate-100 rounded-xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Contact</h2>
              <p className="text-slate-700 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <a
                href="mailto:info@airmilescalc.com"
                className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@airmilescalc.com
              </a>
            </section>
          </div>

          {/* Interlinking */}
          <div className="mt-8 grid md:grid-cols-4 gap-4">
            <Link href="/privacy" className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow text-center">
              <div className="font-semibold text-slate-900 text-sm">Privacy Policy</div>
              <div className="text-xs text-slate-500 mt-1">How we protect your data</div>
            </Link>
            <Link href="/about" className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow text-center">
              <div className="font-semibold text-slate-900 text-sm">About</div>
              <div className="text-xs text-slate-500 mt-1">Our methodology &amp; data sources</div>
            </Link>
            <Link href="/contact" className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow text-center">
              <div className="font-semibold text-slate-900 text-sm">Contact Us</div>
              <div className="text-xs text-slate-500 mt-1">Questions about terms</div>
            </Link>
            <Link href="/airports" className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow text-center">
              <div className="font-semibold text-slate-900 text-sm">Airport Directory</div>
              <div className="text-xs text-slate-500 mt-1">Browse 3,000+ airports</div>
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
