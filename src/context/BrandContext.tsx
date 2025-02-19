// file path: src/context/BrandContext.tsx
import { Brand, BrandInfo } from '@/types/brand';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { createBrand, deleteBrand, getBrands, updateBrand } from '@/lib/supabase';

import { AnalysisProgress } from '@/lib/services/brandAnalysis';
import { loadBrandAnalysis } from '@/utils/brandAnalysisStorage';
import { sanitizeBrandName } from '@/utils/brandAnalysisStorage';

interface BrandContextType {
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  availableBrands: string[];
  addBrand: (name: string) => Promise<void>;
  updateBrand: (oldBrand: string, newBrand: string) => Promise<void>;
  deleteBrand: (brand: string) => Promise<void>;
  brandsInfo: Record<string, Brand>;
  analyzeBrand: (brandName: string, onProgress?: (progress: AnalysisProgress) => void) => Promise<void>;
  cancelAnalysis: () => void;
  isAnalyzing: (brandName: string) => boolean;
  getBrandInfo: (brandName: string) => BrandInfo | undefined;
  getBrandError: (brandName: string) => string | undefined;
  loadSavedAnalysis: (brandName: string, signal?: AbortSignal) => Promise<BrandInfo | null>;
  isLoading: boolean;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [brandsInfo, setBrandsInfo] = useState<Record<string, Brand>>({});
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial brands from Supabase
  useEffect(() => {
    async function loadBrands() {
      try {
        const brands = await getBrands();
        const brandsRecord = brands.reduce((acc, brand) => {
          acc[brand.name] = brand;
          return acc;
        }, {} as Record<string, Brand>);
        
        setBrandsInfo(brandsRecord);
        if (brands.length > 0 && !selectedBrand) {
          setSelectedBrand(brands[0].name);
        }
      } catch (error) {
        console.error('Error loading brands:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadBrands();
  }, []);

  const addBrand = async (name: string) => {
    const sanitizedName = sanitizeBrandName(name);
    if (!brandsInfo[sanitizedName]) {
      try {
        const newBrand = await createBrand({
          name: sanitizedName,
          slug: sanitizedName,
        });
        
        setBrandsInfo(prev => ({
          ...prev,
          [sanitizedName]: newBrand
        }));
      } catch (error) {
        console.error('Error creating brand:', error);
        throw error;
      }
    }
  };

  const updateBrandName = async (oldBrand: string, newBrand: string) => {
    const sanitizedOldBrand = sanitizeBrandName(oldBrand);
    const sanitizedNewBrand = sanitizeBrandName(newBrand);
    
    if (sanitizedOldBrand === selectedBrand) {
      setSelectedBrand(sanitizedNewBrand);
    }

    try {
      const brand = brandsInfo[sanitizedOldBrand];
      if (brand) {
        const updatedBrand = await updateBrand(brand.id, {
          name: sanitizedNewBrand,
          slug: sanitizedNewBrand,
        });

        setBrandsInfo(prev => {
          const newBrandsInfo = { ...prev };
          delete newBrandsInfo[sanitizedOldBrand];
          newBrandsInfo[sanitizedNewBrand] = updatedBrand;
          return newBrandsInfo;
        });
      }
    } catch (error) {
      console.error('Error updating brand:', error);
      throw error;
    }
  };

  const removeBrand = async (brand: string) => {
    const sanitizedBrand = sanitizeBrandName(brand);
    if (sanitizedBrand === selectedBrand) {
      const availableBrands = Object.keys(brandsInfo);
      setSelectedBrand(availableBrands[0] === sanitizedBrand ? availableBrands[1] : availableBrands[0]);
    }

    try {
      const brandToDelete = brandsInfo[sanitizedBrand];
      if (brandToDelete) {
        await deleteBrand(brandToDelete.id);
        setBrandsInfo(prev => {
          const newBrandsInfo = { ...prev };
          delete newBrandsInfo[sanitizedBrand];
          return newBrandsInfo;
        });
      }
    } catch (error) {
      console.error('Error deleting brand:', error);
      throw error;
    }
  };

  const cancelAnalysis = () => {
    if (abortController) {
      try {
        abortController.abort();
      } catch (error) {
        console.error('Error aborting analysis:', error);
      } finally {
        setAbortController(null);
      }
    }
  };

  const loadSavedAnalysis = useCallback(async (brandName: string, signal?: AbortSignal): Promise<BrandInfo | null> => {
    try {
      const savedData = await loadBrandAnalysis(brandName, signal);
      if (savedData) {
        const brand = brandsInfo[brandName];
        if (brand) {
          const updatedBrand = await updateBrand(brand.id, {
            info: savedData,
          });
          
          setBrandsInfo(prev => ({
            ...prev,
            [brandName]: updatedBrand
          }));
        }
        return savedData;
      }
      return null;
    } catch (error) {
      console.error('Error loading saved analysis:', error);
      return null;
    }
  }, [brandsInfo]);

  const analyzeBrand = async (brandName: string, onProgress?: (progress: AnalysisProgress) => void) => {
    cancelAnalysis();

    const sanitizedBrand = sanitizeBrandName(brandName);
    const controller = new AbortController();
    setAbortController(controller);

    let brand = brandsInfo[sanitizedBrand];
    if (!brand) {
      // Create the brand if it doesn't exist
      brand = await createBrand({
        name: sanitizedBrand,
        slug: sanitizedBrand,
        isAnalyzing: true
      });
      setBrandsInfo(prev => ({
        ...prev,
        [sanitizedBrand]: brand
      }));
    } else {
      // Update existing brand
      const updatedBrand = await updateBrand(brand.id, {
        isAnalyzing: true,
        error: undefined,
      });

      setBrandsInfo(prev => ({
        ...prev,
        [sanitizedBrand]: updatedBrand
      }));
    }

    try {
      console.log('Starting brand analysis for:', sanitizedBrand);
      
      // Initialize progress
      const initialProgress: AnalysisProgress = {
        currentStep: 'presence',
        completedSteps: []
      };
      onProgress?.(initialProgress);

      // Create analysis service instance
      const { BrandAnalysisService } = await import('@/lib/services/brandAnalysis');
      const analysisService = new BrandAnalysisService(process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY || '');

      // Run analysis
      const info = await analysisService.analyzeBrand(sanitizedBrand, onProgress, controller.signal);
      if (brand) {
        const updatedBrand = await updateBrand(brand.id, {
          info,
          isAnalyzing: false,
        });

        setBrandsInfo(prev => ({
          ...prev,
          [sanitizedBrand]: updatedBrand
        }));
      }

      // Set final progress
      onProgress?.({
        currentStep: 'completed',
        completedSteps: ['presence', 'positioning', 'competitors', 'reviews', 'market']
      });
      
      return info;
    } catch (error) {
      console.error('Analysis error:', error);
      
      try {
        let errorMessage = 'An error occurred during analysis';
        
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            errorMessage = 'Analysis was cancelled';
          } else {
            errorMessage = error.message;
          }
        }

        let brandToUpdate = brand;
        if (!brandToUpdate) {
          // Create the brand if it doesn't exist
          brandToUpdate = await createBrand({
            name: sanitizedBrand,
            slug: sanitizedBrand,
            isAnalyzing: false,
            error: errorMessage
          });
        } else {
          // Update existing brand
          brandToUpdate = await updateBrand(brandToUpdate.id, {
            isAnalyzing: false,
            error: errorMessage,
          });
        }

        setBrandsInfo(prev => ({
          ...prev,
          [sanitizedBrand]: brandToUpdate
        }));

        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
      } catch (updateError) {
        console.error('Error updating brand status:', updateError);
      }
      
      if (!(error instanceof Error && error.name === 'AbortError')) {
        throw error;
      }
    } finally {
      setAbortController(null);
    }
  };

  const isAnalyzing = (brandName: string) => {
    return brandsInfo[brandName]?.isAnalyzing || false;
  };

  const getBrandInfo = (brandName: string) => {
    return brandsInfo[brandName]?.info;
  };

  const getBrandError = (brandName: string) => {
    return brandsInfo[brandName]?.error;
  };

  const value = {
    selectedBrand,
    setSelectedBrand,
    availableBrands: Object.keys(brandsInfo),
    addBrand,
    updateBrand: updateBrandName,
    deleteBrand: removeBrand,
    brandsInfo,
    analyzeBrand,
    cancelAnalysis,
    isAnalyzing,
    getBrandInfo,
    getBrandError,
    loadSavedAnalysis,
    isLoading,
  };

  return (
    <BrandContext.Provider value={value}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
}