import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

import { NOLK_COLORS } from '@/constants/colors';
// file path: src/components/ecommerce/charts/MarketGrowthChart.tsx
import React from 'react';
import { formatters } from '@/utils/ecommerce/formatters';

interface MarketGrowthData {
  year: string;
  value: number;
}

const CustomTooltip = ({ 
  active, 
  payload 
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-lg border border-[#344C45]/10">
        <p 
          className="text-sm font-medium"
          style={{ color: NOLK_COLORS.primary }}
        >
          {formatters.trillion(payload[0].value as number)}
        </p>
      </div>
    );
  }
  return null;
};

interface MarketGrowthChartProps {
  data: MarketGrowthData[];
}

export const MarketGrowthChart: React.FC<MarketGrowthChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height="85%">
    <AreaChart data={data}>
      <defs>
        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={NOLK_COLORS.primary} stopOpacity={0.8}/>
          <stop offset="95%" stopColor={NOLK_COLORS.primary} stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid 
        strokeDasharray="3 3" 
        stroke={NOLK_COLORS.accent3} 
        vertical={false}
      />
      <XAxis 
        dataKey="year" 
        stroke={NOLK_COLORS.accent1}
        tick={{ fill: NOLK_COLORS.accent1 }}
        tickLine={{ stroke: NOLK_COLORS.accent2 }}
        axisLine={{ stroke: NOLK_COLORS.accent2 }}
      />
      <YAxis 
        stroke={NOLK_COLORS.accent1}
        tick={{ fill: NOLK_COLORS.accent1 }}
        tickLine={{ stroke: NOLK_COLORS.accent2 }}
        axisLine={{ stroke: NOLK_COLORS.accent2 }}
        tickFormatter={formatters.trillion}
      />
      <Tooltip content={CustomTooltip} />
      <Area 
        type="monotone" 
        dataKey="value" 
        stroke={NOLK_COLORS.primary} 
        strokeWidth={2}
        fillOpacity={1} 
        fill="url(#colorValue)" 
      />
    </AreaChart>
  </ResponsiveContainer>
);