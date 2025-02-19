import * as cheerio from 'cheerio';

import { BrandSocials } from '@/types/brand';
// file path: src/lib/services/socialMediaScraper.ts
import axios from 'axios';

const SOCIAL_MEDIA_PATTERNS = {
  instagram: /instagram\.com\/([^/?#]+)/i,
  facebook: /facebook\.com\/([^/?#]+)/i,
  twitter: /(twitter|x)\.com\/([^/?#]+)/i,
  linkedin: /linkedin\.com\/(company|in)\/([^/?#]+)/i,
  tiktok: /tiktok\.com\/@([^/?#]+)/i,
};

const SOCIAL_MEDIA_BASE_URLS = {
  instagram: 'https://instagram.com/',
  facebook: 'https://facebook.com/',
  twitter: 'https://twitter.com/',
  linkedin: 'https://linkedin.com/company/',
  tiktok: 'https://tiktok.com/@',
};

export async function scrapeSocialMedia(websiteUrl: string): Promise<BrandSocials> {
  try {
    // Ensure URL has protocol
    const url = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`;
    
    // Fetch website content
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const socials: BrandSocials = {};

    // Find social media links
    $('a[href*="instagram.com"], a[href*="facebook.com"], a[href*="twitter.com"], a[href*="x.com"], a[href*="linkedin.com"], a[href*="tiktok.com"]').each((_, element) => {
      const href = $(element).attr('href');
      if (!href) return;

      // Match against patterns and extract handles
      Object.entries(SOCIAL_MEDIA_PATTERNS).forEach(([platform, pattern]) => {
        const match = href.match(pattern);
        if (match) {
          // For Twitter/X, use match[2], for others use match[1]
          // For LinkedIn, if it's a personal profile (in/), skip it
          if (platform === 'linkedin' && match[1] === 'in') {
            return;
          }
          
          const handle = platform === 'twitter' ? match[2] : match[1];
          const cleanHandle = handle.replace(/\/$/, ''); // Remove trailing slash if present
          socials[platform as keyof BrandSocials] = SOCIAL_MEDIA_BASE_URLS[platform as keyof typeof SOCIAL_MEDIA_BASE_URLS] + cleanHandle;
        }
      });
    });

    return socials;
  } catch (error) {
    console.error('Error scraping social media:', error);
    return {};
  }
}