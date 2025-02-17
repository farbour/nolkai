// file path: src/pages/report.tsx
import React, { useEffect, useState } from 'react';

import { ExecutiveOverview } from '../components/ExecutiveOverview';
import { Layout } from '../components/Layout';

interface CSVRow {
  Brand: string;
  'KPI Name': string;
  'KPI Unit': string;
  'Month of Date': string;
  'Year of Date': string;
  'This Period Value': string;
}

const ReportPage: React.FC = () => {
  const [data, setData] = useState<CSVRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data.csv');
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        
        const csvText = await response.text();
        if (!csvText.trim()) {
          throw new Error('CSV file is empty');
        }

        const parsedData = parseCSV(csvText);
        if (parsedData.length === 0) {
          throw new Error('No valid data found in CSV');
        }

        setData(parsedData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  function parseCSV(csvText: string): CSVRow[] {
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        throw new Error('CSV must contain headers and at least one data row');
      }

      const headers = lines[0].split(',').map(h => h.trim());
      const expectedHeaders = ['Brand', 'KPI Name', 'KPI Unit', 'Month of Date', 'Year of Date', 'This Period Value'];
      
      if (!expectedHeaders.every(h => headers.includes(h))) {
        throw new Error('CSV is missing required headers');
      }

      return lines.slice(1).map(line => {
        const values = line.split(',');
        if (values.length !== headers.length) {
          throw new Error('Invalid row: incorrect number of columns');
        }

        return {
          Brand: values[0].trim(),
          'KPI Name': values[1].trim(),
          'KPI Unit': values[2].trim(),
          'Month of Date': values[3].trim(),
          'Year of Date': values[4].trim(),
          'This Period Value': values[5].trim()
        };
      }).filter(row => 
        row.Brand && 
        row['KPI Name'] && 
        row['Month of Date'] && 
        row['Year of Date'] &&
        !isNaN(parseFloat(row['This Period Value']))
      );
    } catch (err) {
      console.error('Error parsing CSV:', err);
      throw new Error('Failed to parse CSV data');
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nolk-green mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {data.length > 0 ? (
        <ExecutiveOverview data={data} />
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800">No data available to display.</p>
        </div>
      )}
    </Layout>
  );
};

export default ReportPage;
