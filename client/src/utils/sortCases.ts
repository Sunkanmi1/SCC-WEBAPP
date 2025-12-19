/**
 * Case Sorting Utilities
 * Provides functions to sort cases by different criteria
 */

import { Case } from '../App';
import { SortOption } from '../components/SortOptions';

/**
 * Sort cases based on the selected option
 */
export function sortCases(cases: Case[], sortOption: SortOption, searchQuery: string = ''): Case[] {
  const sorted = [...cases];

  switch (sortOption) {
    case 'relevance':
      return sortByRelevance(sorted, searchQuery);
    case 'date-desc':
      return sortByDate(sorted, 'desc');
    case 'date-asc':
      return sortByDate(sorted, 'asc');
    case 'title-asc':
      return sortByTitle(sorted, 'asc');
    case 'title-desc':
      return sortByTitle(sorted, 'desc');
    default:
      return sorted;
  }
}

/**
 * Sort by relevance (search query match)
 */
function sortByRelevance(cases: Case[], query: string): Case[] {
  if (!query.trim()) return cases;

  const queryLower = query.toLowerCase();
  const queryTerms = queryLower.split(/\s+/).filter(term => term.length >= 2);

  return cases.sort((a, b) => {
    const aScore = calculateRelevanceScore(a, queryLower, queryTerms);
    const bScore = calculateRelevanceScore(b, queryLower, queryTerms);
    return bScore - aScore; // Higher score first
  });
}

/**
 * Calculate relevance score for a case
 */
function calculateRelevanceScore(caseItem: Case, query: string, queryTerms: string[]): number {
  let score = 0;

  // Title match (highest weight)
  const titleLower = caseItem.title.toLowerCase();
  if (titleLower.includes(query)) {
    score += 100;
    if (titleLower.startsWith(query)) {
      score += 50; // Bonus for starting with query
    }
  }
  queryTerms.forEach(term => {
    if (titleLower.includes(term)) {
      score += 20;
    }
  });

  // Description match
  if (caseItem.description) {
    const descLower = caseItem.description.toLowerCase();
    if (descLower.includes(query)) {
      score += 30;
    }
    queryTerms.forEach(term => {
      if (descLower.includes(term)) {
        score += 10;
      }
    });
  }

  // Citation match
  if (caseItem.citation) {
    const citationLower = caseItem.citation.toLowerCase();
    if (citationLower.includes(query)) {
      score += 25;
    }
  }

  // Judges match
  if (caseItem.judges) {
    const judgesLower = caseItem.judges.toLowerCase();
    if (judgesLower.includes(query)) {
      score += 15;
    }
  }

  return score;
}

/**
 * Sort by date
 */
function sortByDate(cases: Case[], order: 'asc' | 'desc'): Case[] {
  return cases.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    
    if (isNaN(dateA)) return 1; // Invalid dates go to end
    if (isNaN(dateB)) return -1;
    
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
}

/**
 * Sort by title
 */
function sortByTitle(cases: Case[], order: 'asc' | 'desc'): Case[] {
  return cases.sort((a, b) => {
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();
    
    if (order === 'asc') {
      return titleA.localeCompare(titleB);
    } else {
      return titleB.localeCompare(titleA);
    }
  });
}

