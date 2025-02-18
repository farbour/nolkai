import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { ChartBarIcon } from '@heroicons/react/24/outline';
import { ColorType } from '@/types/theme';
import React from 'react';
import { getColorClass } from '@/utils/styleUtils';

// file path: src/components/dashboard/KPICard.tsx

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  timeframe: string;
  icon: typeof ChartBarIcon;
  trend: 'up' | 'down';
  color: ColorType;
  data: Array<{ date: string; value: number }>;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  timeframe,
  icon: Icon,
  trend,
  color,
  data
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:border-nolk-green/20 transition-colors group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">
            {title}
          </p>
          <h3 className="text-4xl font-bold text-gray-900 tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`p-2 rounded-lg transition-colors ${getColorClass(color, 'bg')}`}>
          <Icon className={`h-6 w-6 ${getColorClass(color, 'text')}`} />
        </div>
      </div>
      <div className="mt-4 flex items-center space-x-2">
        <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </span>
        <span className="text-sm text-gray-500">{timeframe}</span>
      </div>
      <div className="mt-4 h-16">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
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
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#344C45"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};