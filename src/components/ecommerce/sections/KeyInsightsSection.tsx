import { InsightCard } from '../cards/InsightCard';
import { NOLK_COLORS } from '@/constants/colors';
// file path: src/components/ecommerce/sections/KeyInsightsSection.tsx
import React from 'react';
import { motion } from 'framer-motion';

export const KeyInsightsSection: React.FC = () => (
  <section className="px-8 md:px-16 py-24">
    <div className="max-w-7xl mx-auto">
      <motion.h2 
        className="text-[2.5rem] font-light leading-tight mb-16"
        style={{ color: NOLK_COLORS.primary }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Key Market Insights
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-8">
        <InsightCard
          title="Cross-Border Commerce"
          description="Global cross-border online sales reached $1.98T in 2024 (20% of e-commerce) and are expected to hit $5T+ by 2028, growing at 25%+ CAGR."
        />
        <InsightCard
          title="Sustainability Impact"
          description="78% of consumers prioritize sustainability in brand choices. 75% of sustainable goods perform better online than in-store, driving eco-friendly practices."
        />
        <InsightCard
          title="AI & Personalization"
          description="80% of marketers now rely on AI for personalization. The AI in e-commerce market is projected to reach $16B+ by 2030."
        />
      </div>
    </div>
  </section>
);