// file path: src/pages/analysis.tsx
import { useEffect, useState } from 'react';

import { BrandComparison } from '../components/analysis/BrandComparison';
import { BrandDataItem } from '../config/brands';
import { BrandSelector } from '../components/BrandSelector';
import { DataSelector } from '../components/analysis/DataSelector';
import { DateSelector } from '../components/analysis/DateSelector';
import { KPICard } from '../components/analysis/KPICard';
import { parseCSV } from '../utils/csvParser';
import { useBrand } from '../context/BrandContext';

type MetricConfig = {
  title: string;
  metric: string;
  unit: '%' | '$' | 'Number';
};

const PERFORMANCE_METRICS: MetricConfig[] = [
  { title: 'TACOS', metric: 'TACOS', unit: '%' },
  { title: 'ACOS', metric: 'ACOS', unit: '%' },
  { title: 'Conversion Rate', metric: 'Conversion Rate', unit: '%' },
  { title: 'Repeat Rate', metric: 'Repeat Rate', unit: '%' },
];

const REVENUE_METRICS: MetricConfig[] = [
  { title: 'Gross Revenue', metric: 'Gross Revenue', unit: '$' },
  { title: 'Net Revenue', metric: 'Net Revenue', unit: '$' },
  { title: 'D2C Net Revenue', metric: 'D2C Net Revenue', unit: '$' },
];

const CUSTOMER_METRICS: MetricConfig[] = [
  { title: 'LTV', metric: 'LTV', unit: '$' },
  { title: 'CAC', metric: 'CAC', unit: '$' },
  { title: 'D2C Net AOV', metric: 'D2C Net AOV', unit: '$' },
  { title: 'Cross-Sell Rate', metric: '% Cross-Sell Customers', unit: '%' },
];

const EMAIL_METRICS: MetricConfig[] = [
  { title: 'Email Open Rate', metric: 'Email Open Rate', unit: '%' },
  { title: 'Email Click Rate', metric: 'Email Click Rate', unit: '%' },
  { title: 'Email Click Through Rate', metric: 'Email Click Through Rate', unit: '%' },
];

export default function Analysis() {
  const { selectedBrand } = useBrand();
  const [data, setData] = useState<BrandDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comparisonBrands, setComparisonBrands] = useState<string[]>([]);
  const [selectedDataFile, setSelectedDataFile] = useState('/data.csv');
  const [selectedDate, setSelectedDate] = useState<{ month: string; year: string }>({ month: '', year: '' });
  const [availableDates, setAvailableDates] = useState<{ month: string; year: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data.csv');
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        
        const text = await response.text();
        const { headers, rows } = parseCSV(text);
        
        const parsedData = rows.map(values => {
          const item: BrandDataItem = {
            Brand: '',
            'KPI Name': '',
            'KPI Unit': '',
            'Month of Date': '',
            'Year of Date': '',
            'This Period Value': 0,
          };
          
          headers.forEach((header, index) => {
            if (header === 'This Period Value') {
              const rawValue = values[index];
              const cleanValue = rawValue.replace(/["\$]/g, '');
              if (!cleanValue || cleanValue === 'n/a') {
                item[header] = 0;
              } else {
                const parsedValue = parseFloat(cleanValue.replace(/,/g, '')) || 0;
                item[header] = parsedValue;
              }
            } else {
              item[header] = values[index];
            }
          });
          
          return item;
        });

        setData(parsedData);
        
        // Get unique brands and set comparison brands
        const uniqueBrands = Array.from(new Set(parsedData.map(item => item.Brand)));
        setComparisonBrands([selectedBrand, ...uniqueBrands.filter(b => b !== selectedBrand).slice(0, 2)]);
        
        // Get unique dates
        const dates = Array.from(new Set(parsedData.map(item => `${item['Month of Date']}-${item['Year of Date']}`)))
          .map(date => {
            const [month, year] = date.split('-');
            return { month, year };
          })
          .sort((a, b) => {
            const dateA = new Date(`${a.month} 1, ${a.year}`);
            const dateB = new Date(`${b.month} 1, ${b.year}`);
            return dateB.getTime() - dateA.getTime();
          });
        
        setAvailableDates(dates);
        if (dates.length > 0 && !selectedDate.month) {
          setSelectedDate(dates[0]);
        }
        
        setLoading(false);
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'Failed to load data');
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedBrand, selectedDataFile, selectedDate.month]);

  const getLatestValue = (metric: string): { value: number | string; displayValue: string } => {
    const brandData = data.filter(item =>
      item.Brand === selectedBrand &&
      item['KPI Name'] === metric &&
      item['Month of Date'] === selectedDate.month &&
      item['Year of Date'] === selectedDate.year
    );
    
    if (brandData.length === 0) {
      return { value: 'n/a', displayValue: 'n/a' };
    }
    
    const value = brandData[0]['This Period Value'];
    return { 
      value: value === 0 ? 'n/a' : value,
      displayValue: value === 0 ? 'n/a' : value.toString()
    };
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
        <h2 className="text-2xl font-bold text-gray-900">Brand Performance Analysis</h2>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <BrandSelector />
          <DateSelector
            dates={availableDates}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
          <DataSelector
            currentFile={selectedDataFile}
            onFileChange={setSelectedDataFile}
          />
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-800">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {PERFORMANCE_METRICS.map(({ title, metric, unit }) => {
            const { value } = getLatestValue(metric);
            return (
              <KPICard
                key={metric}
                title={title}
                value={value}
                unit={unit}
              />
            );
          })}
        </div>
      </div>

      {/* Revenue Metrics */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">Revenue Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {REVENUE_METRICS.map(({ title, metric, unit }) => {
            const { value } = getLatestValue(metric);
            return (
              <KPICard
                key={metric}
                title={title}
                value={value}
                unit={unit}
              />
            );
          })}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BrandComparison
            data={data}
            brands={comparisonBrands}
            metric="Gross Revenue"
            title="Gross Revenue Trend"
            unit="$"
          />
          <BrandComparison
            data={data}
            brands={comparisonBrands}
            metric="Net Revenue"
            title="Net Revenue Trend"
            unit="$"
          />
        </div>
      </div>

      {/* Customer Metrics */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">Customer Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {CUSTOMER_METRICS.map(({ title, metric, unit }) => {
            const { value } = getLatestValue(metric);
            return (
              <KPICard
                key={metric}
                title={title}
                value={value}
                unit={unit}
              />
            );
          })}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BrandComparison
            data={data}
            brands={comparisonBrands}
            metric="LTV"
            title="Customer Lifetime Value"
            unit="$"
          />
          <BrandComparison
            data={data}
            brands={comparisonBrands}
            metric="CAC"
            title="Customer Acquisition Cost"
            unit="$"
          />
        </div>
      </div>

      {/* Email Performance */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">Email Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {EMAIL_METRICS.map(({ title, metric, unit }) => {
            const { value } = getLatestValue(metric);
            return (
              <KPICard
                key={metric}
                title={title}
                value={value}
                unit={unit}
              />
            );
          })}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BrandComparison
            data={data}
            brands={comparisonBrands}
            metric="Email Open Rate"
            title="Email Open Rate"
            unit="%"
          />
          <BrandComparison
            data={data}
            brands={comparisonBrands}
            metric="Email Click Rate"
            title="Email Click Rate"
            unit="%"
          />
        </div>
      </div>

      {/* Brand Selection */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Compare with other brands</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from(new Set(data.map(item => item.Brand)))
            .filter(brand => brand !== selectedBrand)
            .map((brand) => (
              <label key={brand} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={comparisonBrands.includes(brand)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setComparisonBrands([...comparisonBrands, brand].slice(0, 3));
                    } else {
                      setComparisonBrands(comparisonBrands.filter(b => b !== brand));
                    }
                  }}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{brand}</span>
              </label>
            ))}
        </div>
      </div>
    </div>
  );
}