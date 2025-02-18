import { ChartCard } from '../cards/ChartCard';
import { MarketGrowthChart } from '../charts/MarketGrowthChart';
import { NOLK_COLORS } from '@/constants/colors';
// file path: src/components/ecommerce/sections/MarketGrowthSection.tsx
import React from 'react';
import { StatCard } from '../cards/StatCard';
import { marketGrowthData } from '@/data/ecommerce/marketData';
import { motion } from 'framer-motion';

export const MarketGrowthSection: React.FC = () => (
  <section className="px-8 md:px-16 py-24 bg-white">
    <div className="max-w-7xl mx-auto">
      <motion.h2 
        className="text-[2.5rem] font-light leading-tight mb-16"
        style={{ color: NOLK_COLORS.primary }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Market Growth Trajectory
      </motion.h2>
      
      <motion.div 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <ChartCard
          title="Global E-commerce Market Size ($T)"
          subtitle="Historical data and future projections of the global e-commerce market"
        >
          <MarketGrowthChart data={marketGrowthData} />
        </ChartCard>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
          title="Current Market Size"
          value={6.31}
          suffix="T"
          subtitle="2023 Global E-commerce Value"
        />
        <StatCard 
          title="Growth Trajectory"
          value={7.95}
          suffix="T"
          subtitle="Projected by 2027"
        />
        <StatCard 
          title="Future Potential"
          value={20}
          suffix="T+"
          subtitle="Expected by 2030"
        />
      </div>
    </div>
  </section>
);