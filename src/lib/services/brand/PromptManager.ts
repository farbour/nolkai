// file path: src/lib/services/brand/PromptManager.ts
export type AnalysisType = 
  | 'presence'
  | 'positioning'
  | 'competitors'
  | 'reviews'
  | 'market';

interface PromptVersion {
  version: string;
  prompt: string;
  createdAt: Date;
}

interface CustomizationParams {
  [key: string]: string;
}

export class PromptManager {
  private prompts: Map<string, PromptVersion[]>;
  
  constructor() {
    this.prompts = new Map();
    this.initializePrompts();
  }

  getPrompt(type: AnalysisType, version?: string): string {
    const versions = this.prompts.get(type);
    if (!versions || versions.length === 0) {
      throw new Error(`No prompts found for type: ${type}`);
    }

    if (version) {
      const specificVersion = versions.find(v => v.version === version);
      if (!specificVersion) {
        throw new Error(`Version ${version} not found for type: ${type}`);
      }
      return specificVersion.prompt;
    }

    // Return latest version
    return versions[versions.length - 1].prompt;
  }

  addPrompt(type: AnalysisType, prompt: string, version: string): void {
    if (!this.validatePrompt(prompt)) {
      throw new Error('Invalid prompt format');
    }

    const versions = this.prompts.get(type) || [];
    if (versions.some(v => v.version === version)) {
      throw new Error(`Version ${version} already exists for type: ${type}`);
    }

    versions.push({
      version,
      prompt,
      createdAt: new Date()
    });

    this.prompts.set(type, versions);
  }

  customizePrompt(prompt: string, params: CustomizationParams): string {
    return Object.entries(params).reduce(
      (acc, [key, value]) => acc.replace(`{${key}}`, value),
      prompt
    );
  }

  validatePrompt(prompt: string): boolean {
    // Basic validation rules
    const rules = [
      // Must not contain markdown code blocks
      !prompt.includes('```'),
      // Must be reasonable length
      prompt.length >= 10 && prompt.length <= 2000,
      // Must contain at least one parameter placeholder
      /\{[a-zA-Z]+\}/.test(prompt),
      // Must mention JSON if it expects JSON response
      !prompt.includes('Return ONLY a JSON') || prompt.includes('exact format'),
      // Must have clear instruction
      prompt.includes('Return ONLY')
    ];

    return rules.every(rule => rule);
  }

  private initializePrompts(): void {
    // Presence prompts
    this.addPrompt('presence', `Find the official website URL for the brand "{brandName}". Return ONLY the URL as a plain string, no JSON, no explanation.`, '1.0.0');

    // Positioning prompts
    this.addPrompt('positioning', `Analyze the market positioning for "{brandName}". Return ONLY a JSON object with this exact format:
    {
      "description": "detailed brand description (1-2 paragraphs)",
      "targetMarket": "detailed target market description",
      "uniqueSellingPoints": ["point 1", "point 2", "point 3"],
      "pricePoint": "detailed price positioning"
    }`, '1.0.0');

    // Competitors prompts
    this.addPrompt('competitors', `Analyze the competitor "{brandName}". Return ONLY a JSON object with this exact format:
    {
      "name": "{brandName}",
      "description": "detailed competitor description",
      "strengths": ["strength 1", "strength 2", "strength 3"],
      "weaknesses": ["weakness 1", "weakness 2", "weakness 3"]
    }`, '1.0.0');

    // Reviews prompts
    this.addPrompt('reviews', `Analyze customer reviews and sentiment for "{brandName}". Return ONLY a JSON object with this exact format:
    {
      "overallSentiment": "detailed sentiment analysis",
      "averageRating": 4.5,
      "commonPraises": ["detailed praise 1", "detailed praise 2", "detailed praise 3"],
      "commonComplaints": ["detailed complaint 1", "detailed complaint 2", "detailed complaint 3"],
      "sources": ["source 1", "source 2", "source 3"]
    }`, '1.0.0');

    // Market prompts
    this.addPrompt('market', `Analyze the market context for "{brandName}". Return ONLY a JSON object with this exact format:
    {
      "marketSize": {
        "value": "market size in dollars",
        "growth": "year-over-year growth rate",
        "timeframe": "time period of analysis"
      },
      "trends": [
        {
          "name": "trend name",
          "description": "trend description",
          "impact": "business impact"
        }
      ],
      "forecast": {
        "shortTerm": "1-year outlook",
        "longTerm": "5-year outlook",
        "factors": ["factor 1", "factor 2", "factor 3"]
      }
    }`, '1.0.0');
  }
}