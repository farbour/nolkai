// file path: src/pages/api/brand-analysis/progress.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { deleteProgress, getProgress } from '@/utils/progressStore';

import { sanitizeBrandName } from '@/utils/brandAnalysisStorage';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { brand: rawBrand } = req.query;
  if (!rawBrand || typeof rawBrand !== 'string') {
    return res.status(400).json({ error: 'Brand name is required' });
  }
  const sanitizedBrand = sanitizeBrandName(rawBrand);

  // Set up SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send initial progress
  const initialProgress = getProgress(sanitizedBrand) || {
    currentStep: 'presence',
    completedSteps: []
  };
  res.write(`data: ${JSON.stringify(initialProgress)}\n\n`);

  // Set up interval to check for progress updates
  const interval = setInterval(() => {
    const progress = getProgress(sanitizedBrand);
    if (progress) {
      res.write(`data: ${JSON.stringify(progress)}\n\n`);
      
      // If analysis is complete or has error, clean up
      if (progress.error || progress.currentStep === 'completed') {
        cleanup();
      }
    }
  }, 500);

  // Set up timeout to prevent infinite polling (5 minutes)
  const timeout = setTimeout(() => {
    cleanup();
  }, 5 * 60 * 1000);

  // Cleanup function
  const cleanup = () => {
    clearInterval(interval);
    clearTimeout(timeout);
    deleteProgress(sanitizedBrand);
    res.end();
  };

  // Clean up on client disconnect
  req.on('close', cleanup);
}