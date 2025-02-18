import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

import Logo from '../Logo';
import MDEditor from '@uiw/react-md-editor';
// file path: src/components/presentation/Slide.tsx
import React from 'react';
import { motion } from 'framer-motion';
import remarkGfm from 'remark-gfm';

export interface SlideContent {
  id: string;
  title: string;
  content: string | React.ReactNode;
  slideNumber?: number;
  totalSlides?: number;
}

interface SlideProps {
  content: SlideContent;
  isActive: boolean;
  isPresentationMode: boolean;
  isEditMode?: boolean;
  onContentChange?: (newContent: string) => void;
}

// Helper function to extract text content from React elements
const extractTextContent = (node: React.ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') {
    return node.toString();
  }
  
  if (Array.isArray(node)) {
    return node.map(extractTextContent).join('\n');
  }
  
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    if (props.children) {
      return extractTextContent(props.children);
    }
  }
  
  return '';
};

export const Slide: React.FC<SlideProps> = ({
  content,
  isActive,
  isPresentationMode,
  isEditMode = false,
  onContentChange,
}) => {
  const [showHtml, setShowHtml] = React.useState(false);
  const [editableContent, setEditableContent] = React.useState(() => {
    if (typeof content.content === 'string') {
      return content.content;
    }
    // For React components, return the actual content
    if (React.isValidElement(content.content)) {
      return extractTextContent(content.content);
    }
    return '';
  });

  // Update editable content when the slide content changes
  React.useEffect(() => {
    if (typeof content.content === 'string') {
      setEditableContent(content.content);
    } else if (React.isValidElement(content.content)) {
      // For React components, use the actual content
      setEditableContent(extractTextContent(content.content));
    }
  }, [content.id, content.title, content.content]);

  // Handle content changes
  const handleContentChange = (newContent: string) => {
    setEditableContent(newContent);
    onContentChange?.(newContent);
  };

  const renderContent = () => {
    if (isEditMode && !isPresentationMode) {
      if (showHtml) {
        return (
          <div className="w-full h-full">
            <div className="mb-2 flex justify-end">
              <button
                onClick={() => setShowHtml(false)}
                className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Switch to Markdown
              </button>
            </div>
            <textarea
              value={editableContent}
              onChange={(e) => handleContentChange(e.target.value)}
              className="w-full h-[calc(100%-40px)] p-4 font-mono text-sm bg-white border border-gray-200 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter HTML content here..."
              spellCheck={false}
            />
          </div>
        );
      }

      return (
        <div className="w-full h-full" data-color-mode="light">
          <div className="mb-2 flex justify-end">
            <button
              onClick={() => setShowHtml(true)}
              className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit HTML
            </button>
          </div>
          <MDEditor
            value={editableContent}
            onChange={(value) => handleContentChange(value || '')}
            preview="edit"
            hideToolbar={false}
            height="calc(100% - 40px)"
            className="!border-0 !bg-transparent md-editor-wrapper"
            textareaProps={{
              placeholder: 'Add your slide content here...',
            }}
            previewOptions={{
              remarkPlugins: [remarkGfm],
            }}
          />
        </div>
      );
    }

    // In view mode, show the content
    if (typeof content.content === 'string') {
      return (
        <div data-color-mode="light" className="w-full h-full">
          <div className="wmde-markdown prose prose-lg max-w-none">
            <MDEditor.Markdown
              source={content.content.replace(/^# .*\n/, '')} // Remove the first heading
              remarkPlugins={[remarkGfm]}
              style={{
                whiteSpace: 'pre-wrap',
                background: 'transparent',
              }}
              wrapperElement={{
                "data-color-mode": "light"
              }}
              components={{
                code: (props) => {
                  const { children, className, ...rest } = props;
                  const isInline = !className?.includes('code-block');
                  return isInline ? (
                    <code {...rest} className="px-1 py-0.5 rounded bg-gray-100">
                      {children}
                    </code>
                  ) : (
                    <pre className="p-4 rounded-lg bg-gray-800 text-white overflow-x-auto">
                      <code {...rest}>{children}</code>
                    </pre>
                  );
                }
              }}
            />
          </div>
        </div>
      );
    }

    // If content is a React component, render it directly
    if (React.isValidElement(content.content)) {
      return (
        <div className="w-full h-full">
          {content.content}
        </div>
      );
    }

    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1 : 0.95,
        pointerEvents: isActive ? 'auto' : 'none'
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full h-full flex items-center justify-center p-4"
    >
      <div className={`relative bg-white rounded-lg shadow-2xl ${
        isPresentationMode 
          ? 'w-[90vw] h-[90vh]' 
          : 'w-[80vw] h-[80vh]'
      } max-w-[1600px] max-h-[900px]`}>
        {/* Header - Hidden in presentation mode */}
        {!isPresentationMode && (
          <div className="absolute top-0 left-0 right-0 h-12 px-6 flex items-center justify-between border-b border-gray-200 bg-white/80 backdrop-blur-sm z-10">
            <h2 className="text-lg font-medium text-gray-800 truncate max-w-2xl">
              {content.title}
            </h2>
            <Logo height={20} className="opacity-40" />
          </div>
        )}

        {/* Content Area */}
        <div className={`w-full h-full ${
          isPresentationMode
            ? 'p-16'
            : isEditMode ? 'p-4 pt-16' : 'p-12 pt-16'
        }`}>
          <div className={`h-full flex flex-col ${!isEditMode && 'justify-center'} overflow-y-auto`}>
            <div className="flex-1 flex flex-col justify-center">
              {renderContent()}
            </div>
          </div>
        </div>

        {/* Slide Number */}
        <div className="absolute bottom-4 right-4 text-sm text-gray-400">
          {content.slideNumber} / {content.totalSlides}
        </div>
      </div>
    </motion.div>
  );
};

export default Slide;