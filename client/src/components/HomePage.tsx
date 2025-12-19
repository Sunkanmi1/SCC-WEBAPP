import React, { useEffect, useRef, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import FilterPanel, { FilterValues } from './FilterPanel';
import SearchAutocomplete from './SearchAutocomplete';
import { generateSuggestions } from '../utils/searchSuggestions';
import { SearchHistoryManager } from '../utils/searchHistory';
import { Case } from '../App';
import '../styles/HomePage.css';

interface HomePageProps {
  onSearch: (query: string, page?: number, limit?: number) => void;
  onNavigateToAbout?: () => void;
  onApplyFilters?: (filters: FilterValues, page?: number, limit?: number) => void;
  onResetFilters?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({
  onSearch,
  onNavigateToAbout,
  onApplyFilters,
  onResetFilters,
}) => {
  const [query, setQuery] = useState('');
  const [ghostQuery, setGhostQuery] = useState('');
  const [suggestions, setSuggestions] = useState<
    ReturnType<typeof generateSuggestions>
  >([]);
  const [allCases, setAllCases] = useState<Case[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  /* Fetch cases once (for suggestions + featured) */
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090';
        const res = await fetch(`${base}/search?q=&limit=200`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.results)) {
            setAllCases(data.results);
          }
        }
      } catch {
        /* suggestions are optional */
      }
    };

    fetchCases();
  }, []);

  /* Generate suggestions + ghost recent search */
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setGhostQuery('');
      setShowAutocomplete(false);
      return;
    }

    const allRecentSearches = SearchHistoryManager.getHistory();
    const recentSuggestions = allRecentSearches
      .filter(item =>
        item.query.toLowerCase().startsWith(query.toLowerCase())
      )
      .map(item => ({
        text: item.query,
        type: 'recent' as const,
        highlight: query,
      }));

    const generated = generateSuggestions(query, allCases);

    // Combine recent suggestions with generated suggestions, removing duplicates
    const combinedSuggestionsMap = new Map<string, SearchSuggestion>();

    recentSuggestions.forEach(s => combinedSuggestionsMap.set(s.text, s));
    generated.forEach(s => combinedSuggestionsMap.set(s.text, s));

    const finalSuggestions = Array.from(combinedSuggestionsMap.values());

    setSuggestions(finalSuggestions);
    setShowAutocomplete(finalSuggestions.length > 0 || allRecentSearches.length > 0);

    const recentMatch = allRecentSearches.find(
      r =>
        r.query.toLowerCase().startsWith(query.toLowerCase()) &&
        r.query.length > query.length
    )?.query;

    setGhostQuery(recentMatch || '');
  }, [query, allCases]);

  /* Accept ghost text */
  const acceptGhost = () => {
    if (ghostQuery) {
      setQuery(ghostQuery);
      setGhostQuery('');
    }
  };

  /* Handle keyboard */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = inputRef.current;
    if (!input) return;

    const caretAtEnd = input.selectionStart === query.length;

    if (
      ghostQuery &&
      caretAtEnd &&
      (e.key === 'Tab' || e.key === 'ArrowRight')
    ) {
      e.preventDefault();
      acceptGhost();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowAutocomplete(false);
      SearchHistoryManager.addToHistory(query.trim()); // Add to history on submit
    }
  };

  return (
    <div className="home-page">
      <Header showBackButton={false} onNavigateToAbout={onNavigateToAbout} />

      <main className="hero-section">
        <div className="hero-overlay">
          <h1 className="hero-title">SUPREME COURT CASES</h1>

          <div className="search-container">
            <form className="search-form" onSubmit={handleSubmit}>
              <div className="search-box-wrapper">
                <div className="search-box">
                  {/* Ghost autocomplete */}
                  {ghostQuery && ghostQuery !== query && (
                    <div className="search-ghost">
                      <span className="ghost-typed">{query}</span>
                      <span className="ghost-rest">
                        {ghostQuery.slice(query.length)}
                      </span>
                    </div>
                  )}

                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search for a case by name, number, or keyword"
                    className="search-input"
                    autoComplete="off"
                  />

                  <button type="submit" className="search-button">
                    <i className="fas fa-search" />
                  </button>
                </div>

                <SearchAutocomplete
                  query={query}
                  suggestions={suggestions}
                  isVisible={showAutocomplete}
                  onSelectSuggestion={text => {
                    setQuery(text);
                    setShowAutocomplete(false);
                    onSearch(text);
                    SearchHistoryManager.addToHistory(text); // Add to history on suggestion select
                  }}
                  onClose={() => setShowAutocomplete(false)}
                  searchHistory={SearchHistoryManager.getHistory().map(item => item.query)}
                  onClearHistory={SearchHistoryManager.clearHistory}
                />
              </div>
            </form>

            <button
              type="button"
              className="filter-toggle-button"
              onClick={() => setShowFilters(p => !p)}
            >
              <i className="fas fa-filter" />
              <span>Filters</span>
            </button>
          </div>

          {showFilters && onApplyFilters && onResetFilters && (
            <div className="homepage-filters-container">
              <FilterPanel
                onApplyFilters={onApplyFilters}
                onResetFilters={onResetFilters}
                isLoading={false}
              />
            </div>
          )}
        </div>
      </main>

      <Footer onNavigateToAbout={onNavigateToAbout} />
    </div>
  );
};

export default HomePage;