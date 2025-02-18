import React from 'react';

// file path: src/components/dashboard/DashboardSection.tsx

interface DashboardSectionProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  children,
  title,
  description,
  className = ''
}) => {
  return (
    <section className={`space-y-4 ${className}`}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h2 className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm text-gray-500">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
};