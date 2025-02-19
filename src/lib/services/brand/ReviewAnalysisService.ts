// file path: src/lib/services/brand/ReviewAnalysisService.ts
import { BrandReviews } from '@/types/brand';
import { PerplexityProvider } from '@/lib/llm/perplexity';

interface Review {
  text: string;
  rating?: number;
  source: string;
  date: string;
}

interface ReviewInsights {
  sentiment: string;
  rating: number;
  praises: string[];
  complaints: string[];
  sources: string[];
}

export interface ReviewAnalysisService {
  analyzeSentiment(reviews: string[]): Promise<string>;
  calculateRating(reviews: Review[]): Promise<number>;
  extractInsights(reviews: Review[]): Promise<ReviewInsights>;
  aggregateReviews(brandName: string): Promise<BrandReviews>;
}

export class ReviewAnalysisServiceImpl implements ReviewAnalysisService {
  private llm: PerplexityProvider;

  constructor(apiKey: string) {
    this.llm = new PerplexityProvider(apiKey);
  }

  async analyzeSentiment(reviews: string[]): Promise<string> {
    const reviewsText = reviews.join('\n');
    const prompt = `Analyze the sentiment of these customer reviews. Return ONLY a concise sentiment description, no JSON:
    
    Reviews:
    ${reviewsText}`;

    const response = await this.llm.complete(prompt, {
      model: process.env.NEXT_PUBLIC_PERPLEXITY_DEFAULT_MODEL || 'deepseek-r1-distill-llama-70b',
      temperature: 0.3
    });

    return response.text.trim();
  }

  async calculateRating(reviews: Review[]): Promise<number> {
    if (reviews.length === 0) return 0;

    const validRatings = reviews
      .map(r => r.rating)
      .filter((rating): rating is number => 
        typeof rating === 'number' && !isNaN(rating) && rating >= 0 && rating <= 5
      );

    if (validRatings.length === 0) return 0;

    const average = validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length;
    return Math.round(average * 10) / 10; // Round to 1 decimal place
  }

  async extractInsights(reviews: Review[]): Promise<ReviewInsights> {
    const reviewsText = reviews.map(r => r.text).join('\n');
    const prompt = `Analyze these customer reviews and extract key insights. Return ONLY a JSON object with this exact format:
    {
      "sentiment": "overall sentiment description",
      "rating": 4.5,
      "praises": ["praise 1", "praise 2", "praise 3"],
      "complaints": ["complaint 1", "complaint 2", "complaint 3"],
      "sources": ["source 1", "source 2", "source 3"]
    }

    Reviews:
    ${reviewsText}`;

    const response = await this.llm.complete(prompt, {
      model: process.env.NEXT_PUBLIC_PERPLEXITY_DEFAULT_MODEL || 'deepseek-r1-distill-llama-70b',
      temperature: 0.3
    });

    try {
      const insights = JSON.parse(response.text.trim());
      if (!this.validateInsights(insights)) {
        throw new Error('Invalid review insights format');
      }
      return insights;
    } catch (error) {
      console.error('Failed to parse review insights:', error);
      throw new Error('Failed to extract review insights');
    }
  }

  async aggregateReviews(brandName: string): Promise<BrandReviews> {
    const prompt = `Analyze customer reviews and sentiment for "${brandName}". Return ONLY a JSON object with this exact format:
    {
      "overallSentiment": "detailed sentiment analysis",
      "averageRating": 4.5,
      "commonPraises": ["detailed praise 1", "detailed praise 2", "detailed praise 3"],
      "commonComplaints": ["detailed complaint 1", "detailed complaint 2", "detailed complaint 3"],
      "sources": ["source 1", "source 2", "source 3"]
    }`;

    const response = await this.llm.complete(prompt, {
      model: process.env.NEXT_PUBLIC_PERPLEXITY_DEFAULT_MODEL || 'deepseek-r1-distill-llama-70b',
      temperature: 0.3
    });

    try {
      const reviews = JSON.parse(response.text.trim());
      if (!this.validateBrandReviews(reviews)) {
        throw new Error('Invalid brand reviews format');
      }
      return reviews;
    } catch (error) {
      console.error('Failed to parse brand reviews:', error);
      throw new Error('Failed to aggregate brand reviews');
    }
  }

  private validateInsights(insights: unknown): insights is ReviewInsights {
    if (!insights || typeof insights !== 'object') {
      return false;
    }

    const ins = insights as Record<string, unknown>;
    
    return (
      typeof ins.sentiment === 'string' &&
      typeof ins.rating === 'number' &&
      Array.isArray(ins.praises) &&
      ins.praises.every((p: unknown): p is string => typeof p === 'string') &&
      Array.isArray(ins.complaints) &&
      ins.complaints.every((c: unknown): c is string => typeof c === 'string') &&
      Array.isArray(ins.sources) &&
      ins.sources.every((s: unknown): s is string => typeof s === 'string')
    );
  }

  private validateBrandReviews(reviews: unknown): reviews is BrandReviews {
    if (!reviews || typeof reviews !== 'object') {
      return false;
    }

    const rev = reviews as Record<string, unknown>;
    
    return (
      typeof rev.overallSentiment === 'string' &&
      typeof rev.averageRating === 'number' &&
      Array.isArray(rev.commonPraises) &&
      rev.commonPraises.every((p: unknown): p is string => typeof p === 'string') &&
      Array.isArray(rev.commonComplaints) &&
      rev.commonComplaints.every((c: unknown): c is string => typeof c === 'string') &&
      Array.isArray(rev.sources) &&
      rev.sources.every((s: unknown): s is string => typeof s === 'string')
    );
  }
}