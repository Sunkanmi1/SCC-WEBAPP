import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import SearchResultsPage from "./components/SearchResultsPage";
import AboutUs from "./components/AboutUs";
import CountryPage from "./components/CountryPage";
import "./styles/App.css";
import AnalyticsDashboard from "./components/AnalyticsDashboard";

export interface Case {
  type: string;
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
  const navigate = useNavigate();
  const [searchState, setSearchState] = useState<SearchState>({
    query: "",
    results: [],
    loading: false,
    error: null,
  });

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setSearchState((prev) => ({ ...prev, loading: true, error: null, query }));
    navigate("/search");

    try {
      const apiBaseUrl =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:9090";
      const response = await fetch(
        `${apiBaseUrl}/search?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Search request failed");
      }

      const data = await response.json();
      setSearchState((prev) => ({
        ...prev,
        loading: false,
        results: data.results,
        error:
          data.results.length === 0 ? `No matches found for "${query}".` : null,
      }));
    } catch (error) {
      setSearchState((prev) => ({
        ...prev,
        loading: false,
        error: "Please check your internet connection!",
      }));
    }
  };

  const handleNavigateToBrowse = () => {
    setCurrentView('browse');
  };

  const handleBackToSearch = () => {
    navigate("/");
    setSearchState((prev) => ({
      ...prev,
      query: "",
      results: [],
      error: null,
    }));
  };

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage onSearch={handleSearch} />} />
        <Route path="/about" element={<AboutUs />} />
        <Route
          path="/statistics"
          element={<AnalyticsDashboard  />}
        />

        <Route
          path="/search"
          element={
            <SearchResultsPage
              searchState={searchState}
              onBackToSearch={handleBackToSearch}
            />
          }
        />
        <Route path="/country/:countryCode" element={<CountryPage />} />
      </Routes>
    </div>
  );
}

export default App;
