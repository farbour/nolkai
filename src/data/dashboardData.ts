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

// file path: src/data/dashboardData.ts

export const kpis: KPI[] = [
  {
    title: "Total Revenue",
    value: 1200000,
    change: 12.3,
    trend: 'up',
    description: "vs. last month",
    data: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2024, i).toLocaleString('default', { month: 'short' }),
      value: 800000 + Math.random() * 500000
    }))
  },
  {
    title: "Active Brands",
    value: 15,
    change: 13.3,
    trend: 'up',
    description: "vs. last month",
    data: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2024, i).toLocaleString('default', { month: 'short' }),
      value: 10 + Math.random() * 7
    }))
  },
  {
    title: "Avg. Order Value",
    value: 85,
    change: 5.7,
    trend: 'up',
    description: "vs. last month",
    data: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2024, i).toLocaleString('default', { month: 'short' }),
      value: 70 + Math.random() * 20
    }))
  },
  {
    title: "Customer Satisfaction",
    value: 94,
    change: 2.1,
    trend: 'up',
    description: "vs. last month",
    data: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2024, i).toLocaleString('default', { month: 'short' }),
      value: 90 + Math.random() * 5
    }))
  }
];

export const alerts = [
  {
    id: 1,
    title: "Revenue Milestone Achieved",
    description: "Q2 revenue target of $2M has been reached",
    type: "success" as AlertType,
    time: "Just now"
  },
  {
    id: 2,
    title: "New Brand Onboarding",
    description: "Brand F has completed onboarding process",
    type: "info" as AlertType,
    time: "2 hours ago"
  },
  {
    id: 3,
    title: "Performance Warning",
    description: "Brand D's conversion rate dropped by 5%",
    type: "warning" as AlertType,
    time: "1 day ago"
  }
];

export const tasks: Task[] = [
  {
    id: "1",
    title: "Review Brand D Performance",
    description: "Analyze recent performance drop and prepare action plan",
    priority: "high",
    dueDate: "2024-03-18"
  },
  {
    id: "2",
    title: "Prepare Q2 Report",
    description: "Compile performance data and create presentation",
    priority: "medium",
    dueDate: "2024-03-25"
  }
];

export const matrixTasks: Task[] = [
  {
    id: "3",
    title: "Review Brand D Performance",
    description: "Analyze recent performance drop",
    priority: "high",
    dueDate: "2024-03-18"
  },
  {
    id: "4",
    title: "Update Marketing Strategy",
    description: "Plan Q2 marketing initiatives",
    priority: "medium",
    dueDate: "2024-03-25"
  }
];

export const aiSuggestions: AIInsight[] = [
  {
    id: "1",
    title: "Revenue Opportunity",
    description: "Based on current trends, increasing marketing spend in Q2 could boost revenue by 15%",
    impact: "high",
    category: "revenue"
  },
  {
    id: "2",
    title: "Performance Alert",
    description: "Conversion rates have dropped 5% in the last week",
    impact: "medium",
    category: "performance"
  }
];

export const performanceMetrics = [
  { month: 'Jan', revenue: 800000, orders: 12000 },
  { month: 'Feb', revenue: 920000, orders: 14500 },
  { month: 'Mar', revenue: 880000, orders: 13200 },
  { month: 'Apr', revenue: 1100000, orders: 16800 },
  { month: 'May', revenue: 1200000, orders: 18500 }
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
    title: "Q2 Revenue Target",
    progress: 60,
    target: 2000000,
    dueDate: "2024-06-30"
  },
  {
    id: "2",
    title: "Brand Expansion",
    progress: 75,
    target: 20,
    dueDate: "2024-12-31"
  }
];

export const quickActions: QuickAction[] = [
  {
    id: "1",
    title: "Create Report",
    description: "Generate a new performance report",
    icon: DocumentIcon,
    href: "/report"
  },
  {
    id: "2",
    title: "View Analytics",
    description: "Check detailed analytics",
    icon: ChartBarIcon,
    href: "/overview"
  }
];

export const upcomingEvents: Event[] = [
  {
    id: "1",
    title: "Q2 Performance Review",
    date: "2024-03-19",
    type: "meeting"
  },
  {
    id: "2",
    title: "Brand F Onboarding Call",
    date: "2024-03-20",
    type: "meeting"
  }
];

export const marketTrends: MarketTrend[] = [
  {
    id: "1",
    name: "E-commerce Growth",
    value: 8.5,
    change: 2.1,
    data: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2024, i).toLocaleString('default', { month: 'short' }),
      value: 5 + Math.random() * 8
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
    name: 'Revenue',
    description: 'Projected revenue for next month',
    currentValue: 1200000,
    predictedValue: 1350000,
    changePercent: 12.5,
    confidence: 85,
    data: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(2024, 1, i + 1).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      actual: 1200000 + Math.random() * 100000,
      predicted: 1250000 + Math.random() * 150000,
      confidence: [1200000, 1400000]
    })),
    insights: [
      'Seasonal uptick expected due to upcoming holiday season',
      'New product launches could drive additional 5-8% growth',
      'Market conditions suggest strong consumer demand'
    ]
  }
];