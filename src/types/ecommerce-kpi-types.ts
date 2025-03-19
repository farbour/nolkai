/**
 * E-commerce KPI Data Types
 * TypeScript interfaces for e-commerce key performance indicators across multiple platforms
 */

// Enum for KPI units
export enum KpiUnit {
  Percentage = '%',
  Currency = '$',
  Number = 'Number'
}

// Enum for KPI categories
export enum KpiCategory {
  Advertising = 'Advertising',
  Revenue = 'Revenue',
  Profitability = 'Profitability',
  CustomerBehavior = 'Customer Behavior',
  Inventory = 'Inventory',
  Marketing = 'Marketing'
}

// Enum for months
export enum Month {
  January = 'January',
  February = 'February',
  March = 'March',
  April = 'April',
  May = 'May',
  June = 'June',
  July = 'July',
  August = 'August',
  September = 'September',
  October = 'October',
  November = 'November',
  December = 'December'
}

// Enum for platforms
export enum Platform {
  Amazon = 'Amazon',
  Shopify = 'Shopify',
  General = 'General'
}

// Interface for a brand
export interface Brand {
  id?: number;
  brandName: string;
  category?: string;
  platforms?: Platform[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for a KPI definition
export interface KpiDefinition {
  id?: number;
  kpiName: string;
  description?: string;
  unit: KpiUnit;
  category?: KpiCategory;
  formula?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for time dimension
export interface TimeDimension {
  id?: number;
  month: Month;
  year: number;
  quarter?: number;
  fullDate?: Date;
  createdAt?: Date;
}

// Interface for a single KPI data point
export interface KpiDataPoint {
  id?: number;
  brandId?: number;
  brand: string;
  kpiId?: number;
  kpiName: string;
  kpiUnit: KpiUnit;
  timeId?: number;
  month: Month;
  year: number;
  platformId?: number;
  platform: Platform;
  value: number | null;
  isEstimated?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for KPI data with year-over-year comparison
export interface KpiYearOverYearComparison {
  brand: string;
  kpiName: string;
  kpiUnit: KpiUnit;
  currentYear: number;
  previousYear: number;
  platform: Platform;
  currentValue: number;
  previousValue: number;
  growthPercentage: number;
}

// Interface for monthly KPI data by brand
export interface MonthlyKpiByBrand {
  brand: string;
  kpiName: string;
  kpiUnit: KpiUnit;
  month: Month;
  year: number;
  platform: Platform;
  value: number | null;
}

// Interface for yearly KPI averages
export interface YearlyKpiAverage {
  brand: string;
  kpiName: string;
  kpiUnit: KpiUnit;
  year: number;
  platform: Platform;
  averageValue: number;
}

// Interface for KPI data import from CSV
export interface KpiCsvImport {
  Brand: string;
  'KPI Name': string;
  'KPI Unit': string;
  'Month of Date': string;
  'Year of Date': number;
  'This Period Value': string | number | null;
}

// Interface for KPI data export to CSV
export interface KpiCsvExport {
  Brand: string;
  KPIName: string;
  KPIUnit: string;
  Month: string;
  Year: number;
  Value: string | number | null;
  Platform: string;
}

// Interface for API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

// Interface for KPI data query parameters
export interface KpiDataQueryParams {
  brands?: string[];
  kpis?: string[];
  platforms?: Platform[];
  startYear?: number;
  endYear?: number;
  startMonth?: Month;
  endMonth?: Month;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Interface for KPI data statistics
export interface KpiDataStatistics {
  totalDataPoints: number;
  uniqueBrands: number;
  uniqueKpis: number;
  yearRange: {
    min: number;
    max: number;
  };
  platformDistribution: Record<Platform, number>;
  missingValuePercentage: number;
}

// Interface for the complete e-commerce KPI dataset
export interface EcommerceKpiDataset {
  brands: Brand[];
  kpiDefinitions: KpiDefinition[];
  kpiData: KpiDataPoint[];
  statistics: KpiDataStatistics;
}