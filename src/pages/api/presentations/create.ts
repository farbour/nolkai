// file path: src/pages/api/presentations/create.ts
import { NextApiRequest, NextApiResponse } from 'next';

import fs from 'fs/promises';
import { isValidPresentationId } from '../../../utils/markdownParser';
import path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id, content } = req.body;

    if (!id || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!isValidPresentationId(id)) {
      return res.status(400).json({ error: 'Invalid presentation ID format' });
    }

    // Create presentations directory if it doesn't exist
    const presentationsDir = path.join(process.cwd(), 'public', 'presentations');
    await fs.mkdir(presentationsDir, { recursive: true });

    // Create presentation directory
    const presentationDir = path.join(presentationsDir, id);
    await fs.mkdir(presentationDir, { recursive: true });

    // Write slides.md file
    const slidesPath = path.join(presentationDir, 'slides.md');
    await fs.writeFile(slidesPath, content, 'utf-8');

    // Create metadata file
    const metadata = {
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const metadataPath = path.join(presentationDir, 'metadata.json');
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');

    return res.status(200).json({ success: true, id });
  } catch (error) {
    console.error('Error creating presentation:', error);
    return res.status(500).json({ error: 'Failed to create presentation' });
  }
}