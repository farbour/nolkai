// file path: src/components/presentation/Presentation.tsx
import React, { useState } from 'react';
import Slide, { SlideContent } from './Slide';

import SlideControls from './SlideControls';

interface PresentationProps {
  slides: SlideContent[];
}

const Presentation: React.FC<PresentationProps> = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSlideSelect = (index: number) => {
    setCurrentSlide(index);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      handleNext();
    } else if (e.key === 'ArrowLeft') {
      handlePrev();
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSlide]);

  return (
    <div className="fixed inset-0 bg-gray-100">
      {/* Top Controls */}
      <SlideControls
        currentSlide={currentSlide}
        totalSlides={slides.length}
        onNext={handleNext}
        onPrev={handlePrev}
        isEditMode={isEditMode}
        onToggleEditMode={() => setIsEditMode(!isEditMode)}
      />

      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Sidebar with Thumbnails */}
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

        {/* Main Content Area */}
        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center p-8 bg-[#F8F9FA]">
            {slides.map((slide, index) => (
              <Slide
                key={slide.id}
                content={{
                  ...slide,
                  slideNumber: index + 1,
                  totalSlides: slides.length
                }}
                isActive={currentSlide === index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Presentation;