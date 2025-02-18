import React, { useState } from 'react';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// file path: src/components/dashboard/SearchBar.tsx

interface SearchResult {
  id: string;
  type: 'brand' | 'metric' | 'task' | 'event';
  title: string;
  description: string;
  href: string;
}

export const SearchBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = (value: string) => {
    setQuery(value);
    // Mock search results - in real app, this would query an API
    if (value.length > 0) {
      setResults([
        {
          id: '1',
          type: 'brand',
          title: 'Brand A Performance',
          description: 'Revenue and metrics for Brand A',
          href: '#brand-a'
        },
        {
          id: '2',
          type: 'metric',
          title: 'Revenue Overview',
          description: 'Overall revenue performance',
          href: '#revenue'
        },
        {
          id: '3',
          type: 'task',
          title: 'Review Brand D',
          description: 'Analyze recent performance drop',
          href: '#tasks'
        }
      ]);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search brands, metrics, tasks..."
          className="h-12 w-full rounded-full border border-gray-200 bg-white pl-11 pr-4 text-sm focus:border-nolk-green focus:ring-2 focus:ring-nolk-green"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {/* Results dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="p-2">
            {results.map((result) => (
              <a
                key={result.id}
                href={result.href}
                className="block rounded-lg px-4 py-3 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {result.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {result.description}
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                    {result.type}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};