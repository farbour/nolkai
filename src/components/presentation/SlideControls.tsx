import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  PencilIcon,
  PresentationChartBarIcon,
} from '@heroicons/react/24/outline';

// file path: src/components/presentation/SlideControls.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface SlideControlsProps {
  currentSlide: number;
  totalSlides: number;
  onNext: () => void;
  onPrev: () => void;
  onSlideSelect: (index: number) => void;
  isEditMode: boolean;
  onToggleEditMode: () => void;
}

const SlideControls: React.FC<SlideControlsProps> = ({
  currentSlide,
  totalSlides,
  onNext,
  onPrev,
  onSlideSelect,
  isEditMode,
  onToggleEditMode,
}) => {
  return (
    <>
      {/* Main Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={onPrev}
              disabled={currentSlide === 0}
              className="p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors group"
              title="Previous Slide (←)"
            >
              <ChevronLeftIcon className="w-6 h-6 text-gray-700 group-hover:text-gray-900" />
            </button>

            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 space-x-3">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => onSlideSelect(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                    currentSlide === index 
                      ? 'bg-blue-600 scale-125' 
                      : 'bg-gray-400 hover:bg-gray-600'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  title={`Go to Slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={onNext}
              disabled={currentSlide === totalSlides - 1}
              className="p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors group"
              title="Next Slide (→)"
            >
              <ChevronRightIcon className="w-6 h-6 text-gray-700 group-hover:text-gray-900" />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
              {currentSlide + 1} / {totalSlides}
            </span>

            <div className="flex items-center space-x-2">
              <button
                onClick={onToggleEditMode}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                  isEditMode
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title={isEditMode ? 'Switch to View Mode (Esc)' : 'Switch to Edit Mode (E)'}
              >
                {isEditMode ? (
                  <>
                    <EyeIcon className="w-5 h-5" />
                    <span>View Mode</span>
                  </>
                ) : (
                  <>
                    <PencilIcon className="w-5 h-5" />
                    <span>Edit Mode</span>
                  </>
                )}
              </button>

              <button
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                title="Start Presentation (F5)"
              >
                <PresentationChartBarIcon className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Thumbnails Strip */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 space-y-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <motion.button
            key={index}
            onClick={() => onSlideSelect(index)}
            className={`w-32 h-18 rounded-lg overflow-hidden border-2 transition-all ${
              currentSlide === index
                ? 'border-blue-600 shadow-lg scale-110'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-full h-full bg-white">
              {/* Thumbnail preview would go here */}
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                Slide {index + 1}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Keyboard Shortcuts Tooltip */}
      <div className="fixed bottom-24 right-4 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 opacity-50 hover:opacity-100 transition-opacity">
        <div>← → Arrow keys to navigate</div>
        <div>E to toggle Edit mode</div>
        <div>F5 to start presentation</div>
        <div>Esc to exit modes</div>
      </div>
    </>
  );
};

export default SlideControls;