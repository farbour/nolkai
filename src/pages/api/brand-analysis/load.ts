import type { NextApiRequest, NextApiResponse } from 'next';
import { listSavedAnalyses, loadBrandAnalysis } from '@/utils/brandAnalysisStorage';

import { BrandInfo } from '@/types/brand';

type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BrandInfo | { brands: string[] } | ErrorResponse>
) {
  if (req.method === 'GET') {
    const { brand } = req.query;

    if (brand) {
      if (typeof brand !== 'string') {
        return res.status(400).json({ error: 'Brand parameter must be a string' });
      }

      try {
        const analysis = await loadBrandAnalysis(brand);
        if (!analysis) {
          return res.status(404).json({ error: 'No analysis found for brand' });
        }
        return res.status(200).json(analysis);
      } catch (error) {
        console.error('Error loading brand analysis:', error);
        return res.status(500).json({ error: 'Failed to load brand analysis' });
      }
    } else {
      // If no brand specified, return list of all saved analyses
      try {
        const brands = await listSavedAnalyses();
        return res.status(200).json({ brands });
      } catch (error) {
        console.error('Error listing saved analyses:', error);
        return res.status(500).json({ error: 'Failed to list saved analyses' });
      }
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}