import { AnalysisStep, AnalysisProgress as ProgressType } from '@/lib/services/brand';

// file path: src/components/brands/dialog/AnalysisProgress.tsx
import { Button } from '@/components/ui/button';

interface AnalysisProgressProps {
  progress: ProgressType;
  onCancel: () => void;
}

const STEP_LABELS: Record<AnalysisStep, string> = {
  presence: 'Analyzing online presence',
  positioning: 'Analyzing market positioning',
  competitors: 'Analyzing competitors',
  reviews: 'Analyzing reviews and sentiment',
  market: 'Analyzing market context',
  completed: 'Analysis complete'
};

export function AnalysisProgress({ progress, onCancel }: AnalysisProgressProps) {
  const totalSteps = 5; // Excluding 'completed'
  const completedSteps = progress.completedSteps.length;
  const percentage = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900">
            {STEP_LABELS[progress.currentStep]}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {progress.error ? (
              <span className="text-red-600">{progress.error}</span>
            ) : (
              `Step ${completedSteps} of ${totalSteps}`
            )}
          </p>
        </div>
        <div className="ml-4">
          <Button
            onClick={onCancel}
            variant="outline"
            className="text-red-600 hover:text-red-700"
          >
            Cancel
          </Button>
        </div>
      </div>

      <div className="relative">
        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
          <div
            style={{ width: `${percentage}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"
          />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {Object.entries(STEP_LABELS).map(([step, label]) => {
          if (step === 'completed') return null;

          const isCompleted = progress.completedSteps.includes(step as AnalysisStep);
          const isCurrent = progress.currentStep === step;

          return (
            <div
              key={step}
              className={`flex items-center space-x-3 ${
                isCompleted ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <svg
                className={`h-5 w-5 ${
                  isCompleted ? 'text-green-500' : isCurrent ? 'text-blue-500' : 'text-gray-300'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isCompleted ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                )}
              </svg>
              <span className="text-sm font-medium">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}