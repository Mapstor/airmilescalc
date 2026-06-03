import React from "react";
import Link from "next/link";

export type ContentMeta = {
  title: string;
  description: string;
  url: string;
  updated?: string;
  category?: string;
  breadcrumbs: { name: string; href: string }[];
  readingTime?: string;
};

// AuthorBio renders below the article on every MDX content page. Provides the
// named-author E-E-A-T signal Google Quality Rater Guidelines and AdSense
// reviewers look for: byline with avatar, role, scope of expertise, last-
// reviewed date, and a correction route.
function AuthorBio({ updated }: { updated?: string }) {
  return (
    <aside
      className="mt-14 pt-8 border-t border-slate-200 not-prose"
      aria-labelledby="author-bio-heading"
    >
      <div className="flex items-start gap-4">
        <div
          aria-hidden="true"
          className="flex-shrink-0 w-12 h-12 bg-[#0B2447] text-white rounded-full flex items-center justify-center font-semibold text-[14px] font-mono tracking-wider"
        >
          SK
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10.5px] font-mono uppercase tracking-wider text-slate-500 mb-1">
            Written and reviewed by
          </div>
          <div
            id="author-bio-heading"
            className="text-[16px] font-semibold text-[#0B2447] mb-1"
          >
            <Link
              href="/about"
              className="hover:underline underline-offset-2"
            >
              Sam K.
            </Link>
          </div>
          <p className="text-[13.5px] text-slate-600 leading-relaxed mb-2">
            Independent maintainer and sole editorial voice of AirMilesCalc.
            Researches every methodology and learn page against the primary
            sources cited inline. Editorial standards documented at{" "}
            <Link
              href="/editorial-process"
              className="text-blue-700 hover:underline underline-offset-2 font-medium"
            >
              /editorial-process
            </Link>
            ; accessibility commitments and known limitations at{" "}
            <Link
              href="/accessibility"
              className="text-blue-700 hover:underline underline-offset-2 font-medium"
            >
              /accessibility
            </Link>
            .
          </p>
          <div className="text-[11.5px] text-slate-500 font-mono">
            {updated && <>Sources last verified: {updated} &middot; </>}
            Found something to correct?{" "}
            <Link
              href="/contact"
              className="text-blue-700 hover:underline underline-offset-2"
            >
              info@airmilescalc.com
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function ContentPageLayout({
  meta,
  children,
}: {
  meta: ContentMeta;
  children: React.ReactNode;
}) {
  const ldArticle = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: meta.title,
    description: meta.description,
    url: `https://airmilescalc.com${meta.url}`,
    ...(meta.updated && { dateModified: meta.updated }),
    author: {
      "@type": "Organization",
      "@id": "https://airmilescalc.com/#organization",
    },
    publisher: {
      "@id": "https://airmilescalc.com/#organization",
    },
    inLanguage: "en",
  };
  const ldBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: meta.breadcrumbs.map((bc, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: bc.name,
      item: `https://airmilescalc.com${bc.href}`,
    })),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldBreadcrumb) }}
      />
      <div className="min-h-screen bg-[#FAFAF9] py-8 md:py-12">
        <div className="max-w-3xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="text-[12.5px] mb-6">
            <ol className="flex items-center gap-2 text-slate-600 flex-wrap">
              {meta.breadcrumbs.map((bc, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <li className="text-slate-400">/</li>}
                  <li>
                    {i === meta.breadcrumbs.length - 1 ? (
                      <span className="text-[#0B2447]">{bc.name}</span>
                    ) : (
                      <Link
                        href={bc.href}
                        className="hover:text-[#0B2447] transition-colors"
                      >
                        {bc.name}
                      </Link>
                    )}
                  </li>
                </React.Fragment>
              ))}
            </ol>
          </nav>

          {/* Category chip */}
          {meta.category && (
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-2">
              {meta.category}
            </div>
          )}

          {/* Title */}
          <h1 className="text-[28px] md:text-[34px] font-semibold text-[#0B2447] tracking-tight mb-4 leading-tight">
            {meta.title}
          </h1>

          {/* Description */}
          {meta.description && (
            <p className="text-[16.5px] text-slate-600 leading-snug mb-4 max-w-2xl">
              {meta.description}
            </p>
          )}

          {/* Meta line */}
          {(meta.updated || meta.readingTime) && (
            <div className="text-[12px] text-slate-500 mb-8 font-mono flex flex-wrap gap-x-4">
              {meta.updated && <span>Updated {meta.updated}</span>}
              {meta.readingTime && <span>{meta.readingTime} read</span>}
            </div>
          )}

          {/* Content */}
          <article>
            {children}
            <AuthorBio updated={meta.updated} />
          </article>
        </div>
      </div>
    </>
  );
}
