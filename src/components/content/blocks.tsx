import React from "react";

// ============================================================================
// Sources — citation list at the top of every content page
// ============================================================================
export type Source = {
  id: number;
  label: string;
  note?: string;
  venue?: string;
  date?: string;
  url: string;
};

export function Sources({ items }: { items: Source[] }) {
  return (
    <details className="my-8 bg-stone-50 border border-stone-200 rounded-md not-prose">
      <summary className="cursor-pointer px-5 py-3 text-[12.5px] font-medium text-[#0B2447] uppercase tracking-wider">
        Primary sources · {items.length}
      </summary>
      <ol className="px-5 pb-4 pt-1 space-y-2.5 text-[12.5px] text-slate-700">
        {items.map((s) => (
          <li key={s.id} id={`src-${s.id}`} className="leading-snug">
            <span className="font-mono text-slate-500">[{s.id}]</span>{" "}
            <strong className="text-[#0B2447]">{s.label}</strong>
            {s.note && <span> — {s.note}</span>}
            {s.venue && <span className="text-slate-600"> · {s.venue}</span>}
            {s.date && <span className="text-slate-500"> · {s.date}</span>}{" "}
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:underline break-all"
            >
              {s.url}
            </a>
          </li>
        ))}
      </ol>
    </details>
  );
}

// ============================================================================
// Lede — short opening paragraph in a distinct style
// ============================================================================
export function Lede({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 text-[17px] md:text-[18px] leading-snug text-slate-800 border-l-2 border-[#0B2447] pl-5 italic not-prose">
      {children}
    </div>
  );
}

// ============================================================================
// KeyStats — big-number tiles
// ============================================================================
export type Stat = { value: string; label: string; source?: string };

export function KeyStats({ stats }: { stats: Stat[] }) {
  return (
    <div className="my-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 not-prose">
      {stats.map((s, i) => (
        <div
          key={i}
          className="bg-white border border-slate-200 rounded-md p-4"
        >
          <div className="text-[22px] font-semibold text-[#0B2447] tabular-nums tracking-tight leading-tight">
            {s.value}
          </div>
          <div className="text-[12.5px] text-slate-700 mt-1.5 leading-snug">
            {s.label}
          </div>
          {s.source && (
            <div className="text-[10.5px] text-slate-500 mt-2 font-mono uppercase tracking-wider">
              {s.source}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// DataTable — sourced table with caption
// ============================================================================
export type DataCell = string | number | React.ReactNode;
export type DataRow = DataCell[];

export function DataTable({
  caption,
  source,
  columns,
  rows,
  numericCols,
}: {
  caption?: string;
  source?: string;
  columns: string[];
  rows: DataRow[];
  numericCols?: number[];
}) {
  const isNumeric = (i: number) => numericCols?.includes(i) ?? false;
  return (
    <figure className="my-8 not-prose">
      {caption && (
        <figcaption className="text-[13px] font-medium text-[#0B2447] mb-2">
          {caption}
        </figcaption>
      )}
      <div className="overflow-x-auto bg-white border border-slate-200 rounded-md">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {columns.map((c, i) => (
                <th
                  key={i}
                  className={`px-4 py-2.5 font-semibold text-slate-700 whitespace-nowrap ${
                    isNumeric(i) ? "text-right" : "text-left"
                  }`}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`px-4 py-2.5 align-top ${
                      isNumeric(ci)
                        ? "text-right font-mono tabular-nums whitespace-nowrap"
                        : ""
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {source && (
        <div className="text-[11px] text-slate-500 mt-1.5 font-mono">
          Source: {source}
        </div>
      )}
    </figure>
  );
}

// ============================================================================
// BarChart — horizontal bar chart, inline SVG, no deps
// ============================================================================
export type BarDatum = { label: string; value: number; sub?: string };

export function BarChart({
  title,
  source,
  unit,
  data,
  max,
  color = "#0B2447",
  formatValue,
}: {
  title: string;
  source?: string;
  unit?: string;
  data: BarDatum[];
  max?: number;
  color?: string;
  formatValue?: (n: number) => string;
}) {
  const maxValue = max ?? Math.max(...data.map((d) => d.value));
  const rowHeight = 32;
  const labelWidth = 200;
  const chartWidth = 380;
  const valueWidth = 100;
  const totalWidth = labelWidth + chartWidth + valueWidth;
  const totalHeight = data.length * rowHeight + 24;

  const fmt = (n: number) =>
    formatValue
      ? formatValue(n)
      : Number.isInteger(n)
        ? n.toLocaleString()
        : n.toFixed(1);

  return (
    <figure className="my-8 bg-white border border-slate-200 rounded-md p-5 not-prose">
      <figcaption className="text-[13px] font-medium text-[#0B2447] mb-3">
        {title}
      </figcaption>
      <svg
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        className="w-full h-auto"
        role="img"
        aria-label={title}
        preserveAspectRatio="xMinYMin meet"
      >
        {data.map((d, i) => {
          const w = (d.value / maxValue) * chartWidth;
          const y = i * rowHeight + 12;
          return (
            <g key={i}>
              <text
                x={labelWidth - 10}
                y={y + 18}
                fontSize="12"
                fill="#374151"
                textAnchor="end"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
              >
                {d.label}
              </text>
              <rect
                x={labelWidth}
                y={y + 6}
                width={chartWidth}
                height={rowHeight - 12}
                fill="#F1F5F9"
              />
              <rect
                x={labelWidth}
                y={y + 6}
                width={w}
                height={rowHeight - 12}
                fill={color}
              />
              <text
                x={labelWidth + w + 6}
                y={y + 18}
                fontSize="12"
                fill="#0B2447"
                fontFamily="ui-monospace, SFMono-Regular, monospace"
              >
                {fmt(d.value)}
                {unit && (
                  <tspan fill="#64748B"> {unit}</tspan>
                )}
              </text>
            </g>
          );
        })}
      </svg>
      {source && (
        <div className="text-[11px] text-slate-500 mt-2 font-mono">
          Source: {source}
        </div>
      )}
    </figure>
  );
}

// ============================================================================
// Steps — numbered procedure list
// ============================================================================
export function Steps({ children }: { children: React.ReactNode }) {
  return <ol className="my-8 space-y-3 not-prose list-none pl-0">{children}</ol>;
}

export function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-4 bg-white border border-slate-200 rounded-md p-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0B2447] text-white text-[13px] font-semibold flex items-center justify-center font-mono">
        {n}
      </div>
      <div className="min-w-0">
        <div className="text-[14px] font-semibold text-[#0B2447] mb-1">
          {title}
        </div>
        <div className="text-[14px] text-slate-700 leading-relaxed">
          {children}
        </div>
      </div>
    </li>
  );
}

// ============================================================================
// Callout — note / definition / warning
// ============================================================================
export function Callout({
  type = "note",
  term,
  children,
}: {
  type?: "note" | "definition" | "warning";
  term?: string;
  children: React.ReactNode;
}) {
  const styles = {
    note: "bg-blue-50 border-l-blue-600 text-blue-950",
    definition: "bg-stone-50 border-l-stone-500 text-slate-800",
    warning: "bg-amber-50 border-l-amber-600 text-amber-950",
  };
  const labels = {
    note: "Note",
    definition: "Definition",
    warning: "Caution",
  };
  return (
    <aside
      className={`my-6 border-l-4 ${styles[type]} rounded-r-md p-4 not-prose`}
    >
      <div className="text-[10.5px] uppercase tracking-wider font-semibold opacity-70 mb-1.5 font-mono">
        {labels[type]}
        {term ? ` — ${term}` : ""}
      </div>
      <div className="text-[14px] leading-relaxed">{children}</div>
    </aside>
  );
}

// ============================================================================
// FAQ — collapsible with schema.org/FAQPage JSON-LD
// ============================================================================
export type FAQItem = { q: string; a: string | React.ReactNode };

function renderAnswerText(a: string | React.ReactNode): string {
  if (typeof a === "string") return a;
  return "";
}

export function FAQ({ items }: { items: FAQItem[] }) {
  const ldJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: renderAnswerText(item.a),
      },
    })),
  };
  return (
    <section className="my-10 not-prose">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
      />
      <h2 className="text-[22px] font-semibold text-[#0B2447] tracking-tight mb-4">
        Frequently asked
      </h2>
      <dl className="space-y-2">
        {items.map((it, i) => (
          <details
            key={i}
            className="bg-white border border-slate-200 rounded-md group"
          >
            <summary className="cursor-pointer px-4 py-3 text-[14.5px] font-semibold text-[#0B2447] flex items-center justify-between gap-3">
              <span>{it.q}</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0">
                ▾
              </span>
            </summary>
            <div className="px-4 pb-4 text-[14px] text-slate-700 leading-relaxed">
              {it.a}
            </div>
          </details>
        ))}
      </dl>
    </section>
  );
}

// ============================================================================
// InternalLinks — contextual related-content grid
// ============================================================================
export type InternalLink = {
  href: string;
  title: string;
  description?: string;
};

export function InternalLinks({
  heading = "Continue reading",
  links,
}: {
  heading?: string;
  links: InternalLink[];
}) {
  return (
    <section className="my-10 not-prose">
      <h2 className="text-[12.5px] font-semibold text-slate-500 uppercase tracking-wider mb-3">
        {heading}
      </h2>
      <div className="grid md:grid-cols-2 gap-3">
        {links.map((l, i) => (
          <a
            key={i}
            href={l.href}
            className="block bg-white border border-slate-200 rounded-md p-4 hover:border-[#0B2447] transition-colors group"
          >
            <div className="text-[14.5px] font-semibold text-[#0B2447] group-hover:underline underline-offset-2">
              {l.title}{" "}
              <span className="text-slate-400 group-hover:text-[#0B2447]">→</span>
            </div>
            {l.description && (
              <div className="text-[13px] text-slate-600 mt-1 leading-snug">
                {l.description}
              </div>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}
