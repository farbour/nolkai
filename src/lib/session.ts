// file path: src/lib/session.ts
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { IncomingMessage, ServerResponse } from 'http';
import { IronSession, getIronSession } from 'iron-session';
import { NextApiRequest, NextApiResponse } from 'next';

// Define our session data structure
export interface SessionData {
  tokens?: {
    access_token: string;
    refresh_token?: string;
    scope: string;
    token_type: string;
    expiry_date: number;
  };
}

const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'complex_password_at_least_32_characters_long',
  cookieName: 'nolk_google_slides_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    httpOnly: true,
  },
};

// Extend the NextApiRequest to include session
export interface SessionRequest extends NextApiRequest {
  session: IronSession<SessionData>;
}

export type SessionApiHandler<ResponseData = unknown> = (
  req: SessionRequest,
  res: NextApiResponse<ResponseData>
) => Promise<void> | Promise<NextApiResponse<ResponseData>>;

// Define a base error response type
interface ApiErrorResponse {
  error: string;
  message: string;
  details?: string;
  timestamp: string;
}

export function withSessionRoute<ResponseData>(handler: SessionApiHandler<ResponseData>) {
  return async function withSession(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData | ApiErrorResponse>
  ) {
    try {
      const session = await getIronSession<SessionData>(req, res, sessionOptions);
      return await handler(Object.assign(req, { session }), res);
    } catch (error) {
      console.error('API Route Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorDetails = error instanceof Error ? error.stack : undefined;
      
      // Ensure we always return JSON, even for errors
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({
        error: 'Internal server error',
        message: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString()
      });
    }
  };
}

// Extend the IncomingMessage to include session
export interface SessionIncomingMessage extends IncomingMessage {
  session: IronSession<SessionData>;
  cookies: Partial<{ [key: string]: string }>;
}

export type SessionSsrHandler<P> = (
  context: GetServerSidePropsContext & { req: SessionIncomingMessage }
) => Promise<GetServerSidePropsResult<P>>;

export function withSessionSsr<P>(handler: SessionSsrHandler<P>) {
  return async function withSession(
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> {
    const session = await getIronSession<SessionData>(
      context.req,
      context.res as ServerResponse,
      sessionOptions
    );
    
    return handler({
      ...context,
      req: Object.assign(context.req, { session }) as SessionIncomingMessage,
    });
  };
}

// Helper to get session
export async function getSession(req: NextApiRequest, res: NextApiResponse) {
  return getIronSession<SessionData>(req, res, sessionOptions);
}