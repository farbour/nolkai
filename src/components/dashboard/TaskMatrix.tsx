import {
  ClockIcon,
  ExclamationTriangleIcon,
  FireIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { Priority, Task } from '@/types/dashboard';

import { DashboardCard } from './DashboardCard';
import React from 'react';
import { TaskMatrixItem } from './TaskMatrixItem';

// file path: src/components/dashboard/TaskMatrix.tsx

interface TaskMatrixProps {
  tasks: Task[];
  onTaskMove: (taskId: string, newPriority: Priority) => void;
}

const quadrants = [
  {
    id: 'urgent-important' as Priority,
    title: 'Do First',
    description: 'Urgent & Important',
    icon: FireIcon,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-600',
  },
  {
    id: 'not-urgent-important' as Priority,
    title: 'Schedule',
    description: 'Not Urgent but Important',
    icon: ClockIcon,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
  },
  {
    id: 'urgent-not-important' as Priority,
    title: 'Delegate',
    description: 'Urgent but Not Important',
    icon: ExclamationTriangleIcon,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    iconColor: 'text-yellow-600',
  },
  {
    id: 'not-urgent-not-important' as Priority,
    title: 'Eliminate',
    description: 'Not Urgent & Not Important',
    icon: TrashIcon,
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    iconColor: 'text-gray-600',
  },
];

export const TaskMatrix: React.FC<TaskMatrixProps> = ({ tasks, onTaskMove }) => {
  const getQuadrantTasks = (quadrantId: Priority) => {
    return tasks.filter(task => task.priority === quadrantId);
  };

  const handleTaskClick = (taskId: string, currentPriority: Priority) => {
    // Cycle through priorities when clicking a task
    const currentIndex = quadrants.findIndex(q => q.id === currentPriority);
    const nextIndex = (currentIndex + 1) % quadrants.length;
    onTaskMove(taskId, quadrants[nextIndex].id);
  };

  return (
    <DashboardCard>
      <div className="border-b border-gray-100 pb-4 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Eisenhower Matrix</h2>
        <p className="text-sm text-gray-500 mt-1">
          Click tasks to change their priority
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {quadrants.map((quadrant) => (
          <div
            key={quadrant.id}
            className={`rounded-lg border p-4 ${quadrant.borderColor} ${quadrant.bgColor}`}
          >
            <div className="flex items-center space-x-2 mb-4">
              <quadrant.icon className={`h-5 w-5 ${quadrant.iconColor}`} />
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {quadrant.title}
                </h3>
                <p className="text-xs text-gray-500">
                  {quadrant.description}
                </p>
              </div>
            </div>
            <div className="space-y-2 min-h-[100px]">
              {getQuadrantTasks(quadrant.id).map((task) => (
                <TaskMatrixItem
                  key={task.id}
                  task={task}
                  onClick={() => handleTaskClick(task.id, task.priority)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
};