import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from 'react';

import { AnalysisProgress } from './AnalysisProgress';
import { BrandInfo } from './BrandInfo';
import { Button } from '@/components/ui/button';
import { AnalysisProgress as ProgressType } from '@/lib/services/brandAnalysis';
import { useBrand } from '@/context/BrandContext';

interface BrandDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingBrand?: string;
  selectedBrand?: string;
  analysisProgress?: ProgressType | null;
}

export function BrandDialog({ 
  isOpen, 
  onClose, 
  editingBrand,
  selectedBrand,
  analysisProgress 
}: BrandDialogProps) {
  const [brandName, setBrandName] = useState(editingBrand || selectedBrand || '');
  
  const {
    addBrand,
    updateBrand,
    availableBrands,
    analyzeBrand,
    cancelAnalysis,
    isAnalyzing,
    getBrandInfo,
    getBrandError
  } = useBrand();

  useEffect(() => {
    setBrandName(editingBrand || selectedBrand || '');
  }, [editingBrand, selectedBrand]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = brandName.trim();
    
    if (trimmedName && !availableBrands.includes(trimmedName)) {
      if (editingBrand) {
        updateBrand(editingBrand, trimmedName);
      } else {
        addBrand(trimmedName);
      }
      onClose();
    }
  };

  const handleAnalyze = async () => {
    if (brandName) {
      try {
        await analyzeBrand(brandName);
      } catch (error) {
        console.error('Failed to analyze brand:', error);
      }
    }
  };

  const handleCancel = () => {
    cancelAnalysis();
  };

  const brandInfo = brandName ? getBrandInfo(brandName) : undefined;
  const error = brandName ? getBrandError(brandName) : undefined;
  const analyzing = brandName ? isAnalyzing(brandName) : false;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingBrand ? 'Edit Brand' : selectedBrand ? 'Brand Analysis' : 'Add New Brand'}
          </DialogTitle>
        </DialogHeader>
        
        {!selectedBrand ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="brandName"
                className="block text-sm font-medium text-gray-700"
              >
                Brand Name
              </label>
              <input
                type="text"
                id="brandName"
                name="brandName"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                placeholder="Enter brand name"
                required
              />
            </div>

            {error && !analysisProgress && (
              <div className="text-red-500 text-sm">
                Error analyzing brand: {error}
              </div>
            )}

            <DialogFooter className="space-x-2">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
              >
                {editingBrand ? 'Save Changes' : 'Add Brand'}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4">
            {analyzing && analysisProgress && (
              <AnalysisProgress 
                progress={analysisProgress}
                onCancel={handleCancel}
              />
            )}

            {brandInfo && !analyzing && (
              <div className="space-y-4">
                <div className="text-sm text-gray-500">
                  Last updated: {new Date(brandInfo.lastUpdated).toLocaleString()}
                </div>
                <BrandInfo info={brandInfo} />
              </div>
            )}

            <DialogFooter className="space-x-2">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
              >
                Close
              </Button>
              {!analyzing && (
                <Button
                  type="button"
                  onClick={handleAnalyze}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Analyze Again
                </Button>
              )}
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}