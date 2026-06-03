import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";
import { ogImageMeta, twitterMeta } from "@/lib/og";

export const LEARN_TOPICS = [
  "nautical-miles",
  "aircraft-cruise-speeds",
  "cruising-altitude",
  "cabin-class-emissions",
  "jet-lag-science",
  "corsia",
  "sustainable-aviation-fuel",
  "longest-flights-in-the-world",
  "busiest-airports-in-the-world",
  "airline-alliances",
] as const;

export type LearnTopic = (typeof LEARN_TOPICS)[number];

export function generateStaticParams() {
  return LEARN_TOPICS.map((topic) => ({ topic }));
}

async function loadTopic(topic: string) {
  if (!LEARN_TOPICS.includes(topic as LearnTopic)) return null;
  try {
    const mod = await import(`@/data/content/learn/${topic}.mdx`);
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
  if (!loaded) return { title: "Learn — Not found" };
  return {
    title: loaded.meta.title,
    description: loaded.meta.description,
    alternates: { canonical: `/learn/${topic}` },
    openGraph: {
      title: `${loaded.meta.title} — AirMilesCalc`,
      description: loaded.meta.description,
      url: `/learn/${topic}`,
      type: "article",
      images: ogImageMeta({ title: loaded.meta.title, subtitle: loaded.meta.description, category: "Learn" }),
    },
    twitter: twitterMeta({ title: loaded.meta.title, subtitle: loaded.meta.description, category: "Learn" }),
  };
}

export const revalidate = 86400;

export default async function LearnTopicPage({
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
        url: `/learn/${topic}`,
        updated: meta.updated,
        category: meta.category ?? "Learn",
        readingTime: meta.readingTime,
        breadcrumbs: [
          { name: "Home", href: "/" },
          { name: "Learn", href: "/learn" },
          { name: meta.title, href: `/learn/${topic}` },
        ],
      }}
    >
      <Component />
    </ContentPageLayout>
  );
}
