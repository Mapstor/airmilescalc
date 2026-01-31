import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - AirMilesCalc',
  description: 'Privacy policy for AirMilesCalc. We respect your privacy and don\'t collect personal data or require accounts.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy Policy - AirMilesCalc',
    description: 'We respect your privacy. No personal data collected, no accounts required.',
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
      "name": "Privacy Policy",
      "item": "https://airmilescalc.com/privacy"
    }
  ]
};

export default function PrivacyPage() {
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
              <li><span className="text-slate-900">Privacy Policy</span></li>
            </ol>
          </nav>

          {/* Page Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-slate-500 mb-8">Last Updated: January 2026</p>

          <div className="space-y-8">
            {/* Summary */}
            <section className="bg-blue-50 rounded-xl border border-blue-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Summary (Plain English)</h2>
              <p className="text-slate-700 mb-4">
                <strong>We respect your privacy.</strong> Here&apos;s what you need to know:
              </p>
              <ul className="text-slate-700 space-y-2">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Airport searches and distance calculations are processed server-side using only airport codes &mdash; no personal data is sent or stored</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>We don&apos;t collect personal data or require you to create an account</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Your flight searches and calculation results are not stored or tracked</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>We only receive data if you voluntarily email us</span>
                </li>
              </ul>
            </section>

            {/* Information We Don't Collect */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Information We Don&apos;t Collect</h2>
              <p className="text-slate-700 mb-4">
                AirMilesCalc is designed with privacy in mind. We do <strong>not</strong> collect:
              </p>
              <ul className="text-slate-700 space-y-2 ml-4 list-disc">
                <li><strong>Account information:</strong> No registration is required. We don&apos;t have usernames, passwords, or user profiles.</li>
                <li><strong>Personal data:</strong> We don&apos;t collect your name, address, phone number, or any other personal identifiers through the calculator.</li>
                <li><strong>Calculation history:</strong> Airport searches and distance calculations are processed server-side using only airport codes. No personal data is transmitted, and no calculation history is stored.</li>
                <li><strong>Location data:</strong> We don&apos;t access your GPS location or track where you are.</li>
                <li><strong>Financial information:</strong> We don&apos;t process payments or collect any financial data.</li>
                <li><strong>Health information:</strong> We don&apos;t collect any health-related data.</li>
              </ul>
            </section>

            {/* Information That May Be Collected */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Information That May Be Collected</h2>
              <p className="text-slate-700 mb-4">
                While we minimize data collection, the following may be collected through standard web technologies:
              </p>

              <h3 className="font-semibold text-slate-900 mt-6 mb-2">Analytics</h3>
              <p className="text-slate-700 mb-4">
                We may use basic analytics to understand how our site is used. This collects anonymous, aggregated data such as:
              </p>
              <ul className="text-slate-700 space-y-1 ml-4 list-disc mb-4">
                <li>Page views (which pages are visited)</li>
                <li>General geographic region (country-level, not precise location)</li>
                <li>Device type (desktop, mobile, tablet)</li>
                <li>Browser type and version</li>
                <li>Referring website (how you found us)</li>
              </ul>
              <p className="text-slate-700">
                This data is aggregated and cannot be used to identify individual users.
              </p>

              <h3 className="font-semibold text-slate-900 mt-6 mb-2">Cookies</h3>
              <p className="text-slate-700">
                We use only essential cookies necessary for the website to function properly. We do not use advertising
                cookies or tracking cookies for marketing purposes. Any cookies set are for technical functionality
                such as maintaining site preferences.
              </p>
            </section>

            {/* Contact Data */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Contact Data</h2>
              <p className="text-slate-700 mb-4">
                If you choose to contact us via email, we receive:
              </p>
              <ul className="text-slate-700 space-y-1 ml-4 list-disc mb-4">
                <li>Your email address</li>
                <li>Your name (if included)</li>
                <li>Your message content</li>
              </ul>
              <p className="text-slate-700 mb-4">
                This information is:
              </p>
              <ul className="text-slate-700 space-y-1 ml-4 list-disc">
                <li>Used solely to respond to your inquiry</li>
                <li>Not shared with any third parties</li>
                <li>Not used for marketing purposes</li>
                <li>Retained only as long as necessary to address your inquiry</li>
              </ul>
            </section>

            {/* Third-Party Services */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Third-Party Services</h2>
              <p className="text-slate-700 mb-4">
                AirMilesCalc uses the following third-party services:
              </p>

              <div className="space-y-4">
                <div className="border-l-4 border-slate-300 pl-4">
                  <h3 className="font-semibold text-slate-900">Vercel</h3>
                  <p className="text-slate-600 text-sm">
                    Our website is hosted on Vercel. Vercel may collect standard server logs including IP addresses
                    for security and performance purposes. See <a href="https://vercel.com/legal/privacy-policy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Vercel&apos;s Privacy Policy</a>.
                  </p>
                </div>

                <div className="border-l-4 border-slate-300 pl-4">
                  <h3 className="font-semibold text-slate-900">OpenFlights Database</h3>
                  <p className="text-slate-600 text-sm">
                    Airport data is sourced from the OpenFlights open-source database. This is static data and
                    does not involve any user data collection.
                  </p>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Your Rights</h2>
              <p className="text-slate-700 mb-4">
                You have the right to:
              </p>
              <ul className="text-slate-700 space-y-2 ml-4 list-disc">
                <li><strong>Access:</strong> Request information about any personal data we hold about you</li>
                <li><strong>Deletion:</strong> Request deletion of any personal data we hold about you</li>
                <li><strong>Correction:</strong> Request correction of any inaccurate information</li>
                <li><strong>Objection:</strong> Object to any processing of your data</li>
              </ul>
              <p className="text-slate-700 mt-4">
                To exercise any of these rights, please contact us at{' '}
                <a href="mailto:info@airmilescalc.com" className="text-blue-600 hover:underline">info@airmilescalc.com</a>.
              </p>
            </section>

            {/* Data Comparison Table */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">How We Compare</h2>
              <p className="text-slate-700 mb-4">
                See how AirMilesCalc&apos;s privacy practices compare to typical websites:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 pr-4 font-semibold text-slate-700">Practice</th>
                      <th className="text-center py-3 pr-4 font-semibold text-green-700">AirMilesCalc</th>
                      <th className="text-center py-3 font-semibold text-slate-700">Typical Site</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-600 divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 pr-4">Personal data collected</td>
                      <td className="py-3 pr-4 text-center text-green-600 font-medium">None</td>
                      <td className="py-3 text-center text-red-600">Name, email, location</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">Account required</td>
                      <td className="py-3 pr-4 text-center text-green-600 font-medium">No</td>
                      <td className="py-3 text-center text-red-600">Often yes</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">User tracking</td>
                      <td className="py-3 pr-4 text-center text-green-600 font-medium">Minimal analytics</td>
                      <td className="py-3 text-center text-red-600">Extensive tracking</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">Advertising</td>
                      <td className="py-3 pr-4 text-center text-green-600 font-medium">None</td>
                      <td className="py-3 text-center text-red-600">Targeted ads</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">Data sold to third parties</td>
                      <td className="py-3 pr-4 text-center text-green-600 font-medium">Never</td>
                      <td className="py-3 text-center text-red-600">Common practice</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* GDPR & International Privacy */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">GDPR &amp; International Privacy</h2>
              <p className="text-slate-700 mb-4">
                AirMilesCalc respects international privacy regulations. Because we collect minimal data, compliance is straightforward:
              </p>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-400 pl-4">
                  <h3 className="font-semibold text-slate-900">European Union (GDPR)</h3>
                  <p className="text-slate-600 text-sm mt-1">
                    Under the General Data Protection Regulation, you have the right to access, rectify, erase, restrict processing,
                    and port your personal data. Since we collect minimal data, these rights are easily exercised.
                    For any GDPR-related requests, email us at{' '}
                    <a href="mailto:info@airmilescalc.com" className="text-blue-600 hover:underline">info@airmilescalc.com</a>.
                    Learn more at <a href="https://gdpr.eu/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">gdpr.eu</a>.
                  </p>
                </div>
                <div className="border-l-4 border-blue-400 pl-4">
                  <h3 className="font-semibold text-slate-900">California (CCPA)</h3>
                  <p className="text-slate-600 text-sm mt-1">
                    Under the California Consumer Privacy Act, California residents have the right to know what personal
                    information is collected, request deletion, and opt out of data sales. We do not sell personal information.
                    See the <a href="https://oag.ca.gov/privacy/ccpa" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">California AG CCPA page</a> for more.
                  </p>
                </div>
              </div>
            </section>

            {/* International Privacy Frameworks */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">International Privacy Frameworks</h2>
              <p className="text-slate-700 mb-4">
                Privacy is a global concern. Here is a summary of major privacy regulations worldwide and how they protect your data:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 pr-4 font-semibold text-slate-700">Regulation</th>
                      <th className="text-left py-3 pr-4 font-semibold text-slate-700">Region</th>
                      <th className="text-left py-3 pr-4 font-semibold text-slate-700">Key Right</th>
                      <th className="text-left py-3 font-semibold text-slate-700">Link</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-600 divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">GDPR</td>
                      <td className="py-3 pr-4">European Union</td>
                      <td className="py-3 pr-4">Right to erasure, data portability &amp; consent</td>
                      <td className="py-3"><a href="https://gdpr.eu/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">gdpr.eu</a></td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">CCPA/CPRA</td>
                      <td className="py-3 pr-4">California, US</td>
                      <td className="py-3 pr-4">Right to know, delete &amp; opt out of data sales</td>
                      <td className="py-3"><a href="https://oag.ca.gov/privacy/ccpa" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">oag.ca.gov</a></td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">LGPD</td>
                      <td className="py-3 pr-4">Brazil</td>
                      <td className="py-3 pr-4">Right to confirmation, access &amp; anonymization</td>
                      <td className="py-3"><a href="https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">gov.br</a></td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">PIPA</td>
                      <td className="py-3 pr-4">South Korea</td>
                      <td className="py-3 pr-4">Right to consent &amp; request destruction of data</td>
                      <td className="py-3"><span className="text-slate-400">-</span></td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">PIPEDA</td>
                      <td className="py-3 pr-4">Canada</td>
                      <td className="py-3 pr-4">Right to access &amp; challenge compliance</td>
                      <td className="py-3"><a href="https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">priv.gc.ca</a></td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-900">UK GDPR</td>
                      <td className="py-3 pr-4">United Kingdom</td>
                      <td className="py-3 pr-4">Right to erasure, rectification &amp; data portability</td>
                      <td className="py-3"><a href="https://ico.org.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ico.org.uk</a></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* How Your Data Flows */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">How Your Data Flows</h2>
              <p className="text-slate-700 mb-6">
                Here&apos;s exactly what happens when you use the AirMilesCalc calculator, step by step:
              </p>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">You Type an Airport Name</h3>
                    <p className="text-slate-600">
                      You type an airport name or code into the search field. No data is sent until
                      you have typed at least two characters.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Search Query Sent to Our Server</h3>
                    <p className="text-slate-600">
                      A lightweight search query is sent to our server to return matching airports. No personal
                      information is attached to this request beyond the search term itself.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">You Click Calculate</h3>
                    <p className="text-slate-600">
                      The distance between the two selected airports is computed server-side using the Vincenty
                      formula. Only the airport codes are sent &mdash; no personal data is included.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Results Displayed</h3>
                    <p className="text-slate-600">
                      The calculated distance is displayed in your browser. Nothing is stored on our servers after
                      the page loads &mdash; there is no calculation history and no data retention.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Privacy Resources */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Privacy Resources</h2>
              <p className="text-slate-700 mb-4">
                Learn more about your digital privacy rights from these trusted regulators and organizations:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101" />
                  </svg>
                  <div>
                    <a href="https://ico.org.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">UK Information Commissioner&apos;s Office (ICO)</a>
                    <p className="text-slate-600 text-sm mt-0.5">The UK&apos;s independent authority for data protection and information rights.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101" />
                  </svg>
                  <div>
                    <a href="https://edpb.europa.eu/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">European Data Protection Board (EDPB)</a>
                    <p className="text-slate-600 text-sm mt-0.5">The EU body that ensures consistent application of the GDPR across member states.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101" />
                  </svg>
                  <div>
                    <a href="https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">FTC COPPA Guidance</a>
                    <p className="text-slate-600 text-sm mt-0.5">US Federal Trade Commission&apos;s rules on children&apos;s online privacy protection.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101" />
                  </svg>
                  <div>
                    <a href="https://www.eff.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Electronic Frontier Foundation (EFF)</a>
                    <p className="text-slate-600 text-sm mt-0.5">A leading nonprofit defending digital privacy, free speech, and innovation.</p>
                  </div>
                </li>
              </ul>
            </section>

            {/* Cookie Table */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Cookie Details</h2>
              <p className="text-slate-700 mb-4">
                We use only essential cookies. Here is a complete list:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 pr-4 font-semibold text-slate-700">Cookie</th>
                      <th className="text-left py-3 pr-4 font-semibold text-slate-700">Purpose</th>
                      <th className="text-left py-3 pr-4 font-semibold text-slate-700">Duration</th>
                      <th className="text-left py-3 font-semibold text-slate-700">Type</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-600 divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 pr-4 font-mono text-xs">__vercel_live_token</td>
                      <td className="py-3 pr-4">Hosting platform session</td>
                      <td className="py-3 pr-4">Session</td>
                      <td className="py-3"><span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded font-medium">Essential</span></td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-mono text-xs">_vercel_jwt</td>
                      <td className="py-3 pr-4">Deployment authentication</td>
                      <td className="py-3 pr-4">Session</td>
                      <td className="py-3"><span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded font-medium">Essential</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-slate-500 text-xs mt-3">
                We do not use marketing, analytics, or preference cookies. See{' '}
                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Vercel&apos;s privacy policy</a> for details on hosting cookies.
              </p>
            </section>

            {/* Children's Privacy */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Children&apos;s Privacy</h2>
              <p className="text-slate-700">
                AirMilesCalc is not directed at children under the age of 13. We do not knowingly collect personal
                information from children under 13. If you are a parent or guardian and believe your child has
                provided us with personal information, please contact us and we will
                delete that information.
              </p>
            </section>

            {/* Changes to This Policy */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Changes to This Policy</h2>
              <p className="text-slate-700">
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with
                an updated &ldquo;Last Updated&rdquo; date. We encourage you to review this page periodically for
                the latest information on our privacy practices. Continued use of AirMilesCalc after changes
                constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Contact Us */}
            <section className="bg-slate-100 rounded-xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Contact Us</h2>
              <p className="text-slate-700 mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
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
            <Link href="/terms" className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow text-center">
              <div className="font-semibold text-slate-900 text-sm">Terms of Service</div>
              <div className="text-xs text-slate-500 mt-1">Usage terms &amp; conditions</div>
            </Link>
            <Link href="/contact" className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow text-center">
              <div className="font-semibold text-slate-900 text-sm">Contact Us</div>
              <div className="text-xs text-slate-500 mt-1">Privacy questions</div>
            </Link>
            <Link href="/about" className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow text-center">
              <div className="font-semibold text-slate-900 text-sm">About</div>
              <div className="text-xs text-slate-500 mt-1">Our methodology</div>
            </Link>
            <Link href="/" className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow text-center">
              <div className="font-semibold text-slate-900 text-sm">Calculator</div>
              <div className="text-xs text-slate-500 mt-1">Calculate distances</div>
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
