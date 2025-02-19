// file path: src/pages/api/analyze.ts
import { NextApiRequest, NextApiResponse } from 'next';

import Groq from 'groq-sdk';

if (!process.env.GROQ_API_KEY) {
  throw new Error('Missing GROQ_API_KEY environment variable');
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Valid prompt is required' });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a data analyst specializing in e-commerce and brand performance metrics. Provide clear, actionable insights based on the data provided. Focus on key performance indicators, trends, and specific recommendations for improvement."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "deepseek-r1-distill-llama-70b",
      temperature: 0.6,
      max_tokens: 2000,
      top_p: 0.95,
      stream: false
    });

    const analysis = chatCompletion.choices[0]?.message?.content;

    if (!analysis) {
      throw new Error('No analysis generated');
    }

    res.status(200).json({ analysis });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to generate analysis',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}