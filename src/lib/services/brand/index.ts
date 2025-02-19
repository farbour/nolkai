import { BrandInfo } from '@/types/brand';
import { BrandPositioningServiceImpl } from './BrandPositioningService';
// file path: src/lib/services/brand/index.ts
import { BrandPresenceServiceImpl } from './BrandPresenceService';
import { CompetitorAnalysisServiceImpl } from './CompetitorAnalysisService';
import { MarketContextServiceImpl } from './MarketContextService';
import { PromptManager } from './PromptManager';
import { ResponseProcessor } from './ResponseProcessor';
import { ReviewAnalysisServiceImpl } from './ReviewAnalysisService';

export interface AnalysisProgress {
  currentStep: AnalysisStep;
  completedSteps: AnalysisStep[];
  error?: string;
}

export type AnalysisStep = 
  | 'presence'
  | 'positioning'
  | 'competitors'
  | 'reviews'
  | 'market'
  | 'completed';

export class BrandAnalysisService {
  private presenceService: BrandPresenceServiceImpl;
  private positioningService: BrandPositioningServiceImpl;
  private competitorService: CompetitorAnalysisServiceImpl;
  private reviewService: ReviewAnalysisServiceImpl;
  private marketService: MarketContextServiceImpl;
  private promptManager: PromptManager;
  private responseProcessor: ResponseProcessor;

  constructor(apiKey: string) {
    this.promptManager = new PromptManager();
    this.responseProcessor = new ResponseProcessor();
    
    this.presenceService = new BrandPresenceServiceImpl(apiKey);
    this.positioningService = new BrandPositioningServiceImpl(apiKey);
    this.competitorService = new CompetitorAnalysisServiceImpl(apiKey);
    this.reviewService = new ReviewAnalysisServiceImpl(apiKey);
    this.marketService = new MarketContextServiceImpl(apiKey);
  }

  async analyzeBrand(
    brandName: string,
    onProgress?: (progress: AnalysisProgress) => void,
    signal?: AbortSignal
  ): Promise<BrandInfo> {
    const completedSteps: AnalysisStep[] = [];
    const updateProgress = (step: AnalysisStep) => {
      if (step !== 'completed') {
        completedSteps.push(step);
      }
      onProgress?.({ currentStep: step, completedSteps });
    };

    try {
      // Check for abort signal
      if (signal?.aborted) {
        throw new Error('Analysis was cancelled');
      }

      // Analyze brand presence
      updateProgress('presence');
      const website = await this.presenceService.findWebsite(brandName);
      const socials = await this.presenceService.findSocialProfiles(brandName);
      const verifiedSocials = await this.presenceService.verifySocialProfiles(socials);

      // Check for abort signal
      if (signal?.aborted) {
        throw new Error('Analysis was cancelled');
      }

      // Analyze positioning
      updateProgress('positioning');
      const positioning = await this.positioningService.analyzePositioning(brandName);

      // Check for abort signal
      if (signal?.aborted) {
        throw new Error('Analysis was cancelled');
      }

      // Analyze competitors
      updateProgress('competitors');
      const competitorNames = await this.competitorService.identifyCompetitors(brandName);
      const competitors = await Promise.all(
        competitorNames.map(name => this.competitorService.analyzeCompetitor(name))
      );

      // Check for abort signal
      if (signal?.aborted) {
        throw new Error('Analysis was cancelled');
      }

      // Analyze reviews
      updateProgress('reviews');
      const reviews = await this.reviewService.aggregateReviews(brandName);

      // Check for abort signal
      if (signal?.aborted) {
        throw new Error('Analysis was cancelled');
      }

      // Get market context
      updateProgress('market');
      const marketContext = await this.marketService.getIndustryContext(brandName);

      // Enhance positioning with market context
      positioning.description = `${positioning.description}\n\nMarket Context: ${marketContext}`;

      updateProgress('completed');

      // Return combined results
      return {
        website,
        socials: verifiedSocials,
        positioning,
        competitors,
        reviews,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      onProgress?.({
        currentStep: completedSteps[completedSteps.length - 1] || 'presence',
        completedSteps,
        error: errorMessage
      });
      throw error;
    }
  }

  clearCache(): void {
    this.responseProcessor.clearCache();
  }
}

// Export all services and types
export * from './BrandPresenceService';
export * from './BrandPositioningService';
export * from './CompetitorAnalysisService';
export * from './ReviewAnalysisService';
export * from './MarketContextService';
export * from './PromptManager';
export * from './ResponseProcessor';