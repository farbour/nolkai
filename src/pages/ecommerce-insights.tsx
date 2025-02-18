import { CompetitiveLandscape } from '@/components/dashboard/CompetitiveLandscape';
import { ConsumerBehavior } from '@/components/dashboard/ConsumerBehavior';
import { ConversionRateInsights } from '@/components/dashboard/ConversionRateInsights';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSection } from '@/components/dashboard/DashboardSection';
import { FutureForecasts } from '@/components/dashboard/FutureForecasts';
import { MarketSizeInsights } from '@/components/dashboard/MarketSizeInsights';
import { OrderValueInsights } from '@/components/dashboard/OrderValueInsights';
import React from 'react';
import { RegionalInsights } from '@/components/dashboard/RegionalInsights';
import { SupplyChainInsights } from '@/components/dashboard/SupplyChainInsights';
import { TrendInsights } from '@/components/dashboard/TrendInsights';
// Import the data from ecom-insight.json
// This would typically be done through an API call or data service
import ecomInsights from '../../public/ecom-insight.json';

// file path: src/pages/ecommerce-insights.tsx


export default function EcommerceInsights() {
  // Transform the data for each component
  const conversionRates = {
    byIndustry: Object.entries(ecomInsights.ConversionRates.ByIndustry).map(([category, rate]) => ({
      category,
      rate: rate.match(/~?([0-9.]+)%/)?.[1] + '%',
      description: rate,
    })),
    byRegion: Object.entries(ecomInsights.ConversionRates.ByRegion).map(([category, rate]) => ({
      category,
      rate: rate.match(/~?([0-9.]+)%/)?.[1] + '%',
      description: rate,
    })),
    byDevice: Object.entries(ecomInsights.ConversionRates.ByDevice).map(([category, rate]) => ({
      category,
      rate: rate.match(/~?([0-9.]+)%/)?.[1] + '%',
      description: rate,
    })),
    byChannel: Object.entries(ecomInsights.ConversionRates.ByChannel).map(([category, rate]) => ({
      category,
      rate: rate.match(/~?([0-9.]+)%/)?.[1] + '%',
      description: rate,
    })),
  };

  const marketSize = {
    globalMarket: Object.entries(ecomInsights.MarketSizeAndGrowth.Global).map(([year, value]) => ({
      year,
      value,
    })),
    regionalBreakdown: Object.entries(ecomInsights.MarketSizeAndGrowth.RegionalBreakdown).map(([region, desc]) => ({
      region,
      description: desc,
    })),
    marketShare: Object.entries(ecomInsights.MarketSizeAndGrowth.GlobalMarketShareByRegion).map(([region, share]) => ({
      region,
      share,
    })),
    retailShare: ecomInsights.MarketSizeAndGrowth.EcommerceShareOfRetail,
  };

  const orderValue = {
    globalAverage: ecomInsights.AverageOrderValue.GlobalAverage,
    byIndustry: Object.entries(ecomInsights.AverageOrderValue.ByIndustry).map(([category, data]) => ({
      category,
      value: parseFloat(data.match(/\$([0-9.]+)/)?.[1] || '0'),
      description: data,
    })),
    byRegion: Object.entries(ecomInsights.AverageOrderValue.ByRegion).map(([category, data]) => ({
      category,
      value: parseFloat(data.match(/\$([0-9.]+)/)?.[1] || '0'),
      description: data,
    })),
    byDevice: Object.entries(ecomInsights.AverageOrderValue.ByDevice).map(([category, data]) => ({
      category,
      value: parseFloat(data.match(/\$([0-9.]+)/)?.[1] || '0'),
      description: data,
    })),
    seasonalTrends: ecomInsights.AverageOrderValue.SeasonalTrends,
    customerSegments: ecomInsights.AverageOrderValue.CustomerSegments,
  };

  const trends = {
    aiPersonalization: {
      title: 'AI Personalization',
      description: ecomInsights.KeyEcommerceTrends.AI_Personalization,
      metrics: ecomInsights.KeyEcommerceTrends.AI_Personalization.split('. '),
    },
    blockchainRetail: {
      title: 'Blockchain in Retail',
      description: ecomInsights.KeyEcommerceTrends.Blockchain_in_Retail,
      metrics: ecomInsights.KeyEcommerceTrends.Blockchain_in_Retail.split('. '),
    },
    crossBorderCommerce: {
      title: 'Cross-Border Commerce',
      description: ecomInsights.KeyEcommerceTrends.CrossBorder_Commerce,
      metrics: ecomInsights.KeyEcommerceTrends.CrossBorder_Commerce.split('. '),
    },
    sustainability: {
      title: 'Sustainability',
      description: ecomInsights.KeyEcommerceTrends.Sustainability,
      metrics: ecomInsights.KeyEcommerceTrends.Sustainability.split('. '),
    },
    newTechnologies: {
      title: 'New Technologies',
      description: ecomInsights.KeyEcommerceTrends.NewTechnologies,
      metrics: ecomInsights.KeyEcommerceTrends.NewTechnologies.split('. '),
    },
    voiceCommerce: {
      title: 'Voice Commerce',
      description: ecomInsights.KeyEcommerceTrends.VoiceCommerce,
      metrics: ecomInsights.KeyEcommerceTrends.VoiceCommerce.split('. '),
    },
    subscriptionCommerce: {
      title: 'Subscription Commerce',
      description: ecomInsights.KeyEcommerceTrends.SubscriptionCommerce,
      metrics: ecomInsights.KeyEcommerceTrends.SubscriptionCommerce.split('. '),
    },
  };

  const regionalInsights = {
    economicImpacts: ecomInsights.RegionalInsights.EconomicImpacts,
    legislativeChanges: ecomInsights.RegionalInsights.LegislativeChanges,
    emergingPlayers: ecomInsights.RegionalInsights.EmergingPlayers,
    platformsByCountry: Object.entries(ecomInsights.RegionalInsights.TopPlatformsByCountry).reduce((acc, [country, data]) => ({
      ...acc,
      [country]: data.split('. ').map(platform => ({
        name: platform.split(' - ')[0] || platform,
        description: platform.split(' - ')[1] || platform,
      })),
    }), {}),
  };

  const supplyChain = {
    warehouseAutomation: {
      description: ecomInsights.SupplyChainAndLogistics.WarehouseAutomation,
      metrics: ecomInsights.SupplyChainAndLogistics.WarehouseAutomation.split('. '),
    },
    fulfillmentInnovations: {
      description: ecomInsights.SupplyChainAndLogistics.FulfillmentInnovations,
      innovations: ecomInsights.SupplyChainAndLogistics.FulfillmentInnovations.split('. '),
    },
    lastMileDelivery: {
      description: ecomInsights.SupplyChainAndLogistics.LastMileDelivery,
      stats: ecomInsights.SupplyChainAndLogistics.LastMileDelivery.split('. '),
    },
    deliverySpeed: {
      description: ecomInsights.SupplyChainAndLogistics.DeliverySpeedStats,
      trends: ecomInsights.SupplyChainAndLogistics.DeliverySpeedStats.split('. '),
    },
    fulfillmentEfficiency: {
      description: ecomInsights.SupplyChainAndLogistics.FulfillmentEfficiency,
      improvements: ecomInsights.SupplyChainAndLogistics.FulfillmentEfficiency.split('. '),
    },
  };

  const competitiveLandscape = {
    topCompanies: Object.entries(ecomInsights.CompetitiveLandscape.TopCompanies).map(([name, data]) => ({
      name,
      description: data,
      metrics: {},
    })),
    marketShares: {
      global: Object.entries(ecomInsights.CompetitiveLandscape.MarketShares.Global).map(([region, share]) => ({
        region,
        share,
        details: share,
      })),
      regional: Object.entries(ecomInsights.CompetitiveLandscape.MarketShares.UnitedStates).map(([region, share]) => ({
        region,
        share,
        details: share,
      })),
    },
    platformComparisons: Object.entries(ecomInsights.CompetitiveLandscape.PlatformComparisons).map(([category, data]) => ({
      category,
      description: data,
      metrics: data.split('. '),
    })),
    revenueInsights: Object.entries(ecomInsights.CompetitiveLandscape.RevenueInsights).map(([company, data]) => ({
      company,
      data: data.split('. '),
    })),
    mergersTrends: ecomInsights.CompetitiveLandscape.MergersAndAcquisitions.split('. '),
  };

  const consumerBehavior = {
    purchaseDrivers: {
      title: 'Purchase Drivers',
      description: ecomInsights.ConsumerBehaviorInsights.KeyPurchaseDrivers,
      stats: ecomInsights.ConsumerBehaviorInsights.KeyPurchaseDrivers.split('. '),
    },
    psychologicalDrivers: {
      title: 'Psychological Drivers',
      description: ecomInsights.ConsumerBehaviorInsights.PsychologicalDrivers,
      stats: ecomInsights.ConsumerBehaviorInsights.PsychologicalDrivers.split('. '),
    },
    cartAbandonment: {
      title: 'Cart Abandonment',
      description: ecomInsights.ConsumerBehaviorInsights.CartAbandonmentBehavior,
      stats: ecomInsights.ConsumerBehaviorInsights.CartAbandonmentBehavior.split('. '),
    },
    spendingPatterns: {
      demographics: ecomInsights.ConsumerBehaviorInsights.SpendingPatternsDemographics.split('. '),
      spending: ecomInsights.ConsumerBehaviorInsights.SpendingPatternsDemographics.split('. '),
      gender: ecomInsights.ConsumerBehaviorInsights.SpendingPatternsDemographics.split('. '),
      location: ecomInsights.ConsumerBehaviorInsights.SpendingPatternsDemographics.split('. '),
    },
    seasonalTrends: {
      description: ecomInsights.ConsumerBehaviorInsights.SeasonalTrends,
      trends: ecomInsights.ConsumerBehaviorInsights.SeasonalTrends.split('. '),
    },
  };

  const futureForecasts = {
    forecast2025: {
      marketSize: {
        year: '2025',
        value: 7.0,
        description: ecomInsights.FutureForecasts['2025_Outlook'],
      },
      trends: ecomInsights.FutureForecasts['2025_Outlook'].split('. '),
    },
    forecast2030: {
      marketSize: {
        year: '2030',
        value: 20.0,
        description: ecomInsights.FutureForecasts['2030_Forecast'],
      },
      trends: ecomInsights.FutureForecasts['2030_Forecast'].split('. '),
    },
    beyond2030: Object.entries(ecomInsights.FutureForecasts.Beyond2030_AlternateCommerce).map(([category, data]) => ({
      category,
      description: data,
      predictions: data.split('. '),
    })),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader
          title="Global E-commerce Market Insights"
          description="Comprehensive analysis of global e-commerce trends, market size, and future forecasts"
        />

        <div className="space-y-8">
          <DashboardSection>
            <ConversionRateInsights {...conversionRates} />
          </DashboardSection>

          <DashboardSection>
            <MarketSizeInsights {...marketSize} />
          </DashboardSection>

          <DashboardSection>
            <OrderValueInsights {...orderValue} />
          </DashboardSection>

          <DashboardSection>
            <TrendInsights {...trends} />
          </DashboardSection>

          <DashboardSection>
            <RegionalInsights {...regionalInsights} />
          </DashboardSection>

          <DashboardSection>
            <SupplyChainInsights {...supplyChain} />
          </DashboardSection>

          <DashboardSection>
            <CompetitiveLandscape {...competitiveLandscape} />
          </DashboardSection>

          <DashboardSection>
            <ConsumerBehavior {...consumerBehavior} />
          </DashboardSection>

          <DashboardSection>
            <FutureForecasts {...futureForecasts} />
          </DashboardSection>
        </div>
      </div>
    </div>
  );
}