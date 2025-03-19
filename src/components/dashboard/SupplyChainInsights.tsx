import {
  ChartBarIcon,
  ClockIcon,
  CubeIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';

import { DashboardCard } from './DashboardCard';
import React from 'react';

// file path: src/components/dashboard/SupplyChainInsights.tsx

interface SupplyChainInsightsProps {
  warehouseAutomation: {
    description: string;
    metrics: string[];
  };
  fulfillmentInnovations: {
    description: string;
    innovations: string[];
  };
  lastMileDelivery: {
    description: string;
    stats: string[];
  };
  deliverySpeed: {
    description: string;
    trends: string[];
  };
  fulfillmentEfficiency: {
    description: string;
    improvements: string[];
  };
}

export const SupplyChainInsights: React.FC<SupplyChainInsightsProps> = ({
  warehouseAutomation,
  fulfillmentInnovations,
  lastMileDelivery,
  deliverySpeed,
  fulfillmentEfficiency,
}) => {
  const sections = [
    {
      title: 'Warehouse Automation',
      content: warehouseAutomation,
      icon: CubeIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      type: 'metrics',
    },
    {
      title: 'Last Mile Delivery',
      content: lastMileDelivery,
      icon: TruckIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      type: 'stats',
    },
    {
      title: 'Delivery Speed',
      content: deliverySpeed,
      icon: ClockIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      type: 'trends',
    },
    {
      title: 'Fulfillment Efficiency',
      content: fulfillmentEfficiency,
      icon: ChartBarIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      type: 'improvements',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map(({ title, content, icon: Icon, color, bgColor, type }) => (
          <DashboardCard key={title}>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${bgColor}`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              </div>
              <p className="text-sm text-gray-600">{content.description}</p>
              <div className="space-y-2">
                {(Array.isArray(content[type as keyof typeof content])
                  ? (content[type as keyof typeof content] as unknown) as string[]
                  : []
                ).map((item: string, index: number) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="mt-1.5">
                      <div className={`w-2 h-2 rounded-full ${color}`} />
                    </div>
                    <p className="text-sm text-gray-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </DashboardCard>
        ))}
      </div>

      <DashboardCard title="Fulfillment Innovations">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">{fulfillmentInnovations.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fulfillmentInnovations.innovations.map((innovation, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="mt-1.5">
                  <div className="w-2 h-2 rounded-full bg-indigo-600" />
                </div>
                <p className="text-sm text-gray-600">{innovation}</p>
              </div>
            ))}
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};