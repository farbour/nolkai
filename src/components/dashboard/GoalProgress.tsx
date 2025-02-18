import { ColorType } from '@/types/theme';
import { FlagIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { getColorClass } from '@/utils/styleUtils';

// file path: src/components/dashboard/GoalProgress.tsx

interface Goal {
  name: string;
  target: string;
  current: string;
  progress: number;
  color: ColorType;
}

interface GoalProgressProps {
  goals: Goal[];
}

export const GoalProgress: React.FC<GoalProgressProps> = ({ goals }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Goals</h2>
          <FlagIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      <div className="p-6 space-y-6">
        {goals.map((goal) => (
          <div key={goal.name} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900">{goal.name}</span>
              <span className="text-sm text-gray-500">{goal.current} / {goal.target}</span>
            </div>
            <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`absolute top-0 left-0 h-full rounded-full transition-all ${getColorClass(goal.color, 'bg')}`}
                style={{ width: `${goal.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};