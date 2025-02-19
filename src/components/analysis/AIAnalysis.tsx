// file path: src/components/analysis/AIAnalysis.tsx
import React, { useState } from 'react';

import { BrandDataItem } from '../../config/brands';

interface AIAnalysisProps {
  selectedBrand: string;
  comparisonBrand: string | null;
  data: BrandDataItem[];
}

interface MetricHighlight {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  insight?: string;
}

interface AnalysisResponse {
  highlights: MetricHighlight[];
  analysis: string[];
}

const LoadingStep = ({ step, currentStep }: { step: number; currentStep: number }) => {
  const isActive = step === currentStep;
  const isComplete = step < currentStep;

  return (
    <div className="flex items-center space-x-3">
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
        ${isComplete ? 'bg-green-100 text-green-600' : ''}
        ${isActive ? 'bg-blue-100 text-blue-600 animate-pulse' : ''}
        ${!isActive && !isComplete ? 'bg-gray-100 text-gray-400' : ''}
      `}>
        {isComplete ? (
          <span className="text-sm">✓</span>
        ) : (
          <span className="text-sm font-medium">{step + 1}</span>
        )}
      </div>
      <div className="flex-grow">
        <p className={`text-sm font-medium
          ${isComplete ? 'text-green-600' : ''}
          ${isActive ? 'text-blue-600' : ''}
          ${!isActive && !isComplete ? 'text-gray-500' : ''}
        `}>
          {[
            'Collecting brand metrics...',
            'Processing performance data...',
            'Analyzing trends...',
            'Generating insights...',
            'Preparing visualization...',
          ][step]}
        </p>
        {isActive && (
          <div className="mt-1 text-xs text-gray-500">
            {[
              'Aggregating KPIs and performance indicators',
              'Calculating growth rates and market position',
              'Identifying patterns and correlations',
              'Formulating actionable recommendations',
              'Formatting results and highlights',
            ][step]}
          </div>
        )}
      </div>
    </div>
  );
};

export const AIAnalysis: React.FC<AIAnalysisProps> = ({
  selectedBrand,
  comparisonBrand,
  data,
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [analysis, setAnalysis] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<MetricHighlight[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateAnalysis = async () => {
    setLoading(true);
    setError(null);
    setLoadingStep(0);
    
    try {
      const brandData = data.filter(item => item.Brand === selectedBrand);
      const comparisonData = comparisonBrand 
        ? data.filter(item => item.Brand === comparisonBrand)
        : null;

      // Simulate complex processing with steps
      for (let i = 0; i < 5; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoadingStep(i);
      }

      let prompt = `Analyze the following e-commerce performance data and provide detailed insights.\n\n`;
      prompt += `Primary Brand (${selectedBrand}):\n`;
      prompt += JSON.stringify(brandData, null, 2);

      if (comparisonBrand && comparisonData) {
        prompt += `\n\nComparison Brand (${comparisonBrand}):\n`;
        prompt += JSON.stringify(comparisonData, null, 2);
        prompt += `\n\nProvide a comprehensive comparison focusing on key metrics, trends, and strategic implications.`;
      } else {
        prompt += `\n\nProvide a detailed analysis focusing on performance trends, areas for improvement, and strategic recommendations.`;
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
      const analysisData: AnalysisResponse = JSON.parse(result.analysis);

      setHighlights(analysisData.highlights);
      setAnalysis(analysisData.analysis);
      setHasGenerated(true);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate analysis');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">AI Analysis</h3>
        <p className="text-red-500 mb-4">Error: {error}</p>
        <button
          onClick={generateAnalysis}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry Analysis
        </button>
      </div>
    );
  }

  if (!hasGenerated) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">AI Analysis</h3>
        <p className="text-gray-600 mb-4">
          Generate an AI-powered analysis of {selectedBrand}&apos;s performance
          {comparisonBrand ? ` compared to ${comparisonBrand}` : ''}.
        </p>
        <button
          onClick={generateAnalysis}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
        >
          Generate Analysis
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Generating AI Analysis</h3>
        <div className="space-y-6">
          {[0, 1, 2, 3, 4].map((step) => (
            <LoadingStep key={step} step={step} currentStep={loadingStep} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">AI Analysis</h3>
        <button
          onClick={generateAnalysis}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Regenerate
        </button>
      </div>
      
      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {highlights.map((highlight, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="text-sm font-medium text-gray-600">{highlight.label}</div>
            <div className="text-3xl font-bold text-gray-900">{highlight.value}</div>
            <div className="space-y-1">
              {highlight.change && (
                <div className={`flex items-center text-sm font-medium
                  ${highlight.trend === 'up' ? 'text-green-600' : ''}
                  ${highlight.trend === 'down' ? 'text-red-600' : ''}
                  ${highlight.trend === 'neutral' ? 'text-gray-600' : ''}`
                }>
                  {highlight.trend === 'up' && '↑'}
                  {highlight.trend === 'down' && '↓'}
                  {highlight.trend === 'neutral' && '→'}
                  {highlight.change}
                </div>
              )}
              {highlight.insight && (
                <div className="text-sm text-gray-600 mt-2 italic">
                  {highlight.insight}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Analysis */}
      <div className="prose max-w-none mt-8 space-y-6">
        {analysis.map((section, index) => {
          const [title, content] = section.split(': ');
          return (
            <div key={index} className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
              <p className="text-gray-600 leading-relaxed">
                {content}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};