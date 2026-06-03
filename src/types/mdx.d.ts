// Type declaration for MDX content files imported with the @next/mdx loader.
//
// `@types/mdx` ships a default declaration for `*.mdx` that exports only a
// React component as default. Our content pages also `export const meta = {...}`
// at the top of each MDX file (the routing layer reads this for the page title,
// description, OG fields, and updated date), so we extend the module shape
// here to surface that named export to the TypeScript checker.
//
// If you add new fields to any MDX `meta` block, mirror them here.

declare module "*.mdx" {
  import type { ComponentType } from "react";

  export const meta: {
    title: string;
    description: string;
    category?: string;
    updated?: string;
    readingTime?: string;
  };

  const MDXComponent: ComponentType<Record<string, unknown>>;
  export default MDXComponent;
}
