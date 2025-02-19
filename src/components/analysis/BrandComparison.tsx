// file path: src/components/analysis/BrandComparison.tsx
import {
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
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

interface ColorSet {
  border: string;
  background: string;
}

const COLORS: ColorSet[] = [
  { border: 'rgb(75, 192, 192)', background: 'rgba(75, 192, 192, 0.5)' },   // Teal
  { border: 'rgb(255, 99, 132)', background: 'rgba(255, 99, 132, 0.5)' },   // Pink
  { border: 'rgb(54, 162, 235)', background: 'rgba(54, 162, 235, 0.5)' },   // Blue
  { border: 'rgb(255, 206, 86)', background: 'rgba(255, 206, 86, 0.5)' },   // Yellow
  { border: 'rgb(153, 102, 255)', background: 'rgba(153, 102, 255, 0.5)' }, // Purple
  { border: 'rgb(255, 159, 64)', background: 'rgba(255, 159, 64, 0.5)' },   // Orange
];

const monthOrder = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface DateInfo {
  month: string;
  year: number;
  display: string;
}

export const BrandComparison: React.FC<BrandComparisonProps> = ({
  data,
  brands,
  metric,
  title,
  unit,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const chartData = useMemo(() => {
    // Get unique dates and sort them chronologically
    const uniqueDates = new Map<string, DateInfo>();
    
    data.forEach(item => {
      const yearStr = typeof item['Year of Date'] === 'number' 
        ? item['Year of Date'].toString() 
        : item['Year of Date'];
      const key = `${item['Month of Date']}-${yearStr}`;
      
      if (!uniqueDates.has(key)) {
        uniqueDates.set(key, {
          month: item['Month of Date'],
          year: parseInt(yearStr),
          display: `${item['Month of Date']} ${yearStr}`
        });
      }
    });

    // Convert map values to array and sort
    const sortedDates = Array.from(uniqueDates.values()).sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
    });

    const months = sortedDates.map(d => d.display);

    // Prepare datasets for each brand
    const datasets = brands.map((brand, index) => {
      const brandData = data.filter(item => 
        item.Brand === brand && 
        item['KPI Name'] === metric
      );

      const values = sortedDates.map(date => {
        const dataPoint = brandData.find(item => 
          item['Month of Date'] === date.month && 
          item['Year of Date'] === date.year.toString()
        );
        return dataPoint ? dataPoint['This Period Value'] : null;
      });

      // Remove trailing nulls to avoid gaps at the end of lines
      let lastValidIndex = values.length - 1;
      while (lastValidIndex >= 0 && values[lastValidIndex] === null) {
        lastValidIndex--;
      }
      const trimmedValues = values.slice(0, lastValidIndex + 1);

      const colorSet = COLORS[index % COLORS.length];
      return {
        label: brand,
        data: trimmedValues,
        borderColor: colorSet.border,
        backgroundColor: colorSet.background,
        tension: 0.4,
        spanGaps: true, // Connect points across gaps
      };
    });

    // Find the maximum length among all datasets
    const maxLength = Math.max(...datasets.map(d => d.data.length));
    
    return {
      labels: months.slice(0, maxLength),
      datasets,
    };
  }, [data, brands, metric]);

  const formatValue = (value: number): string => {
    if (isNaN(value)) return '';
    
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

  const handleClick = (_event: unknown, elements: { datasetIndex: number }[]) => {
    if (elements.length > 0) {
      const datasetIndex = elements[0].datasetIndex;
      setSelectedBrand(brands[datasetIndex]);
    }
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
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
          callback: (tickValue: number | string): string => {
            return formatValue(Number(tickValue));
          },
        },
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
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