import { LLMOptions, LLMProvider, LLMResponse } from './types';

import OpenAI from 'openai';

export class OpenAIProvider implements LLMProvider {
  private client: OpenAI;
  private defaultModel = 'gpt-4-turbo-preview';

  constructor(apiKey: string, model?: string) {
    this.client = new OpenAI({ apiKey });
    if (model) {
      this.defaultModel = model;
    }
  }

  async complete(prompt: string, options?: LLMOptions): Promise<LLMResponse> {
    const response = await this.client.chat.completions.create({
      model: options?.model || this.defaultModel,
      messages: [{ role: 'user', content: prompt }],
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens,
      top_p: options?.topP ?? 1,
      frequency_penalty: options?.frequencyPenalty ?? 0,
      presence_penalty: options?.presencePenalty ?? 0,
    });

    return {
      text: response.choices[0]?.message?.content || '',
      usage: {
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0,
      },
      model: response.model,
    };
  }

  getDefaultModel(): string {
    return this.defaultModel;
  }
}