import { MetadataRoute } from "next";

// Robots policy. Three concerns:
//   1. Standard crawlers (Googlebot, Bingbot, etc.) inherit the wildcard rule.
//   2. Reputable AI training / search crawlers are EXPLICITLY allowed so the
//      site shows up in ChatGPT, Perplexity, Claude, Google AI Overviews, and
//      Apple Intelligence answers. The wildcard alone would let them in, but
//      enumerating them documents the operator's deliberate AI-visibility
//      policy (a signal AdSense reviewers and legal teams look for).
//   3. Aggressive content scrapers (CCBot, Bytespider, Diffbot, ClaudeBot
//      historically) are NOT individually disallowed here — the wildcard
//      Allow: / covers them, and we want the visibility. If specific bots
//      misbehave they can be added with a Disallow rule below.
const AI_CRAWLERS = [
  "GPTBot",            // OpenAI training crawler
  "ChatGPT-User",      // ChatGPT browse-mode user-agent
  "OAI-SearchBot",     // OpenAI search index crawler
  "Google-Extended",   // Google AI training (Gemini, Vertex)
  "ClaudeBot",         // Anthropic training crawler
  "Claude-Web",        // Claude in-product browse user-agent
  "anthropic-ai",      // Anthropic legacy UA string
  "PerplexityBot",     // Perplexity search crawler
  "Perplexity-User",   // Perplexity user-agent for in-answer fetches
  "applebot-extended", // Apple Intelligence training crawler
  "CCBot",             // Common Crawl (feeds many downstream training sets)
  "Bytespider",        // ByteDance / Doubao training crawler
  "cohere-ai",         // Cohere
  "Meta-ExternalAgent", // Meta external agent (LLaMA training, etc.)
  "FacebookBot",       // Facebook page-link previews
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default rule — everything is allowed except API endpoints (those serve
      // JSON or images; no need to index them in a SERP).
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      // Explicit per-bot rules for the AI crawlers. Same effective policy as
      // the wildcard, but enumerated so the file documents the AI policy
      // explicitly for human reviewers, search consoles, and audit trails.
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/api/"],
      })),
    ],
    sitemap: "https://airmilescalc.com/sitemap.xml",
    host: "https://airmilescalc.com",
  };
}
