// file path: src/components/analysis/AIAnalysis.tsx
import React, { useEffect, useState } from 'react';

import { BrandDataItem } from '../../config/brands';

interface AIAnalysisProps {
  selectedBrand: string;
  comparisonBrand: string | null;
  data: BrandDataItem[];
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({
  selectedBrand,
  comparisonBrand,
  data,
}) => {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateAnalysis = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const brandData = data.filter(item => item.Brand === selectedBrand);
        const comparisonData = comparisonBrand 
          ? data.filter(item => item.Brand === comparisonBrand)
          : null;

        // Prepare the prompt based on whether there's a comparison brand
        let prompt = `Analyze the following brand data for ${selectedBrand}:\n`;
        prompt += JSON.stringify(brandData, null, 2);

        if (comparisonBrand && comparisonData) {
          prompt += `\n\nCompare with ${comparisonBrand} data:\n`;
          prompt += JSON.stringify(comparisonData, null, 2);
          prompt += `\n\nProvide a detailed analysis comparing ${selectedBrand} and ${comparisonBrand}, focusing on key metrics, trends, and notable differences. Include specific insights about:
1. Revenue metrics (Gross Revenue, Net Revenue, D2C Net Revenue)
2. Performance metrics (TACOS, ACOS, Conversion Rate, Repeat Rate)
3. Customer metrics (LTV, CAC, AOV, Cross-Sell Rate)
4. Email performance metrics
Highlight significant differences and provide actionable insights.`;
        } else {
          prompt += `\n\nProvide a detailed analysis of ${selectedBrand}'s performance, focusing on:
1. Revenue metrics (Gross Revenue, Net Revenue, D2C Net Revenue)
2. Performance metrics (TACOS, ACOS, Conversion Rate, Repeat Rate)
3. Customer metrics (LTV, CAC, AOV, Cross-Sell Rate)
4. Email performance metrics
Include trends, notable achievements, and areas for improvement.`;
        }

        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate analysis');
        }

        const result = await response.json();
        setAnalysis(result.analysis);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate analysis');
      } finally {
        setLoading(false);
      }
    };

    if (selectedBrand) {
      generateAnalysis();
    }
  }, [selectedBrand, comparisonBrand, data]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">AI Analysis</h3>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">AI Analysis</h3>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">AI Analysis</h3>
      <div className="prose max-w-none">
        {analysis.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4 text-gray-600">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};