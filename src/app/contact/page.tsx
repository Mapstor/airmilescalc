import type { Metadata } from "next";
import ContactContent, { meta } from "@/data/content/contact.mdx";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";
import { ogImageMeta, twitterMeta } from "@/lib/og";

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `${meta.title} — AirMilesCalc`,
    description: meta.description,
    url: "/contact",
    type: "article",
    images: ogImageMeta({ title: meta.title, subtitle: meta.description, category: meta.category }),
  },
  twitter: twitterMeta({ title: meta.title, subtitle: meta.description, category: meta.category }),
};

export const revalidate = 86400;

export default function ContactPage() {
  return (
    <ContentPageLayout
      meta={{
        title: meta.title,
        description: meta.description,
        url: "/contact",
        updated: meta.updated,
        category: meta.category,
        readingTime: meta.readingTime,
        breadcrumbs: [
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ],
      }}
    >
      <ContactContent />
    </ContentPageLayout>
  );
}
