import React, { useState, useMemo } from 'react';
import Header from './Header';
import Footer from './Footer';
import CaseCard from './CaseCard';
import LoadingSpinner from './LoadingSpinner';
import FilterPanel, { FilterOptions } from './FilterPanel';
import Pagination from './Pagination';
import Breadcrumbs, { BreadcrumbItem } from './Breadcrumbs';
import { SearchState, Case } from '../App';
import '../styles/SearchResultsPage.css';

interface SearchResultsPageProps {
  searchState: SearchState;
  onBackToSearch: () => void;
}

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({
  searchState,
  onBackToSearch
}) => {
  const { query, results, loading, error } = searchState;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    year: '',
    judge: '',
    keyword: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Extract unique years and judges from results
  const availableYears = useMemo(() => {
    const years = results
      .map(c => c.date.split('-')[0])
      .filter(year => year && year !== 'Date')
      .sort((a, b) => b.localeCompare(a));
    return Array.from(new Set(years));
  }, [results]);

  const availableJudges = useMemo(() => {
    const judges = results
      .flatMap(c => c.judges.split(',').map(j => j.trim()))
      .filter(judge => judge && judge !== 'Judges unavailable')
      .sort();
    return Array.from(new Set(judges));
  }, [results]);

  // Apply filters to results
  const filteredResults = useMemo(() => {
    return results.filter((caseItem: Case) => {
      // Year filter
      if (activeFilters.year) {
        const caseYear = caseItem.date.split('-')[0];
        if (caseYear !== activeFilters.year) return false;
      }

      // Judge filter
      if (activeFilters.judge) {
        if (!caseItem.judges.includes(activeFilters.judge)) return false;
      }

      // Keyword filter
      if (activeFilters.keyword) {
        const keyword = activeFilters.keyword.toLowerCase();
        const searchableText = [
          caseItem.title,
          caseItem.description,
          caseItem.citation,
          caseItem.court,
          caseItem.judges
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(keyword)) return false;
      }

      return true;
    });
  }, [results, activeFilters]);

  const handleApplyFilters = (filters: FilterOptions) => {
    setActiveFilters(filters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleRemoveFilter = (filterType: keyof FilterOptions) => {
    setActiveFilters(prev => ({ ...prev, [filterType]: '' }));
    setCurrentPage(1);
  };

  const hasActiveFilters = activeFilters.year || activeFilters.judge || activeFilters.keyword;

  // Pagination logic
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResults = filteredResults.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', path: '/', icon: 'fas fa-home' },
    { label: 'Search Results', icon: 'fas fa-search' }
  ];

  return (
    <div className="search-results-page">
      <Header showBackButton={true} onBackClick={onBackToSearch} />

      <main className="main-content">
        <Breadcrumbs items={breadcrumbs} />
        
        <section className="results-section">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="alert error-alert">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          ) : results.length === 0 ? (
            <div className="alert info-alert">
              <i className="fas fa-search"></i>
              <h2>No cases found</h2>
              <p>We couldn't find any cases matching "<strong>{query}</strong>".</p>
              <p className="suggestions">Try different keywords or check your spelling.</p>
            </div>
          ) : (
            <>
              <div className="results-header">
                <div className="results-header-top">
                  <div className="results-info">
                    <h2>Search Results</h2>
                    <p className="results-count">
                      {hasActiveFilters 
                        ? `Showing ${filteredResults.length} of ${results.length} case${results.length !== 1 ? 's' : ''} for "${query}"`
                        : `Found ${results.length} case${results.length !== 1 ? 's' : ''} for "${query}"`
                      }
                    </p>
                  </div>
                  <button 
                    className="filter-toggle-btn"
                    onClick={() => setIsFilterOpen(true)}
                  >
                    <i className="fas fa-filter"></i>
                    Filter
                    {hasActiveFilters && (
                      <span className="filter-count-badge">
                        {[activeFilters.year, activeFilters.judge, activeFilters.keyword].filter(Boolean).length}
                      </span>
                    )}
                  </button>
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                  <div className="active-filters">
                    <span className="active-filters-label">Active Filters:</span>
                    {activeFilters.year && (
                      <div className="filter-badge">
                        <i className="fas fa-calendar-alt"></i>
                        Year: {activeFilters.year}
                        <button 
                          className="filter-badge-close"
                          onClick={() => handleRemoveFilter('year')}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    )}
                    {activeFilters.judge && (
                      <div className="filter-badge">
                        <i className="fas fa-gavel"></i>
                        Judge: {activeFilters.judge}
                        <button 
                          className="filter-badge-close"
                          onClick={() => handleRemoveFilter('judge')}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    )}
                    {activeFilters.keyword && (
                      <div className="filter-badge">
                        <i className="fas fa-key"></i>
                        Keyword: {activeFilters.keyword}
                        <button 
                          className="filter-badge-close"
                          onClick={() => handleRemoveFilter('keyword')}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {filteredResults.length === 0 ? (
                <div className="alert empty-alert">
                  <i className="fas fa-filter"></i>
                  <h2>No cases match your filters</h2>
                  <p>Try adjusting your filter criteria or clear all filters.</p>
                  <button 
                    className="clear-filters-btn"
                    onClick={() => setActiveFilters({ year: '', judge: '', keyword: '' })}
                  >
                    <i className="fas fa-eraser"></i>
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="results-grid">
                    {paginatedResults.map((caseItem, index) => (
                      <CaseCard
                        key={`${caseItem.caseId}-${index}`}
                        case={caseItem}
                      />
                    ))}
                  </div>
                  
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredResults.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />

      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        availableYears={availableYears}
        availableJudges={availableJudges}
        currentFilters={activeFilters}
      />
    </div>
  );
};

export default SearchResultsPage;
