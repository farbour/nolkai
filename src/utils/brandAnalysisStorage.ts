import { BrandInfo } from '@/types/brand';
import fs from 'fs';
import path from 'path';

const ANALYSIS_DIR = path.join(process.cwd(), 'public', 'brand-analysis');

// Ensure the analysis directory exists
if (!fs.existsSync(ANALYSIS_DIR)) {
  fs.mkdirSync(ANALYSIS_DIR, { recursive: true });
}

export const saveBrandAnalysis = async (brandName: string, data: BrandInfo): Promise<void> => {
  const fileName = `${brandName.toLowerCase().replace(/\s+/g, '-')}.json`;
  const filePath = path.join(ANALYSIS_DIR, fileName);
  
  await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

export const loadBrandAnalysis = async (brandName: string): Promise<BrandInfo | null> => {
  const fileName = `${brandName.toLowerCase().replace(/\s+/g, '-')}.json`;
  const filePath = path.join(ANALYSIS_DIR, fileName);
  
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