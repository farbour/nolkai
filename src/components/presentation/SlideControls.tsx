import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  PresentationChartBarIcon
} from '@heroicons/react/24/outline';

// file path: src/components/presentation/SlideControls.tsx
import React from 'react';

interface SlideControlsProps {
  currentSlide: number;
  totalSlides: number;
  onNext: () => void;
  onPrev: () => void;
  isEditMode: boolean;
  onToggleEditMode: () => void;
}

const SlideControls: React.FC<SlideControlsProps> = ({
  currentSlide,
  totalSlides,
  onNext,
  onPrev,
  isEditMode,
  onToggleEditMode,
}) => {
  return (
    <div className="h-16 bg-white border-b border-gray-200">
      {/* Main Toolbar */}
      <div className="h-full flex items-center px-4">
        {/* Left Section - File-like buttons */}
        <div className="flex items-center space-x-2 pr-4 border-r border-gray-200">
          <button className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
            File
          </button>
          <button className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
            Edit
          </button>
          <button className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
            View
          </button>
          <button className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
            Insert
          </button>
        </div>

        {/* Center Section - Main Controls */}
        <div className="flex items-center space-x-4 px-4">
          {/* Undo/Redo */}
          <div className="flex items-center space-x-1">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="Undo (⌘Z)">
              <ArrowPathIcon className="w-4 h-4 rotate-180" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="Redo (⌘⇧Z)">
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

          {/* Add Slide */}
          <button 
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            title="Add Slide"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
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
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg flex items-center space-x-2 text-sm hover:bg-blue-700"
            title="Start Presentation (⌘F5)"
          >
            <PresentationChartBarIcon className="w-4 h-4" />
            <span>Present</span>
          </button>

          <button 
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            title="Download"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlideControls;