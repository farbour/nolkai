// file path: src/components/presentation/Presentation.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Slide } from './Slide';
import { SlideContent } from './Slide';
import { SlideControls } from './SlideControls';
import { SlideThumbnail } from './SlideThumbnail';

interface PresentationProps {
  slides: SlideContent[];
  isAuthenticated: boolean;
}

const Presentation: React.FC<PresentationProps> = ({ slides: initialSlides, isAuthenticated }) => {
  console.log('Initial slides:', initialSlides);

  const [slides, setSlides] = useState<SlideContent[]>(initialSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [undoStack, setUndoStack] = useState<SlideContent[][]>([[...initialSlides]]);
  const [redoStack, setRedoStack] = useState<SlideContent[][]>([]);
  const [isCreatingSlides, setIsCreatingSlides] = useState(false);
  
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isTyping = useRef<boolean>(false);

  const handleCreateGoogleSlides = async () => {
    try {
      setIsCreatingSlides(true);
      const response = await fetch('/api/presentations/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Nolk Presentation',
          content: slides.map(slide => slide.content)
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create Google Slides');
      }

      const data = await response.json();
      window.open(`https://docs.google.com/presentation/d/${data.presentationId}`, '_blank');
    } catch (error) {
      console.error('Error creating Google Slides:', error);
      alert('Failed to create Google Slides. Please make sure you are authenticated with Google.');
    } finally {
      setIsCreatingSlides(false);
    }
  };

  // Log current slide content whenever it changes
  useEffect(() => {
    console.log('Current slide:', slides[currentSlide]);
  }, [currentSlide, slides]);

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

  // Content change handler
  const handleContentChange = useCallback((newContent: string) => {
    console.log('Content being changed:', newContent);
    isTyping.current = true;
    
    setSlides(currentSlides => {
      const updatedSlides = currentSlides.map((slide, index) => {
        if (index === currentSlide) {
          return { ...slide, content: newContent };
        }
        return slide;
      });
      console.log('Updated slides:', updatedSlides);
      return updatedSlides;
    });

    // Clear existing timeout
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    // Set new timeout to save to undo stack
    saveTimeout.current = setTimeout(() => {
      isTyping.current = false;
      setUndoStack(stack => [...stack, slides]);
      setRedoStack([]);
    }, 1000);
  }, [currentSlide, slides]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, []);

  // Undo/Redo functionality
  const handleUndo = useCallback(() => {
    if (undoStack.length > 1 && !isTyping.current) {
      const previousState = undoStack[undoStack.length - 1];
      const newUndoStack = undoStack.slice(0, -1);
      setUndoStack(newUndoStack);
      setRedoStack(stack => [...stack, slides]);
      setSlides(previousState);
    }
  }, [undoStack, slides]);

  const handleRedo = useCallback(() => {
    if (redoStack.length > 0 && !isTyping.current) {
      const nextState = redoStack[redoStack.length - 1];
      const newRedoStack = redoStack.slice(0, -1);
      setRedoStack(newRedoStack);
      setUndoStack(stack => [...stack, slides]);
      setSlides(nextState);
    }
  }, [redoStack, slides]);

  // Slide operations
  const handleAddSlide = useCallback(() => {
    const newSlide: SlideContent = {
      id: `slide-${Date.now()}`,
      title: 'New Slide',
      content: '# New Slide\n\nAdd your content here'
    };
    setUndoStack(stack => [...stack, slides]);
    setSlides(currentSlides => [
      ...currentSlides.slice(0, currentSlide + 1),
      newSlide,
      ...currentSlides.slice(currentSlide + 1)
    ]);
    setCurrentSlide(current => current + 1);
  }, [currentSlide, slides]);

  const handleDeleteSlide = useCallback(() => {
    if (slides.length > 1) {
      setUndoStack(stack => [...stack, slides]);
      setSlides(currentSlides => currentSlides.filter((_, index) => index !== currentSlide));
      setCurrentSlide(current => Math.min(current, slides.length - 2));
    }
  }, [currentSlide, slides.length, slides]);

  // Mode toggles
  const togglePresentationMode = useCallback(async () => {
    try {
      if (!isPresentationMode) {
        await document.documentElement.requestFullscreen();
        setIsPresentationMode(true);
        setIsEditMode(false); // Exit edit mode when entering presentation mode
      } else {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
        setIsPresentationMode(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
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
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrev();
      } else if (e.key === 'Escape') {
        if (isPresentationMode) {
          togglePresentationMode();
        }
        setIsEditMode(false);
      } else if (e.key === 'F5' || (e.key === 'p' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        togglePresentationMode();
      } else if (e.metaKey || e.ctrlKey) {
        if (e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            handleRedo();
          } else {
            handleUndo();
          }
        }
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && isEditMode) {
        if (document.activeElement === document.body) {
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
    <div className={`fixed inset-0 ${isPresentationMode ? 'bg-black' : 'bg-gray-100'}`}>
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
          onCreateGoogleSlides={isAuthenticated ? handleCreateGoogleSlides : undefined}
          isCreatingSlides={isCreatingSlides}
          canUndo={undoStack.length > 1}
          canRedo={redoStack.length > 0}
        />
      )}

      <div className={`flex ${isPresentationMode ? 'h-screen' : 'h-[calc(100vh-64px)]'}`}>
        {/* Left Sidebar - Hidden in presentation mode */}
        {!isPresentationMode && (
          <div className="w-80 bg-[#F8F9FA] border-r border-gray-200 overflow-y-auto py-4">
            <div className="space-y-3 px-4">
              {slides.map((slide, index) => (
                <SlideThumbnail
                  key={slide.id}
                  slide={slide}
                  index={index}
                  isActive={currentSlide === index}
                  onClick={() => handleSlideSelect(index)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 relative">
          <div className={`slide-container absolute inset-0 ${
            isPresentationMode ? 'bg-black' : 'bg-[#F8F9FA]'
          }`}>
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 ${
                  currentSlide === index ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
              >
                <Slide
                  content={{
                    ...slide,
                    slideNumber: index + 1,
                    totalSlides: slides.length
                  }}
                  isActive={currentSlide === index}
                  isPresentationMode={isPresentationMode}
                  isEditMode={isEditMode}
                  onContentChange={handleContentChange}
                />
              </div>
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
        </div>
      )}
    </div>
  );
};

export default Presentation;