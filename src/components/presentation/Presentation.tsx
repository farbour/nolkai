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
    <div className="relative min-h-screen bg-gray-100">
      {/* Main presentation area */}
      <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden">
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
  );
};

export default Presentation;