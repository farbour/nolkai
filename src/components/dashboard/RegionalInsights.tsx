import {
  BanknotesIcon,
  BuildingStorefrontIcon,
  ScaleIcon,
} from '@heroicons/react/24/outline';

import { DashboardCard } from './DashboardCard';
import React from 'react';

// file path: src/components/dashboard/RegionalInsights.tsx

interface PlatformData {
  name: string;
  description: string;
}

interface RegionalInsightsProps {
  economicImpacts: string;
  legislativeChanges: string;
  emergingPlayers: string;
  platformsByCountry: {
    [country: string]: PlatformData[];
  };
}

export const RegionalInsights: React.FC<RegionalInsightsProps> = ({
  economicImpacts,
  legislativeChanges,
  emergingPlayers,
  platformsByCountry,
}) => {
  const sections = [
    {
      title: 'Economic Impacts',
      content: economicImpacts,
      icon: BanknotesIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Legislative Changes',
      content: legislativeChanges,
      icon: ScaleIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Emerging Players',
      content: emergingPlayers,
      icon: BuildingStorefrontIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {sections.map(({ title, content, icon: Icon, color, bgColor }) => (
          <DashboardCard key={title}>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${bgColor}`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              </div>
              <p className="text-sm text-gray-600">{content}</p>
            </div>
          </DashboardCard>
        ))}
      </div>

      <DashboardCard title="Top Platforms by Country">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(platformsByCountry).map(([country, platforms]) => (
            <div key={country} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">{country}</h3>
              <div className="space-y-3">
                {platforms.map((platform) => (
                  <div key={platform.name} className="border-b border-gray-100 pb-3 last:border-0">
                    <div className="flex items-start space-x-2">
                      <div className="mt-1.5">
                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{platform.name}</h4>
                        <p className="text-sm text-gray-600">{platform.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
};