import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import '../styles/HomePage.css';

interface HomePageProps {
  onSearch: (query: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="home-page">
      <Header showBackButton={false} />
      
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
                autoComplete="off"
                required
              />
              <button type="submit" className="search-button">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
