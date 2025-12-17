import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import CaseCard from './CaseCard';
import LoadingSpinner from './LoadingSpinner';
import { SearchState, Case } from '../App';
import { useBookmarks } from '../hooks/useBookmarks';
import { Collection } from '../utils/bookmarkUtils';
import '../styles/SearchResultsPage.css';

interface SearchResultsPageProps {
  searchState: SearchState;
  onBackToSearch: () => void;
  onNavigateToBookmarks?: () => void;
}

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({
  searchState,
  onBackToSearch,
  onNavigateToBookmarks
}) => {
  const { query, results, loading, error } = searchState;
  const [showAddToCollectionModal, setShowAddToCollectionModal] = useState<Case | null>(null);
  
  const {
    isBookmarked,
    toggleBookmark,
    collections,
    addCaseToCollection
  } = useBookmarks();

  const handleAddToCollection = (collectionId: string) => {
    if (showAddToCollectionModal) {
      addCaseToCollection(collectionId, showAddToCollectionModal);
      setShowAddToCollectionModal(null);
    }
  };

  return (
    <div className="search-results-page">
      <Header 
        showBackButton={true} 
        onBackClick={onBackToSearch}
        onNavigateToBookmarks={onNavigateToBookmarks}
        showBookmarksLink={false}
      />

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
                    isBookmarked={isBookmarked(caseItem.caseId)}
                    onToggleBookmark={() => toggleBookmark(caseItem)}
                    onAddToCollection={() => setShowAddToCollectionModal(caseItem)}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      {/* Add to Collection Modal */}
      {showAddToCollectionModal && (
        <div className="modal-overlay" onClick={() => setShowAddToCollectionModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add to Collection</h3>
              <button className="modal-close" onClick={() => setShowAddToCollectionModal(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              {collections.length > 0 ? (
                <div className="collection-select-list">
                  {collections.map((collection: Collection) => (
                    <button
                      key={collection.id}
                      className="collection-select-item"
                      onClick={() => handleAddToCollection(collection.id)}
                    >
                      <i className="fas fa-folder"></i>
                      <span>{collection.name}</span>
                      <span className="collection-case-count">
                        {collection.caseIds.length} cases
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="no-collections-message">
                  <p>No collections yet. Visit Bookmarks to create one!</p>
                  {onNavigateToBookmarks && (
                    <button 
                      className="modal-btn create-btn"
                      onClick={() => {
                        setShowAddToCollectionModal(null);
                        onNavigateToBookmarks();
                      }}
                    >
                      <i className="fas fa-bookmark"></i>
                      Go to Bookmarks
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default SearchResultsPage;
