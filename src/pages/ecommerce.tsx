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
    overview:
      'The global ecommerce market continues to show robust growth, with significant shifts in consumer behavior and technological adoption.',
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

const Table: React.FC<{ headers: string[]; data: (string | number)[][]; className?: string }> = ({ headers, data, className = '' }) => {
  return (
    <div className={`overflow-hidden rounded-xl border border-[#344C45]/20 ${className}`}>
      <table className="min-w-full divide-y divide-[#344C45]/10">
        <thead className="bg-[#344C45]/5">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-4 text-left text-sm font-semibold text-[#344C45]"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#344C45]/10 bg-white">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-[#344C45]/5 transition-colors">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-6 py-4 text-sm text-[#344C45]"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const EcommerceReport: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FDF8F4]">
      {/* Hero Section */}
      <section className="px-6 md:px-12 pt-20 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-[2.5rem] md:text-[3.5rem] font-medium text-[#344C45] leading-tight mb-8">
                Global Ecommerce Market Insights
              </h1>
            </div>
            <div>
              <h2 className="text-[2.5rem] md:text-[3.5rem] font-medium text-[#344C45] leading-tight mb-8">
                2023-2024 Analysis
              </h2>
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-[#344C45] text-white rounded-full hover:bg-[#2a3e39] transition-colors">
                  View Full Report
                </button>
                <button className="px-6 py-3 border border-[#344C45] text-[#344C45] rounded-full hover:bg-[#344C45] hover:text-white transition-colors">
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Insights Section */}
      <section className="px-6 md:px-12 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[2rem] md:text-[2.5rem] font-medium text-[#344C45] leading-tight mb-8">
            Market Insights
          </h2>
          
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-[#344C45] text-white rounded-2xl p-8">
              <p className="text-4xl font-bold mb-2">{ecommerceData.market_insights.market_size[1][2]}</p>
              <p className="text-lg opacity-90">Growth in 2023</p>
            </div>
            <div className="bg-[#344C45] text-white rounded-2xl p-8">
              <p className="text-4xl font-bold mb-2">{ecommerceData.market_insights.market_size[1][1]}</p>
              <p className="text-lg opacity-90">Market Size 2023</p>
            </div>
            <div className="bg-[#344C45] text-white rounded-2xl p-8">
              <p className="text-4xl font-bold mb-2">{ecommerceData.conversion_rate.by_region[1][1]}</p>
              <p className="text-lg opacity-90">NA Conversion Rate</p>
            </div>
          </div>

          {/* Market Overview */}
          <div className="mb-12">
            <h3 className="text-xl font-medium text-[#344C45] mb-4">Market Overview</h3>
            <p className="text-lg text-[#344C45]/80 mb-8">{ecommerceData.market_insights.overview}</p>
            <Table
              headers={ecommerceData.market_insights.market_size[0]}
              data={ecommerceData.market_insights.market_size.slice(1)}
              className="mb-8"
            />
          </div>

          {/* Conversion Rates */}
          <div className="mb-12">
            <h3 className="text-xl font-medium text-[#344C45] mb-4">Conversion Rates by Industry</h3>
            <p className="text-lg text-[#344C45]/80 mb-8">{ecommerceData.conversion_rate.overview}</p>
            <div className="grid md:grid-cols-2 gap-8">
              <Table
                headers={ecommerceData.conversion_rate.by_industry[0]}
                data={ecommerceData.conversion_rate.by_industry.slice(1)}
              />
              <Table
                headers={ecommerceData.conversion_rate.by_region[0]}
                data={ecommerceData.conversion_rate.by_region.slice(1)}
              />
            </div>
          </div>

          {/* Average Order Value */}
          <div className="mb-12">
            <h3 className="text-xl font-medium text-[#344C45] mb-4">Average Order Value by Industry</h3>
            <Table
              headers={ecommerceData.aov.by_industry[0]}
              data={ecommerceData.aov.by_industry.slice(1)}
            />
          </div>

          {/* Key Trends */}
          <div>
            <h3 className="text-xl font-medium text-[#344C45] mb-4">Key Market Trends</h3>
            <Table
              headers={ecommerceData.market_insights.key_trends[0]}
              data={ecommerceData.market_insights.key_trends.slice(1)}
            />
          </div>
        </div>
      </section>

      {/* Image Grid Section */}
      <section className="px-6 md:px-12 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div key={index} className="aspect-square relative rounded-2xl overflow-hidden bg-[#344C45]/10">
                <div className="absolute inset-0 flex items-center justify-center text-[#344C45]">
                  Image Placeholder {index}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Projections Section */}
      <section className="px-6 md:px-12 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h3 className="text-3xl font-medium text-[#344C45] mb-4">Future Market Projections</h3>
            <p className="text-lg text-[#344C45]/80 mb-4">Based on current trends and market analysis, we project significant growth in key areas:</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-[#344C45] rounded-full"></span>
                <span className="text-lg text-[#344C45]">Mobile commerce to reach 80% of all ecommerce transactions by 2025</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-[#344C45] rounded-full"></span>
                <span className="text-lg text-[#344C45]">Social commerce expected to exceed $1.2T in value</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-[#344C45] rounded-full"></span>
                <span className="text-lg text-[#344C45]">Sustainable ecommerce practices to influence 70% of consumer decisions</span>
              </li>
            </ul>
            <button className="px-6 py-3 bg-[#344C45] text-white rounded-full hover:bg-[#2a3e39] transition-colors">
              View Detailed Projections
            </button>
          </div>
        </div>
      </section>

      {/* Key Findings Section */}
      <section className="px-6 md:px-12 py-16 bg-[#344C45] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-medium mb-4">Key Market Findings</h2>
            <h3 className="text-3xl font-medium mb-4">2023-2024 Analysis</h3>
            <p className="text-lg">Comprehensive analysis of global ecommerce trends<br />and their impact on market dynamics</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#FDF8F4] rounded-2xl p-8 text-[#344C45]">
              <h4 className="text-xl font-medium mb-4">Consumer Behavior</h4>
              <p>Significant shift towards mobile shopping, with 72.9% of transactions now occurring on mobile devices.</p>
            </div>
            <div className="bg-[#FDF8F4] rounded-2xl p-8 text-[#344C45]">
              <h4 className="text-xl font-medium mb-4">Payment Trends</h4>
              <p>Buy Now, Pay Later services showing exceptional growth at 39% CAGR, reshaping purchase decisions.</p>
            </div>
            <div className="bg-[#FDF8F4] rounded-2xl p-8 text-[#344C45]">
              <h4 className="text-xl font-medium mb-4">Market Evolution</h4>
              <p>Asia-Pacific leads growth at +14.2%, driven by mobile commerce and digital payment adoption.</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button className="px-6 py-3 border border-white text-white rounded-full hover:bg-white hover:text-[#344C45] transition-colors">
              Download Complete Analysis
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EcommerceReport;
