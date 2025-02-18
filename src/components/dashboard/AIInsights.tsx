import React from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';

// file path: src/components/dashboard/AIInsights.tsx

interface Suggestion {
  id: number;
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  category: 'revenue' | 'performance';
}

interface AIInsightsProps {
  suggestions: Suggestion[];
}

export const AIInsights: React.FC<AIInsightsProps> = ({ suggestions }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">AI Insights</h2>
          <SparklesIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="p-6 hover:bg-gray-50 transition-colors group">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className={`p-2 rounded-lg transition-colors ${
                  suggestion.category === 'revenue' 
                    ? 'bg-green-50 group-hover:bg-green-100' 
                    : 'bg-purple-50 group-hover:bg-purple-100'
                }`}>
                  <suggestion.icon className={`h-6 w-6 ${
                    suggestion.category === 'revenue' 
                      ? 'text-green-600' 
                      : 'text-purple-600'
                  }`} />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-base font-semibold text-gray-900">{suggestion.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{suggestion.description}</p>
                <div className="mt-2">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                    suggestion.impact === 'High' 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-yellow-50 text-yellow-700'
                  }`}>
                    {suggestion.impact} Impact
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};