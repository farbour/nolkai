import { getChangeColor, getScoreColor } from '@/utils/styleUtils';

import React from 'react';

// file path: src/components/dashboard/BrandHealthMetric.tsx

interface BrandHealthMetricProps {
  name: string;
  score: number;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
}

export const BrandHealthMetric: React.FC<BrandHealthMetricProps> = ({
  name,
  score,
  change,
  icon: Icon
}) => {
  return (
    <div className="flex items-center">
      <div className="w-12">
        <Icon className="h-6 w-6 text-gray-400" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-900">
            {name}
          </span>
          <span className={`text-sm font-medium ${getScoreColor(score)}`}>
            {score}/100
          </span>
        </div>
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`absolute top-0 left-0 h-full rounded-full transition-all ${
              score >= 80 ? 'bg-green-500' :
              score >= 60 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
        <div className="mt-1 flex items-center justify-end">
          <span className={`text-xs ${getChangeColor(change)}`}>
            {change > 0 ? '+' : ''}{change}% vs last month
          </span>
        </div>
      </div>
    </div>
  );
};