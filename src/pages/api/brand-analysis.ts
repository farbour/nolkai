// file path: src/pages/api/brand-analysis.ts
import { AnalysisProgress, BrandAnalysisService, BrandInfo } from '@/lib/services/brandAnalysis';
import type { NextApiRequest, NextApiResponse } from 'next';

import { sanitizeBrandName } from '@/utils/brandAnalysisStorage';
import { setProgress } from '@/utils/progressStore';

// Create a singleton instance of the service
const analysisService = new BrandAnalysisService(process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY || '');

type ApiResponse = {
  success: boolean;
  data?: BrandInfo;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Set response headers
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  
  // Set content type
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Accept header validation - be more lenient
  const acceptHeader = req.headers.accept;
  if (acceptHeader &&
      !acceptHeader.includes('*/*') &&
      !acceptHeader.includes('application/json') &&
      !acceptHeader.includes('text/html') &&  // Allow HTML since browsers may request it
      !acceptHeader.includes('*')) {          // Allow wildcard
    console.log('Invalid Accept header:', acceptHeader);
  }

  if (req.method === 'POST') {
    try {
      console.log('Received POST request');
      console.log('Request body:', req.body);

      if (!process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY) {
        console.log('Missing API key');
        return res.status(500).json({
          success: false,
          error: 'NEXT_PUBLIC_PERPLEXITY_API_KEY is not configured'
        });
      }

      if (!req.body || typeof req.body !== 'object') {
        console.log('Invalid request body');
        return res.status(400).json({
          success: false,
          error: 'Invalid request body'
        });
      }

      const { brandName } = req.body;
      console.log('Brand name from request:', brandName);

      if (!brandName) {
        console.log('Missing brand name');
        return res.status(400).json({
          success: false,
          error: 'Brand name is required'
        });
      }

      const sanitizedBrand = sanitizeBrandName(brandName);
      console.log('Sanitized brand name:', sanitizedBrand);

      if (!sanitizedBrand) {
        console.log('Invalid brand name after sanitization');
        return res.status(400).json({
          success: false,
          error: 'Invalid brand name'
        });
      }

      // Initialize progress
      const initialProgress: AnalysisProgress = {
        currentStep: 'presence',
        completedSteps: []
      };
      setProgress(sanitizedBrand, initialProgress);

      const result = await analysisService.analyzeBrand(
        sanitizedBrand,
        (progress: AnalysisProgress) => {
          console.log('Analysis progress update:', progress); // Debug log
          setProgress(sanitizedBrand, progress);
        }
      );

      // Set final progress
      setProgress(sanitizedBrand, {
        currentStep: 'completed',
        completedSteps: ['presence', 'positioning', 'competitors', 'reviews', 'market']
      });

      // Save the analysis results
      const { saveBrandAnalysis } = await import('@/utils/brandAnalysisStorage');
      await saveBrandAnalysis(sanitizedBrand, result);

      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze brand';
      
      if (typeof brandName === 'string') {
        const sanitizedBrand = sanitizeBrandName(brandName);
        if (sanitizedBrand) {
          setProgress(sanitizedBrand, {
            currentStep: 'presence',
            completedSteps: [],
            error: errorMessage
          });
        }
      }

      // Set proper error response headers
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-store');
      
      // Return detailed error response
      return res.status(500).json({
        success: false,
        error: errorMessage,
        details: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        } : undefined
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: 'Method not allowed'
  });
}