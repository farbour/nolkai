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
}

const Slide: React.FC<SlideProps> = ({ content, isActive }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1 : 0.95,
        pointerEvents: isActive ? 'auto' : 'none'
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="absolute inset-0 flex items-center justify-center p-4 sm:p-8"
    >
      {/* 16:9 aspect ratio container */}
      <div className="w-full max-w-[1280px] bg-white rounded-lg shadow-2xl overflow-hidden">
        <div className="aspect-[16/9] relative">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 h-16 px-8 flex items-center justify-between border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 truncate max-w-2xl">
              {content.title}
            </h2>
            <Logo height={24} className="opacity-50" />
          </div>

          {/* Main Content Area */}
          <div className="absolute top-16 left-0 right-0 bottom-12 p-8 overflow-auto">
            <div className="h-full grid grid-cols-12 gap-4">
              {content.content}
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 h-12 px-8 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {/* Date or additional info can go here */}
            </div>
            {content.slideNumber && content.totalSlides && (
              <div className="text-sm text-gray-500">
                Slide {content.slideNumber} of {content.totalSlides}
              </div>
            )}
          </div>

          {/* Background Grid (decorative) */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full bg-gradient-to-br from-gray-50 to-white opacity-50" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Slide;