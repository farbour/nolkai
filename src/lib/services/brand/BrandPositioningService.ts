// file path: src/lib/services/brand/BrandPositioningService.ts
import { BrandPositioning } from '@/types/brand';
import { PerplexityProvider } from '@/lib/llm/perplexity';

export interface BrandPositioningService {
  analyzePositioning(brandName: string): Promise<BrandPositioning>;
  analyzePricePoint(brandName: string): Promise<string>;
  identifyTargetMarket(brandName: string): Promise<string>;
}

export class BrandPositioningServiceImpl implements BrandPositioningService {
  private llm: PerplexityProvider;

  constructor(apiKey: string) {
    this.llm = new PerplexityProvider(apiKey);
  }

  async analyzePositioning(brandName: string): Promise<BrandPositioning> {
    const prompt = `Analyze the market positioning for "${brandName}". Return ONLY a JSON object with this exact format:
    {
      "description": "detailed brand description (1-2 paragraphs)",
      "targetMarket": "detailed target market description",
      "uniqueSellingPoints": ["point 1", "point 2", "point 3"],
      "pricePoint": "detailed price positioning"
    }`;

    const response = await this.llm.complete(prompt, {
      model: process.env.NEXT_PUBLIC_PERPLEXITY_DEFAULT_MODEL || 'deepseek-r1-distill-llama-70b',
      temperature: 0.3
    });

    try {
      const positioning = JSON.parse(response.text.trim());
      return {
        description: positioning.description,
        targetMarket: positioning.targetMarket,
        uniqueSellingPoints: positioning.uniqueSellingPoints,
        pricePoint: positioning.pricePoint
      };
    } catch (error) {
      console.error('Failed to parse positioning data:', error);
      throw new Error('Failed to analyze brand positioning');
    }
  }

  async analyzePricePoint(brandName: string): Promise<string> {
    const prompt = `Analyze the price positioning for "${brandName}". Consider:
    1. Price range of main products
    2. Comparison to competitors
    3. Value proposition
    4. Market segment (luxury, mid-range, budget)
    Return ONLY a concise description, no JSON.`;

    const response = await this.llm.complete(prompt, {
      model: process.env.NEXT_PUBLIC_PERPLEXITY_DEFAULT_MODEL || 'deepseek-r1-distill-llama-70b',
      temperature: 0.3
    });

    return response.text.trim();
  }

  async identifyTargetMarket(brandName: string): Promise<string> {
    const prompt = `Identify the target market for "${brandName}". Consider:
    1. Demographics (age, income, location)
    2. Psychographics (interests, values, lifestyle)
    3. Behavioral patterns
    4. Market segment specifics
    Return ONLY a concise description, no JSON.`;

    const response = await this.llm.complete(prompt, {
      model: process.env.NEXT_PUBLIC_PERPLEXITY_DEFAULT_MODEL || 'deepseek-r1-distill-llama-70b',
      temperature: 0.3
    });

    return response.text.trim();
  }

  private validatePositioning(positioning: unknown): positioning is BrandPositioning {
    if (!positioning || typeof positioning !== 'object') {
      return false;
    }

    const pos = positioning as Record<string, unknown>;
    
    return (
      typeof pos.description === 'string' &&
      typeof pos.targetMarket === 'string' &&
      Array.isArray(pos.uniqueSellingPoints) &&
      pos.uniqueSellingPoints.every((point: unknown): point is string =>
        typeof point === 'string'
      ) &&
      typeof pos.pricePoint === 'string'
    );
  }
}