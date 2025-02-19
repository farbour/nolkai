import { LLMOptions, LLMProvider, LLMResponse } from './types';

export class GroqProvider implements LLMProvider {
  private readonly apiKey: string;
  private readonly defaultModel: string = 'deepseek-r1-distill-llama-70b';
  private readonly baseUrl: string = 'https://api.groq.com/v1/chat/completions';

  constructor(apiKey: string, model?: string) {
    this.apiKey = apiKey;
    if (model) {
      this.defaultModel = model;
    }
  }

  async complete(prompt: string, options?: LLMOptions): Promise<LLMResponse> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: options?.model || this.defaultModel,
        messages: [{ role: 'user', content: prompt }],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens,
        top_p: options?.topP ?? 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      text: data.choices[0]?.message?.content || '',
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
      model: data.model,
    };
  }

  getDefaultModel(): string {
    return this.defaultModel;
  }
}