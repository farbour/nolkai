import {
  ArrowTrendingUpIcon,
  BoltIcon,
  DocumentIcon,
  PresentationChartBarIcon
} from '@heroicons/react/24/outline';

import { Layout } from '@/components/Layout';
import React from 'react';

// file path: src/pages/index.tsx

const recentActions = [
  {
    id: 1,
    title: "Q4 2024 Performance Review",
    type: "Presentation",
    date: "2 hours ago",
    icon: PresentationChartBarIcon,
  },
  {
    id: 2,
    title: "Market Analysis Report",
    type: "Document",
    date: "1 day ago",
    icon: DocumentIcon,
  },
  {
    id: 3,
    title: "Brand Growth Strategy",
    type: "Document",
    date: "2 days ago",
    icon: DocumentIcon,
  }
];

const aiSuggestions = [
  {
    id: 1,
    title: "Revenue Opportunity",
    description: "Based on current trends, increasing marketing spend in Q2 could boost revenue by 15%",
    impact: "High",
    icon: ArrowTrendingUpIcon,
  },
  {
    id: 2,
    title: "Performance Alert",
    description: "Conversion rates have dropped 5% in the last week",
    impact: "Medium",
    icon: BoltIcon,
  }
];

const kpis = [
  {
    title: "Total Revenue",
    value: "$1.2M",
    change: "+12.3%",
    timeframe: "vs. last month"
  },
  {
    title: "Active Brands",
    value: "15",
    change: "+2",
    timeframe: "vs. last month"
  },
  {
    title: "Avg. Order Value",
    value: "$85",
    change: "+5.7%",
    timeframe: "vs. last month"
  },
  {
    title: "Customer Satisfaction",
    value: "94%",
    change: "+2.1%",
    timeframe: "vs. last month"
  }
];

export default function Home() {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-[#F8F7F4] rounded-xl p-8">
          <h1 className="text-3xl font-bold text-nolk-green mb-2">
            {greeting}, John
          </h1>
          <p className="text-gray-600">
            Here&apos;s what&apos;s happening with your brands today
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi) => (
            <div key={kpi.title} className="bg-white rounded-lg shadow p-6 border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500">
                {kpi.title}
              </h3>
              <p className="text-3xl font-semibold mt-2 text-nolk-green">
                {kpi.value}
              </p>
              <div className="text-sm mt-2 text-green-600">
                {kpi.change}
                <span className="text-gray-500 ml-2">{kpi.timeframe}</span>
              </div>
            </div>
          ))}
        </div>

        {/* AI Suggestions & Recent Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Suggestions */}
          <div className="bg-white rounded-lg shadow border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-nolk-green">AI Suggestions</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {aiSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <suggestion.icon className="h-6 w-6 text-nolk-green" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">{suggestion.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{suggestion.description}</p>
                      <div className="mt-2">
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                          {suggestion.impact} Impact
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Actions */}
          <div className="bg-white rounded-lg shadow border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-nolk-green">Recent Actions</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {recentActions.map((action) => (
                <div key={action.id} className="p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <action.icon className="h-6 w-6 text-nolk-green" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">{action.title}</h3>
                      <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                        <span>{action.type}</span>
                        <span>•</span>
                        <span>{action.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
