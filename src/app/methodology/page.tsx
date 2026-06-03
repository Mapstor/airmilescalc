import type { Metadata } from "next";
import MethodologyContent, {
  meta,
} from "@/data/content/methodology/index.mdx";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";
import { ogImageMeta, twitterMeta } from "@/lib/og";

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: "/methodology" },
  openGraph: {
    title: `${meta.title} — AirMilesCalc`,
    description: meta.description,
    url: "/methodology",
    type: "article",
    images: ogImageMeta({ title: meta.title, subtitle: meta.description, category: meta.category }),
  },
  twitter: twitterMeta({ title: meta.title, subtitle: meta.description, category: meta.category }),
};

export const revalidate = 86400; // one day

export default function MethodologyPage() {
  return (
    <ContentPageLayout
      meta={{
        title: meta.title,
        description: meta.description,
        url: "/methodology",
        updated: meta.updated,
        category: meta.category,
        readingTime: meta.readingTime,
        breadcrumbs: [
          { name: "Home", href: "/" },
          { name: "Methodology", href: "/methodology" },
        ],
      }}
    >
      <MethodologyContent />
    </ContentPageLayout>
  );
}
