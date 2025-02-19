import { AnalysisProgress } from '@/lib/services/brandAnalysis';
import { BrandDialog } from '@/components/brands/BrandDialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useBrand } from '@/context/BrandContext';
import { useState } from 'react';

export default function BrandsPage() {
  const { availableBrands, deleteBrand, analyzeBrand, isAnalyzing, getBrandInfo, getBrandError, brandsInfo } = useBrand();
  const [editingBrand, setEditingBrand] = useState<string | null>(null);
  const [isAddingBrand, setIsAddingBrand] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState<AnalysisProgress | null>(null);

  const handleCloseDialog = () => {
    setEditingBrand(null);
    setIsAddingBrand(false);
    setSelectedBrand(null);
    setAnalysisProgress(null);
  };

  const handleAnalyze = async (brand: string) => {
    try {
      setSelectedBrand(brand);
      await analyzeBrand(brand, (progress) => {
        setAnalysisProgress(progress);
      });
    } catch (error) {
      console.error('Failed to analyze brand:', error);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Brands</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your brands and analyze their online presence, positioning, and market information.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button
            onClick={() => setIsAddingBrand(true)}
            className="bg-green-600 hover:bg-green-500"
          >
            <span className="text-lg mr-1">+</span>
            Add brand
          </Button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Brand Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Analysis Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Last Updated
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {availableBrands.map((brandName) => {
                    const brand = brandsInfo[brandName];
                    const analyzing = isAnalyzing(brandName);
                    const info = getBrandInfo(brandName);
                    const error = getBrandError(brandName);
                    
                    return (
                      <tr key={brand.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {brand.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {analyzing ? (
                            <span className="text-blue-600">Analyzing...</span>
                          ) : error ? (
                            <span className="text-red-600">Error: {error}</span>
                          ) : info ? (
                            <span className="text-green-600">
                              Analysis complete
                            </span>
                          ) : (
                            <span className="text-gray-400">Not analyzed</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(brand.updatedAt).toLocaleString()}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end space-x-2">
                            <Link
                              href={`/brands/${brand.slug}`}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="View brand details"
                            >
                              <span>View</span>
                            </Link>
                            <button
                              onClick={() => handleAnalyze(brand.name)}
                              disabled={analyzing}
                              className={`text-blue-600 hover:text-blue-900 ${analyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
                              title="Analyze brand"
                            >
                              <span>Analyze</span>
                            </button>
                            <button
                              onClick={() => setEditingBrand(brand.name)}
                              className="text-green-600 hover:text-green-900"
                              title="Edit brand"
                            >
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => deleteBrand(brand.name)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete brand"
                            >
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <BrandDialog
        isOpen={isAddingBrand || editingBrand !== null || selectedBrand !== null}
        onClose={handleCloseDialog}
        editingBrand={editingBrand || undefined}
        selectedBrand={selectedBrand || undefined}
        analysisProgress={analysisProgress}
      />
    </div>
  );
}