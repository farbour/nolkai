import {
  KpiCategory,
  KpiUnit,
  Platform
} from '@/types/ecommerce-kpi-types';
// file path: src/pages/analysis.tsx
import { useEffect, useState } from 'react';

import { AIAnalysis } from '../components/analysis/AIAnalysis';
import { BrandDataItem } from '../config/brands';
import { BrandSelector } from '../components/BrandSelector';
import { ComparisonBrandSelector } from '../components/analysis/ComparisonBrandSelector';
import { DateSelector } from '../components/analysis/DateSelector';
import { KPICard } from '../components/analysis/KPICard';
import { parseCSV } from '../utils/csvParser';
import { useBrand } from '../context/BrandContext';

// Define the structure for metric configuration
interface MetricConfig {
  title: string;
  metric: string;
  unit: KpiUnit;
  description: string;
  category: KpiCategory;
  platforms: Platform[];
}

// Define all metrics with their configurations
const METRICS_CONFIG: MetricConfig[] = [
  // Advertising Metrics
  { 
    title: 'TACOS',
    metric: 'TACOS',
    unit: KpiUnit.Percentage,
    category: KpiCategory.Advertising,
    platforms: [Platform.Amazon, Platform.Shopify, Platform.General],
    description: 'Total Advertising Cost of Sales (TACOS) measures the ratio of total advertising spend to total revenue. Lower values indicate more efficient advertising spend.\n\nCalculation: (Total Ad Spend / Total Revenue) × 100'
  },
  { 
    title: 'ACOS',
    metric: 'ACOS',
    unit: KpiUnit.Percentage,
    category: KpiCategory.Advertising,
    platforms: [Platform.Amazon],
    description: 'Advertising Cost of Sales (ACOS) measures the ratio of advertising spend to revenue generated directly from those ads. Lower values indicate better ad performance.\n\nCalculation: (Ad Spend / Ad Revenue) × 100'
  },
  { 
    title: 'CTR',
    metric: 'Click Through Rate',
    unit: KpiUnit.Percentage,
    category: KpiCategory.Advertising,
    platforms: [Platform.Amazon, Platform.Shopify],
    description: 'Click-Through Rate (CTR) measures the percentage of ad impressions that result in clicks. Higher values indicate more engaging ads.\n\nCalculation: (Clicks / Impressions) × 100'
  },
  { 
    title: 'CPC',
    metric: 'Cost Per Click',
    unit: KpiUnit.Currency,
    category: KpiCategory.Advertising,
    platforms: [Platform.Amazon, Platform.Shopify, Platform.General],
    description: 'Cost Per Click (CPC) measures the average cost paid for each click on an advertisement. Lower values indicate more cost-effective ad campaigns.\n\nCalculation: Total Ad Spend / Total Clicks'
  },
  
  // Revenue Metrics
  { 
    title: 'Gross Revenue',
    metric: 'Gross Revenue',
    unit: KpiUnit.Currency,
    category: KpiCategory.Revenue,
    platforms: [Platform.Amazon, Platform.Shopify, Platform.General],
    description: 'Total revenue before deducting any costs or expenses. This represents the total monetary value of all sales.\n\nCalculation: Total Sales × Price per Unit'
  },
  { 
    title: 'Net Revenue',
    metric: 'Net Revenue',
    unit: KpiUnit.Currency,
    category: KpiCategory.Revenue,
    platforms: [Platform.Amazon, Platform.Shopify, Platform.General],
    description: 'Revenue after deducting all costs, expenses, and adjustments. This represents actual business earnings.\n\nCalculation: Gross Revenue - Returns - Discounts - Allowances'
  },
  { 
    title: 'D2C Net Revenue',
    metric: 'D2C Net Revenue',
    unit: KpiUnit.Currency,
    category: KpiCategory.Revenue,
    platforms: [Platform.Shopify, Platform.General],
    description: 'Net revenue from direct-to-consumer sales channels only. This measures the success of direct sales efforts.\n\nCalculation: D2C Gross Revenue - D2C Returns - D2C Discounts'
  },
  { 
    title: 'MoM Growth',
    metric: 'Month-over-Month Growth',
    unit: KpiUnit.Percentage,
    category: KpiCategory.Revenue,
    platforms: [Platform.Amazon, Platform.Shopify, Platform.General],
    description: 'The percentage change in revenue compared to the previous month. Positive values indicate growth.\n\nCalculation: ((Current Month Revenue - Previous Month Revenue) / Previous Month Revenue) × 100'
  },
  
  // Customer Behavior Metrics
  { 
    title: 'Conversion Rate',
    metric: 'Conversion Rate',
    unit: KpiUnit.Percentage,
    category: KpiCategory.CustomerBehavior,
    platforms: [Platform.Amazon, Platform.Shopify, Platform.General],
    description: 'The percentage of website visitors who complete a purchase. Higher values indicate better website effectiveness and user experience.\n\nCalculation: (Number of Sales / Number of Visitors) × 100'
  },
  { 
    title: 'Repeat Rate',
    metric: 'Repeat Rate',
    unit: KpiUnit.Percentage,
    category: KpiCategory.CustomerBehavior,
    platforms: [Platform.Amazon, Platform.Shopify, Platform.General],
    description: 'The percentage of customers who make additional purchases. Higher values indicate stronger customer loyalty and satisfaction.\n\nCalculation: (Repeat Customers / Total Customers) × 100'
  },
  { 
    title: 'LTV',
    metric: 'LTV',
    unit: KpiUnit.Currency,
    category: KpiCategory.CustomerBehavior,
    platforms: [Platform.Amazon, Platform.Shopify, Platform.General],
    description: 'Customer Lifetime Value (LTV) represents the total revenue expected from a customer throughout the business relationship.\n\nCalculation: Average Order Value × Number of Repeat Sales × Average Customer Lifespan'
  },
  { 
    title: 'CAC',
    metric: 'CAC',
    unit: KpiUnit.Currency,
    category: KpiCategory.CustomerBehavior,
    platforms: [Platform.Amazon, Platform.Shopify, Platform.General],
    description: 'Customer Acquisition Cost (CAC) represents the total cost to acquire a new customer, including marketing and sales expenses.\n\nCalculation: Total Marketing & Sales Costs / Number of New Customers'
  },
  { 
    title: 'D2C Net AOV',
    metric: 'D2C Net AOV',
    unit: KpiUnit.Currency,
    category: KpiCategory.CustomerBehavior,
    platforms: [Platform.Shopify, Platform.General],
    description: 'Direct-to-Consumer Average Order Value (AOV) represents the average amount spent per order through direct sales channels.\n\nCalculation: Total D2C Revenue / Number of D2C Orders'
  },
  { 
    title: 'Cross-Sell Rate',
    metric: '% Cross-Sell Customers',
    unit: KpiUnit.Percentage,
    category: KpiCategory.CustomerBehavior,
    platforms: [Platform.Amazon, Platform.Shopify, Platform.General],
    description: 'The percentage of customers who purchase additional products beyond their initial purchase.\n\nCalculation: (Customers Who Bought Multiple Products / Total Customers) × 100'
  },
  
  // Marketing Metrics
  { 
    title: 'Email Open Rate',
    metric: 'Email Open Rate',
    unit: KpiUnit.Percentage,
    category: KpiCategory.Marketing,
    platforms: [Platform.Shopify, Platform.General],
    description: 'The percentage of email recipients who open a sent email. Indicates email subject line effectiveness and list engagement.\n\nCalculation: (Number of Opens / Number of Delivered Emails) × 100'
  },
  { 
    title: 'Email Click Rate',
    metric: 'Email Click Rate',
    unit: KpiUnit.Percentage,
    category: KpiCategory.Marketing,
    platforms: [Platform.Shopify, Platform.General],
    description: 'The percentage of email recipients who clicked on at least one link in an email. Measures email content effectiveness.\n\nCalculation: (Number of Clicks / Number of Delivered Emails) × 100'
  },
  { 
    title: 'Email CTR',
    metric: 'Email Click Through Rate',
    unit: KpiUnit.Percentage,
    category: KpiCategory.Marketing,
    platforms: [Platform.Shopify, Platform.General],
    description: 'The percentage of email opens that resulted in clicks. Indicates how well email content converts opens to engagement.\n\nCalculation: (Number of Clicks / Number of Opens) × 100'
  },
  
  // Profitability Metrics
  { 
    title: 'Gross Margin',
    metric: 'Gross Margin',
    unit: KpiUnit.Percentage,
    category: KpiCategory.Profitability,
    platforms: [Platform.Amazon, Platform.Shopify, Platform.General],
    description: 'The percentage of revenue that exceeds the cost of goods sold. Higher values indicate better product profitability.\n\nCalculation: ((Revenue - COGS) / Revenue) × 100'
  },
  { 
    title: 'Net Margin',
    metric: 'Net Margin',
    unit: KpiUnit.Percentage,
    category: KpiCategory.Profitability,
    platforms: [Platform.Amazon, Platform.Shopify, Platform.General],
    description: 'The percentage of revenue that remains as profit after all expenses. Higher values indicate better overall profitability.\n\nCalculation: (Net Profit / Revenue) × 100'
  },
  
  // Inventory Metrics
  { 
    title: 'Inventory Turnover',
    metric: 'Inventory Turnover',
    unit: KpiUnit.Number,
    category: KpiCategory.Inventory,
    platforms: [Platform.Amazon, Platform.Shopify, Platform.General],
    description: 'The number of times inventory is sold and replaced in a period. Higher values indicate efficient inventory management.\n\nCalculation: Cost of Goods Sold / Average Inventory Value'
  },
  { 
    title: 'Out of Stock Rate',
    metric: 'Out of Stock Rate',
    unit: KpiUnit.Percentage,
    category: KpiCategory.Inventory,
    platforms: [Platform.Amazon, Platform.Shopify],
    description: 'The percentage of time products are unavailable due to stock depletion. Lower values indicate better inventory planning.\n\nCalculation: (Out of Stock Time / Total Time) × 100'
  }
];

// Group metrics by category
const METRICS_BY_CATEGORY = METRICS_CONFIG.reduce((acc, metric) => {
  if (!acc[metric.category]) {
    acc[metric.category] = [];
  }
  acc[metric.category].push(metric);
  return acc;
}, {} as Record<KpiCategory, MetricConfig[]>);

// We're using the BrandDataItem interface from src/config/brands.ts

export default function Analysis() {
  const { selectedBrand, availableBrands } = useBrand();
  const [data, setData] = useState<BrandDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comparisonBrand, setComparisonBrand] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'All'>('All');
  const [selectedDate, setSelectedDate] = useState<{ month: string; year: string }>({ month: '', year: '' });
  const [availableDates, setAvailableDates] = useState<{ month: string; year: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Load data from all three CSV files
        const dataFiles = [
          { path: '/data/Amazon - KPIs Table - ChatGPT Extract.csv', platform: Platform.Amazon },
          { path: '/data/Shopify - KPIs Table - ChatGPT Extract.csv', platform: Platform.Shopify },
          { path: '/data/KPIs Table - ChatGPT Extract.csv', platform: Platform.General }
        ];
        
        let allData: BrandDataItem[] = [];
        
        for (const file of dataFiles) {
          const response = await fetch(file.path);
          if (!response.ok) {
            console.warn(`Failed to fetch data from ${file.path}: ${response.statusText}`);
            continue;
          }
          
          const text = await response.text();
          const { headers, rows } = parseCSV(text);
          
          const parsedData = rows.map(values => {
            const item: Record<string, string | number> = {
              Brand: '',
              'KPI Name': '',
              'KPI Unit': '',
              'Month of Date': '',
              'Year of Date': '',
              'This Period Value': 0,
              Platform: file.platform
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
            
            return item as BrandDataItem;
          });
          
          allData = [...allData, ...parsedData];
        }
        
        setData(allData);
        
        // Get unique dates
        const dates = Array.from(new Set(allData.map(item => `${item['Month of Date']}-${item['Year of Date']}`)))
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
  }, [selectedBrand, selectedDate.month]);

  const getFilteredData = () => {
    return data.filter(item => 
      (selectedPlatform === 'All' || item.Platform === selectedPlatform) &&
      (selectedDate.month === '' || item['Month of Date'] === selectedDate.month) &&
      (selectedDate.year === '' || item['Year of Date'] === selectedDate.year)
    );
  };

  const getValue = (brand: string, metric: string): { value: number | string; displayValue: string } => {
    const filteredData = getFilteredData();
    const brandData = filteredData.filter(item =>
      item.Brand === brand &&
      item['KPI Name'] === metric
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

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg text-gray-700">Loading data...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 m-6">
      <h3 className="text-xl font-semibold text-red-700 mb-2">Error Loading Data</h3>
      <p className="text-red-600">{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Retry
      </button>
    </div>
  );

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
          <div className="relative">
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value as Platform | 'All')}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="All">All Platforms</option>
              <option value={Platform.Amazon}>Amazon</option>
              <option value={Platform.Shopify}>Shopify</option>
              <option value={Platform.General}>General</option>
            </select>
          </div>
        </div>
      </div>

      {/* AI Analysis */}
      <AIAnalysis
        selectedBrand={selectedBrand}
        comparisonBrand={comparisonBrand}
        data={getFilteredData()}
      />

      {/* Metrics by Category */}
      {Object.entries(METRICS_BY_CATEGORY).map(([category, metrics]) => {
        // Filter metrics by selected platform
        const filteredMetrics = selectedPlatform === 'All' 
          ? metrics 
          : metrics.filter(m => m.platforms.includes(selectedPlatform as Platform));
        
        if (filteredMetrics.length === 0) return null;
        
        return (
          <div key={category} className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">{category} Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
              {filteredMetrics.map(({ title, metric, unit, description }) => {
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
            
            {/* Comparison Charts */}
            {comparisonBrand && filteredMetrics.length >= 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">{filteredMetrics[0].title} Trend</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Comparison charts will be available in the next update.
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">{filteredMetrics[1].title} Trend</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Comparison charts will be available in the next update.
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}