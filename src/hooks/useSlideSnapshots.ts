// file path: src/hooks/useSlideSnapshots.ts
import { useCallback, useEffect, useRef, useState } from 'react';

interface SnapshotWorkerMessage {
  success: boolean;
  snapshot?: string;
  error?: string;
  slideId: string;
}

const workerCode = `
  self.onmessage = async (event) => {
    const { slideId, slideElement, scale = 0.25 } = event.data;

    try {
      // Create a temporary container for the HTML string
      const container = document.createElement('div');
      container.innerHTML = slideElement;
      document.body.appendChild(container);

      // Import html2canvas dynamically
      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(container.firstElementChild, {
        scale,
        backgroundColor: 'white',
        logging: false,
        useCORS: true,
      });

      // Clean up
      document.body.removeChild(container);

      const snapshot = canvas.toDataURL('image/png');
      self.postMessage({ 
        success: true, 
        snapshot,
        slideId
      });
    } catch (error) {
      self.postMessage({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        slideId
      });
    }
  };
`;

export function useSlideSnapshots() {
  const [snapshots, setSnapshots] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const pendingSnapshotsRef = useRef<Map<string, boolean>>(new Map());
  const snapshotCacheRef = useRef<Record<string, string>>({});

  // Initialize worker
  useEffect(() => {
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    workerRef.current = new Worker(workerUrl);

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

      // Check if all pending snapshots are complete
      if (pendingSnapshotsRef.current.size === 0) {
        setIsGenerating(false);
      }
    };

    return () => {
      workerRef.current?.terminate();
      URL.revokeObjectURL(workerUrl);
    };
  }, []);

  const generateSnapshot = useCallback(async (slideId: string, element: HTMLElement) => {
    if (!workerRef.current || pendingSnapshotsRef.current.has(slideId)) {
      return;
    }

    // Use cached snapshot if available and element hasn't changed
    if (snapshotCacheRef.current[slideId]) {
      setSnapshots(prev => ({
        ...prev,
        [slideId]: snapshotCacheRef.current[slideId]
      }));
      return;
    }

    pendingSnapshotsRef.current.set(slideId, true);
    setIsGenerating(true);

    // Clone the element to send to worker
    const elementClone = element.cloneNode(true) as HTMLElement;
    const elementHTML = elementClone.outerHTML;

    workerRef.current.postMessage({
      slideId,
      slideElement: elementHTML,
      scale: 0.25
    });
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
  }, []);

  return {
    snapshots,
    isGenerating,
    generateSnapshot,
    clearSnapshot,
    clearAllSnapshots
  };
}