// file path: src/pages/report.tsx
import { ProcessedData, processReportData } from '@/utils/reportDataProcessor';
import React, { useEffect, useState } from 'react';
import ReportSection, { MetricCard } from '@/components/ReportSection';

import Presentation from '@/components/presentation/Presentation';
import { SlideContent } from '@/components/presentation/Slide';
import { SortableTable } from '@/components/SortableTable';

const Report = () => {
  const [reportData, setReportData] = useState<ProcessedData | null>(null);
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data.csv');
        const csvContent = await response.text();
        const processed = processReportData(csvContent);
        setReportData(processed);
      } catch (error) {
        console.error('Error fetching report data:', error);
      }
    };

    fetchData();
  }, []);

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
        ? `Monthly revenue is at ${revenueValue} with a ${revenueChange} change compared to previous month, requiring attention to growth strategies`
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

  const executiveSummaryPoints = getExecutiveSummaryPoints();

  const slides: SlideContent[] = [
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
        <SortableTable
          headers={reportData.supplyData.headers}
          data={reportData.supplyData.data}
        />
      ),
    },
    {
      id: 'customer-satisfaction',
      title: '4. Customer Satisfaction Metrics',
      content: (
        <SortableTable
          headers={reportData.satisfactionData.headers}
          data={reportData.satisfactionData.data}
        />
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setIsPresentationMode(!isPresentationMode)}
          className="px-4 py-2 bg-nolk-green text-white rounded-lg hover:opacity-90 transition-colors"
        >
          {isPresentationMode ? 'Exit Presentation' : 'Start Presentation'}
        </button>
      </div>

      {isPresentationMode ? (
        <Presentation slides={slides} />
      ) : (
        <div className="space-y-6">
          {slides.map((slide) => (
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
