import React, { useState } from 'react';
import {
  aiSuggestions,
  alerts,
  brandHealth,
  brandPerformance,
  forecastMetrics,
  goals,
  kpis,
  marketTrends,
  matrixTasks,
  performanceMetrics,
  quickActions,
  tasks,
  upcomingEvents
} from '@/data/dashboardData';

import { AIInsights } from '@/components/dashboard/AIInsights';
import { AlertItem } from '@/components/dashboard/AlertItem';
import { BrandHealthScore } from '@/components/dashboard/BrandHealthScore';
import { BrandPerformance } from '@/components/dashboard/BrandPerformance';
import { Calendar } from '@/components/dashboard/Calendar';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSection } from '@/components/dashboard/DashboardSection';
import { ForecastMetrics } from '@/components/dashboard/ForecastMetrics';
import { GoalProgress } from '@/components/dashboard/GoalProgress';
import { KPICard } from '@/components/dashboard/KPICard';
import { MarketTrends } from '@/components/dashboard/MarketTrends';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { TaskMatrix } from '@/components/dashboard/TaskMatrix';
import { Tasks } from '@/components/dashboard/Tasks';

// file path: src/pages/index.tsx

type TimeframeId = 'today' | 'week' | 'month' | 'quarter' | 'year';

export default function Home() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeId>('week');
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  const handleTaskMove = (taskId: string, newPriority: string) => {
    console.log(`Moving task ${taskId} to ${newPriority}`);
    // In a real app, this would update the backend
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader
          title={`${greeting}, John`}
          description="Here's your business overview"
        />

        <div className="grid grid-cols-12 gap-8">
          {/* Left Column - Primary Content */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            {/* KPIs */}
            <DashboardSection>
              <DashboardGrid cols={2}>
                {kpis.map((kpi) => (
                  <KPICard key={kpi.title} {...kpi} />
                ))}
              </DashboardGrid>
            </DashboardSection>

            {/* Performance Overview */}
            <DashboardSection>
              <DashboardCard>
                <PerformanceChart
                  data={performanceMetrics}
                  timeframe={selectedTimeframe}
                  onTimeframeChange={setSelectedTimeframe}
                />
              </DashboardCard>
              <DashboardCard>
                <ForecastMetrics metrics={forecastMetrics} />
              </DashboardCard>
            </DashboardSection>

            {/* Brand Performance & Health */}
            <DashboardSection>
              <DashboardGrid cols={2}>
                <DashboardCard title="Brand Performance">
                  <BrandPerformance brands={brandPerformance} />
                </DashboardCard>
                <DashboardCard title="Brand Health">
                  <BrandHealthScore brand={brandHealth} />
                </DashboardCard>
              </DashboardGrid>
            </DashboardSection>

            {/* Market Trends */}
            <DashboardSection>
              <DashboardCard title="Market Trends">
                <MarketTrends trends={marketTrends} />
              </DashboardCard>
            </DashboardSection>
          </div>

          {/* Right Column - Secondary Content */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Recent Updates */}
            <DashboardCard title="Recent Updates" noPadding>
              <div className="divide-y divide-gray-100">
                {alerts.map((alert) => (
                  <AlertItem key={alert.id} {...alert} />
                ))}
              </div>
            </DashboardCard>

            {/* Quick Actions & Goals */}
            <DashboardCard title="Quick Actions">
              <QuickActions actions={quickActions} />
            </DashboardCard>
            
            <DashboardCard title="Goals">
              <GoalProgress goals={goals} />
            </DashboardCard>

            {/* Calendar */}
            <DashboardCard title="Calendar">
              <Calendar events={upcomingEvents} />
            </DashboardCard>

            {/* AI Insights */}
            <DashboardCard title="AI Insights">
              <AIInsights suggestions={aiSuggestions} />
            </DashboardCard>
          </div>
        </div>

        {/* Full Width Sections */}
        <DashboardSection className="mt-8">
          <DashboardGrid cols={2}>
            <DashboardCard title="Task Matrix">
              <TaskMatrix 
                tasks={matrixTasks} 
                onTaskMove={handleTaskMove}
              />
            </DashboardCard>
            <DashboardCard title="Tasks">
              <Tasks tasks={tasks} />
            </DashboardCard>
          </DashboardGrid>
        </DashboardSection>
      </div>
    </div>
  );
}
