// file path: src/lib/services/brand/BrandPresenceService.ts
import { BrandSocials } from '@/types/brand';
import { PerplexityProvider } from '@/lib/llm/perplexity';

export interface BrandPresenceService {
  findWebsite(brandName: string): Promise<string>;
  findSocialProfiles(brandName: string): Promise<BrandSocials>;
  verifySocialProfiles(profiles: BrandSocials): Promise<BrandSocials>;
}

export class BrandPresenceServiceImpl implements BrandPresenceService {
  private llm: PerplexityProvider;

  constructor(apiKey: string) {
    this.llm = new PerplexityProvider(apiKey);
  }

  async findWebsite(brandName: string): Promise<string> {
    const prompt = `Find the official website URL for the brand "${brandName}". Return ONLY the URL as a plain string, no JSON, no explanation.`;
    
    const response = await this.llm.complete(prompt, {
      model: process.env.NEXT_PUBLIC_PERPLEXITY_DEFAULT_MODEL || 'deepseek-r1-distill-llama-70b',
      temperature: 0.3
    });

    const website = response.text.trim();
    return website.startsWith('http') ? website : `https://${website}`;
  }

  async findSocialProfiles(brandName: string): Promise<BrandSocials> {
    const prompt = `Find official social media profiles for "${brandName}". Return ONLY a JSON object with these exact keys: instagram, facebook, twitter, linkedin, tiktok. Use null for not found profiles. Include full URLs.`;
    
    const response = await this.llm.complete(prompt, {
      model: process.env.NEXT_PUBLIC_PERPLEXITY_DEFAULT_MODEL || 'deepseek-r1-distill-llama-70b',
      temperature: 0.3
    });

    try {
      const profiles = JSON.parse(response.text.trim());
      return profiles;
    } catch (error) {
      console.error('Failed to parse social profiles:', error);
      return {};
    }
  }

  async verifySocialProfiles(profiles: BrandSocials): Promise<BrandSocials> {
    const verifiedProfiles: BrandSocials = {};
    
    try {
      // Verify each profile exists and is official
      for (const [platform, url] of Object.entries(profiles)) {
        if (!url) continue;
        
        try {
          const response = await fetch(url);
          if (response.ok) {
            verifiedProfiles[platform as keyof BrandSocials] = url;
          }
        } catch (error) {
          console.warn(`Failed to verify ${platform} profile:`, error);
        }
      }
    } catch (error) {
      console.error('Error verifying social profiles:', error);
    }

    return verifiedProfiles;
  }
}