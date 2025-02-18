import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { DashboardCard } from './DashboardCard';
import React from 'react';

// file path: src/components/dashboard/OrderValueInsights.tsx

interface OrderValue {
  category: string;
  value: number;
  description: string;
}

interface OrderValueInsightsProps {
  globalAverage: string;
  byIndustry: OrderValue[];
  byRegion: OrderValue[];
  byDevice: OrderValue[];
  seasonalTrends: string;
  customerSegments: string;
}

export const OrderValueInsights: React.FC<OrderValueInsightsProps> = ({
  globalAverage,
  byIndustry,
  byRegion,
  byDevice,
  seasonalTrends,
  customerSegments,
}) => {
  const chartData = [...byIndustry, ...byRegion, ...byDevice].map(item => ({
    name: item.category,
    value: item.value,
  }));

  return (
    <div className="space-y-6">
      <DashboardCard title="Average Order Value Overview">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Average</h3>
          <p className="text-gray-600">{globalAverage}</p>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                stroke="#9CA3AF"
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#9CA3AF"
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem'
                }}
                formatter={(value: number) => [`$${value}`, 'Average Order Value']}
              />
              <Bar 
                dataKey="value" 
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </DashboardCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard title="By Industry">
          <div className="space-y-4">
            {byIndustry.map((item) => (
              <div key={item.category} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900">{item.category}</h3>
                  <span className="text-sm font-bold text-blue-600">${item.value}</span>
                </div>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="By Region">
          <div className="space-y-4">
            {byRegion.map((item) => (
              <div key={item.category} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900">{item.category}</h3>
                  <span className="text-sm font-bold text-blue-600">${item.value}</span>
                </div>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="By Device">
          <div className="space-y-4">
            {byDevice.map((item) => (
              <div key={item.category} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900">{item.category}</h3>
                  <span className="text-sm font-bold text-blue-600">${item.value}</span>
                </div>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Additional Insights">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Seasonal Trends</h3>
              <p className="text-sm text-gray-600">{seasonalTrends}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Customer Segments</h3>
              <p className="text-sm text-gray-600">{customerSegments}</p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};