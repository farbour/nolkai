import PresentationLoader from '../../components/presentation/PresentationLoader';
// file path: src/pages/presentations/[id].tsx
import React from 'react';
import { isValidPresentationId } from '../../utils/markdownParser';
import { useRouter } from 'next/router';

const PresentationPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id || typeof id !== 'string') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Invalid Presentation ID</h2>
          <p className="text-gray-600">Please provide a valid presentation ID.</p>
        </div>
      </div>
    );
  }

  if (!isValidPresentationId(id)) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Invalid Presentation Format</h2>
          <p className="text-gray-600">The presentation ID format is invalid.</p>
        </div>
      </div>
    );
  }

  return <PresentationLoader presentationId={id} />;
};

export default PresentationPage;