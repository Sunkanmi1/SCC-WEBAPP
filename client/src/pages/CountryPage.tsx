import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCountryData } from "../hooks/useCountryData";
import "../styles/CountryPage.css";

interface CountryPageProps {
  countryCode: string;
}

/**
 * Dynamic country page component
 *
 * This component fetches and displays supreme court cases for a specific country.
 * The URL format is /:countryCode (e.g., /gh for Ghana, /ng for Nigeria)
 *
 * @example
 * // In your router configuration:
 * <Route path="/gh" element={<CountryPage countryCode="GH" />} />
 * <Route path="/ng" element={<CountryPage countryCode="NG" />} />
 */
const CountryPage: React.FC<CountryPageProps> = ({ countryCode }) => {
  const { data, loading, error, refetch } = useCountryData(countryCode);

  if (loading) {
    return (
      <div className="country-page">
        <Header currentCountryCode={countryCode} />
        <main className="country-content">
          <div className="loading-state">
            <p>Loading {countryCode} Supreme Court Cases...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="country-page">
        <Header currentCountryCode={countryCode} />
        <main className="country-content">
          <div className="error-state">
            <h2>Error Loading Data</h2>
            <p>{error}</p>
            <button onClick={refetch} className="retry-button">
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="country-page">
      <Header currentCountryCode={countryCode} />

      <main className="country-content">
        <div className="country-header">
          <h1>{data?.metadata?.country} Supreme Court Cases</h1>
          <p className="country-subtitle">
            Explore legal judgments from {data?.metadata?.country}'s Supreme
            Court
          </p>
          {data?.metadata?.totalCases !== undefined && (
            <p className="case-count">
              Total Cases: {data.metadata.totalCases}
            </p>
          )}
        </div>

        <div className="cases-container">
          {data?.cases && data.cases.length > 0 ? (
            <div className="cases-grid">
              {data.cases.map((caseItem, index: number) => (
                <div key={index} className="case-card">
                  {/* Your case card content here */}
                  <h3>{caseItem.title || "Case Title"}</h3>
                  <p>{caseItem.description || "Case description..."}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No cases found for {data?.metadata?.country}.</p>
              <p className="empty-subtitle">Check back later for updates.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CountryPage;
