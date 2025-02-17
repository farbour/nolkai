import { DataTable, ReportSection } from '../components/ReportSection';

// file path: src/pages/ecommerce.tsx
import React from 'react';

const ecommerceData = {
  conversion_rate: {
    overview:
      'Global ecommerce conversion rates typically range from ~2% to 3%, though recent data (2023-2024) indicates a slight decline compared to previous years.',
    by_industry: [
      ['Industry', 'Conversion Rate'],
      ['Food & Grocery', '3-4%'],
      ['Fashion & Apparel', '1-2%'],
      ['Luxury Fashion', '0.9%'],
      ['Health & Beauty', '1.8%'],
      ['Pet Care', '2.2-2.5%'],
      ['Home & Furniture', '1-1.2%'],
      ['Electronics', '1-2%'],
      ['Arts & Crafts', 'Up to ~5%']
    ],
    by_region: [
      ['Region', 'Conversion Rate'],
      ['North America', '3.5%'],
      ['Europe', '3-4%'],
      ['Asia-Pacific', '2.5-2.8%']
    ]
  },
  aov: {
    by_industry: [
      ['Industry', 'Average Order Value'],
      ['Luxury & Jewelry', '$436'],
      ['Home & Furniture', '$253'],
      ['Consumer Goods', '$211'],
      ['Fashion & Apparel', '$196'],
      ['Food & Beverage', '$114'],
      ['Beauty & Personal Care', '$71']
    ]
  },
  market_insights: {
    overview: 'The global ecommerce market continues to show robust growth, with significant shifts in consumer behavior and technological adoption.',
    market_size: [
      ['Year', 'Market Size', 'Growth'],
      ['2023', '$6.3T', '+10%'],
      ['2024', '$6.9T', '+9.5%'],
      ['2025 (Projected)', '$7.5T', '+8.7%']
    ],
    key_trends: [
      ['Trend', 'Impact'],
      ['Mobile Commerce', 'Now accounts for 72.9% of ecommerce sales'],
      ['Social Commerce', 'Expected to reach $1.2T by 2025'],
      ['Buy Now, Pay Later', 'Growing at 39% CAGR'],
      ['Sustainable Shopping', 'Over 60% consumers prefer eco-friendly brands']
    ],
    regional_growth: [
      ['Region', 'YoY Growth', 'Market Share'],
      ['Asia-Pacific', '+14.2%', '42%'],
      ['North America', '+8.3%', '28%'],
      ['Europe', '+7.9%', '22%'],
      ['Rest of World', '+11.6%', '8%']
    ]
  }
};

const EcommerceReport: React.FC = () => {
  return (
    <div className="p-12">
      <h1 className="text-4xl font-extrabold text-nolk-green mb-12">Ecommerce Performance Report 2024</h1>
      
      <ReportSection title="Market Insights">
        <p className="mb-6 text-gray-700">{ecommerceData.market_insights.overview}</p>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Global Market Size & Growth</h3>
        <DataTable 
          headers={ecommerceData.market_insights.market_size[0]} 
          data={ecommerceData.market_insights.market_size.slice(1)} 
        />
        
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Regional Growth & Market Share</h3>
          <DataTable 
            headers={ecommerceData.market_insights.regional_growth[0]} 
            data={ecommerceData.market_insights.regional_growth.slice(1)} 
          />
        </div>
        
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Market Trends</h3>
          <DataTable 
            headers={ecommerceData.market_insights.key_trends[0]} 
            data={ecommerceData.market_insights.key_trends.slice(1)} 
          />
        </div>
      </ReportSection>

      <ReportSection title="Conversion Rates">
        <p className="mb-6 text-gray-700">{ecommerceData.conversion_rate.overview}</p>
        <DataTable headers={ecommerceData.conversion_rate.by_industry[0]} data={ecommerceData.conversion_rate.by_industry.slice(1)} />
        <div className="mt-8">
          <DataTable headers={ecommerceData.conversion_rate.by_region[0]} data={ecommerceData.conversion_rate.by_region.slice(1)} />
        </div>
      </ReportSection>

      <ReportSection title="Average Order Value (AOV)">
        <DataTable headers={ecommerceData.aov.by_industry[0]} data={ecommerceData.aov.by_industry.slice(1)} />
      </ReportSection>
    </div>
  );
};

export default EcommerceReport;