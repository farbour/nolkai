import { NOLK_COLORS } from '@/constants/colors';
// file path: src/components/ecommerce/cards/TrendCard.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface TrendCardProps {
  title: string;
  value: number;
  unit: string;
  growth: string;
}

export const TrendCard: React.FC<TrendCardProps> = ({ 
  title, 
  value, 
  unit, 
  growth 
}) => (
  <motion.div 
    className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h3 
      className="text-lg font-medium mb-4"
      style={{ color: NOLK_COLORS.primary }}
    >
      {title}
    </h3>
    <p 
      className="text-4xl font-light mb-2"
      style={{ color: NOLK_COLORS.primary }}
    >
      ${value}{unit}
    </p>
    <p 
      className="text-sm"
      style={{ color: `${NOLK_COLORS.primary}b3` }}
    >
      {growth}
    </p>
  </motion.div>
);