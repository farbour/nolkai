interface LLMConfig {
  apiKey: string;
  defaultModel?: string;
}

interface LLMConfigs {
  openai?: LLMConfig;
  groq?: LLMConfig;
  perplexity?: LLMConfig;
}

export const getLLMConfig = (): LLMConfigs => {
  return {
    openai: process.env.OPENAI_API_KEY ? {
      apiKey: process.env.OPENAI_API_KEY,
      defaultModel: process.env.OPENAI_DEFAULT_MODEL || 'gpt-4-turbo-preview'
    } : undefined,
    
    groq: process.env.GROQ_API_KEY ? {
      apiKey: process.env.GROQ_API_KEY,
      defaultModel: 'deepseek-r1-distill-llama-70b'
    } : undefined,
    
    perplexity: process.env.PERPLEXITY_API_KEY ? {
      apiKey: process.env.PERPLEXITY_API_KEY,
      defaultModel: process.env.PERPLEXITY_DEFAULT_MODEL || 'llama-3.1-sonar-huge-128k-online'
    } : undefined
  };
};

export const getAvailableLLMProviders = (): ('openai' | 'groq' | 'perplexity')[] => {
  const config = getLLMConfig();
  return Object.entries(config)
    .filter(([, config]) => config !== undefined)
    .map(([key]) => key as 'openai' | 'groq' | 'perplexity');
};