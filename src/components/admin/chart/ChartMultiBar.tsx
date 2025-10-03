import React from 'react';

type Series = {
  name: string;
  color: string;
  values: number[]; // values per category
};

type Props = {
  categories: string[]; // x axis labels
  series: Series[]; // stacked or single
  height?: number;
  width?: number;
};

// A small helper to compute stacked heights per category
function computeStacks(series: Series[]) {
  if (!series || series.length === 0) return [];
  const len = series[0].values.length;
  const stacks: number[][] = Array.from({ length: len }, () => []);
  for (let i = 0; i < len; i++) {
    let cum = 0;
    for (let s = 0; s < series.length; s++) {
      const v = series[s].values[i] ?? 0;
      stacks[i].push(v);
      cum += v;
    }
  }
  return stacks;
}

export default function ChartMultiBar({ categories, series, height = 320, width = 600 }: Props) {
  // compute totals per category to determine scale
  const totals = categories.map((_, i) => series.reduce((acc, s) => acc + (s.values[i] ?? 0), 0));
  const max = Math.max(...totals, 1);
  const paddingLeft = 60;
  const paddingBottom = 40;
  const paddingTop = 24;

  const chartWidth = width - paddingLeft - 20;
  const chartHeight = height - paddingTop - paddingBottom;

  const barWidth = Math.max(18, Math.floor(chartWidth / (categories.length * 1.5)));
  const gap = Math.floor((chartWidth - categories.length * barWidth) / Math.max(1, categories.length - 1));

  // build stacked segments for each category
  const stacks = computeStacks(series);

  // helper to map value -> y coordinate
  const valueToY = (v: number) => paddingTop + chartHeight - (v / max) * chartHeight;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="text-sm text-gray-700 mb-3">Jumlah Penumpang per Hari</div>
      <div className="flex">
        <svg width={width} height={height}>
          {/* Y grid lines and labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((t, idx) => {
            const y = paddingTop + chartHeight - t * chartHeight;
            const value = Math.round(max * t);
            return (
              <g key={idx}>
                <line x1={paddingLeft} x2={width - 20} y1={y} y2={y} stroke="#e6e6e6" />
                <text x={paddingLeft - 10} y={y + 4} textAnchor="end" fontSize={12} fill="#333">
                  {value}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {categories.map((cat, i) => {
            const x = paddingLeft + i * (barWidth + gap);
            // for stacking, draw from bottom up
            let cum = 0;
            return (
              <g key={cat}>
                {series.map((s, si) => {
                  const v = s.values[i] ?? 0;
                  const y0 = valueToY(cum + v);
                  const y1 = valueToY(cum);
                  const h = Math.max(0, y1 - y0);
                  const rect = (
                    <rect
                      key={s.name + si}
                      x={x}
                      y={y0}
                      width={barWidth}
                      height={h}
                      fill={s.color}
                      rx={4}
                    />
                  );
                  cum += v;
                  return rect;
                })}

                {/* category label */}
                <text x={x + barWidth / 2} y={paddingTop + chartHeight + 18} fontSize={12} fill="#333" textAnchor="middle">
                  {cat}
                </text>
              </g>
            );
          })}

          {/* X axis line */}
          <line x1={paddingLeft} x2={width - 20} y1={paddingTop + chartHeight} y2={paddingTop + chartHeight} stroke="#999" />
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4">
        {series.map((s) => (
          <div key={s.name} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full inline-block" style={{ background: s.color }} />
            <span className="text-sm">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
