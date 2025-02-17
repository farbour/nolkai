import { ProcessedData, processReportData } from '@/utils/reportDataProcessor';
// file path: src/pages/report.tsx
import React, { useEffect, useState } from 'react';
import ReportSection, { DataTable, MetricCard } from '@/components/ReportSection';

const Report = () => {
  const [reportData, setReportData] = useState<ProcessedData | null>(null);

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
      <div className="flex items-center justify-center min-h-screen">
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12 border border-gray-200">
        <h1 className="text-4xl font-bold text-nolk-green mb-4">
          Nolk Weekly Executive Report
        </h1>
        <div className="text-gray-600 mb-2">Date: February 17, 2025</div>
        <div className="text-gray-600">Prepared by: Executive Team</div>
      </div>

      <ReportSection title="1. Executive Summary">
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
      </ReportSection>

      <ReportSection title="2. Key Performance Indicators (KPIs)">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        <DataTable headers={reportData.kpiData.headers} data={reportData.kpiData.data} />
      </ReportSection>

      <ReportSection title="3. Supply Chain Performance">
        <DataTable
          headers={reportData.supplyData.headers}
          data={reportData.supplyData.data}
        />
      </ReportSection>

      <ReportSection title="4. Customer Satisfaction Metrics">
        <DataTable
          headers={reportData.satisfactionData.headers}
          data={reportData.satisfactionData.data}
        />
      </ReportSection>

      <div className="text-right text-sm text-gray-500 mt-8">
        Last updated: {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default Report;
