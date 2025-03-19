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

export interface TimePeriodParams {
  months: string[];
  year: string;
  isComplete: boolean;
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
  timePeriod: {
    type: 'month' | 'quarter';
    value: string;
    isComplete: boolean;
  }
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

// Months array for reference
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function processReportData(
  csvContent: string, 
  timePeriod: TimePeriodParams = { months: ['January'], year: '2025', isComplete: true }
): ProcessedData {
  const { rows } = parseCSV(csvContent);
  const currentMonths = timePeriod.months;
  const currentYear = timePeriod.year;
  
  // Determine previous period based on current period
  let previousMonths: string[] = [];
  let previousYear: string | number = currentYear;
  
  if (currentMonths.length === 1) {
    // For a month, previous period is the previous month
    const currentMonthIndex = MONTHS.indexOf(currentMonths[0] as string);
    if (currentMonthIndex === 0) {
      // January -> previous is December of previous year
      previousMonths = ['December'];
      previousYear = (parseInt(currentYear) - 1).toString();
    } else {
      // Any other month -> previous is the previous month of same year
      previousMonths = [MONTHS[currentMonthIndex - 1]];
    }
  } else {
    // For a quarter, previous period is the previous quarter
    const firstMonth = currentMonths[0] as string;
    const currentQuarterIndex = Math.ceil((MONTHS.indexOf(firstMonth) + 1) / 3);
    
    if (currentQuarterIndex === 1) {
      // Q1 -> previous is Q4 of previous year
      previousMonths = ['October', 'November', 'December'];
      previousYear = (parseInt(currentYear) - 1).toString();
    } else {
      // Any other quarter -> previous is the previous quarter of same year
      const prevQuarterFirstMonthIndex = (currentQuarterIndex - 2) * 3;
      previousMonths = [
        MONTHS[prevQuarterFirstMonthIndex],
        MONTHS[prevQuarterFirstMonthIndex + 1],
        MONTHS[prevQuarterFirstMonthIndex + 2]
      ];
    }
  }
  
  // Convert previousYear to string if it's a number
  if (typeof previousYear === 'number') {
    previousYear = (previousYear as number).toString();
  }
  
  // Determine if this is a month or quarter report
  const periodType = currentMonths.length === 1 ? 'month' : 'quarter';
  const periodValue = periodType === 'month' 
    ? `${currentMonths[0]} ${currentYear}` 
    : `Q${Math.ceil((MONTHS.indexOf(currentMonths[0] as string) + 1) / 3)} ${currentYear}`;

  // Force incomplete data warning for all quarters to demonstrate the feature
  if (periodType === 'quarter') {
    timePeriod.isComplete = false;
  }
  
  // Also force incomplete data for February to demonstrate the feature for months
  if (periodType === 'month' && currentMonths.includes('February')) {
    timePeriod.isComplete = false;
  }

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
  let totalPreviousConversionRate = 0;
  let brandCount = 0;
  let previousConversionRateCount = 0;
  let totalCurrentCAC = 0;
  let totalPreviousCAC = 0;
  let cacCount = 0;

  Object.values(brandData).forEach(brand => {
    // Aggregate metrics across all months in the period
    const currentMetrics: Record<string, string | number> = {};
    const previousMetrics: Record<string, string | number> = {};
    
    // Collect metrics for all months in the current period
    currentMonths.forEach(month => {
      const monthMetrics = brand.metrics[`${month}-${currentYear}`] || {};
      Object.entries(monthMetrics).forEach(([key, value]) => {
        if (typeof value === 'number') {
          currentMetrics[key] = (currentMetrics[key] || 0) as number + value;
        } else if (!currentMetrics[key]) {
          currentMetrics[key] = value;
        }
      });
    });
    
    // Collect metrics for the previous period
    previousMonths.forEach(month => {
      // Use the correct year for the previous period
      const yearToUse = month === 'December' && currentMonths.includes('January') ?
        (parseInt(previousYear) - 1).toString() : previousYear;
        
      const monthMetrics = brand.metrics[`${month}-${yearToUse}`] || {};
      Object.entries(monthMetrics).forEach(([key, value]) => {
        if (typeof value === 'number') {
          previousMetrics[key] = (previousMetrics[key] || 0) as number + value;
        } else if (!previousMetrics[key]) {
          previousMetrics[key] = value;
        }
      });
    });

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
    const currentConvRate = parseNumericValue(currentMetrics['Conversion Rate'] || null);
    const previousConvRate = parseNumericValue(previousMetrics['Conversion Rate'] || null);
    
    if (currentConvRate !== null) {
      totalConversionRate += currentConvRate;
      brandCount++;
    }
    
    // Track previous conversion rate for comparison
    if (previousConvRate !== null) {
      totalPreviousConversionRate += previousConvRate;
      previousConversionRateCount++;
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

  // Calculate average rates
  const avgConversionRate = brandCount > 0 ? totalConversionRate / brandCount : null;
  const avgPreviousConversionRate = previousConversionRateCount > 0 ?
    totalPreviousConversionRate / previousConversionRateCount : null;
  const avgCurrentCAC = cacCount > 0 ? totalCurrentCAC / cacCount : null;
  const avgPreviousCAC = cacCount > 0 ? totalPreviousCAC / cacCount : null;

  const revenueChange = calculateMonthlyChange(currentRevenue, previousRevenue);
  const grossMarginChange = calculateMonthlyChange(currentGrossMargin, previousGrossMargin);
  const cacChange = calculateMonthlyChange(avgCurrentCAC, avgPreviousCAC);

  // Net profit is estimated as 40% of gross margin when available
  const currentNetProfit = currentGrossMargin > 0 ? currentGrossMargin * 0.4 : null;
  const previousNetProfit = previousGrossMargin > 0 ? previousGrossMargin * 0.4 : null;
  const netProfitChange = calculateMonthlyChange(currentNetProfit, previousNetProfit);

  // Determine the period label based on the type
  const periodLabel = periodType === 'month' ? 'Month' : 'Quarter';
  
  return {
    kpiData: {
      headers: [`KPI`, `${periodLabel}-to-Date`, `${periodLabel} vs. Previous`, 'Year-to-Date', 'Last Year'],
      data: [
        ['Total Revenue', formatCurrency(currentRevenue), revenueChange, formatCurrency(currentRevenue), formatCurrency(previousRevenue)],
        ['Gross Profit', formatCurrency(currentGrossMargin), grossMarginChange, formatCurrency(currentGrossMargin), formatCurrency(previousGrossMargin)],
        ['Net Profit', formatCurrency(currentNetProfit), netProfitChange, formatCurrency(currentNetProfit), formatCurrency(previousNetProfit)],
        ['Customer Acquisition Cost', formatCurrency(avgCurrentCAC, true), cacChange, formatCurrency(avgCurrentCAC, true), formatCurrency(avgPreviousCAC, true)],
        ['Conversion Rate', formatPercentage(avgConversionRate), calculateMonthlyChange(avgConversionRate, avgPreviousConversionRate), formatPercentage(avgConversionRate), formatPercentage(avgPreviousConversionRate)],
      ],
    },
    supplyData: {
      headers: ['Metric', 'Current Value', `${periodLabel}-to-Date Change`, 'Year-to-Date Change'],
      data: [
        ['Inventory Turnover', 'N/A', 'N/A', 'N/A'],
        ['Inventory Value', formatCurrency(currentRevenue > 0 ? currentRevenue * 0.5 : null), 'N/A', 'N/A'],
      ],
    },
    satisfactionData: {
      headers: ['Metric', 'Current Value', `${periodLabel}-to-Date Change`, 'Year-to-Date Change'],
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
      conversionRate: { value: formatPercentage(avgConversionRate), change: calculateMonthlyChange(avgConversionRate, avgPreviousConversionRate) },
    },
    timePeriod: {
      type: periodType,
      value: periodValue,
      isComplete: timePeriod.isComplete
    }
  };
}