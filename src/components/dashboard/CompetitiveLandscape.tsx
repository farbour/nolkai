import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { DashboardCard } from './DashboardCard';
import React from 'react';

// file path: src/components/dashboard/CompetitiveLandscape.tsx

interface CompanyData {
  name: string;
  description: string;
  metrics: {
    revenue?: string;
    gmv?: string;
    marketShare?: string;
  };
}

interface MarketShareData {
  region: string;
  share: string;
  details: string;
}

interface PlatformComparisonData {
  category: string;
  description: string;
  metrics: string[];
}

interface CompetitiveLandscapeProps {
  topCompanies: CompanyData[];
  marketShares: {
    global: MarketShareData[];
    regional: MarketShareData[];
  };
  platformComparisons: PlatformComparisonData[];
  revenueInsights: {
    company: string;
    data: string[];
  }[];
  mergersTrends: string[];
}

export const CompetitiveLandscape: React.FC<CompetitiveLandscapeProps> = ({
  topCompanies,
  marketShares,
  platformComparisons,
  revenueInsights,
  mergersTrends,
}) => {
  const marketShareData = marketShares.global.map(item => ({
    name: item.region,
    share: parseFloat(item.share.replace(/[^0-9.]/g, '')),
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard title="Top Companies">
          <div className="space-y-4">
            {topCompanies.map((company) => (
              <div key={company.name} className="border-b border-gray-100 pb-4 last:border-0">
                <h3 className="text-base font-semibold text-gray-900 mb-2">{company.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{company.description}</p>
                <div className="flex flex-wrap gap-4">
                  {Object.entries(company.metrics).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500 capitalize">{key}:</span>
                      <span className="text-sm font-bold text-blue-600">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Global Market Share">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marketShareData}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  stroke="#9CA3AF"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#9CA3AF"
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem'
                  }}
                  formatter={(value: number) => [`${value}%`, 'Market Share']}
                />
                <Bar 
                  dataKey="share" 
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>

      <DashboardCard title="Platform Comparisons">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platformComparisons.map((platform) => (
            <div key={platform.category} className="space-y-3">
              <h3 className="text-base font-semibold text-gray-900">{platform.category}</h3>
              <p className="text-sm text-gray-600">{platform.description}</p>
              <div className="space-y-2">
                {platform.metrics.map((metric, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="mt-1.5">
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600">{metric}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard title="Revenue Insights">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {revenueInsights.map((company) => (
            <div key={company.company} className="space-y-3">
              <h3 className="text-base font-semibold text-gray-900">{company.company}</h3>
              <div className="space-y-2">
                {company.data.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="mt-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                    </div>
                    <p className="text-sm text-gray-600">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard title="M&A Trends">
        <div className="space-y-3">
          {mergersTrends.map((trend, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="mt-1.5">
                <div className="w-2 h-2 rounded-full bg-purple-600" />
              </div>
              <p className="text-sm text-gray-600">{trend}</p>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
};