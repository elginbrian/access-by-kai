import React from 'react';

type Props = {
  icon: React.ReactNode;
  value: string;
  label: string;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
};

export default function StatCard({ icon, value, label, change, changeType = 'neutral' }: Props) {
  const changeColor = {
    increase: 'text-green-600',
    decrease: 'text-red-600',
    neutral: 'text-gray-600'
  }[changeType];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-50">
            {icon}
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{value}</div>
            <div className="text-sm text-gray-600">{label}</div>
          </div>
        </div>
        {change && (
          <div className={`text-sm font-medium ${changeColor}`}>
            {change}
          </div>
        )}
      </div>
    </div>
  );
}