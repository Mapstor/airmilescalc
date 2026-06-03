import type { MDXComponents } from "mdx/types";
import {
  Lede,
  Sources,
  KeyStats,
  DataTable,
  BarChart,
  Steps,
  Step,
  Callout,
  FAQ,
  InternalLinks,
} from "@/components/content/blocks";
import {
  DiagramGreatCircle,
  DiagramEllipsoidCrossSection,
  DiagramVincentyIteration,
} from "@/components/content/diagrams";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => (
      <h1
        className="text-[26px] md:text-[32px] font-semibold text-[#0B2447] tracking-tight mt-12 mb-4"
        {...props}
      />
    ),
    h2: (props) => (
      <h2
        className="text-[22px] md:text-[24px] font-semibold text-[#0B2447] tracking-tight mt-12 mb-3 scroll-mt-20"
        {...props}
      />
    ),
    h3: (props) => (
      <h3
        className="text-[17px] font-semibold text-[#0B2447] tracking-tight mt-8 mb-2"
        {...props}
      />
    ),
    p: (props) => (
      <p
        className="text-[15.5px] text-slate-700 leading-relaxed mb-4"
        {...props}
      />
    ),
    a: (props) => (
      <a
        className="text-blue-700 hover:underline underline-offset-2 font-medium"
        {...props}
      />
    ),
    ul: (props) => (
      <ul
        className="list-disc pl-6 mb-4 space-y-1.5 text-[15.5px] text-slate-700"
        {...props}
      />
    ),
    ol: (props) => (
      <ol
        className="list-decimal pl-6 mb-4 space-y-1.5 text-[15.5px] text-slate-700"
        {...props}
      />
    ),
    li: (props) => <li className="leading-relaxed" {...props} />,
    strong: (props) => (
      <strong className="text-[#0B2447] font-semibold" {...props} />
    ),
    em: (props) => <em className="italic" {...props} />,
    code: (props) => (
      <code
        className="font-mono text-[13.5px] bg-slate-100 text-[#0B2447] px-1.5 py-0.5 rounded"
        {...props}
      />
    ),
    blockquote: (props) => (
      <blockquote
        className="border-l-4 border-slate-300 pl-4 my-5 text-slate-600 italic"
        {...props}
      />
    ),
    hr: () => <hr className="my-10 border-slate-200" />,
    // Custom block components
    Lede,
    Sources,
    KeyStats,
    DataTable,
    BarChart,
    Steps,
    Step,
    Callout,
    FAQ,
    InternalLinks,
    DiagramGreatCircle,
    DiagramEllipsoidCrossSection,
    DiagramVincentyIteration,
    ...components,
  };
}
