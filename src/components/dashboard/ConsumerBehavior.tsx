import {
  CalendarIcon,
  ChartBarIcon,
  ShoppingCartIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

import { DashboardCard } from './DashboardCard';
import React from 'react';

// file path: src/components/dashboard/ConsumerBehavior.tsx

interface BehaviorData {
  title: string;
  description: string;
  stats: string[];
}

interface ConsumerBehaviorProps {
  purchaseDrivers: BehaviorData;
  psychologicalDrivers: BehaviorData;
  cartAbandonment: BehaviorData;
  spendingPatterns: {
    demographics: string[];
    spending: string[];
    gender: string[];
    location: string[];
  };
  seasonalTrends: {
    description: string;
    trends: string[];
  };
}

export const ConsumerBehavior: React.FC<ConsumerBehaviorProps> = ({
  purchaseDrivers,
  psychologicalDrivers,
  cartAbandonment,
  spendingPatterns,
  seasonalTrends,
}) => {
  const mainInsights = [
    {
      title: 'Key Purchase Drivers',
      data: purchaseDrivers,
      icon: ShoppingCartIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Psychological Factors',
      data: psychologicalDrivers,
      icon: UserGroupIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Cart Abandonment',
      data: cartAbandonment,
      icon: ChartBarIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {mainInsights.map(({ title, data, icon: Icon, color, bgColor }) => (
          <DashboardCard key={title}>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${bgColor}`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              </div>
              <p className="text-sm text-gray-600">{data.description}</p>
              <div className="space-y-2">
                {data.stats.map((stat, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="mt-1.5">
                      <div className={`w-2 h-2 rounded-full ${color}`} />
                    </div>
                    <p className="text-sm text-gray-600">{stat}</p>
                  </div>
                ))}
              </div>
            </div>
          </DashboardCard>
        ))}
      </div>

      <DashboardCard title="Spending Patterns & Demographics">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900">Demographics</h3>
            <div className="space-y-2">
              {spendingPatterns.demographics.map((item, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="mt-1.5">
                    <div className="w-2 h-2 rounded-full bg-purple-600" />
                  </div>
                  <p className="text-sm text-gray-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900">Spending Behavior</h3>
            <div className="space-y-2">
              {spendingPatterns.spending.map((item, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="mt-1.5">
                    <div className="w-2 h-2 rounded-full bg-indigo-600" />
                  </div>
                  <p className="text-sm text-gray-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900">Gender Differences</h3>
            <div className="space-y-2">
              {spendingPatterns.gender.map((item, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="mt-1.5">
                    <div className="w-2 h-2 rounded-full bg-pink-600" />
                  </div>
                  <p className="text-sm text-gray-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900">Location Impact</h3>
            <div className="space-y-2">
              {spendingPatterns.location.map((item, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="mt-1.5">
                    <div className="w-2 h-2 rounded-full bg-yellow-600" />
                  </div>
                  <p className="text-sm text-gray-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardCard>

      <DashboardCard title="Seasonal Trends">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-orange-100">
              <CalendarIcon className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-sm text-gray-600">{seasonalTrends.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seasonalTrends.trends.map((trend, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="mt-1.5">
                  <div className="w-2 h-2 rounded-full bg-orange-600" />
                </div>
                <p className="text-sm text-gray-600">{trend}</p>
              </div>
            ))}
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};