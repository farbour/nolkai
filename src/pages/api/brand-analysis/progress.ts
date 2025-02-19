// file path: src/pages/api/brand-analysis/progress.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { deleteProgress, getProgress } from '@/utils/progressStore';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { brand } = req.query;
  if (!brand || typeof brand !== 'string') {
    return res.status(400).json({ error: 'Brand name is required' });
  }

  // Set up SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send initial progress
  const initialProgress = getProgress(brand) || {
    currentStep: 'presence',
    completedSteps: []
  };
  res.write(`data: ${JSON.stringify(initialProgress)}\n\n`);

  // Set up interval to check for progress updates
  const interval = setInterval(() => {
    const progress = getProgress(brand);
    if (progress) {
      res.write(`data: ${JSON.stringify(progress)}\n\n`);
      
      // If analysis is complete or has error, clean up
      if (progress.error || progress.currentStep === 'completed') {
        deleteProgress(brand);
        clearInterval(interval);
        res.end();
      }
    }
  }, 500); // Check more frequently for smoother updates

  // Clean up on client disconnect
  req.on('close', () => {
    clearInterval(interval);
    deleteProgress(brand);
  });
}