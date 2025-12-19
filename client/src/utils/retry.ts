/**
 * Retry Utility for Failed Requests
 * Provides exponential backoff retry mechanism
 */

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryable?: (error: any) => boolean;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
  retryable: () => true,
};

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: any;
  let delay = opts.initialDelay;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Check if error is retryable
      if (!opts.retryable(error)) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === opts.maxRetries) {
        break;
      }

      // Wait before retrying (exponential backoff)
      await sleep(Math.min(delay, opts.maxDelay));
      delay *= opts.backoffMultiplier;
    }
  }

  throw lastError;
}

/**
 * Check if an error is retryable (network errors, timeouts, 5xx errors)
 */
export function isRetryableError(error: any): boolean {
  // Network errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return true;
  }

  // Timeout errors
  if (error.name === 'AbortError' || error.name === 'TimeoutError') {
    return true;
  }

  // 5xx server errors
  if (error.status >= 500 && error.status < 600) {
    return true;
  }

  // 503 Service Unavailable
  if (error.status === 503) {
    return true;
  }

  // 429 Too Many Requests
  if (error.status === 429) {
    return true;
  }

  return false;
}

/**
 * Fetch with retry wrapper
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retryOptions: RetryOptions = {}
): Promise<Response> {
  return retry(
    async () => {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const error: any = new Error(`HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;
        error.response = response;
        throw error;
      }

      return response;
    },
    {
      ...retryOptions,
      retryable: (error) => {
        if (retryOptions.retryable) {
          return retryOptions.retryable(error);
        }
        return isRetryableError(error);
      },
    }
  );
}

