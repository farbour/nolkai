// file path: src/lib/services/brand/MarketContextService.ts
import { PerplexityProvider } from '@/lib/llm/perplexity';

export interface MarketSize {
  value: string;
  growth: string;
  timeframe: string;
  source: string;
}

export interface MarketTrend {
  name: string;
  description: string;
  impact: string;
  timeframe: string;
}

export interface GrowthForecast {
  shortTerm: string;
  mediumTerm: string;
  longTerm: string;
  factors: string[];
}

export interface MarketData {
  industry: string;
  segment: string;
  historicalData: {
    year: number;
    value: number;
  }[];
}

export interface MarketContextService {
  analyzeMarketSize(industry: string): Promise<MarketSize>;
  identifyTrends(industry: string): Promise<MarketTrend[]>;
  forecastGrowth(marketData: MarketData): Promise<GrowthForecast>;
  getIndustryContext(brandName: string): Promise<string>;
}

export class MarketContextServiceImpl implements MarketContextService {
  private llm: PerplexityProvider;

  constructor(apiKey: string) {
    this.llm = new PerplexityProvider(apiKey);
  }

  async analyzeMarketSize(industry: string): Promise<MarketSize> {
    const prompt = `Analyze the market size for the ${industry} industry. Return ONLY a JSON object with this exact format:
    {
      "value": "market size in dollars",
      "growth": "year-over-year growth rate",
      "timeframe": "time period of analysis",
      "source": "data source"
    }`;

    const response = await this.llm.complete(prompt, {
      model: process.env.NEXT_PUBLIC_PERPLEXITY_DEFAULT_MODEL || 'deepseek-r1-distill-llama-70b',
      temperature: 0.3
    });

    try {
      const marketSize = JSON.parse(response.text.trim());
      if (!this.validateMarketSize(marketSize)) {
        throw new Error('Invalid market size format');
      }
      return marketSize;
    } catch (error) {
      console.error('Failed to parse market size:', error);
      throw new Error('Failed to analyze market size');
    }
  }

  async identifyTrends(industry: string): Promise<MarketTrend[]> {
    const prompt = `Identify key trends in the ${industry} industry. Return ONLY a JSON array with this format:
    [
      {
        "name": "trend name",
        "description": "detailed description",
        "impact": "business impact",
        "timeframe": "expected duration"
      }
    ]`;

    const response = await this.llm.complete(prompt, {
      model: process.env.NEXT_PUBLIC_PERPLEXITY_DEFAULT_MODEL || 'deepseek-r1-distill-llama-70b',
      temperature: 0.3
    });

    try {
      const trends = JSON.parse(response.text.trim());
      if (!this.validateTrends(trends)) {
        throw new Error('Invalid trends format');
      }
      return trends;
    } catch (error) {
      console.error('Failed to parse market trends:', error);
      throw new Error('Failed to identify trends');
    }
  }

  async forecastGrowth(marketData: MarketData): Promise<GrowthForecast> {
    const prompt = `Forecast growth for the ${marketData.industry} industry in the ${marketData.segment} segment. 
    Historical data: ${JSON.stringify(marketData.historicalData)}
    
    Return ONLY a JSON object with this exact format:
    {
      "shortTerm": "1-year forecast",
      "mediumTerm": "3-year forecast",
      "longTerm": "5-year forecast",
      "factors": ["factor 1", "factor 2", "factor 3"]
    }`;

    const response = await this.llm.complete(prompt, {
      model: process.env.NEXT_PUBLIC_PERPLEXITY_DEFAULT_MODEL || 'deepseek-r1-distill-llama-70b',
      temperature: 0.3
    });

    try {
      const forecast = JSON.parse(response.text.trim());
      if (!this.validateForecast(forecast)) {
        throw new Error('Invalid forecast format');
      }
      return forecast;
    } catch (error) {
      console.error('Failed to parse growth forecast:', error);
      throw new Error('Failed to forecast growth');
    }
  }

  async getIndustryContext(brandName: string): Promise<string> {
    const prompt = `Provide industry context for "${brandName}". Focus on:
    1. Market dynamics
    2. Key players
    3. Recent developments
    4. Future outlook
    Return ONLY a concise analysis paragraph, no JSON.`;

    const response = await this.llm.complete(prompt, {
      model: process.env.NEXT_PUBLIC_PERPLEXITY_DEFAULT_MODEL || 'deepseek-r1-distill-llama-70b',
      temperature: 0.3
    });

    return response.text.trim();
  }

  private validateMarketSize(size: unknown): size is MarketSize {
    if (!size || typeof size !== 'object') {
      return false;
    }

    const s = size as Record<string, unknown>;
    
    return (
      typeof s.value === 'string' &&
      typeof s.growth === 'string' &&
      typeof s.timeframe === 'string' &&
      typeof s.source === 'string'
    );
  }

  private validateTrends(trends: unknown): trends is MarketTrend[] {
    if (!Array.isArray(trends)) {
      return false;
    }

    return trends.every((trend): trend is MarketTrend => {
      if (!trend || typeof trend !== 'object') {
        return false;
      }

      const t = trend as Record<string, unknown>;
      
      return (
        typeof t.name === 'string' &&
        typeof t.description === 'string' &&
        typeof t.impact === 'string' &&
        typeof t.timeframe === 'string'
      );
    });
  }

  private validateForecast(forecast: unknown): forecast is GrowthForecast {
    if (!forecast || typeof forecast !== 'object') {
      return false;
    }

    const f = forecast as Record<string, unknown>;
    
    return (
      typeof f.shortTerm === 'string' &&
      typeof f.mediumTerm === 'string' &&
      typeof f.longTerm === 'string' &&
      Array.isArray(f.factors) &&
      f.factors.every((factor: unknown): factor is string => 
        typeof factor === 'string'
      )
    );
  }
}