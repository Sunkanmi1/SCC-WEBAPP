import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import '../styles/HomePage.css';

interface HomePageProps {
  onSearch: (query: string) => void;
  onNavigateToAbout?: () => void;
  selectedCountryQid?: string;
  onCountryChange?: (qid: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onSearch, onNavigateToAbout, selectedCountryQid = 'Q117', onCountryChange }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="home-page">
      <Header 
        showBackButton={false} 
        onNavigateToAbout={onNavigateToAbout}
        selectedCountryQid={selectedCountryQid}
        onCountryChange={onCountryChange}
      />
      
      <main className="hero-section">
        <div className="hero-overlay">
          <h1 className="hero-title">SUPREME COURT CASES</h1>
          
          <form className="search-container" onSubmit={handleSubmit}>
            <div className="search-box">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a case by name, number, or keyword"
                className="search-input"
                aria-label="Search input"
                title="Search for a case by name, number, or keyword"
                autoComplete="off"
                required
              />
              <button type="submit" className="search-button" aria-label="Search" title="Search">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer onNavigateToAbout={onNavigateToAbout} />
    </div>
  );
};

export default HomePage;
