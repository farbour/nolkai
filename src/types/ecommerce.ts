// file path: src/types/ecommerce.ts

export interface MarketGrowthData {
  year: string;
  value: number;
}

export interface ConversionData {
  value: number;
}

export interface IndustryConversionData extends ConversionData {
  industry: string;
}

export interface ChannelConversionData extends ConversionData {
  channel: string;
}

export interface AOVData {
  value: number;
}

export interface IndustryAOVData extends AOVData {
  industry: string;
}

export interface RegionAOVData extends AOVData {
  region: string;
}

export interface MarketShareData {
  id: string;
  value: number;
}

export interface TrendData {
  technology: string;
  value: number;
  unit: string;
  growth: string;
}

export interface AutomationData {
  metric: string;
  target: number;
  current: number;
}

export interface PurchaseDriverData {
  driver: string;
  value: number;
}

export type ValueFormatter = (value: number) => string;