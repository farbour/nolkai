// file path: src/utils/brandAnalysisStorage.ts
import { BrandInfo } from '@/types/brand';
import fs from 'fs';
import path from 'path';

const ANALYSIS_DIR = path.join(process.cwd(), 'public', 'brand-analysis');

// Ensure the analysis directory exists
if (!fs.existsSync(ANALYSIS_DIR)) {
  fs.mkdirSync(ANALYSIS_DIR, { recursive: true });
}

export const getAnalysisPath = (brandName: string): string => {
  const fileName = `${brandName.toLowerCase().replace(/\s+/g, '-')}.json`;
  return path.join(ANALYSIS_DIR, fileName);
};

export const hasExistingAnalysis = async (brandName: string): Promise<boolean> => {
  const filePath = getAnalysisPath(brandName);
  try {
    await fs.promises.access(filePath);
    return true;
  } catch {
    return false;
  }
};

export const mergeAnalysisData = (existing: BrandInfo, newData: BrandInfo): BrandInfo => {
  return {
    ...existing,
    ...newData,
    // Merge socials, keeping existing values if new ones are null/undefined
    socials: {
      ...existing.socials,
      ...Object.fromEntries(
        Object.entries(newData.socials).filter(([, value]) => value != null)
      ),
    },
    // Merge positioning data, concatenating arrays
    positioning: {
      ...existing.positioning,
      ...newData.positioning,
      uniqueSellingPoints: [
        ...new Set([
          ...(existing.positioning?.uniqueSellingPoints || []),
          ...(newData.positioning?.uniqueSellingPoints || []),
        ]),
      ],
    },
    // Merge competitors, combining by name and updating data
    competitors: [
      ...newData.competitors.map(newComp => {
        const existingComp = existing.competitors?.find(e => e.name === newComp.name);
        if (existingComp) {
          return {
            ...existingComp,
            ...newComp,
            strengths: [...new Set([...existingComp.strengths, ...newComp.strengths])],
            weaknesses: [...new Set([...existingComp.weaknesses, ...newComp.weaknesses])],
          };
        }
        return newComp;
      }),
      ...(existing.competitors?.filter(
        e => !newData.competitors.some(n => n.name === e.name)
      ) || []),
    ],
    // Merge reviews data, combining arrays and averaging ratings
    reviews: {
      ...existing.reviews,
      ...newData.reviews,
      averageRating:
        (existing.reviews?.averageRating || 0 + newData.reviews?.averageRating || 0) / 2,
      commonPraises: [
        ...new Set([
          ...(existing.reviews?.commonPraises || []),
          ...(newData.reviews?.commonPraises || []),
        ]),
      ],
      commonComplaints: [
        ...new Set([
          ...(existing.reviews?.commonComplaints || []),
          ...(newData.reviews?.commonComplaints || []),
        ]),
      ],
      sources: [
        ...new Set([
          ...(existing.reviews?.sources || []),
          ...(newData.reviews?.sources || []),
        ]),
      ],
    },
    lastUpdated: new Date().toISOString(),
  };
};

export const saveBrandAnalysis = async (brandName: string, data: BrandInfo): Promise<void> => {
  const filePath = getAnalysisPath(brandName);
  
  try {
    // Check for existing analysis
    const existingData = await loadBrandAnalysis(brandName);
    
    // If we have existing data, merge it with the new data
    const finalData = existingData ? mergeAnalysisData(existingData, data) : data;
    
    await fs.promises.writeFile(filePath, JSON.stringify(finalData, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving brand analysis:', error);
    throw error;
  }
};

export const loadBrandAnalysis = async (brandName: string): Promise<BrandInfo | null> => {
  const filePath = getAnalysisPath(brandName);
  
  try {
    const data = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(data) as BrandInfo;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    throw error;
  }
};

export const listSavedAnalyses = async (): Promise<string[]> => {
  const files = await fs.promises.readdir(ANALYSIS_DIR);
  return files
    .filter(file => file.endsWith('.json'))
    .map(file => file.replace(/\.json$/, '').replace(/-/g, ' '));
};