import { DataTable, MetricCard, ReportSection } from '../components/ReportSection';

import { Layout } from '../components/Layout';
// file path: src/pages/report.tsx
import React from 'react';

export default function Report() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const kpiData = {
    headers: ['KPI', 'Month-to-Date', 'Month vs. Budget', 'Year-to-Date', 'Last Year'],
    data: [
      ['Total Revenue', '$1.2M', '+15%', '$14.5M', '$12.8M'],
      ['Gross Profit', '$480K', '+12%', '$5.8M', '$5.1M'],
      ['Net Profit', '$180K', '+8%', '$2.2M', '$1.9M'],
      ['Customer Acquisition Cost', '$45', '-10%', '$48', '$52'],
      ['Conversion Rate', '3.8%', '+0.5%', '3.5%', '3.2%'],
    ],
  };

  const supplyData = {
    headers: ['Metric', 'Current Value', 'Month-to-Date Change', 'Year-to-Date Change'],
    data: [
      ['Inventory Turnover', '4.2x', '+0.3x', '+0.8x'],
      ['Inventory Value', '$2.5M', '-5%', '+15%'],
    ],
  };

  const satisfactionData = {
    headers: ['Metric', 'Current Value', 'Month-to-Date Change', 'Year-to-Date Change'],
    data: [
      ['Net Promoter Score (NPS)', '72', '+2', '+5'],
      ['Customer Satisfaction Score', '4.5/5', '+0.1', '+0.3'],
      ['Customer Retention Rate', '85%', '+2%', '+5%'],
    ],
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12 border border-gray-200">
            <h1 className="text-5xl font-black text-nolk-green mb-6">Nolk Weekly Executive Report</h1>
            <div className="text-xl text-gray-600 space-y-1">
              <p className="font-medium">Date: {currentDate}</p>
              <p className="font-medium">Prepared by: Executive Team</p>
            </div>
          </div>

          <ReportSection title="1. Executive Summary">
            <div className="prose max-w-none">
              <ul className="list-none space-y-4">
                {[
                  'Revenue growth continues to exceed expectations, with a 15% increase MTD',
                  'Customer acquisition costs have decreased by 10%, indicating improved marketing efficiency',
                  'Inventory optimization efforts have resulted in a 5% reduction in total inventory value',
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-nolk-green text-white font-bold text-lg mr-4">
                      {index + 1}
                    </span>
                    <span className="text-xl text-gray-700 mt-1">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ReportSection>

          <ReportSection title="2. Key Performance Indicators (KPIs)">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <MetricCard
                title="Total Revenue"
                value="$1.2M"
                change="+15% MTD"
              />
              <MetricCard
                title="Gross Profit"
                value="$480K"
                change="+12% MTD"
              />
              <MetricCard
                title="Net Profit"
                value="$180K"
                change="+8% MTD"
              />
            </div>
            <DataTable headers={kpiData.headers} data={kpiData.data} />
          </ReportSection>

          <ReportSection title="3. Supply Metrics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <MetricCard
                title="Inventory Turnover"
                value="4.2x"
                change="+0.3x MTD"
              />
              <MetricCard
                title="Inventory Value"
                value="$2.5M"
                change="-5% MTD"
              />
            </div>
            <DataTable headers={supplyData.headers} data={supplyData.data} />
          </ReportSection>

          <ReportSection title="4. Customer Satisfaction Metrics">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <MetricCard
                title="Net Promoter Score"
                value="72"
                change="+2 MTD"
              />
              <MetricCard
                title="CSAT Score"
                value="4.5/5"
                change="+0.1 MTD"
              />
              <MetricCard
                title="Retention Rate"
                value="85%"
                change="+2% MTD"
              />
            </div>
            <DataTable headers={satisfactionData.headers} data={satisfactionData.data} />
          </ReportSection>

          <ReportSection title="5. Challenges & Opportunities">
            <div className="space-y-6">
              {[
                {
                  title: 'Current Challenges',
                  items: ['Supply chain disruptions in Asia affecting inventory levels for key products'],
                },
                {
                  title: 'Market Opportunities',
                  items: [
                    'Emerging opportunity in sustainable product categories with high consumer demand',
                    'Potential for market expansion into European markets in Q3',
                  ],
                },
              ].map((section, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-nolk-green mb-4">{section.title}</h3>
                  <ul className="space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-nolk-green mt-2 mr-3"></span>
                        <span className="text-lg text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ReportSection>

          <ReportSection title="6. Upcoming Goals">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Vendor Portal Launch',
                  description: 'Launch new vendor portal to streamline inventory management',
                },
                {
                  title: 'Customer Feedback System',
                  description: 'Implement automated customer feedback analysis system',
                },
                {
                  title: 'European Expansion',
                  description: 'Finalize Q3 expansion strategy for European market entry',
                },
              ].map((goal, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 border-l-4 border-nolk-green">
                  <h3 className="text-xl font-bold text-nolk-green mb-2">{goal.title}</h3>
                  <p className="text-lg text-gray-700">{goal.description}</p>
                </div>
              ))}
            </div>
          </ReportSection>

          <ReportSection title="7. Additional Notes">
            <div className="bg-gray-50 rounded-lg p-6">
              <ul className="space-y-4">
                {[
                  'Team training sessions scheduled for new inventory management system',
                  'Quarterly board meeting preparation in progress',
                  'New sustainability initiatives to be announced next week',
                ].map((note, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded bg-nolk-green/10 text-nolk-green font-semibold text-sm mr-3 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-lg text-gray-700">{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ReportSection>
        </div>
      </div>
    </Layout>
  );
}
