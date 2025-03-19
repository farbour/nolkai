import { BrandDataItem, brands, filterDataByBrand } from '../config/brands';

interface MetricItem {
  name: string;
  value: number;
  unit: string;
  month: string;
  year: string | number;
}

interface GroupedMetrics {
  [key: string]: MetricItem[];
}

interface BrandMetrics {
  percentageMetrics: MetricItem[];
  currencyMetrics: MetricItem[];
  numberMetrics: MetricItem[];
}

export function getBrandData(data: BrandDataItem[], brand: string): BrandDataItem[] {
  // If no brand is specified, return all data
  if (!brand || !brands.includes(brand)) {
    return data;
  }
  
  return filterDataByBrand(data, brand);
}

export function getBrandMetrics(data: BrandDataItem[], brand: string): BrandMetrics {
  const brandData = getBrandData(data, brand);
  
  // Group metrics by type
  const metrics = brandData.reduce((acc: GroupedMetrics, item: BrandDataItem) => {
    const type = item['KPI Unit'];
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push({
      name: item['KPI Name'],
      value: item['This Period Value'],
      unit: type,
      month: item['Month of Date'],
      year: item['Year of Date']
    });
    return acc;
  }, {});

  return {
    percentageMetrics: metrics['%'] || [],
    currencyMetrics: metrics['$'] || [],
    numberMetrics: metrics['Number'] || []
  };
}

export function getLatestBrandData(data: BrandDataItem[], brand: string): BrandDataItem[] {
  const brandData = getBrandData(data, brand);
  
  // Get the latest date
  const latestDate = brandData.reduce((latest: { month: string, year: string | number } | null, item: BrandDataItem) => {
    if (!latest) {
      return { month: item['Month of Date'], year: item['Year of Date'] };
    }
    if (item['Year of Date'] > latest.year || 
        (item['Year of Date'] === latest.year && item['Month of Date'] > latest.month)) {
      return { month: item['Month of Date'], year: item['Year of Date'] };
    }
    return latest;
  }, null);

  if (!latestDate) return [];

  // Filter data for the latest date
  return brandData.filter(item => 
    item['Month of Date'] === latestDate.month && 
    item['Year of Date'] === latestDate.year
  );
}