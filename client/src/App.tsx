import React, { useState, useEffect } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import HomePage from "./components/HomePage";
import SearchResultsPage from "./components/SearchResultsPage";
import AboutUs from "./components/AboutUs";
import { FilterValues } from "./components/FilterPanel";
import { SearchHistoryManager } from "./utils/searchHistory";
import "./styles/App.css";

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

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SearchState {
  query: string;
  results: Case[];
  loading: boolean;
  error: string | null;
  isFiltered?: boolean;
  pagination?: PaginationInfo;
  appliedFilters?: FilterValues;
  totalCount?: number;
}

function App() {
  const [currentView, setCurrentView] = useState<"home" | "results" | "about">(
    "home"
  );
  const [searchState, setSearchState] = useState<SearchState>({
    query: "",
    results: [],
    loading: false,
    error: null,
  });
  const [isOffline, setIsOffline] = useState(false);

  // Listen for custom event from Footer to navigate to About page
  useEffect(() => {
    const handleNavigateToAbout = () => {
      setCurrentView("about");
    };

    window.addEventListener("navigateToAbout", handleNavigateToAbout);
    return () => {
      window.removeEventListener("navigateToAbout", handleNavigateToAbout);
    };
  }, []);

  const handleSearch = async (
    query: string,
    page: number = 1,
    limit: number = 20
  ) => {
    if (!query.trim()) return;

    setSearchState((prev) => ({ ...prev, loading: true, error: null, query }));
    setCurrentView("results");

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://tools.wmflabs.org/ghanasupremecases";
      const response = await fetch(
        `${apiBaseUrl}/search?q=${encodeURIComponent(
          query
        )}&page=${page}&limit=${limit}`,
        {
          signal: AbortSignal.timeout(30000), // 30 second timeout
        }
      );

      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = "Unable to fetch cases.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If response is not JSON, use status-based message
          if (response.status === 500) {
            errorMessage =
              "Server error. The backend may be experiencing issues.";
          } else if (response.status === 404) {
            errorMessage =
              "API endpoint not found. Please check if the backend server is running.";
          } else if (response.status === 503) {
            errorMessage =
              "Service temporarily unavailable. Wikidata may be slow to respond.";
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Validate response structure
      if (!data || typeof data !== "object") {
        throw new Error("Invalid response format from server.");
      }

      if (!Array.isArray(data.results)) {
        throw new Error(
          "Unexpected response format. Results should be an array."
        );
      }

      // Save to search history
      SearchHistoryManager.addToHistory(query, data.results.length);

      setSearchState((prev) => ({
        ...prev,
        loading: false,
        results: data.results,
        pagination: data.pagination,
        totalCount: data.results.length,
        error:
          data.results.length === 0 ? `No matches found for "${query}".` : null,
      }));
    } catch (error: any) {
      let errorMessage = "Unable to fetch cases.";

      if (error.name === "AbortError" || error.name === "TimeoutError") {
        errorMessage =
          "Request timed out. Wikidata may be slow. Please try again.";
      } else if (
        error.name === "TypeError" &&
        error.message.includes("fetch")
      ) {
        errorMessage =
          "Cannot connect to backend server. Please ensure the backend is reachable.";
      } else if (error.message) {
        errorMessage = error.message;
      } else {
        errorMessage = "An unexpected error occurred. Please try again.";
      }

      console.error("Search error:", error);
      setSearchState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  };

  const handleBackToSearch = () => {
    setCurrentView("home");
    setSearchState((prev) => ({
      ...prev,
      query: "",
      results: [],
      error: null,
      isFiltered: false,
    }));
  };

  const handleNavigateToAbout = () => {
    setCurrentView("about");
  };

  const handleNavigateToHome = () => {
    setCurrentView("home");
    setSearchState((prev) => ({
      ...prev,
      query: "",
      results: [],
      error: null,
      isFiltered: false,
    }));
  };

  const handleApplyFilters = async (
    filters: FilterValues,
    page: number = 1,
    limit: number = 20
  ) => {
    setSearchState((prev) => ({ ...prev, loading: true, error: null }));
    setCurrentView("results");

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://tools.wmflabs.org/ghanasupremecases";

      // Build query parameters
      const params = new URLSearchParams();
      if (filters.keyword) params.append("keyword", filters.keyword);
      if (filters.year) params.append("year", filters.year);
      if (filters.judge) params.append("judge", filters.judge);
      if (filters.caseType) params.append("type", filters.caseType);
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const response = await fetch(
        `${apiBaseUrl}/filter?${params.toString()}`,
        {
          signal: AbortSignal.timeout(30000), // 30 second timeout
        }
      );

      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = "Unable to filter cases.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If response is not JSON, use status-based message
          if (response.status === 500) {
            errorMessage =
              "Server error. The backend may be experiencing issues.";
          } else if (response.status === 404) {
            errorMessage =
              "Filter endpoint not found. Please check if the backend server is running.";
          } else if (response.status === 503) {
            errorMessage =
              "Service temporarily unavailable. Wikidata may be slow to respond.";
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Validate response structure
      if (!data || typeof data !== "object") {
        throw new Error("Invalid response format from server.");
      }

      if (!Array.isArray(data.results)) {
        throw new Error(
          "Unexpected response format. Results should be an array."
        );
      }

      setSearchState((prev) => ({
        ...prev,
        loading: false,
        results: data.results || [],
        pagination: data.pagination,
        totalCount: data.results?.length || 0,
        appliedFilters: filters,
        error:
          data.results && data.results.length === 0
            ? "No cases found matching the filters."
            : null,
        isFiltered: true,
        query: "", // Clear query when using filters
      }));
    } catch (error: any) {
      let errorMessage = "Unable to filter cases.";

      if (error.name === "AbortError" || error.name === "TimeoutError") {
        errorMessage =
          "Request timed out. Wikidata may be slow. Please try again.";
      } else if (
        error.name === "TypeError" &&
        error.message.includes("fetch")
      ) {
        errorMessage =
          "Cannot connect to backend server. Please ensure the backend is reachable.";
      } else if (error.message) {
        errorMessage = error.message;
      } else {
        errorMessage = "An unexpected error occurred. Please try again.";
      }

      console.error("Filter error:", error);
      setSearchState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  };

  const handleResetFilters = async () => {
    // Reset to show all cases or go back to home
    setSearchState((prev) => ({
      ...prev,
      query: "",
      results: [],
      error: null,
      isFiltered: false,
    }));
    setCurrentView("home");
  };

  return (
    <ThemeProvider>
      <div className="app">
        {currentView === "home" ? (
          <HomePage
            onSearch={handleSearch}
            onNavigateToAbout={handleNavigateToAbout}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
          />
        ) : currentView === "about" ? (
          <AboutUs onNavigateToHome={handleNavigateToHome} />
        ) : (
          <SearchResultsPage
            searchState={searchState}
            onBackToSearch={handleBackToSearch}
            onApplyFilters={(filters, page, limit) =>
              handleApplyFilters(filters, page || 1, limit || 20)
            }
            onResetFilters={handleResetFilters}
            onNavigateToHome={handleNavigateToHome}
            onNavigateToAbout={handleNavigateToAbout}
            onRetry={() => {
              if (searchState.query) {
                handleSearch(searchState.query, 1, 20);
              }
            }}
            onSearch={(query, page, limit) =>
              handleSearch(query, page || 1, limit || 20)
            }
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
