import { ConversionRatesSection } from '@/components/ecommerce/sections/ConversionRatesSection';
import { FutureOutlookSection } from '@/components/ecommerce/sections/FutureOutlookSection';
import { FutureTrendsSection } from '@/components/ecommerce/sections/FutureTrendsSection';
import { HeroSection } from '@/components/ecommerce/sections/HeroSection';
import { KeyInsightsSection } from '@/components/ecommerce/sections/KeyInsightsSection';
import { MarketGrowthSection } from '@/components/ecommerce/sections/MarketGrowthSection';
// file path: src/pages/ecommerce.tsx
import React from 'react';

const EcommerceReport: React.FC = () => (
  <div className="min-h-screen bg-[#FDF8F4]">
    <HeroSection />
    <MarketGrowthSection />
    <ConversionRatesSection />
    <FutureTrendsSection />
    <KeyInsightsSection />
    <FutureOutlookSection />
  </div>
);

export default EcommerceReport;
