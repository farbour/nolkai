import { ClockIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { Task } from '@/types/dashboard';

// file path: src/components/dashboard/TaskMatrixItem.tsx

interface TaskMatrixItemProps {
  task: Task;
  onClick: () => void;
}

export const TaskMatrixItem: React.FC<TaskMatrixItemProps> = ({ task, onClick }) => (
  <button
    onClick={onClick}
    className="w-full rounded-lg border border-white bg-white p-3 shadow-sm
      hover:border-green-500 hover:shadow-md transition-all text-left group"
  >
    <h4 className="text-sm font-medium text-gray-900 group-hover:text-green-700">
      {task.title}
    </h4>
    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
      {task.description}
    </p>
    {task.dueDate && (
      <div className="flex items-center mt-2 text-xs text-gray-500">
        <ClockIcon className="h-3 w-3 mr-1" />
        {task.dueDate}
      </div>
    )}
  </button>
);