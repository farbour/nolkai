import {
  aovByIndustryData,
  aovByRegionData,
  conversionByChannelData,
  conversionByIndustryData
} from '@/data/ecommerce/marketData';

import { ChartCard } from '../cards/ChartCard';
import { HorizontalBarChart } from '../charts/HorizontalBarChart';
import { NOLK_COLORS } from '@/constants/colors';
// file path: src/components/ecommerce/sections/ConversionRatesSection.tsx
import React from 'react';
import { formatters } from '@/utils/ecommerce/formatters';
import { motion } from 'framer-motion';

export const ConversionRatesSection: React.FC = () => (
  <section className="px-8 md:px-16 py-24">
    <div className="max-w-7xl mx-auto">
      <motion.h2 
        className="text-[2.5rem] font-light leading-tight mb-16"
        style={{ color: NOLK_COLORS.primary }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Conversion Rate Analysis
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <ChartCard
            title="Conversion Rates by Industry"
            subtitle="Percentage of visits that convert to purchases"
          >
            <HorizontalBarChart
              data={conversionByIndustryData}
              keys={['value']}
              indexBy="industry"
              valueFormat={formatters.value}
            />
          </ChartCard>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <ChartCard
            title="Conversion Rates by Channel"
            subtitle="Performance across different marketing channels"
          >
            <HorizontalBarChart
              data={conversionByChannelData}
              keys={['value']}
              indexBy="channel"
              valueFormat={formatters.value}
            />
          </ChartCard>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <ChartCard
            title="Average Order Value by Industry"
            subtitle="Average transaction value across different sectors"
          >
            <HorizontalBarChart
              data={aovByIndustryData}
              keys={['value']}
              indexBy="industry"
              valueFormat={formatters.currency}
            />
          </ChartCard>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <ChartCard
            title="Average Order Value by Region"
            subtitle="Regional comparison of transaction values"
          >
            <HorizontalBarChart
              data={aovByRegionData}
              keys={['value']}
              indexBy="region"
              valueFormat={formatters.currency}
            />
          </ChartCard>
        </motion.div>
      </div>
    </div>
  </section>
);