import type { MetadataRoute } from "next";

// PWA web app manifest. Served at /manifest.webmanifest via Next.js's App
// Router convention; the rel="manifest" link tag is auto-injected into <head>.
//
// Why this exists: without a manifest the site is not "installable" by the
// browser, mobile users cannot Add to Home Screen with an icon, and Lighthouse
// PWA criteria can't be met. The PNG icons referenced below are rasterised
// from src/app/icon.svg (the same airplane silhouette used in the header).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AirMilesCalc — Flight Distance Calculator",
    short_name: "AirMilesCalc",
    description:
      "Free flight distance calculator using Vincenty geodesic on WGS-84, with flight times and DEFRA 2024 CO₂ emissions.",
    start_url: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#FAFAF9",
    theme_color: "#0B2447",
    categories: ["travel", "navigation", "utilities", "productivity"],
    lang: "en-US",
    icons: [
      // Maskable + any-purpose PNGs at the two sizes Lighthouse + the Web App
      // Manifest spec recommend (192 minimum, 512 splash-screen).
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      // Scalable SVG for browsers that can use it (modern Chrome, Firefox).
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
