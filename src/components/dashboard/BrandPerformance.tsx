import { Brand } from '@/types/dashboard';
import { DashboardCard } from './DashboardCard';
import React from 'react';
import { TrophyIcon } from '@heroicons/react/24/outline';
import { formatNumber } from '@/utils/formatters';

// file path: src/components/dashboard/BrandPerformance.tsx

interface BrandPerformanceProps {
  brands: Brand[];
}

export const BrandPerformance: React.FC<BrandPerformanceProps> = ({ brands }) => {
  return (
    <DashboardCard>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Top Performing Brands</h2>
        <TrophyIcon className="h-5 w-5 text-gray-400" />
      </div>
      <div className="divide-y divide-gray-100">
        {brands.map((brand, index) => (
          <div key={brand.id} className="py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  index === 0 ? 'bg-yellow-50 text-yellow-600' :
                  index === 1 ? 'bg-gray-100 text-gray-600' :
                  index === 2 ? 'bg-orange-50 text-orange-600' :
                  'bg-gray-50 text-gray-600'
                }`}>
                  {index + 1}
                </div>
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">{brand.name}</h3>
                  <p className="text-sm font-medium text-gray-900">
                    {formatNumber(brand.metrics[0].value)}
                  </p>
                </div>
                <div className="mt-1 flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className={`${brand.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {brand.trend === 'up' ? '+' : '-'}{brand.metrics[1].value}% growth
                    </span>
                    <span className="text-gray-500">
                      {brand.metrics[2].value}% satisfaction
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
};