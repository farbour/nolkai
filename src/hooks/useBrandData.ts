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
      // Don't start loading if component is unmounted
      if (!mountedRef.current) return;

      try {
        setIsLoadingAnalysis(true);
        setError(null);
        
        const data = await loadSavedAnalysis(brandName, signal);
        
        // Check mounted state before any state updates
        if (!mountedRef.current) return;
        
        setHasExistingAnalysis(!!data);
        // Only update loaded ref if component is still mounted
        if (mountedRef.current && brandName) {
          hasLoadedRef.current[brandName] = true;
        }
      } catch (error) {
        // Immediately return if component is unmounted
        if (!mountedRef.current) return;
        
        // Handle abort errors silently
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            console.debug('Brand data loading aborted');
            return;
          }
          setError(error);
          console.error('Error loading analysis:', error);
        }
      } finally {
        // Final mounted check before state update
        if (mountedRef.current) {
          setIsLoadingAnalysis(false);
        }
      }
    };

    loadData();

    return () => {
      // Safely abort any ongoing requests
      if (abortControllerRef.current?.signal && !abortControllerRef.current.signal.aborted) {
        try {
          abortControllerRef.current.abort('Component cleanup');
        } catch (error) {
          console.warn('Error during abort:', error);
        }
      }
      
      // Clear the controller reference
      abortControllerRef.current = null;
      
      // Store the current value of the ref in a local variable
      const currentRef = { ...hasLoadedRef.current };
      
      // Clean up the loaded state if component is truly unmounting
      if (mountedRef.current && brandName) {
        delete currentRef[brandName];
        hasLoadedRef.current = currentRef;
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