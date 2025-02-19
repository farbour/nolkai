import { LLMOptions, LLMProvider, LLMResponse } from './types';

export class PerplexityProvider implements LLMProvider {
  private readonly apiKey: string;
  private model = 'sonar';
  private readonly baseUrl = 'https://api.perplexity.ai/chat/completions';

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
      },
      signal: options?.signal,
      body: JSON.stringify({
        model: options?.model || this.model,
        messages: [
          {
            role: 'system',
            content: 'Be precise and concise.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: options?.maxTokens ?? 1000,
        temperature: options?.temperature ?? 0.2,
        top_p: options?.topP ?? 0.9,
        presence_penalty: options?.presencePenalty ?? 0,
        frequency_penalty: options?.frequencyPenalty ?? 1,
        response_format: options?.response_format,
        search_domain_filter: null,
        return_images: false,
        return_related_questions: false,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData ? JSON.stringify(errorData.error || errorData) : response.statusText;
      throw new Error(`Perplexity API error: ${errorMessage}`);
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
    return this.model;
  }
}