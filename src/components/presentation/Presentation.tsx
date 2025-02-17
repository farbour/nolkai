// file path: src/components/presentation/Presentation.tsx
import React, { useCallback, useEffect, useState } from 'react';
import Slide, { SlideContent } from './Slide';

import SlideControls from './SlideControls';

interface PresentationProps {
  slides: SlideContent[];
}

const Presentation: React.FC<PresentationProps> = ({ slides: initialSlides }) => {
  const [slides, setSlides] = useState(initialSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [undoStack, setUndoStack] = useState<SlideContent[][]>([]);
  const [redoStack, setRedoStack] = useState<SlideContent[][]>([]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  }, [currentSlide, slides.length]);

  const handlePrev = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  }, [currentSlide]);

  const handleSlideSelect = (index: number) => {
    setCurrentSlide(index);
  };

  // Undo/Redo functionality
  const pushToUndoStack = (newSlides: SlideContent[]) => {
    setUndoStack([...undoStack, slides]);
    setSlides(newSlides);
    setRedoStack([]);
  };

  const handleUndo = useCallback(() => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      const newUndoStack = undoStack.slice(0, -1);
      setUndoStack(newUndoStack);
      setRedoStack([...redoStack, slides]);
      setSlides(previousState);
    }
  }, [undoStack, redoStack, slides]);

  const handleRedo = useCallback(() => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      const newRedoStack = redoStack.slice(0, -1);
      setRedoStack(newRedoStack);
      setUndoStack([...undoStack, slides]);
      setSlides(nextState);
    }
  }, [undoStack, redoStack, slides]);

  // Slide operations
  const handleAddSlide = useCallback(() => {
    const newSlide: SlideContent = {
      id: `slide-${Date.now()}`,
      title: 'New Slide',
      content: <div className="text-center text-gray-400">Add content here</div>
    };
    pushToUndoStack([...slides.slice(0, currentSlide + 1), newSlide, ...slides.slice(currentSlide + 1)]);
    setCurrentSlide(currentSlide + 1);
  }, [currentSlide, slides]);

  const handleDeleteSlide = useCallback(() => {
    if (slides.length > 1) {
      pushToUndoStack(slides.filter((_, index) => index !== currentSlide));
      setCurrentSlide(Math.min(currentSlide, slides.length - 2));
    }
  }, [currentSlide, slides]);

  // Mode toggles
  const togglePresentationMode = useCallback(async () => {
    try {
      if (!isPresentationMode) {
        await document.documentElement.requestFullscreen();
        setIsPresentationMode(true);
      } else {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
        setIsPresentationMode(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
      // Fallback: just toggle the presentation mode state
      setIsPresentationMode(!isPresentationMode);
    }
  }, [isPresentationMode]);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsPresentationMode(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Navigation
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrev();
      }

      // Mode controls
      if (e.key === 'Escape') {
        if (isPresentationMode) {
          togglePresentationMode();
        }
        setIsEditMode(false);
      }

      // Presentation mode
      if (e.key === 'F5' || (e.key === 'p' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        togglePresentationMode();
      }

      // Edit operations
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            handleRedo();
          } else {
            handleUndo();
          }
        } else if (e.key === 's') {
          e.preventDefault();
          // Save functionality would go here
        }
      }

      // Delete slide
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (isEditMode && document.activeElement === document.body) {
          e.preventDefault();
          handleDeleteSlide();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleNext,
    handlePrev,
    handleUndo,
    handleRedo,
    handleDeleteSlide,
    isPresentationMode,
    isEditMode,
    togglePresentationMode
  ]);

  return (
    <div className={`fixed inset-0 bg-gray-100 ${isPresentationMode ? 'bg-black' : ''}`}>
      {/* Top Controls - Hidden in presentation mode */}
      {!isPresentationMode && (
        <SlideControls
          currentSlide={currentSlide}
          totalSlides={slides.length}
          onNext={handleNext}
          onPrev={handlePrev}
          isEditMode={isEditMode}
          onToggleEditMode={() => setIsEditMode(!isEditMode)}
          onAddSlide={handleAddSlide}
          onDeleteSlide={handleDeleteSlide}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onPresent={togglePresentationMode}
          canUndo={undoStack.length > 0}
          canRedo={redoStack.length > 0}
        />
      )}

      <div className={`flex ${isPresentationMode ? 'h-screen' : 'h-[calc(100vh-64px)]'}`}>
        {/* Left Sidebar - Hidden in presentation mode */}
        {!isPresentationMode && (
          <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto py-4">
            <div className="space-y-3 px-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => handleSlideSelect(index)}
                  className={`w-full group relative ${
                    currentSlide === index 
                      ? 'ring-2 ring-blue-500' 
                      : 'hover:ring-2 hover:ring-gray-300'
                  }`}
                >
                  {/* Thumbnail Container with 16:9 aspect ratio */}
                  <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                    <div className="absolute inset-0 bg-white border border-gray-200 rounded-lg overflow-hidden">
                      {/* Thumbnail Preview */}
                      <div className="w-full h-full p-2 flex flex-col">
                        <div className="text-xs font-medium text-gray-700 truncate mb-1">
                          {slide.title}
                        </div>
                        <div className="flex-1 flex items-center justify-center text-xs text-gray-400">
                          Slide {index + 1}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Slide Number Badge */}
                  <div className="absolute top-1 left-1 bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded">
                    {index + 1}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 relative overflow-hidden">
          <div className={`absolute inset-0 flex items-center justify-center ${
            isPresentationMode ? 'bg-black' : 'p-8 bg-[#F8F9FA]'
          }`}>
            {slides.map((slide, index) => (
              <Slide
                key={slide.id}
                content={{
                  ...slide,
                  slideNumber: index + 1,
                  totalSlides: slides.length
                }}
                isActive={currentSlide === index}
                isPresentationMode={isPresentationMode}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Help - Only visible when not in presentation mode */}
      {!isPresentationMode && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 text-sm text-gray-600 opacity-75 hover:opacity-100 transition-opacity">
          <div className="font-medium mb-2">Keyboard Shortcuts:</div>
          <div>← → or Page Up/Down: Navigate slides</div>
          <div>F5 or ⌘P: Start presentation</div>
          <div>ESC: Exit modes</div>
          <div>⌘Z: Undo</div>
          <div>⌘⇧Z: Redo</div>
          <div>Delete: Remove slide</div>
          <div>⌘S: Save</div>
        </div>
      )}
    </div>
  );
};

export default Presentation;