// file path: src/components/analysis/KPICard.tsx
import React, { useState } from 'react';

interface KPICardProps {
  title: string;
  value: number | string;
  comparisonValue?: number | string;
  unit: '%' | '$' | 'Number';
  description?: string;
}

export const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  comparisonValue, 
  unit,
  description = ''
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

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

  const calculateDifference = (): { 
    value: number; 
    isPositive: boolean;
    absoluteDiff: number | string;
    percentageChange: string;
    trend: string;
  } | null => {
    if (!comparisonValue || typeof value === 'string' || typeof comparisonValue === 'string') {
      return null;
    }

    const diff = value - comparisonValue;
    const percentage = (diff / comparisonValue) * 100;
    
    let absoluteDiff: number | string;
    if (unit === '$') {
      absoluteDiff = Math.abs(diff);
    } else if (unit === '%') {
      absoluteDiff = Math.abs(diff).toFixed(1) + '%';
    } else {
      absoluteDiff = Math.abs(diff);
    }

    return {
      value: Math.abs(percentage),
      isPositive: diff >= 0,
      absoluteDiff,
      percentageChange: percentage.toFixed(1) + '%',
      trend: diff >= 0 ? 'increase' : 'decrease'
    };
  };

  const difference = calculateDifference();

  const getTooltipContent = () => {
    const parts = [];
    
    // Add description if available
    if (description) {
      parts.push(description);
    }

    // Add current value
    parts.push(`Current value: ${formatValue(value)}`);

    // Add comparison details if available
    if (comparisonValue && difference) {
      parts.push(
        `Comparison value: ${formatValue(comparisonValue)}`,
        `Absolute ${difference.trend}: ${
          unit === '$' ? formatValue(difference.absoluteDiff) : difference.absoluteDiff
        }`,
        `Percentage ${difference.trend}: ${difference.percentageChange}`
      );
    }

    return parts.join('\n');
  };

  return (
    <div 
      className="bg-white rounded-lg shadow p-6 relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <h3 className="text-lg font-medium text-gray-600 mb-2 flex items-center">
        {title}
        <span className="ml-2 text-gray-400 cursor-help">ⓘ</span>
      </h3>
      <div className="flex flex-col space-y-2">
        <div className="flex items-baseline justify-between">
          <p className="text-4xl font-bold text-gray-900">
            {formatValue(value)}
          </p>
          {difference && (
            <span className={`text-sm font-medium ${difference.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {difference.isPositive ? '↑' : '↓'} {difference.value.toFixed(1)}%
            </span>
          )}
        </div>
        {comparisonValue && (
          <div className="flex items-baseline text-sm text-gray-500">
            <span>vs {formatValue(comparisonValue)}</span>
          </div>
        )}
      </div>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute z-10 w-72 p-4 bg-gray-900 text-white text-sm rounded-lg shadow-lg -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full">
          <div className="whitespace-pre-line">{getTooltipContent()}</div>
          {/* Arrow */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 rotate-45 bg-gray-900"></div>
        </div>
      )}
    </div>
  );
};