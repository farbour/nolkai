import { NOLK_COLORS } from '@/constants/colors';
// file path: src/components/ecommerce/sections/FutureOutlookSection.tsx
import React from 'react';
import { motion } from 'framer-motion';

export const FutureOutlookSection: React.FC = () => (
  <section className="px-8 md:px-16 py-24" style={{ backgroundColor: NOLK_COLORS.primary }}>
    <div className="max-w-7xl mx-auto">
      <motion.div 
        className="max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-[2.5rem] font-light leading-tight mb-8 text-white">
          Future Market Outlook
        </h2>
        <p className="text-xl opacity-80 mb-12 leading-relaxed text-white">
          By 2030, e-commerce is expected to hit $20T+ in sales, with emerging technologies like AR/VR shopping, autonomous delivery, and AI-powered personalization becoming mainstream.
        </p>
        <button className="px-8 py-4 bg-white rounded-full hover:bg-white/90 transition-colors text-sm"
          style={{ color: NOLK_COLORS.primary }}
        >
          Download Complete Analysis
        </button>
      </motion.div>
    </div>
  </section>
);