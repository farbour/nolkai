import {
  ArrowTrendingUpIcon,
  BoltIcon,
  ChartBarIcon,
  DocumentIcon,
  FlagIcon,
  PresentationChartBarIcon,
  SparklesIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import React from 'react';

// file path: src/pages/index.tsx

type ColorType = 'green' | 'blue' | 'purple' | 'indigo';
type StyleType = 'bg' | 'text' | 'border';

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
    category: "revenue"
  },
  {
    id: 2,
    title: "Performance Alert",
    description: "Conversion rates have dropped 5% in the last week",
    impact: "Medium",
    icon: BoltIcon,
    category: "performance"
  }
];

const kpis = [
  {
    title: "Total Revenue",
    value: "$1.2M",
    change: "+12.3%",
    timeframe: "vs. last month",
    icon: ChartBarIcon,
    trend: "up",
    color: 'green' as ColorType,
    data: [
      { date: 'Jan', value: 800000 },
      { date: 'Feb', value: 900000 },
      { date: 'Mar', value: 850000 },
      { date: 'Apr', value: 1100000 },
      { date: 'May', value: 1200000 },
    ]
  },
  {
    title: "Active Brands",
    value: "15",
    change: "+2",
    timeframe: "vs. last month",
    icon: UserGroupIcon,
    trend: "up",
    color: 'blue' as ColorType,
    data: [
      { date: 'Jan', value: 10 },
      { date: 'Feb', value: 12 },
      { date: 'Mar', value: 13 },
      { date: 'Apr', value: 14 },
      { date: 'May', value: 15 },
    ]
  },
  {
    title: "Avg. Order Value",
    value: "$85",
    change: "+5.7%",
    timeframe: "vs. last month",
    icon: SparklesIcon,
    trend: "up",
    color: 'purple' as ColorType,
    data: [
      { date: 'Jan', value: 75 },
      { date: 'Feb', value: 78 },
      { date: 'Mar', value: 80 },
      { date: 'Apr', value: 82 },
      { date: 'May', value: 85 },
    ]
  },
  {
    title: "Customer Satisfaction",
    value: "94%",
    change: "+2.1%",
    timeframe: "vs. last month",
    icon: SparklesIcon,
    trend: "up",
    color: 'indigo' as ColorType,
    data: [
      { date: 'Jan', value: 90 },
      { date: 'Feb', value: 91 },
      { date: 'Mar', value: 92 },
      { date: 'Apr', value: 93 },
      { date: 'May', value: 94 },
    ]
  }
];

const quickActions = [
  {
    name: "Create Report",
    description: "Generate a new performance report",
    icon: DocumentIcon,
    href: "/report",
    color: 'blue' as ColorType
  },
  {
    name: "View Analytics",
    description: "Check detailed analytics",
    icon: ChartBarIcon,
    href: "/overview",
    color: 'purple' as ColorType
  },
  {
    name: "New Presentation",
    description: "Create a new presentation",
    icon: PresentationChartBarIcon,
    href: "/presentations",
    color: 'green' as ColorType
  }
];

const goals = [
  {
    name: "Q2 Revenue Target",
    target: "$2M",
    current: "$1.2M",
    progress: 60,
    color: 'green' as ColorType
  },
  {
    name: "Brand Expansion",
    target: "20 Brands",
    current: "15 Brands",
    progress: 75,
    color: 'blue' as ColorType
  },
  {
    name: "Customer Satisfaction",
    target: "95%",
    current: "94%",
    progress: 98,
    color: 'indigo' as ColorType
  }
];

const getColorClass = (color: ColorType, type: StyleType): string => {
  const colors = {
    green: {
      bg: 'bg-green-50 group-hover:bg-green-100',
      text: 'text-green-700',
      border: 'border-green-200'
    },
    blue: {
      bg: 'bg-blue-50 group-hover:bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-200'
    },
    purple: {
      bg: 'bg-purple-50 group-hover:bg-purple-100',
      text: 'text-purple-700',
      border: 'border-purple-200'
    },
    indigo: {
      bg: 'bg-indigo-50 group-hover:bg-indigo-100',
      text: 'text-indigo-700',
      border: 'border-indigo-200'
    }
  };
  return colors[color][type];
};

export default function Home() {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-[#F8F7F4] to-white rounded-xl p-8 md:p-12">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-nolk-green mb-4 tracking-tight">
            {greeting}, John
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            Here&apos;s what&apos;s happening with your brands today
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <div key={kpi.title} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:border-nolk-green/20 transition-colors group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  {kpi.title}
                </p>
                <h3 className="text-4xl font-bold text-gray-900 tracking-tight">
                  {kpi.value}
                </h3>
              </div>
              <div className={`p-2 rounded-lg transition-colors ${getColorClass(kpi.color, 'bg')}`}>
                <kpi.icon className={`h-6 w-6 ${getColorClass(kpi.color, 'text')}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <span className={`text-sm font-medium ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.change}
              </span>
              <span className="text-sm text-gray-500">{kpi.timeframe}</span>
            </div>
            <div className="mt-4 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={kpi.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10 }}
                    stroke="#9CA3AF"
                  />
                  <YAxis 
                    hide={true}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#344C45"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Goals & Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Goals */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Goals</h2>
                <FlagIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="p-6 space-y-6">
              {goals.map((goal) => (
                <div key={goal.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">{goal.name}</span>
                    <span className="text-sm text-gray-500">{goal.current} / {goal.target}</span>
                  </div>
                  <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`absolute top-0 left-0 h-full rounded-full transition-all ${getColorClass(goal.color, 'bg')}`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {quickActions.map((action) => (
                  <a
                    key={action.name}
                    href={action.href}
                    className="group block p-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg transition-colors ${getColorClass(action.color, 'bg')}`}>
                        <action.icon className={`h-6 w-6 ${getColorClass(action.color, 'text')}`} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">{action.name}</h3>
                        <p className="text-sm text-gray-500">{action.description}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Suggestions & Recent Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Suggestions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">AI Insights</h2>
                <SparklesIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {aiSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="p-6 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className={`p-2 rounded-lg transition-colors ${
                        suggestion.category === 'revenue' 
                          ? 'bg-green-50 group-hover:bg-green-100' 
                          : 'bg-purple-50 group-hover:bg-purple-100'
                      }`}>
                        <suggestion.icon className={`h-6 w-6 ${
                          suggestion.category === 'revenue' 
                            ? 'text-green-600' 
                            : 'text-purple-600'
                        }`} />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-base font-semibold text-gray-900">{suggestion.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{suggestion.description}</p>
                      <div className="mt-2">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                          suggestion.impact === 'High' 
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-yellow-50 text-yellow-700'
                        }`}>
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                <ChartBarIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {recentActions.map((action) => (
                <div key={action.id} className="p-6 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <action.icon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-base font-semibold text-gray-900">{action.title}</h3>
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
    </div>
  );
}
