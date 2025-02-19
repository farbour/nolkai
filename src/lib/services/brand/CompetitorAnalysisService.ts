// file path: src/lib/services/brand/CompetitorAnalysisService.ts
import { BrandCompetitor } from '@/types/brand';
import { PerplexityProvider } from '@/lib/llm/perplexity';

export interface CompetitorInsights {
  marketShare: string;
  competitiveAdvantage: string[];
  threats: string[];
  opportunities: string[];
}

export interface CompetitorAnalysisService {
  identifyCompetitors(brandName: string): Promise<string[]>;
  analyzeCompetitor(competitorName: string): Promise<BrandCompetitor>;
  compareWithCompetitors(brand: string, competitors: BrandCompetitor[]): Promise<CompetitorInsights>;
}

export class CompetitorAnalysisServiceImpl implements CompetitorAnalysisService {
  private llm: PerplexityProvider;

  constructor(apiKey: string) {
    this.llm = new PerplexityProvider(apiKey);
  }

  async identifyCompetitors(brandName: string): Promise<string[]> {
    const prompt = `Identify the main competitors for "${brandName}". Return ONLY a JSON array of competitor names, no explanation. Example: ["Competitor 1", "Competitor 2"]`;

    const response = await this.llm.complete(prompt, {
      model: process.env.NEXT_PUBLIC_PERPLEXITY_DEFAULT_MODEL || 'deepseek-r1-distill-llama-70b',
      temperature: 0.3
    });

    try {
      const competitors = JSON.parse(response.text.trim());
      if (!Array.isArray(competitors) || !competitors.every((c): c is string => typeof c === 'string')) {
        throw new Error('Invalid competitor list format');
      }
      return competitors;
    } catch (error) {
      console.error('Failed to parse competitors:', error);
      return [];
    }
  }

  async analyzeCompetitor(competitorName: string): Promise<BrandCompetitor> {
    const prompt = `Analyze the competitor "${competitorName}". Return ONLY a JSON object with this exact format:
    {
      "name": "${competitorName}",
      "description": "detailed competitor description",
      "strengths": ["strength 1", "strength 2", "strength 3"],
      "weaknesses": ["weakness 1", "weakness 2", "weakness 3"]
    }`;

    const response = await this.llm.complete(prompt, {
      model: process.env.NEXT_PUBLIC_PERPLEXITY_DEFAULT_MODEL || 'deepseek-r1-distill-llama-70b',
      temperature: 0.3
    });

    try {
      const competitor = JSON.parse(response.text.trim());
      if (!this.validateCompetitor(competitor)) {
        throw new Error('Invalid competitor data format');
      }
      return competitor;
    } catch (error) {
      console.error('Failed to parse competitor analysis:', error);
      throw new Error('Failed to analyze competitor');
    }
  }

  async compareWithCompetitors(brand: string, competitors: BrandCompetitor[]): Promise<CompetitorInsights> {
    const competitorNames = competitors.map(c => c.name).join(', ');
    const prompt = `Compare "${brand}" with competitors: ${competitorNames}. Return ONLY a JSON object with this exact format:
    {
      "marketShare": "description of relative market share",
      "competitiveAdvantage": ["advantage 1", "advantage 2", "advantage 3"],
      "threats": ["threat 1", "threat 2", "threat 3"],
      "opportunities": ["opportunity 1", "opportunity 2", "opportunity 3"]
    }`;

    const response = await this.llm.complete(prompt, {
      model: process.env.NEXT_PUBLIC_PERPLEXITY_DEFAULT_MODEL || 'deepseek-r1-distill-llama-70b',
      temperature: 0.3
    });

    try {
      const insights = JSON.parse(response.text.trim());
      if (!this.validateInsights(insights)) {
        throw new Error('Invalid competitor insights format');
      }
      return insights;
    } catch (error) {
      console.error('Failed to parse competitor comparison:', error);
      throw new Error('Failed to compare competitors');
    }
  }

  private validateCompetitor(competitor: unknown): competitor is BrandCompetitor {
    if (!competitor || typeof competitor !== 'object') {
      return false;
    }

    const comp = competitor as Record<string, unknown>;
    
    return (
      typeof comp.name === 'string' &&
      typeof comp.description === 'string' &&
      Array.isArray(comp.strengths) &&
      comp.strengths.every((s: unknown): s is string => typeof s === 'string') &&
      Array.isArray(comp.weaknesses) &&
      comp.weaknesses.every((w: unknown): w is string => typeof w === 'string')
    );
  }

  private validateInsights(insights: unknown): insights is CompetitorInsights {
    if (!insights || typeof insights !== 'object') {
      return false;
    }

    const ins = insights as Record<string, unknown>;
    
    return (
      typeof ins.marketShare === 'string' &&
      Array.isArray(ins.competitiveAdvantage) &&
      ins.competitiveAdvantage.every((a: unknown): a is string => typeof a === 'string') &&
      Array.isArray(ins.threats) &&
      ins.threats.every((t: unknown): t is string => typeof t === 'string') &&
      Array.isArray(ins.opportunities) &&
      ins.opportunities.every((o: unknown): o is string => typeof o === 'string')
    );
  }
}