export interface BrandSocials {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  tiktok?: string;
}

export interface BrandPositioning {
  description: string;
  targetMarket: string;
  uniqueSellingPoints: string[];
  pricePoint: string;
}

export interface BrandCompetitor {
  name: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
}

export interface BrandReviews {
  overallSentiment: string;
  averageRating: number;
  commonPraises: string[];
  commonComplaints: string[];
  sources: string[];
}

export interface BrandInfo {
  website: string;
  socials: BrandSocials;
  positioning: BrandPositioning;
  competitors: BrandCompetitor[];
  reviews: BrandReviews;
  lastUpdated: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  info?: BrandInfo;
  isAnalyzing?: boolean;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export type BrandTab = 'overview' | 'positioning' | 'competitors' | 'reviews' | 'settings';