import React from 'react';
import Header from './Header';
import Footer from './Footer';
import CaseCard from './CaseCard';
import LoadingSpinner from './LoadingSpinner';
import { SearchState } from '../../App';
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

  return (
    <div className="search-results-page">
      <Header showBackButton={true} onBackClick={onBackToSearch} />

      <main className="main-content">
        <section className="results-section">
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
              <div className="results-header">
                <h2>Search Results</h2>
                <p className="results-count">
                  Found {results.length} case{results.length !== 1 ? 's' : ''} for "{query}"
                </p>
              </div>
              <div className="results-grid">
                {results.map((caseItem, index) => (
                  <CaseCard
                    key={`${caseItem.caseId}-${index}`}
                    case={caseItem}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SearchResultsPage;
