/**
 * Cache Utility for API Responses
 * Provides localStorage-based caching with expiration
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

const CACHE_PREFIX = 'scc_cache_';
const DEFAULT_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

class CacheManager {
  /**
   * Store data in cache
   */
  set<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl,
      };
      localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(entry));
    } catch (error) {
      console.warn('Failed to cache data:', error);
      // localStorage might be full or disabled
    }
  }

  /**
   * Get data from cache
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(`${CACHE_PREFIX}${key}`);
      if (!item) return null;

      const entry: CacheEntry<T> = JSON.parse(item);

      // Check if expired
      if (Date.now() > entry.expiresAt) {
        this.remove(key);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.warn('Failed to retrieve cached data:', error);
      return null;
    }
  }

  /**
   * Check if cache entry exists and is valid
   */
  has(key: string): boolean {
    const data = this.get(key);
    return data !== null;
  }

  /**
   * Remove specific cache entry
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
    } catch (error) {
      console.warn('Failed to remove cache entry:', error);
    }
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): { count: number; size: number } {
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
      let totalSize = 0;

      cacheKeys.forEach(key => {
        const item = localStorage.getItem(key);
        if (item) {
          totalSize += item.length;
        }
      });

      return {
        count: cacheKeys.length,
        size: totalSize,
      };
    } catch {
      return { count: 0, size: 0 };
    }
  }
}

export const cacheManager = new CacheManager();

/**
 * Generate cache key from search parameters
 */
export function getCacheKey(type: 'search' | 'filter', params: Record<string, string>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  return `${type}_${sortedParams}`;
}

