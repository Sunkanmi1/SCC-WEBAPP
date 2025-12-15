import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import SearchResultsPage from './components/SearchResultsPage';
import AboutUs from './components/AboutUs';
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
  const [currentView, setCurrentView] = useState<'home' | 'results' | 'about'>('home');
  const [countryQid, setCountryQid] = useState<string>(() => localStorage.getItem('countryQid') || 'Q117');
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

  useEffect(() => {
    localStorage.setItem('countryQid', countryQid);
  }, [countryQid]);

  const handleSearch = async (query: string, opts?: { skipNavigation?: boolean }) => {
    if (!query.trim()) return;

    setSearchState(prev => ({ ...prev, loading: true, error: null, query }));
    if (!opts?.skipNavigation) setCurrentView('results');

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090';
      const response = await fetch(`${apiBaseUrl}/search?q=${encodeURIComponent(query)}&country=${encodeURIComponent(countryQid)}`);

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

  // Re-run search when country changes while viewing results
  useEffect(() => {
    if (currentView === 'results' && searchState.query) {
      handleSearch(searchState.query, { skipNavigation: true });
    }
  }, [countryQid]);

  const handleCountryChange = (qid: string) => {
    setCountryQid(qid);
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

  return (
    <div className="app">
      {currentView === 'home' ? (
        <HomePage 
          onSearch={handleSearch} 
          onNavigateToAbout={handleNavigateToAbout}
          selectedCountryQid={countryQid}
          onCountryChange={handleCountryChange}
        />
      ) : currentView === 'about' ? (
        <AboutUs onNavigateToHome={handleNavigateToHome} />
      ) : (
        <SearchResultsPage
          searchState={searchState}
          onBackToSearch={handleBackToSearch}
          selectedCountryQid={countryQid}
          onCountryChange={handleCountryChange}
        />
      )}
    </div>
  );
}

export default App;