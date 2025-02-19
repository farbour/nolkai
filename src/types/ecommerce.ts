// file path: src/types/ecommerce.ts

export interface ChartDataPoint {
  [key: string]: string | number;
}

export interface MarketGrowthData extends Record<string, string | number> {
  year: string;
  value: number;
}

export interface ConversionData extends Record<string, string | number> {
  value: number;
}

export interface IndustryConversionData extends ConversionData {
  industry: string;
}

export interface ChannelConversionData extends ConversionData {
  channel: string;
}

export interface AOVData extends Record<string, string | number> {
  value: number;
}

export interface IndustryAOVData extends AOVData {
  industry: string;
}

export interface RegionAOVData extends AOVData {
  region: string;
}

export interface MarketShareData extends Record<string, string | number> {
  id: string;
  value: number;
}

export interface TrendData extends Record<string, string | number> {
  technology: string;
  value: number;
  unit: string;
  growth: string;
}

export interface AutomationData extends Record<string, string | number> {
  metric: string;
  target: number;
  current: number;
}

export interface PurchaseDriverData extends Record<string, string | number> {
  driver: string;
  value: number;
}

export type ValueFormatter = (value: number) => string;