// file path: src/hooks/useSlideSnapshots.ts
import { useCallback, useEffect, useRef, useState } from 'react';

import html2canvas from 'html2canvas';

interface SnapshotWorkerMessage {
  success: boolean;
  snapshot?: string;
  error?: string;
  slideId: string;
}

export function useSlideSnapshots() {
  const [snapshots, setSnapshots] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const pendingSnapshotsRef = useRef<Map<string, boolean>>(new Map());
  const snapshotCacheRef = useRef<Record<string, string>>({});

  // Initialize worker
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      workerRef.current = new Worker('/snapshotWorker.js');

      workerRef.current.onerror = (error) => {
        console.error('Worker error:', error);
        setIsGenerating(false);
      };

      workerRef.current.onmessage = (event: MessageEvent<SnapshotWorkerMessage>) => {
        const { success, snapshot, error, slideId } = event.data;
        
        if (success && snapshot && slideId) {
          setSnapshots(prev => ({
            ...prev,
            [slideId]: snapshot
          }));
          snapshotCacheRef.current[slideId] = snapshot;
          pendingSnapshotsRef.current.delete(slideId);
        } else if (error) {
          console.error('Snapshot generation error:', error);
          if (slideId) {
            pendingSnapshotsRef.current.delete(slideId);
          }
        }

        if (pendingSnapshotsRef.current.size === 0) {
          setIsGenerating(false);
        }
      };

      return () => {
        if (workerRef.current) {
          workerRef.current.terminate();
          workerRef.current = null;
        }
      };
    } catch (error) {
      console.error('Failed to initialize worker:', error);
    }
  }, []);

  const generateSnapshot = useCallback(async (slideId: string, element: HTMLElement) => {
    if (!workerRef.current || pendingSnapshotsRef.current.has(slideId)) {
      return;
    }

    // Use cached snapshot if available
    if (snapshotCacheRef.current[slideId]) {
      setSnapshots(prev => ({
        ...prev,
        [slideId]: snapshotCacheRef.current[slideId]
      }));
      return;
    }

    try {
      pendingSnapshotsRef.current.set(slideId, true);
      setIsGenerating(true);

      // Capture the initial image in the main thread
      const canvas = await html2canvas(element, {
        backgroundColor: 'white',
        logging: false,
        useCORS: true,
        scale: 1, // Capture at full resolution
        removeContainer: true, // Clean up temporary elements
      });

      // Get the image data
      const imageData = canvas.toDataURL('image/png', 1);

      // Send to worker for scaling
      workerRef.current.postMessage({
        slideId,
        imageData,
        scale: 0.25
      });
    } catch (error) {
      console.error('Error capturing initial snapshot:', error);
      pendingSnapshotsRef.current.delete(slideId);
      setIsGenerating(false);
    }
  }, []);

  const clearSnapshot = useCallback((slideId: string) => {
    setSnapshots(prev => {
      const newSnapshots = { ...prev };
      delete newSnapshots[slideId];
      return newSnapshots;
    });
    delete snapshotCacheRef.current[slideId];
    pendingSnapshotsRef.current.delete(slideId);
  }, []);

  const clearAllSnapshots = useCallback(() => {
    setSnapshots({});
    snapshotCacheRef.current = {};
    pendingSnapshotsRef.current.clear();
    setIsGenerating(false);
  }, []);

  return {
    snapshots,
    isGenerating,
    generateSnapshot,
    clearSnapshot,
    clearAllSnapshots
  };
}