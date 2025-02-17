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
    <div className="fixed inset-0 bg-gray-900">
      <div className="relative h-screen w-screen overflow-hidden">
        {/* Presentation Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(55,65,81,1)_0%,rgba(17,24,39,1)_100%)]" />
        
        {/* Slides Container */}
        <div className="relative h-full w-full flex items-center justify-center">
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

        {/* Controls */}
        <SlideControls
          currentSlide={currentSlide}
          totalSlides={slides.length}
          onNext={handleNext}
          onPrev={handlePrev}
          onSlideSelect={handleSlideSelect}
          isEditMode={isEditMode}
          onToggleEditMode={() => setIsEditMode(!isEditMode)}
        />
      </div>
    </div>
  );
};

export default Presentation;