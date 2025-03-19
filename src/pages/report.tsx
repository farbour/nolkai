// file path: src/pages/report.tsx
import { ProcessedData, processReportData } from '@/utils/reportDataProcessor';
import React, { useEffect, useState } from 'react';
import ReportSection, { MetricCard } from '@/components/ReportSection';

import Logo from '@/components/Logo';
import Presentation from '@/components/presentation/Presentation';
import { SlideContent } from '@/components/presentation/Slide';
import { SortableTable } from '@/components/SortableTable';
import { parseCSV } from '@/utils/csvParser';

// Define time period types
type TimePeriodType = 'month' | 'quarter';
type MonthType = 'January' | 'February' | 'March' | 'April' | 'May' | 'June' | 'July' | 'August' | 'September' | 'October' | 'November' | 'December';
type QuarterType = 'Q1' | 'Q2' | 'Q3' | 'Q4';

// Map quarters to months
const QUARTER_TO_MONTHS: Record<QuarterType, MonthType[]> = {
  'Q1': ['January', 'February', 'March'],
  'Q2': ['April', 'May', 'June'],
  'Q3': ['July', 'August', 'September'],
  'Q4': ['October', 'November', 'December']
};

const MONTHS: MonthType[] = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const QUARTERS: QuarterType[] = ['Q1', 'Q2', 'Q3', 'Q4'];
const YEARS = ['2024', '2025'];

const Report = () => {
  const [reportData, setReportData] = useState<ProcessedData | null>(null);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [timePeriodType, setTimePeriodType] = useState<TimePeriodType>('month');
  const [selectedMonth, setSelectedMonth] = useState<MonthType>('January');
  const [selectedQuarter, setSelectedQuarter] = useState<QuarterType>('Q1');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [isDataComplete, setIsDataComplete] = useState(false); // Force incomplete data warning

  // Fetch data and process based on selected time period
  useEffect(() => {
    const fetchData = async () => {
      try {
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
        if (!response || !response.ok) {
          throw new Error('Failed to fetch data: No valid CSV files found in the specified locations');
        }
        
        const csvContent = await response.text();
        if (!csvContent.trim()) {
          throw new Error('CSV file is empty');
        }
        
        // Parse CSV to get available months and years
        const { rows } = parseCSV(csvContent);
        const monthsInData = new Set<string>();
        
        rows.forEach(row => {
          const month = row[3] as MonthType; // Month of Date is at index 3
          const year = row[4]; // Year of Date is at index 4
          monthsInData.add(`${month}-${year}`);
        });
        
        // Determine if data is complete for the selected time period
        let isComplete = true;
        
        // Convert to array of month-year strings
        const availableMonthYears = Array.from(monthsInData);
        
        if (timePeriodType === 'month') {
          // For a month, we consider data complete if we have data for that month
          isComplete = availableMonthYears.includes(`${selectedMonth}-${selectedYear}`);
        } else {
          // For a quarter, we check if all months in the quarter have data
          const monthsInQuarter = QUARTER_TO_MONTHS[selectedQuarter];
          isComplete = monthsInQuarter.every(month =>
            availableMonthYears.includes(`${month}-${selectedYear}`)
          );
        }
        
        setIsDataComplete(isComplete);
        
        // Get months to process based on selected time period
        let monthsToProcess: MonthType[] = [];
        if (timePeriodType === 'month') {
          monthsToProcess = [selectedMonth];
        } else {
          monthsToProcess = QUARTER_TO_MONTHS[selectedQuarter];
        }
        
        // Process the report data with the selected time period
        const processed = processReportData(csvContent, {
          months: monthsToProcess,
          year: selectedYear,
          isComplete
        });
        
        setReportData(processed);
      } catch (error) {
        console.error('Error fetching report data:', error);
      }
    };

    fetchData();
  }, [timePeriodType, selectedMonth, selectedQuarter, selectedYear]);

  if (!reportData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nolk-green"></div>
      </div>
    );
  }

  const getExecutiveSummaryPoints = () => {
    const revenueChange = reportData.metrics.revenue.change;
    const revenueValue = reportData.metrics.revenue.value;
    const cacChange = reportData.metrics.cac.change;
    const cacValue = reportData.metrics.cac.value;

    return [
      revenueChange !== 'N/A'
        ? `${timePeriodType === 'month' ? 'Monthly' : 'Quarterly'} revenue is at ${revenueValue} with a ${revenueChange} change compared to previous ${timePeriodType}, requiring attention to growth strategies`
        : 'Revenue data not available for the current period',
      
      cacChange !== 'N/A' && cacValue !== 'N/A'
        ? `Customer acquisition cost is ${cacValue} (${cacChange} change), ${
            cacChange.startsWith('-') 
              ? 'showing improved marketing efficiency' 
              : 'indicating need for marketing optimization'
          }`
        : 'Customer acquisition cost data not available',
      
      reportData.metrics.conversionRate.value !== 'N/A'
        ? `Conversion rate is at ${reportData.metrics.conversionRate.value}, ${
            reportData.metrics.conversionRate.change.startsWith('+')
              ? 'showing positive customer engagement'
              : 'indicating need for conversion optimization'
          }`
        : 'Conversion rate data not available',
    ];
  };

  // Get formatted period text
  const getPeriodText = () => {
    if (timePeriodType === 'month') {
      return `${selectedMonth} ${selectedYear}`;
    } else {
      return `${selectedQuarter} ${selectedYear}`;
    }
  };

  const executiveSummaryPoints = getExecutiveSummaryPoints();
  const periodText = getPeriodText();

  const slides: SlideContent[] = [
    {
      id: 'intro',
      title: '',
      content: (
        <div className="flex flex-col items-center justify-center h-full space-y-8 py-12">
          <div className="w-48 h-48 relative mb-8">
          <Logo />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 text-center">
            {timePeriodType === 'month' ? 'Monthly' : 'Quarterly'} Performance Report
          </h1>
          <p className="text-xl text-gray-600">{periodText}</p>
          {!isDataComplete && (
            <div className="mt-4 px-6 py-3 bg-yellow-100 text-yellow-800 rounded-md border border-yellow-300 shadow-sm">
              <p className="font-medium flex items-center">
                <span className="text-xl mr-2">⚠️</span>
                <span>Incomplete Data Warning</span>
              </p>
              <p className="text-sm mt-1">
                This report contains incomplete data for the selected {timePeriodType === 'month' ? 'month' : 'quarter'}.
                Some metrics may not reflect the full performance for this period.
              </p>
            </div>
          )}
          <div className="mt-12 text-gray-500 text-center">
            <p>Prepared by Nolk Analytics Team</p>
            <p className="mt-2">Confidential - Internal Use Only</p>
          </div>
        </div>
      ),
    },
    {
      id: 'agenda',
      title: 'Agenda',
      content: (
        <div className="space-y-6 py-8">
          <p className="text-gray-600 mb-8">
            In this presentation, we will cover the following key areas:
          </p>
          <div className="space-y-4">
            {[
              'Executive Summary - Key Highlights and Insights',
              'Key Performance Indicators (KPIs) - Financial Metrics',
              'Supply Chain Performance - Operational Efficiency',
              'Customer Satisfaction Metrics - Service Quality',
              'Conclusions and Next Steps',
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-nolk-green text-white flex items-center justify-center font-semibold">
                  {index + 1}
                </div>
                <p className="text-lg text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'executive-summary',
      title: '1. Executive Summary',
      content: (
        <div className="space-y-4">
          {executiveSummaryPoints.map((point, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-nolk-green text-white flex items-center justify-center font-semibold">
                {index + 1}
              </div>
              <p className="text-gray-700 text-lg mt-1">{point}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'kpis',
      title: '2. Key Performance Indicators (KPIs)',
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="Total Revenue"
              value={reportData.metrics.revenue.value}
              change={reportData.metrics.revenue.change}
            />
            <MetricCard
              title="Gross Profit"
              value={reportData.metrics.grossProfit.value}
              change={reportData.metrics.grossProfit.change}
            />
            <MetricCard
              title="Net Profit"
              value={reportData.metrics.netProfit.value}
              change={reportData.metrics.netProfit.change}
            />
          </div>
          <SortableTable headers={reportData.kpiData.headers} data={reportData.kpiData.data} />
        </div>
      ),
    },
    {
      id: 'supply-chain',
      title: '3. Supply Chain Performance',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 mb-6">
            Analysis of our supply chain efficiency and operational metrics:
          </p>
          <SortableTable
            headers={reportData.supplyData.headers}
            data={reportData.supplyData.data}
          />
        </div>
      ),
    },
    {
      id: 'customer-satisfaction',
      title: '4. Customer Satisfaction Metrics',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 mb-6">
            Overview of customer satisfaction and service quality indicators:
          </p>
          <SortableTable
            headers={reportData.satisfactionData.headers}
            data={reportData.satisfactionData.data}
          />
        </div>
      ),
    },
    {
      id: 'conclusions',
      title: 'Conclusions & Next Steps',
      content: (
        <div className="space-y-8 py-6">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Key Takeaways</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-nolk-green text-white flex items-center justify-center text-sm">✓</div>
                <p className="text-gray-700">Revenue trends indicate need for focused growth initiatives</p>
              </li>
              <li className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-nolk-green text-white flex items-center justify-center text-sm">✓</div>
                <p className="text-gray-700">Supply chain efficiency shows room for optimization</p>
              </li>
              <li className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-nolk-green text-white flex items-center justify-center text-sm">✓</div>
                <p className="text-gray-700">Customer satisfaction metrics remain strong with opportunities for improvement</p>
              </li>
            </ul>
          </div>
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Recommended Actions</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-nolk-green text-white flex items-center justify-center text-sm">1</div>
                <p className="text-gray-700">Implement targeted marketing campaigns to drive revenue growth</p>
              </li>
              <li className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-nolk-green text-white flex items-center justify-center text-sm">2</div>
                <p className="text-gray-700">Optimize supply chain processes to reduce operational costs</p>
              </li>
              <li className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-nolk-green text-white flex items-center justify-center text-sm">3</div>
                <p className="text-gray-700">Enhance customer service training and support systems</p>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'outro',
      title: '',
      content: (
        <div className="flex flex-col items-center justify-center h-full space-y-8 py-12">
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Thank You
          </h2>
          <p className="text-xl text-gray-600 text-center max-w-2xl">
            For questions or detailed analysis, please contact the Nolk Analytics Team
          </p>
          <div className="w-32 h-32 relative mt-8">
            <Logo />
          </div>
          <div className="mt-8 text-gray-500 text-center">
            <p>© {new Date().getFullYear()} Nolk</p>
            <p className="mt-2">All Rights Reserved</p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Main warning banner at the top */}
      {!isDataComplete && (
        <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 flex items-center">
          <span className="text-2xl mr-3">⚠️</span>
          <div>
            <h3 className="font-bold">Incomplete Data Warning</h3>
            <p>The report for {getPeriodText()} contains incomplete data. Some metrics may not reflect the full performance for this period.</p>
          </div>
        </div>
      )}
      
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Time Period Type Selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setTimePeriodType('month')}
              className={`px-3 py-1 rounded text-sm ${timePeriodType === 'month' ? 'bg-nolk-green text-white' : 'bg-gray-100'}`}
            >
              Month
            </button>
            <button
              onClick={() => setTimePeriodType('quarter')}
              className={`px-3 py-1 rounded text-sm ${timePeriodType === 'quarter' ? 'bg-nolk-green text-white' : 'bg-gray-100'}`}
            >
              Quarter
            </button>
          </div>
          
          {/* Month/Quarter and Year Selectors */}
          {timePeriodType === 'month' ? (
            <div className="flex gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value as MonthType)}
                className="px-3 py-1 border rounded-lg focus:ring-2 focus:ring-nolk-green/20 focus:border-nolk-green text-sm"
              >
                {MONTHS.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-1 border rounded-lg focus:ring-2 focus:ring-nolk-green/20 focus:border-nolk-green text-sm"
              >
                {YEARS.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex gap-2">
              <select
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value as QuarterType)}
                className="px-3 py-1 border rounded-lg focus:ring-2 focus:ring-nolk-green/20 focus:border-nolk-green text-sm"
              >
                {QUARTERS.map(quarter => (
                  <option key={quarter} value={quarter}>{quarter}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-1 border rounded-lg focus:ring-2 focus:ring-nolk-green/20 focus:border-nolk-green text-sm"
              >
                {YEARS.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        {!isDataComplete && (
          <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md text-sm border border-yellow-300 shadow-sm flex items-center">
            <span className="text-lg mr-2">⚠️</span>
            <span>Incomplete data for {getPeriodText()}</span>
          </div>
        )}
        
        <button
          onClick={() => setIsPresentationMode(!isPresentationMode)}
          className="px-4 py-2 bg-nolk-green text-white rounded-lg hover:opacity-90 transition-colors"
        >
          {isPresentationMode ? 'Exit Presentation' : 'Start Presentation'}
        </button>
      </div>

      {isPresentationMode ? (
        <Presentation slides={slides} isAuthenticated={false} />
      ) : (
        <div className="space-y-6">
          {slides.slice(2, -2).map((slide) => (
            <ReportSection key={slide.id} title={slide.title}>
              {slide.content}
            </ReportSection>
          ))}
        </div>
      )}
    </div>
  );
};

export default Report;
