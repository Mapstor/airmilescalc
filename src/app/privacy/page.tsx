import { Metadata } from 'next';
import Link from 'next/link';
import { InternalLinks, KeyStats, Sources, FAQ } from '@/components/content/blocks';
import { ogImageMeta, twitterMeta } from '@/lib/og';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: "Privacy policy for AirMilesCalc: no first-party tracking, full Google AdSense disclosure, GDPR / CCPA / LGPD / UK GDPR rights, cookie inventory.",
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy Policy — AirMilesCalc',
    description: 'No first-party tracking. Full AdSense disclosure. GDPR / CCPA / LGPD / UK GDPR rights, cookie inventory.',
    url: '/privacy',
    type: 'article',
    images: ogImageMeta({ title: 'Privacy Policy', subtitle: 'No first-party tracking. Full AdSense disclosure. GDPR / CCPA / LGPD compliance.', category: 'Policy' }),
  },
  twitter: twitterMeta({ title: 'Privacy Policy', subtitle: 'No first-party tracking. Full AdSense disclosure. GDPR / CCPA / LGPD compliance.', category: 'Policy' }),
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

      <div className="min-h-screen bg-[#FAFAF9] py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="text-sm mb-6">
            <ol className="flex items-center gap-2 text-slate-600">
              <li><Link href="/" className="hover:text-[#0B2447]">Home</Link></li>
              <li>/</li>
              <li><span className="text-[#0B2447]">Privacy Policy</span></li>
            </ol>
          </nav>

          {/* Page Title */}
          <h1 className="text-[24px] md:text-[28px] font-semibold text-[#0B2447] tracking-tight mb-2">
            Privacy Policy
          </h1>
          <p className="text-slate-500 mb-6">
            Last Updated: May 2026{' '}
            <span className="text-[12px] text-slate-400">
              (this version pre-dates the AdSense launch — see the status notice below)
            </span>
          </p>

          {/* At-a-glance summary tiles — scannable before the prose summary */}
          <KeyStats
            stats={[
              {
                value: "0",
                label: "Personal-data fields AirMilesCalc itself requires or collects from users (no signup)",
                source: "By design",
              },
              {
                value: "AdSense planned",
                label: "Hosting will be funded by Google AdSense once approved — see implementation status notice below",
                source: "Disclosed",
              },
              {
                value: "8",
                label: "Worldwide privacy regulations we map our practices against (GDPR, UK GDPR, CCPA, LGPD, PIPEDA, PIPA, COPPA, FTC)",
                source: "See regulator links below",
              },
              {
                value: "1 mo / 45 d",
                label: "Statutory response deadlines we meet for GDPR / CCPA data-subject requests",
                source: "GDPR Art. 12(3); CCPA §1798.130",
              },
            ]}
          />

          {/* Collapsible primary-source citations — auditors and reviewers expect these */}
          <Sources
            items={[
              {
                id: 1,
                label: "GDPR — Regulation (EU) 2016/679",
                note: "European Union General Data Protection Regulation; defines data-subject rights, lawful bases, and statutory deadlines",
                venue: "EUR-Lex",
                date: "Effective 25 May 2018",
                url: "https://eur-lex.europa.eu/eli/reg/2016/679/oj",
              },
              {
                id: 2,
                label: "UK GDPR + Data Protection Act 2018",
                note: "Post-Brexit UK adoption of the GDPR framework",
                venue: "UK Public General Acts; ICO guidance",
                date: "Effective 25 May 2018 (DPA); UK GDPR variant 1 Jan 2021",
                url: "https://www.legislation.gov.uk/ukpga/2018/12/contents",
              },
              {
                id: 3,
                label: "CCPA + CPRA — Cal. Civ. Code §1798.100 et seq.",
                note: "California Consumer Privacy Act as amended by the California Privacy Rights Act",
                venue: "California Office of the Attorney General",
                date: "CCPA effective 1 Jan 2020; CPRA amendments effective 1 Jan 2023",
                url: "https://oag.ca.gov/privacy/ccpa",
              },
              {
                id: 4,
                label: "LGPD — Lei Geral de Proteção de Dados",
                note: "Brazil's general data-protection law",
                venue: "Government of Brazil",
                date: "Effective 18 September 2020",
                url: "https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd",
              },
              {
                id: 5,
                label: "PIPEDA — Personal Information Protection and Electronic Documents Act",
                note: "Canadian federal private-sector privacy law",
                venue: "Office of the Privacy Commissioner of Canada",
                date: "Effective 1 January 2004",
                url: "https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/",
              },
              {
                id: 6,
                label: "Google AdSense Privacy & Terms",
                note: "Authoritative description of Google AdSense data practices and the cookies set when ads are served",
                venue: "Google",
                date: "Continuously updated",
                url: "https://policies.google.com/privacy",
              },
              {
                id: 7,
                label: "IAB Transparency & Consent Framework v2.2",
                note: "Industry-standard consent string format that the Funding Choices CMP issues; defines lawful-basis purposes 1–11",
                venue: "Interactive Advertising Bureau Europe",
                date: "TCF v2.2 effective 2023",
                url: "https://iabeurope.eu/transparency-consent-framework/",
              },
              {
                id: 8,
                label: "Global Privacy Control specification",
                note: "Browser-issued opt-out signal we honour as a CCPA-recognised opt-out request",
                venue: "Global Privacy Control Working Group",
                date: "Specification published 2020",
                url: "https://globalprivacycontrol.org/",
              },
            ]}
          />

          {/* Implementation status — keeps policy text in sync with site behaviour pre-AdSense */}
          <aside className="mb-8 border-l-4 border-l-amber-500 bg-amber-50 rounded-r-md p-4">
            <div className="text-[10.5px] uppercase tracking-wider font-semibold text-amber-700 mb-1.5 font-mono">
              Current implementation status
            </div>
            <p className="text-[14px] text-amber-950 leading-relaxed">
              This policy describes the Google AdSense advertising and Google
              Funding Choices consent management platform that AirMilesCalc
              intends to use to fund hosting. As of the &ldquo;Last Updated&rdquo;
              date above, those have <strong>not yet been enabled</strong> in
              production &mdash; there are currently <strong>no third-party
              ad scripts loaded</strong>, <strong>no advertising cookies
              set</strong>, and <strong>no consent banner</strong> shown.
              The behaviours described below in the Advertising, Cookie
              Details, and Your Choices sections will become active once
              AdSense is enabled, and this notice will be removed at that
              point. The first-party policies (no account collection, no
              calculation-history retention) are in effect today.
            </p>
          </aside>

          <div className="space-y-8">
            {/* Summary */}
            <section className="bg-[#EEF2F7] rounded-md border border-slate-200 p-6 md:p-8">
              <h2 className="text-[16px] font-semibold text-[#0B2447] tracking-tight mb-4">Summary (Plain English)</h2>
              <p className="text-slate-700 mb-4">
                <strong>We respect your privacy and disclose every data flow.</strong> The short version:
              </p>
              <ul className="text-slate-700 space-y-2">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>We</strong> don&apos;t require an account, don&apos;t collect personal data ourselves, and don&apos;t store your flight searches or calculation history.</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Calculations are processed server-side using only airport codes &mdash; no personal data is attached to the request.</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>Third-party advertising:</strong> we may display Google AdSense ads to keep the site free. Google and its ad partners use cookies and similar technologies to serve those ads; details and opt-out links are below.</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>We only receive personally identifying data if you voluntarily email us &mdash; and we only use it to reply.</span>
                </li>
              </ul>
            </section>

            {/* Information We Don't Collect */}
            <section className="bg-white rounded-md border border-slate-200 p-6 md:p-8">
              <h2 className="text-[16px] font-semibold text-[#0B2447] tracking-tight mb-4">Information We Don&apos;t Collect</h2>
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
            <section className="bg-white rounded-md border border-slate-200 p-6 md:p-8">
              <h2 className="text-[16px] font-semibold text-[#0B2447] tracking-tight mb-4">Information That May Be Collected</h2>
              <p className="text-slate-700 mb-4">
                While we minimize data collection, the following may be collected through standard web technologies:
              </p>

              <h3 className="font-semibold text-[#0B2447] mt-6 mb-2">Analytics</h3>
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

              <h3 className="font-semibold text-[#0B2447] mt-6 mb-2">Cookies</h3>
              <p className="text-slate-700 mb-3">
                AirMilesCalc itself sets only essential cookies needed for the website to function (hosting-platform
                session and routing). However, when ads are displayed (see &ldquo;Advertising&rdquo; below), our advertising
                partner Google &mdash; and any third-party vendors Google works with &mdash; will set their own cookies and
                similar storage on your device to serve ads, measure their effectiveness, and prevent fraud.
              </p>
              <p className="text-slate-700">
                A list of the cookies AirMilesCalc itself sets is in the &ldquo;Cookie Details&rdquo; section below.
                Google-set advertising cookies are documented at{' '}
                <a
                  href="https://policies.google.com/technologies/cookies"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0B2447] hover:underline underline-offset-2 font-medium"
                >
                  policies.google.com/technologies/cookies
                </a>
                .
              </p>

              <h3 className="font-semibold text-[#0B2447] mt-6 mb-2">Advertising (Google AdSense)</h3>
              <p className="text-slate-700 mb-3">
                AirMilesCalc may display advertising provided by{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0B2447] hover:underline underline-offset-2 font-medium"
                >
                  Google AdSense
                </a>
                . As an AdSense publisher, we&apos;re required to disclose the following:
              </p>
              <ul className="text-slate-700 space-y-2 ml-4 list-disc mb-4">
                <li>
                  <strong>Third-party vendors, including Google,</strong> use cookies to serve ads based on your prior
                  visits to AirMilesCalc and other websites.
                </li>
                <li>
                  Google&apos;s use of advertising cookies enables it and its partners to serve ads to you based on your
                  visit to AirMilesCalc and/or other sites on the internet. The advertising cookies Google may
                  set include{' '}
                  <strong>NID, IDE, AID, ANID, and DSID</strong>, plus the
                  first-party ad-delivery cookies{' '}
                  <strong>__gads and __gpi</strong>, on{' '}
                  <code className="text-[12px] bg-slate-100 border border-slate-200 px-1 py-0.5 rounded">.google.com</code>,{' '}
                  <code className="text-[12px] bg-slate-100 border border-slate-200 px-1 py-0.5 rounded">.doubleclick.net</code>, and partner ad-serving domains.
                </li>
                <li>
                  Third-party vendors that may use cookies on this site include Google&apos;s ad partners; the complete list
                  is published at{' '}
                  <a
                    href="https://support.google.com/admanager/answer/9012903"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0B2447] hover:underline underline-offset-2 font-medium"
                  >
                    Google&apos;s certified ad-tech provider list
                  </a>
                  .
                </li>
                <li>
                  Where required by law (e.g.&nbsp;the EU, UK, Switzerland), we use a Google-certified Consent
                  Management Platform to obtain your consent <em>before</em> any non-essential cookies are set or any
                  personalized advertising is served. You can change or withdraw your consent at any time via the cookie
                  banner.
                </li>
                <li>
                  <strong>How to opt out:</strong> you may opt out of personalized advertising by Google at{' '}
                  <a
                    href="https://www.google.com/settings/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0B2447] hover:underline underline-offset-2 font-medium"
                  >
                    google.com/settings/ads
                  </a>
                  , or opt out of third-party vendor cookies more broadly at the Network Advertising Initiative
                  (
                  <a
                    href="https://optout.networkadvertising.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0B2447] hover:underline underline-offset-2 font-medium"
                  >
                    optout.networkadvertising.org
                  </a>
                  ) and the Digital Advertising Alliance (
                  <a
                    href="https://optout.aboutads.info/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0B2447] hover:underline underline-offset-2 font-medium"
                  >
                    optout.aboutads.info
                  </a>
                  ).
                </li>
              </ul>
              <p className="text-slate-700">
                AirMilesCalc itself does not have access to the personal data Google uses to personalize advertising,
                does not combine ad-related data with any of our own records, and does not sell any data to third parties.
                For Google&apos;s full disclosures, see the{' '}
                <a
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0B2447] hover:underline underline-offset-2 font-medium"
                >
                  Google ads technologies policy
                </a>
                .
              </p>
            </section>

            {/* Contact Data */}
            <section className="bg-white rounded-md border border-slate-200 p-6 md:p-8">
              <h2 className="text-[16px] font-semibold text-[#0B2447] tracking-tight mb-4">Contact Data</h2>
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
            <section className="bg-white rounded-md border border-slate-200 p-6 md:p-8">
              <h2 className="text-[16px] font-semibold text-[#0B2447] tracking-tight mb-4">Third-Party Services</h2>
              <p className="text-slate-700 mb-4">
                AirMilesCalc uses the following third-party services:
              </p>

              <div className="space-y-4">
                <div className="border-l-4 border-slate-300 pl-4">
                  <h3 className="font-semibold text-[#0B2447]">Vercel (hosting)</h3>
                  <p className="text-slate-600 text-sm">
                    Our website is hosted on Vercel. Vercel may collect standard server logs including IP addresses
                    for security and performance purposes. See <a href="https://vercel.com/legal/privacy-policy" className="text-[#0B2447] hover:underline underline-offset-2 font-medium" target="_blank" rel="noopener noreferrer">Vercel&apos;s Privacy Policy</a>.
                  </p>
                </div>

                <div className="border-l-4 border-blue-400 pl-4">
                  <h3 className="font-semibold text-[#0B2447]">Google AdSense (advertising)</h3>
                  <p className="text-slate-600 text-sm">
                    AirMilesCalc may display ads served by Google AdSense to keep the site free. Google and its ad
                    partners may use cookies, web beacons, and device identifiers to serve, measure, and report on
                    advertising; full disclosure is in the &ldquo;Advertising (Google AdSense)&rdquo; section above.
                    See{' '}
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0B2447] hover:underline underline-offset-2 font-medium"
                    >
                      Google&apos;s Privacy Policy
                    </a>{' '}
                    and{' '}
                    <a
                      href="https://policies.google.com/technologies/ads"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0B2447] hover:underline underline-offset-2 font-medium"
                    >
                      Google&apos;s ads technologies policy
                    </a>
                    .
                  </p>
                </div>

                <div className="border-l-4 border-blue-400 pl-4">
                  <h3 className="font-semibold text-[#0B2447]">Google Funding Choices (consent management)</h3>
                  <p className="text-slate-600 text-sm">
                    For visitors in regions where consent is legally required (EU, UK, Switzerland, and similar
                    jurisdictions), AirMilesCalc uses Google&apos;s{' '}
                    <a
                      href="https://support.google.com/fundingchoices/answer/9180084"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0B2447] hover:underline underline-offset-2 font-medium"
                    >
                      Funding Choices
                    </a>{' '}
                    Consent Management Platform (a Google-certified CMP that complies with the IAB Transparency &amp;
                    Consent Framework v2) to ask for your consent before any non-essential cookies are set. You can
                    change or withdraw your consent at any time using the on-page cookie banner.
                  </p>
                </div>

                <div className="border-l-4 border-slate-300 pl-4">
                  <h3 className="font-semibold text-[#0B2447]">OpenStreetMap &amp; CARTO (map tiles)</h3>
                  <p className="text-slate-600 text-sm">
                    Maps on country and airport pages load tile imagery directly from CARTO&apos;s CDN
                    (which sources OpenStreetMap data). Your browser&apos;s IP address is visible to those CDNs
                    in the course of loading map tiles. See the{' '}
                    <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="text-[#0B2447] hover:underline underline-offset-2 font-medium">OpenStreetMap</a>{' '}
                    and{' '}
                    <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer" className="text-[#0B2447] hover:underline underline-offset-2 font-medium">CARTO</a>{' '}
                    privacy notices.
                  </p>
                </div>

                <div className="border-l-4 border-slate-300 pl-4">
                  <h3 className="font-semibold text-[#0B2447]">OpenFlights Database (static reference data)</h3>
                  <p className="text-slate-600 text-sm">
                    Airport, airline, and route data come from the OpenFlights open-source dataset (ODbL licensed).
                    This is static reference data &mdash; nothing about you is sent to OpenFlights.
                  </p>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section className="bg-white rounded-md border border-slate-200 p-6 md:p-8">
              <h2 className="text-[16px] font-semibold text-[#0B2447] tracking-tight mb-4">Your Rights</h2>
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
                <a href="mailto:info@airmilescalc.com" className="text-[#0B2447] hover:underline underline-offset-2 font-medium">info@airmilescalc.com</a>.
                {' '}For accessibility-related issues &mdash; missing alt text, keyboard traps,
                screen-reader announcement mismatches, low colour contrast &mdash; see the dedicated{' '}
                <Link href="/accessibility" className="text-[#0B2447] hover:underline underline-offset-2 font-medium">
                  accessibility statement
                </Link>{' '}
                for the WCAG 2.1 AA scope, the reporting channel, and the known-limitations
                disclosure.
              </p>
            </section>

            {/* Your Choices & Ad Personalization */}
            <section className="bg-white rounded-md border border-slate-200 p-6 md:p-8">
              <h2 className="text-[16px] font-semibold text-[#0B2447] tracking-tight mb-4">Your Choices &amp; Ad Personalization</h2>
              <p className="text-slate-700 mb-4">
                You have meaningful control over advertising on AirMilesCalc and across the web. Use any of the
                following:
              </p>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-400 pl-4">
                  <h3 className="font-semibold text-[#0B2447]">Consent banner (EU, UK, Switzerland and similar)</h3>
                  <p className="text-slate-600 text-sm mt-1">
                    If you&apos;re visiting from a region that requires consent, you&apos;ll see a banner the first time
                    you load the site. You can <strong>accept all</strong>, <strong>reject all non-essential</strong>,
                    or <strong>customize</strong>. Your choice is remembered, and you can re-open the banner from any
                    page via the &ldquo;Cookie settings&rdquo; link in the footer.
                  </p>
                </div>
                <div className="border-l-4 border-blue-400 pl-4">
                  <h3 className="font-semibold text-[#0B2447]">Google Ad Settings (everywhere)</h3>
                  <p className="text-slate-600 text-sm mt-1">
                    Visit{' '}
                    <a
                      href="https://www.google.com/settings/ads"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0B2447] hover:underline underline-offset-2 font-medium"
                    >
                      google.com/settings/ads
                    </a>{' '}
                    to view and control the categories Google uses for personalized advertising, or to turn off
                    personalized ads entirely. The setting applies to all sites that use Google ads, not just
                    AirMilesCalc.
                  </p>
                </div>
                <div className="border-l-4 border-blue-400 pl-4">
                  <h3 className="font-semibold text-[#0B2447]">Industry opt-out tools</h3>
                  <p className="text-slate-600 text-sm mt-1">
                    Opt out of third-party advertising cookies across many ad networks at the{' '}
                    <a
                      href="https://optout.networkadvertising.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0B2447] hover:underline underline-offset-2 font-medium"
                    >
                      Network Advertising Initiative (NAI)
                    </a>{' '}
                    or the{' '}
                    <a
                      href="https://optout.aboutads.info/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0B2447] hover:underline underline-offset-2 font-medium"
                    >
                      Digital Advertising Alliance (DAA)
                    </a>
                    . EU residents can additionally use{' '}
                    <a
                      href="https://www.youronlinechoices.eu/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0B2447] hover:underline underline-offset-2 font-medium"
                    >
                      youronlinechoices.eu
                    </a>
                    .
                  </p>
                </div>
                <div className="border-l-4 border-blue-400 pl-4">
                  <h3 className="font-semibold text-[#0B2447]">Browser-level controls</h3>
                  <p className="text-slate-600 text-sm mt-1">
                    Most browsers let you block third-party cookies entirely (Settings → Privacy), enable
                    &ldquo;Do Not Track&rdquo;, or use private-browsing mode to prevent persistent ad cookies. We
                    honor the{' '}
                    <a
                      href="https://globalprivacycontrol.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0B2447] hover:underline underline-offset-2 font-medium"
                    >
                      Global Privacy Control (GPC)
                    </a>{' '}
                    signal where it&apos;s applicable as a CCPA opt-out request.
                  </p>
                </div>
              </div>
            </section>

            {/* GDPR & International Privacy */}
            <section className="bg-white rounded-md border border-slate-200 p-6 md:p-8">
              <h2 className="text-[16px] font-semibold text-[#0B2447] tracking-tight mb-4">GDPR &amp; International Privacy</h2>
              <p className="text-slate-700 mb-4">
                AirMilesCalc respects international privacy regulations. Because we collect minimal data, compliance is straightforward:
              </p>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-400 pl-4">
                  <h3 className="font-semibold text-[#0B2447]">European Union (GDPR)</h3>
                  <p className="text-slate-600 text-sm mt-1">
                    Under the General Data Protection Regulation, you have the right to access, rectify, erase, restrict processing,
                    and port your personal data. Since we collect minimal data, these rights are easily exercised.
                    For any GDPR-related requests, email us at{' '}
                    <a href="mailto:info@airmilescalc.com" className="text-[#0B2447] hover:underline underline-offset-2 font-medium">info@airmilescalc.com</a>.
                    Learn more at <a href="https://gdpr.eu/" target="_blank" rel="noopener noreferrer" className="text-[#0B2447] hover:underline underline-offset-2 font-medium">gdpr.eu</a>.
                  </p>
                </div>
                <div className="border-l-4 border-blue-400 pl-4">
                  <h3 className="font-semibold text-[#0B2447]">California (CCPA)</h3>
                  <p className="text-slate-600 text-sm mt-1">
                    Under the California Consumer Privacy Act, California residents have the right to know what personal
                    information is collected, request deletion, and opt out of data sales. We do not sell personal information.
                    See the <a href="https://oag.ca.gov/privacy/ccpa" target="_blank" rel="noopener noreferrer" className="text-[#0B2447] hover:underline underline-offset-2 font-medium">California AG CCPA page</a> for more.
                  </p>
                </div>
              </div>
            </section>

            {/* International Privacy Frameworks */}
            <section className="bg-white rounded-md border border-slate-200 p-6 md:p-8">
              <h2 className="text-[16px] font-semibold text-[#0B2447] tracking-tight mb-4">International Privacy Frameworks</h2>
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
                      <td className="py-3 pr-4 font-medium text-[#0B2447]">GDPR</td>
                      <td className="py-3 pr-4">European Union</td>
                      <td className="py-3 pr-4">Right to erasure, data portability &amp; consent</td>
                      <td className="py-3"><a href="https://gdpr.eu/" target="_blank" rel="noopener noreferrer" className="text-[#0B2447] hover:underline underline-offset-2 font-medium">gdpr.eu</a></td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-[#0B2447]">CCPA/CPRA</td>
                      <td className="py-3 pr-4">California, US</td>
                      <td className="py-3 pr-4">Right to know, delete &amp; opt out of data sales</td>
                      <td className="py-3"><a href="https://oag.ca.gov/privacy/ccpa" target="_blank" rel="noopener noreferrer" className="text-[#0B2447] hover:underline underline-offset-2 font-medium">oag.ca.gov</a></td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-[#0B2447]">LGPD</td>
                      <td className="py-3 pr-4">Brazil</td>
                      <td className="py-3 pr-4">Right to confirmation, access &amp; anonymization</td>
                      <td className="py-3"><a href="https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd" target="_blank" rel="noopener noreferrer" className="text-[#0B2447] hover:underline underline-offset-2 font-medium">gov.br</a></td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-[#0B2447]">PIPA</td>
                      <td className="py-3 pr-4">South Korea</td>
                      <td className="py-3 pr-4">Right to consent &amp; request destruction of data</td>
                      <td className="py-3"><span className="text-slate-400">-</span></td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-[#0B2447]">PIPEDA</td>
                      <td className="py-3 pr-4">Canada</td>
                      <td className="py-3 pr-4">Right to access &amp; challenge compliance</td>
                      <td className="py-3"><a href="https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/" target="_blank" rel="noopener noreferrer" className="text-[#0B2447] hover:underline underline-offset-2 font-medium">priv.gc.ca</a></td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-[#0B2447]">UK GDPR</td>
                      <td className="py-3 pr-4">United Kingdom</td>
                      <td className="py-3 pr-4">Right to erasure, rectification &amp; data portability</td>
                      <td className="py-3"><a href="https://ico.org.uk/" target="_blank" rel="noopener noreferrer" className="text-[#0B2447] hover:underline underline-offset-2 font-medium">ico.org.uk</a></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* How Your Data Flows */}
            <section className="bg-white rounded-md border border-slate-200 p-6 md:p-8">
              <h2 className="text-[16px] font-semibold text-[#0B2447] tracking-tight mb-4">How Your Data Flows</h2>
              <p className="text-slate-700 mb-6">
                Here&apos;s exactly what happens when you use the AirMilesCalc calculator, step by step:
              </p>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#0B2447] text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <h3 className="font-semibold text-[#0B2447] mb-1">You Type an Airport Name</h3>
                    <p className="text-slate-600">
                      You type an airport name or code into the search field. No data is sent until
                      you have typed at least two characters.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#0B2447] text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <h3 className="font-semibold text-[#0B2447] mb-1">Search Query Sent to Our Server</h3>
                    <p className="text-slate-600">
                      A lightweight search query is sent to our server to return matching airports. No personal
                      information is attached to this request beyond the search term itself.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#0B2447] text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <h3 className="font-semibold text-[#0B2447] mb-1">You Click Calculate</h3>
                    <p className="text-slate-600">
                      The distance between the two selected airports is computed server-side using the Vincenty
                      formula. Only the airport codes are sent &mdash; no personal data is included.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#0B2447] text-white rounded-full flex items-center justify-center font-bold">4</div>
                  <div>
                    <h3 className="font-semibold text-[#0B2447] mb-1">Results Displayed</h3>
                    <p className="text-slate-600">
                      The calculated distance is displayed in your browser. Nothing is stored on our servers after
                      the page loads &mdash; there is no calculation history and no data retention.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Privacy Resources */}
            <section className="bg-white rounded-md border border-slate-200 p-6 md:p-8">
              <h2 className="text-[16px] font-semibold text-[#0B2447] tracking-tight mb-4">Privacy Resources</h2>
              <p className="text-slate-700 mb-4">
                Learn more about your digital privacy rights from these trusted regulators and organizations:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#0B2447] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101" />
                  </svg>
                  <div>
                    <a href="https://ico.org.uk/" target="_blank" rel="noopener noreferrer" className="text-[#0B2447] hover:underline underline-offset-2 font-medium font-medium">UK Information Commissioner&apos;s Office (ICO)</a>
                    <p className="text-slate-600 text-sm mt-0.5">The UK&apos;s independent authority for data protection and information rights.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#0B2447] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101" />
                  </svg>
                  <div>
                    <a href="https://edpb.europa.eu/" target="_blank" rel="noopener noreferrer" className="text-[#0B2447] hover:underline underline-offset-2 font-medium font-medium">European Data Protection Board (EDPB)</a>
                    <p className="text-slate-600 text-sm mt-0.5">The EU body that ensures consistent application of the GDPR across member states.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#0B2447] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101" />
                  </svg>
                  <div>
                    <a href="https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa" target="_blank" rel="noopener noreferrer" className="text-[#0B2447] hover:underline underline-offset-2 font-medium font-medium">FTC COPPA Guidance</a>
                    <p className="text-slate-600 text-sm mt-0.5">US Federal Trade Commission&apos;s rules on children&apos;s online privacy protection.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#0B2447] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101" />
                  </svg>
                  <div>
                    <a href="https://www.eff.org/" target="_blank" rel="noopener noreferrer" className="text-[#0B2447] hover:underline underline-offset-2 font-medium font-medium">Electronic Frontier Foundation (EFF)</a>
                    <p className="text-slate-600 text-sm mt-0.5">A leading nonprofit defending digital privacy, free speech, and innovation.</p>
                  </div>
                </li>
              </ul>
            </section>

            {/* Cookie Table */}
            <section className="bg-white rounded-md border border-slate-200 p-6 md:p-8">
              <h2 className="text-[16px] font-semibold text-[#0B2447] tracking-tight mb-4">Cookie Details</h2>
              <p className="text-slate-700 mb-4">
                Below is the inventory of cookies you may encounter on AirMilesCalc, grouped by who sets them and
                what they&apos;re for. &ldquo;Essential&rdquo; cookies are set without consent; &ldquo;Advertising&rdquo;
                cookies are only set if you accept them via the consent banner (where applicable).
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 pr-4 font-semibold text-slate-700">Cookie</th>
                      <th className="text-left py-3 pr-4 font-semibold text-slate-700">Set by</th>
                      <th className="text-left py-3 pr-4 font-semibold text-slate-700">Purpose</th>
                      <th className="text-left py-3 pr-4 font-semibold text-slate-700">Duration</th>
                      <th className="text-left py-3 font-semibold text-slate-700">Type</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-600 divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 pr-4 font-mono text-xs">__vercel_live_token</td>
                      <td className="py-3 pr-4">Vercel (hosting)</td>
                      <td className="py-3 pr-4">Hosting-platform session</td>
                      <td className="py-3 pr-4">Session</td>
                      <td className="py-3"><span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded font-medium">Essential</span></td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-mono text-xs">_vercel_jwt</td>
                      <td className="py-3 pr-4">Vercel (hosting)</td>
                      <td className="py-3 pr-4">Deployment authentication</td>
                      <td className="py-3 pr-4">Session</td>
                      <td className="py-3"><span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded font-medium">Essential</span></td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-mono text-xs">NID, DSID, IDE, AID, ANID</td>
                      <td className="py-3 pr-4">Google AdSense</td>
                      <td className="py-3 pr-4">Ad serving, frequency capping, fraud prevention, ad personalization (where consented)</td>
                      <td className="py-3 pr-4">Up to 13 months</td>
                      <td className="py-3"><span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium">Advertising</span></td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-mono text-xs">__gads, __gpi</td>
                      <td className="py-3 pr-4">Google AdSense</td>
                      <td className="py-3 pr-4">First-party ad delivery, view-time measurement</td>
                      <td className="py-3 pr-4">Up to 13 months</td>
                      <td className="py-3"><span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium">Advertising</span></td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-mono text-xs">FCNEC, FCCDCF</td>
                      <td className="py-3 pr-4">Google Funding Choices</td>
                      <td className="py-3 pr-4">Stores your consent choices so the banner doesn&apos;t reappear on every page</td>
                      <td className="py-3 pr-4">Up to 13 months</td>
                      <td className="py-3"><span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded font-medium">Essential</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-slate-500 text-xs mt-3">
                Advertising-cookie names and lifetimes are set by Google and may change &mdash; the authoritative list is
                at{' '}
                <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer" className="text-[#0B2447] hover:underline underline-offset-2 font-medium">policies.google.com/technologies/cookies</a>
                . For hosting cookies see{' '}
                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#0B2447] hover:underline underline-offset-2 font-medium">Vercel&apos;s privacy policy</a>.
                We don&apos;t use any analytics or preference cookies of our own.
              </p>
            </section>

            {/* Children's Privacy */}
            <section className="bg-white rounded-md border border-slate-200 p-6 md:p-8">
              <h2 className="text-[16px] font-semibold text-[#0B2447] tracking-tight mb-4">Children&apos;s Privacy</h2>
              <p className="text-slate-700">
                AirMilesCalc is not directed at children under the age of 13. We do not knowingly collect personal
                information from children under 13. If you are a parent or guardian and believe your child has
                provided us with personal information, please contact us and we will
                delete that information.
              </p>
            </section>

            {/* Changes to This Policy */}
            <section className="bg-white rounded-md border border-slate-200 p-6 md:p-8">
              <h2 className="text-[16px] font-semibold text-[#0B2447] tracking-tight mb-4">Changes to This Policy</h2>
              <p className="text-slate-700">
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with
                an updated &ldquo;Last Updated&rdquo; date. We encourage you to review this page periodically for
                the latest information on our privacy practices. Continued use of AirMilesCalc after changes
                constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Contact Us */}
            <section className="bg-slate-100 rounded-md border border-slate-200 p-6 md:p-8">
              <h2 className="text-[16px] font-semibold text-[#0B2447] tracking-tight mb-4">Contact Us</h2>
              <p className="text-slate-700 mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <a
                href="mailto:info@airmilescalc.com"
                className="inline-flex items-center gap-2 text-[#0B2447] font-medium hover:text-blue-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@airmilescalc.com
              </a>
            </section>
          </div>

          <FAQ
            items={[
              {
                q: 'Do I need to create an account to use the calculator?',
                a: 'No. AirMilesCalc has no account system, no signup, and no personal-data fields. Calculations happen server-side using only the airport IATA codes you select; nothing about you is attached to the request and no calculation history is retained after the response is sent.',
              },
              {
                q: 'What data does AirMilesCalc itself collect about me?',
                a: 'AirMilesCalc itself collects nothing from you beyond what is required to render the page you requested. We do not run first-party analytics, we do not fingerprint, and we do not build behavioural profiles. The only personal data we hold is the contents of any email you voluntarily send us, used solely to reply.',
              },
              {
                q: 'What does Google AdSense collect when it serves ads?',
                a: 'When AdSense is enabled (currently not yet — see the implementation status notice at the top), Google may set advertising cookies (NID, IDE, AID, ANID, DSID, __gads, __gpi) on its own domains and partner domains to serve ads, cap frequency, measure performance, and personalize where you have consented. Full details are in Google\'s ads technologies policy.',
              },
              {
                q: 'How do I opt out of personalized advertising?',
                a: 'Three layers of control. (1) In regulated regions the Funding Choices CMP banner lets you reject non-essential cookies on first visit. (2) Google Ad Settings (google.com/settings/ads) controls personalisation across every site that uses Google ads. (3) Industry-wide tools at optout.networkadvertising.org and optout.aboutads.info let you opt out of many third-party ad networks at once.',
              },
              {
                q: 'How do I exercise GDPR, CCPA, or similar data-subject rights?',
                a: 'Email info@airmilescalc.com with "Data subject request" in the subject line. We respond within the statutory deadline for your jurisdiction (1 month for GDPR / UK GDPR, 45 days for CCPA, 15 days for LGPD, 30 days for PIPEDA). Because we hold almost no personal data, most requests are met with a brief letter confirming that we have no record matching the requester.',
              },
              {
                q: 'Do you honour the Global Privacy Control (GPC) signal?',
                a: 'Yes. We treat a GPC header from your browser as a CCPA opt-out request and as an indication of a withdrawal of consent under GDPR-style frameworks, applied to any third-party processing AirMilesCalc controls. Some downstream third parties (notably Google AdSense) interpret GPC according to their own policies; see their disclosures for specifics.',
              },
            ]}
          />

          <InternalLinks
            heading="Where to go next"
            links={[
              { href: '/', title: 'Distance calculator', description: 'Use the calculator — no signup, no first-party tracking; third-party ads operate under consent in regulated regions.' },
              { href: '/methodology', title: 'Methodology & sources', description: 'Vincenty, WGS-84, DEFRA, Lee 2021 — every formula and primary source.' },
              { href: '/learn', title: 'Learn', description: 'Deep dives on aviation, emissions, and travel science.' },
              { href: '/terms', title: 'Terms of service', description: 'Usage terms and acceptable use.' },
              { href: '/contact', title: 'Contact', description: 'Questions about your data or how we handle it.' },
              { href: '/about', title: 'About', description: 'Why we built AirMilesCalc and who it is for.' },
            ]}
          />

          {/* Back to Calculator CTA */}
          <div className="text-center mt-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#0B2447] font-medium hover:text-blue-700"
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
