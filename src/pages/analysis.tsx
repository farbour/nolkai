import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
// file path: src/pages/analysis.tsx
import { useEffect, useMemo, useState } from "react";

import { Layout } from "../components/Layout";

// Define the structure for our CSV data
interface DataPoint {
  Brand: string;
  'KPI Name': string;
  'KPI Unit': string;
  'Month of Date': string;
  'Year of Date': string;
  'This Period Value': string;
}

// Structure for our computed statistics
interface Statistics {
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
  correlation?: number;
}

// Structure for trend data
interface TrendPoint {
  month: string;
  value: number;
  id: string;
}

// ---------- Utility Functions for Analysis ----------

// Parse CSV line handling quoted values
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let currentValue = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(currentValue.trim());
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  values.push(currentValue.trim());
  
  return values.map(v => v.replace(/["']/g, '').trim());
}

// Compute the mean of an array of numbers
function computeMean(data: number[]): number {
  if (data.length === 0) return 0;
  const sum = data.reduce((acc, cur) => acc + cur, 0);
  return sum / data.length;
}

// Compute the median of an array of numbers
function computeMedian(data: number[]): number {
  if (data.length === 0) return 0;
  const sorted = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

// Compute the standard deviation of an array of numbers
function computeStdDev(data: number[]): number {
  if (data.length === 0) return 0;
  const mean = computeMean(data);
  const variance = computeMean(data.map((x) => Math.pow(x - mean, 2)));
  return Math.sqrt(variance);
}

// Return the minimum value in an array
function computeMin(data: number[]): number {
  if (data.length === 0) return 0;
  return Math.min(...data);
}

// Return the maximum value in an array
function computeMax(data: number[]): number {
  if (data.length === 0) return 0;
  return Math.max(...data);
}

// Parse numeric values from CSV data
function parseNumericValue(value: string): number {
  if (!value) return 0;
  // Remove commas and convert to number
  return Number(value.replace(/,/g, ''));
}

export default function AnalysisPage() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string>("Gross Revenue");
  const [selectedBrand, setSelectedBrand] = useState<string>("All Brands");
  const [comparisonBrand, setComparisonBrand] = useState<string>("");
  const [statistics, setStatistics] = useState<Statistics>({
    mean: 0,
    median: 0,
    stdDev: 0,
    min: 0,
    max: 0,
    correlation: 0
  });
  const [trendData, setTrendData] = useState<TrendPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load and parse CSV data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data.csv');
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const text = await response.text();
        const lines = text.trim().split('\n');
        
        const parsedData: DataPoint[] = lines.slice(1).map(line => {
          const values = parseCSVLine(line);
          return {
            Brand: values[0],
            'KPI Name': values[1],
            'KPI Unit': values[2],
            'Month of Date': values[3],
            'Year of Date': values[4],
            'This Period Value': values[5]
          };
        }).filter(row => 
          row.Brand && 
          row['KPI Name'] && 
          row['This Period Value'] && 
          !isNaN(parseNumericValue(row['This Period Value']))
        );

        setData(parsedData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Compute statistics when metric or brand selection changes
  useEffect(() => {
    if (!data.length) return;

    const filteredData = data.filter(d => 
      d['KPI Name'] === selectedMetric &&
      (selectedBrand === 'All Brands' || d.Brand === selectedBrand)
    );

    const values = filteredData.map(d => parseNumericValue(d['This Period Value']));

    // Calculate correlation if comparison brand is selected
    let correlation = 0;
    if (comparisonBrand && selectedBrand !== 'All Brands') {
      const brand1Data = data
        .filter(d => d['KPI Name'] === selectedMetric && d.Brand === selectedBrand)
        .map(d => parseNumericValue(d['This Period Value']));
      
      const brand2Data = data
        .filter(d => d['KPI Name'] === selectedMetric && d.Brand === comparisonBrand)
        .map(d => parseNumericValue(d['This Period Value']));

      if (brand1Data.length === brand2Data.length && brand1Data.length > 0) {
        const meanX = computeMean(brand1Data);
        const meanY = computeMean(brand2Data);
        
        const numerator = brand1Data.reduce(
          (acc, xi, i) => acc + (xi - meanX) * (brand2Data[i] - meanY),
          0
        );
        
        const denominator = Math.sqrt(
          brand1Data.reduce((acc, xi) => acc + Math.pow(xi - meanX, 2), 0) *
          brand2Data.reduce((acc, yi) => acc + Math.pow(yi - meanY, 2), 0)
        );
        
        correlation = denominator === 0 ? 0 : numerator / denominator;
      }
    }

    setStatistics({
      mean: computeMean(values),
      median: computeMedian(values),
      stdDev: computeStdDev(values),
      min: computeMin(values),
      max: computeMax(values),
      correlation
    });

    // Prepare trend data
    const trendPoints = filteredData
      .sort((a, b) => {
        const dateA = new Date(`${a['Month of Date']} ${a['Year of Date']}`);
        const dateB = new Date(`${b['Month of Date']} ${b['Year of Date']}`);
        return dateA.getTime() - dateB.getTime();
      })
      .map((d, index) => ({
        month: `${d['Month of Date']} ${d['Year of Date']}`,
        value: parseNumericValue(d['This Period Value']),
        id: `${d.Brand}-${d['Month of Date']}-${d['Year of Date']}-${index}`
      }));

    setTrendData(trendPoints);
  }, [data, selectedMetric, selectedBrand, comparisonBrand]);

  // Memoize metrics and brands lists
  const { metrics, brands, comparisonBrands } = useMemo(() => {
    const uniqueMetrics = Array.from(new Set(data.map(d => d['KPI Name'])));
    const uniqueBrands = ['All Brands', ...Array.from(new Set(data.map(d => d.Brand)))];
    const availableComparisonBrands = uniqueBrands.filter(b => b !== selectedBrand && b !== 'All Brands');
    
    return {
      metrics: uniqueMetrics,
      brands: uniqueBrands,
      comparisonBrands: availableComparisonBrands
    };
  }, [data, selectedBrand]);

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
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-nolk-green">Data Analysis</h1>
          <div className="flex gap-4">
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nolk-green/20 focus:border-nolk-green"
            >
              {metrics.map(metric => (
                <option key={`metric-${metric}`} value={metric}>{metric}</option>
              ))}
            </select>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nolk-green/20 focus:border-nolk-green"
            >
              {brands.map(brand => (
                <option key={`brand-${brand}`} value={brand}>{brand}</option>
              ))}
            </select>
            {selectedBrand !== 'All Brands' && (
              <select
                value={comparisonBrand}
                onChange={(e) => setComparisonBrand(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nolk-green/20 focus:border-nolk-green"
              >
                <option value="">Select comparison brand...</option>
                {comparisonBrands.map(brand => (
                  <option key={`comparison-${brand}`} value={brand}>{brand}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Summary Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Mean</div>
              <div className="text-lg font-semibold">{statistics.mean.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Median</div>
              <div className="text-lg font-semibold">{statistics.median.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Std Dev</div>
              <div className="text-lg font-semibold">{statistics.stdDev.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Min</div>
              <div className="text-lg font-semibold">{statistics.min.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Max</div>
              <div className="text-lg font-semibold">{statistics.max.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            </div>
          </div>
        </div>

        {/* Trend Analysis */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Trend Analysis</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#344C45" 
                  name={selectedMetric} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Analysis */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Distribution Analysis</h2>
          <p className="text-gray-600">
            The data shows a {statistics.mean > statistics.median ? 'positive' : 'negative'} skew, 
            with a mean of {statistics.mean.toLocaleString(undefined, { maximumFractionDigits: 2 })} 
            and a median of {statistics.median.toLocaleString(undefined, { maximumFractionDigits: 2 })}.
            The standard deviation of {statistics.stdDev.toLocaleString(undefined, { maximumFractionDigits: 2 })} 
            indicates {statistics.stdDev > statistics.mean ? 'high' : 'moderate'} variability in the data.
          </p>
          {comparisonBrand && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Correlation Analysis</h3>
              <p className="text-gray-600">
                The correlation coefficient between {selectedBrand} and {comparisonBrand} is{' '}
                <span className="font-semibold">{statistics.correlation?.toFixed(3)}</span>
                {statistics.correlation && (
                  <span>
                    , indicating a {
                      Math.abs(statistics.correlation) > 0.7 ? 'strong' :
                      Math.abs(statistics.correlation) > 0.3 ? 'moderate' :
                      'weak'
                    } {statistics.correlation > 0 ? 'positive' : 'negative'} relationship
                  </span>
                )}.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}