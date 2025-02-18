import { AIInsight } from '@/types/dashboard';
import React from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';

// file path: src/components/dashboard/AIInsights.tsx


interface AIInsightsProps {
  suggestions: AIInsight[];
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
              <div className="ml-4">
                <h3 className="text-base font-semibold text-gray-900">{suggestion.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{suggestion.description}</p>
                <div className="mt-2">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                    suggestion.impact === 'high'
                      ? 'bg-green-50 text-green-700'
                      : suggestion.impact === 'medium'
                      ? 'bg-yellow-50 text-yellow-700'
                      : 'bg-gray-50 text-gray-700'
                  }`}>
                    {suggestion.impact.charAt(0).toUpperCase() + suggestion.impact.slice(1)} Impact
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