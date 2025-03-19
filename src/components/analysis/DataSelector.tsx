import React from 'react';

interface DataSelectorProps {
  currentFile: string;
  onFileChange: (file: string) => void;
}

export const DataSelector: React.FC<DataSelectorProps> = ({
  currentFile,
  onFileChange,
}) => {
  const dataFiles = [
    { label: 'Main Data', value: '/data.csv' },
    { label: 'General KPIs', value: '/data/KPIs Table - ChatGPT Extract.csv' },
    { label: 'Amazon KPIs', value: '/data/Amazon - KPIs Table - ChatGPT Extract.csv' },
    { label: 'Shopify KPIs', value: '/data/Shopify - KPIs Table - ChatGPT Extract.csv' },
  ];

  return (
    <div className="flex items-center space-x-4">
      <label htmlFor="data-file" className="text-sm font-medium text-gray-700">
        Data Source:
      </label>
      <select
        id="data-file"
        value={currentFile}
        onChange={(e) => onFileChange(e.target.value)}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
      >
        {dataFiles.map((file) => (
          <option key={file.value} value={file.value}>
            {file.label}
          </option>
        ))}
      </select>
    </div>
  );
};