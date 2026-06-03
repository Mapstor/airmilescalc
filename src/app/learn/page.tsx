import type { Metadata } from "next";
import Link from "next/link";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";
import { LEARN_TOPICS } from "@/app/learn/[topic]/page";
import { Lede, KeyStats, Sources, FAQ } from "@/components/content/blocks";

const META: Record<
  string,
  { title: string; description: string; section: "Aviation" | "Emissions" | "Travel" }
> = {
  "nautical-miles": {
    title: "The nautical mile — exactly 1,852 metres",
    description:
      "Why aviation and maritime navigation still use nautical miles, where 1,852 m came from, and why the unit survives.",
    section: "Aviation",
  },
  "aircraft-cruise-speeds": {
    title: "Aircraft cruise speeds, by type",
    description:
      "Cruise speeds for the dozen aircraft types that fly most commercial passengers — Mach number, km/h.",
    section: "Aviation",
  },
  "cruising-altitude": {
    title: "Why aircraft cruise at 35,000 feet",
    description:
      "Most commercial flights cruise between FL350 and FL410, the result of a tight drag-fuel-ceiling trade.",
    section: "Aviation",
  },
  "longest-flights-in-the-world": {
    title: "The world's longest commercial flights",
    description:
      "SQ23 Singapore–JFK leads at 15,349 km and 18 h 40 min — here is the current top ten.",
    section: "Aviation",
  },
  "busiest-airports-in-the-world": {
    title: "The world's busiest airports",
    description:
      "Atlanta at 104.6 million passengers in 2023 — ACI World's ranked top ten with passenger numbers.",
    section: "Aviation",
  },
  "airline-alliances": {
    title: "Airline alliances — Star, oneworld, SkyTeam",
    description:
      "The three global alliances, their 25 / 13 / 19 member airlines, and what alliance status actually gets you.",
    section: "Aviation",
  },
  "cabin-class-emissions": {
    title: "Cabin class and your CO₂ footprint",
    description:
      "Business class emits roughly 2.9 × economy on the same flight — the math and the rationale.",
    section: "Emissions",
  },
  corsia: {
    title: "CORSIA, explained",
    description:
      "ICAO's global aviation carbon scheme enters mandatory phase in 2027 — here is what it actually requires.",
    section: "Emissions",
  },
  "sustainable-aviation-fuel": {
    title: "Sustainable aviation fuel — where the industry actually is",
    description:
      "SAF is 0.3 % of global jet fuel in 2024; the IATA pathway needs 65 % by 2050. The gap is the story.",
    section: "Emissions",
  },
  "jet-lag-science": {
    title: "Jet lag, eastbound vs westbound",
    description:
      "Why westward recovery runs at ~92 min/day and eastward at ~57 min/day — circadian period plus light.",
    section: "Travel",
  },
};

import { ogImageMeta, twitterMeta } from "@/lib/og";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Plain-English deep dives on aviation operations, flight emissions, sustainable aviation fuel, jet lag, and the world's busiest airports and longest flights.",
  alternates: { canonical: "/learn" },
  openGraph: {
    title: "Learn — AirMilesCalc",
    description: "Ten plain-English deep dives on aviation, emissions, and travel science.",
    url: "/learn",
    type: "article",
    images: ogImageMeta({ title: "Learn", subtitle: "Ten plain-English deep dives on aviation, emissions, and travel science.", category: "Learn" }),
  },
  twitter: twitterMeta({ title: "Learn", subtitle: "Ten plain-English deep dives on aviation, emissions, and travel science.", category: "Learn" }),
};

export const revalidate = 86400;

export default function LearnIndex() {
  const sections = ["Aviation", "Emissions", "Travel"] as const;
  return (
    <ContentPageLayout
      meta={{
        title: "Learn",
        description:
          "Plain-English deep dives on flight operations, emissions science, sustainable aviation fuel, jet-lag chronobiology, and the airports and routes that anchor global aviation.",
        url: "/learn",
        category: "Learn",
        breadcrumbs: [
          { name: "Home", href: "/" },
          { name: "Learn", href: "/learn" },
        ],
      }}
    >
      <Lede>
        Ten plain-English deep dives on the bits of aviation operations,
        emissions science, and travel chronobiology that the calculator
        touches but does not explain in detail. Each page cites primary
        sources directly. The methodology pages live at /methodology — these
        are the applied companions.
      </Lede>

      <KeyStats
        stats={[
          {
            value: "10",
            label: "Topic pages across Aviation, Emissions, and Travel",
            source: "This index",
          },
          {
            value: "5+",
            label: "Primary sources cited on every topic page",
            source: "Per Sources block",
          },
          {
            value: "100%",
            label: "Free to read, no signup required",
            source: "By design",
          },
          {
            value: "0",
            label: "First-party trackers by AirMilesCalc itself; AdSense funding is planned post-approval — see /privacy",
            source: "By policy",
          },
        ]}
      />

      <Sources
        items={[
          {
            id: 1,
            label: "Lee et al. (2021)",
            note: "Aviation effective radiative forcing decomposition — anchors the radiative-forcing and cabin-class pages",
            venue: "Atmospheric Environment 244, 117834",
            date: "January 2021",
            url: "https://doi.org/10.1016/j.atmosenv.2020.117834",
          },
          {
            id: 2,
            label: "DESNZ 2024 GHG conversion factors",
            note: "UK government per-passenger-km CO₂e factors — anchors the emissions cluster",
            venue: "UK gov.uk",
            date: "June 2024",
            url: "https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024",
          },
          {
            id: 3,
            label: "Sack (2010) NEJM jet-lag review",
            note: "Anchors the jet-lag chronobiology page — phase-delay vs phase-advance asymmetry",
            venue: "New England Journal of Medicine 362:440-447",
            date: "February 2010",
            url: "https://www.nejm.org/doi/full/10.1056/NEJMcp0909838",
          },
          {
            id: 4,
            label: "ACI World — Top 20 busiest airports",
            note: "Annual passenger-traffic ranking — anchors the busiest-airports page",
            venue: "Airports Council International",
            date: "July 2024 (for 2023 data)",
            url: "https://aci.aero/2024/07/16/top-20-busiest-airports-in-the-world-confirmed-by-aci-world/",
          },
          {
            id: 5,
            label: "IATA Fly Net Zero 2050",
            note: "Industry net-zero pathway resolution — anchors the SAF and CORSIA pages",
            venue: "IATA AGM 77, Boston",
            date: "4 October 2021",
            url: "https://www.iata.org/en/programs/sustainability/flynetzero/",
          },
          {
            id: 6,
            label: "ICAO CORSIA programme",
            note: "International aviation carbon offsetting scheme — anchors the CORSIA page",
            venue: "International Civil Aviation Organization",
            date: "Phases 2021–2035",
            url: "https://www.icao.int/environmental-protection/CORSIA/Pages/default.aspx",
          },
        ]}
      />

      <section className="my-8 not-prose">
        <h2 className="text-[22px] font-semibold text-[#0B2447] tracking-tight mb-3">
          How these pages relate to the calculator
        </h2>
        <p className="text-[14.5px] text-slate-700 leading-relaxed mb-3 max-w-3xl">
          The calculator on the homepage returns six numbers per route —
          distance, block time, per-cabin CO₂e, bearing, cruising altitude,
          and jet-lag recovery. Each of those numbers has a story behind it.
          The Aviation pages explain the operating context that shapes block
          time, altitude, and route choice; the Emissions pages explain the
          DEFRA cabin multipliers and the 1.9 × radiative-forcing uplift that
          turn distance into CO₂e; the Travel page covers the chronobiology
          that determines whether the jet-lag estimate is mild or severe.
        </p>
        <p className="text-[14.5px] text-slate-700 leading-relaxed max-w-3xl">
          The full formal methodology — Vincenty&apos;s formula, the WGS-84
          ellipsoid parameters, DESNZ&apos;s 2024 conversion factors, Lee et
          al.&apos;s 2021 radiative-forcing decomposition — lives at{" "}
          <Link href="/methodology" className="text-blue-700 hover:underline underline-offset-2 font-medium">
            /methodology
          </Link>
          . The /learn pages below are the plain-English companions, written
          so a non-specialist reader can verify the numbers without first
          mastering the underlying math.
        </p>
      </section>

      <section className="my-8 not-prose">
        <h2 className="text-[22px] font-semibold text-[#0B2447] tracking-tight mb-3">
          Reading paths by audience
        </h2>
        <p className="text-[14.5px] text-slate-700 leading-relaxed mb-4 max-w-3xl">
          The ten pages do not need to be read in order. Most readers arrive
          with a specific question and leave once it is answered. The four
          paths below sequence the pages so each new page builds on the one
          before it, depending on what you came to find out.
        </p>
        <div className="grid md:grid-cols-2 gap-3 max-w-4xl">
          <div className="bg-white border border-slate-200 rounded-md p-4">
            <div className="text-[13px] font-mono uppercase tracking-wider text-slate-500 mb-2">
              For frequent flyers
            </div>
            <div className="text-[14.5px] text-slate-700 leading-relaxed">
              Start at{" "}
              <Link href="/learn/jet-lag-science" className="text-blue-700 hover:underline">jet-lag science</Link>
              {" "}to recalibrate your travel routine, then{" "}
              <Link href="/learn/cabin-class-emissions" className="text-blue-700 hover:underline">cabin-class CO₂</Link>
              {" "}to anchor what your annual mileage actually costs the
              atmosphere, and finish at{" "}
              <Link href="/learn/airline-alliances" className="text-blue-700 hover:underline">airline alliances</Link>
              {" "}to understand which partner offers reciprocal mileage on
              your next leg.
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-md p-4">
            <div className="text-[13px] font-mono uppercase tracking-wider text-slate-500 mb-2">
              For sustainability and ESG teams
            </div>
            <div className="text-[14.5px] text-slate-700 leading-relaxed">
              Start at{" "}
              <Link href="/learn/cabin-class-emissions" className="text-blue-700 hover:underline">cabin-class CO₂</Link>
              {" "}for the per-ticket arithmetic, then{" "}
              <Link href="/learn/sustainable-aviation-fuel" className="text-blue-700 hover:underline">SAF</Link>
              {" "}for the supply-side picture, and{" "}
              <Link href="/learn/corsia" className="text-blue-700 hover:underline">CORSIA</Link>
              {" "}for the international regulatory layer that becomes
              mandatory in 2027. Pair with{" "}
              <Link href="/methodology/defra-emission-factors" className="text-blue-700 hover:underline">DEFRA factors</Link>.
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-md p-4">
            <div className="text-[13px] font-mono uppercase tracking-wider text-slate-500 mb-2">
              For aviation enthusiasts
            </div>
            <div className="text-[14.5px] text-slate-700 leading-relaxed">
              Start at{" "}
              <Link href="/learn/longest-flights-in-the-world" className="text-blue-700 hover:underline">longest flights</Link>
              {" "}for the route topology, then{" "}
              <Link href="/learn/aircraft-cruise-speeds" className="text-blue-700 hover:underline">cruise speeds</Link>
              {" "}and{" "}
              <Link href="/learn/cruising-altitude" className="text-blue-700 hover:underline">cruising altitude</Link>
              {" "}for the operating envelope, and{" "}
              <Link href="/learn/busiest-airports-in-the-world" className="text-blue-700 hover:underline">busiest airports</Link>
              {" "}for the network topology these flights move through.
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-md p-4">
            <div className="text-[13px] font-mono uppercase tracking-wider text-slate-500 mb-2">
              For educators and students
            </div>
            <div className="text-[14.5px] text-slate-700 leading-relaxed">
              Start at{" "}
              <Link href="/learn/nautical-miles" className="text-blue-700 hover:underline">nautical miles</Link>
              {" "}for the unit history, branch to{" "}
              <Link href="/methodology/great-circle-distance" className="text-blue-700 hover:underline">great-circle distance</Link>
              {" "}for the geometry, and finish at{" "}
              <Link href="/learn/jet-lag-science" className="text-blue-700 hover:underline">jet-lag chronobiology</Link>
              {" "}for the biological-systems angle on travel.
            </div>
          </div>
        </div>
      </section>

      <section className="my-8 not-prose">
        <h2 className="text-[22px] font-semibold text-[#0B2447] tracking-tight mb-3">
          Calculator output → background page mapping
        </h2>
        <p className="text-[14.5px] text-slate-700 leading-relaxed mb-4 max-w-3xl">
          Every figure the calculator shows on a results page has a /learn
          companion that explains what it represents and where the
          assumptions live. The mapping below is the canonical pairing — use
          it when you want to verify a specific number rather than read the
          full theory.
        </p>
        <div className="overflow-x-auto bg-white border border-slate-200 rounded-md">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-2.5 font-semibold text-slate-700 text-left">Calculator output</th>
                <th className="px-4 py-2.5 font-semibold text-slate-700 text-left">/learn companion</th>
                <th className="px-4 py-2.5 font-semibold text-slate-700 text-left">What it explains</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="px-4 py-2.5 align-top font-mono text-[12.5px]">Distance (km / mi / NM)</td>
                <td className="px-4 py-2.5 align-top">
                  <Link href="/learn/nautical-miles" className="text-blue-700 hover:underline">nautical-miles</Link>
                </td>
                <td className="px-4 py-2.5 align-top">Why aviation reports distance in nautical miles and how the unit relates to the metre and the statute mile.</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 align-top font-mono text-[12.5px]">Block time</td>
                <td className="px-4 py-2.5 align-top">
                  <Link href="/learn/aircraft-cruise-speeds" className="text-blue-700 hover:underline">aircraft-cruise-speeds</Link>{" + "}
                  <Link href="/learn/cruising-altitude" className="text-blue-700 hover:underline">cruising-altitude</Link>
                </td>
                <td className="px-4 py-2.5 align-top">Why 850 km/h is the right single-number reference for narrow- and wide-body cruise.</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 align-top font-mono text-[12.5px]">CO₂e per cabin</td>
                <td className="px-4 py-2.5 align-top">
                  <Link href="/learn/cabin-class-emissions" className="text-blue-700 hover:underline">cabin-class-emissions</Link>
                </td>
                <td className="px-4 py-2.5 align-top">Why business class is allocated ≈ 2.9 × economy on the same flight (it is a floor-area-allocation choice, not a fuel-burn measurement).</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 align-top font-mono text-[12.5px]">Jet-lag recovery days</td>
                <td className="px-4 py-2.5 align-top">
                  <Link href="/learn/jet-lag-science" className="text-blue-700 hover:underline">jet-lag-science</Link>
                </td>
                <td className="px-4 py-2.5 align-top">Why westward recovery runs at 92 minutes per day and eastward at 57 — the human circadian period averages 24.2 hours.</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 align-top font-mono text-[12.5px]">Route classification (ULR / long-haul / ...)</td>
                <td className="px-4 py-2.5 align-top">
                  <Link href="/learn/longest-flights-in-the-world" className="text-blue-700 hover:underline">longest-flights-in-the-world</Link>
                </td>
                <td className="px-4 py-2.5 align-top">What aircraft can fly ultra-long-range routes non-stop and how they trade payload for fuel.</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 align-top font-mono text-[12.5px]">Airline list per route</td>
                <td className="px-4 py-2.5 align-top">
                  <Link href="/learn/airline-alliances" className="text-blue-700 hover:underline">airline-alliances</Link>
                </td>
                <td className="px-4 py-2.5 align-top">Which alliance dominates which corridor and how status reciprocity works.</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 align-top font-mono text-[12.5px]">Origin / destination hub</td>
                <td className="px-4 py-2.5 align-top">
                  <Link href="/learn/busiest-airports-in-the-world" className="text-blue-700 hover:underline">busiest-airports-in-the-world</Link>
                </td>
                <td className="px-4 py-2.5 align-top">Where the route fits in the global passenger-traffic ranking and what the hub geography looks like.</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 align-top font-mono text-[12.5px]">CO₂ offset estimate (trees)</td>
                <td className="px-4 py-2.5 align-top">
                  <Link href="/learn/corsia" className="text-blue-700 hover:underline">corsia</Link>{" + "}
                  <Link href="/learn/sustainable-aviation-fuel" className="text-blue-700 hover:underline">sustainable-aviation-fuel</Link>
                </td>
                <td className="px-4 py-2.5 align-top">What an airline-level carbon credit actually buys and why SAF is the harder-but-more-permanent abatement path.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {sections.map((section) => {
        const topics = LEARN_TOPICS.filter(
          (slug) => META[slug]?.section === section,
        );
        const sectionIntro: Record<string, string> = {
          Aviation:
            "How aircraft actually operate the routes the calculator measures. Cruise speeds and altitudes that anchor the 850 km/h flight-time reference; the world's longest scheduled non-stops and the ultra-long-range aircraft that fly them; the busiest airports by passenger traffic; and the alliance structure that coordinates international long-haul scheduling.",
          Emissions:
            "Where the per-passenger CO₂ numbers come from, why business class is allocated roughly 2.9 × economy on the same flight, and how the industry plans to bridge the gap from 0.3 % SAF in 2024 to a net-zero pathway by 2050 — including the CORSIA market-based measure that becomes mandatory in 2027.",
          Travel:
            "Applied chronobiology — why westward jet-lag recovery runs at about 92 minutes per day while eastward only manages 57, the asymmetry that determines whether a 9-hour shift takes 6 days or 9.5 days to fully reset.",
        };
        return (
          <section key={section} className="my-8 not-prose">
            <h2 className="text-[22px] font-semibold text-[#0B2447] tracking-tight mb-2">
              {section}
            </h2>
            <p className="text-[14px] text-slate-700 leading-relaxed mb-4 max-w-3xl">
              {sectionIntro[section]}
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              {topics.map((slug) => {
                const meta = META[slug];
                return (
                  <Link
                    key={slug}
                    href={`/learn/${slug}`}
                    className="block bg-white border border-slate-200 rounded-md p-4 hover:border-[#0B2447] transition-colors group"
                  >
                    <div className="text-[14.5px] font-semibold text-[#0B2447] group-hover:underline underline-offset-2">
                      {meta.title}{" "}
                      <span className="text-slate-400 group-hover:text-[#0B2447]">
                        →
                      </span>
                    </div>
                    <div className="text-[13px] text-slate-600 mt-1 leading-snug">
                      {meta.description}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      <FAQ
        items={[
          {
            q: "How are these pages different from /methodology?",
            a: "The /methodology pages are formal technical references — they describe the exact formulas, constants, and primary sources behind every number the calculator returns. The /learn pages are applied companions, written so a non-specialist reader can understand the implications without first mastering the math.",
          },
          {
            q: "Are the numbers on these pages up to date?",
            a: "Each /learn page is dated at the top with the last verification date. Numbers are pulled from primary sources — DESNZ for emissions factors, ACI World for airport rankings, IATA for fleet stats, Singapore Airlines schedules for ULR routes — and we update annually or when a published source ships a material revision.",
          },
          {
            q: "Can I cite these pages in academic work?",
            a: "Yes, but prefer to cite the underlying primary sources (listed in each page's Sources block) rather than the AirMilesCalc page itself. This keeps your citation trail clean and lets reviewers verify directly against the regulator or peer-reviewed paper.",
          },
          {
            q: "Why is there no page about [some other aviation topic]?",
            a: "The /learn cluster covers topics the calculator surfaces directly — distance, time, CO₂, jet lag, cabin class, longest flights, busiest airports, alliances, CORSIA, SAF. Topics outside the calculator's scope (booking systems, frequent-flyer programs, in-flight service) are deliberately left to specialist sites that focus on them.",
          },
          {
            q: "Do the /learn pages have schema.org markup?",
            a: "Yes — every subpage emits TechArticle, BreadcrumbList, and FAQPage JSON-LD, and is canonical-linked. Sources blocks expose primary citations directly in the page body so AI assistants and search crawlers find them without needing to follow links.",
          },
        ]}
      />
    </ContentPageLayout>
  );
}
