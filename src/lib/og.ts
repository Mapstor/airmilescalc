// Helper to build per-page OG image URLs that hit /api/og with custom title,
// subtitle, and category. Pass relative URL — Next.js's metadataBase resolves
// it against the production origin for crawlers.

// Site-wide brand constants that every per-route openGraph block must spread
// in. Next.js's Metadata API shallow-merges openGraph, so any per-page
// `openGraph: { ... }` block silently drops the layout-level `siteName` and
// `locale` unless the page re-declares them. Until that quirk is fixed
// upstream the only reliable workaround is to include both fields on every
// page. Helpers below do that automatically.
export const OG_SITE_NAME = "AirMilesCalc";
export const OG_LOCALE = "en_US";

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

// Returns the openGraph object additions that every per-page metadata block
// should spread in BEFORE its own `title` / `description` / `images` / `url`.
// This ensures siteName and locale survive the Next.js shallow merge.
//
// Usage:
//   openGraph: {
//     ...ogDefaults(),
//     title: "...",
//     description: "...",
//     url: "...",
//     type: "article",
//     images: ogImageMeta({ ... }),
//   },
export function ogDefaults() {
  return {
    siteName: OG_SITE_NAME,
    locale: OG_LOCALE,
  };
}

// Twitter Card metadata mirroring openGraph. Next.js's Metadata API does not
// fall back from openGraph to twitter automatically — each page that
// customises openGraph must also customise twitter for per-page Twitter Card
// previews to render correctly. Spread the return into the page's metadata:
//
//   export const metadata: Metadata = {
//     ...,
//     openGraph: { ...ogDefaults(), ..., images: ogImageMeta({...}) },
//     twitter: twitterMeta({...}),
//   };
//
// Note on titles: we deliberately do NOT append " — AirMilesCalc" to the
// twitter:title here. The page-level title from Next's Metadata template
// already gets the " | AirMilesCalc" suffix applied to twitter:title via
// Next's auto-derivation, and adding our own would produce a doubled brand.
// Callers should pass the page-specific title without a brand suffix.
export function twitterMeta(opts: {
  title: string;
  subtitle?: string;
  category?: string;
}) {
  return {
    card: "summary_large_image" as const,
    title: opts.title,
    description: opts.subtitle ?? "",
    images: [ogImageUrl(opts)],
  };
}
