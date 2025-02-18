import { ChartBarIcon } from '@heroicons/react/24/outline';
import { ColorType } from '@/types/theme';
import React from 'react';
import { getColorClass } from '@/utils/styleUtils';

// file path: src/components/dashboard/QuickActions.tsx

interface QuickAction {
  name: string;
  description: string;
  icon: typeof ChartBarIcon;
  href: string;
  color: ColorType;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {actions.map((action) => (
            <a
              key={action.name}
              href={action.href}
              className="group block p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg transition-colors ${getColorClass(action.color, 'bg')}`}>
                  <action.icon className={`h-6 w-6 ${getColorClass(action.color, 'text')}`} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{action.name}</h3>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};