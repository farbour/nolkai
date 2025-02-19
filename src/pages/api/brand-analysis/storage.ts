// file path: src/pages/api/brand-analysis/storage.ts
import { BrandCompetitor, BrandInfo } from '@/types/brand';
import { NextApiRequest, NextApiResponse } from 'next';

import fs from 'fs';
import path from 'path';

const ANALYSIS_DIR = path.join(process.cwd(), 'public', 'brand-analysis');

// Ensure the analysis directory exists
if (!fs.existsSync(ANALYSIS_DIR)) {
  fs.mkdirSync(ANALYSIS_DIR, { recursive: true });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query } = req;
  const brandName = query.brand as string;

  if (!brandName) {
    return res.status(400).json({ error: 'Brand name is required' });
  }

  const fileName = `${brandName.toLowerCase().replace(/\s+/g, '-')}.json`;
  const filePath = path.join(ANALYSIS_DIR, fileName);

  switch (method) {
    case 'GET':
      try {
        if (!fs.existsSync(filePath)) {
          return res.status(404).json({ error: 'Analysis not found' });
        }
        const data = await fs.promises.readFile(filePath, 'utf-8');
        return res.status(200).json(JSON.parse(data));
      } catch (error) {
        console.error('Error reading analysis:', error);
        return res.status(500).json({ error: 'Failed to read analysis' });
      }

    case 'POST':
      try {
        const newData: BrandInfo = req.body;
        
        // If file exists, merge data
        let finalData = newData;
        if (fs.existsSync(filePath)) {
          const existingData = JSON.parse(await fs.promises.readFile(filePath, 'utf-8')) as BrandInfo;
          finalData = {
            ...existingData,
            ...newData,
            // Merge socials, keeping existing values if new ones are null/undefined
            socials: {
              ...existingData.socials,
              ...Object.fromEntries(
                Object.entries(newData.socials).filter(([, value]) => value != null)
              ),
            },
            // Merge positioning data, concatenating arrays
            positioning: {
              ...existingData.positioning,
              ...newData.positioning,
              uniqueSellingPoints: [
                ...new Set([
                  ...(existingData.positioning?.uniqueSellingPoints || []),
                  ...(newData.positioning?.uniqueSellingPoints || []),
                ]),
              ],
            },
            // Merge competitors, combining by name and updating data
            competitors: [
              ...newData.competitors.map(newComp => {
                const existingComp = existingData.competitors?.find((e: BrandCompetitor) => e.name === newComp.name);
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
              ...(existingData.competitors?.filter(
                (e: BrandCompetitor) => !newData.competitors.some(n => n.name === e.name)
              ) || []),
            ],
            // Merge reviews data, combining arrays and averaging ratings
            reviews: {
              ...existingData.reviews,
              ...newData.reviews,
              averageRating:
                (existingData.reviews?.averageRating || 0 + newData.reviews?.averageRating || 0) / 2,
              commonPraises: [
                ...new Set([
                  ...(existingData.reviews?.commonPraises || []),
                  ...(newData.reviews?.commonPraises || []),
                ]),
              ],
              commonComplaints: [
                ...new Set([
                  ...(existingData.reviews?.commonComplaints || []),
                  ...(newData.reviews?.commonComplaints || []),
                ]),
              ],
              sources: [
                ...new Set([
                  ...(existingData.reviews?.sources || []),
                  ...(newData.reviews?.sources || []),
                ]),
              ],
            },
            lastUpdated: new Date().toISOString(),
          };
        }

        await fs.promises.writeFile(filePath, JSON.stringify(finalData, null, 2), 'utf-8');
        return res.status(200).json(finalData);
      } catch (error) {
        console.error('Error saving analysis:', error);
        return res.status(500).json({ error: 'Failed to save analysis' });
      }

    case 'HEAD':
      // Check if analysis exists
      return res.status(fs.existsSync(filePath) ? 200 : 404).end();

    default:
      res.setHeader('Allow', ['GET', 'POST', 'HEAD']);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}