import { NOLK_COLORS } from '@/constants/colors';
// file path: src/components/ecommerce/sections/HeroSection.tsx
import React from 'react';
import { StatCard } from '../cards/StatCard';
import { motion } from 'framer-motion';

export const HeroSection: React.FC = () => (
  <section className="px-8 md:px-16 pt-32 pb-24">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div>
          <motion.h1 
            className="text-[3.5rem] md:text-[4.5rem] font-light leading-tight mb-8"
            style={{ color: NOLK_COLORS.primary }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Global E-commerce Intelligence
          </motion.h1>
          <motion.p 
            className="text-xl mb-12 leading-relaxed"
            style={{ color: `${NOLK_COLORS.primary}cc` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            A comprehensive analysis of market trends, consumer behavior, and future forecasts in the evolving landscape of digital commerce.
          </motion.p>
          <motion.div 
            className="flex gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <button 
              className="px-8 py-4 bg-[#344C45] text-white rounded-full hover:bg-[#2a3e39] transition-colors text-sm"
            >
              View Full Report
            </button>
            <button 
              className="px-8 py-4 border border-[#344C45] text-[#344C45] rounded-full hover:bg-[#344C45] hover:text-white transition-colors text-sm"
            >
              Download PDF
            </button>
          </motion.div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <StatCard 
            title="Market Size"
            value={20}
            suffix="T+"
            subtitle="Projected by 2030"
          />
          <StatCard 
            title="CAGR"
            value={15}
            suffix="%"
            subtitle="Through 2030"
          />
        </div>
      </div>
    </div>
  </section>
);