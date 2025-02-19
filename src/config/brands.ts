export interface BrandDataItem {
  Brand: string;
  'KPI Name': string;
  'KPI Unit': string;
  'Month of Date': string;
  'Year of Date': string | number;
  'This Period Value': number;
  [key: string]: string | number; // For any additional fields
}

// List of all brands
export const brands = [
  'Alex Bottle',
  'Arctic Tumblers',
  'Corretto',
  'Ergonofis',
  'Freakmount',
  'Go Green',
  'Gravity',
  'Homesick',
  'Kana',
  'Loctote',
  'Love Your Melon',
  'MiHIGH',
  'Opposite Wall',
  'Proper Pour',
  'Qalo',
  'Rachel',
  'Revant',
  'Rose Boreal',
  'Wolf & Grizzly'
];

// Default selected brand
export const defaultBrand = 'Alex Bottle';

export const getBrandMetrics = (data: BrandDataItem[], brand: string) => {
  const brandData = data.filter(item => item.Brand === brand);
  
  const percentageMetrics = brandData
    .filter(item => item['KPI Unit'] === '%')
    .map(item => ({
      name: item['KPI Name'],
      value: item['This Period Value'],
    }));

  const currencyMetrics = brandData
    .filter(item => item['KPI Unit'] === '$')
    .map(item => ({
      name: item['KPI Name'],
      value: item['This Period Value'],
    }));

  const numberMetrics = brandData
    .filter(item => item['KPI Unit'] === 'Number')
    .map(item => ({
      name: item['KPI Name'],
      value: item['This Period Value'],
    }));

  return {
    percentageMetrics,
    currencyMetrics,
    numberMetrics,
  };
};