import { LLMOptions, LLMProvider, LLMResponse } from './types';

export class PerplexityProvider implements LLMProvider {
  private readonly apiKey: string;
  private model = process.env.NEXT_PUBLIC_PERPLEXITY_DEFAULT_MODEL || 'deepseek-r1-distill-llama-70b';
  private readonly baseUrl = `${process.env.PERPLEXITY_API_ENDPOINT || 'https://api.perplexity.ai/v1'}/chat/completions`;

  constructor(apiKey: string, model?: string) {
    this.apiKey = apiKey;
    if (model) {
      this.model = model;
    }
  }

  async complete(prompt: string, options?: LLMOptions): Promise<LLMResponse> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*'
      },
      signal: options?.signal,
      body: JSON.stringify({
        model: options?.model || this.model,
        messages: [{
          role: 'system',
          content: 'You are a helpful assistant.'
        }, {
          role: 'user',
          content: prompt
        }],
        temperature: options?.temperature ?? 0.2,
        max_tokens: options?.maxTokens ?? 1000,
        top_p: options?.topP ?? 0.9,
        stream: false
      }),
    });

    try {
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API Error Response:', errorData);
        const errorMessage = errorData ? JSON.stringify(errorData.error || errorData) : response.statusText;
        throw new Error(`Deepseek API error: ${errorMessage}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from Deepseek API');
      }

      return {
        text: data.choices[0].message.content,
        usage: {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0,
        },
        model: data.model,
      };
    } catch (error) {
      console.error('Complete Error:', error);
      throw error;
    }
  }

  getDefaultModel(): string {
    return this.model;
  }
}