// file path: src/lib/services/brand/ResponseProcessor.ts
interface RetryConfig {
  maxRetries: number;
  backoffMs: number;
  maxBackoffMs: number;
}

interface CacheConfig {
  maxSize: number;
  ttlMs: number;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class ResponseProcessor {
  private cache: Map<string, CacheEntry<unknown>>;
  private retryConfig: RetryConfig;
  private cacheConfig: CacheConfig;

  constructor(
    retryConfig: Partial<RetryConfig> = {},
    cacheConfig: Partial<CacheConfig> = {}
  ) {
    this.retryConfig = {
      maxRetries: retryConfig.maxRetries || 3,
      backoffMs: retryConfig.backoffMs || 1000,
      maxBackoffMs: retryConfig.maxBackoffMs || 10000
    };

    this.cacheConfig = {
      maxSize: cacheConfig.maxSize || 100,
      ttlMs: cacheConfig.ttlMs || 30 * 60 * 1000 // 30 minutes default
    };

    this.cache = new Map();
  }

  async processResponse<T>(
    key: string,
    response: string,
    validator: (data: unknown) => data is T,
    retryFn?: () => Promise<string>
  ): Promise<T> {
    // Check cache first
    const cached = this.getCached<T>(key);
    if (cached) return cached;

    try {
      // Clean and parse response
      const cleaned = this.cleanResponse(response);
      const parsed = JSON.parse(cleaned);
      
      // Validate
      if (!validator(parsed)) {
        if (retryFn) {
          return this.retryWithBackoff(key, retryFn, validator);
        }
        throw new Error('Invalid response format');
      }
      
      // Cache valid response
      this.setCached(key, parsed);
      return parsed;
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error('Failed to parse response:', error);
        console.debug('Raw response:', response);
        console.debug('Cleaned response:', this.cleanResponse(response));
      }
      throw error;
    }
  }

  async processTextResponse(
    key: string,
    response: string,
    validator?: (text: string) => boolean,
    retryFn?: () => Promise<string>
  ): Promise<string> {
    // Check cache first
    const cached = this.getCached<string>(key);
    if (cached) return cached;

    // Clean response
    const cleaned = this.cleanTextResponse(response);
    
    // Validate if validator provided
    if (validator && !validator(cleaned)) {
      if (retryFn) {
        return this.retryWithBackoff(key, retryFn, (text: unknown): text is string => {
          return typeof text === 'string' && (!validator || validator(text));
        });
      }
      throw new Error('Invalid response format');
    }
    
    // Cache valid response
    this.setCached(key, cleaned);
    return cleaned;
  }

  private async retryWithBackoff<T>(
    key: string,
    operation: () => Promise<string>,
    validator: (data: unknown) => data is T,
    attempt: number = 1
  ): Promise<T> {
    try {
      const response = await operation();
      return this.processResponse(key, response, validator);
    } catch (error) {
      if (attempt >= this.retryConfig.maxRetries) throw error;
      
      const backoff = Math.min(
        this.retryConfig.backoffMs * Math.pow(2, attempt - 1),
        this.retryConfig.maxBackoffMs
      );
      
      await new Promise(resolve => setTimeout(resolve, backoff));
      return this.retryWithBackoff(key, operation, validator, attempt + 1);
    }
  }

  private cleanResponse(text: string): string {
    const cleaned = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const jsonMatch = cleaned.match(/^[^{]*({.*})[^}]*$/);
    return jsonMatch ? jsonMatch[1] : cleaned;
  }

  private cleanTextResponse(text: string): string {
    return text
      .replace(/```.*\n?/g, '')
      .replace(/\n+/g, ' ')
      .trim();
  }

  private getCached<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.cacheConfig.ttlMs) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  private setCached<T>(key: string, data: T): void {
    // Enforce cache size limit
    if (this.cache.size >= this.cacheConfig.maxSize) {
      // Remove oldest entry
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clearCache(): void {
    this.cache.clear();
  }

  removeCacheEntry(key: string): void {
    this.cache.delete(key);
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  getCacheKeys(): string[] {
    return Array.from(this.cache.keys());
  }
}