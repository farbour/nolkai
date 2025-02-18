// file path: src/utils/googleSlides.ts
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

// Load environment variables
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
  console.error('Missing required Google OAuth configuration:');
  if (!CLIENT_ID) console.error('- NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set');
  if (!CLIENT_SECRET) console.error('- GOOGLE_CLIENT_SECRET is not set');
  if (!REDIRECT_URI) console.error('- NEXT_PUBLIC_GOOGLE_REDIRECT_URI is not set');
}

const SCOPES = [
  'https://www.googleapis.com/auth/presentations',
  'https://www.googleapis.com/auth/drive.file'
];

export const createOAuth2Client = (): OAuth2Client => {
  if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
    throw new Error('Missing required Google OAuth configuration. Check your .env.local file.');
  }
  return new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
};

export const getAuthUrl = (oauth2Client: OAuth2Client): string => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent', // Force consent screen to ensure we get refresh token
  });
};

export const createGoogleSlides = async (
  auth: OAuth2Client,
  title: string,
  content: string[]
): Promise<string> => {
  const slides = google.slides({ version: 'v1', auth });
  
  // Create a new presentation
  const newPresentation = await slides.presentations.create({
    requestBody: {
      title,
    },
  });

  const presentationId = newPresentation.data.presentationId;

  if (!presentationId) {
    throw new Error('Failed to create presentation');
  }

  // Create slides with text boxes
  const requests = content.map((slideContent, index) => ({
    createSlide: {
      objectId: `slide_${index + 1}`,
      slideLayoutReference: {
        predefinedLayout: 'TITLE_AND_BODY',
      },
    },
  }));

  // Create slides first
  await slides.presentations.batchUpdate({
    presentationId,
    requestBody: {
      requests,
    },
  });

  // Get the presentation details to find placeholder IDs
  const presentationDetails = await slides.presentations.get({
    presentationId,
  });

  // Add content to title and body placeholders
  const contentRequests = content.map((slideContent, index) => {
    const slide = presentationDetails.data.slides?.[index];
    
    if (!slide) return [];

    // Find title and body placeholder IDs
    const titlePlaceholder = slide.pageElements?.find(
      element => element.shape?.placeholder?.type === 'TITLE'
    );
    const bodyPlaceholder = slide.pageElements?.find(
      element => element.shape?.placeholder?.type === 'BODY'
    );

    // Split content into title and body
    const lines = slideContent.split('\n');
    const title = lines[0].replace(/^#\s*/, ''); // Remove markdown heading
    const body = lines.slice(1).join('\n').trim();

    const requests = [];

    if (titlePlaceholder?.objectId) {
      requests.push({
        insertText: {
          objectId: titlePlaceholder.objectId,
          text: title,
        },
      });
    }

    if (bodyPlaceholder?.objectId) {
      requests.push({
        insertText: {
          objectId: bodyPlaceholder.objectId,
          text: body,
        },
      });
    }

    return requests;
  }).flat();

  if (contentRequests.length > 0) {
    await slides.presentations.batchUpdate({
      presentationId,
      requestBody: {
        requests: contentRequests,
      },
    });
  }

  return presentationId;
};

export const updateGoogleSlides = async (
  auth: OAuth2Client,
  presentationId: string,
  content: string[]
): Promise<void> => {
  const slides = google.slides({ version: 'v1', auth });

  // Delete all existing slides
  const existingPresentation = await slides.presentations.get({
    presentationId,
  });

  const deleteRequests = existingPresentation.data.slides?.map((slide) => ({
    deleteObject: {
      objectId: slide.objectId,
    },
  })) || [];

  if (deleteRequests.length > 0) {
    await slides.presentations.batchUpdate({
      presentationId,
      requestBody: {
        requests: deleteRequests,
      },
    });
  }

  // Create new slides with text boxes
  const createRequests = content.map((slideContent, index) => ({
    createSlide: {
      objectId: `slide_${index + 1}`,
      slideLayoutReference: {
        predefinedLayout: 'TITLE_AND_BODY',
      },
    },
  }));

  await slides.presentations.batchUpdate({
    presentationId,
    requestBody: {
      requests: createRequests,
    },
  });

  // Get the updated presentation to find placeholder IDs
  const updatedPresentation = await slides.presentations.get({
    presentationId,
  });

  // Add content to title and body placeholders
  const contentRequests = content.map((slideContent, index) => {
    const slide = updatedPresentation.data.slides?.[index];
    
    if (!slide) return [];

    // Find title and body placeholder IDs
    const titlePlaceholder = slide.pageElements?.find(
      element => element.shape?.placeholder?.type === 'TITLE'
    );
    const bodyPlaceholder = slide.pageElements?.find(
      element => element.shape?.placeholder?.type === 'BODY'
    );

    // Split content into title and body
    const lines = slideContent.split('\n');
    const title = lines[0].replace(/^#\s*/, ''); // Remove markdown heading
    const body = lines.slice(1).join('\n').trim();

    const requests = [];

    if (titlePlaceholder?.objectId) {
      requests.push({
        insertText: {
          objectId: titlePlaceholder.objectId,
          text: title,
        },
      });
    }

    if (bodyPlaceholder?.objectId) {
      requests.push({
        insertText: {
          objectId: bodyPlaceholder.objectId,
          text: body,
        },
      });
    }

    return requests;
  }).flat();

  if (contentRequests.length > 0) {
    await slides.presentations.batchUpdate({
      presentationId,
      requestBody: {
        requests: contentRequests,
      },
    });
  }
};

export const listGoogleSlides = async (auth: OAuth2Client) => {
  const drive = google.drive({ version: 'v3', auth });
  
  const response = await drive.files.list({
    q: "mimeType='application/vnd.google-apps.presentation'",
    fields: 'files(id, name, webViewLink, createdTime, modifiedTime)',
  });

  return response.data.files || [];
};