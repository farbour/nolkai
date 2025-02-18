// file path: src/types/dashboard.ts

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
}

export interface ForecastData {
  date: string;
  actual: number;
  predicted: number;
  confidence: [number, number]; // [lower bound, upper bound]
}

export interface ForecastMetric {
  name: string;
  description: string;
  currentValue: number;
  predictedValue: number;
  changePercent: number;
  confidence: number;
  data: ForecastData[];
  insights: string[];
}

export interface KPI {
  title: string;
  value: number;
  change: number;
  trend: 'up' | 'down';
  description: string;
}

export interface Goal {
  id: string;
  title: string;
  progress: number;
  target: number;
  dueDate: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  type: 'meeting' | 'deadline' | 'reminder';
}

export interface Brand {
  id: string;
  name: string;
  performance: number;
  trend: 'up' | 'down';
  metrics: {
    name: string;
    value: number;
    change: number;
  }[];
}

export interface MarketTrend {
  id: string;
  name: string;
  value: number;
  change: number;
  data: {
    date: string;
    value: number;
  }[];
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  category: string;
}