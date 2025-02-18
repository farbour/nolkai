import {
  ClockIcon,
  ExclamationTriangleIcon,
  FireIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

import React from 'react';

// file path: src/components/dashboard/TaskMatrix.tsx

type Priority = 'urgent-important' | 'not-urgent-important' | 'urgent-not-important' | 'not-urgent-not-important';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate?: string;
}

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
    color: 'red',
  },
  {
    id: 'not-urgent-important' as Priority,
    title: 'Schedule',
    description: 'Not Urgent but Important',
    icon: ClockIcon,
    color: 'blue',
  },
  {
    id: 'urgent-not-important' as Priority,
    title: 'Delegate',
    description: 'Urgent but Not Important',
    icon: ExclamationTriangleIcon,
    color: 'yellow',
  },
  {
    id: 'not-urgent-not-important' as Priority,
    title: 'Eliminate',
    description: 'Not Urgent & Not Important',
    icon: TrashIcon,
    color: 'gray',
  },
];

export const TaskMatrix: React.FC<TaskMatrixProps> = ({ tasks, onTaskMove }) => {
  const getQuadrantTasks = (quadrantId: Priority) => {
    return tasks.filter(task => task.priority === quadrantId);
  };

  const getQuadrantStyle = (color: string) => {
    const styles = {
      red: 'border-red-200 bg-red-50',
      blue: 'border-blue-200 bg-blue-50',
      yellow: 'border-yellow-200 bg-yellow-50',
      gray: 'border-gray-200 bg-gray-50',
    };
    return styles[color as keyof typeof styles];
  };

  const handleTaskClick = (taskId: string, currentPriority: Priority) => {
    // Cycle through priorities when clicking a task
    const currentIndex = quadrants.findIndex(q => q.id === currentPriority);
    const nextIndex = (currentIndex + 1) % quadrants.length;
    onTaskMove(taskId, quadrants[nextIndex].id);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Eisenhower Matrix</h2>
        <p className="text-sm text-gray-500 mt-1">
          Click tasks to change their priority
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 p-6">
        {quadrants.map((quadrant) => (
          <div
            key={quadrant.id}
            className={`rounded-lg border p-4 ${getQuadrantStyle(quadrant.color)}`}
          >
            <div className="flex items-center space-x-2 mb-4">
              <quadrant.icon className={`h-5 w-5 text-${quadrant.color}-600`} />
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
                <button
                  key={task.id}
                  onClick={() => handleTaskClick(task.id, task.priority)}
                  className="w-full rounded-lg border border-white bg-white p-3 shadow-sm
                    hover:border-nolk-green hover:shadow-md transition-all text-left"
                >
                  <h4 className="text-sm font-medium text-gray-900">
                    {task.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {task.description}
                  </p>
                  {task.dueDate && (
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      {task.dueDate}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};