import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
// file path: src/components/SortableTable.tsx
import React, { useMemo, useState } from 'react';

type SortDirection = 'asc' | 'desc' | null;

interface SortableTableProps {
  headers: string[];
  data: (string | number)[][];
}

export const SortableTable: React.FC<SortableTableProps> = ({ headers, data }) => {
  const [sortConfig, setSortConfig] = useState<{
    key: number;
    direction: SortDirection;
  }>({ key: 0, direction: null });

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
    if (typeof value === 'string' && value.startsWith('$')) {
      return <span className="font-semibold">{value}</span>;
    }
    if (index === 0) {
      return <span className="font-semibold">{value}</span>;
    }
    return value;
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.direction) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Parse values to numbers if possible
      const parseValue = (val: string | number): number | string => {
        if (typeof val === 'number') return val;
        if (typeof val !== 'string') return val;

        // Remove currency symbols, commas, and spaces
        let cleanVal = val.replace(/[$,\s]/g, '');
        
        // Handle percentages
        if (cleanVal.endsWith('%')) {
          cleanVal = cleanVal.slice(0, -1);
        }
        
        // Handle positive/negative indicators
        if (cleanVal.startsWith('+')) {
          cleanVal = cleanVal.slice(1);
        }

        // Try to parse as number
        const num = parseFloat(cleanVal);
        return isNaN(num) ? val : num;
      };

      const parsedA = parseValue(aValue);
      const parsedB = parseValue(bValue);

      // If both values are numbers after parsing, do numeric comparison
      if (typeof parsedA === 'number' && typeof parsedB === 'number') {
        return sortConfig.direction === 'asc' ? parsedA - parsedB : parsedB - parsedA;
      }

      // Default string comparison for non-numeric values
      const compareResult = String(parsedA).localeCompare(String(parsedB));
      return sortConfig.direction === 'asc' ? compareResult : -compareResult;
    });
  }, [data, sortConfig]);

  const requestSort = (key: number) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') direction = 'desc';
      else if (sortConfig.direction === 'desc') direction = null;
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider cursor-pointer hover:bg-gray-100 group"
                onClick={() => requestSort(index)}
              >
                <div className="flex items-center space-x-1">
                  <span>{header}</span>
                  <span className="flex flex-col">
                    {sortConfig.key === index ? (
                      sortConfig.direction === 'asc' ? (
                        <ChevronUpIcon className="h-4 w-4 text-nolk-green" />
                      ) : sortConfig.direction === 'desc' ? (
                        <ChevronDownIcon className="h-4 w-4 text-nolk-green" />
                      ) : null
                    ) : (
                      <div className="opacity-0 group-hover:opacity-50">
                        <ChevronUpIcon className="h-4 w-4" />
                      </div>
                    )}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((row, rowIndex) => (
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

export default SortableTable;