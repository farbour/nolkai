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

// Mock data generator for demo purposes
const generateMockAnalysis = (brand: string, comparisonBrand: string | null, data: BrandDataItem[]) => {
  // Get unique metrics for the selected brand
  const brandData = data.filter(item => item.Brand === brand);

  // Generate highlights
  const highlights: MetricHighlight[] = [];
  
  // Revenue metrics
  const revenueMetrics = brandData.filter(item => 
    item['KPI Name'].includes('Revenue') || 
    item['KPI Name'].includes('Sales')
  );
  
  if (revenueMetrics.length > 0) {
    highlights.push({
      label: 'Revenue Performance',
      value: '$1.2M',
      change: '+12.5%',
      trend: 'up',
      insight: 'Strong growth in overall revenue'
    });
  }
  
  // Conversion metrics
  const conversionData = brandData.filter(item => 
    item['KPI Name'].includes('Conversion')
  );
  
  if (conversionData.length > 0) {
    highlights.push({
      label: 'Conversion Rate',
      value: '3.8%',
      change: '+0.5%',
      trend: 'up',
      insight: 'Improving website effectiveness'
    });
  }
  
  // Customer metrics
  const customerData = brandData.filter(item => 
    item['KPI Name'].includes('LTV') || 
    item['KPI Name'].includes('CAC')
  );
  
  if (customerData.length > 0) {
    highlights.push({
      label: 'LTV:CAC Ratio',
      value: '3.2:1',
      change: '-0.3',
      trend: 'down',
      insight: 'Customer acquisition costs rising'
    });
  }
  
  // Add more generic highlights if we don't have enough
  if (highlights.length < 3) {
    highlights.push({
      label: 'Market Position',
      value: 'Strong',
      insight: 'Maintaining competitive advantage'
    });
    
    highlights.push({
      label: 'Growth Opportunity',
      value: 'High',
      insight: 'Potential for expansion in new markets'
    });
  }
  
  // Generate analysis sections
  const analysis = [
    `Executive Summary: ${brand} shows strong overall performance with notable growth in revenue metrics. ${comparisonBrand ? `Compared to ${comparisonBrand}, ${brand} demonstrates superior conversion rates but faces challenges in customer acquisition costs.` : 'The brand demonstrates resilience in a competitive market environment.'}`,
    
    `Revenue Analysis: Revenue streams show healthy growth patterns across multiple channels. ${brand}'s diversified revenue approach provides stability and resilience against market fluctuations.`,
    
    `Marketing Efficiency: Advertising spend efficiency could be improved. Consider reallocating budget from underperforming channels to those with higher ROI. Email marketing shows particularly strong performance metrics.`,
    
    `Customer Metrics: Customer retention rates are strong, indicating good product-market fit and customer satisfaction. However, rising acquisition costs suggest the need for more efficient targeting strategies.`,
    
    `Strategic Recommendations: 1) Optimize ad spend allocation based on channel performance, 2) Enhance cross-selling initiatives to increase average order value, 3) Implement targeted retention campaigns for high-value customer segments.`
  ];
  
  return { highlights, analysis };
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
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateAnalysis = async () => {
    setLoading(true);
    setLoadingStep(0);

    try {
      // Simulate processing steps
      for (let i = 0; i < 5; i++) {
        await new Promise(resolve => setTimeout(resolve, 600));
        setLoadingStep(i);
      }
      
      // Generate mock analysis
      const { highlights, analysis } = generateMockAnalysis(selectedBrand, comparisonBrand, data);
      
      // Skip API call entirely and use mock data
      setHighlights(highlights);
      setAnalysis(analysis);
      setHasGenerated(true);
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

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

  if (!hasGenerated && !loading) {
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
          // Handle case where section doesn't contain a colon
          let title = '';
          let content = section;
          if (section.includes(': '))
            [title, content] = section.split(': ');
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