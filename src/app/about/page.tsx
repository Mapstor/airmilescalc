import type { Metadata } from "next";
import AboutContent, { meta } from "@/data/content/about.mdx";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";
import { ogDefaults, ogImageMeta, twitterMeta } from "@/lib/og";

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: "/about" },
  openGraph: {
    ...ogDefaults(),
    title: meta.title,
    description: meta.description,
    url: "/about",
    type: "article",
    images: ogImageMeta({ title: meta.title, subtitle: meta.description, category: meta.category }),
  },
  twitter: twitterMeta({ title: meta.title, subtitle: meta.description, category: meta.category }),
};

export const revalidate = 86400;

// Person JSON-LD for the editorial author. Pen name acknowledged through the
// "About the author" Callout in the MDX; this schema lets search engines and
// AI assistants tie the methodology and learn content to a named author and
// link the Person to the Organization that operates the site.
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://airmilescalc.com/about#sam-k",
  "name": "Sam K.",
  "url": "https://airmilescalc.com/about",
  "jobTitle": "Independent maintainer and editorial author",
  "description":
    "Sole maintainer and editorial voice of AirMilesCalc. Independent traveler and software developer. Writes the methodology and learn pages, verifies every primary source cited inline, and answers correspondence at info@airmilescalc.com.",
  "knowsAbout": [
    "Flight distance calculation",
    "Vincenty's formula",
    "WGS-84 ellipsoid",
    "Great-circle navigation",
    "Aviation CO₂ emissions",
    "DEFRA 2024 emission factors",
    "Jet lag and circadian re-entrainment",
    "Sustainable aviation fuel",
    "CORSIA carbon offsetting",
  ],
  "worksFor": {
    "@id": "https://airmilescalc.com/#organization",
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <ContentPageLayout
        meta={{
          title: meta.title,
          description: meta.description,
          url: "/about",
          updated: meta.updated,
          category: meta.category,
          readingTime: meta.readingTime,
          pageType: "AboutPage",
          breadcrumbs: [
            { name: "Home", href: "/" },
            { name: "About", href: "/about" },
          ],
        }}
      >
        <AboutContent />
      </ContentPageLayout>
    </>
  );
}
