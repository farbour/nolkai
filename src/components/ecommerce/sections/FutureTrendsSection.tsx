import { Card, Title } from '@tremor/react';
import { futureTrendsData, warehouseAutomationData } from '@/data/ecommerce/marketData';

import { NOLK_COLORS } from '@/constants/colors';
import { ProgressMetric } from '../metrics/ProgressMetric';
// file path: src/components/ecommerce/sections/FutureTrendsSection.tsx
import React from 'react';
import { TrendCard } from '../cards/TrendCard';
import { motion } from 'framer-motion';

export const FutureTrendsSection: React.FC = () => (
  <section className="px-8 md:px-16 py-24 bg-white">
    <div className="max-w-7xl mx-auto">
      <motion.h2 
        className="text-[2.5rem] font-light leading-tight mb-16"
        style={{ color: NOLK_COLORS.primary }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Future of E-commerce
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Card className="h-[500px]">
            <Title 
              className="text-xl font-medium mb-8"
              style={{ color: NOLK_COLORS.primary }}
            >
              Emerging Technologies
            </Title>
            <div className="grid grid-cols-2 gap-6">
              {futureTrendsData.map((trend, index) => (
                <TrendCard
                  key={index}
                  title={trend.technology}
                  value={trend.value}
                  unit={trend.unit}
                  growth={trend.growth}
                />
              ))}
            </div>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Card className="h-[500px]">
            <Title 
              className="text-xl font-medium mb-8"
              style={{ color: NOLK_COLORS.primary }}
            >
              Supply Chain Automation
            </Title>
            <div className="p-4">
              {warehouseAutomationData.map((metric, index) => (
                <ProgressMetric
                  key={index}
                  metric={metric.metric}
                  current={metric.current}
                  target={metric.target}
                />
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  </section>
);