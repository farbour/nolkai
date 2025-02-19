import {
  ArcElement,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  Tooltip,
} from 'chart.js';
import { chartColors, commonOptions } from './chartConfig';

import { Pie } from 'react-chartjs-2';
// file path: src/components/ecommerce/charts/ChartPie.tsx
import React from 'react';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface ChartPieProps {
  data: Record<string, string | number>[];
  valueKey: string;
  labelKey: string;
  valueFormat?: (value: number) => string;
  height?: number;
}

export const ChartPie: React.FC<ChartPieProps> = ({
  data,
  valueKey,
  labelKey,
  valueFormat = (value: number) => value.toString(),
  height = 350,
}) => {
  const values = data.map(d => Number(d[valueKey]));
  const total = values.reduce((sum, value) => sum + value, 0);

  const chartData: ChartData<'pie'> = {
    labels: data.map(d => d[labelKey] as string),
    datasets: [{
      data: values,
      backgroundColor: chartColors,
      borderColor: 'white',
      borderWidth: 2,
    }],
  };

  const options: ChartOptions<'pie'> = {
    ...commonOptions as ChartOptions<'pie'>,
    plugins: {
      ...commonOptions.plugins,
      tooltip: {
        ...commonOptions.plugins.tooltip,
        callbacks: {
          label(context) {
            const value = context.raw as number;
            const percentage = ((value / total) * 100).toFixed(1);
            return ` ${context.label}: ${valueFormat(value)} (${percentage}%)`;
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: 'easeInOutQuart',
    },
    layout: {
      padding: 20,
    },
  };

  return (
    <div style={{ height }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default ChartPie;