/**
 * Search Suggestions Utility
 * Discovery-first, tolerant matching for legal case search.
 */

import { Case } from '../App';

export interface SearchSuggestion {
  text: string;
  type: 'featured' | 'suggestion' | 'popular';
  highlight?: string;
}

const POPULAR_TERMS: readonly string[] = [
  'contract',
  'property',
  'criminal',
  'constitutional',
  'civil',
  'appeal',
  'republic',
  'supreme',
  'court',
  'judge',
  'ruling',
  'decision',
  'case',
  'law',
  'legal',
  'rights',
  'constitution',
  'statute',
  'regulation',
];

/**
 * Main generator
 */
export function generateSuggestions(
  query: string,
  cases: Case[]
): SearchSuggestion[] {
  const q = normalize(query);

  // ───────────────────────────────────────────
  // EMPTY QUERY → FEATURED DISCOVERY
  // ───────────────────────────────────────────
  if (!q) {
    return [
      ...getFeaturedCases(cases, 6),
      ...POPULAR_TERMS.slice(0, 4).map(term => ({
        text: term,
        type: 'popular' as const,
      })),
    ];
  }

  const pool: Map<string, SearchSuggestion & { score: number }> =
    new Map();

  // ───────────────────────────────────────────
  // POPULAR TERMS (STRONG SIGNAL)
  // ───────────────────────────────────────────
  POPULAR_TERMS.forEach(term => {
    const score = scoreMatch(term, q);
    if (score > 0) {
      pool.set(term, {
        text: term,
        type: 'popular',
        highlight: q,
        score,
      });
    }
  });

  // ───────────────────────────────────────────
  // CASE TITLES & DESCRIPTIONS
  // ───────────────────────────────────────────
  cases.forEach(caseItem => {
    rankText(caseItem.title, q, 'suggestion', pool, 3);
    rankText(caseItem.description, q, 'suggestion', pool, 1);
  });

  // ───────────────────────────────────────────
  // FALLBACK: LIGHT FUZZY IF POOL IS SMALL
  // ───────────────────────────────────────────
  if (pool.size < 5 && q.length >= 2) {
    POPULAR_TERMS.forEach(term => {
      if (term.includes(q[0])) {
        pool.set(term, {
          text: term,
          type: 'popular',
          highlight: q,
          score: 1,
        });
      }
    });
    // ───────────────────────────────────────────
    // FINAL FALLBACK: RAW QUERY SUGGESTION
    // ───────────────────────────────────────────
    if (pool.size === 0 && q.length >= 2) {
      return [
        {
          text: query,
          type: 'suggestion',
          highlight: q,
        },
      ];
    }

  }

  return Array.from(pool.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(({ score, ...rest }) => rest);
}

/**
 * Featured cases
 */
function getFeaturedCases(
  cases: Case[],
  limit: number
): SearchSuggestion[] {
  if (!cases || cases.length === 0) return [];

  return [...cases]
    .sort(() => Math.random() - 0.5)
    .slice(0, limit)
    .map(caseItem => ({
      text: caseItem.title,
      type: 'featured',
    }));
}

/**
 * Ranking helper
 */
function rankText(
  text: string | undefined,
  query: string,
  type: 'suggestion',
  pool: Map<string, SearchSuggestion & { score: number }>,
  weight: number
): void {
  if (!text) return;

  const normalized = normalize(text);
  const score = scoreMatch(normalized, query) * weight;

  if (score > 0) {
    const existing = pool.get(text);
    pool.set(text, {
      text,
      type,
      highlight: query,
      score: Math.max(existing?.score ?? 0, score),
    });
  }

  normalized.split(/\s+/).forEach(word => {
    const wordScore = scoreMatch(word, query);
    if (wordScore > 0) {
      pool.set(word, {
        text: word,
        type,
        highlight: query,
        score: wordScore,
      });
    }
  });
}

/**
 * Match scoring logic
 */
function scoreMatch(text: string, query: string): number {
  if (text === query) return 10;
  if (text.startsWith(query)) return 7;
  if (text.includes(query)) return 5;
  if (query.length >= 2 && text.includes(query.slice(0, 2))) return 2;
  return 0;
}

/**
 * Normalize strings
 */
function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .trim();
}

/**
 * Highlight UI helper
 */
export function highlightSearchTerms(
  text: string,
  searchQuery: string
): string {
  if (!searchQuery.trim()) return text;

  const escaped = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');

  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Tokenize search input
 */
export function extractSearchTerms(query: string): string[] {
  return normalize(query)
    .split(/\s+/)
    .filter(term => term.length >= 2);
}
