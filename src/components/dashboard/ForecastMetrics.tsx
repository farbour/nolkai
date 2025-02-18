import {
  LightBulbIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import React from 'react';

// file path: src/components/dashboard/ForecastMetrics.tsx

interface ForecastData {
  date: string;
  actual: number;
  predicted: number;
  confidence: [number, number]; // [lower bound, upper bound]
}

interface ForecastMetric {
  name: string;
  description: string;
  currentValue: number;
  predictedValue: number;
  changePercent: number;
  confidence: number;
  data: ForecastData[];
  insights: string[];
}

interface ForecastMetricsProps {
  metrics: ForecastMetric[];
}

export const ForecastMetrics: React.FC<ForecastMetricsProps> = ({ metrics }) => {
  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600 bg-green-50';
    if (change < 0) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">AI Forecast</h2>
            <p className="text-sm text-gray-500 mt-1">
              Predictions for the next 30 days
            </p>
          </div>
          <SparklesIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {metrics.map((metric) => (
          <div key={metric.name} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  {metric.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {metric.description}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getChangeColor(metric.changePercent)}`}>
                {metric.changePercent > 0 ? '+' : ''}{metric.changePercent}%
              </div>
            </div>

            {/* Forecast Chart */}
            <div className="h-48 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metric.data}>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10 }}
                    stroke="#9CA3AF"
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }}
                    stroke="#9CA3AF"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#344C45"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#9333EA"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Insights */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Confidence Level</span>
                <span className="font-medium text-gray-900">{metric.confidence}%</span>
              </div>
              <div className="space-y-2">
                {metric.insights.map((insight, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <LightBulbIcon className="h-5 w-5 text-yellow-500" />
                    </div>
                    <p className="ml-2 text-sm text-gray-600">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};