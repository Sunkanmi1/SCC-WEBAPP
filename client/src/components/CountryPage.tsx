import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CaseCard from './CaseCard';
import LoadingSpinner from './LoadingSpinner';
import FilterPanel, { FilterOptions } from './FilterPanel';
import Pagination from './Pagination';
import Breadcrumbs, { BreadcrumbItem } from './Breadcrumbs';
import { getCountryByCode } from '../config/countries';
import { Case } from '../App';
import '../styles/SearchResultsPage.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://tools.wmflabs.org/ghanasupremecases';

const CountryPage: React.FC = () => {
  const { countryCode } = useParams<{ countryCode: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    year: '',
    judge: '',
    keyword: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const country = getCountryByCode(countryCode?.toUpperCase() || 'GH');

  useEffect(() => {
    fetchCountryCases();
  }, [countryCode]);

  const fetchCountryCases = async (query: string = '') => {
    setLoading(true);
    setError(null);

    try {
      const upperCountryCode = countryCode?.toUpperCase() || 'GH';
      const url = `${API_BASE_URL}/search?country=${upperCountryCode}${query ? `&q=${encodeURIComponent(query)}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setResults(data.results);
      } else {
        setError(data.error || 'Failed to fetch cases');
      }
    } catch (err) {
      setError('Failed to connect to server. Please try again.');
      console.error('Error fetching cases:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchCountryCases(searchQuery.trim());
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchCountryCases();
  };

  // Extract unique years and judges from results
  const availableYears = React.useMemo(() => {
    const years = results
      .map(c => c.date.split('-')[0])
      .filter(year => year && year !== 'Date')
      .sort((a, b) => b.localeCompare(a));
    return Array.from(new Set(years));
  }, [results]);

  const availableJudges = React.useMemo(() => {
    const judges = results
      .flatMap(c => c.judges.split(',').map(j => j.trim()))
      .filter(judge => judge && judge !== 'Judges unavailable')
      .sort();
    return Array.from(new Set(judges));
  }, [results]);

  // Apply filters to results
  const filteredResults = React.useMemo(() => {
    return results.filter((caseItem: Case) => {
      if (activeFilters.year) {
        const caseYear = caseItem.date.split('-')[0];
        if (caseYear !== activeFilters.year) return false;
      }

      if (activeFilters.judge) {
        if (!caseItem.judges.includes(activeFilters.judge)) return false;
      }

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
    { label: country?.name || 'Country', icon: country?.flag }
  ];

  if (!country) {
    return (
      <div className="search-results-page">
        <Header />
        <main className="main-content">
          <div className="alert error-alert">
            <i className="fas fa-exclamation-circle"></i>
            <span>Invalid country code</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="search-results-page">
      <Header />

      <main className="main-content">
        <Breadcrumbs items={breadcrumbs} />
        
        <section className="results-section">
          {/* Country Header */}
          <div className="country-header">
            <div className="country-header-content">
              <span className="country-flag-large">{country.flag}</span>
              <div className="country-header-info">
                <h1>{country.name} Supreme Court Cases</h1>
                <p>Explore legal precedents and Supreme Court decisions from {country.name}</p>
              </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="country-search-form">
              <div className="search-input-wrapper">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${country.name} cases...`}
                  className="country-search-input"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="clear-search-btn"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
              <button type="submit" className="country-search-btn">
                <i className="fas fa-search"></i>
                Search
              </button>
            </form>
          </div>

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
              <p>We couldn't find any cases for {country.name}{searchQuery && ` matching "${searchQuery}"`}.</p>
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
                        ? `Showing ${filteredResults.length} of ${results.length} case${results.length !== 1 ? 's' : ''}`
                        : `Found ${results.length} case${results.length !== 1 ? 's' : ''}`
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

export default CountryPage;
