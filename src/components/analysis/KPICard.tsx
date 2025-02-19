// file path: src/components/analysis/KPICard.tsx
import React from 'react';

interface KPICardProps {
  title: string;
  value: number | string;
  unit: '%' | '$' | 'Number';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, unit, trend }) => {
  const formatValue = (val: number | string): string => {
    if (typeof val === 'string') {
      return val;
    }

    switch (unit) {
      case '$':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      case '%':
        return val.toFixed(1) + '%';
      default:
        return val.toLocaleString();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-600 mb-2">{title}</h3>
      <div className="flex items-baseline">
        <p className="text-4xl font-bold text-gray-900">
          {formatValue(value)}
        </p>
        {trend && (
          <span className={`ml-2 text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value).toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
};