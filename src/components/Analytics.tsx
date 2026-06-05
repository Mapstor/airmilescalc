"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

const GA_MEASUREMENT_ID = "G-2TLR2FTHT2";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

// Fires a GA4 page_view event on every Next.js App Router client-side
// navigation. Without this, gtag.js only counts the initial document load
// — every subsequent <Link> click is invisible to GA4 (which would make
// every session look like a one-page bounce). useSearchParams forces the
// component into a Suspense boundary per Next 14+ requirements.
function GAPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;
    const query = searchParams?.toString() ?? "";
    const page_path = pathname + (query ? `?${query}` : "");
    window.gtag("event", "page_view", {
      page_path,
      page_location: window.location.href,
      page_title: document.title,
      send_to: GA_MEASUREMENT_ID,
    });
  }, [pathname, searchParams]);

  return null;
}

export function Analytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      {/* send_page_view: false suppresses gtag.js's automatic initial
          pageview; GAPageView below fires the first (and every subsequent)
          page_view manually so we don't double-count on first load. */}
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });`}
      </Script>
      <Suspense fallback={null}>
        <GAPageView />
      </Suspense>
    </>
  );
}
