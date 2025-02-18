import React from 'react';

// file path: src/components/dashboard/DashboardGrid.tsx

interface DashboardGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  className?: string;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  children,
  cols = 1,
  className = ''
}) => {
  const getGridCols = () => {
    switch (cols) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 lg:grid-cols-2';
      case 3:
        return 'grid-cols-1 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default:
        return 'grid-cols-1';
    }
  };

  return (
    <div className={`grid gap-6 ${getGridCols()} ${className}`}>
      {children}
    </div>
  );
};