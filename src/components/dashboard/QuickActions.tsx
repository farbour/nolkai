// file path: src/components/dashboard/QuickActions.tsx
import { QuickAction } from '@/types/dashboard';
import React from 'react';
import { getColorClass } from '@/utils/styleUtils';

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
          className="group block p-4 rounded-lg hover:bg-[rgb(249,243,233)] transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-lg transition-colors ${getColorClass('accent2', 'bg')}`}>
              <action.icon className={`h-6 w-6 ${getColorClass('accent2', 'text')}`} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[rgb(52,76,69)]">{action.title}</h3>
              <p className="text-sm text-[rgb(202,202,202)]">{action.description}</p>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};