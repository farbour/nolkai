// file path: src/lib/services/brandAnalysis.ts
import type { BrandInfo } from '@/types/brand';
import { PerplexityProvider } from '../llm/perplexity';
import { scrapeSocialMedia } from './socialMediaScraper';

export interface CompetitorResponse {
  name: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
}

export interface BrandAnalysisResponse {
  website: string;
  socials: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    tiktok?: string;
    youtube?: string;
    pinterest?: string;
  };
  positioning: {
    description: string;
    targetMarket: string;
    uniqueSellingPoints: string[];
    pricePoint: string;
  };
  competitors: CompetitorResponse[];
  reviews: {
    overallSentiment: string;
    averageRating: number;
    commonPraises: string[];
    commonComplaints: string[];
    sources: string[];
  };
}

export type AnalysisStep = 
  | 'presence'
  | 'positioning'
  | 'competitors'
  | 'reviews'
  | 'market'
  | 'completed';

export interface AnalysisProgress {
  currentStep: AnalysisStep;
  completedSteps: AnalysisStep[];
  error?: string;
}

export interface IBrandAnalysisService {
  analyzeBrand(
    brandName: string,
    onProgress?: (progress: AnalysisProgress) => void,
    signal?: AbortSignal
  ): Promise<BrandInfo>;
}

export class BrandAnalysisService implements IBrandAnalysisService {
  private llm: PerplexityProvider;

  constructor(apiKey: string) {
    this.llm = new PerplexityProvider(apiKey);
  }

  private cleanResponse(text: string): string {
    // Remove any markdown code block markers
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Remove any leading/trailing whitespace
    text = text.trim();
    
    // If the response starts with any non-JSON text, try to find the start of the JSON
    const jsonStart = text.indexOf('{');
    if (jsonStart > 0) {
      text = text.slice(jsonStart);
    }
    
    // If there's any text after the JSON, remove it
    const jsonEnd = text.lastIndexOf('}');
    if (jsonEnd < text.length - 1) {
      text = text.slice(0, jsonEnd + 1);
    }

    return text;
  }

  private async searchBrandPresence(brandName: string, signal?: AbortSignal): Promise<{ website: string; socials: BrandAnalysisResponse['socials'] }> {
    // First, get data from LLM
    const prompt = `You are a JSON generator. Your task is to thoroughly search for and find the official website and social media profiles for the brand "${brandName}". Be exhaustive in your search, considering:

1. Official website footer/header links to social media
2. Google search for "[brand] official social media"
3. Direct platform searches (e.g., instagram.com/[brand])
4. Common brand username patterns (exact match, with "official", with "global")
5. Cross-referencing between platforms to verify authenticity
6. Checking for verified badges/accounts

You must return ONLY a valid JSON object with no additional text, markdown, or explanations. The response must exactly match this format:

{
  "website": "official website url (or 'Not found' if unavailable)",
  "socials": {
    "instagram": "instagram.com/handle (or null if not found)",
    "facebook": "facebook.com/page (or null if not found)",
    "twitter": "twitter.com/handle (or null if not found)",
    "linkedin": "linkedin.com/company/page (or null if not found)",
    "tiktok": "tiktok.com/@handle (or null if not found)",
    "youtube": "youtube.com/channel (or null if not found)",
    "pinterest": "pinterest.com/handle (or null if not found)"
  }
}

Important:
- Return ONLY the JSON object. No other text, no markdown, no explanations.
- Always include full URLs (not just handles)
- Verify each account is official (not fan/unofficial accounts)
- Include only active, verified accounts when possible`;

    const response = await this.llm.complete(prompt, {
      model: process.env.NEXT_PUBLIC_PERPLEXITY_DEFAULT_MODEL || 'llama-3.1-sonar-huge-128k-online',
      temperature: 0.3,
      signal
    });

    try {
      const cleanedResponse = this.cleanResponse(response.text);
      console.log('Cleaned LLM response:', cleanedResponse);
      const llmData = JSON.parse(cleanedResponse);

      // If we have a website, try to scrape social media links directly
      let scrapedSocials = {};
      if (llmData.website && llmData.website !== 'Not found') {
        try {
          scrapedSocials = await scrapeSocialMedia(llmData.website);
          console.log('Scraped socials:', scrapedSocials);
        } catch (error) {
          console.error('Error scraping social media:', error);
        }
      }

      // Combine LLM and scraped results, preferring scraped results when available
      const combinedSocials = {
        ...llmData.socials,
        ...scrapedSocials,
        // Add any additional social platforms from LLM that weren't in scraping
        youtube: llmData.socials.youtube,
        pinterest: llmData.socials.pinterest
      };

      return {
        website: llmData.website,
        socials: combinedSocials
      };
    } catch (error) {
      console.error('Raw response:', response.text);
      console.error('Cleaned response:', this.cleanResponse(response.text));
      console.error('Parse error:', error instanceof Error ? error.message : error);
      throw new Error('Failed to parse brand presence data');
    }
  }

  private async searchBrandPositioning(brandName: string, signal?: AbortSignal): Promise<{ positioning: BrandAnalysisResponse['positioning'] }> {
    const prompt = `You are a JSON generator. Your task is to analyze the brand positioning and market strategy for "${brandName}". You must return ONLY a valid JSON object with no additional text, markdown, or explanations. The response must exactly match this format:

{
  "positioning": {
    "description": "detailed brand description (1-2 paragraphs)",
    "targetMarket": "detailed target market description",
    "uniqueSellingPoints": [
      "detailed point 1",
      "detailed point 2",
      "detailed point 3"
    ],
    "pricePoint": "detailed price positioning"
  }
}

Important: Return ONLY the JSON object. No other text, no markdown, no explanations.`;

    const response = await this.llm.complete(prompt, {
      model: process.env.NEXT_PUBLIC_PERPLEXITY_DEFAULT_MODEL || 'deepseek-r1-distill-llama-70b',
      temperature: 0.3,
      signal
    });

    try {
      const cleanedResponse = this.cleanResponse(response.text);
      console.log('Cleaned response:', cleanedResponse);
      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.error('Raw response:', response.text);
      console.error('Cleaned response:', this.cleanResponse(response.text));
      console.error('Parse error:', error instanceof Error ? error.message : error);
      throw new Error('Failed to parse brand positioning data');
    }
  }

  private async searchCompetitors(brandName: string, signal?: AbortSignal): Promise<{ competitors: CompetitorResponse[] }> {
    const prompt = `You are a JSON generator. Your task is to identify and analyze the main competitors of "${brandName}". You must return ONLY a valid JSON object with no additional text, markdown, or explanations. The response must exactly match this format:

{
  "competitors": [
    {
      "name": "competitor name",
      "description": "detailed competitor description",
      "strengths": [
        "detailed strength 1",
        "detailed strength 2",
        "detailed strength 3"
      ],
      "weaknesses": [
        "detailed weakness 1",
        "detailed weakness 2",
        "detailed weakness 3"
      ]
    }
  ]
}

Important: Return ONLY the JSON object. No other text, no markdown, no explanations.`;

    const response = await this.llm.complete(prompt, {
      model: process.env.NEXT_PUBLIC_PERPLEXITY_DEFAULT_MODEL || 'deepseek-r1-distill-llama-70b',
      temperature: 0.3,
      signal
    });

    try {
      const cleanedResponse = this.cleanResponse(response.text);
      console.log('Cleaned response:', cleanedResponse);
      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.error('Raw response:', response.text);
      console.error('Cleaned response:', this.cleanResponse(response.text));
      console.error('Parse error:', error instanceof Error ? error.message : error);
      throw new Error('Failed to parse competitors data');
    }
  }

  private async searchReviews(brandName: string, signal?: AbortSignal): Promise<{ reviews: BrandAnalysisResponse['reviews'] }> {
    const prompt = `You are a JSON generator. Your task is to analyze customer reviews and sentiment for "${brandName}". You must return ONLY a valid JSON object with no additional text, markdown, or explanations. The response must exactly match this format:

{
  "reviews": {
    "overallSentiment": "detailed sentiment analysis",
    "averageRating": 4.5,
    "commonPraises": [
      "detailed praise 1",
      "detailed praise 2",
      "detailed praise 3"
    ],
    "commonComplaints": [
      "detailed complaint 1",
      "detailed complaint 2",
      "detailed complaint 3"
    ],
    "sources": [
      "source 1",
      "source 2",
      "source 3"
    ]
  }
}

Important: Return ONLY the JSON object. No other text, no markdown, no explanations.`;

    const response = await this.llm.complete(prompt, {
      model: process.env.NEXT_PUBLIC_PERPLEXITY_DEFAULT_MODEL || 'deepseek-r1-distill-llama-70b',
      temperature: 0.3,
      signal
    });

    try {
      const cleanedResponse = this.cleanResponse(response.text);
      console.log('Cleaned response:', cleanedResponse);
      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.error('Raw response:', response.text);
      console.error('Cleaned response:', this.cleanResponse(response.text));
      console.error('Parse error:', error instanceof Error ? error.message : error);
      throw new Error('Failed to parse reviews data');
    }
  }

  private async searchMarketContext(brandName: string, signal?: AbortSignal): Promise<string> {
    const prompt = `You are a JSON generator. Your task is to provide additional market context and insights about "${brandName}". Focus on recent developments, market trends, and industry position. You must return ONLY a valid JSON object with no additional text, markdown, or explanations. The response must exactly match this format:

{
  "marketContext": "Provide a detailed market analysis here, focusing on industry trends, market size, growth potential, and competitive landscape. Include specific insights about market dynamics, consumer behavior shifts, and future outlook. Format as a cohesive 2-3 paragraph analysis without line breaks or special characters."
}

Important: 
- Return ONLY the JSON object. No other text, no markdown, no explanations.
- The marketContext value must be a single string with regular text only
- Do not include line breaks, quotes, or special characters in the marketContext value
- Keep the analysis professional and data-focused`;

    const response = await this.llm.complete(prompt, {
      model: process.env.NEXT_PUBLIC_PERPLEXITY_DEFAULT_MODEL || 'deepseek-r1-distill-llama-70b',
      temperature: 0.3, // Lower temperature for more consistent formatting
      signal
    });

    try {
      const cleanedResponse = this.cleanResponse(response.text);
      console.log('Cleaned response:', cleanedResponse);
      const result = JSON.parse(cleanedResponse);
      
      if (!result.marketContext || typeof result.marketContext !== 'string') {
        throw new Error('Invalid market context format');
      }

      // Clean the market context string
      const cleanedContext = result.marketContext
        .replace(/[\r\n]+/g, ' ') // Remove line breaks
        .replace(/\s+/g, ' ') // Normalize spaces
        .trim();

      if (!cleanedContext) {
        throw new Error('Empty market context');
      }

      return cleanedContext;
    } catch (error) {
      console.error('Raw response:', response.text);
      console.error('Cleaned response:', this.cleanResponse(response.text));
      console.error('Parse error:', error instanceof Error ? error.message : error);
      throw new Error('Failed to parse market context data');
    }
  }

  public async analyzeBrand(
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
      // Run searches sequentially for better progress tracking
      updateProgress('presence');
      const presenceData = await this.searchBrandPresence(brandName, signal);

      updateProgress('positioning');
      const positioningData = await this.searchBrandPositioning(brandName, signal);

      updateProgress('competitors');
      const competitorsData = await this.searchCompetitors(brandName, signal);

      updateProgress('reviews');
      const reviewsData = await this.searchReviews(brandName, signal);

      updateProgress('market');
      const marketContext = await this.searchMarketContext(brandName, signal);

      // Combine all results
      const result: BrandAnalysisResponse = {
        ...presenceData,
        ...positioningData,
        ...competitorsData,
        ...reviewsData
      };

      // Enhance descriptions with market context
      result.positioning.description = `${result.positioning.description}\n\nMarket Context: ${marketContext}`;

      updateProgress('completed');

      return {
        ...result,
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
}