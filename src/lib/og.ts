// Helper to build per-page OG image URLs that hit /api/og with custom title,
// subtitle, and category. Pass relative URL — Next.js's metadataBase resolves
// it against the production origin for crawlers.

export function ogImageUrl(opts: {
  title: string;
  subtitle?: string;
  category?: string;
}): string {
  const params = new URLSearchParams();
  params.set("title", opts.title);
  if (opts.subtitle) params.set("subtitle", opts.subtitle);
  if (opts.category) params.set("category", opts.category);
  return `/api/og?${params.toString()}`;
}

export function ogImageMeta(opts: {
  title: string;
  subtitle?: string;
  category?: string;
}) {
  return [
    {
      url: ogImageUrl(opts),
      width: 1200,
      height: 630,
      alt: opts.title,
    },
  ];
}

// Twitter Card metadata mirroring openGraph. Next.js's Metadata API does not
// fall back from openGraph to twitter automatically — each page that
// customises openGraph must also customise twitter for per-page Twitter Card
// previews to render correctly. Spread the return into the page's metadata:
//
//   export const metadata: Metadata = {
//     ...,
//     openGraph: { ..., images: ogImageMeta({...}) },
//     twitter: twitterMeta({...}),
//   };
export function twitterMeta(opts: {
  title: string;
  subtitle?: string;
  category?: string;
}) {
  return {
    card: "summary_large_image" as const,
    title: `${opts.title} — AirMilesCalc`,
    description: opts.subtitle ?? "",
    images: [ogImageUrl(opts)],
  };
}
