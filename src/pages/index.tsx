import React, { useState } from 'react';
import {
  aiSuggestions,
  alerts,
  brandPerformance,
  goals,
  kpis,
  performanceMetrics,
  quickActions
} from '@/data/dashboardData';

import { AIInsights } from '@/components/dashboard/AIInsights';
import { AlertItem } from '@/components/dashboard/AlertItem';
import { BrandPerformance } from '@/components/dashboard/BrandPerformance';
import { GoalProgress } from '@/components/dashboard/GoalProgress';
import { KPICard } from '@/components/dashboard/KPICard';
import { Layout } from '@/components/Layout';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { QuickActions } from '@/components/dashboard/QuickActions';

// file path: src/pages/index.tsx

export default function Home() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1y');
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  return (
    <Layout>
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

        {/* Alerts */}
        <div className="space-y-4">
          {alerts.map((alert) => (
            <AlertItem key={alert.id} {...alert} />
          ))}
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi) => (
            <KPICard key={kpi.title} {...kpi} />
          ))}
        </div>

        {/* Performance Chart */}
        <PerformanceChart
          data={performanceMetrics}
          timeframe={selectedTimeframe}
          onTimeframeChange={setSelectedTimeframe}
        />

        {/* Brand Performance */}
        <BrandPerformance brands={brandPerformance} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Goals & Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <GoalProgress goals={goals} />
            <QuickActions actions={quickActions} />
          </div>

          {/* AI Suggestions */}
          <div className="lg:col-span-2">
            <AIInsights suggestions={aiSuggestions} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
