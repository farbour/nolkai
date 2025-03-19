import "react-datepicker/dist/react-datepicker.css";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
// file path: src/components/ExecutiveOverview.tsx
import React, { useCallback, useMemo, useState } from 'react';
import { format, subMonths } from 'date-fns';

import DatePicker from 'react-datepicker';
import { Tab } from '@headlessui/react';

interface CSVRow {
  Brand: string;
  'KPI Name': string;
  'KPI Unit': string;
  'Month of Date': string;
  'Year of Date': string;
  'This Period Value': string;
}

interface Metric {
  name: string;
  value: number;
  previousValue: number;
  change: number;
  format: 'currency' | 'percentage' | 'number';
}

interface Props {
  data: CSVRow[];
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const ExecutiveOverview: React.FC<Props> = ({ data }) => {
  // Initialize with last 12 months
  const endDate = new Date();
  const startDate = subMonths(endDate, 11);
  
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([startDate, endDate]);

  const brands = useMemo(() => 
    [...new Set(data.map(item => item.Brand))],
    [data]
  );

  const getMonthYearFromDate = (date: Date) => ({
    month: MONTHS[date.getMonth()],
    year: date.getFullYear().toString()
  });

  const isDateInRange = (monthStr: string, yearStr: string, start: Date | null, end: Date | null) => {
    if (!start || !end) return true;
    
    const month = MONTHS.indexOf(monthStr);
    const year = parseInt(yearStr);
    const date = new Date(year, month);
    
    return date >= start && date <= end;
  };

  const calculateMetrics = useCallback((filteredData: CSVRow[]): Metric[] => {
    const currentDate = new Date();
    const { month: currentMonth, year: currentYear } = getMonthYearFromDate(currentDate);
    const previousDate = subMonths(currentDate, 1);
    const { month: previousMonth, year: previousYear } = getMonthYearFromDate(previousDate);

    const currentPeriodData = filteredData.filter(item => 
      item['Month of Date'] === currentMonth && 
      item['Year of Date'] === currentYear
    );

    const previousPeriodData = filteredData.filter(item => 
      item['Month of Date'] === previousMonth && 
      item['Year of Date'] === previousYear
    );

    const calculateTotal = (data: CSVRow[], kpiName: string) => 
      data
        .filter(item => item['KPI Name'] === kpiName)
        .reduce((sum, item) => sum + parseFloat(item['This Period Value'] || '0'), 0);

    const calculateAverage = (data: CSVRow[], kpiName: string) => {
      const values = data.filter(item => item['KPI Name'] === kpiName);
      return values.length > 0 
        ? values.reduce((sum, item) => sum + parseFloat(item['This Period Value'] || '0'), 0) / values.length 
        : 0;
    };

    const metrics: Metric[] = [
      {
        name: 'Total Revenue',
        value: calculateTotal(currentPeriodData, 'Gross Revenue'),
        previousValue: calculateTotal(previousPeriodData, 'Gross Revenue'),
        change: 0,
        format: 'currency'
      },
      {
        name: 'Gross Margin',
        value: calculateTotal(currentPeriodData, 'Gross Margin'),
        previousValue: calculateTotal(previousPeriodData, 'Gross Margin'),
        change: 0,
        format: 'currency'
      },
      {
        name: 'Net Revenue',
        value: calculateTotal(currentPeriodData, 'Net Revenue'),
        previousValue: calculateTotal(previousPeriodData, 'Net Revenue'),
        change: 0,
        format: 'currency'
      },
      {
        name: 'Conversion Rate',
        value: calculateAverage(currentPeriodData, 'Conversion Rate'),
        previousValue: calculateAverage(previousPeriodData, 'Conversion Rate'),
        change: 0,
        format: 'percentage'
      }
    ];

    metrics.forEach(metric => {
      metric.change = metric.previousValue !== 0 
        ? ((metric.value - metric.previousValue) / metric.previousValue) * 100 
        : 0;
    });

    return metrics;
  }, []);

  const filteredData = useMemo(() => {
    let filtered = data;
    
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(item => selectedBrands.includes(item.Brand));
    }
    
    const [start, end] = dateRange;
    if (start && end) {
      filtered = filtered.filter(item => 
        isDateInRange(item['Month of Date'], item['Year of Date'], start, end)
      );
    }
    
    return filtered;
  }, [data, selectedBrands, dateRange]);

  const metrics = useMemo(() => 
    calculateMetrics(filteredData),
    [filteredData, calculateMetrics]
  );

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

  const chartData = useMemo(() => {
    const monthlyData: { [key: string]: { [key: string]: number } } = {};
    
    filteredData.forEach(item => {
      const key = `${item['Month of Date']} ${item['Year of Date']}`;
      if (!monthlyData[key]) {
        monthlyData[key] = {
          revenue: 0,
          margin: 0,
          orders: 0
        };
      }
      
      const value = parseFloat(item['This Period Value'] || '0');
      switch (item['KPI Name']) {
        case 'Gross Revenue':
          monthlyData[key].revenue += value;
          break;
        case 'Gross Margin':
          monthlyData[key].margin += value;
          break;
        case 'D2C Orders':
          monthlyData[key].orders += value;
          break;
      }
    });

    return Object.entries(monthlyData)
      .map(([date, values]) => ({
        date: format(new Date(date), 'MMM yyyy'),
        ...values
      }))
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
  }, [filteredData]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-nolk-green">Performance Metrics</h2>
        <div className="flex gap-4">
          <div className="w-72">
            <select
              multiple
              value={selectedBrands}
              onChange={(e) => setSelectedBrands(Array.from(e.target.selectedOptions, option => option.value))}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-nolk-green/20 focus:border-nolk-green"
            >
              {brands.map(brand => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>
          <div className="w-72">
            <DatePicker
              selectsRange={true}
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              onChange={(update: [Date | null, Date | null]) => setDateRange(update)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-nolk-green/20 focus:border-nolk-green"
              placeholderText="Select date range"
              dateFormat="MMM yyyy"
              showMonthYearPicker
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.name} className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">
              {metric.name}
            </h3>
            <p className="text-3xl font-semibold mt-2 text-nolk-green">
              {formatValue(metric.value, metric.format)}
            </p>
            <div className={`text-sm mt-2 ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metric.change >= 0 ? '↑' : '↓'} {Math.abs(metric.change).toFixed(2)}%
              <span className="text-gray-500 ml-2">vs previous period</span>
            </div>
          </div>
        ))}
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1">
          {['Revenue', 'Margins', 'Orders', 'Conversion'].map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors
                ${selected 
                  ? 'bg-white shadow text-nolk-green'
                  : 'text-gray-500 hover:bg-white/[0.12] hover:text-gray-700'
                }`
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-4">
          <Tab.Panel>
            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
              <h3 className="text-lg font-medium mb-4 text-nolk-green">Revenue Trend</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6B7280"
                      tick={{ fill: '#6B7280' }}
                    />
                    <YAxis 
                      stroke="#6B7280"
                      tick={{ fill: '#6B7280' }}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value: number) => formatValue(value, 'currency')}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#344C45" 
                      name="Revenue"
                      strokeWidth={2}
                      dot={{ fill: '#344C45', r: 4 }}
                      activeDot={{ r: 6, fill: '#344C45' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
              <h3 className="text-lg font-medium mb-4 text-nolk-green">Margin Trend</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6B7280"
                      tick={{ fill: '#6B7280' }}
                    />
                    <YAxis 
                      stroke="#6B7280"
                      tick={{ fill: '#6B7280' }}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value: number) => formatValue(value, 'currency')}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="margin" 
                      stroke="#344C45" 
                      name="Margin"
                      strokeWidth={2}
                      dot={{ fill: '#344C45', r: 4 }}
                      activeDot={{ r: 6, fill: '#344C45' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
              <h3 className="text-lg font-medium mb-4 text-nolk-green">Orders Trend</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6B7280"
                      tick={{ fill: '#6B7280' }}
                    />
                    <YAxis 
                      stroke="#6B7280"
                      tick={{ fill: '#6B7280' }}
                    />
                    <Tooltip 
                      formatter={(value: number) => value.toLocaleString()}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="orders" 
                      stroke="#344C45" 
                      name="Orders"
                      strokeWidth={2}
                      dot={{ fill: '#344C45', r: 4 }}
                      activeDot={{ r: 6, fill: '#344C45' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
              <h3 className="text-lg font-medium mb-4 text-nolk-green">Conversion Rate</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6B7280"
                      tick={{ fill: '#6B7280' }}
                    />
                    <YAxis 
                      stroke="#6B7280"
                      tick={{ fill: '#6B7280' }}
                      tickFormatter={(value) => `${value.toFixed(2)}%`}
                    />
                    <Tooltip 
                      formatter={(value: number) => `${value.toFixed(2)}%`}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="conversion" 
                      stroke="#344C45" 
                      name="Conversion Rate"
                      strokeWidth={2}
                      dot={{ fill: '#344C45', r: 4 }}
                      activeDot={{ r: 6, fill: '#344C45' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};