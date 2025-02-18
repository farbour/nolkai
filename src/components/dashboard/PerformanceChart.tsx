import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import React from 'react';

// file path: src/components/dashboard/PerformanceChart.tsx

interface PerformanceData {
  month: string;
  revenue: number;
  orders: number;
}

type TimeframeId = 'today' | 'week' | 'month' | 'quarter' | 'year';

interface PerformanceChartProps {
  data: PerformanceData[];
  timeframe: TimeframeId;
  onTimeframeChange: (timeframe: TimeframeId) => void;
}

const timeframes = [
  { id: 'today' as const, name: 'Today' },
  { id: 'week' as const, name: 'This Week' },
  { id: 'month' as const, name: 'This Month' },
  { id: 'quarter' as const, name: 'This Quarter' },
  { id: 'year' as const, name: 'This Year' },
];

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data,
  timeframe,
  onTimeframeChange
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Performance Overview</h2>
          <div className="flex items-center space-x-4">
            <select
              value={timeframe}
              onChange={(e) => onTimeframeChange(e.target.value as TimeframeId)}
              className="text-sm border rounded-lg border-gray-200 px-3 py-1 focus:ring-2 focus:ring-nolk-green"
            >
              {timeframes.map((tf) => (
                <option key={tf.id} value={tf.id}>
                  {tf.name}
                </option>
              ))}
            </select>
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="month"
                stroke="#6B7280"
              />
              <YAxis 
                yAxisId="left"
                orientation="left"
                stroke="#6B7280"
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#6B7280"
                tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem'
                }}
                formatter={(value: number, name: string) => [
                  name === 'revenue' 
                    ? `$${value.toLocaleString()}`
                    : value.toLocaleString(),
                  name === 'revenue' ? 'Revenue' : 'Orders'
                ]}
              />
              <Bar 
                dataKey="revenue" 
                fill="#344C45" 
                yAxisId="left"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="orders" 
                fill="#9CA3AF" 
                yAxisId="right"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};