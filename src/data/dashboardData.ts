import {
  AIInsight,
  Brand,
  Event,
  ForecastMetric,
  Goal,
  KPI,
  MarketTrend,
  QuickAction,
  Task
} from '@/types/dashboard';
import { ChartBarIcon, DocumentIcon } from '@heroicons/react/24/outline';

import { AlertType } from '@/types/theme';
import { PresentationChartBarIcon } from '@heroicons/react/24/outline';

// file path: src/data/dashboardData.ts

export const kpis: KPI[] = [
  {
    title: "Global E-commerce Market",
    value: 6310,
    change: 10.7,
    trend: 'up',
    description: "Billion USD (2023)",
    data: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2024, i).toLocaleString('default', { month: 'short' }),
      value: 5700 + (i * 51) + (Math.random() * 100)
    }))
  },
  {
    title: "E-commerce Share of Retail",
    value: 24.0,
    change: 6.0,
    trend: 'up',
    description: "% of Total Retail (2025)",
    data: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2024, i).toLocaleString('default', { month: 'short' }),
      value: 18 + (i * 0.5) + (Math.random() * 2)
    }))
  },
  {
    title: "Global Avg. Order Value",
    value: 165,
    change: 3.8,
    trend: 'up',
    description: "USD per Order",
    data: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2024, i).toLocaleString('default', { month: 'short' }),
      value: 140 + (i * 2) + (Math.random() * 10)
    }))
  },
  {
    title: "Mobile Commerce Share",
    value: 70.0,
    change: 8.5,
    trend: 'up',
    description: "% of E-commerce",
    data: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2024, i).toLocaleString('default', { month: 'short' }),
      value: 60 + (i * 0.8) + (Math.random() * 5)
    }))
  }
];

export const alerts = [
  {
    id: 1,
    title: "Market Growth Alert",
    description: "E-commerce market projected to hit $7T in 2025, representing 23.6% of global retail",
    type: "success" as AlertType,
    time: "Just now"
  },
  {
    id: 2,
    title: "Cross-Border Opportunity",
    description: "Cross-border e-commerce expected to reach $5T by 2028 with 25% CAGR",
    type: "info" as AlertType,
    time: "2 hours ago"
  },
  {
    id: 3,
    title: "Conversion Rate Insight",
    description: "Email marketing leads with 10.3% conversion rate, significantly above other channels",
    type: "info" as AlertType,
    time: "5 hours ago"
  },
  {
    id: 4,
    title: "Mobile Commerce Alert",
    description: "Mobile traffic dominates at 70% but has lower conversion. Optimization needed.",
    type: "warning" as AlertType,
    time: "1 day ago"
  }
];

export const tasks: Task[] = [
  {
    id: "1",
    title: "Optimize Mobile Checkout",
    description: "Improve mobile conversion rate by streamlining checkout process",
    priority: "high",
    dueDate: "2024-03-20"
  },
  {
    id: "2",
    title: "Expand Email Marketing",
    description: "Leverage high conversion rate (10.3%) of email channel",
    priority: "high",
    dueDate: "2024-03-25"
  },
  {
    id: "3",
    title: "Reduce Cart Abandonment",
    description: "Address unexpected costs issue in checkout process",
    priority: "urgent",
    dueDate: "2024-03-18"
  }
];

export const matrixTasks: Task[] = [
  {
    id: "4",
    title: "Cross-Border Strategy",
    description: "Develop plan to capture growing cross-border market",
    priority: "urgent-important",
    dueDate: "2024-03-22"
  },
  {
    id: "5",
    title: "Mobile UX Enhancement",
    description: "Close the gap between mobile and desktop conversion rates",
    priority: "urgent-important",
    dueDate: "2024-03-25"
  },
  {
    id: "6",
    title: "Western Europe Expansion",
    description: "Plan market entry strategy for high-converting region",
    priority: "not-urgent-important",
    dueDate: "2024-04-15"
  },
  {
    id: "7",
    title: "Subscription Model Analysis",
    description: "Evaluate opportunity in growing subscription commerce",
    priority: "not-urgent-important",
    dueDate: "2024-04-30"
  }
];

export const aiSuggestions: AIInsight[] = [
  {
    id: "1",
    title: "Market Growth Opportunity",
    description: "Global e-commerce market expected to reach $7.95T by 2027. Consider expanding cross-border operations to capture growth.",
    impact: "high",
    category: "growth"
  },
  {
    id: "2",
    title: "Mobile Commerce Trend",
    description: "70% of e-commerce traffic is mobile, but desktop conversion rates are 1.7x higher. Priority: Optimize mobile checkout experience.",
    impact: "high",
    category: "optimization"
  },
  {
    id: "3",
    title: "Cart Abandonment Alert",
    description: "70% of shopping carts are abandoned. Top reason: unexpected costs (49%). Consider showing total costs earlier in checkout.",
    impact: "high",
    category: "conversion"
  },
  {
    id: "4",
    title: "Regional Opportunity",
    description: "Western Europe shows highest conversion rates (5.2%). Consider prioritizing expansion in this region.",
    impact: "medium",
    category: "expansion"
  }
];

export const performanceMetrics = [
  { month: 'Jan', revenue: 5700000, orders: 1200000 },
  { month: 'Feb', revenue: 5850000, orders: 1250000 },
  { month: 'Mar', revenue: 6000000, orders: 1300000 },
  { month: 'Apr', revenue: 6150000, orders: 1350000 },
  { month: 'May', revenue: 6310000, orders: 1400000 }
];

export const brandPerformance: Brand[] = [
  {
    id: "1",
    name: 'Brand A',
    performance: 85,
    trend: 'up',
    metrics: [
      { name: 'Revenue', value: 450000, change: 15 },
      { name: 'Growth', value: 15, change: 2 },
      { name: 'Satisfaction', value: 95, change: 3 }
    ]
  },
  {
    id: "2",
    name: 'Brand B',
    performance: 82,
    trend: 'up',
    metrics: [
      { name: 'Revenue', value: 380000, change: 12 },
      { name: 'Growth', value: 12, change: 1 },
      { name: 'Satisfaction', value: 92, change: 2 }
    ]
  }
];

export const goals: Goal[] = [
  {
    id: "1",
    title: "Mobile Conversion Rate",
    progress: 65,
    target: 4,
    dueDate: "2024-06-30"
  },
  {
    id: "2",
    title: "Cross-Border Sales",
    progress: 40,
    target: 31,
    dueDate: "2024-12-31"
  },
  {
    id: "3",
    title: "Cart Abandonment Rate",
    progress: 35,
    target: 50,
    dueDate: "2024-09-30"
  },
  {
    id: "4",
    title: "Email Marketing Conversion",
    progress: 80,
    target: 10,
    dueDate: "2024-06-30"
  }
];


export const quickActions: QuickAction[] = [
  {
    id: "1",
    title: "Market Analysis",
    description: "View global e-commerce insights",
    icon: ChartBarIcon,
    href: "/ecommerce-insights"
  },
  {
    id: "2",
    title: "Mobile Performance",
    description: "Check mobile commerce metrics",
    icon: DocumentIcon,
    href: "/report"
  },
  {
    id: "3",
    title: "Regional Insights",
    description: "Analyze regional market data",
    icon: PresentationChartBarIcon,
    href: "/presentations"
  },
  {
    id: "4",
    title: "Cross-Border Stats",
    description: "View cross-border trade metrics",
    icon: ChartBarIcon,
    href: "/ecommerce-insights#market-size"
  }
];

export const upcomingEvents: Event[] = [
  {
    id: "1",
    title: "Mobile UX Review",
    date: "2024-03-19",
    type: "meeting"
  },
  {
    id: "2",
    title: "Cross-Border Strategy Planning",
    date: "2024-03-20",
    type: "meeting"
  },
  {
    id: "3",
    title: "Cart Abandonment Analysis",
    date: "2024-03-22",
    type: "meeting"
  },
  {
    id: "4",
    title: "Western Europe Market Entry",
    date: "2024-03-25",
    type: "deadline"
  }
];

export const marketTrends: MarketTrend[] = [
  {
    id: "1",
    name: "Global E-commerce Growth",
    value: 23.6,
    change: 15.2,
    data: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2024, i).toLocaleString('default', { month: 'short' }),
      value: 18 + Math.random() * 12
    }))
  },
  {
    id: "2",
    name: "Cross-Border Commerce",
    value: 31.0,
    change: 8.5,
    data: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2024, i).toLocaleString('default', { month: 'short' }),
      value: 25 + Math.random() * 10
    }))
  },
  {
    id: "3",
    name: "Mobile Commerce Share",
    value: 70.0,
    change: 12.3,
    data: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2024, i).toLocaleString('default', { month: 'short' }),
      value: 60 + Math.random() * 15
    }))
  },
  {
    id: "4",
    name: "Subscription Commerce",
    value: 450.0,
    change: 35.0,
    data: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2024, i).toLocaleString('default', { month: 'short' }),
      value: 350 + Math.random() * 150
    }))
  }
];

export const brandHealth = {
  name: 'Brand A',
  overallScore: 85,
  metrics: {
    revenue: 82,
    growth: 78,
    satisfaction: 95,
    engagement: 85
  },
  trends: {
    revenueChange: 5.2,
    growthChange: -2.1,
    satisfactionChange: 3.5,
    engagementChange: 1.8
  }
};

export const forecastMetrics: ForecastMetric[] = [
  {
    name: 'Global E-commerce Market',
    description: 'Projected market size and growth',
    currentValue: 6310000,
    predictedValue: 7000000,
    changePercent: 10.9,
    confidence: 92,
    data: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(2024, 1, i + 1).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      actual: 6310000 + (i * 20000),
      predicted: 6400000 + (i * 25000),
      confidence: [6300000, 7100000]
    })),
    insights: [
      'Market expected to exceed $7T by 2025, reaching 23.6% of global retail',
      'Mobile commerce to represent 70% of e-commerce transactions',
      'Cross-border e-commerce growing at 25% CAGR, reaching $5T by 2028',
      'Subscription commerce sector showing explosive growth, projected $450B by 2025'
    ]
  },
  {
    name: 'Regional Performance',
    description: 'Key regional market indicators',
    currentValue: 100,
    predictedValue: 115,
    changePercent: 15.0,
    confidence: 88,
    data: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(2024, 1, i + 1).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      actual: 100 + (i * 0.5),
      predicted: 105 + (i * 0.6),
      confidence: [95, 120]
    })),
    insights: [
      'Western Europe leads with 5.2% conversion rate',
      'Asia Pacific accounts for 60%+ of global e-commerce GMV',
      'North America maintains 20% global market share',
      'Emerging markets showing rapid growth with 13%+ CAGR'
    ]
  }
];