// file path: src/components/dashboard/KPICard.tsx
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { ChartBarIcon } from '@heroicons/react/24/outline';
import { ColorType } from '@/types/theme';
import { NOLK_COLORS } from '@/constants/colors';
import React from 'react';
import { formatNumber } from '@/utils/formatters';
import { getColorClass } from '@/utils/styleUtils';

interface KPICardProps {
  title: string;
  value: number;
  change: number;
  description: string;
  icon?: typeof ChartBarIcon;
  trend: 'up' | 'down';
  color?: ColorType;
  data?: Array<{ date: string; value: number }>;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  description,
  icon: Icon = ChartBarIcon,
  trend,
  color = 'primary',
  data = []
}) => {
  const formattedValue = formatNumber(value);
  const formattedChange = `${change >= 0 ? '+' : ''}${change}%`;

  return (
    <div className="bg-[rgb(255,252,246)] rounded-xl shadow-sm p-6 border border-[rgb(202,202,202)]/20 hover:border-[rgb(52,76,69)]/20 transition-colors group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[rgb(52,76,69)] mb-1">
            {title}
          </p>
          <h3 className="text-4xl font-bold text-[rgb(52,76,69)] tracking-tight">
            {formattedValue}
          </h3>
        </div>
        <div className={`p-3 rounded-xl transition-colors ${getColorClass(color, 'bg')}`}>
          <Icon className={`h-6 w-6 ${getColorClass(color, 'text')}`} />
        </div>
      </div>
      <div className="mt-4 flex items-center space-x-2">
        <span className={`text-sm font-medium ${
          trend === 'up' 
            ? 'text-[rgb(52,76,69)]' // primary color for positive trend
            : 'text-[rgb(140,165,255)]' // accent2 color for negative trend
        }`}>
          {formattedChange}
        </span>
        <span className="text-sm text-[rgb(52,76,69)]">{description}</span>
      </div>
      {data.length > 0 && (
        <div className="mt-4 h-16">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={`${NOLK_COLORS.gray}20`}
                strokeLinecap="round"
              />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10 }}
                stroke={NOLK_COLORS.primary}
                tickLine={{ stroke: NOLK_COLORS.primary }}
              />
              <YAxis 
                hide={true}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: NOLK_COLORS.backgroundAlt,
                  border: `1px solid ${NOLK_COLORS.gray}`,
                  borderRadius: '0.75rem',
                  color: NOLK_COLORS.primary
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={NOLK_COLORS.primary}
                strokeWidth={2}
                dot={false}
                strokeLinecap="round"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};