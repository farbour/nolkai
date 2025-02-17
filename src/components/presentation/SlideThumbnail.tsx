import Logo from '../Logo';
// file path: src/components/presentation/SlideThumbnail.tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { SlideContent } from './Slide';
import remarkGfm from 'remark-gfm';

interface SlideThumbnailProps {
  slide: SlideContent;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const SlideThumbnail: React.FC<SlideThumbnailProps> = ({
  slide,
  index,
  isActive,
  onClick,
}) => {
  const renderContent = () => {
    if (typeof slide.content === 'string') {
      return (
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-[12px] font-bold mb-2 text-center text-gray-800">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-[11px] font-semibold mb-1.5 text-center text-gray-800">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-[10px] font-medium mb-1 text-gray-800">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="text-[9px] mb-2 leading-snug text-gray-600">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-3 mb-2 space-y-1">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-3 mb-2 space-y-1">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="text-[9px] leading-snug text-gray-600">{children}</li>
            ),
            code: ({ inline, className, children }: CodeBlockProps) => (
              <code
                className={`${className} ${
                  inline 
                    ? 'bg-gray-100 rounded px-1 text-[9px] font-mono text-gray-800' 
                    : 'block bg-gray-900 text-gray-100 p-1.5 rounded text-[9px] font-mono my-1.5'
                }`}
              >
                {children}
              </code>
            ),
          }}
        >
          {slide.content}
        </ReactMarkdown>
      );
    }
    return (
      <div className="text-[9px] text-gray-400 flex items-center justify-center h-full">
        Custom Content
      </div>
    );
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
      {/* Exact miniature of the main slide */}
      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
        <div className="absolute inset-0 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="relative w-full h-full flex flex-col">
            {/* Header */}
            <div className="h-6 px-3 flex items-center justify-between border-b border-gray-200 bg-white">
              <h2 className="text-[9px] font-medium text-gray-800 truncate max-w-[80%]">
                {slide.title}
              </h2>
              <Logo height={10} className="opacity-40" />
            </div>

            {/* Content Area */}
            <div className="flex-1 p-3 overflow-hidden">
              <div className="h-full flex flex-col justify-center">
                {renderContent()}
              </div>
            </div>

            {/* Slide Number */}
            <div className="absolute bottom-1 right-1.5 text-[8px] text-gray-400">
              {index + 1} / {slide.totalSlides}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

export default SlideThumbnail;