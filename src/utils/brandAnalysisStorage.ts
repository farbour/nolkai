// file path: src/utils/brandAnalysisStorage.ts
import { BrandInfo } from '@/types/brand';

export const saveBrandAnalysis = async (brandName: string, data: BrandInfo): Promise<void> => {
  const response = await fetch(`/api/brand-analysis/storage?brand=${encodeURIComponent(brandName)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to save brand analysis');
  }
};

export const loadBrandAnalysis = async (brandName: string): Promise<BrandInfo | null> => {
  try {
    const response = await fetch(`/api/brand-analysis/storage?brand=${encodeURIComponent(brandName)}`);
    
    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to load brand analysis');
    }

    return response.json();
  } catch (error) {
    console.error('Error loading brand analysis:', error);
    return null;
  }
};

export const hasExistingAnalysis = async (brandName: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/brand-analysis/storage?brand=${encodeURIComponent(brandName)}`, {
      method: 'HEAD',
    });
    return response.status === 200;
  } catch (error) {
    console.error('Error checking brand analysis:', error);
    return false;
  }
};

export const listSavedAnalyses = async (): Promise<string[]> => {
  try {
    const response = await fetch('/api/brand-analysis/storage/list');
    if (!response.ok) {
      throw new Error('Failed to list saved analyses');
    }
    return response.json();
  } catch (error) {
    console.error('Error listing saved analyses:', error);
    return [];
  }
};