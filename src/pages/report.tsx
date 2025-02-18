// file path: src/pages/report.tsx
import { ProcessedData, processReportData } from '@/utils/reportDataProcessor';
import React, { useEffect, useState } from 'react';
import ReportSection, { MetricCard } from '@/components/ReportSection';

import Logo from '@/components/Logo';
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
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

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
            Monthly Performance Report
          </h1>
          <p className="text-xl text-gray-600">{currentDate}</p>
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
      <div className="mb-6 flex justify-end">
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
