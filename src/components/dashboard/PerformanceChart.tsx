import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import React from 'react';

// file path: src/components/dashboard/PerformanceChart.tsx

interface PerformanceData {
  month: string;
  revenue: number;
  orders: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
  timeframe: string;
  onTimeframeChange: (timeframe: string) => void;
}

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
          <div className="flex items-center space-x-2">
            <select
              value={timeframe}
              onChange={(e) => onTimeframeChange(e.target.value)}
              className="text-sm border-0 bg-gray-50 rounded-lg px-3 py-1 focus:ring-2 focus:ring-nolk-green"
            >
              <option value="1m">Last Month</option>
              <option value="3m">Last 3 Months</option>
              <option value="1y">Last Year</option>
            </select>
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