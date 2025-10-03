import React, { useMemo, useState } from 'react';

type Slice = {
  label: string;
  value: number;
  color: string;
};

type Props = {
  data: Slice[];
  size?: number; // diameter
  innerRadius?: number; // for donut
};

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  const d = [
    `M ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    `L ${cx} ${cy}`,
    'Z',
  ].join(' ');
  return d;
}

export default function ChartPie({ data, size = 320, innerRadius = 80 }: Props) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const total = data.reduce((s, d) => s + d.value, 0) || 1;

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 8;

  const slices = useMemo(() => {
    let start = 0;
    return data.map((d) => {
      const angle = (d.value / total) * 360;
      const seg = { start, end: start + angle, ...d };
      start += angle;
      return seg;
    });
  }, [data, total]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="text-sm text-gray-700 mb-3">Distribusi Rating (7 Hari Terakhir)</div>
      <div className="flex items-center gap-6">
        <svg width={size} height={size}>
          <defs>
            <mask id="hole">
              <rect x="0" y="0" width={size} height={size} fill="white" />
              <circle cx={cx} cy={cy} r={innerRadius} fill="black" />
            </mask>
          </defs>

          {slices.map((s, i) => {
            const large = s.end - s.start > 180 ? 1 : 0;
            const path = describeArc(cx, cy, r, s.start, s.end);
            const isHover = hoverIndex === i;
            const offset = isHover ? 8 : 0;
            // compute centroid for simple translation outward
            const mid = (s.start + s.end) / 2;
            const ang = ((mid - 90) * Math.PI) / 180;
            const dx = Math.cos(ang) * offset;
            const dy = Math.sin(ang) * offset;
            return (
              <g key={s.label} transform={`translate(${dx},${dy})`}>
                <path d={path} fill={s.color} opacity={isHover ? 0.95 : 1} onMouseEnter={() => setHoverIndex(i)} onMouseLeave={() => setHoverIndex(null)} />
                {/* hole to simulate donut */}
              </g>
            );
          })}

          {/* inner hole cover */}
          <circle cx={cx} cy={cy} r={innerRadius} fill="#fff" />

          {/* center label when hovered */}
          {hoverIndex !== null && (
            <text x={cx} y={cy} textAnchor="middle" dy={4} fontSize={14} fill="#333">
              {data[hoverIndex].label}: {data[hoverIndex].value}
            </text>
          )}
        </svg>

        <div className="flex-1">
          <div className="grid grid-cols-2 gap-2">
            {data.map((d, i) => (
              <div key={d.label} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full inline-block" style={{ background: d.color }} />
                <div className="text-sm">
                  <div className="font-medium">{d.label}</div>
                  <div className="text-xs text-gray-500">{d.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
