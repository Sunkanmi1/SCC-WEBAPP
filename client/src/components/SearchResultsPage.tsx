import React, { useState, useRef, useCallback, useMemo } from 'react';
import Header from './Header';
import Footer from './Footer';
import CaseCard from './CaseCard';
import LoadingSpinner from './LoadingSpinner';
import FilterPanel, { FilterValues } from './FilterPanel';
import Pagination from './Pagination';
import SortOptions, { SortOption } from './SortOptions';
import { SearchState } from '../types/search';
import { sortCases } from '../utils/sortCases';
import '../styles/SearchResultsPage.css';
import '../styles/AppliedFilters.css';


interface SearchResultsPageProps {
  searchState: SearchState;
  onBackToSearch: () => void;
  onApplyFilters?: (filters: FilterValues, page?: number, limit?: number) => void;
  onResetFilters?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToAbout?: () => void;
  onRetry?: () => void;
  onSearch?: (query: string, page?: number, limit?: number) => void;
}

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({
  searchState,
  onBackToSearch,
  onApplyFilters,
  onResetFilters,
  onNavigateToHome,
  onNavigateToAbout,
  onRetry,
  onSearch
}) => {
  const { query, results, loading, error, pagination, appliedFilters, totalCount } = searchState;
  const [itemsPerPage, setItemsPerPage] = useState(pagination?.itemsPerPage || 20);
  const [sortOption, setSortOption] = useState<SortOption>('relevance');
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  // Sort results based on selected option
  const sortedResults = useMemo(() => {
    return sortCases(results, sortOption, query);
  }, [results, sortOption, query]);

  const displayCount = totalCount !== undefined ? totalCount : (pagination?.totalItems || results.length);
  
  const lastCaseElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && pagination?.hasNextPage && onSearch && query) {
        // Load next page when last item is visible (lazy loading)
        onSearch(query, (pagination.currentPage || 1) + 1, itemsPerPage);
      }
    });
    if (node) observerRef.current.observe(node);
  }, [loading, pagination, onSearch, query, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (onSearch && query) {
      onSearch(query, page, itemsPerPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (onApplyFilters) {
      // If filtered, we need to maintain filter state
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    if (onSearch && query) {
      onSearch(query, 1, items); // Reset to page 1 when changing items per page
    }
  };

  return (
    <div className="search-results-page">
      <Header showBackButton={true} onBackClick={onBackToSearch} />

      <main className="main-content">
        <section className="results-section">
          {/* Filter Panel */}
          {onApplyFilters && onResetFilters && (
            <FilterPanel
              onApplyFilters={onApplyFilters}
              onResetFilters={onResetFilters}
              isLoading={loading}
            />
          )}

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="alert error-alert ">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          ) : results.length === 0 ? (
            <div className="alert empty-alert">
              <i className="fas fa-search"></i>
              <h2>No cases found</h2>
              <p>Try adjusting your search terms or check your spelling.</p>
            </div>
          ) : (
            <>
              {/* Sort Options and Results Count */}
              <SortOptions
                currentSort={sortOption}
                onSortChange={setSortOption}
                totalResults={displayCount}
              />

              {/* Applied Filters Display */}
              {appliedFilters && (
                <div className="applied-filters">
                  <h3 className="applied-filters-title">
                    <i className="fas fa-filter"></i>
                    Applied Filters:
                  </h3>
                  <div className="applied-filters-list">
                    {appliedFilters.keyword && (
                      <span className="filter-badge">
                        <i className="fas fa-key"></i>
                        Keyword: {appliedFilters.keyword}
                      </span>
                    )}
                    {appliedFilters.year && (
                      <span className="filter-badge">
                        <i className="fas fa-calendar"></i>
                        Year: {appliedFilters.year}
                      </span>
                    )}
                    {appliedFilters.judge && (
                      <span className="filter-badge">
                        <i className="fas fa-user-gavel"></i>
                        Judge: {appliedFilters.judge}
                      </span>
                    )}
                    {appliedFilters.caseType && (
                      <span className="filter-badge">
                        <i className="fas fa-gavel"></i>
                        Type: {appliedFilters.caseType}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="results-header">
                <h2>Search Results</h2>
                <p className="results-count">
                  {pagination 
                    ? `Showing ${pagination.currentPage === 1 ? 1 : ((pagination.currentPage - 1) * itemsPerPage) + 1} to ${Math.min(pagination.currentPage * itemsPerPage, pagination.totalItems)} of ${pagination.totalItems} cases`
                    : `Found ${displayCount} case${displayCount !== 1 ? 's' : ''}`
                  }
                  {query && ` for "${query}"`}
                </p>
              </div>
              <div className="results-grid">
                {sortedResults.map((caseItem, index) => {
                  const isLastElement = index === sortedResults.length - 1;
                  return (
                    <div
                      key={`${caseItem.caseId}-${index}`}
                      ref={isLastElement ? lastCaseElementRef : null}
                    >
                      <CaseCard
                        case={caseItem}
                        searchQuery={query}
                      />
                    </div>
                  );
                })}
              </div>
              
              {/* Pagination Component */}
              {pagination && pagination.totalPages > 1 && (
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  totalItems={pagination.totalItems}
                  startIndex={pagination.currentPage === 1 ? 1 : ((pagination.currentPage - 1) * itemsPerPage) + 1}
                  endIndex={Math.min(pagination.currentPage * itemsPerPage, pagination.totalItems)}
                />
              )}
            </>
          )}
        </section>
      </main>

      <Footer 
        onNavigateToHome={onNavigateToHome}
        onNavigateToAbout={onNavigateToAbout}
      />
    </div>
  );
};

export default SearchResultsPage;
