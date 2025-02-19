// file path: src/pages/analysis.tsx
import { useEffect, useState } from 'react';

import { BrandComparison } from '../components/analysis/BrandComparison';
import { BrandDataItem } from '../config/brands';
import { BrandSelector } from '../components/BrandSelector';
import { ComparisonBrandSelector } from '../components/analysis/ComparisonBrandSelector';
import { DataSelector } from '../components/analysis/DataSelector';
import { DateSelector } from '../components/analysis/DateSelector';
import { KPICard } from '../components/analysis/KPICard';
import { parseCSV } from '../utils/csvParser';
import { useBrand } from '../context/BrandContext';

type MetricConfig = {
  title: string;
  metric: string;
  unit: '%' | '$' | 'Number';
  description: string;
};

const PERFORMANCE_METRICS: MetricConfig[] = [
  { 
    title: 'TACOS',
    metric: 'TACOS',
    unit: '%',
    description: 'Total Advertising Cost of Sales (TACOS) measures the ratio of total advertising spend to total revenue. Lower values indicate more efficient advertising spend.\n\nCalculation: (Total Ad Spend / Total Revenue) × 100'
  },
  { 
    title: 'ACOS',
    metric: 'ACOS',
    unit: '%',
    description: 'Advertising Cost of Sales (ACOS) measures the ratio of advertising spend to revenue generated directly from those ads. Lower values indicate better ad performance.\n\nCalculation: (Ad Spend / Ad Revenue) × 100'
  },
  { 
    title: 'Conversion Rate',
    metric: 'Conversion Rate',
    unit: '%',
    description: 'The percentage of website visitors who complete a purchase. Higher values indicate better website effectiveness and user experience.\n\nCalculation: (Number of Sales / Number of Visitors) × 100'
  },
  { 
    title: 'Repeat Rate',
    metric: 'Repeat Rate',
    unit: '%',
    description: 'The percentage of customers who make additional purchases. Higher values indicate stronger customer loyalty and satisfaction.\n\nCalculation: (Repeat Customers / Total Customers) × 100'
  },
];

const REVENUE_METRICS: MetricConfig[] = [
  { 
    title: 'Gross Revenue',
    metric: 'Gross Revenue',
    unit: '$',
    description: 'Total revenue before deducting any costs or expenses. This represents the total monetary value of all sales.\n\nCalculation: Total Sales × Price per Unit'
  },
  { 
    title: 'Net Revenue',
    metric: 'Net Revenue',
    unit: '$',
    description: 'Revenue after deducting all costs, expenses, and adjustments. This represents actual business earnings.\n\nCalculation: Gross Revenue - Returns - Discounts - Allowances'
  },
  { 
    title: 'D2C Net Revenue',
    metric: 'D2C Net Revenue',
    unit: '$',
    description: 'Net revenue from direct-to-consumer sales channels only. This measures the success of direct sales efforts.\n\nCalculation: D2C Gross Revenue - D2C Returns - D2C Discounts'
  },
];

const CUSTOMER_METRICS: MetricConfig[] = [
  { 
    title: 'LTV',
    metric: 'LTV',
    unit: '$',
    description: 'Customer Lifetime Value (LTV) represents the total revenue expected from a customer throughout the business relationship.\n\nCalculation: Average Order Value × Number of Repeat Sales × Average Customer Lifespan'
  },
  { 
    title: 'CAC',
    metric: 'CAC',
    unit: '$',
    description: 'Customer Acquisition Cost (CAC) represents the total cost to acquire a new customer, including marketing and sales expenses.\n\nCalculation: Total Marketing & Sales Costs / Number of New Customers'
  },
  { 
    title: 'D2C Net AOV',
    metric: 'D2C Net AOV',
    unit: '$',
    description: 'Direct-to-Consumer Average Order Value (AOV) represents the average amount spent per order through direct sales channels.\n\nCalculation: Total D2C Revenue / Number of D2C Orders'
  },
  { 
    title: 'Cross-Sell Rate',
    metric: '% Cross-Sell Customers',
    unit: '%',
    description: 'The percentage of customers who purchase additional products beyond their initial purchase.\n\nCalculation: (Customers Who Bought Multiple Products / Total Customers) × 100'
  },
];

const EMAIL_METRICS: MetricConfig[] = [
  { 
    title: 'Email Open Rate',
    metric: 'Email Open Rate',
    unit: '%',
    description: 'The percentage of email recipients who open a sent email. Indicates email subject line effectiveness and list engagement.\n\nCalculation: (Number of Opens / Number of Delivered Emails) × 100'
  },
  { 
    title: 'Email Click Rate',
    metric: 'Email Click Rate',
    unit: '%',
    description: 'The percentage of email recipients who clicked on at least one link in an email. Measures email content effectiveness.\n\nCalculation: (Number of Clicks / Number of Delivered Emails) × 100'
  },
  { 
    title: 'Email Click Through Rate',
    metric: 'Email Click Through Rate',
    unit: '%',
    description: 'The percentage of email opens that resulted in clicks. Indicates how well email content converts opens to engagement.\n\nCalculation: (Number of Clicks / Number of Opens) × 100'
  },
];

export default function Analysis() {
  const { selectedBrand, availableBrands } = useBrand();
  const [data, setData] = useState<BrandDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comparisonBrand, setComparisonBrand] = useState<string | null>(null);
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

  const getValue = (brand: string, metric: string): { value: number | string; displayValue: string } => {
    const brandData = data.filter(item =>
      item.Brand === brand &&
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
          <ComparisonBrandSelector
            availableBrands={availableBrands}
            selectedBrand={comparisonBrand}
            onChange={setComparisonBrand}
            currentBrand={selectedBrand}
          />
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
          {PERFORMANCE_METRICS.map(({ title, metric, unit, description }) => {
            const mainValue = getValue(selectedBrand, metric);
            const compareValue = comparisonBrand ? getValue(comparisonBrand, metric) : undefined;
            return (
              <KPICard
                key={metric}
                title={title}
                value={mainValue.value}
                comparisonValue={compareValue?.value}
                unit={unit}
                description={description}
              />
            );
          })}
        </div>
      </div>

      {/* Revenue Metrics */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">Revenue Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {REVENUE_METRICS.map(({ title, metric, unit, description }) => {
            const mainValue = getValue(selectedBrand, metric);
            const compareValue = comparisonBrand ? getValue(comparisonBrand, metric) : undefined;
            return (
              <KPICard
                key={metric}
                title={title}
                value={mainValue.value}
                comparisonValue={compareValue?.value}
                unit={unit}
                description={description}
              />
            );
          })}
        </div>
        {comparisonBrand && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BrandComparison
              data={data}
              brands={[selectedBrand, comparisonBrand]}
              metric="Gross Revenue"
              title="Gross Revenue Trend"
              unit="$"
            />
            <BrandComparison
              data={data}
              brands={[selectedBrand, comparisonBrand]}
              metric="Net Revenue"
              title="Net Revenue Trend"
              unit="$"
            />
          </div>
        )}
      </div>

      {/* Customer Metrics */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">Customer Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {CUSTOMER_METRICS.map(({ title, metric, unit, description }) => {
            const mainValue = getValue(selectedBrand, metric);
            const compareValue = comparisonBrand ? getValue(comparisonBrand, metric) : undefined;
            return (
              <KPICard
                key={metric}
                title={title}
                value={mainValue.value}
                comparisonValue={compareValue?.value}
                unit={unit}
                description={description}
              />
            );
          })}
        </div>
        {comparisonBrand && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BrandComparison
              data={data}
              brands={[selectedBrand, comparisonBrand]}
              metric="LTV"
              title="Customer Lifetime Value"
              unit="$"
            />
            <BrandComparison
              data={data}
              brands={[selectedBrand, comparisonBrand]}
              metric="CAC"
              title="Customer Acquisition Cost"
              unit="$"
            />
          </div>
        )}
      </div>

      {/* Email Performance */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">Email Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {EMAIL_METRICS.map(({ title, metric, unit, description }) => {
            const mainValue = getValue(selectedBrand, metric);
            const compareValue = comparisonBrand ? getValue(comparisonBrand, metric) : undefined;
            return (
              <KPICard
                key={metric}
                title={title}
                value={mainValue.value}
                comparisonValue={compareValue?.value}
                unit={unit}
                description={description}
              />
            );
          })}
        </div>
        {comparisonBrand && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BrandComparison
              data={data}
              brands={[selectedBrand, comparisonBrand]}
              metric="Email Open Rate"
              title="Email Open Rate"
              unit="%"
            />
            <BrandComparison
              data={data}
              brands={[selectedBrand, comparisonBrand]}
              metric="Email Click Rate"
              title="Email Click Rate"
              unit="%"
            />
          </div>
        )}
      </div>
    </div>
  );
}