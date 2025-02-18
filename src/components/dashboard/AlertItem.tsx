import { AlertType } from '@/types/theme';
import React from 'react';
import { getAlertStyles } from '@/utils/styleUtils';

// file path: src/components/dashboard/AlertItem.tsx

interface AlertItemProps {
  id: number;
  title: string;
  description: string;
  type: AlertType;
  time: string;
}

export const AlertItem: React.FC<AlertItemProps> = ({
  id,
  title,
  description,
  type,
  time
}) => {
  const styles = getAlertStyles(type);

  return (
    <div
      key={id}
      className="flex items-start py-2 group hover:bg-gray-50 transition-colors duration-150 px-1 rounded"
    >
      <div className="flex-shrink-0 mt-1">
        <styles.icon className={`h-4 w-4 ${styles.text} opacity-75`} />
      </div>
      <div className="ml-3 min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900">
          {title}
        </p>
        <p className="text-sm text-gray-600 line-clamp-2">
          {description}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {time}
        </p>
      </div>
    </div>
  );
};