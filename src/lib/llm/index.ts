import { getAvailableLLMProviders, getLLMConfig } from './config';

import { GroqProvider } from './groq';
import { LLMProvider } from './types';
import { OpenAIProvider } from './openai';
import { PerplexityProvider } from './perplexity';

export type { LLMProvider, LLMResponse, LLMOptions } from './types';
export { getAvailableLLMProviders };

export class LLMError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LLMError';
  }
}

export const createLLMProvider = (type: 'openai' | 'groq' | 'perplexity', customConfig?: { apiKey?: string; model?: string }): LLMProvider => {
  const config = getLLMConfig();
  const providerConfig = config[type];

  if (!providerConfig && !customConfig?.apiKey) {
    throw new LLMError(`No configuration found for ${type} provider. Please provide an API key.`);
  }

  const apiKey = customConfig?.apiKey || providerConfig?.apiKey;
  const model = customConfig?.model || providerConfig?.defaultModel;

  if (!apiKey) {
    throw new LLMError(`API key is required for ${type} provider.`);
  }

  switch (type) {
    case 'openai':
      return new OpenAIProvider(apiKey, model);
    case 'groq':
      return new GroqProvider(apiKey, model);
    case 'perplexity':
      return new PerplexityProvider(apiKey, model);
    default:
      throw new LLMError(`Unknown LLM provider type: ${type}`);
  }
};

// Example usage:
/*
// Using environment variables
const llm = createLLMProvider('perplexity');

// Or with custom config
const llm = createLLMProvider('perplexity', {
  apiKey: 'your-api-key',
  model: 'custom-model'
});

const response = await llm.complete('Hello, how are you?');
console.log(response.text);

// Check available providers
const providers = getAvailableLLMProviders();
console.log('Available providers:', providers);
*/