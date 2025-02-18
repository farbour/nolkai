import { ChartBarIcon, HeartIcon, SparklesIcon, UserGroupIcon } from '@heroicons/react/24/outline';

import { BrandHealth } from '@/types/dashboard';
import { BrandHealthMetric } from './BrandHealthMetric';
import { DashboardCard } from './DashboardCard';
import React from 'react';
import { getScoreColor } from '@/utils/styleUtils';

// file path: src/components/dashboard/BrandHealthScore.tsx

interface BrandHealthScoreProps {
  brand: BrandHealth;
}

export const BrandHealthScore: React.FC<BrandHealthScoreProps> = ({ brand }) => {
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
    <DashboardCard>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Brand Health Score</h2>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(brand.overallScore)}`}>
          {brand.overallScore}/100
        </div>
      </div>
      <div className="space-y-6">
        {metrics.map((metric) => (
          <BrandHealthMetric
            key={metric.name}
            name={metric.name}
            score={metric.score}
            change={metric.change}
            icon={metric.icon}
          />
        ))}
      </div>
    </DashboardCard>
  );
};