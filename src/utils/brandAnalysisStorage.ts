// file path: src/utils/brandAnalysisStorage.ts
import { BrandInfo } from '@/types/brand';

// Utility function to sanitize brand names for file system and URLs
export const sanitizeBrandName = (brandName: string): string => {
  return brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

export const saveBrandAnalysis = async (brandName: string, data: BrandInfo): Promise<void> => {
  const response = await fetch(`/api/brand-analysis/storage?brand=${encodeURIComponent(brandName)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain, */*'
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to save brand analysis');
  }
};

export const loadBrandAnalysis = async (brandName: string, signal?: AbortSignal): Promise<BrandInfo | null> => {
  try {
    const response = await fetch(
      `/api/brand-analysis/storage?brand=${encodeURIComponent(brandName)}`,
      {
        method: 'GET',
        signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      }
    );
    
    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to load brand analysis');
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    console.error('Error loading brand analysis:', error);
    return null;
  }
};

export const listSavedAnalyses = async (signal?: AbortSignal): Promise<string[]> => {
  try {
    const response = await fetch('/api/brand-analysis/storage/list', {
      signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to list saved analyses');
    }
    return response.json();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      // Rethrow abort errors
      throw error;
    }
    console.error('Error listing saved analyses:', error);
    return [];
  }
};