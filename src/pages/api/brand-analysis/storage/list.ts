// file path: src/pages/api/brand-analysis/storage/list.ts
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
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const files = await fs.promises.readdir(ANALYSIS_DIR);
    const brandNames = files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace(/\.json$/, '').replace(/-/g, ' '));

    return res.status(200).json(brandNames);
  } catch (error) {
    console.error('Error listing analyses:', error);
    return res.status(500).json({ error: 'Failed to list analyses' });
  }
}