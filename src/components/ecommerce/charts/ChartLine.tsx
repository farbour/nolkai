import {
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  ScriptableContext,
  Title,
  Tooltip,
} from 'chart.js';
import { chartColors, commonOptions, getGradient } from './chartConfig';

import { Line } from 'react-chartjs-2';
// file path: src/components/ecommerce/charts/ChartLine.tsx
import React from 'react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartLineProps {
  data: Record<string, string | number>[];
  xKey: string;
  yKey: string;
  valueFormat?: (value: number) => string;
  height?: number;
}

export const ChartLine: React.FC<ChartLineProps> = ({
  data,
  xKey,
  yKey,
  valueFormat = (value: number) => value.toString(),
  height = 350,
}) => {
  const chartData: ChartData<'line'> = {
    labels: data.map(d => d[xKey] as string),
    datasets: [{
      label: yKey,
      data: data.map(d => Number(d[yKey])),
      borderColor: chartColors[0],
      backgroundColor: (context: ScriptableContext<'line'>) => {
        const chart = context.chart;
        const { ctx } = chart;
        return getGradient(ctx, chartColors[0]);
      },
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: chartColors[0],
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
    }],
  };

  const options: ChartOptions<'line'> = {
    ...commonOptions as ChartOptions<'line'>,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => valueFormat(Number(value)),
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
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
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  return (
    <div style={{ height }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ChartLine;