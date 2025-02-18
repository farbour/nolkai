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
      className={`flex items-center p-4 rounded-lg border ${styles.bg} ${styles.border}`}
    >
      <div className="flex-shrink-0">
        <styles.icon className={`h-5 w-5 ${styles.text}`} />
      </div>
      <div className="ml-3">
        <h3 className={`text-sm font-medium ${styles.text}`}>
          {title}
        </h3>
        <div className="mt-1 text-sm opacity-90">
          {description}
        </div>
      </div>
      <div className="ml-auto pl-3">
        <div className="text-sm text-gray-500">
          {time}
        </div>
      </div>
    </div>
  );
};