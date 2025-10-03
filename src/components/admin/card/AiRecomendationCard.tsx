import React from 'react';

type Item = {
  text: string;
  tone?: 'info' | 'warning' | 'danger' | 'success';
};

type Props = {
  title: string;
  subtitle?: string;
  items?: Item[];
  cta?: { label: string; onClick?: () => void; variant?: 'primary' | 'secondary' };
  badge?: string; // small badge text on the right
  accentColor?: string; // border/accent color
  icon?: React.ReactNode; // optional leading icon
};

export default function AiRecomendationCard({ title, subtitle, items = [], cta, badge, accentColor = '#7b5cff', icon }: Props) {
  const toneColor = (tone?: string) => {
    switch (tone) {
      case 'warning':
        return '#f6c94d';
      case 'danger':
        return '#ef4444';
      case 'success':
        return '#10b981';
      default:
        return '#22c55e';
    }
  };

  return (
    <div className="relative bg-white rounded-lg shadow-sm p-6" style={{ borderLeft: `6px solid ${accentColor}` }}>
      {badge && <div className="absolute right-6 top-6 bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-600">{badge}</div>}

      <div className="flex items-start gap-4">
        <div className="mt-1">{icon ?? <div className="w-8 h-8 rounded-full bg-gray-100" />}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-800">{title}</h3>
          </div>
          {subtitle && <p className="text-sm text-gray-600 mt-2">{subtitle}</p>}

          <div className="mt-4 space-y-3">
            {items.map((it, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="mt-1">
                  <span className="w-3 h-3 rounded-full inline-block" style={{ background: toneColor(it.tone) }} />
                </div>
                <div className="text-sm text-gray-700">{it.text}</div>
              </div>
            ))}
          </div>

          {cta && (
            <div className="mt-6">
              <button
                onClick={cta.onClick}
                className={`px-4 py-2 rounded-md text-white ${cta.variant === 'secondary' ? 'bg-gray-500' : 'bg-purple-600'}`}
              >
                {cta.label}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
