import {
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  CoreScaleOptions,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Scale,
  Title,
  Tooltip,
  TooltipItem,
} from 'chart.js';
import React, { useMemo, useState } from 'react';

import { BrandDataItem } from '../../config/brands';
import { Line } from 'react-chartjs-2';
import { MetricDetail } from './MetricDetail';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface BrandComparisonProps {
  data: BrandDataItem[];
  brands: string[];
  metric: string;
  title: string;
  unit: '%' | '$' | 'Number';
}

const COLORS = [
  'rgb(75, 192, 192)',   // Teal
  'rgb(255, 99, 132)',   // Pink
  'rgb(54, 162, 235)',   // Blue
  'rgb(255, 206, 86)',   // Yellow
  'rgb(153, 102, 255)',  // Purple
  'rgb(255, 159, 64)',   // Orange
];

export const BrandComparison: React.FC<BrandComparisonProps> = ({
  data,
  brands,
  metric,
  title,
  unit,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const chartData = useMemo(() => {
    // Get unique months
    const months = Array.from(new Set(data.map(item => 
      `${item['Month of Date']} ${item['Year of Date']}`
    ))).sort();

    // Prepare datasets for each brand
    const datasets = brands.map((brand, index) => {
      const brandData = data.filter(item => item.Brand === brand);
      const values = months.map(month => {
        const [monthName, year] = month.split(' ');
        const dataPoint = brandData.find(item => 
          item['Month of Date'] === monthName && 
          item['Year of Date'] === year &&
          item['KPI Name'] === metric
        );
        return dataPoint ? dataPoint['This Period Value'] : null;
      });

      return {
        label: brand,
        data: values,
        borderColor: COLORS[index % COLORS.length],
        backgroundColor: COLORS[index % COLORS.length].replace('rgb', 'rgba').replace(')', ', 0.5)'),
        tension: 0.4,
      };
    });

    return {
      labels: months,
      datasets,
    };
  }, [data, brands, metric]);

  const formatValue = (value: string | number): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '';
    
    switch (unit) {
      case '$':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(numValue);
      case '%':
        return numValue.toFixed(1) + '%';
      default:
        return numValue.toLocaleString();
    }
  };

  const handleClick = (_event: unknown, elements: { datasetIndex: number }[]) => {
    if (elements.length > 0) {
      const datasetIndex = elements[0].datasetIndex;
      setSelectedBrand(brands[datasetIndex]);
    }
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'line'>) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              switch (unit) {
                case '$':
                  label += new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(context.parsed.y);
                  break;
                case '%':
                  label += context.parsed.y.toFixed(2) + '%';
                  break;
                default:
                  label += context.parsed.y.toLocaleString();
              }
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        ticks: {
          callback: function(this: Scale<CoreScaleOptions>, tickValue: string | number) {
            return formatValue(Number(tickValue));
          },
        },
      },
    },
    onClick: handleClick,
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="h-[400px]">
        <Line options={options} data={chartData} />
      </div>
      {selectedBrand && (
        <MetricDetail
          data={data}
          metric={metric}
          brand={selectedBrand}
          unit={unit}
          onClose={() => setSelectedBrand(null)}
        />
      )}
    </div>
  );
};