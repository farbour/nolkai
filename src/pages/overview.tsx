import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
// file path: src/pages/overview.tsx
import React, { useEffect, useMemo, useState } from 'react';

import { Layout } from '../components/Layout';

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

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const YEARS = ['2024', '2025'];

const OverviewPage: React.FC = () => {
  const [data, setData] = useState<CSVRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return {
      month: MONTHS[now.getMonth()],
      year: now.getFullYear().toString()
    };
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data.csv');
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
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
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
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

  const calculateBrandMetrics = (filteredData: CSVRow[]): BrandMetrics[] => {
    const brandMetrics: { [key: string]: BrandMetrics } = {};

    filteredData.forEach(row => {
      if (row['Month of Date'] === selectedMonth.month && row['Year of Date'] === selectedMonth.year) {
        if (!brandMetrics[row.Brand]) {
          brandMetrics[row.Brand] = {
            brand: row.Brand,
            revenue: 0,
            margin: 0,
            orders: 0,
            conversion: 0
          };
        }

        let value = row['This Period Value'] || '0';
        // Remove any commas from numbers
        value = value.replace(/,/g, '');
        const numericValue = parseFloat(value);

        switch (row['KPI Name']) {
          case 'Gross Revenue':
            brandMetrics[row.Brand].revenue = numericValue;
            break;
          case 'Gross Margin':
            brandMetrics[row.Brand].margin = numericValue;
            break;
          case 'D2C Orders':
            brandMetrics[row.Brand].orders = numericValue;
            break;
          case 'Conversion Rate':
            brandMetrics[row.Brand].conversion = numericValue;
            break;
        }
      }
    });

    return Object.values(brandMetrics).sort((a, b) => b.revenue - a.revenue);
  };

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

  const brandMetrics = useMemo(() => calculateBrandMetrics(data), [data, selectedMonth.month, selectedMonth.year]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nolk-green mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-nolk-green">Brand Performance Overview</h2>
          <div className="flex gap-4">
            <select
              value={selectedMonth.month}
              onChange={(e) => setSelectedMonth(prev => ({ ...prev, month: e.target.value }))}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nolk-green/20 focus:border-nolk-green"
            >
              {MONTHS.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <select
              value={selectedMonth.year}
              onChange={(e) => setSelectedMonth(prev => ({ ...prev, year: e.target.value }))}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nolk-green/20 focus:border-nolk-green"
            >
              {YEARS.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-5">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={brandMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="brand" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => formatValue(value, 'currency')}
                  />
                  <Bar dataKey="revenue" fill="#344C45" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Brand Metrics
            </h3>
          </div>
          <div className="px-6 py-5">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Brand
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Margin
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conversion Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {brandMetrics.map((brand) => (
                    <tr key={brand.brand} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {brand.brand}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatValue(brand.revenue, 'currency')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatValue(brand.margin, 'currency')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatValue(brand.orders, 'number')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatValue(brand.conversion, 'percentage')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OverviewPage;