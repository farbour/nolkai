import type { NextApiRequest, NextApiResponse } from 'next';

// file path: src/pages/api/brand-analysis/storage.ts
import { BrandInfo } from '@/types/brand';
import fs from 'fs';
import path from 'path';

type ApiResponse = {
  success: boolean;
  data?: BrandInfo | string[];
  error?: string;
};

// Ensure the brand-analysis directory exists
const STORAGE_DIR = path.join(process.cwd(), 'public', 'brand-analysis');
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { brand } = req.query;

  // List all saved analyses
  if (req.method === 'GET' && req.url?.includes('/list')) {
    try {
      const files = fs.readdirSync(STORAGE_DIR);
      const brands = files
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''));
      
      return res.status(200).json({
        success: true,
        data: brands
      });
    } catch (error) {
      console.error('Error listing analyses:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to list analyses'
      });
    }
  }

  // Validate brand parameter
  if (!brand || typeof brand !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Brand parameter is required'
    });
  }

  const filePath = path.join(STORAGE_DIR, `${brand}.json`);

  if (req.method === 'GET') {
    try {
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          error: 'Analysis not found'
        });
      }

      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(fileContent);

      return res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Error loading analysis:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to load analysis'
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const data = req.body;
      
      if (!data || typeof data !== 'object') {
        return res.status(400).json({
          success: false,
          error: 'Invalid data format'
        });
      }

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

      return res.status(200).json({
        success: true
      });
    } catch (error) {
      console.error('Error saving analysis:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to save analysis'
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: 'Method not allowed'
  });
}