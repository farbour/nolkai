import { ChartBarIcon, HeartIcon, SparklesIcon, UserGroupIcon } from '@heroicons/react/24/outline';

import React from 'react';

// file path: src/components/dashboard/BrandHealthScore.tsx

interface BrandHealth {
  name: string;
  overallScore: number;
  metrics: {
    revenue: number;
    growth: number;
    satisfaction: number;
    engagement: number;
  };
  trends: {
    revenueChange: number;
    growthChange: number;
    satisfactionChange: number;
    engagementChange: number;
  };
}

interface BrandHealthScoreProps {
  brand: BrandHealth;
}

export const BrandHealthScore: React.FC<BrandHealthScoreProps> = ({ brand }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const metrics = [
    {
      name: 'Revenue Performance',
      score: brand.metrics.revenue,
      change: brand.trends.revenueChange,
      icon: ChartBarIcon,
    },
    {
      name: 'Growth Rate',
      score: brand.metrics.growth,
      change: brand.trends.growthChange,
      icon: SparklesIcon,
    },
    {
      name: 'Customer Satisfaction',
      score: brand.metrics.satisfaction,
      change: brand.trends.satisfactionChange,
      icon: HeartIcon,
    },
    {
      name: 'Customer Engagement',
      score: brand.metrics.engagement,
      change: brand.trends.engagementChange,
      icon: UserGroupIcon,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Brand Health Score</h2>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(brand.overallScore)}`}>
            {brand.overallScore}/100
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          {metrics.map((metric) => (
            <div key={metric.name} className="flex items-center">
              <div className="w-12">
                <metric.icon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {metric.name}
                  </span>
                  <span className={`text-sm font-medium ${getScoreColor(metric.score)}`}>
                    {metric.score}/100
                  </span>
                </div>
                <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full rounded-full transition-all ${
                      metric.score >= 80 ? 'bg-green-500' :
                      metric.score >= 60 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${metric.score}%` }}
                  />
                </div>
                <div className="mt-1 flex items-center justify-end">
                  <span className={`text-xs ${getChangeColor(metric.change)}`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}% vs last month
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};