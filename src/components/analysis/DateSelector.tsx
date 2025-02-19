// file path: src/components/analysis/DateSelector.tsx
import React from 'react';

interface DateSelectorProps {
  dates: { month: string; year: string }[];
  selectedDate: { month: string; year: string };
  onDateChange: (date: { month: string; year: string }) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  dates,
  selectedDate,
  onDateChange,
}) => {
  return (
    <div className="flex items-center space-x-4">
      <label htmlFor="date-selector" className="text-sm font-medium text-gray-700">
        Date:
      </label>
      <select
        id="date-selector"
        value={`${selectedDate.month}-${selectedDate.year}`}
        onChange={(e) => {
          const [month, year] = e.target.value.split('-');
          onDateChange({ month, year });
        }}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
      >
        {dates.map((date) => (
          <option key={`${date.month}-${date.year}`} value={`${date.month}-${date.year}`}>
            {`${date.month} ${date.year}`}
          </option>
        ))}
      </select>
    </div>
  );
};