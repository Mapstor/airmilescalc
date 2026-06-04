import type { Metadata } from "next";
import TermsContent, { meta } from "@/data/content/terms.mdx";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";
import { ogDefaults, ogImageMeta, twitterMeta } from "@/lib/og";

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: "/terms" },
  openGraph: {
    ...ogDefaults(),
    title: meta.title,
    description: meta.description,
    url: "/terms",
    type: "article",
    images: ogImageMeta({ title: meta.title, subtitle: meta.description, category: meta.category }),
  },
  twitter: twitterMeta({ title: meta.title, subtitle: meta.description, category: meta.category }),
};

export const revalidate = 86400;

export default function TermsPage() {
  return (
    <ContentPageLayout
      meta={{
        title: meta.title,
        description: meta.description,
        url: "/terms",
        updated: meta.updated,
        category: meta.category,
        readingTime: meta.readingTime,
        pageType: "WebPage",
        breadcrumbs: [
          { name: "Home", href: "/" },
          { name: "Terms", href: "/terms" },
        ],
      }}
    >
      <TermsContent />
    </ContentPageLayout>
  );
}
