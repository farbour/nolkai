// file path: src/components/ReportSection.tsx
import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
}

interface DataTableProps {
  headers: string[];
  data: (string | number)[][];
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, change }) => {
  const isPositive = change.startsWith('+');
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const changeBg = isPositive ? 'bg-green-50' : 'bg-red-50';

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <h3 className="text-lg font-medium text-gray-600 mb-4">{title}</h3>
      <div className="flex items-baseline justify-between">
        <span className="text-4xl font-bold text-gray-900">{value}</span>
        <div className={`px-3 py-1 rounded-full ${changeBg}`}>
          <span className={`text-sm font-semibold ${changeColor}`}>{change}</span>
        </div>
      </div>
    </div>
  );
};

export const DataTable: React.FC<DataTableProps> = ({ headers, data }) => {
  const formatCell = (value: string | number, index: number) => {
    if (typeof value === 'string' && (value.startsWith('+') || value.startsWith('-'))) {
      const isPositive = value.startsWith('+');
      const colorClass = isPositive ? 'text-green-600' : 'text-red-600';
      const bgClass = isPositive ? 'bg-green-50' : 'bg-red-50';
      return (
        <span className={`inline-block px-2 py-1 rounded-full font-semibold ${colorClass} ${bgClass}`}>
          {value}
        </span>
      );
    }
    // Special formatting for currency values
    if (typeof value === 'string' && value.startsWith('$')) {
      return <span className="font-semibold">{value}</span>;
    }
    // Bold the first column
    if (index === 0) {
      return <span className="font-semibold">{value}</span>;
    }
    return value;
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {formatCell(cell, cellIndex)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface ReportSectionProps {
  title: string;
  children: React.ReactNode;
}

export const ReportSection: React.FC<ReportSectionProps> = ({ title, children }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-12 border border-gray-200">
      <h2 className="text-3xl font-bold text-nolk-green mb-8">{title}</h2>
      {children}
    </div>
  );
};

export default ReportSection;