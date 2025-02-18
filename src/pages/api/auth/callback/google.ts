import { SessionApiHandler, SessionRequest, withSessionRoute } from '../../../../lib/session';

// file path: src/pages/api/auth/callback/google.ts
import { NextApiResponse } from 'next';
import { createOAuth2Client } from '../../../../utils/googleSlides';

const handler: SessionApiHandler = async (req: SessionRequest, res: NextApiResponse) => {
  const { method } = req;

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }

  try {
    const { code } = req.query;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Invalid code' });
    }

    const oauth2Client = createOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Store tokens in session
    req.session.tokens = {
      access_token: tokens.access_token ?? '',
      refresh_token: tokens.refresh_token ?? undefined,
      scope: tokens.scope ?? '',
      token_type: tokens.token_type ?? 'Bearer',
      expiry_date: tokens.expiry_date ?? 0
    };
    await req.session.save();

    // Redirect back to presentations page
    res.redirect('/presentations');
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    res.redirect('/presentations?error=auth_failed');
  }
};

export default withSessionRoute(handler);