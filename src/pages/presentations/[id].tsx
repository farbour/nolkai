import PresentationLoader from '../../components/presentation/PresentationLoader';
// file path: src/pages/presentations/[id].tsx
import React from 'react';
import { isValidPresentationId } from '../../utils/markdownParser';
import { useRouter } from 'next/router';
import { withSessionSsr } from '../../lib/session';

interface PresentationPageProps {
  isAuthenticated: boolean;
}

const PresentationPage: React.FC<PresentationPageProps> = ({ isAuthenticated }) => {
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

  return <PresentationLoader presentationId={id} isAuthenticated={isAuthenticated} />;
};

export const getServerSideProps = withSessionSsr(async function getServerSideProps({ req }) {
  try {
    const isAuthenticated = !!req.session?.tokens;
    return {
      props: {
        isAuthenticated,
      },
    };
  } catch (error) {
    console.error('Session error:', error);
    return {
      props: {
        isAuthenticated: false,
      },
    };
  }
});

export default PresentationPage;