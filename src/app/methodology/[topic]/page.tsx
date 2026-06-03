import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";
import { ogImageMeta, twitterMeta } from "@/lib/og";

export const METHODOLOGY_TOPICS = [
  "vincenty-formula",
  "haversine-formula",
  "great-circle-distance",
  "wgs84-ellipsoid",
  "rhumb-line",
  "co2-emissions-calculation",
  "defra-emission-factors",
  "radiative-forcing",
  "flight-time-calculation",
] as const;

export type MethodologyTopic = (typeof METHODOLOGY_TOPICS)[number];

export function generateStaticParams() {
  return METHODOLOGY_TOPICS.map((topic) => ({ topic }));
}

async function loadTopic(topic: string) {
  if (!METHODOLOGY_TOPICS.includes(topic as MethodologyTopic)) return null;
  try {
    const mod = await import(`@/data/content/methodology/${topic}.mdx`);
    return { Component: mod.default, meta: mod.meta };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic } = await params;
  const loaded = await loadTopic(topic);
  if (!loaded) return { title: "Methodology — Not found" };
  return {
    title: loaded.meta.title,
    description: loaded.meta.description,
    alternates: { canonical: `/methodology/${topic}` },
    openGraph: {
      title: `${loaded.meta.title} — AirMilesCalc`,
      description: loaded.meta.description,
      url: `/methodology/${topic}`,
      type: "article",
      images: ogImageMeta({ title: loaded.meta.title, subtitle: loaded.meta.description, category: "Methodology" }),
    },
    twitter: twitterMeta({ title: loaded.meta.title, subtitle: loaded.meta.description, category: "Methodology" }),
  };
}

export const revalidate = 86400;

export default async function MethodologyTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const loaded = await loadTopic(topic);
  if (!loaded) notFound();
  const { Component, meta } = loaded;
  return (
    <ContentPageLayout
      meta={{
        title: meta.title,
        description: meta.description,
        url: `/methodology/${topic}`,
        updated: meta.updated,
        category: meta.category ?? "Methodology",
        readingTime: meta.readingTime,
        breadcrumbs: [
          { name: "Home", href: "/" },
          { name: "Methodology", href: "/methodology" },
          { name: meta.title, href: `/methodology/${topic}` },
        ],
      }}
    >
      <Component />
    </ContentPageLayout>
  );
}
