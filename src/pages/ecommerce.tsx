// file path: src/pages/ecommerce.tsx
import React from 'react';

const EcommerceReport: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FDF8F4]">
      {/* Hero Section */}
      <section className="px-6 md:px-12 pt-20 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-[2.5rem] md:text-[3.5rem] font-medium text-[#344C45] leading-tight mb-8">
                Our collective of brands celebrate the beauty
              </h1>
            </div>
            <div>
              <h2 className="text-[2.5rem] md:text-[3.5rem] font-medium text-[#344C45] leading-tight mb-8">
                of long-loved objects.
              </h2>
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-[#344C45] text-white rounded-full hover:bg-[#2a3e39] transition-colors">
                  Explore our brands
                </button>
                <button className="px-6 py-3 border border-[#344C45] text-[#344C45] rounded-full hover:bg-[#344C45] hover:text-white transition-colors">
                  Join our collective
                </button>
              </div>
            </div>
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

      {/* Mission Section */}
      <section className="px-6 md:px-12 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-lg text-[#344C45] mb-4">Through our family of purpose-driven brands, we offer</p>
            <h3 className="text-3xl font-medium text-[#344C45] mb-4">thoughtful, durable products that elevate the everyday</h3>
            <p className="text-lg text-[#344C45] mb-8">and consider the impact on tomorrow.</p>
            <button className="px-6 py-3 bg-[#344C45] text-white rounded-full hover:bg-[#2a3e39] transition-colors">
              Explore our brands
            </button>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-6 md:px-12 py-16 bg-[#344C45] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-medium mb-4">Collective Impact,</h2>
            <h3 className="text-3xl font-medium mb-4">Lasting Change</h3>
            <p className="text-lg">By uniting around shared values,<br />we&apos;re able to drive meaningful progress.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#FDF8F4] rounded-2xl p-8 text-[#344C45]">
              <h4 className="text-xl font-medium mb-4">Intentional production</h4>
              <p>We strive to make a conscious choice to limit what we take from the Earth and source recycled or renewable materials.</p>
            </div>
            <div className="bg-[#FDF8F4] rounded-2xl p-8 text-[#344C45]">
              <h4 className="text-xl font-medium mb-4">Long-lasting products worth caring for</h4>
              <p>We believe in well thought out products that are worth repairing and deserve repeating.</p>
            </div>
            <div className="bg-[#FDF8F4] rounded-2xl p-8 text-[#344C45]">
              <h4 className="text-xl font-medium mb-4">Positive impact</h4>
              <p>As a certified B-Corp, we meet stringent standards of social and environmental performance, transparency, and accountability.</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button className="px-6 py-3 border border-white text-white rounded-full hover:bg-white hover:text-[#344C45] transition-colors">
              Learn more about our values
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EcommerceReport;
