import { NextApiRequest, NextApiResponse } from 'next';

import { AnalysisProgress } from '@/lib/services/brandAnalysis';

// Store analysis progress for each brand
const progressStore = new Map<string, AnalysisProgress>();

export function setProgress(brandName: string, progress: AnalysisProgress) {
  progressStore.set(brandName, progress);
}

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
  const initialProgress = progressStore.get(brand) || {
    currentStep: 'analyzing'
  };
  res.write(`data: ${JSON.stringify(initialProgress)}\n\n`);

  // Set up interval to check for progress updates
  const interval = setInterval(() => {
    const progress = progressStore.get(brand);
    if (progress) {
      res.write(`data: ${JSON.stringify(progress)}\n\n`);
      
      // If analysis is complete or has error, clean up
      if (progress.error || progress.currentStep === 'completed') {
        progressStore.delete(brand);
        clearInterval(interval);
        res.end();
      }
    }
  }, 1000);

  // Clean up on client disconnect
  req.on('close', () => {
    clearInterval(interval);
    progressStore.delete(brand);
  });
}