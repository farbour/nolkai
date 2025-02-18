// file path: src/components/presentation/SlideThumbnail.tsx
import React from 'react';
import { SlideContent } from './Slide';

interface SlideThumbnailProps {
  slide: SlideContent;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

export const SlideThumbnail: React.FC<SlideThumbnailProps> = ({
  slide,
  index,
  isActive,
  onClick,
}) => {
  // Extract the first heading or first line of content
  const getSlideLabel = () => {
    if (typeof slide.content === 'string') {
      // Look for the first heading
      const headingMatch = slide.content.match(/^#+ (.+)$/m);
      if (headingMatch) {
        return headingMatch[1];
      }
      // If no heading found, take the first non-empty line
      const firstLine = slide.content.split('\n').find(line => line.trim() !== '');
      return firstLine || slide.title;
    }
    return slide.title;
  };

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
        <div className="absolute inset-0 bg-white border border-gray-200 rounded-lg overflow-hidden">
          {/* Slide Number Badge */}
          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium shadow-sm z-10">
            {index + 1}
          </div>

          {/* Content Container */}
          <div className="absolute inset-0 p-4 flex flex-col">
            <div className="text-sm font-medium text-gray-700 line-clamp-3 text-center mt-4">
              {getSlideLabel()}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

export default SlideThumbnail;