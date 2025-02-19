import { AnalysisProgress } from '@/lib/services/brand';
// file path: src/pages/brands/index.tsx
import { BrandDialog } from '@/components/brands/dialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useBrand } from '@/context/BrandContext';
import { useState } from 'react';

export default function BrandsPage() {
  const {
    availableBrands,
    deleteBrand,
    analyzeBrand,
    isAnalyzing,
    getBrandInfo,
    getBrandError,
    brandsInfo
  } = useBrand();

  const [editingBrand, setEditingBrand] = useState<string | null>(null);
  const [isAddingBrand, setIsAddingBrand] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState<AnalysisProgress | null>(null);
  const [deletingBrand, setDeletingBrand] = useState<string | null>(null);

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

  const handleDelete = async (brand: string) => {
    if (window.confirm(`Are you sure you want to delete ${brand}?`)) {
      try {
        setDeletingBrand(brand);
        await deleteBrand(brand);
      } catch (error) {
        console.error('Failed to delete brand:', error);
      } finally {
        setDeletingBrand(null);
      }
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
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
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
                    const isDeleting = deletingBrand === brandName;
                    
                    return (
                      <tr key={brand.id} className={isDeleting ? 'opacity-50' : ''}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {brand.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            analyzing ? 'bg-blue-100 text-blue-800' :
                            error ? 'bg-red-100 text-red-800' :
                            info ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {analyzing ? 'Analyzing...' :
                             error ? 'Error' :
                             info ? 'Complete' :
                             'Not analyzed'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(brand.updatedAt).toLocaleString()}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end space-x-2">
                            <Link
                              href={`/brands/${brand.slug}`}
                              className="inline-flex items-center px-2.5 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-900"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View
                            </Link>
                            <button
                              onClick={() => handleAnalyze(brand.name)}
                              disabled={analyzing || isDeleting}
                              className={`inline-flex items-center px-2.5 py-1.5 text-sm font-medium ${
                                analyzing ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-900'
                              }`}
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Analyze
                            </button>
                            <button
                              onClick={() => setEditingBrand(brand.name)}
                              disabled={isDeleting}
                              className="inline-flex items-center px-2.5 py-1.5 text-sm font-medium text-green-600 hover:text-green-900"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(brand.name)}
                              disabled={isDeleting}
                              className="inline-flex items-center px-2.5 py-1.5 text-sm font-medium text-red-600 hover:text-red-900"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
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