import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../styles/HomePage.css";

interface HomePageProps {
  onSearch: (query: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onSearch }) => {
  interface CourtCase {
    caseId: string;
    title: string;
    description: string;
    date: string;
    citation: string;
    court: string;
    judges: string;
    sourceLabel: string;
    articleUrl: string;
  }
  const [query, setQuery] = useState("");

  const [year, setYear] = useState("");
  const [judge, setJudge] = useState("");
  const [country, setCountry] = useState("");
  const [results, setResults] = useState<CourtCase[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSearchResults = async (searchQuery: string) => {
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:9090/search?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      if (data.success) {
        setResults(data.results);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      fetchSearchResults(query.trim());
    }
  };

  const handleApplyFilters = async () => {
    const params = new URLSearchParams();

    if (year) params.append("year", year);
    if (judge) params.append("judge", judge);
    if (country) params.append("country", country);

    setLoading(true);

    const response = await fetch(
      `http://localhost:9090/browse?${params.toString()}`
    );
    const data = await response.json();

    if (data.success) {
      setResults(data.results);
    }

    setLoading(false);
  };

  const handleResetFilters = () => {
    setYear("");
    setJudge("");
    setCountry("");
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

          <div className="filter-panel">
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="">Select Year</option>
              <option value="2010">2010</option>
              <option value="2015">2015</option>
              <option value="2020">2020</option>
            </select>

            <select value={judge} onChange={(e) => setJudge(e.target.value)}>
              <option value="">Select Judge</option>
              <option value="Atuguba">Atuguba</option>
              <option value="Dotse">Dotse</option>
            </select>

            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">Select Country</option>
              <option value="Ghana">Ghana</option>
            </select>

            <div className="filter-actions">
              <button onClick={handleApplyFilters} className="apply-btn">
                Apply Filters
              </button>
              <button onClick={handleResetFilters} className="reset-btn">
                Reset
              </button>
            </div>
          </div>
          <br />

          {loading && <p className="loading-text">Loading results...</p>}

          {!loading && results.length === 0 && (
            <p className="no-results">No results found.</p>
          )}
        </div>
      </main>

      <div className="results-section">
        {!loading && results.length > 0 && (
          <div className="table-wrapper">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Citation</th>
                  <th>Court</th>
                  <th>Judges</th>
                  <th>Source</th>
                  <th>Article</th>
                </tr>
              </thead>

              <tbody>
                {results.map((item) => (
                  <tr key={item.caseId}>
                    <td>{item.caseId}</td>
                    <td>{item.title}</td>
                    <td>{item.description}</td>
                    <td>{item.date}</td>
                    <td>{item.citation}</td>
                    <td>{item.court}</td>
                    <td className="judges-cell">{item.judges}</td>
                    <td>{item.sourceLabel}</td>
                    <td>
                      <a
                        href={item.articleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
