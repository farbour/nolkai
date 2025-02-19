// file path: src/components/brands/dialog/BrandDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { AnalysisProgress } from './AnalysisProgress';
import { BrandForm } from './BrandForm';
import { BrandInfoView } from './BrandInfoView';
import { AnalysisProgress as ProgressType } from '@/lib/services/brand';
import { useBrand } from '@/context/BrandContext';
import { useCallback } from 'react';

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
  const {
    addBrand,
    updateBrand,
    analyzeBrand,
    cancelAnalysis,
    isAnalyzing,
    getBrandInfo,
    getBrandError
  } = useBrand();

  const handleSubmit = useCallback(async (data: { name: string }) => {
    try {
      if (editingBrand) {
        await updateBrand(editingBrand, data.name);
      } else {
        await addBrand(data.name);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save brand:', error);
    }
  }, [editingBrand, updateBrand, addBrand, onClose]);

  const handleAnalyze = useCallback(async () => {
    if (selectedBrand) {
      try {
        await analyzeBrand(selectedBrand);
      } catch (error) {
        console.error('Failed to analyze brand:', error);
      }
    }
  }, [selectedBrand, analyzeBrand]);

  const handleCancel = useCallback(() => {
    cancelAnalysis();
  }, [cancelAnalysis]);

  // Get brand info and status
  const brandInfo = selectedBrand ? getBrandInfo(selectedBrand) : undefined;
  const error = selectedBrand ? getBrandError(selectedBrand) : undefined;
  const analyzing = selectedBrand ? isAnalyzing(selectedBrand) : false;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingBrand ? 'Edit Brand' : selectedBrand ? 'Brand Analysis' : 'Add New Brand'}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {!selectedBrand ? (
            // Add/Edit Brand Form
            <BrandForm
              initialValues={editingBrand ? { name: editingBrand } : undefined}
              onSubmit={handleSubmit}
              onCancel={onClose}
              isSubmitting={false}
            />
          ) : (
            <div className="space-y-6">
              {/* Analysis Progress */}
              {analyzing && analysisProgress && (
                <AnalysisProgress
                  progress={analysisProgress}
                  onCancel={handleCancel}
                />
              )}

              {/* Error Message */}
              {error && !analysisProgress && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Error analyzing brand
                      </h3>
                      <p className="mt-1 text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Brand Info */}
              {brandInfo && !analyzing && (
                <BrandInfoView info={brandInfo} />
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Close
                </button>
                {!analyzing && (
                  <button
                    type="button"
                    onClick={handleAnalyze}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Analyze Again
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}