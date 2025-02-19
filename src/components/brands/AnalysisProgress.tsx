import { AnalysisStep, AnalysisProgress as Progress } from '@/lib/services/brandAnalysis';

import { cn } from '@/lib/utils';

interface AnalysisProgressProps {
  progress: Progress;
  onCancel: () => void;
}

const STEP_LABELS: Record<AnalysisStep, string> = {
  presence: 'Finding Brand Presence',
  positioning: 'Analyzing Market Position',
  competitors: 'Researching Competitors',
  reviews: 'Analyzing Reviews',
  market: 'Gathering Market Context',
  completed: 'Analysis Complete'
};

const STEP_DESCRIPTIONS: Record<AnalysisStep, string> = {
  presence: 'Locating official website and social media profiles',
  positioning: 'Understanding brand strategy and target market',
  competitors: 'Identifying and analyzing main competitors',
  reviews: 'Analyzing customer sentiment and feedback',
  market: 'Gathering industry trends and market context',
  completed: 'All analysis steps completed'
};

const STEPS: AnalysisStep[] = ['presence', 'positioning', 'competitors', 'reviews', 'market', 'completed'];

export function AnalysisProgress({ progress, onCancel }: AnalysisProgressProps) {
  const { currentStep, completedSteps, error } = progress;
  
  return (
    <div className="mt-4 space-y-6">
      <div className="relative">
        {/* Progress bar background */}
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="h-0.5 w-full bg-gray-200" />
        </div>
        
        {/* Progress bar filled */}
        <div 
          className="absolute inset-0 flex items-center" 
          aria-hidden="true"
          style={{
            width: `${(completedSteps.length / (STEPS.length - 1)) * 100}%`,
            transition: 'width 0.5s ease-in-out'
          }}
        >
          <div className="h-0.5 w-full bg-blue-600" />
        </div>

        {/* Step indicators */}
        <div className="relative flex justify-between">
          {STEPS.filter(step => step !== 'completed').map((step, index) => {
            const isActive = step === currentStep;
            const isCompleted = completedSteps.includes(step);
            
            return (
              <div key={step} className="flex flex-col items-center">
                <div className="flex h-8 items-center" aria-hidden="true">
                  <div
                    className={cn(
                      'h-8 w-8 rounded-full flex items-center justify-center',
                      isCompleted ? 'bg-blue-600' :
                      isActive ? 'bg-blue-200' :
                      error && index === completedSteps.length ? 'bg-red-600' :
                      'bg-gray-200'
                    )}
                  >
                    {isCompleted ? (
                      <span className="text-white text-sm">✓</span>
                    ) : error && index === completedSteps.length ? (
                      <span className="text-white text-sm">×</span>
                    ) : (
                      <span className={cn(
                        'text-sm',
                        isActive ? 'text-blue-600' : 'text-gray-400'
                      )}>
                        {index + 1}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-2 min-w-[120px] text-center">
                  <p className={cn(
                    'text-sm font-medium',
                    isCompleted ? 'text-blue-600' :
                    isActive ? 'text-blue-600' :
                    error && index === completedSteps.length ? 'text-red-600' :
                    'text-gray-500'
                  )}>
                    {STEP_LABELS[step]}
                  </p>
                  {isActive && (
                    <p className="mt-1 text-xs text-gray-500">
                      {STEP_DESCRIPTIONS[step]}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {error ? (
        <div className="mt-4 bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Analysis Error
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Cancel Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : currentStep !== 'completed' && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel Analysis
          </button>
        </div>
      )}
    </div>
  );
}