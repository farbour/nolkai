import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  PencilIcon
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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Navigation Controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onPrev}
            disabled={currentSlide === 0}
            className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            title="Previous Slide (←)"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
          </button>

          <div className="flex items-center space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <motion.button
                key={index}
                onClick={() => onSlideSelect(index)}
                className={`w-2 h-2 rounded-full ${
                  currentSlide === index 
                    ? 'bg-blue-600' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>

          <button
            onClick={onNext}
            disabled={currentSlide === totalSlides - 1}
            className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            title="Next Slide (→)"
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {currentSlide + 1} / {totalSlides}
          </span>

          <button
            onClick={onToggleEditMode}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              isEditMode
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isEditMode ? (
              <>
                <EyeIcon className="w-4 h-4" />
                <span>View</span>
              </>
            ) : (
              <>
                <PencilIcon className="w-4 h-4" />
                <span>Edit</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlideControls;