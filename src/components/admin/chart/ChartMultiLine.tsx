import React from 'react';

type Series = {
  id: string;
  name?: string;
  color?: string;
  values: number[]; // numeric values for each x tick
};

type Props = {
  width?: number;
  height?: number;
  padding?: { top: number; right: number; bottom: number; left: number };
  xLabels: string[];
  yTicks?: number[]; // optional explicit y ticks
  series: Series[];
  title?: string;
  showLegend?: boolean;
};

// Simple helper to compute path from values
function buildPath(values: number[], xStep: number, yScale: (v: number) => number) {
  return values
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * xStep} ${yScale(v)}`)
    .join(' ');
}

export default function ChartMultiLine({
  width = 680,
  height = 260,
  padding = { top: 28, right: 20, bottom: 36, left: 46 },
  xLabels,
  yTicks,
  series,
  title,
  showLegend = true,
}: Props) {
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  // determine y domain
  const allValues = series.flatMap((s) => s.values);
  const yMin = Math.min(...allValues, 0);
  const yMax = Math.max(...allValues, 100);

  // default ticks
  const ticks = yTicks ?? [0, 25, 50, 75, 100];

  const yScale = (v: number) => {
    // flip y for SVG coordinate system
    const t = (v - yMin) / (yMax - yMin || 1);
    return padding.top + innerH - t * innerH;
  };

  const xStep = innerW / Math.max(1, xLabels.length - 1);

  return (
    <svg width={width} height={height} className="block">
      {title && (
        <text x={padding.left + innerW / 2} y={16} fontSize={14} textAnchor="middle" fill="#1f2937">
          {title}
        </text>
      )}

      {/* horizontal grid lines and Y labels */}
      <g>
        {ticks.map((t) => {
          const y = yScale(t);
          return (
            <g key={t}>
              <line x1={padding.left} x2={padding.left + innerW} y1={y} y2={y} stroke="#e6e7ea" strokeWidth={1} />
              <text x={padding.left - 8} y={y + 4} fontSize={11} textAnchor="end" fill="#6b7280">
                {t}
              </text>
            </g>
          );
        })}
      </g>

      {/* x labels */}
      <g>
        {xLabels.map((lab, i) => (
          <text key={i} x={padding.left + i * xStep} y={padding.top + innerH + 20} fontSize={11} textAnchor="middle" fill="#6b7280">
            {lab}
          </text>
        ))}
      </g>

      {/* lines */}
      <g transform={`translate(${padding.left},0)`}>
        {series.map((s) => {
          const path = buildPath(s.values, xStep, (v) => yScale(v));
          return (
            <g key={s.id}>
              <path d={path} fill="none" stroke={s.color ?? '#2563eb'} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
              {/* small circles */}
              {s.values.map((v, i) => (
                <circle key={i} cx={i * xStep} cy={yScale(v)} r={3} fill={s.color ?? '#2563eb'} />
              ))}
            </g>
          );
        })}
      </g>

      {/* legend */}
      {showLegend && (
        <g transform={`translate(${padding.left}, ${padding.top + innerH + 36})`}>
          {series.map((s, i) => (
            <g key={s.id} transform={`translate(${i * 120},0)`}>
              <rect x={0} y={-8} width={12} height={6} fill={s.color ?? '#2563eb'} rx={2} />
              <text x={18} y={-2} fontSize={12} fill="#374151">
                {s.name ?? s.id}
              </text>
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}

// Example usage data for Occupancy and Rating charts
export const OccupancyExample = (props?: Partial<Props>) => (
  <ChartMultiLine
    xLabels={["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]}
    series={[
      { id: 'sancaka', name: 'KA Sancaka', color: '#6d28d9', values: [45, 52, 34, 38, 60, 82, 90] },
      { id: 'lawu', name: 'KA Argo Lawu', color: '#059669', values: [60, 68, 72, 70, 76, 80, 90] },
      { id: 'taksaka', name: 'KA Taksaka', color: '#f59e0b', values: [85, 88, 92, 90, 93, 98, 95] },
    ]}
    title="Okupansi Harian (%)"
    {...props}
  />
);

export const RatingExample = (props?: Partial<Props>) => (
  <ChartMultiLine
    xLabels={["22 Okt", "23 Okt", "24 Okt", "25 Okt", "26 Okt", "27 Okt", "28 Okt"]}
    series={[{ id: 'rating', name: 'Rating', color: '#f59e0b', values: [4.1, 4.3, 4.0, 4.2, 4.1, 4.4, 4.2] }]}
    title="Tren Rating Harian"
    yTicks={[0, 2, 4, 6]}
    {...props}
  />
);
