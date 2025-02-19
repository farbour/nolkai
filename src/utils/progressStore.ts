// file path: src/utils/progressStore.ts
import { AnalysisProgress } from '@/lib/services/brandAnalysis';

// Store analysis progress for each brand
const progressStore = new Map<string, AnalysisProgress>();

export function setProgress(brandName: string, progress: AnalysisProgress) {
  progressStore.set(brandName, progress);
}

export function getProgress(brandName: string): AnalysisProgress | undefined {
  return progressStore.get(brandName);
}

export function deleteProgress(brandName: string) {
  progressStore.delete(brandName);
}

export default progressStore;