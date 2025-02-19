import {
  aovByIndustryData,
  aovByRegionData,
  conversionByChannelData,
  conversionByIndustryData,
  marketGrowthData,
} from '@/data/ecommerce/marketData';

import { ChartBar } from '../charts/ChartBar';
import { ChartCard } from '../cards/ChartCard';
import { ChartLine } from '../charts/ChartLine';
import { ChartPie } from '../charts/ChartPie';
import { NOLK_COLORS } from '@/constants/colors';
// file path: src/components/ecommerce/sections/ConversionRatesSection.tsx
import React from 'react';
import { formatters } from '@/utils/ecommerce/formatters';
import { motion } from 'framer-motion';

// Transform market growth data to use period instead of year
const transformedMarketData = marketGrowthData.map(item => ({
  period: item.year,
  growth: item.value
}));

export const ConversionRatesSection: React.FC = () => (
  <section className="px-8 md:px-16 py-24 bg-gray-50">
    <div className="max-w-7xl mx-auto">
      <motion.h2 
        className="text-[2.5rem] font-light leading-tight mb-16 text-center"
        style={{ color: NOLK_COLORS.primary }}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Ecommerce Analytics Dashboard
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
            <ChartBar
              data={conversionByIndustryData}
              indexBy="industry"
              keys={['value']}
              valueFormat={formatters.percentage}
              height={350}
            />
          </ChartCard>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <ChartCard
            title="Channel Distribution"
            subtitle="Conversion rates across marketing channels"
          >
            <ChartPie
              data={conversionByChannelData}
              valueKey="value"
              labelKey="channel"
              valueFormat={formatters.percentage}
              height={350}
            />
          </ChartCard>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-1 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <ChartCard
            title="Market Growth Trends"
            subtitle="Historical growth patterns and projections"
          >
            <ChartLine
              data={transformedMarketData}
              xKey="period"
              yKey="growth"
              valueFormat={formatters.percentage}
              height={400}
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
            <ChartBar
              data={aovByIndustryData}
              indexBy="industry"
              keys={['value']}
              valueFormat={formatters.currency}
              height={350}
            />
          </ChartCard>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <ChartCard
            title="Regional Performance"
            subtitle="Average order values by region"
          >
            <ChartPie
              data={aovByRegionData}
              valueKey="value"
              labelKey="region"
              valueFormat={formatters.currency}
              height={350}
            />
          </ChartCard>
        </motion.div>
      </div>
    </div>
  </section>
);

export default ConversionRatesSection;