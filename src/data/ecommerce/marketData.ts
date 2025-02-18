// file path: src/data/ecommerce/marketData.ts
import {
  AutomationData,
  ChannelConversionData,
  IndustryAOVData,
  IndustryConversionData,
  MarketGrowthData,
  MarketShareData,
  PurchaseDriverData,
  RegionAOVData,
  TrendData
} from '@/types/ecommerce';

// Market Growth Data
export const marketGrowthData: MarketGrowthData[] = [
  { year: '2019', value: 3.35 },
  { year: '2020', value: 4.28 },
  { year: '2021', value: 4.94 },
  { year: '2022', value: 5.70 },
  { year: '2023', value: 6.31 },
  { year: '2025', value: 7.00 },
  { year: '2027', value: 7.95 },
  { year: '2030', value: 20.00 }
];

// Conversion Rate Data
export const conversionByIndustryData: IndustryConversionData[] = [
  { industry: 'Personal Care', value: 6.8 },
  { industry: 'Food & Beverage', value: 4.9 },
  { industry: 'Electronics', value: 3.6 },
  { industry: 'Pet Care', value: 2.3 },
  { industry: 'Fashion', value: 1.9 },
  { industry: 'Home & Furniture', value: 1.4 }
].sort((a, b) => b.value - a.value);

export const conversionByChannelData: ChannelConversionData[] = [
  { channel: 'Email Marketing', value: 10.3 },
  { channel: 'Direct Traffic', value: 4.0 },
  { channel: 'Organic Search', value: 3.0 },
  { channel: 'Paid Search', value: 2.5 },
  { channel: 'Social Media', value: 1.5 }
].sort((a, b) => b.value - a.value);

// Average Order Value Data
export const aovByIndustryData: IndustryAOVData[] = [
  { industry: 'Luxury & Jewelry', value: 320 },
  { industry: 'Home & Furniture', value: 241 },
  { industry: 'Electronics', value: 225 },
  { industry: 'Fashion & Apparel', value: 100 },
  { industry: 'Grocery/FMCG', value: 80 },
  { industry: 'Health & Beauty', value: 70 }
].sort((a, b) => b.value - a.value);

export const aovByRegionData: RegionAOVData[] = [
  { region: 'Americas', value: 224 },
  { region: 'Asia Pacific', value: 157 },
  { region: 'EMEA', value: 112 }
].sort((a, b) => b.value - a.value);

// Regional Market Share Data
export const regionalMarketShareData: MarketShareData[] = [
  { id: 'Asia Pacific', value: 60 },
  { id: 'North America', value: 20 },
  { id: 'Europe', value: 15 },
  { id: 'Latin America', value: 3 },
  { id: 'Others', value: 2 }
].sort((a, b) => b.value - a.value);

// Future Trends Data
export const futureTrendsData: TrendData[] = [
  { technology: 'AI & Personalization', value: 16, unit: 'B', growth: '80% adoption' },
  { technology: 'Cross-Border Commerce', value: 5000, unit: 'B', growth: '25% CAGR' },
  { technology: 'Voice Commerce', value: 80, unit: 'B', growth: '25% CAGR' },
  { technology: 'Blockchain in Retail', value: 2.2, unit: 'B', growth: '40% CAGR' }
];

// Supply Chain Stats
export const warehouseAutomationData: AutomationData[] = [
  { metric: 'Warehouses with Automation', target: 75, current: 55 },
  { metric: 'Labor Cost Reduction', target: 60, current: 45 },
  { metric: 'Picking Accuracy', target: 99, current: 92 },
  { metric: 'Same-Day Delivery Adoption', target: 70, current: 51 }
];

// Consumer Behavior Data
export const purchaseDriversData: PurchaseDriverData[] = [
  { driver: 'Free Delivery', value: 50.6 },
  { driver: 'Discounts & Coupons', value: 39.3 },
  { driver: 'Easy Returns', value: 33.0 },
  { driver: 'Customer Reviews', value: 30.5 },
  { driver: 'Simple Checkout', value: 30.0 }
].sort((a, b) => b.value - a.value);