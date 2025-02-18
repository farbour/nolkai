import {
  BeakerIcon,
  ClockIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  SparklesIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline';

import { DashboardCard } from './DashboardCard';
import React from 'react';

// file path: src/components/dashboard/TrendInsights.tsx

interface TrendData {
  title: string;
  description: string;
  metrics: string[];
}

interface TrendInsightsProps {
  aiPersonalization: TrendData;
  blockchainRetail: TrendData;
  crossBorderCommerce: TrendData;
  sustainability: TrendData;
  newTechnologies: TrendData;
  voiceCommerce: TrendData;
  subscriptionCommerce: TrendData;
}

export const TrendInsights: React.FC<TrendInsightsProps> = ({
  aiPersonalization,
  blockchainRetail,
  crossBorderCommerce,
  sustainability,
  newTechnologies,
  voiceCommerce,
  subscriptionCommerce,
}) => {
  const trends = [
    {
      data: aiPersonalization,
      icon: SparklesIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      data: blockchainRetail,
      icon: ShieldCheckIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      data: crossBorderCommerce,
      icon: GlobeAltIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      data: sustainability,
      icon: BeakerIcon,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
    },
    {
      data: voiceCommerce,
      icon: SpeakerWaveIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      data: subscriptionCommerce,
      icon: ClockIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trends.map(({ data, icon: Icon, color, bgColor }) => (
          <DashboardCard key={data.title}>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${bgColor}`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{data.title}</h3>
                </div>
              </div>
              <p className="text-sm text-gray-600">{data.description}</p>
              <div className="space-y-2">
                {data.metrics.map((metric, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="mt-1.5">
                      <div className={`w-2 h-2 rounded-full ${color}`} />
                    </div>
                    <p className="text-sm text-gray-600">{metric}</p>
                  </div>
                ))}
              </div>
            </div>
          </DashboardCard>
        ))}
      </div>

      <DashboardCard title="Emerging Technologies">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">{newTechnologies.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newTechnologies.metrics.map((metric, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="mt-1.5">
                  <div className="w-2 h-2 rounded-full bg-indigo-600" />
                </div>
                <p className="text-sm text-gray-600">{metric}</p>
              </div>
            ))}
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};