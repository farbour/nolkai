// file path: src/pages/api/brand-analysis.ts
import { AnalysisProgress, BrandAnalysisService, BrandInfo } from '@/lib/services/brandAnalysis';
import type { NextApiRequest, NextApiResponse } from 'next';

import { setProgress } from '@/utils/progressStore';

type ErrorResponse = {
  error: string;
};

// Create a singleton instance of the service
const analysisService = new BrandAnalysisService(process.env.PERPLEXITY_API_KEY || '');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BrandInfo | { progress: AnalysisProgress } | ErrorResponse>
) {
  if (req.method === 'POST') {
    const { brandName } = req.body;

    if (!brandName) {
      return res.status(400).json({ error: 'Brand name is required' });
    }

    try {
      // Initialize progress
      const initialProgress: AnalysisProgress = {
        currentStep: 'presence',
        completedSteps: []
      };
      setProgress(brandName, initialProgress);

      const result = await analysisService.analyzeBrand(
        brandName,
        (progress: AnalysisProgress) => {
          console.log('Analysis progress update:', progress); // Debug log
          setProgress(brandName, progress);
        }
      );

      // Set final progress
      setProgress(brandName, {
        currentStep: 'completed',
        completedSteps: ['presence', 'positioning', 'competitors', 'reviews', 'market']
      });

      // Save the analysis results
      const { saveBrandAnalysis } = await import('@/utils/brandAnalysisStorage');
      await saveBrandAnalysis(brandName, result);

      return res.status(200).json(result);
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze brand';
      
      // Set error progress
      setProgress(brandName, {
        currentStep: 'presence',
        completedSteps: [],
        error: errorMessage
      });

      return res.status(500).json({ error: errorMessage });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}