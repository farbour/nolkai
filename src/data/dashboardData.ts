// file path: src/data/dashboardData.ts

import { AlertType, ColorType } from '@/types/theme';
import {
  ArrowTrendingUpIcon,
  BoltIcon,
  ChartBarIcon,
  DocumentIcon,
  PresentationChartBarIcon,
  SparklesIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

export const kpis = [
  {
    title: "Total Revenue",
    value: "$1.2M",
    change: "+12.3%",
    timeframe: "vs. last month",
    icon: ChartBarIcon,
    trend: 'up' as const,
    color: 'green' as ColorType,
    data: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2024, i).toLocaleString('default', { month: 'short' }),
      value: 800000 + Math.random() * 500000
    }))
  },
  {
    title: "Active Brands",
    value: "15",
    change: "+2",
    timeframe: "vs. last month",
    icon: UserGroupIcon,
    trend: 'up' as const,
    color: 'blue' as ColorType,
    data: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2024, i).toLocaleString('default', { month: 'short' }),
      value: 10 + Math.random() * 7
    }))
  },
  {
    title: "Avg. Order Value",
    value: "$85",
    change: "+5.7%",
    timeframe: "vs. last month",
    icon: SparklesIcon,
    trend: 'up' as const,
    color: 'purple' as ColorType,
    data: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2024, i).toLocaleString('default', { month: 'short' }),
      value: 70 + Math.random() * 20
    }))
  },
  {
    title: "Customer Satisfaction",
    value: "94%",
    change: "+2.1%",
    timeframe: "vs. last month",
    icon: SparklesIcon,
    trend: 'up' as const,
    color: 'indigo' as ColorType,
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

export const aiSuggestions = [
  {
    id: 1,
    title: "Revenue Opportunity",
    description: "Based on current trends, increasing marketing spend in Q2 could boost revenue by 15%",
    impact: "High" as const,
    icon: ArrowTrendingUpIcon,
    category: "revenue" as const
  },
  {
    id: 2,
    title: "Performance Alert",
    description: "Conversion rates have dropped 5% in the last week",
    impact: "Medium" as const,
    icon: BoltIcon,
    category: "performance" as const
  }
];

export const performanceMetrics = [
  { month: 'Jan', revenue: 800000, orders: 12000 },
  { month: 'Feb', revenue: 920000, orders: 14500 },
  { month: 'Mar', revenue: 880000, orders: 13200 },
  { month: 'Apr', revenue: 1100000, orders: 16800 },
  { month: 'May', revenue: 1200000, orders: 18500 },
];

export const brandPerformance = [
  { name: 'Brand A', revenue: 450000, growth: 15, satisfaction: 95 },
  { name: 'Brand B', revenue: 380000, growth: 12, satisfaction: 92 },
  { name: 'Brand C', revenue: 320000, growth: 18, satisfaction: 94 },
  { name: 'Brand D', revenue: 290000, growth: 8, satisfaction: 91 },
  { name: 'Brand E', revenue: 250000, growth: 22, satisfaction: 96 },
];

export const goals = [
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

export const quickActions = [
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

export const upcomingEvents = [
  {
    id: 1,
    title: "Q2 Performance Review",
    type: "Meeting",
    date: "Tomorrow",
    time: "10:00 AM"
  },
  {
    id: 2,
    title: "Brand F Onboarding Call",
    type: "Call",
    date: "Wed, Mar 20",
    time: "2:00 PM"
  },
  {
    id: 3,
    title: "Marketing Strategy Workshop",
    type: "Workshop",
    date: "Thu, Mar 21",
    time: "11:00 AM"
  }
];

export const marketTrends = [
  {
    id: 1,
    name: "E-commerce Growth",
    description: "Overall market growth in the D2C sector",
    change: "+8.5%",
    trend: 'up' as const,
    data: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2024, i).toLocaleString('default', { month: 'short' }),
      value: 5 + Math.random() * 8,
      change: Math.random() * 2 - 1
    }))
  },
  {
    id: 2,
    name: "Customer Acquisition Cost",
    description: "Average cost per new customer",
    change: "-3.2%",
    trend: 'down' as const,
    data: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2024, i).toLocaleString('default', { month: 'short' }),
      value: 15 - Math.random() * 5,
      change: Math.random() * 2 - 1
    }))
  }
];

export const tasks = [
  {
    id: 1,
    title: "Review Brand D Performance",
    description: "Analyze recent performance drop and prepare action plan",
    priority: "high" as const,
    dueDate: "Today",
    status: "in-progress" as const,
    tags: ["analysis", "urgent"]
  },
  {
    id: 2,
    title: "Prepare Q2 Report",
    description: "Compile performance data and create presentation",
    priority: "medium" as const,
    dueDate: "Next Week",
    status: "todo" as const,
    tags: ["report", "quarterly"]
  },
  {
    id: 3,
    title: "Update Marketing Budget",
    description: "Reallocate Q2 marketing budget based on performance",
    priority: "low" as const,
    dueDate: "Mar 25",
    status: "completed" as const,
    tags: ["marketing", "budget"]
  }
];