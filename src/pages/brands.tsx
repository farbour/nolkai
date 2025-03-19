import { PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';
// file path: src/pages/brands.tsx
import { useEffect, useState } from 'react';

import { AnalysisProgress } from '@/lib/services/brand';
import { BrandDialog } from '@/components/brands/dialog/BrandDialog';
import { Button } from '@/components/ui/button';
import { useBrand } from '@/context/BrandContext';

export default function BrandsPage() {
  const {
    availableBrands,
    brandsInfo,
    deleteBrand,
    isAnalyzing,
    getBrandInfo,
    getBrandError,
  } = useBrand();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [editingBrand, setEditingBrand] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState<AnalysisProgress | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Listen for analysis progress updates
  useEffect(() => {
    if (selectedBrand && isAnalyzing(selectedBrand)) {
      const interval = setInterval(() => {
        // This would typically fetch progress from an API
        // For now, we'll just simulate progress
        setAnalysisProgress(prev => {
          if (!prev) {
            return {
              currentStep: 'presence',
              completedSteps: []
            };
          }
          
          const steps: ('presence' | 'positioning' | 'competitors' | 'reviews' | 'market')[] = [
            'presence', 'positioning', 'competitors', 'reviews', 'market'
          ];
          
          // Handle 'completed' step or any step not in the steps array
          if (prev.currentStep === 'completed' || !steps.includes(prev.currentStep as any)) {
            return prev;
          }
          
          const currentIndex = steps.indexOf(prev.currentStep as any);
          if (currentIndex < steps.length - 1) {
            const newStep = steps[currentIndex + 1];
            return {
              currentStep: newStep,
              completedSteps: [...prev.completedSteps, prev.currentStep]
            };
          }
          
          return prev;
        });
      }, 2000);
      
      return () => clearInterval(interval);
    } else {
      setAnalysisProgress(null);
    }
  }, [selectedBrand, isAnalyzing]);

  const handleAddBrand = () => {
    setSelectedBrand(null);
    setEditingBrand(null);
    setIsDialogOpen(true);
  };

  const handleEditBrand = (brand: string) => {
    setSelectedBrand(null);
    setEditingBrand(brand);
    setIsDialogOpen(true);
  };

  const handleViewBrand = (brand: string) => {
    setSelectedBrand(brand);
    setEditingBrand(null);
    setIsDialogOpen(true);
  };

  const handleDeleteBrand = async (brand: string) => {
    if (confirmDelete === brand) {
      try {
        await deleteBrand(brand);
        setConfirmDelete(null);
      } catch (error) {
        console.error('Failed to delete brand:', error);
      }
    } else {
      setConfirmDelete(brand);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedBrand(null);
    setEditingBrand(null);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Brands</h1>
        <Button onClick={handleAddBrand} className="bg-green-600 hover:bg-green-700">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Brand
        </Button>
      </div>

      {availableBrands.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900">No brands yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            Get started by adding your first brand.
          </p>
          <div className="mt-6">
            <Button onClick={handleAddBrand} className="bg-green-600 hover:bg-green-700">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Brand
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableBrands.map(brand => {
            const brandData = brandsInfo[brand];
            const info = getBrandInfo(brand);
            const error = getBrandError(brand);
            const analyzing = isAnalyzing(brand);

            return (
              <div 
                key={brand} 
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{brand}</h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditBrand(brand)}
                        className="p-1 text-gray-500 hover:text-gray-700"
                        title="Edit brand"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBrand(brand)}
                        className={`p-1 ${
                          confirmDelete === brand 
                            ? 'text-red-600 hover:text-red-800' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                        title={confirmDelete === brand ? 'Click again to confirm' : 'Delete brand'}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {analyzing && (
                    <div className="mt-2 text-sm text-blue-600">
                      Analyzing...
                    </div>
                  )}

                  {error && !analyzing && (
                    <div className="mt-2 text-sm text-red-600">
                      Error: {error}
                    </div>
                  )}

                  <div className="mt-4">
                    {info ? (
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Website:</span>
                          <a 
                            href={info.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            {info.website}
                          </a>
                        </div>
                        
                        {info.positioning && (
                          <div className="line-clamp-2 text-sm text-gray-600">
                            {info.positioning.description}
                          </div>
                        )}
                        
                        <div className="pt-2">
                          <Button 
                            onClick={() => handleViewBrand(brand)}
                            variant="outline"
                            className="w-full"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-sm text-gray-500 mb-4">
                          No analysis data available
                        </p>
                        <Button 
                          onClick={() => handleViewBrand(brand)}
                          variant="outline"
                          className="w-full"
                        >
                          Analyze Brand
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-3 text-xs text-gray-500">
                  Created: {new Date(brandData.createdAt).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <BrandDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        editingBrand={editingBrand || undefined}
        selectedBrand={selectedBrand || undefined}
        analysisProgress={analysisProgress}
      />
    </div>
  );
}