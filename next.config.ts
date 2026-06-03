import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import path from "node:path";

const projectRoot = path.resolve(__dirname);

// Security headers applied site-wide. Vercel auto-adds Strict-Transport-Security
// on production but does not add the four content-level hardening headers
// below — they have to be opted into here. CSP intentionally omitted at this
// stage; it will land with the AdSense rollout so the allowlist can be set in
// one go (will need *.googlesyndication.com, *.doubleclick.net, *.google.com).
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  // better-sqlite3 has native bindings — Vercel rebuilds them at deploy time
  // when the package is marked as a server-external. Without this Vercel
  // tries to bundle the native .node file and the build fails.
  serverExternalPackages: ["better-sqlite3"],
  outputFileTracingRoot: projectRoot,
  // CRITICAL FOR VERCEL: every server function that reads the SQLite data
  // needs the .sqlite file shipped alongside it. Without this entry, Next's
  // automatic file tracing misses the runtime path.join(cwd, 'database.sqlite')
  // call, the file is left out of the function bundle, and every database
  // query returns SQLITE_CANTOPEN at runtime. The wildcard scope covers the
  // sitemap, every dynamic route, and every API handler that uses getDb().
  outputFileTracingIncludes: {
    "/**/*": ["./database.sqlite"],
  },
  turbopack: {
    root: projectRoot,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      // Short-form distance slug (lhr-jfk) → canonical long form (lhr-to-jfk).
      // The route handler at src/app/distance/[route]/page.tsx only accepts
      // the long form; without this redirect any external link that omits the
      // "-to-" connector 404s. The regex constraint means this rule fires
      // only on the 3-char-3-char short form, not the 3-char-to-3-char long
      // form, so the canonical URL never round-trips through a redirect.
      {
        source: "/distance/:from([a-z]{3})-:to([a-z]{3})",
        destination: "/distance/:from-to-:to",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
