import { BarChart } from '@tremor/react';
import { NOLK_COLORS } from '@/constants/colors';
// file path: src/components/ecommerce/charts/HorizontalBarChart.tsx
import React from 'react';
import { ValueFormatter } from '@/types/ecommerce';

interface HorizontalBarChartProps<T extends Record<string, string | number>> {
  data: T[];
  keys: (keyof T)[];
  indexBy: keyof T;
  valueFormat: ValueFormatter;
}

export const HorizontalBarChart = <T extends Record<string, string | number>>({ 
  data, 
  keys, 
  indexBy, 
  valueFormat 
}: HorizontalBarChartProps<T>) => (
  <div className="h-[400px]">
    <BarChart
      data={data}
      index={indexBy as string}
      categories={keys as string[]}
      colors={[NOLK_COLORS.primary]}
      valueFormatter={valueFormat}
      showLegend={false}
      showGridLines={false}
      layout="horizontal"
      className="h-full"
    />
  </div>
);