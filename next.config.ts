import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import path from "node:path";

const projectRoot = path.resolve(__dirname);

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
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
