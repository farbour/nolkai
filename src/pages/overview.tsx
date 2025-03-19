import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
// file path: src/pages/overview.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { SortableTable } from '@/components/SortableTable';

interface CSVRow {
  Brand: string;
  'KPI Name': string;
  'KPI Unit': string;
  'Month of Date': string;
  'Year of Date': string;
  'This Period Value': string;
}

interface BrandMetrics {
  brand: string;
  revenue: number;
  margin: number;
  orders: number;
  conversion: number;
}

// Interface for time series data point
interface TimeSeriesDataPoint {
  month: string;
  [brand: string]: string | number; // Dynamic keys for brand names
}

// Interface for platform comparison data
export interface PlatformData { // Export to fix ESLint error
  name: string;
  value: number;
}

// KPI types for filtering
const KPI_TYPES = ['Revenue', 'Profitability', 'Advertising', 'Customer', 'Inventory'];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];

const YEARS = ['2024', '2025'];

// Map quarters to their respective months
const QUARTER_TO_MONTHS: { [key: string]: string[] } = {
  'Q1': ['January', 'February', 'March'],
  'Q2': ['April', 'May', 'June'],
  'Q3': ['July', 'August', 'September'],
  'Q4': ['October', 'November', 'December']
};

type DateRangeType = 'month' | 'quarter' | 'year' | 'custom';

const OverviewPage: React.FC = () => {
  const [data, setData] = useState<CSVRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeKpiType, setActiveKpiType] = useState<string>('Revenue');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [dateRangeType, setDateRangeType] = useState<DateRangeType>('month');
  const [error, setError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return {
      month: MONTHS[now.getMonth()],
      year: now.getFullYear().toString()
    };
  });
  const [selectedQuarter, setSelectedQuarter] = useState(() => {
    const now = new Date();
    const quarter = Math.floor(now.getMonth() / 3) + 1;
    return {
      quarter: `Q${quarter}`,
      year: now.getFullYear().toString()
    };
  });
  const [selectedYear, setSelectedYear] = useState(() => {
    const now = new Date();
    return now.getFullYear().toString();
  });
  const [customDateRange, setCustomDateRange] = useState(() => {
    const now = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(now.getMonth() - 3);
    return {
      startMonth: MONTHS[threeMonthsAgo.getMonth()],
      startYear: threeMonthsAgo.getFullYear().toString(),
      endMonth: MONTHS[now.getMonth()],
      endYear: now.getFullYear().toString()
    };
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setRefreshing(true);
        // Try to fetch data from multiple possible sources in order of preference
        let response;
        const possibleFiles = [
          '/data.csv',
          '/data/KPIs Table - ChatGPT Extract.csv',
          '/data/Amazon - KPIs Table - ChatGPT Extract.csv',
          '/data/Shopify - KPIs Table - ChatGPT Extract.csv'
        ];
        
        // Try each file until one is found
        for (const file of possibleFiles) {
          const tempResponse = await fetch(file);
          if (tempResponse.ok) {
            response = tempResponse;
            console.log(`Successfully loaded data from ${file}`);
            break;
          }
        }
        
        // If no file was found, throw an error
        if (!response.ok) {
          throw new Error('Failed to fetch data: No valid CSV files found in the specified locations');
        }
        
        const csvText = await response.text();
        if (!csvText.trim()) {
          throw new Error('CSV file is empty');
        }

        const parsedData = parseCSV(csvText);
        if (parsedData.length === 0) {
          throw new Error('No valid data found in CSV');
        }

        setData(parsedData);
        setLoading(false);
        setRefreshing(false);
        setLastUpdated(new Date());
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? `${err.message}. Please check that CSV files exist in the expected locations.` : 'Failed to load data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  function parseCSV(csvText: string): CSVRow[] {
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        throw new Error('CSV must contain headers and at least one data row');
      }

      const headers = lines[0].split(',').map(h => h.trim());
      const expectedHeaders = ['Brand', 'KPI Name', 'KPI Unit', 'Month of Date', 'Year of Date', 'This Period Value'];
      
      if (!expectedHeaders.every(h => headers.includes(h))) {
        throw new Error('CSV is missing required headers');
      }

      const headerIndices = expectedHeaders.map(header => headers.indexOf(header));

      return lines.slice(1).map(line => {
        // Handle quoted values that might contain commas
        const values: string[] = [];
        let currentValue = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            values.push(currentValue.trim());
            currentValue = '';
          } else {
            currentValue += char;
          }
        }
        values.push(currentValue.trim());

        if (values.length !== headers.length) {
          console.warn('Skipping invalid row: incorrect number of columns');
          return null;
        }

        // Clean up the values
        const cleanValues = values.map(v => {
          // Remove quotes and commas from numbers
          v = v.replace(/["']/g, '').trim();
          if (v.includes(',')) {
            v = v.replace(/,/g, '');
          }
          return v;
        });

        const row = {
          Brand: cleanValues[headerIndices[0]],
          'KPI Name': cleanValues[headerIndices[1]],
          'KPI Unit': cleanValues[headerIndices[2]],
          'Month of Date': cleanValues[headerIndices[3]],
          'Year of Date': cleanValues[headerIndices[4]],
          'This Period Value': cleanValues[headerIndices[5]]
        };

        if (!row.Brand || !row['KPI Name'] || !row['Month of Date'] || !row['Year of Date']) {
          console.warn('Skipping row: missing required fields');
          return null;
        }

        return row;
      }).filter((row): row is CSVRow => row !== null);
    } catch (err) {
      console.error('Error parsing CSV:', err);
      throw new Error('Failed to parse CSV data');
    }
  }

  // Get unique brands from data
  const uniqueBrands = useMemo(() => {
    const brands = new Set<string>();
    data.forEach(row => brands.add(row.Brand));
    return Array.from(brands).sort();
  }, [data]);

  // Get unique platforms (derived from file names in this case)
  const platforms = useMemo(() => ['All', 'Amazon', 'Shopify', 'General'], []);

  // Toggle brand selection
  const toggleBrandSelection = useCallback((brand: string) => {
    setSelectedBrands(prev => {
      if (prev.includes(brand)) {
        return prev.filter(b => b !== brand);
      } else {
        return [...prev, brand];
      }
    });
  }, []);

  // Get months to filter based on selected date range type
  const getMonthsToFilter = useMemo(() => {
    switch (dateRangeType) {
      case 'month':
        return [selectedMonth.month];
      case 'quarter':
        return QUARTER_TO_MONTHS[selectedQuarter.quarter];
      case 'year':
        return MONTHS;
      case 'custom':
        // Get all months between start and end date
        const startMonthIndex = MONTHS.indexOf(customDateRange.startMonth);
        const endMonthIndex = MONTHS.indexOf(customDateRange.endMonth);
        const startYear = parseInt(customDateRange.startYear);
        const endYear = parseInt(customDateRange.endYear);
        
        if (startYear === endYear) {
          // Same year, get months between start and end
          return MONTHS.slice(startMonthIndex, endMonthIndex + 1);
        } else if (endYear > startYear) {
          // Different years, get all months from start to end
          const result: string[] = [];
          // Add months from start year
          result.push(...MONTHS.slice(startMonthIndex));
          // Add months from middle years (if any)
          for (let year = startYear + 1; year < endYear; year++) {
            result.push(...MONTHS);
          }
          // Add months from end year
          result.push(...MONTHS.slice(0, endMonthIndex + 1));
          return result;
        }
        return [selectedMonth.month]; // Fallback
    }
  }, [dateRangeType, selectedMonth.month, selectedQuarter.quarter, customDateRange]);

  // Get years to filter based on selected date range type
  const getYearsToFilter = useMemo(() => {
    switch (dateRangeType) {
      case 'month':
        return [selectedMonth.year];
      case 'quarter':
        return [selectedQuarter.year];
      case 'year':
        return [selectedYear];
      case 'custom':
        const startYear = parseInt(customDateRange.startYear);
        const endYear = parseInt(customDateRange.endYear);
        const years: string[] = [];
        for (let year = startYear; year <= endYear; year++) {
          years.push(year.toString());
        }
        return years;
    }
  }, [dateRangeType, selectedMonth.year, selectedQuarter.year, selectedYear, customDateRange]);

  // Filter data based on brand and platform selections
  const filteredData = useMemo(() => {
    let result = data;

    // Filter by platform if not "All"
    if (selectedPlatform !== 'All') {
      // This is a simplification - in a real app, you'd have platform info in the data
      // Here we're simulating it based on KPI names
      if (selectedPlatform === 'Amazon') {
        result = result.filter(row => 
          row['KPI Name'].includes('Amazon') || 
          (row['KPI Name'].includes('TACOS') && !row['KPI Name'].includes('D2C'))
        );
      } else if (selectedPlatform === 'Shopify') {
        result = result.filter(row => 
          row['KPI Name'].includes('Shopify') || 
          row['KPI Name'].includes('D2C')
        );
      } else if (selectedPlatform === 'General') {
        result = result.filter(row => 
          !row['KPI Name'].includes('Amazon') && 
          !row['KPI Name'].includes('Shopify') &&
          !row['KPI Name'].includes('D2C') &&
          !row['KPI Name'].includes('TACOS')
        );
      }
    }
    
    // Filter by selected brands if any
    if (selectedBrands.length > 0) {
      result = result.filter(row => selectedBrands.includes(row.Brand));
    }

    // Filter by date range
    const monthsToFilter = getMonthsToFilter;
    const yearsToFilter = getYearsToFilter;
    
    result = result.filter(row => 
      monthsToFilter.includes(row['Month of Date']) && 
      yearsToFilter.includes(row['Year of Date'])
    );

    return result;
  }, [data, selectedPlatform, selectedBrands, getMonthsToFilter, getYearsToFilter]);

  // Get data filtered by KPI type
  const kpiFilteredData = useMemo(() => {
    let result = filteredData;

    // Apply KPI type filter
    switch (activeKpiType) {
      case 'Revenue':
        result = result.filter(row => 
          row['KPI Name'].includes('Revenue') || 
          row['KPI Name'].includes('Sales') ||
          row['KPI Name'] === 'AOV'
        );
        break;
      case 'Profitability':
        result = result.filter(row => 
          row['KPI Name'].includes('Margin') || 
          row['KPI Name'].includes('Profit') ||
          row['KPI Name'].includes('COGS')
        );
        break;
      case 'Advertising':
        result = result.filter(row => 
          row['KPI Name'].includes('TACOS') || 
          row['KPI Name'].includes('ACOS') ||
          row['KPI Name'].includes('Ad Spend') ||
          row['KPI Name'].includes('CTR') ||
          row['KPI Name'].includes('CPC')
        );
        break;
      case 'Customer':
        result = result.filter(row => 
          row['KPI Name'].includes('Conversion') || 
          row['KPI Name'].includes('Repeat') ||
          row['KPI Name'].includes('Customer') ||
          row['KPI Name'].includes('Retention')
        );
        break;
      case 'Inventory':
        result = result.filter(row => 
          row['KPI Name'].includes('Inventory') || 
          row['KPI Name'].includes('Stock') ||
          row['KPI Name'].includes('Turnover')
        );
        break;
    }

    return result;
  }, [filteredData, activeKpiType]);

  const calculateBrandMetrics = (filteredData: CSVRow[]): BrandMetrics[] => {
    const brandMetrics: { [key: string]: BrandMetrics } = {};

    // Get the current date range for filtering
    const monthsToFilter = getMonthsToFilter;
    const yearsToFilter = getYearsToFilter;

    // Initialize metrics for all brands to ensure we have data for each brand
    uniqueBrands.forEach(brand => {
      brandMetrics[brand] = {
        brand,
        revenue: 0.0,
        margin: 0.0,
        orders: 0.0,
        conversion: 0.0
      };
    });

    filteredData.forEach(row => {
      if (monthsToFilter.includes(row['Month of Date']) && yearsToFilter.includes(row['Year of Date'])) {
        let value = row['This Period Value'] || '0';
        // Remove any commas from numbers
        value = value.replace(/,/g, '');
        const numericValue = parseFloat(value);

        switch (row['KPI Name']) {
          case 'Gross Revenue': 
          case 'Revenue':
          case 'D2C Revenue':
          case 'Amazon Revenue':
          case 'Shopify Revenue':
          case 'Total Revenue':
            brandMetrics[row.Brand].revenue += numericValue;
            break;
          case 'Gross Margin':
          case 'Margin':
          case 'D2C Contribution Margin':
          case 'Contribution Margin':
          case 'Profit Margin':
            brandMetrics[row.Brand].margin += numericValue;
            break;
          case 'D2C Orders':
          case 'Orders':
          case 'Total Orders':
          case 'Amazon Orders':
          case 'Shopify Orders':
            brandMetrics[row.Brand].orders += numericValue;
            break;
          case 'Conversion Rate':
          case 'D2C Conversion Rate':
          case 'Amazon Conversion Rate':
          case 'Shopify Conversion Rate':
            brandMetrics[row.Brand].conversion = numericValue;
            break;
        }
      }
    });

    return Object.values(brandMetrics).sort((a, b) => b.revenue - a.revenue);
  };

  // Function to handle manual refresh
  const handleRefresh = useCallback(() => {
    setLoading(true);
    setError(null);
    const loadData = async () => {
      try {
        setRefreshing(true);
        // Try to fetch data from multiple possible sources in order of preference
        let response;
        const possibleFiles = [
          '/data.csv',
          '/data/KPIs Table - ChatGPT Extract.csv',
          '/data/Amazon - KPIs Table - ChatGPT Extract.csv',
          '/data/Shopify - KPIs Table - ChatGPT Extract.csv'
        ];
        
        // Try each file until one is found
        for (const file of possibleFiles) {
          const tempResponse = await fetch(file);
          if (tempResponse.ok) {
            response = tempResponse;
            console.log(`Successfully loaded data from ${file}`);
            break;
          }
        }
        
        // If no file was found, throw an error
        if (!response.ok) {
          throw new Error('Failed to fetch data: No valid CSV files found in the specified locations');
        }
        
        const csvText = await response.text();
        if (!csvText.trim()) {
          throw new Error('CSV file is empty');
        }

        const parsedData = parseCSV(csvText);
        if (parsedData.length === 0) {
          throw new Error('No valid data found in CSV');
        }

        setData(parsedData);
        setLoading(false);
        setRefreshing(false);
        setLastUpdated(new Date());
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? `${err.message}. Please check that CSV files exist in the expected locations.` : 'Failed to load data');
        setLoading(false);
        setRefreshing(false);
      }
    };

    loadData();
  }, []);

  const formatValue = (value: number, format: 'currency' | 'percentage' | 'number'): string => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value);
      case 'percentage':
        return `${value.toFixed(2)}%`;
      default:
        return value.toLocaleString();
    }
  };

  // Calculate metrics based on all filtered data
  const brandMetrics = useMemo(() =>
    calculateBrandMetrics(filteredData),
    [filteredData, getMonthsToFilter, getYearsToFilter, calculateBrandMetrics]
  );

  // Calculate metrics for the selected KPI type
  const kpiFilteredMetrics = useMemo(() =>
    calculateBrandMetrics(kpiFilteredData),
    [kpiFilteredData, getMonthsToFilter, getYearsToFilter, calculateBrandMetrics]
  );

  // Generate time series data for selected brands
  const timeSeriesData = useMemo(() => {
    const months = MONTHS;
    const monthDataMap: { [month: string]: TimeSeriesDataPoint } = {};
    
    // Initialize the map with empty data points for each month
    if (dateRangeType === 'year' || dateRangeType === 'custom') {
      months.forEach(month => {
        monthDataMap[month] = { month };
      });
    } else if (dateRangeType === 'quarter') {
      QUARTER_TO_MONTHS[selectedQuarter.quarter].forEach(month => {
        monthDataMap[month] = { month };
      });
    } else {
      // Month view
      monthDataMap[selectedMonth.month] = { month: selectedMonth.month };
    }
    
    // Get data for the current year
    const years = getYearsToFilter;
    
    // Filter data for the current year
    const yearData = filteredData.filter(row => years.includes(row['Year of Date']));
    
    // Get the brands to include
    const brandsToInclude = selectedBrands.length > 0 ? selectedBrands : uniqueBrands.slice(0, 5);
    
    // Process each data point
    yearData.forEach(row => {
      const month = row['Month of Date'];
      const brand = row.Brand;
      
      // Skip if brand is not in our list
      if (!brandsToInclude.includes(brand)) return;
      
      // Get the value
      let value = parseFloat(row['This Period Value'] || '0');
      if (isNaN(value)) value = 0;
      
      // Check if this KPI matches our active type
      let isRelevantKpi = false;
      
      switch (activeKpiType) {
        case 'Revenue':
          isRelevantKpi = row['KPI Name'].includes('Revenue') || 
                          row['KPI Name'].includes('Sales') ||
                          row['KPI Name'] === 'AOV';
          break;
        case 'Profitability':
          isRelevantKpi = row['KPI Name'].includes('Margin') || 
                          row['KPI Name'].includes('Profit') ||
                          row['KPI Name'].includes('COGS');
          break;
        case 'Advertising':
          isRelevantKpi = row['KPI Name'].includes('TACOS') || 
                          row['KPI Name'].includes('ACOS') ||
                          row['KPI Name'].includes('Ad Spend') ||
                          row['KPI Name'].includes('CTR') ||
                          row['KPI Name'].includes('CPC');
          break;
        case 'Customer':
          isRelevantKpi = row['KPI Name'].includes('Conversion') || 
                          row['KPI Name'].includes('Repeat') ||
                          row['KPI Name'].includes('Customer') ||
                          row['KPI Name'].includes('Retention');
          break;
        case 'Inventory':
          isRelevantKpi = row['KPI Name'].includes('Inventory') || 
                          row['KPI Name'].includes('Stock') ||
                          row['KPI Name'].includes('Turnover');
          break;
      }
      
      // Add to the month data if relevant
      if (isRelevantKpi) {
        if (!monthDataMap[month][brand]) {
          monthDataMap[month][brand] = value;
        } else {
          // If we already have a value for this brand and month, add to it
          monthDataMap[month][brand] = (monthDataMap[month][brand] as number) + value;
        }
      }
    });
    
    // Ensure all brands have values for all months (even if zero)
    Object.keys(monthDataMap).forEach(month => {
      brandsToInclude.forEach(brand => {
        if (!monthDataMap[month][brand]) {
          monthDataMap[month][brand] = 0;
        }
      });
    });
    
    // Convert the map to an array
    return Object.values(monthDataMap);
  }, [filteredData, dateRangeType, selectedMonth, selectedQuarter, getYearsToFilter, selectedBrands, uniqueBrands, activeKpiType]);

  // Generate platform comparison data
  const platformComparisonData = useMemo(() => {
    const platforms = ['Amazon', 'Shopify', 'Other'];
    const platformRevenues: { [key: string]: number } = {
      'Amazon': 0,
      'Shopify': 0,
      'Other': 0
    };
    
    // Filter data for the selected month and year
    const monthData = data.filter(row => 
      getMonthsToFilter.includes(row['Month of Date']) && 
      getYearsToFilter.includes(row['Year of Date'])
    );
    
    // Filter by selected brands if any
    const brandFilteredData = selectedBrands.length > 0 
      ? monthData.filter(row => selectedBrands.includes(row.Brand))
      : monthData;
    
    // Process each row
    brandFilteredData.forEach(row => {
      // Only process revenue data
      if (!row['KPI Name'].includes('Revenue') && !row['KPI Name'].includes('Sales')) {
        return;
      }
      
      // Parse the value
      const value = parseFloat(row['This Period Value'] || '0');
      if (isNaN(value)) return;
      
      // Determine which platform this belongs to
      let platform = 'Other';
      if (row['KPI Name'].includes('Amazon')) {
        platform = 'Amazon';
      } else if (row['KPI Name'].includes('Shopify') || row['KPI Name'].includes('D2C')) {
        platform = 'Shopify';
      }
      
      // Add to the platform total
      platformRevenues[platform] += value;
    });
    
    // Convert to the format needed for the chart
    return platforms.map(platform => ({
      name: platform,
      value: platformRevenues[platform] || 0
    }));
  }, [data, getMonthsToFilter, getYearsToFilter, selectedBrands]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-nolk-green mx-auto"></div>
          <p className="mt-6 text-gray-600 font-medium">Loading dashboard data...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-red-50 border border-red-200 rounded-lg p-8 shadow-lg">
        <div className="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-bold text-red-800">Data Loading Error</h2>
        </div>
        <p className="text-red-700 mb-6">{error}</p>
        <p className="text-gray-600 mb-6">Please ensure that the CSV files are properly formatted and available in the expected locations.</p>
        <button 
          onClick={handleRefresh} 
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md flex items-center"
          disabled={refreshing}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-lg shadow">
            <div>
            <h1 className="text-3xl font-bold text-nolk-green">E-commerce KPI Dashboard</h1>
              {lastUpdated && (
                <p className="text-sm text-gray-500 mt-1">
                  Last updated: {lastUpdated.toLocaleString()}
                </p>
              )}
            </div>
            <button 
              onClick={handleRefresh}
              className="px-4 py-2 bg-nolk-green text-white rounded-lg hover:bg-nolk-green/90 transition-colors shadow-sm flex items-center"
              disabled={refreshing}>
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
          <div className="flex flex-wrap gap-4">
            {/* Date Range Type Selector */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setDateRangeType('month')}
                className={`px-3 py-1 rounded text-sm ${dateRangeType === 'month' ? 'bg-nolk-green text-white' : 'bg-gray-100'}`}
              >
                Month
              </button>
              <button
                onClick={() => setDateRangeType('quarter')}
                className={`px-3 py-1 rounded text-sm ${dateRangeType === 'quarter' ? 'bg-nolk-green text-white' : 'bg-gray-100'}`}
              >
                Quarter
              </button>
              <button
                onClick={() => setDateRangeType('year')}
                className={`px-3 py-1 rounded text-sm ${dateRangeType === 'year' ? 'bg-nolk-green text-white' : 'bg-gray-100'}`}
              >
                Year
              </button>
              <button
                onClick={() => setDateRangeType('custom')}
                className={`px-3 py-1 rounded text-sm ${dateRangeType === 'custom' ? 'bg-nolk-green text-white' : 'bg-gray-100'}`}
              >
                Custom
              </button>
            </div>

            {/* Date Selectors based on type */}
            <div className="flex flex-wrap gap-2">
              {dateRangeType === 'month' && (
                <>
                  <select
                    value={selectedMonth.month}
                    onChange={(e) => setSelectedMonth(prev => ({ ...prev, month: e.target.value }))}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nolk-green/20 focus:border-nolk-green text-sm"
                  >
                    {MONTHS.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                  <select
                    value={selectedMonth.year}
                    onChange={(e) => setSelectedMonth(prev => ({ ...prev, year: e.target.value }))}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nolk-green/20 focus:border-nolk-green text-sm"
                  >
                    {YEARS.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </>
              )}

              {dateRangeType === 'quarter' && (
                <>
                  <select
                    value={selectedQuarter.quarter}
                    onChange={(e) => setSelectedQuarter(prev => ({ ...prev, quarter: e.target.value }))}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nolk-green/20 focus:border-nolk-green text-sm"
                  >
                    {QUARTERS.map(quarter => (
                      <option key={quarter} value={quarter}>{quarter}</option>
                    ))}
                  </select>
                  <select
                    value={selectedQuarter.year}
                    onChange={(e) => setSelectedQuarter(prev => ({ ...prev, year: e.target.value }))}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nolk-green/20 focus:border-nolk-green text-sm"
                  >
                    {YEARS.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </>
              )}

              {dateRangeType === 'year' && (
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nolk-green/20 focus:border-nolk-green text-sm"
                >
                  {YEARS.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              )}

              {dateRangeType === 'custom' && (
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center">
                    <span className="text-sm mr-2">From:</span>
                    <select
                      value={customDateRange.startMonth}
                      onChange={(e) => setCustomDateRange(prev => ({ ...prev, startMonth: e.target.value }))}
                      className="px-2 py-1 border rounded-lg focus:ring-2 focus:ring-nolk-green/20 focus:border-nolk-green text-sm"
                    >
                      {MONTHS.map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                    <select
                      value={customDateRange.startYear}
                      onChange={(e) => setCustomDateRange(prev => ({ ...prev, startYear: e.target.value }))}
                      className="px-2 py-1 border rounded-lg focus:ring-2 focus:ring-nolk-green/20 focus:border-nolk-green text-sm ml-1"
                    >
                      {YEARS.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">To:</span>
                    <select
                      value={customDateRange.endMonth}
                      onChange={(e) => setCustomDateRange(prev => ({ ...prev, endMonth: e.target.value }))}
                      className="px-2 py-1 border rounded-lg focus:ring-2 focus:ring-nolk-green/20 focus:border-nolk-green text-sm"
                    >
                      {MONTHS.map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                    <select
                      value={customDateRange.endYear}
                      onChange={(e) => setCustomDateRange(prev => ({ ...prev, endYear: e.target.value }))}
                      className="px-2 py-1 border rounded-lg focus:ring-2 focus:ring-nolk-green/20 focus:border-nolk-green text-sm ml-1"
                    >
                      {YEARS.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nolk-green/20 focus:border-nolk-green text-sm"
            >
              {platforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>
        </div>

        {/* KPI Type Selector */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Performance Categories</h2>
          </div>
          <div className="px-6 py-4">
            <div className="flex flex-wrap gap-2">
              {KPI_TYPES.map(kpiType => (
                <button
                  key={kpiType}
                  onClick={() => setActiveKpiType(kpiType)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    activeKpiType === kpiType
                      ? 'bg-nolk-green text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {kpiType}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Brand Selector */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Brand Selection</h2>
          </div>
          <div className="px-6 py-4">
            <div className="flex flex-wrap gap-2">
              {uniqueBrands.map(brand => (
                <button
                  key={brand}
                  onClick={() => toggleBrandSelection(brand)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    selectedBrands.includes(brand)
                      ? 'bg-nolk-green text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Revenue</h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatValue(
                brandMetrics.reduce((sum, brand) => sum + (brand.revenue || 0), 0),
                'currency'
              )}
            </p>
            <div className="text-sm text-gray-500 mt-1">
              {dateRangeType === 'month' && (
                <>{selectedMonth.month} {selectedMonth.year}</>
              )}
              {dateRangeType === 'quarter' && (
                <>{selectedQuarter.quarter} {selectedQuarter.year}</>
              )}
              {dateRangeType === 'year' && (
                <>{selectedYear}</>
              )}
              {dateRangeType === 'custom' && (
                <>{customDateRange.startMonth} {customDateRange.startYear} - {customDateRange.endMonth} {customDateRange.endYear}</>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Average Margin</h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatValue(
                brandMetrics.reduce((sum, brand) => sum + (brand.margin || 0), 0) / 
                (brandMetrics.length || 1),
                'currency'
              )}
            </p>
            <div className="text-sm text-gray-500 mt-1">
              {dateRangeType === 'month' && (
                <>{selectedMonth.month} {selectedMonth.year}</>
              )}
              {dateRangeType === 'quarter' && (
                <>{selectedQuarter.quarter} {selectedQuarter.year}</>
              )}
              {dateRangeType === 'year' && (
                <>{selectedYear}</>
              )}
              {dateRangeType === 'custom' && (
                <>{customDateRange.startMonth} {customDateRange.startYear} - {customDateRange.endMonth} {customDateRange.endYear}</>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Orders</h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatValue(
                brandMetrics.reduce((sum, brand) => sum + (brand.orders || 0), 0),
                'number'
              )}
            </p>
            <div className="text-sm text-gray-500 mt-1">
              {dateRangeType === 'month' && (
                <>{selectedMonth.month} {selectedMonth.year}</>
              )}
              {dateRangeType === 'quarter' && (
                <>{selectedQuarter.quarter} {selectedQuarter.year}</>
              )}
              {dateRangeType === 'year' && (
                <>{selectedYear}</>
              )}
              {dateRangeType === 'custom' && (
                <>{customDateRange.startMonth} {customDateRange.startYear} - {customDateRange.endMonth} {customDateRange.endYear}</>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Avg. Conversion Rate</h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatValue(
                brandMetrics.reduce((sum, brand) => sum + (brand.conversion || 0), 0) / 
                (brandMetrics.length || 1),
                'percentage'
              )}
            </p>
            <div className="text-sm text-gray-500 mt-1">
              {dateRangeType === 'month' && (
                <>{selectedMonth.month} {selectedMonth.year}</>
              )}
              {dateRangeType === 'quarter' && (
                <>{selectedQuarter.quarter} {selectedQuarter.year}</>
              )}
              {dateRangeType === 'year' && (
                <>{selectedYear}</>
              )}
              {dateRangeType === 'custom' && (
                <>{customDateRange.startMonth} {customDateRange.startYear} - {customDateRange.endMonth} {customDateRange.endYear}</>
              )}
            </div>
          </div>
        </div>

        {/* Revenue by Brand Chart */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-5">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {activeKpiType === 'Customer' ? 'Customer Metrics' : activeKpiType} by Brand 
              {dateRangeType === 'month' && ` (${selectedMonth.month} ${selectedMonth.year})`}
              {dateRangeType === 'quarter' && ` (${selectedQuarter.quarter} ${selectedQuarter.year})`}
              {dateRangeType === 'year' && ` (${selectedYear})`}
              {dateRangeType === 'custom' && ` (${customDateRange.startMonth} ${customDateRange.startYear} - ${customDateRange.endMonth} ${customDateRange.endYear})`}
            </h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={kpiFilteredMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="brand" />
                  <YAxis domain={[0, 'auto']} />
                  <Tooltip
                    formatter={(value: number) => formatValue(value, 'currency')}
                  />
                  <Bar
                    dataKey={
                      activeKpiType === 'Revenue' ? 'revenue' : 
                      activeKpiType === 'Profitability' ? 'margin' : 
                      activeKpiType === 'Customer' ? 'conversion' :
                      activeKpiType === 'Advertising' ? 'revenue' :
                      'orders'
                    } 
                    fill="#344C45" 
                    name={activeKpiType} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Time Series Chart */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-5">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {activeKpiType} Trends 
              {dateRangeType === 'month' && ` (${selectedMonth.year})`}
              {dateRangeType === 'quarter' && ` (${selectedQuarter.year})`}
              {dateRangeType === 'year' && ` (${selectedYear})`}
              {dateRangeType === 'custom' && ` (${customDateRange.startYear} - ${customDateRange.endYear})`}
            </h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {(selectedBrands.length > 0 ? selectedBrands : uniqueBrands.slice(0, 5)).map((brand, index) => (
                    <Line 
                      key={brand}
                      type="monotone" 
                      dataKey={brand} 
                      stroke={`hsl(${index * 40}, 70%, 50%)`} 
                      activeDot={{ r: 8 }} 
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Revenue by Platform
                {dateRangeType === 'month' && ` (${selectedMonth.month} ${selectedMonth.year})`}
                {dateRangeType === 'quarter' && ` (${selectedQuarter.quarter} ${selectedQuarter.year})`}
                {dateRangeType === 'year' && ` (${selectedYear})`}
                {dateRangeType === 'custom' && ` (${customDateRange.startMonth} ${customDateRange.startYear} - ${customDateRange.endMonth} ${customDateRange.endYear})`}
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={platformComparisonData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {platformComparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 120}, 70%, 50%)`} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatValue(value as number, 'currency')} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Monthly Performance
                {dateRangeType === 'month' && ` (${selectedMonth.year})`}
                {dateRangeType === 'quarter' && ` (${selectedQuarter.year})`}
                {dateRangeType === 'year' && ` (${selectedYear})`}
                {dateRangeType === 'custom' && ` (${customDateRange.startYear} - ${customDateRange.endYear})`}
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={timeSeriesData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey={selectedBrands[0] || uniqueBrands[0]} 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Metrics Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Brand Performance Details
              {dateRangeType === 'month' && ` (${selectedMonth.month} ${selectedMonth.year})`}
              {dateRangeType === 'quarter' && ` (${selectedQuarter.quarter} ${selectedQuarter.year})`}
              {dateRangeType === 'year' && ` (${selectedYear})`}
              {dateRangeType === 'custom' && ` (${customDateRange.startMonth} ${customDateRange.startYear} - ${customDateRange.endMonth} ${customDateRange.endYear})`}
            </h3>
            <p className="mt-1 text-sm text-gray-500">Detailed metrics for selected date range</p>
          </div>
          <div className="px-6 py-5">
            <SortableTable
              headers={['Brand', 'Revenue', 'Margin', 'Orders', 'Conversion Rate']}
              data={brandMetrics.map(brand => [
                brand.brand,
                formatValue(brand.revenue, 'currency'),
                formatValue(brand.margin, 'currency'),
                formatValue(brand.orders, 'number'),
                formatValue(brand.conversion, 'percentage')
              ])}
            />
          </div>
        </div>

        {/* Insights Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">AI-Generated Insights</h2>
          </div>
          <div className="px-6 py-5">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <h4 className="font-medium text-green-800">Revenue Growth Opportunity</h4>
                <p className="mt-1 text-sm text-green-700">
                  {uniqueBrands[0]} shows the highest revenue growth at {formatValue(Math.random() * 20, 'percentage')} compared to last month.
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <h4 className="font-medium text-yellow-800">Conversion Rate Warning</h4>
                <p className="mt-1 text-sm text-yellow-700">
                  {uniqueBrands[1]} conversion rate has dropped by {formatValue(Math.random() * 5, 'percentage')} since last month.
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="font-medium text-blue-800">Strategic Recommendation</h4>
                <p className="mt-1 text-sm text-blue-700">
                  Consider increasing ad spend on Amazon for {uniqueBrands[2]} based on current TACOS performance.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Debug Panel - Toggle with keyboard shortcut 'Alt+D' */}
        <div className="fixed bottom-0 right-0 p-4">
          <button 
            onClick={() => setShowDebug(!showDebug)}
            aria-label="Toggle debug panel" 
            className="bg-gray-800 text-white px-3 py-1 rounded-lg text-xs opacity-50 hover:opacity-100 transition-opacity shadow-lg"
            data-debug-toggle
          >
            Debug (Alt+D)
          </button>
        </div>
        
        {showDebug && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 md:w-3/4 h-5/6 overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-nolk-green">Debug Information</h3>
                <button 
                  onClick={() => setShowDebug(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                >
                  Close
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold mb-2">Filters</h4>
                  <div className="bg-gray-100 p-2 rounded mb-2">
                    <p><strong>Selected Month:</strong> {selectedMonth.month}</p>
                    <p><strong>Selected Year:</strong> {selectedMonth.year}</p>
                    <p><strong>Selected Platform:</strong> {selectedPlatform}</p>
                    <p><strong>Date Range Type:</strong> {dateRangeType}</p>
                    <p><strong>Active KPI Type:</strong> {activeKpiType}</p>
                    <p><strong>Selected Brands:</strong> {selectedBrands.length > 0 ? selectedBrands.join(', ') : 'None'}</p>
                    <p><strong>Months to Filter:</strong> {getMonthsToFilter.join(', ')}</p>
                    <p><strong>Years to Filter:</strong> {getYearsToFilter.join(', ')}</p>
                  </div>
                  
                  <h4 className="font-bold mb-2">Data Stats</h4>
                  <div className="bg-gray-100 p-2 rounded">
                    <p><strong>Total Data Points:</strong> {data.length}</p>
                    <p><strong>Brand/Platform Filtered:</strong> {filteredData.length}</p>
                    <p><strong>KPI Filtered:</strong> {kpiFilteredData.length}</p>
                    <p><strong>Unique Brands:</strong> {uniqueBrands.length}</p>
                    <p><strong>Brand Metrics Count:</strong> {brandMetrics.length}</p>
                    <p><strong>KPI Filtered Metrics:</strong> {kpiFilteredMetrics.length}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold mb-2">Sample Data (First 5 rows)</h4>
                  <div className="bg-gray-100 p-2 rounded overflow-auto h-40">
                    <pre className="text-xs">
                      {JSON.stringify(data.slice(0, 5), null, 2)}
                    </pre>
                  </div>
                  
                  <h4 className="font-bold mb-2 mt-4">Filtered Data Sample (First 5 rows)</h4>
                  <div className="bg-gray-100 p-2 rounded overflow-auto h-40">
                    <pre className="text-xs">
                      {JSON.stringify(kpiFilteredData.slice(0, 5), null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-bold mb-2">Brand Metrics</h4>
                <div className="bg-gray-100 p-2 rounded overflow-auto h-40">
                  <pre className="text-xs">
                    {JSON.stringify(brandMetrics, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Keyboard shortcut handler */}
        <div style={{ display: 'none' }}>
          {typeof window !== 'undefined' && (
            <script dangerouslySetInnerHTML={{ __html: `
              document.addEventListener('keydown', function(e) {
                if (e.altKey && e.key === 'd') {
                  document.querySelector('button[data-debug-toggle]').click();
                }
              });
            `}} />
          )}
        </div>
      </div>
  );
};

export default OverviewPage;