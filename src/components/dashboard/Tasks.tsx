import {
  CheckCircleIcon,
  ClockIcon,
  ListBulletIcon,
  TagIcon
} from '@heroicons/react/24/outline';

import React from 'react';

// file path: src/components/dashboard/Tasks.tsx

interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  status: 'todo' | 'in-progress' | 'completed';
  tags: string[];
}

interface TasksProps {
  tasks: Task[];
}

export const Tasks: React.FC<TasksProps> = ({ tasks }) => {
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'in-progress':
        return 'text-blue-600 bg-blue-50';
      case 'todo':
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Tasks</h2>
          <ListBulletIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {tasks.map((task) => (
          <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className={`p-2 rounded-lg ${getStatusColor(task.status)}`}>
                  <CheckCircleIcon className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-900">{task.title}</h3>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                <div className="mt-2 flex items-center space-x-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {task.dueDate}
                  </div>
                  <div className="flex items-center space-x-2">
                    {task.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center text-xs">
                        <TagIcon className="h-3 w-3 mr-1 text-gray-400" />
                        {tag}
                      </span>
                    ))}
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