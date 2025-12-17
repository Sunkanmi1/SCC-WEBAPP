import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import SearchResultsPage from './components/SearchResultsPage';
import AboutUs from './components/AboutUs';
import BookmarksPage from './components/BookmarksPage';
import './styles/App.css';

export interface Case {
  caseId: string;
  title: string;
  description: string;
  date: string;
  citation: string;
  court: string;
  majorityOpinion: string;
  sourceLabel: string;
  judges: string;
  articleUrl: string;
}

export interface SearchState {
  query: string;
  results: Case[];
  loading: boolean;
  error: string | null;
}

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'results' | 'about' | 'bookmarks'>('home');
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    results: [],
    loading: false,
    error: null
  });

  // Listen for custom event from Footer to navigate to About page
  useEffect(() => {
    const handleNavigateToAbout = () => {
      setCurrentView('about');
    };

    window.addEventListener('navigateToAbout', handleNavigateToAbout);
    return () => {
      window.removeEventListener('navigateToAbout', handleNavigateToAbout);
    };
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setSearchState(prev => ({ ...prev, loading: true, error: null, query }));
    setCurrentView('results');

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090';
      const response = await fetch(`${apiBaseUrl}/search?q=${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error('Search request failed');
      }

      // Since the backend returns HTML, we'll need to parse it or modify the backend
      // For now, let's simulate the expected response structure
      const data = await response.json();
      setSearchState(prev => ({
        ...prev,
        loading: false,
        results: data.results,
        error: data.results.length === 0 ? `No matches found for "${query}".` : null
      }));

    } catch (error) {
      setSearchState(prev => ({
        ...prev,
        loading: false,
        error: 'Please check your internet connection!'
      }));
    }
  };

  const handleBackToSearch = () => {
    setCurrentView('home');
    setSearchState(prev => ({ ...prev, query: '', results: [], error: null }));
  };

  const handleNavigateToAbout = () => {
    setCurrentView('about');
  };

  const handleNavigateToHome = () => {
    setCurrentView('home');
    setSearchState(prev => ({ ...prev, query: '', results: [], error: null }));
  };

  const handleNavigateToBookmarks = () => {
    setCurrentView('bookmarks');
  };

  return (
    <div className="app">
      {currentView === 'home' ? (
        <HomePage 
          onSearch={handleSearch} 
          onNavigateToAbout={handleNavigateToAbout}
          onNavigateToBookmarks={handleNavigateToBookmarks}
        />
      ) : currentView === 'about' ? (
        <AboutUs onNavigateToHome={handleNavigateToHome} />
      ) : currentView === 'bookmarks' ? (
        <BookmarksPage 
          onBackToHome={handleNavigateToHome}
          onNavigateToAbout={handleNavigateToAbout}
        />
      ) : (
        <SearchResultsPage
          searchState={searchState}
          onBackToSearch={handleBackToSearch}
          onNavigateToBookmarks={handleNavigateToBookmarks}
        />
      )}
    </div>
  );
}

export default App;