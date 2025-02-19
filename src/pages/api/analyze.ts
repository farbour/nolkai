// file path: src/pages/api/analyze.ts
import { NextApiRequest, NextApiResponse } from 'next';

import Groq from 'groq-sdk';

if (!process.env.GROQ_API_KEY) {
  throw new Error('Missing GROQ_API_KEY environment variable');
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert e-commerce data analyst and business strategist. Your role is to:
1. Analyze complex e-commerce performance data
2. Identify key trends and patterns
3. Provide actionable strategic recommendations
4. Highlight critical metrics and their implications
5. Compare performance across brands when relevant

Focus on these key areas:
- Revenue metrics (Gross, Net, D2C) and their growth trends
- Marketing efficiency (TACOS, ACOS, CAC)
- Customer behavior (Conversion Rate, Repeat Rate, LTV)
- Email marketing performance
- Overall brand health and market position

For each metric, explain:
- What the current value indicates
- How it compares to industry standards
- Its trend and implications
- Specific recommendations for improvement

Format your response as a JSON object with this structure:
{
  "highlights": [
    {
      "label": "Critical metric name",
      "value": "Current value with appropriate formatting",
      "change": "Percentage change with + or - prefix",
      "trend": "up/down/neutral",
      "insight": "One-line interpretation of this metric"
    }
  ],
  "analysis": [
    "Executive Summary: Overall performance assessment and key findings",
    "Revenue Analysis: Detailed breakdown of revenue metrics and trends",
    "Marketing Efficiency: Analysis of advertising costs and effectiveness",
    "Customer Metrics: Deep dive into customer behavior and lifetime value",
    "Strategic Recommendations: Specific, actionable steps for improvement"
  ]
}`;

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
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "deepseek-r1-distill-llama-70b",
      temperature: 0.6,
      max_tokens: 4096,
      top_p: 0.95,
      stream: false,
      response_format: {
        type: "json_object"
      }
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