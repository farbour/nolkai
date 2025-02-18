import {
  GlobeAltIcon,
  LightBulbIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { DashboardCard } from './DashboardCard';
import React from 'react';

// file path: src/components/dashboard/FutureForecasts.tsx

interface ForecastData {
  year: string;
  value: number;
  description: string;
}

interface AlternateFutureData {
  category: string;
  description: string;
  predictions: string[];
}

interface FutureForecastsProps {
  forecast2025: {
    marketSize: ForecastData;
    trends: string[];
  };
  forecast2030: {
    marketSize: ForecastData;
    trends: string[];
  };
  beyond2030: AlternateFutureData[];
}

export const FutureForecasts: React.FC<FutureForecastsProps> = ({
  forecast2025,
  forecast2030,
  beyond2030,
}) => {
  const forecastData = [
    { ...forecast2025.marketSize, period: '2025' },
    { ...forecast2030.marketSize, period: '2030' },
  ];

  const timeframes = [
    {
      title: '2025 Outlook',
      data: forecast2025,
      icon: LightBulbIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: '2030 Vision',
      data: forecast2030,
      icon: RocketLaunchIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardCard title="Market Size Projection">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData}>
              <XAxis 
                dataKey="period" 
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
        {timeframes.map(({ title, data, icon: Icon, color, bgColor }) => (
          <DashboardCard key={title}>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${bgColor}`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              </div>
              <div className="space-y-2">
                {data.trends.map((trend, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="mt-1.5">
                      <div className={`w-2 h-2 rounded-full ${color}`} />
                    </div>
                    <p className="text-sm text-gray-600">{trend}</p>
                  </div>
                ))}
              </div>
            </div>
          </DashboardCard>
        ))}
      </div>

      <DashboardCard title="Beyond 2030: Alternative Commerce">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beyond2030.map((future) => (
            <div key={future.category} className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-blue-100">
                  <GlobeAltIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">{future.category}</h3>
              </div>
              <p className="text-sm text-gray-600">{future.description}</p>
              <div className="space-y-2">
                {future.predictions.map((prediction, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="mt-1.5">
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600">{prediction}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
};