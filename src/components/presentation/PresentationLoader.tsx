import { Presentation as PresentationType, loadPresentation } from '../../utils/markdownParser';
// file path: src/components/presentation/PresentationLoader.tsx
import React, { useEffect, useState } from 'react';

import Presentation from './Presentation';

interface PresentationLoaderProps {
  presentationId: string;
}

const PresentationLoader: React.FC<PresentationLoaderProps> = ({ presentationId }) => {
  const [presentation, setPresentation] = useState<PresentationType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPresentationData = async () => {
      try {
        setIsLoading(true);
        const data = await loadPresentation(presentationId);
        if (data) {
          setPresentation(data);
          setError(null);
        } else {
          setError('Failed to load presentation');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    loadPresentationData();
  }, [presentationId]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading presentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="text-center p-8 max-w-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Failed to Load Presentation</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!presentation) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Presentation Not Found</h2>
          <p className="text-gray-600">The requested presentation could not be found.</p>
        </div>
      </div>
    );
  }

  return <Presentation slides={presentation.slides} />;
};

export default PresentationLoader;