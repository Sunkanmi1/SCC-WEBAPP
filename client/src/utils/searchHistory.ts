/**
 * Search History Utility
 * Manages search history in localStorage
 */

const SEARCH_HISTORY_KEY = 'scc_search_history';
const MAX_HISTORY_ITEMS = 10;

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  resultCount?: number;
}

export class SearchHistoryManager {
  /**
   * Get all search history items
   */
  static getHistory(): SearchHistoryItem[] {
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (!stored) return [];
      
      const history = JSON.parse(stored) as SearchHistoryItem[];
      // Sort by timestamp (newest first)
      return history.sort((a, b) => b.timestamp - a.timestamp);
    } catch {
      return [];
    }
  }

  /**
   * Add a search query to history
   */
  static addToHistory(query: string, resultCount?: number): void {
    if (!query.trim()) return;

    try {
      const history = this.getHistory();
      
      // Remove duplicate if exists
      const filtered = history.filter(item => item.query.toLowerCase() !== query.toLowerCase().trim());
      
      // Add new item at the beginning
      const newItem: SearchHistoryItem = {
        query: query.trim(),
        timestamp: Date.now(),
        resultCount,
      };
      
      filtered.unshift(newItem);
      
      // Keep only last MAX_HISTORY_ITEMS
      const limited = filtered.slice(0, MAX_HISTORY_ITEMS);
      
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(limited));
    } catch (error) {
      console.warn('Failed to save search history:', error);
    }
  }

  /**
   * Clear all search history
   */
  static clearHistory(): void {
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (error) {
      console.warn('Failed to clear search history:', error);
    }
  }

  /**
   * Remove a specific item from history
   */
  static removeFromHistory(query: string): void {
    try {
      const history = this.getHistory();
      const filtered = history.filter(item => item.query.toLowerCase() !== query.toLowerCase());
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.warn('Failed to remove from search history:', error);
    }
  }

  /**
   * Get recent searches (last N items)
   */
  static getRecent(limit: number = 5): SearchHistoryItem[] {
    return this.getHistory().slice(0, limit);
  }
}

