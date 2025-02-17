// file path: src/pages/presentations/index.tsx
import React, { useState } from 'react';

import Link from 'next/link';
import { createNewPresentation } from '../../utils/markdownParser';
import { useRouter } from 'next/router';

const PresentationsPage: React.FC = () => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreatePresentation = async () => {
    setIsCreating(true);
    try {
      const newPresentationId = createNewPresentation();
      
      // Create the initial markdown file
      const response = await fetch(`/api/presentations/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: newPresentationId,
          content: `# Welcome to Your New Presentation\n\nStart editing this presentation!\n\n---\n\n# Slide 2\n\nAdd more content here...`
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create presentation');
      }

      router.push(`/presentations/${newPresentationId}`);
    } catch (error) {
      console.error('Error creating presentation:', error);
      alert('Failed to create presentation. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Presentations</h1>
          <button
            onClick={handleCreatePresentation}
            disabled={isCreating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isCreating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>New Presentation</span>
              </>
            )}
          </button>
        </div>

        {/* Example Presentation */}
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Example Presentation</h2>
              <p className="text-gray-500 text-sm mt-1">A demonstration of presentation features</p>
            </div>
            <Link
              href="/presentations/example-presentation"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              View Presentation
            </Link>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Getting Started</h2>
          <div className="prose prose-blue">
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Click &ldquo;New Presentation&rdquo; to create a presentation</li>
              <li>Each presentation is stored as markdown files</li>
              <li>Use the slide editor to modify content</li>
              <li>Press F5 or click &ldquo;Present&rdquo; to start the presentation</li>
              <li>Use arrow keys to navigate between slides</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentationsPage;