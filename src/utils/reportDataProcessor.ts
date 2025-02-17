// file path: src/utils/reportDataProcessor.ts
import { parseCSV } from './csvParser';

interface BrandData {
  brand: string;
  metrics: {
    [key: string]: {
      [metric: string]: string | number;
    };
  };
}

export interface ProcessedData {
  kpiData: {
    headers: string[];
    data: (string | number)[][];
  };
  supplyData: {
    headers: string[];
    data: (string | number)[][];
  };
  satisfactionData: {
    headers: string[];
    data: (string | number)[][];
  };
  metrics: {
    revenue: { value: string; change: string };
    grossProfit: { value: string; change: string };
    netProfit: { value: string; change: string };
    cac: { value: string; change: string };
    conversionRate: { value: string; change: string };
  };
}

function formatCurrency(amount: number | null, forceDecimal = false): string {
  if (amount === null) return 'N/A';
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${forceDecimal ? amount.toFixed(2) : amount.toFixed(0)}`;
}

function calculateMonthlyChange(current: number | null, previous: number | null): string {
  if (current === null || previous === null) return 'N/A';
  if (previous === 0) return 'N/A';
  const percentChange = ((current - previous) / Math.abs(previous)) * 100;
  const formattedChange = percentChange.toFixed(1);
  const finalNumber = formattedChange.endsWith('.0') 
    ? percentChange.toFixed(0) 
    : formattedChange;
  return `${percentChange >= 0 ? '+' : ''}${finalNumber}%`;
}

function parseNumericValue(value: string | number | null): number | null {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') return value;
  const cleanValue = value.toString().replace(/[^0-9.-]+/g, '');
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? null : parsed;
}

function formatPercentage(value: number | null): string {
  if (value === null) return 'N/A';
  return `${value.toFixed(1)}%`;
}

export function processReportData(csvContent: string): ProcessedData {
  const { rows } = parseCSV(csvContent);
  const currentMonth = 'January';
  const previousMonth = 'December';
  const currentYear = '2025';
  const previousYear = '2024';

  const brandData: { [key: string]: BrandData } = {};

  // Process rows into brand data
  rows.forEach(row => {
    const [brand, metric, , month, year, value] = row;
    if (!brandData[brand]) {
      brandData[brand] = { brand, metrics: {} };
    }

    const key = `${month}-${year}`;
    if (!brandData[brand].metrics[key]) {
      brandData[brand].metrics[key] = {};
    }

    brandData[brand].metrics[key][metric] = value;
  });

  // Calculate totals for current and previous months
  let currentRevenue = 0;
  let currentGrossMargin = 0;
  let previousRevenue = 0;
  let previousGrossMargin = 0;
  let totalConversionRate = 0;
  let brandCount = 0;
  let totalCurrentCAC = 0;
  let totalPreviousCAC = 0;
  let cacCount = 0;

  Object.values(brandData).forEach(brand => {
    const currentMetrics = brand.metrics[`${currentMonth}-${currentYear}`] || {};
    const previousMetrics = brand.metrics[`${previousMonth}-${previousYear}`] || {};

    // Revenue calculations
    const currentRev = parseNumericValue(currentMetrics['Gross Revenue'] || null);
    const previousRev = parseNumericValue(previousMetrics['Gross Revenue'] || null);
    if (currentRev !== null) currentRevenue += currentRev;
    if (previousRev !== null) previousRevenue += previousRev;

    // Gross Margin calculations
    const currentMargin = parseNumericValue(currentMetrics['D2C Gross Margin'] || null);
    const previousMargin = parseNumericValue(previousMetrics['D2C Gross Margin'] || null);
    if (currentMargin !== null) currentGrossMargin += currentMargin;
    if (previousMargin !== null) previousGrossMargin += previousMargin;

    // Conversion Rate calculation
    const convRate = parseNumericValue(currentMetrics['Conversion Rate'] || null);
    if (convRate !== null) {
      totalConversionRate += convRate;
      brandCount++;
    }

    // CAC calculation
    const currentCac = parseNumericValue(currentMetrics['CAC'] || null);
    const previousCac = parseNumericValue(previousMetrics['CAC'] || null);
    if (currentCac !== null) {
      totalCurrentCAC += currentCac;
      cacCount++;
    }
    if (previousCac !== null) {
      totalPreviousCAC += previousCac;
    }
  });

  const avgConversionRate = brandCount > 0 ? totalConversionRate / brandCount : null;
  const avgCurrentCAC = cacCount > 0 ? totalCurrentCAC / cacCount : null;
  const avgPreviousCAC = cacCount > 0 ? totalPreviousCAC / cacCount : null;

  const revenueChange = calculateMonthlyChange(currentRevenue, previousRevenue);
  const grossMarginChange = calculateMonthlyChange(currentGrossMargin, previousGrossMargin);
  const cacChange = calculateMonthlyChange(avgCurrentCAC, avgPreviousCAC);

  // Net profit is estimated as 40% of gross margin when available
  const currentNetProfit = currentGrossMargin > 0 ? currentGrossMargin * 0.4 : null;
  const previousNetProfit = previousGrossMargin > 0 ? previousGrossMargin * 0.4 : null;
  const netProfitChange = calculateMonthlyChange(currentNetProfit, previousNetProfit);

  return {
    kpiData: {
      headers: ['KPI', 'Month-to-Date', 'Month vs. Previous', 'Year-to-Date', 'Last Year'],
      data: [
        ['Total Revenue', formatCurrency(currentRevenue), revenueChange, formatCurrency(currentRevenue), formatCurrency(previousRevenue)],
        ['Gross Profit', formatCurrency(currentGrossMargin), grossMarginChange, formatCurrency(currentGrossMargin), formatCurrency(previousGrossMargin)],
        ['Net Profit', formatCurrency(currentNetProfit), netProfitChange, formatCurrency(currentNetProfit), formatCurrency(previousNetProfit)],
        ['Customer Acquisition Cost', formatCurrency(avgCurrentCAC, true), cacChange, formatCurrency(avgCurrentCAC, true), formatCurrency(avgPreviousCAC, true)],
        ['Conversion Rate', formatPercentage(avgConversionRate), calculateMonthlyChange(avgConversionRate, avgConversionRate), formatPercentage(avgConversionRate), formatPercentage(avgConversionRate)],
      ],
    },
    supplyData: {
      headers: ['Metric', 'Current Value', 'Month-to-Date Change', 'Year-to-Date Change'],
      data: [
        ['Inventory Turnover', 'N/A', 'N/A', 'N/A'],
        ['Inventory Value', formatCurrency(currentRevenue > 0 ? currentRevenue * 0.5 : null), 'N/A', 'N/A'],
      ],
    },
    satisfactionData: {
      headers: ['Metric', 'Current Value', 'Month-to-Date Change', 'Year-to-Date Change'],
      data: [
        ['Net Promoter Score (NPS)', 'N/A', 'N/A', 'N/A'],
        ['Customer Satisfaction Score', 'N/A', 'N/A', 'N/A'],
        ['Customer Retention Rate', 'N/A', 'N/A', 'N/A'],
      ],
    },
    metrics: {
      revenue: { value: formatCurrency(currentRevenue), change: revenueChange },
      grossProfit: { value: formatCurrency(currentGrossMargin), change: grossMarginChange },
      netProfit: { value: formatCurrency(currentNetProfit), change: netProfitChange },
      cac: { value: formatCurrency(avgCurrentCAC, true), change: cacChange },
      conversionRate: { value: formatPercentage(avgConversionRate), change: calculateMonthlyChange(avgConversionRate, avgConversionRate) },
    },
  };
}