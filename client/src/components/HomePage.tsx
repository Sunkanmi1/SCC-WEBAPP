import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../styles/HomePage.css";
import RecentSearches from "./RecentSearches";

interface HomePageProps {
  onSearch: (query: string) => void;
  onNavigateToBrowse: () => void;
  onNavigateToAbout?: () => void;
}

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

const HomePage: React.FC<HomePageProps> = ({ onSearch, onNavigateToAbout }) => {
  const [query, setQuery] = useState("");

  const [year, setYear] = useState("");
  const [judge, setJudge] = useState("");
  const [country, setCountry] = useState("");
  const [results, setResults] = useState<CourtCase[]>([]);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [showRecent, setShowRecent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
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
    if (data.success) setResults(data.results);
    setLoading(false);
  };

  const handleResetFilters = () => {
    setYear("");
    setJudge("");
    setCountry("");
  };

  const toggleCardExpansion = (caseId: string) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(caseId)) {
        newSet.delete(caseId);
      } else {
        newSet.add(caseId);
      }
      return newSet;
    });
  };

  return (
    <div className="home-page">
      <Header showBackButton={false} onNavigateToAbout={onNavigateToAbout} />

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
                onFocus={() => setShowRecent(true)}
              />
              <button type="submit" className="search-button">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </form>

          <RecentSearches
            visible={showRecent}
            onClose={() => setShowRecent(false)}
            onSelect={(title) => {
              setQuery(title);
              onSearch(title);
            }}
          />
        </div>
      </main>

      {/* RESULTS TABLE (main preserved) */}
      <div className="results-section">
        {!loading && results.length > 0 && (
          <>
            <div className="mobile-results-cards">
              {results.map((item) => (
                <div key={item.caseId} className="case-card">
                  <div className="card-header">
                    <span className="card-case-id">{item.caseId}</span>
                    <span className="card-date">{item.date}</span>
                  </div>
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-description-preview">
                    {item.description.substring(0, 150)}...
                  </p>
                  <div className="card-quick-info">
                    <div className="card-info-item">
                      <span className="card-info-label">Citation</span>
                      <span className="card-info-value">{item.citation}</span>
                    </div>
                    <div className="card-info-item">
                      <span className="card-info-label">Court</span>
                      <span className="card-info-value">{item.court}</span>
                    </div>
                  </div>

                  <div
                    className={`card-expandable-section ${
                      expandedCards.has(item.caseId) ? "expanded" : ""
                    }`}
                  >
                    <div className="card-detail-item">
                      <span className="card-detail-label">
                        Full Description
                      </span>
                      <p className="card-detail-value">{item.description}</p>
                    </div>
                    <div className="card-detail-item">
                      <span className="card-detail-label">Judges</span>
                      <div className="card-judges card-detail-value">
                        {item.judges}
                      </div>
                    </div>
                    <div className="card-detail-item">
                      <span className="card-detail-label">Source</span>
                      <span className="card-detail-value">
                        {item.sourceLabel}
                      </span>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button
                      className={`expand-toggle-btn ${
                        expandedCards.has(item.caseId) ? "expanded" : ""
                      }`}
                      onClick={() => toggleCardExpansion(item.caseId)}
                    >
                      <i className="fas fa-chevron-down"></i>
                      <span>
                        {expandedCards.has(item.caseId)
                          ? "Hide Details"
                          : "Show Details"}
                      </span>
                    </button>
                    <a
                      href={item.articleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-view-link"
                    >
                      <i className="fas fa-external-link-alt"></i>
                      View Article
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="filter-table-wrapper">
              <table className="filter-results-table">
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
                      <td className="title-cell">{item.title}</td>
                      <td className="description-cell">{item.description}</td>
                      <td className="date-cell">{item.date}</td>
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
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
