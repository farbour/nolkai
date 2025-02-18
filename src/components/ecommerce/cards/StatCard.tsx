import CountUp from 'react-countup';
import { NOLK_COLORS } from '@/constants/colors';
// file path: src/components/ecommerce/cards/StatCard.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: number;
  suffix: string;
  subtitle: string;
  prefix?: string;
  decimals?: number;
}

const getDefaultDecimals = (suffix: string, value: number): number => {
  if (suffix === '%') return 0;
  if (suffix.includes('T')) return 2;
  if (value >= 100) return 0;
  return 2;
};

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  suffix, 
  subtitle,
  prefix = suffix.includes('T') || suffix.includes('%') ? '$' : '',
  decimals
}) => (
  <motion.div 
    className="bg-white rounded-3xl p-10 shadow-sm hover:shadow-md transition-shadow"
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
      className="text-5xl font-light mb-3"
      style={{ color: NOLK_COLORS.primary }}
    >
      {prefix}<CountUp 
        end={value} 
        decimals={decimals ?? getDefaultDecimals(suffix, value)} 
        duration={2.5} 
      />{suffix}
    </p>
    <p 
      className="text-sm"
      style={{ color: `${NOLK_COLORS.primary}b3` }}
    >
      {subtitle}
    </p>
  </motion.div>
);