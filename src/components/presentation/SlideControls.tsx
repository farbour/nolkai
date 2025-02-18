import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudArrowUpIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  PresentationChartBarIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
// file path: src/components/presentation/SlideControls.tsx
import React, { useEffect } from 'react';
interface SlideControlsProps {
  currentSlide: number;
  totalSlides: number;
  onNext: () => void;
  onPrev: () => void;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onAddSlide: () => void;
  onDeleteSlide: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onPresent: () => void;
  onCreateGoogleSlides?: () => void;
  isCreatingSlides?: boolean;
  canUndo: boolean;
  canRedo: boolean;
}

export const SlideControls: React.FC<SlideControlsProps> = ({
  currentSlide,
  totalSlides,
  onNext,
  onPrev,
  isEditMode,
  onToggleEditMode,
  onAddSlide,
  onDeleteSlide,
  onUndo,
  onRedo,
  onPresent,
  onCreateGoogleSlides,
  isCreatingSlides = false,
  canUndo,
  canRedo,
}) => {
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case '+':
          case '=':
            e.preventDefault();
            onAddSlide();
            break;
          case 's':
            e.preventDefault();
            handleDownload();
            break;
          case 'e':
            e.preventDefault();
            onToggleEditMode();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onAddSlide, onToggleEditMode]);

  const handleDownload = () => {
    // Create a download link for the presentation content
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify({
      currentSlide,
      totalSlides,
      // Add other presentation data here
    }, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = 'presentation.json';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200">
      {/* Main Toolbar */}
      <div className="h-full flex items-center px-4">
        {/* Left Section - File-like buttons */}
        <div className="flex items-center space-x-2 pr-4 border-r border-gray-200">
          <button 
            className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded"
            onClick={handleDownload}
            title="Save presentation (⌘S)"
          >
            File
          </button>
          <button 
            className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded"
            onClick={onToggleEditMode}
            title="Toggle edit mode (⌘E)"
          >
            Edit
          </button>
          <button 
            className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded"
            onClick={onPresent}
            title="Start presentation (F5)"
          >
            View
          </button>
          <button 
            className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded"
            onClick={onAddSlide}
            title="Add new slide (⌘+)"
          >
            Insert
          </button>
        </div>

        {/* Center Section - Main Controls */}
        <div className="flex items-center space-x-4 px-4">
          {/* Undo/Redo */}
          <div className="flex items-center space-x-1">
            <button 
              onClick={onUndo}
              disabled={!canUndo}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed" 
              title="Undo (⌘Z)"
            >
              <ArrowPathIcon className="w-4 h-4 rotate-180" />
            </button>
            <button 
              onClick={onRedo}
              disabled={!canRedo}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed" 
              title="Redo (⌘⇧Z)"
            >
              <ArrowPathIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-1 border-l border-r border-gray-200 px-4">
            <button
              onClick={onPrev}
              disabled={currentSlide === 0}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              title="Previous Slide (←)"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600 min-w-[3rem] text-center">
              {currentSlide + 1} / {totalSlides}
            </span>
            <button
              onClick={onNext}
              disabled={currentSlide === totalSlides - 1}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              title="Next Slide (→)"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Slide Operations */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={onAddSlide}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              title="Add Slide (⌘+)"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
            <button 
              onClick={onDeleteSlide}
              disabled={totalSlides <= 1}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete Slide (Delete)"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Section - Mode Controls */}
        <div className="flex items-center space-x-3 ml-auto">
          <button
            onClick={onToggleEditMode}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-2 text-sm ${
              isEditMode
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title="Toggle edit mode (⌘E)"
          >
            {isEditMode ? (
              <>
                <EyeIcon className="w-4 h-4" />
                <span>View Mode</span>
              </>
            ) : (
              <>
                <PencilIcon className="w-4 h-4" />
                <span>Edit Mode</span>
              </>
            )}
          </button>

          <button 
            onClick={onPresent}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg flex items-center space-x-2 text-sm hover:bg-blue-700"
            title="Start Presentation (F5)"
          >
            <PresentationChartBarIcon className="w-4 h-4" />
            <span>Present</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              title="Download (⌘S)"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
            </button>
            {onCreateGoogleSlides && (
              <button
                onClick={onCreateGoogleSlides}
                disabled={isCreatingSlides}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg flex items-center space-x-2 text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Create Google Slides"
              >
                {isCreatingSlides ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <CloudArrowUpIcon className="w-4 h-4" />
                    <span>Create Google Slides</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideControls;