import { QuickAction } from '@/types/dashboard';
import React from 'react';
import { getColorClass } from '@/utils/styleUtils';

// file path: src/components/dashboard/QuickActions.tsx

interface QuickActionsProps {
  actions: QuickAction[];
}

export const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  return (
    <div className="space-y-4">
      {actions.map((action) => (
        <a
          key={action.id}
          href={action.href}
          className="group block p-4 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-lg transition-colors ${getColorClass('blue', 'bg')}`}>
              <action.icon className={`h-6 w-6 ${getColorClass('blue', 'text')}`} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">{action.title}</h3>
              <p className="text-sm text-gray-500">{action.description}</p>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};