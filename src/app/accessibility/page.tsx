import type { Metadata } from "next";
import AccessibilityContent, {
  meta,
} from "@/data/content/accessibility.mdx";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";
import { ogDefaults, ogImageMeta, twitterMeta } from "@/lib/og";

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: "/accessibility" },
  openGraph: {
    ...ogDefaults(),
    title: meta.title,
    description: meta.description,
    url: "/accessibility",
    type: "article",
    images: ogImageMeta({
      title: meta.title,
      subtitle: meta.description,
      category: "Policy",
    }),
  },
  twitter: twitterMeta({ title: meta.title, subtitle: meta.description, category: "Policy" }),
};

export const revalidate = 86400;

export default function AccessibilityPage() {
  return (
    <ContentPageLayout
      meta={{
        title: meta.title,
        description: meta.description,
        url: "/accessibility",
        updated: meta.updated,
        category: meta.category,
        readingTime: meta.readingTime,
        pageType: "WebPage",
        breadcrumbs: [
          { name: "Home", href: "/" },
          { name: "Accessibility", href: "/accessibility" },
        ],
      }}
    >
      <AccessibilityContent />
    </ContentPageLayout>
  );
}
