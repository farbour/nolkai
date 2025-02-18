// file path: src/pages/presentations/index.tsx
import React, { ReactElement, useEffect, useState } from 'react';

import Link from 'next/link';
import { createNewPresentation } from '../../utils/markdownParser';
import { useRouter } from 'next/router';
import { withSessionSsr } from '../../lib/session';

interface GooglePresentation {
  id: string;
  name: string;
  webViewLink: string;
  createdTime: string;
  modifiedTime: string;
}

interface PresentationsPageProps {
  isAuthenticated: boolean;
  error?: string;
}

const PresentationsPage: React.FC<PresentationsPageProps> = ({ isAuthenticated: initialAuthState, error: serverError }): ReactElement => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthState);
  const [googlePresentations, setGooglePresentations] = useState<GooglePresentation[]>([]);
  const [error, setError] = useState<string | undefined>(serverError);

  useEffect(() => {
    // Check for auth error in URL
    const { error: queryError } = router.query;
    if (queryError === 'auth_failed') {
      setError('Authentication failed. Please try again.');
    }
  }, [router.query]);

  useEffect(() => {
    if (!error) {
      fetchGooglePresentations();
    }
  }, [error]);

  const fetchGooglePresentations = async () => {
    try {
      const response = await fetch('/api/presentations/google?operation=list');
      if (response.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        if (response.status === 500 && errorData.details?.includes('OAuth configuration')) {
          setError('Google OAuth configuration error. Please check server settings.');
        } else {
          setError(`Failed to fetch presentations: ${errorData.message || 'Unknown error'}`);
        }
        return;
      }
      
      const data = await response.json();
      if (data.presentations) {
        setGooglePresentations(data.presentations);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error fetching Google presentations:', error);
      setError('Network or parsing error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePresentation = async () => {
    setIsCreating(true);
    try {
      const newPresentationId = createNewPresentation();
      
      // Create the initial markdown file
      const response = await fetch('/api/presentations/create', {
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
      setError('Failed to create presentation. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const response = await fetch('/api/presentations/google?operation=auth');
      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error initiating Google auth:', error);
      setError('Failed to initiate Google authentication. Please try again.');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <h2 className="text-red-800 font-semibold">Error Loading Presentations</h2>
            <p className="text-red-600 mt-1">{error}</p>
            <button
              onClick={() => setError(undefined)}
              className="mt-2 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
            >
              Try Again
            </button>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Getting Started</h2>
            <div className="prose prose-blue">
              <p>Please make sure you have:</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Set up your Google Cloud project</li>
                <li>Enabled the required APIs</li>
                <li>Configured your environment variables</li>
                <li>Set a secure session password</li>
              </ul>
              <p className="mt-4">
                See <code>GOOGLE_SETUP.md</code> for detailed instructions.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Presentations</h1>
          <div className="flex space-x-4">
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
            {!isAuthenticated && (
              <button
                onClick={handleGoogleAuth}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.447,1.722-1.498,3.478-3.092,4.616 c-2.418,1.722-5.4,1.722-7.818,0c-2.418-1.722-3.819-4.594-3.819-7.818s1.401-6.096,3.819-7.818c1.209-0.861,2.418-1.401,3.819-1.401 v3.819c0,1.054,0.855,1.909,1.909,1.909c1.054,0,1.909-0.855,1.909-1.909V1.909C12.545,0.855,11.69,0,10.636,0H1.909 C0.855,0,0,0.855,0,1.909v16.364c0,1.054,0.855,1.909,1.909,1.909h16.364c1.054,0,1.909-0.855,1.909-1.909V12.151H12.545z"/>
                </svg>
                <span>Connect with Google Slides</span>
              </button>
            )}
          </div>
        </div>

        {/* Google Presentations */}
        {isAuthenticated && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Google Slides Presentations</h2>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {googlePresentations.map((presentation) => (
                  <div key={presentation.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{presentation.name}</h3>
                        <p className="text-gray-500 text-sm mt-1">
                          Modified: {new Date(presentation.modifiedTime).toLocaleDateString()}
                        </p>
                      </div>
                      <a
                        href={presentation.webViewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Open in Google Slides
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Local Presentations */}
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
              <li>Click &ldquo;New Presentation&rdquo; to create a local presentation</li>
              <li>Connect with Google Slides to sync your presentations</li>
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

export const getServerSideProps = withSessionSsr<PresentationsPageProps>(
  async function getServerSideProps({ req }) {
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
          error: 'Failed to initialize session. Please check your configuration.',
        },
      };
    }
  }
);

export default PresentationsPage;