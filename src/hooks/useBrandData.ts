import { Brand, BrandTab } from '@/types/brand';
// file path: src/hooks/useBrandData.ts
import { useEffect, useRef, useState } from 'react';

import type { AnalysisProgress as ProgressType } from '@/lib/services/brandAnalysis';
import { useBrand } from '@/context/BrandContext';

export function useBrandData(brandSlug: string | undefined) {
  const { brandsInfo, analyzeBrand, cancelAnalysis, isAnalyzing, loadSavedAnalysis } = useBrand();
  const [activeTab, setActiveTab] = useState<BrandTab>('overview');
  const [analysisProgress, setAnalysisProgress] = useState<ProgressType>({
    currentStep: 'presence',
    completedSteps: []
  });
  const [hasExistingAnalysis, setHasExistingAnalysis] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const hasLoadedRef = useRef<{[key: string]: boolean}>({});
  const abortControllerRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  // Find brand by slug
  const brand: Brand | undefined = Object.values(brandsInfo).find(b => b.slug === brandSlug);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const brandName = brand?.name;
    if (!brandName) return;

    // Skip if we've already loaded this brand's data
    if (hasLoadedRef.current[brandName]) {
      return;
    }

    // Create new AbortController and store in ref
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    const loadData = async () => {
      try {
        setIsLoadingAnalysis(true);
        setError(null);
        
        const data = await loadSavedAnalysis(brandName, signal);
        
        if (!mountedRef.current) return;
        
        setHasExistingAnalysis(!!data);
        hasLoadedRef.current[brandName] = true;
      } catch (error) {
        if (!mountedRef.current) return;
        
        // Only set error if it's not an abort error
        if (error instanceof Error && error.name !== 'AbortError') {
          setError(error);
          console.error('Error loading analysis:', error);
        }
      } finally {
        if (mountedRef.current) {
          setIsLoadingAnalysis(false);
        }
      }
    };

    loadData();

    return () => {
      // Only abort if controller exists and hasn't been aborted
      if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
        abortControllerRef.current.abort();
      }
      
      // Clean up the loaded state
      if (brandName) {
        delete hasLoadedRef.current[brandName];
      }
    };
  }, [brand?.name, loadSavedAnalysis]);

  const handleAnalyze = async () => {
    try {
      setError(null);
      // Initialize progress
      setAnalysisProgress({
        currentStep: 'presence',
        completedSteps: []
      });
      await analyzeBrand(brand?.name || '', setAnalysisProgress);
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      }
      console.error('Failed to analyze brand:', error);
    }
  };

  return {
    brand,
    activeTab,
    setActiveTab,
    analysisProgress,
    hasExistingAnalysis,
    isLoadingAnalysis,
    error,
    handleAnalyze,
    isAnalyzing: brand ? isAnalyzing(brand.name) : false,
    cancelAnalysis
  };
}