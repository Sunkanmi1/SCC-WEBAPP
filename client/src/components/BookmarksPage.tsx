import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import CaseCard from './CaseCard';
import LoadingSpinner from './LoadingSpinner';
import { Case } from '../App';
import { useBookmarks } from '../hooks/useBookmarks';
import { Collection } from '../utils/bookmarkUtils';
import '../styles/BookmarksPage.css';

interface BookmarksPageProps {
  onBackToHome: () => void;
  onNavigateToAbout?: () => void;
}

const BookmarksPage: React.FC<BookmarksPageProps> = ({ onBackToHome, onNavigateToAbout }) => {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'collections'>('bookmarks');
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddToCollectionModal, setShowAddToCollectionModal] = useState<Case | null>(null);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    bookmarkedCases,
    collections,
    isBookmarked,
    toggleBookmark,
    removeBookmark,
    clearAllBookmarks,
    createCollection,
    deleteCollection,
    addCaseToCollection,
    removeCaseFromCollection,
    getCasesInCollection,
    exportAllBookmarks,
    exportCollection,
    generateShareableLink
  } = useBookmarks();

  useEffect(() => {
    // Simulate loading for smooth UX
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      createCollection(newCollectionName.trim(), newCollectionDescription.trim());
      setNewCollectionName('');
      setNewCollectionDescription('');
      setShowCreateModal(false);
    }
  };

  const handleDeleteCollection = (collectionId: string) => {
    if (window.confirm('Are you sure you want to delete this collection? Cases will remain in your bookmarks.')) {
      deleteCollection(collectionId);
      if (selectedCollection?.id === collectionId) {
        setSelectedCollection(null);
      }
    }
  };

  const handleAddToCollection = (collectionId: string) => {
    if (showAddToCollectionModal) {
      addCaseToCollection(collectionId, showAddToCollectionModal);
      setShowAddToCollectionModal(null);
    }
  };

  const handleShareCollection = (collection: Collection) => {
    const link = generateShareableLink(collection.id);
    if (link) {
      setShareLink(link);
    }
  };

  const handleCopyLink = async () => {
    if (shareLink) {
      try {
        await navigator.clipboard.writeText(shareLink);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareLink;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    }
  };

  const handleClearAllBookmarks = () => {
    if (window.confirm('Are you sure you want to clear all bookmarks? This action cannot be undone.')) {
      clearAllBookmarks();
    }
  };

  const collectionCases = selectedCollection 
    ? getCasesInCollection(selectedCollection.id)
    : [];

  return (
    <div className="bookmarks-page">
      <Header 
        showBackButton={true} 
        onBackClick={onBackToHome} 
        onNavigateToAbout={onNavigateToAbout}
        showBookmarksLink={false}
      />

      <main className="bookmarks-main">
        <div className="bookmarks-container">
          {/* Page Header */}
          <div className="bookmarks-header">
            <div className="bookmarks-title-section">
              <h1 className="bookmarks-title">
                <i className="fas fa-bookmark"></i>
                My Library
              </h1>
              <p className="bookmarks-subtitle">
                Manage your saved cases and collections
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bookmarks-tabs">
            <button
              className={`tab-button ${activeTab === 'bookmarks' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('bookmarks');
                setSelectedCollection(null);
              }}
            >
              <i className="fas fa-bookmark"></i>
              <span>Bookmarks</span>
              <span className="tab-count">{bookmarkedCases.length}</span>
            </button>
            <button
              className={`tab-button ${activeTab === 'collections' ? 'active' : ''}`}
              onClick={() => setActiveTab('collections')}
            >
              <i className="fas fa-folder"></i>
              <span>Collections</span>
              <span className="tab-count">{collections.length}</span>
            </button>
          </div>

          {/* Content Area */}
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="bookmarks-content">
              {/* Bookmarks Tab */}
              {activeTab === 'bookmarks' && (
                <>
                  {bookmarkedCases.length > 0 ? (
                    <>
                      <div className="content-actions">
                        <button 
                          className="action-btn export-btn"
                          onClick={exportAllBookmarks}
                        >
                          <i className="fas fa-download"></i>
                          Export All
                        </button>
                        <button 
                          className="action-btn clear-btn"
                          onClick={handleClearAllBookmarks}
                        >
                          <i className="fas fa-trash"></i>
                          Clear All
                        </button>
                      </div>
                      <div className="cases-grid">
                        {bookmarkedCases.map((caseItem) => (
                          <div key={caseItem.caseId} className="bookmarked-case-wrapper">
                            <CaseCard 
                              case={caseItem}
                              isBookmarked={isBookmarked(caseItem.caseId)}
                              onToggleBookmark={() => toggleBookmark(caseItem)}
                              onAddToCollection={() => setShowAddToCollectionModal(caseItem)}
                            />
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="empty-state">
                      <i className="fas fa-bookmark empty-icon"></i>
                      <h3>No bookmarks yet</h3>
                      <p>Start bookmarking cases to save them for later reference.</p>
                      <button className="primary-btn" onClick={onBackToHome}>
                        <i className="fas fa-search"></i>
                        Search Cases
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* Collections Tab */}
              {activeTab === 'collections' && !selectedCollection && (
                <>
                  <div className="content-actions">
                    <button 
                      className="action-btn create-btn"
                      onClick={() => setShowCreateModal(true)}
                    >
                      <i className="fas fa-plus"></i>
                      New Collection
                    </button>
                  </div>

                  {collections.length > 0 ? (
                    <div className="collections-grid">
                      {collections.map((collection) => (
                        <div key={collection.id} className="collection-card">
                          <div className="collection-header">
                            <div className="collection-icon">
                              <i className="fas fa-folder"></i>
                            </div>
                            <div className="collection-info">
                              <h3 className="collection-name">{collection.name}</h3>
                              {collection.description && (
                                <p className="collection-description">{collection.description}</p>
                              )}
                              <span className="collection-meta">
                                {collection.caseIds.length} case{collection.caseIds.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                          <div className="collection-actions">
                            <button
                              className="collection-action-btn view-btn"
                              onClick={() => setSelectedCollection(collection)}
                            >
                              <i className="fas fa-eye"></i>
                              View
                            </button>
                            <button
                              className="collection-action-btn share-btn"
                              onClick={() => handleShareCollection(collection)}
                            >
                              <i className="fas fa-share-alt"></i>
                              Share
                            </button>
                            <button
                              className="collection-action-btn export-btn"
                              onClick={() => exportCollection(collection.id, collection.name)}
                            >
                              <i className="fas fa-download"></i>
                              Export
                            </button>
                            <button
                              className="collection-action-btn delete-btn"
                              onClick={() => handleDeleteCollection(collection.id)}
                            >
                              <i className="fas fa-trash"></i>
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <i className="fas fa-folder empty-icon"></i>
                      <h3>No collections yet</h3>
                      <p>Create collections to organize your bookmarked cases.</p>
                      <button className="primary-btn" onClick={() => setShowCreateModal(true)}>
                        <i className="fas fa-plus"></i>
                        Create Collection
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* Collection Detail View */}
              {activeTab === 'collections' && selectedCollection && (
                <>
                  <div className="collection-detail-header">
                    <button 
                      className="back-to-collections"
                      onClick={() => setSelectedCollection(null)}
                    >
                      <i className="fas fa-arrow-left"></i>
                      Back to Collections
                    </button>
                    <h2 className="collection-detail-title">
                      <i className="fas fa-folder-open"></i>
                      {selectedCollection.name}
                    </h2>
                    {selectedCollection.description && (
                      <p className="collection-detail-description">
                        {selectedCollection.description}
                      </p>
                    )}
                  </div>

                  {collectionCases.length > 0 ? (
                    <div className="cases-grid">
                      {collectionCases.map((caseItem) => (
                        <div key={caseItem.caseId} className="bookmarked-case-wrapper">
                          <CaseCard 
                            case={caseItem}
                            isBookmarked={isBookmarked(caseItem.caseId)}
                            onToggleBookmark={() => toggleBookmark(caseItem)}
                            onRemoveFromCollection={() => 
                              removeCaseFromCollection(selectedCollection.id, caseItem.caseId)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <i className="fas fa-folder-open empty-icon"></i>
                      <h3>This collection is empty</h3>
                      <p>Add cases from your bookmarks to this collection.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Create Collection Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Collection</h3>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="collection-name">Collection Name</label>
                <input
                  id="collection-name"
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="Enter collection name..."
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label htmlFor="collection-description">Description (optional)</label>
                <textarea
                  id="collection-description"
                  value={newCollectionDescription}
                  onChange={(e) => setNewCollectionDescription(e.target.value)}
                  placeholder="Describe your collection..."
                  rows={3}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn cancel-btn" onClick={() => setShowCreateModal(false)}>
                Cancel
              </button>
              <button 
                className="modal-btn create-btn"
                onClick={handleCreateCollection}
                disabled={!newCollectionName.trim()}
              >
                Create Collection
              </button>
            </div>
          </div>
        </div>
      )}

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
                  {collections.map((collection) => (
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
                  <p>No collections yet. Create one first!</p>
                  <button 
                    className="modal-btn create-btn"
                    onClick={() => {
                      setShowAddToCollectionModal(null);
                      setShowCreateModal(true);
                    }}
                  >
                    <i className="fas fa-plus"></i>
                    Create Collection
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Share Link Modal */}
      {shareLink && (
        <div className="modal-overlay" onClick={() => setShareLink(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Share Collection</h3>
              <button className="modal-close" onClick={() => setShareLink(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <p className="share-instructions">
                Copy this link to share your collection with others:
              </p>
              <div className="share-link-container">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="share-link-input"
                />
                <button className="copy-btn" onClick={handleCopyLink}>
                  <i className={`fas ${copySuccess ? 'fa-check' : 'fa-copy'}`}></i>
                  {copySuccess ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer onNavigateToAbout={onNavigateToAbout} />
    </div>
  );
};

export default BookmarksPage;
