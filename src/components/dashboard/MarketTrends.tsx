import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { MarketTrend } from '@/types/dashboard';
import React from 'react';

// file path: src/components/dashboard/MarketTrends.tsx


interface MarketTrendsProps {
  trends: MarketTrend[];
}

export const MarketTrends: React.FC<MarketTrendsProps> = ({ trends }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Market Trends</h2>
          <ArrowTrendingUpIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {trends.map((trend) => (
          <div key={trend.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-900">{trend.name}</h3>
                  <span className={`text-sm font-medium ${
                    trend.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trend.change >= 0 ? '+' : ''}{trend.change.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-4 h-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trend.data}>
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 10 }}
                        stroke="#9CA3AF"
                      />
                      <YAxis 
                        hide={true}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #E5E7EB',
                          borderRadius: '0.5rem'
                        }}
                        formatter={(value: number) => [`${value.toFixed(2)}%`, 'Change']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={trend.change >= 0 ? '#059669' : '#DC2626'}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};