import Logo from '../Logo';
// file path: src/components/presentation/Slide.tsx
import React from 'react';
import { motion } from 'framer-motion';

export interface SlideContent {
  id: string;
  title: string;
  content: React.ReactNode;
  slideNumber?: number;
  totalSlides?: number;
}

interface SlideProps {
  content: SlideContent;
  isActive: boolean;
  isPresentationMode: boolean;
}

const Slide: React.FC<SlideProps> = ({ content, isActive, isPresentationMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ 
        opacity: isActive ? 1 : 0,
        x: isActive ? 0 : 100,
        pointerEvents: isActive ? 'auto' : 'none',
        scale: isPresentationMode ? 1 : 0.95
      }}
      transition={{ duration: 0.5 }}
      className={`absolute ${
        isPresentationMode 
          ? 'inset-0 flex items-center justify-center' 
          : 'inset-0 flex items-center justify-center p-8'
      }`}
    >
      {/* Main slide container */}
      <div className={`bg-white rounded-lg ${
        isPresentationMode 
          ? 'w-full h-full max-w-none shadow-none' 
          : 'w-full max-w-5xl h-auto shadow-xl'
      }`}>
        {/* 16:9 aspect ratio container */}
        <div className="relative" style={{ paddingTop: '56.25%' }}>
          <div className="absolute inset-0 flex flex-col">
            {/* Header - Hidden in presentation mode */}
            {!isPresentationMode && (
              <div className="flex items-center justify-between px-8 py-4 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800 truncate max-w-2xl">
                  {content.title}
                </h2>
                <Logo height={24} className="opacity-50" />
              </div>
            )}

            {/* Content Area */}
            <div className={`flex-1 ${
              isPresentationMode 
                ? 'p-12' 
                : 'p-8'
            } overflow-auto`}>
              {content.content}
            </div>

            {/* Footer - Hidden in presentation mode */}
            {!isPresentationMode && content.slideNumber && content.totalSlides && (
              <div className="flex items-center justify-between px-8 py-3 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  {/* Additional info can go here */}
                </div>
                <div className="text-sm text-gray-500">
                  Slide {content.slideNumber} of {content.totalSlides}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Presentation Mode Slide Number */}
      {isPresentationMode && content.slideNumber && content.totalSlides && (
        <div className="fixed bottom-4 right-4 text-sm text-white bg-black/50 px-3 py-1 rounded-full">
          {content.slideNumber} / {content.totalSlides}
        </div>
      )}
    </motion.div>
  );
};

export default Slide;