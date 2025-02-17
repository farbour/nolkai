// file path: src/components/presentation/Slide.tsx
import React from 'react';
import { motion } from 'framer-motion';

export interface SlideContent {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface SlideProps {
  content: SlideContent;
  isActive: boolean;
}

const Slide: React.FC<SlideProps> = ({ content, isActive }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ 
        opacity: isActive ? 1 : 0,
        x: isActive ? 0 : 100,
        pointerEvents: isActive ? 'auto' : 'none'
      }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 bg-white rounded-lg shadow-lg p-8"
    >
      <h2 className="text-3xl font-bold mb-6 text-gray-800">{content.title}</h2>
      <div className="overflow-auto max-h-[calc(100vh-200px)]">
        {content.content}
      </div>
    </motion.div>
  );
};

export default Slide;