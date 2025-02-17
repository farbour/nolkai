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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onPrev}
            disabled={currentSlide === 0}
            className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
          >
            Previous
          </button>
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <motion.button
                key={index}
                onClick={() => onSlideSelect(index)}
                className={`w-3 h-3 rounded-full ${
                  currentSlide === index ? 'bg-nolk-green' : 'bg-gray-300'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
          <button
            onClick={onNext}
            disabled={currentSlide === totalSlides - 1}
            className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
          >
            Next
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">
            Slide {currentSlide + 1} of {totalSlides}
          </span>
          <button
            onClick={onToggleEditMode}
            className={`px-4 py-2 rounded-lg ${
              isEditMode
                ? 'bg-nolk-green text-white'
                : 'bg-gray-100 text-gray-700'
            } hover:opacity-90 transition-colors`}
          >
            {isEditMode ? 'View Mode' : 'Edit Mode'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlideControls;