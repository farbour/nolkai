import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import React, { useMemo } from 'react';

import { BrandDataItem } from '../../config/brands';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MetricDetailProps {
  data: BrandDataItem[];
  metric: string;
  brand: string;
  unit: '%' | '$' | 'Number';
  onClose: () => void;
}

export const MetricDetail: React.FC<MetricDetailProps> = ({
  data,
  metric,
  brand,
  unit,
  onClose,
}) => {
  const chartData = useMemo(() => {
    // Filter data for the specific brand and metric
    const filteredData = data
      .filter(item => item.Brand === brand && item['KPI Name'] === metric)
      .sort((a, b) => {
        const aDate = new Date(`${a['Month of Date']} ${a['Year of Date']}`);
        const bDate = new Date(`${b['Month of Date']} ${b['Year of Date']}`);
        return aDate.getTime() - bDate.getTime();
      });

    const months = filteredData.map(item => 
      `${item['Month of Date']} ${item['Year of Date']}`
    );

    const values = filteredData.map(item => item['This Period Value']);

    // Calculate period-over-period changes
    const changes = values.map((value, index) => {
      if (index === 0) return null;
      const prevValue = values[index - 1];
      return prevValue ? ((value - prevValue) / prevValue) * 100 : null;
    });

    return {
      labels: months,
      datasets: [
        {
          label: metric,
          data: values,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          yAxisID: 'y',
        },
        {
          label: 'Period-over-Period Change (%)',
          data: changes,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          yAxisID: 'y1',
        },
      ],
    };
  }, [data, metric, brand]);

  const formatValue = (value: number, isPercentage = false): string => {
    if (isPercentage) {
      return `${value.toFixed(1)}%`;
    }
    
    switch (unit) {
      case '$':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      case '%':
        return value.toFixed(1) + '%';
      default:
        return value.toLocaleString();
    }
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: `${metric} - Historical Analysis for ${brand}`,
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'line'>) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${formatValue(value, context.datasetIndex === 1)}`;
          },
        },
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: metric,
        },
        ticks: {
          callback: function(this: Scale<CoreScaleOptions>, value: string | number) {
            return formatValue(Number(value));
          },
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Period-over-Period Change (%)',
        },
        ticks: {
          callback: function(this: Scale<CoreScaleOptions>, value: string | number) {
            return `${Number(value).toFixed(1)}%`;
          },
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  // Calculate summary statistics
  const stats = useMemo(() => {
    const values = data
      .filter(item => item.Brand === brand && item['KPI Name'] === metric)
      .map(item => item['This Period Value']);

    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      current: values[values.length - 1],
    };
  }, [data, brand, metric]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{metric} Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Current Value</div>
            <div className="text-lg font-semibold">{formatValue(stats.current)}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Average</div>
            <div className="text-lg font-semibold">{formatValue(stats.avg)}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Minimum</div>
            <div className="text-lg font-semibold">{formatValue(stats.min)}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Maximum</div>
            <div className="text-lg font-semibold">{formatValue(stats.max)}</div>
          </div>
        </div>

        <div className="h-[500px]">
          <Line options={options} data={chartData} />
        </div>
      </div>
    </div>
  );
};