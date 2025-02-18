import { NOLK_COLORS } from '@/constants/colors';
// file path: src/components/ecommerce/cards/InsightCard.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface InsightCardProps {
  title: string;
  description: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({ 
  title, 
  description 
}) => (
  <motion.div 
    className="bg-white rounded-3xl p-10 shadow-sm hover:shadow-md transition-shadow"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h3 
      className="text-xl font-medium mb-4"
      style={{ color: NOLK_COLORS.primary }}
    >
      {title}
    </h3>
    <p 
      className="leading-relaxed"
      style={{ color: `${NOLK_COLORS.primary}cc` }}
    >
      {description}
    </p>
  </motion.div>
);