import { Brand, BrandInfo } from '@/types/brand';
import React, { createContext, useContext, useState } from 'react';
import { brands, defaultBrand } from '../config/brands';

import { AnalysisProgress } from '@/lib/services/brandAnalysis';

interface BrandContextType {
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  availableBrands: string[];
  addBrand: (name: string) => void;
  updateBrand: (oldBrand: string, newBrand: string) => void;
  deleteBrand: (brand: string) => void;
  brandsInfo: Record<string, Brand>;
  analyzeBrand: (brandName: string, onProgress?: (progress: AnalysisProgress) => void) => Promise<void>;
  cancelAnalysis: () => void;
  isAnalyzing: (brandName: string) => boolean;
  getBrandInfo: (brandName: string) => BrandInfo | undefined;
  getBrandError: (brandName: string) => string | undefined;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [selectedBrand, setSelectedBrand] = useState(defaultBrand);
  const [brandsList, setBrandsList] = useState(brands);
  const [brandsInfo, setBrandsInfo] = useState<Record<string, Brand>>(() => {
    // Initialize with default brands
    return brands.reduce((acc, name) => {
      acc[name] = {
        id: crypto.randomUUID(),
        name,
        slug: generateSlug(name),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return acc;
    }, {} as Record<string, Brand>);
  });
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const addBrand = (name: string) => {
    if (!brandsList.includes(name)) {
      setBrandsList([...brandsList, name]);
      setBrandsInfo(prev => ({
        ...prev,
        [name]: {
          id: crypto.randomUUID(),
          name,
          slug: generateSlug(name),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }));
    }
  };

  const updateBrand = (oldBrand: string, newBrand: string) => {
    if (oldBrand === selectedBrand) {
      setSelectedBrand(newBrand);
    }
    setBrandsList(brandsList.map(b => b === oldBrand ? newBrand : b));
    setBrandsInfo(prev => {
      const newBrandsInfo = { ...prev };
      if (newBrandsInfo[oldBrand]) {
        newBrandsInfo[newBrand] = {
          ...newBrandsInfo[oldBrand],
          name: newBrand,
          slug: generateSlug(newBrand),
          updatedAt: new Date().toISOString()
        };
        delete newBrandsInfo[oldBrand];
      }
      return newBrandsInfo;
    });
  };

  const deleteBrand = (brand: string) => {
    if (brand === selectedBrand) {
      setSelectedBrand(brandsList[0] === brand ? brandsList[1] : brandsList[0]);
    }
    setBrandsList(brandsList.filter(b => b !== brand));
    setBrandsInfo(prev => {
      const newBrandsInfo = { ...prev };
      delete newBrandsInfo[brand];
      return newBrandsInfo;
    });
  };

  const cancelAnalysis = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
  };

  const analyzeBrand = async (brandName: string, onProgress?: (progress: AnalysisProgress) => void) => {
    // Cancel any existing analysis
    cancelAnalysis();

    // Create new abort controller
    const controller = new AbortController();
    setAbortController(controller);

    setBrandsInfo(prev => ({
      ...prev,
      [brandName]: {
        ...prev[brandName],
        isAnalyzing: true,
        error: undefined,
        updatedAt: new Date().toISOString()
      }
    }));

    try {
      const response = await fetch('/api/brand-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ brandName }),
        signal: controller.signal
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to analyze brand');
      }

      // Set up event source for progress updates
      const eventSource = new EventSource(`/api/brand-analysis/progress?brand=${encodeURIComponent(brandName)}`);
      
      eventSource.onmessage = (event) => {
        const progress: AnalysisProgress = JSON.parse(event.data);
        onProgress?.(progress);
      };

      eventSource.onerror = () => {
        eventSource.close();
      };

      controller.signal.addEventListener('abort', () => {
        eventSource.close();
      });

      const info: BrandInfo = await response.json();
      setBrandsInfo(prev => ({
        ...prev,
        [brandName]: {
          ...prev[brandName],
          info,
          isAnalyzing: false,
          updatedAt: new Date().toISOString()
        }
      }));

      eventSource.close();
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        setBrandsInfo(prev => ({
          ...prev,
          [brandName]: {
            ...prev[brandName],
            isAnalyzing: false,
            updatedAt: new Date().toISOString()
          }
        }));
        return;
      }

      setBrandsInfo(prev => ({
        ...prev,
        [brandName]: {
          ...prev[brandName],
          isAnalyzing: false,
          error: error instanceof Error ? error.message : 'An error occurred during analysis',
          updatedAt: new Date().toISOString()
        }
      }));
      throw error;
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
    availableBrands: brandsList,
    addBrand,
    updateBrand,
    deleteBrand,
    brandsInfo,
    analyzeBrand,
    cancelAnalysis,
    isAnalyzing,
    getBrandInfo,
    getBrandError,
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