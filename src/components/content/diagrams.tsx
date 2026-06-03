import React from "react";

// ============================================================================
// DiagramGreatCircle — Mercator-projected world with great-circle vs rhumb
// Shows JFK → HKG (about 13,000 km, dramatic polar curve on Mercator)
// ============================================================================
export function DiagramGreatCircle({
  caption = "Great-circle (curved on Mercator) vs rhumb line (straight on Mercator) — JFK to Hong Kong",
  source,
}: {
  caption?: string;
  source?: string;
}) {
  return (
    <figure className="my-8 bg-white border border-slate-200 rounded-md p-5 not-prose">
      <figcaption className="text-[13px] font-medium text-[#0B2447] mb-3">
        {caption}
      </figcaption>
      <svg
        viewBox="0 0 720 360"
        className="w-full h-auto"
        role="img"
        aria-label={caption}
      >
        {/* Mercator-style world rectangle */}
        <rect width="720" height="360" fill="#F8FAFC" />
        {/* Grid: meridians every 30°, parallels every 30° */}
        {[0, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720].map(
          (x) => (
            <line
              key={`m${x}`}
              x1={x}
              y1={0}
              x2={x}
              y2={360}
              stroke="#E2E8F0"
              strokeWidth="0.5"
            />
          ),
        )}
        {[60, 120, 180, 240, 300].map((y) => (
          <line
            key={`p${y}`}
            x1={0}
            y1={y}
            x2={720}
            y2={y}
            stroke="#E2E8F0"
            strokeWidth="0.5"
          />
        ))}
        {/* Equator */}
        <line
          x1={0}
          y1={180}
          x2={720}
          y2={180}
          stroke="#CBD5E1"
          strokeWidth="1"
        />
        {/* Continents stub — schematic blobs */}
        <path
          d="M 50 100 Q 80 80 130 90 Q 170 95 200 130 Q 200 170 170 180 Q 120 175 80 165 Q 60 140 50 100 Z"
          fill="#E2E8F0"
          opacity="0.7"
        />
        <path
          d="M 320 80 Q 380 60 460 90 Q 520 110 560 100 Q 600 110 640 130 Q 640 170 600 175 Q 540 180 480 175 Q 420 165 360 140 Q 320 110 320 80 Z"
          fill="#E2E8F0"
          opacity="0.7"
        />
        <path
          d="M 220 200 Q 260 195 290 215 Q 295 245 270 270 Q 230 270 215 240 Q 215 215 220 200 Z"
          fill="#E2E8F0"
          opacity="0.7"
        />
        {/* JFK ~ (40.6°N, 73.8°W) → x ≈ 212, y ≈ 120 on 720×360 Mercator with prime-meridian at 360 */}
        {/* HKG ~ (22.3°N, 114.2°E) → x ≈ 588, y ≈ 152 */}
        {/* Rhumb line: straight on Mercator */}
        <line
          x1={212}
          y1={120}
          x2={588}
          y2={152}
          stroke="#94A3B8"
          strokeWidth="1.6"
          strokeDasharray="4 4"
        />
        {/* Great-circle: arc that bulges north over the pole */}
        <path
          d="M 212 120 Q 400 25 588 152"
          fill="none"
          stroke="#0B2447"
          strokeWidth="2.2"
        />
        {/* Endpoint markers */}
        <circle cx={212} cy={120} r="4.5" fill="#0B2447" />
        <circle cx={588} cy={152} r="4.5" fill="#0B2447" />
        <text x={194} y={108} fontSize="11" fill="#0B2447" fontWeight="600">
          JFK
        </text>
        <text x={596} y={147} fontSize="11" fill="#0B2447" fontWeight="600">
          HKG
        </text>
        {/* Legend */}
        <g transform="translate(20 320)">
          <line
            x1={0}
            y1={5}
            x2={26}
            y2={5}
            stroke="#0B2447"
            strokeWidth="2.2"
          />
          <text x={32} y={9} fontSize="11" fill="#0B2447">
            Great-circle (≈ 12,983 km, what aircraft fly)
          </text>
          <line
            x1={0}
            y1={22}
            x2={26}
            y2={22}
            stroke="#94A3B8"
            strokeWidth="1.6"
            strokeDasharray="4 4"
          />
          <text x={32} y={26} fontSize="11" fill="#475569">
            Rhumb line (≈ 15,200 km, constant compass bearing)
          </text>
        </g>
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
// DiagramEllipsoidCrossSection — circle (sphere) vs ellipse (WGS-84)
// Shows the 21 km flattening at the poles
// ============================================================================
export function DiagramEllipsoidCrossSection({
  caption = "WGS-84 ellipsoid vs perfect sphere — the polar flattening exaggerated for clarity",
  source = "NGA.STND.0036_1.0.0_WGS84 (2014)",
}: {
  caption?: string;
  source?: string;
}) {
  // Exaggerate flattening: real f = 1/298, draw f ≈ 1/15 so the ellipse is visibly distinct
  return (
    <figure className="my-8 bg-white border border-slate-200 rounded-md p-5 not-prose">
      <figcaption className="text-[13px] font-medium text-[#0B2447] mb-3">
        {caption}
      </figcaption>
      <svg
        viewBox="0 0 600 320"
        className="w-full h-auto"
        role="img"
        aria-label={caption}
      >
        {/* Axes */}
        <line
          x1={300}
          y1={20}
          x2={300}
          y2={300}
          stroke="#CBD5E1"
          strokeWidth="0.8"
          strokeDasharray="3 4"
        />
        <line
          x1={50}
          y1={160}
          x2={550}
          y2={160}
          stroke="#CBD5E1"
          strokeWidth="0.8"
          strokeDasharray="3 4"
        />
        {/* Sphere outline (dashed) */}
        <circle
          cx={300}
          cy={160}
          r={130}
          fill="none"
          stroke="#94A3B8"
          strokeWidth="1.5"
          strokeDasharray="5 4"
        />
        {/* Ellipsoid (solid) — flattened on vertical */}
        <ellipse
          cx={300}
          cy={160}
          rx={130}
          ry={122}
          fill="rgba(11,36,71,0.06)"
          stroke="#0B2447"
          strokeWidth="2"
        />
        {/* Equatorial radius label */}
        <line
          x1={300}
          y1={160}
          x2={430}
          y2={160}
          stroke="#0B2447"
          strokeWidth="1.6"
        />
        <text x={335} y={154} fontSize="11" fill="#0B2447" fontWeight="600">
          a = 6,378,137 m (equatorial)
        </text>
        {/* Polar radius label */}
        <line
          x1={300}
          y1={160}
          x2={300}
          y2={38}
          stroke="#0B2447"
          strokeWidth="1.6"
        />
        <text x={306} y={70} fontSize="11" fill="#0B2447" fontWeight="600">
          b = 6,356,752.314 m
        </text>
        <text x={306} y={84} fontSize="11" fill="#0B2447" fontWeight="600">
          (polar)
        </text>
        {/* Diff annotation */}
        <text x={306} y={102} fontSize="10" fill="#64748B">
          a − b ≈ 21.4 km
        </text>
        {/* Pole markers */}
        <text x={290} y={32} fontSize="10" fill="#0B2447">
          N
        </text>
        <text x={290} y={296} fontSize="10" fill="#0B2447">
          S
        </text>
        {/* Legend */}
        <g transform="translate(40 285)">
          <line
            x1={0}
            y1={5}
            x2={26}
            y2={5}
            stroke="#0B2447"
            strokeWidth="2"
          />
          <text x={32} y={9} fontSize="11" fill="#0B2447">
            WGS-84 ellipsoid (flattening exaggerated)
          </text>
          <line
            x1={0}
            y1={22}
            x2={26}
            y2={22}
            stroke="#94A3B8"
            strokeWidth="1.5"
            strokeDasharray="5 4"
          />
          <text x={32} y={26} fontSize="11" fill="#475569">
            Reference sphere (Haversine assumption)
          </text>
        </g>
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
// DiagramVincentyIteration — schematic of the iterative λ convergence
// ============================================================================
export function DiagramVincentyIteration({
  caption = "Vincenty inverse iteration — λ converges typically in 4–8 steps for non-antipodal pairs",
  source,
}: {
  caption?: string;
  source?: string;
}) {
  const samples = [
    { iter: 0, lambda: 1.3 },
    { iter: 1, lambda: 0.7 },
    { iter: 2, lambda: 0.15 },
    { iter: 3, lambda: 0.02 },
    { iter: 4, lambda: 0.002 },
    { iter: 5, lambda: 0.00008 },
    { iter: 6, lambda: 0.0000003 },
  ];
  // Plot |λ − L| residual on log scale
  const W = 540;
  const H = 220;
  const padL = 70;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const xFor = (i: number) =>
    padL + (i / (samples.length - 1)) * innerW;
  const yFor = (v: number) => {
    // log scale: residual from 10⁻⁸ to 10
    const logV = Math.log10(Math.max(v, 1e-9));
    const top = 1; // 10¹
    const bot = -8; // 10⁻⁸
    const norm = (top - logV) / (top - bot);
    return padT + norm * innerH;
  };
  const linePath = samples
    .map((s, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(s.lambda)}`)
    .join(" ");
  return (
    <figure className="my-8 bg-white border border-slate-200 rounded-md p-5 not-prose">
      <figcaption className="text-[13px] font-medium text-[#0B2447] mb-3">
        {caption}
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img">
        {/* Grid lines */}
        {[-8, -6, -4, -2, 0].map((logV) => {
          const v = Math.pow(10, logV);
          return (
            <g key={logV}>
              <line
                x1={padL}
                y1={yFor(v)}
                x2={W - padR}
                y2={yFor(v)}
                stroke="#E2E8F0"
                strokeWidth="0.6"
                strokeDasharray="3 3"
              />
              <text
                x={padL - 6}
                y={yFor(v) + 3}
                fontSize="10"
                fill="#64748B"
                textAnchor="end"
                fontFamily="ui-monospace, monospace"
              >
                10{logV < 0 ? `⁻${Math.abs(logV)}` : logV === 0 ? "⁰" : `^${logV}`}
              </text>
            </g>
          );
        })}
        {/* Convergence threshold line */}
        <line
          x1={padL}
          y1={yFor(1e-12)}
          x2={W - padR}
          y2={yFor(1e-12)}
          stroke="#D97706"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <text
          x={W - padR}
          y={yFor(1e-8) + 4}
          fontSize="10"
          fill="#D97706"
          textAnchor="end"
        >
          tolerance 10⁻¹² rad
        </text>
        {/* X axis labels */}
        {samples.map((s, i) => (
          <text
            key={i}
            x={xFor(i)}
            y={H - padB + 15}
            fontSize="10"
            fill="#475569"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
          >
            {s.iter}
          </text>
        ))}
        <text
          x={padL + innerW / 2}
          y={H - 6}
          fontSize="11"
          fill="#0B2447"
          textAnchor="middle"
        >
          iteration
        </text>
        <text
          x={20}
          y={padT + innerH / 2}
          fontSize="11"
          fill="#0B2447"
          textAnchor="middle"
          transform={`rotate(-90 20 ${padT + innerH / 2})`}
        >
          |λᵢ − λᵢ₋₁| (rad)
        </text>
        {/* Line */}
        <path d={linePath} fill="none" stroke="#0B2447" strokeWidth="2" />
        {samples.map((s, i) => (
          <circle
            key={i}
            cx={xFor(i)}
            cy={yFor(s.lambda)}
            r="3.5"
            fill="#0B2447"
          />
        ))}
      </svg>
      {source && (
        <div className="text-[11px] text-slate-500 mt-2 font-mono">
          Source: {source}
        </div>
      )}
    </figure>
  );
}
