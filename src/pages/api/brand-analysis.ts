// file path: src/pages/api/brand-analysis.ts
import { AnalysisProgress, BrandAnalysisService, BrandInfo } from '@/lib/services/brandAnalysis';
import type { NextApiRequest, NextApiResponse } from 'next';

type ErrorResponse = {
  error: string;
};

// Store analysis progress for each brand
const progressStore = new Map<string, AnalysisProgress>();

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
      progressStore.set(brandName, {
        currentStep: 'presence',
        completedSteps: []
      });

      const result = await analysisService.analyzeBrand(
        brandName,
        (progress: AnalysisProgress) => {
          progressStore.set(brandName, progress);
        }
      );

      // Save the analysis results
      const { saveBrandAnalysis } = await import('@/utils/brandAnalysisStorage');
      await saveBrandAnalysis(brandName, result);

      return res.status(200).json(result);
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze brand';
      return res.status(500).json({ error: errorMessage });
    }
  }

  if (req.method === 'GET') {
    const { brand } = req.query;

    if (!brand || typeof brand !== 'string') {
      return res.status(400).json({ error: 'Brand parameter is required' });
    }

    const progress = progressStore.get(brand);
    if (!progress) {
      return res.status(404).json({ error: 'No progress found for brand' });
    }

    return res.status(200).json({ progress });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}