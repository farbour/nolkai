import { ChartCard } from '../cards/ChartCard';
import { HorizontalBarChart } from '../charts/HorizontalBarChart';
import { InsightCard } from '../cards/InsightCard';
// file path: src/components/ecommerce/sections/AdvertisingInsightsSection.tsx
import React from 'react';
import { StatCard } from '../cards/StatCard';
import { TrendCard } from '../cards/TrendCard';
import { ValueFormatter } from '@/types/ecommerce';

export const AdvertisingInsightsSection: React.FC = () => {
  const formatBillions: ValueFormatter = (value: number) => 
    `$${value}B`;

  const platformData = [
    { platform: 'Meta', spend: 200 },
    { platform: 'Google Ads', spend: 150 },
    { platform: 'TikTok', spend: 20 },
    { platform: 'Amazon Ads', spend: 12 },
    { platform: 'Others', spend: 138 }
  ];

  const regionData = [
    { region: 'North America', spend: 220 },
    { region: 'Europe', spend: 150 },
    { region: 'Asia Pacific', spend: 110 },
    { region: 'Latin America', spend: 30 },
    { region: 'MEA', spend: 10 }
  ];

  const performanceMetrics = [
    { 
      platform: 'Meta',
      value: 0.97,
      unit: '/click',
      growth: 'CTR: 0.90%'
    },
    {
      platform: 'Google Ads',
      value: 2.69,
      unit: '/click',
      growth: 'CTR: 3.17%'
    },
    {
      platform: 'TikTok',
      value: 1.20,
      unit: '/click',
      growth: 'CTR: 1.5%'
    },
    {
      platform: 'Amazon Ads',
      value: 0.81,
      unit: '/click',
      growth: 'CTR: 0.75%'
    }
  ];

  return (
    <section className="px-4 py-8 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">
          Advertising & Customer Acquisition
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Global Digital Ad Spend"
            value={520}
            suffix="B"
            prefix="$"
            subtitle="Total digital advertising spend in 2023"
          />
          <StatCard
            title="Average Global CAC"
            value={45}
            suffix=""
            prefix="$"
            subtitle="Customer Acquisition Cost across all sectors"
          />
          <StatCard
            title="B2C SMB CAC"
            value={35}
            suffix=""
            prefix="$"
            subtitle="Average CAC for small to medium B2C businesses"
          />
          <StatCard
            title="B2B Enterprise CAC"
            value={80}
            suffix=""
            prefix="$"
            subtitle="Average CAC for B2B enterprise companies"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard
            title="Ad Spend by Platform"
            subtitle="Distribution across major platforms (Billion USD)"
          >
            <HorizontalBarChart
              data={platformData}
              keys={['spend']}
              indexBy="platform"
              valueFormat={formatBillions}
            />
          </ChartCard>

          <ChartCard
            title="Regional Ad Spend"
            subtitle="Digital advertising spend by region (Billion USD)"
          >
            <HorizontalBarChart
              data={regionData}
              keys={['spend']}
              indexBy="region"
              valueFormat={formatBillions}
            />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceMetrics.map((metric) => (
            <TrendCard
              key={metric.platform}
              title={metric.platform}
              value={metric.value}
              unit={metric.unit}
              growth={metric.growth}
            />
          ))}
        </div>

        <div className="mt-8">
          <InsightCard
            title="Key Advertising Insights"
            description="Meta and Google Ads dominate the digital advertising landscape, accounting for 67% of total spend. TikTok shows rapid growth with projected spend to reach $50B by 2026. B2B customer acquisition costs are consistently higher due to longer decision cycles. Regional variations in CAC suggest opportunities for market-specific strategies."
          />
        </div>
      </div>
    </section>
  );
};