import type { Metadata } from "next";
import EditorialContent, {
  meta,
} from "@/data/content/editorial-process.mdx";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";
import { ogImageMeta, twitterMeta } from "@/lib/og";

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: "/editorial-process" },
  openGraph: {
    title: `${meta.title} — AirMilesCalc`,
    description: meta.description,
    url: "/editorial-process",
    type: "article",
    images: ogImageMeta({
      title: meta.title,
      subtitle: meta.description,
      category: "Editorial",
    }),
  },
  twitter: twitterMeta({
    title: meta.title,
    subtitle: meta.description,
    category: "Editorial",
  }),
};

export const revalidate = 86400;

export default function EditorialProcessPage() {
  return (
    <ContentPageLayout
      meta={{
        title: meta.title,
        description: meta.description,
        url: "/editorial-process",
        updated: meta.updated,
        category: meta.category,
        readingTime: meta.readingTime,
        breadcrumbs: [
          { name: "Home", href: "/" },
          { name: "Editorial process", href: "/editorial-process" },
        ],
      }}
    >
      <EditorialContent />
    </ContentPageLayout>
  );
}
