// file path: src/components/ReportSection.tsx
import React from 'react';

interface ReportSectionProps {
  title: string;
  children: React.ReactNode;
}

export const ReportSection: React.FC<ReportSectionProps> = ({ title, children }) => {
  return (
    <section className="mb-16 bg-white rounded-lg shadow-sm border border-gray-100 p-8">
      <h2 className="text-3xl font-extrabold text-nolk-green mb-8 pb-4 border-b-2 border-nolk-green">
        {title}
      </h2>
      <div className="space-y-6">{children}</div>
    </section>
  );
};

export const DataTable: React.FC<{ headers: string[]; data: (string | number)[][] }> = ({
  headers,
  data,
}) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-4 text-left text-sm font-bold text-nolk-green uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`px-6 py-4 whitespace-nowrap text-base ${
                    cellIndex === 0 ? 'font-semibold text-nolk-green' : 'text-gray-900'
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const MetricCard: React.FC<{
  title: string;
  value: string | number;
  change?: string;
}> = ({ title, value, change }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 hover:border-nolk-green transition-colors duration-200">
      <h3 className="text-base font-bold text-nolk-green uppercase tracking-wide mb-4">{title}</h3>
      <div className="flex items-baseline space-x-3">
        <p className="text-4xl font-extrabold text-gray-900">{value}</p>
        {change && (
          <span className="text-lg font-semibold text-green-600">{change}</span>
        )}
      </div>
    </div>
  );
};