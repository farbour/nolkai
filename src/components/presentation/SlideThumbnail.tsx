// file path: src/components/presentation/SlideThumbnail.tsx
import React from 'react';
import { SlideContent } from './Slide';

interface SlideThumbnailProps {
  slide: SlideContent;
  index: number;
  isActive: boolean;
  onClick: () => void;
  snapshot?: string;
}

const SlideThumbnail: React.FC<SlideThumbnailProps> = ({
  slide,
  index,
  isActive,
  onClick,
  snapshot,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full group relative transition-all duration-200 ${
        isActive 
          ? 'ring-2 ring-blue-500 scale-100 shadow-lg' 
          : 'hover:ring-2 hover:ring-gray-300 hover:shadow-md scale-95 hover:scale-100'
      }`}
    >
      {/* Thumbnail Container with 16:9 aspect ratio */}
      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
        <div className="absolute inset-0 bg-white rounded-lg shadow-sm overflow-hidden">
          {snapshot ? (
            // Display snapshot if available
            <img 
              src={snapshot} 
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          ) : (
            // Fallback loading state
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <div className="text-[10px] text-gray-400">Loading preview...</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Slide Number Badge */}
      <div className="absolute top-2 left-2 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium shadow-sm">
        {index + 1}
      </div>
    </button>
  );
};

export default SlideThumbnail;