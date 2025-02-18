// file path: src/hooks/useSlideSnapshots.ts
import { useCallback, useRef, useState } from 'react';

import html2canvas from 'html2canvas';

export function useSlideSnapshots() {
  const [snapshots, setSnapshots] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const pendingSnapshotsRef = useRef<Set<string>>(new Set());
  const snapshotCacheRef = useRef<Record<string, string>>({});

  const generateSnapshot = useCallback(async (slideId: string, element: HTMLElement) => {
    console.log('Generating snapshot for slide:', slideId, {
      elementDimensions: {
        width: element.offsetWidth,
        height: element.offsetHeight,
        scrollWidth: element.scrollWidth,
        scrollHeight: element.scrollHeight,
      }
    });

    if (pendingSnapshotsRef.current.has(slideId)) {
      console.log('Already generating snapshot for slide:', slideId);
      return;
    }

    // Use cached snapshot if available
    if (snapshotCacheRef.current[slideId]) {
      console.log('Using cached snapshot for slide:', slideId);
      setSnapshots(prev => ({
        ...prev,
        [slideId]: snapshotCacheRef.current[slideId]
      }));
      return;
    }

    try {
      pendingSnapshotsRef.current.add(slideId);
      setIsGenerating(true);

      // Find the actual slide content element
      const slideContent = element.querySelector('[class*="bg-white"]') as HTMLElement;
      if (!slideContent) {
        throw new Error('Could not find slide content element');
      }

      console.log('Found slide content element:', {
        dimensions: {
          width: slideContent.clientWidth,
          height: slideContent.clientHeight,
        },
        classes: slideContent.className
      });

      // Wait for any images to load
      const images = Array.from(slideContent.getElementsByTagName('img'));
      await Promise.all(
        images.map(img => 
          img.complete 
            ? Promise.resolve() 
            : new Promise(resolve => {
                img.onload = resolve;
                img.onerror = resolve;
              })
        )
      );

      const canvas = await html2canvas(slideContent, {
        backgroundColor: 'white',
        logging: true,
        useCORS: true,
        scale: 0.25,
        removeContainer: true,
        allowTaint: true,
        foreignObjectRendering: true,
        onclone: (clonedDoc, clonedElement) => {
          console.log('Cloned element:', {
            width: clonedElement.offsetWidth,
            height: clonedElement.offsetHeight,
            html: clonedElement.innerHTML.substring(0, 100) + '...'
          });
        }
      });

      const snapshot = canvas.toDataURL('image/png', 0.8);
      console.log('Generated snapshot for slide:', slideId);
      
      setSnapshots(prev => ({
        ...prev,
        [slideId]: snapshot
      }));
      snapshotCacheRef.current[slideId] = snapshot;
    } catch (error) {
      console.error('Error generating snapshot:', error);
    } finally {
      pendingSnapshotsRef.current.delete(slideId);
      if (pendingSnapshotsRef.current.size === 0) {
        setIsGenerating(false);
      }
    }
  }, []);

  const clearSnapshot = useCallback((slideId: string) => {
    console.log('Clearing snapshot for slide:', slideId);
    setSnapshots(prev => {
      const newSnapshots = { ...prev };
      delete newSnapshots[slideId];
      return newSnapshots;
    });
    delete snapshotCacheRef.current[slideId];
    pendingSnapshotsRef.current.delete(slideId);
  }, []);

  const clearAllSnapshots = useCallback(() => {
    console.log('Clearing all snapshots');
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