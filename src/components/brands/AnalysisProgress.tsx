// file path: src/components/brands/AnalysisProgress.tsx
import { AnalysisStep, AnalysisProgress as Progress } from '@/lib/services/brandAnalysis';
import { AnimatePresence, motion } from 'framer-motion';

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

const LoadingDots = () => (
  <div className="flex space-x-1">
    <motion.div
      className="w-1.5 h-1.5 bg-blue-600 rounded-full"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.2 }}
    />
    <motion.div
      className="w-1.5 h-1.5 bg-blue-600 rounded-full"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.2, delay: 0.2 }}
    />
    <motion.div
      className="w-1.5 h-1.5 bg-blue-600 rounded-full"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.2, delay: 0.4 }}
    />
  </div>
);

export function AnalysisProgress({ progress, onCancel }: AnalysisProgressProps) {
  const { currentStep, completedSteps, error } = progress;
  const progressPercentage = (completedSteps.length / (STEPS.length - 1)) * 100;
  
  return (
    <div className="mt-4 space-y-6">
      <div className="relative">
        {/* Progress bar background */}
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="h-0.5 w-full bg-gray-200" />
        </div>
        
        {/* Animated progress bar */}
        <motion.div 
          className="absolute inset-0 flex items-center" 
          aria-hidden="true"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="h-0.5 w-full bg-blue-600">
            <motion.div
              className="h-full w-full bg-blue-400"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>
        </motion.div>

        {/* Step indicators */}
        <div className="relative flex justify-between">
          {STEPS.filter(step => step !== 'completed').map((step, index) => {
            const isActive = step === currentStep;
            const isCompleted = completedSteps.includes(step);
            
            return (
              <motion.div
                key={step}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex h-8 items-center" aria-hidden="true">
                  <motion.div
                    className={cn(
                      'h-8 w-8 rounded-full flex items-center justify-center',
                      isCompleted ? 'bg-blue-600' :
                      isActive ? 'bg-blue-200' :
                      error && index === completedSteps.length ? 'bg-red-600' :
                      'bg-gray-200'
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isCompleted ? (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-white text-sm"
                      >
                        ✓
                      </motion.span>
                    ) : error && index === completedSteps.length ? (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-white text-sm"
                      >
                        ×
                      </motion.span>
                    ) : isActive ? (
                      <LoadingDots />
                    ) : (
                      <span className={cn(
                        'text-sm',
                        isActive ? 'text-blue-600' : 'text-gray-400'
                      )}>
                        {index + 1}
                      </span>
                    )}
                  </motion.div>
                </div>
                <div className="mt-2 min-w-[120px] text-center">
                  <motion.p
                    className={cn(
                      'text-sm font-medium',
                      isCompleted ? 'text-blue-600' :
                      isActive ? 'text-blue-600' :
                      error && index === completedSteps.length ? 'text-red-600' :
                      'text-gray-500'
                    )}
                    animate={{
                      scale: isActive ? [1, 1.02, 1] : 1,
                    }}
                    transition={{
                      duration: 2,
                      repeat: isActive ? Infinity : 0,
                      repeatType: "reverse",
                    }}
                  >
                    {STEP_LABELS[step]}
                  </motion.p>
                  <AnimatePresence>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-1 text-xs text-gray-500 overflow-hidden"
                      >
                        {STEP_DESCRIPTIONS[step]}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-4 bg-red-50 p-4 rounded-md"
          >
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Analysis Error
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onCancel}
                    className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Cancel Analysis
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : currentStep !== 'completed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-end"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onCancel}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel Analysis
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}