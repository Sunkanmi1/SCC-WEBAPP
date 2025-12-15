import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import '../styles/HomePage.css';

interface HomePageProps {
  onSearch: (query: string) => void;
  onNavigateToBrowse: () => void;
  onNavigateToAbout?: () => void;
}

type TabMode = 'search' | 'browse';

const HomePage: React.FC<HomePageProps> = ({ onSearch, onNavigateToBrowse, onNavigateToAbout }) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabMode>('search');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleBrowseClick = () => {
    onNavigateToBrowse();
  };

  return (
    <div className="home-page">
      <Header showBackButton={false} onNavigateToAbout={onNavigateToAbout} />
      
      <main className="hero-section">
        <div className="hero-overlay">
          <h1 className="hero-title">SUPREME COURT CASES</h1>
          
          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button
              className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}
              onClick={() => setActiveTab('search')}
            >
              <i className="fas fa-search"></i>
              <span>Search</span>
            </button>
            <button
              className={`tab-button ${activeTab === 'browse' ? 'active' : ''}`}
              onClick={() => setActiveTab('browse')}
            >
              <i className="fas fa-th-large"></i>
              <span>Browse</span>
            </button>
          </div>

          {/* Search Mode */}
          {activeTab === 'search' && (
            <form className="search-container" onSubmit={handleSubmit}>
              <div className="search-box">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for a case by name, number, or keyword"
                  className="search-input"
                  autoComplete="off"
                  required
                />
                <button type="submit" className="search-button">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </form>
          )}

          {/* Browse Mode */}
          {activeTab === 'browse' && (
            <div className="browse-container">
              <p className="browse-description">
                Explore Supreme Court cases organized by legal categories
              </p>
              <button 
                className="browse-button"
                onClick={handleBrowseClick}
              >
                <i className="fas fa-folder-open"></i>
                <span>Browse by Category</span>
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer onNavigateToAbout={onNavigateToAbout} />
    </div>
  );
};

export default HomePage;
