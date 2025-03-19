import {
  BarController,
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  ScriptableContext,
  Title,
  Tooltip,
} from 'chart.js';
import { chartColors, commonOptions, getGradient } from './chartConfig';

import { Bar } from 'react-chartjs-2';
// file path: src/components/ecommerce/charts/ChartBar.tsx
import React from 'react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
);

interface ChartBarProps {
  data: Record<string, string | number>[];
  indexBy: string;
  keys: string[];
  valueFormat?: (value: number) => string;
  height?: number;
}

export const ChartBar: React.FC<ChartBarProps> = ({
  data,
  indexBy,
  keys,
  valueFormat = (value: number) => value.toString(),
  height = 350,
}) => {
  const chartData: ChartData<'bar'> = {
    labels: data.map(d => d[indexBy] as string),
    datasets: keys.map((key, index) => ({
      label: key,
      data: data.map(d => Number(d[key])),
      backgroundColor: (context: ScriptableContext<'bar'>) => {
        const chart = context.chart;
        const { ctx } = chart;
        return getGradient(ctx, chartColors[index % chartColors.length]);
      },
      borderColor: chartColors[index % chartColors.length],
      borderWidth: 1,
      borderRadius: 4,
      barThickness: 'flex' as const,
    })),
  };

  const options: ChartOptions<'bar'> = {
    ...commonOptions as ChartOptions<'bar'>,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => valueFormat(Number(value)),
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      ...commonOptions.plugins,
      tooltip: {
        ...commonOptions.plugins.tooltip,
        callbacks: {
          label(context) {
            const value = context.parsed.y;
            return ` ${valueFormat(value)}`;
          },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
  };

  return (
    <div style={{ height }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ChartBar;