import { SessionApiHandler, SessionRequest, withSessionRoute } from '../../../lib/session';
import { createGoogleSlides, createOAuth2Client, getAuthUrl, listGoogleSlides, updateGoogleSlides } from '../../../utils/googleSlides';

// file path: src/pages/api/presentations/google.ts
import { NextApiResponse } from 'next';
import { drive_v3 } from 'googleapis';

// API Response Types
interface GoogleSlidesApiResponse {
  url?: string;
  success?: boolean;
  presentations?: Array<{
    id: string;
    name: string;
    webViewLink: string;
    createdTime: string;
    modifiedTime: string;
  }>;
  presentationId?: string;
  error?: string;
  details?: string;
  message?: string;
  timestamp?: string;
}

// Helper function to transform Google Drive file to our presentation type
const transformGoogleFile = (file: drive_v3.Schema$File) => ({
  id: file.id || '',
  name: file.name || '',
  webViewLink: file.webViewLink || '',
  createdTime: file.createdTime || '',
  modifiedTime: file.modifiedTime || ''
});

const handler: SessionApiHandler<GoogleSlidesApiResponse> = async (req: SessionRequest, res: NextApiResponse<GoogleSlidesApiResponse>) => {
  const { method } = req;

  const oauth2Client = createOAuth2Client();

  // Import environment variables at the start
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;

  // Log environment variables (excluding sensitive values)
  console.log('Environment check:', {
    hasClientId: !!CLIENT_ID,
    hasClientSecret: !!CLIENT_SECRET,
    hasRedirectUri: !!REDIRECT_URI,
    method,
    operation: req.query.operation
  });

  try {
    // Verify OAuth configuration
    if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
      console.error('Missing OAuth configuration');
      return res.status(500).json({
        error: 'Server configuration error',
        details: 'OAuth configuration is incomplete'
      });
    }

    switch (method) {
      case 'GET':
        // Handle different GET operations based on the query
        const { operation } = req.query;

        switch (operation) {
          case 'auth':
            // Generate auth URL
            const authUrl = getAuthUrl(oauth2Client);
            return res.status(200).json({ url: authUrl });

          case 'list':
            // List presentations
            if (!req.session.tokens) {
              return res.status(401).json({ error: 'Not authenticated' });
            }

            oauth2Client.setCredentials(req.session.tokens);
            const files = await listGoogleSlides(oauth2Client);
            const presentations = files.map(transformGoogleFile);
            return res.status(200).json({ presentations });

          default:
            return res.status(400).json({ error: 'Invalid operation' });
        }

      case 'POST':
        // Handle presentation creation/update
        if (!req.session.tokens) {
          return res.status(401).json({ error: 'Not authenticated' });
        }

        oauth2Client.setCredentials(req.session.tokens);
        const { title, content, presentationId } = req.body as {
          title?: string;
          content?: string[];
          presentationId?: string;
        };

        if (!title || !content) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        if (presentationId) {
          // Update existing presentation
          await updateGoogleSlides(oauth2Client, presentationId, content);
          return res.status(200).json({ presentationId });
        } else {
          // Create new presentation
          const newPresentationId = await createGoogleSlides(oauth2Client, title, content);
          return res.status(201).json({ presentationId: newPresentationId });
        }

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('Google Slides API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = error instanceof Error ? error.stack : undefined;
    
    return res.status(500).json({
      error: 'Internal server error',
      message: errorMessage,
      details: errorDetails,
      timestamp: new Date().toISOString()
    });
  }
};

export default withSessionRoute(handler);