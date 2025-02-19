export interface LLMResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
}

type JsonSchemaType = {
  type: string;
  properties?: Record<string, JsonSchemaType>;
  required?: string[];
  items?: JsonSchemaType;
  description?: string;
};

interface ResponseFormat {
  type: "json_schema" | "regex";
  json_schema?: {
    type: string;
    properties?: Record<string, JsonSchemaType>;
    required?: string[];
  };
  regex?: {
    regex: string;
  };
}

export interface LLMOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  model?: string;
  response_format?: ResponseFormat;
  signal?: AbortSignal;
}

export interface LLMProvider {
  complete(prompt: string, options?: LLMOptions): Promise<LLMResponse>;
  getDefaultModel(): string;
}