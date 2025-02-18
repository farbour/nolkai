import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { DashboardCard } from './DashboardCard';
import React from 'react';

// file path: src/components/dashboard/MarketSizeInsights.tsx

interface MarketSize {
  year: string;
  value: string;
}

interface RegionalBreakdown {
  region: string;
  description: string;
}

interface MarketShare {
  region: string;
  share: string;
}

interface MarketSizeInsightsProps {
  globalMarket: MarketSize[];
  regionalBreakdown: RegionalBreakdown[];
  marketShare: MarketShare[];
  retailShare: string;
}

export const MarketSizeInsights: React.FC<MarketSizeInsightsProps> = ({
  globalMarket,
  regionalBreakdown,
  marketShare,
  retailShare,
}) => {
  const marketData = globalMarket.map(item => ({
    year: item.year,
    value: parseFloat(item.value.replace(/[^0-9.]/g, '')),
  }));

  return (
    <div className="space-y-6">
      <DashboardCard title="Global Market Growth">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={marketData}>
              <XAxis 
                dataKey="year" 
                tick={{ fontSize: 12 }}
                stroke="#9CA3AF"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#9CA3AF"
                tickFormatter={(value) => `$${value}T`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem'
                }}
                formatter={(value: number) => [`$${value}T`, 'Market Size']}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </DashboardCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard title="Regional Breakdown">
          <div className="space-y-4">
            {regionalBreakdown.map((item) => (
              <div key={item.region} className="border-b border-gray-100 pb-4 last:border-0">
                <h3 className="text-sm font-medium text-gray-900 mb-2">{item.region}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Market Share by Region">
          <div className="space-y-4">
            {marketShare.map((item) => (
              <div key={item.region} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0">
                <span className="text-sm font-medium text-gray-900">{item.region}</span>
                <span className="text-sm font-bold text-blue-600">{item.share}</span>
              </div>
            ))}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">E-commerce Share of Retail</h3>
              <p className="text-sm text-gray-600">{retailShare}</p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};