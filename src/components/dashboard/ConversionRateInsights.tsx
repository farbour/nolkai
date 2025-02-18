import { DashboardCard } from './DashboardCard';
import React from 'react';

// file path: src/components/dashboard/ConversionRateInsights.tsx

interface ConversionRate {
  category: string;
  rate: string;
  description: string;
}

interface ConversionRateInsightsProps {
  byIndustry: ConversionRate[];
  byRegion: ConversionRate[];
  byDevice: ConversionRate[];
  byChannel: ConversionRate[];
}

export const ConversionRateInsights: React.FC<ConversionRateInsightsProps> = ({
  byIndustry,
  byRegion,
  byDevice,
  byChannel,
}) => {
  const categories = [
    { title: 'By Industry', data: byIndustry },
    { title: 'By Region', data: byRegion },
    { title: 'By Device', data: byDevice },
    { title: 'By Channel', data: byChannel },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {categories.map(({ title, data }) => (
        <DashboardCard key={title} title={title}>
          <div className="space-y-4">
            {data.map((item) => (
              <div key={item.category} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900">{item.category}</h3>
                  <span className="text-sm font-bold text-blue-600">{item.rate}</span>
                </div>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </DashboardCard>
      ))}
    </div>
  );
};