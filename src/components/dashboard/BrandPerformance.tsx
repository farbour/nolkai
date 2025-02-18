import React from 'react';
import { TrophyIcon } from '@heroicons/react/24/outline';

// file path: src/components/dashboard/BrandPerformance.tsx

interface Brand {
  name: string;
  revenue: number;
  growth: number;
  satisfaction: number;
}

interface BrandPerformanceProps {
  brands: Brand[];
}

export const BrandPerformance: React.FC<BrandPerformanceProps> = ({ brands }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Top Performing Brands</h2>
          <TrophyIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {brands.map((brand, index) => (
          <div key={brand.name} className="p-6 hover:bg-gray-50 transition-colors">
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
                  <p className="text-sm font-medium text-gray-900">${brand.revenue.toLocaleString()}</p>
                </div>
                <div className="mt-1 flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-green-600">+{brand.growth}% growth</span>
                    <span className="text-gray-500">{brand.satisfaction}% satisfaction</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};