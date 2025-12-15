import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/RecentSearches.css";

interface RecentSearch {
  query: string;
  year?: string;
  judge?: string;
  type?: string;
  timestamp: string;
}

interface Props {
  onSearchSelect: (search: { query: string; year?: string; judge?: string; type?: string }) => void;
}

const RecentSearches: React.FC<Props> = ({ onSearchSelect }) => {
  const [searches, setSearches] = useState<RecentSearch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch recent searches on mount
  useEffect(() => {
    fetchRecentSearches();
  }, []);

  const fetchRecentSearches = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:9090/recent-searches");
      setSearches(res.data.searches || []);
    } catch (err) {
      console.error("Failed to fetch recent searches:", err);
      setError("Unable to load recent searches");
      setSearches([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearches = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.delete("http://localhost:9090/recent-searches");
      setSearches([]);
    } catch (err) {
      console.error("Failed to clear recent searches:", err);
      setError("Unable to clear recent searches");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recent-searches">
      <div className="recent-header">
        <h3>Recent Searches</h3>
        {searches.length > 0 && (
          <button onClick={clearSearches} className="clear-btn">
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : searches.length === 0 ? (
        <p className="empty-text">No recent searches</p>
      ) : (
        <ul className="recent-list">
          {searches.map((item, index) => (
            <li
              key={index}
              onClick={() =>
                onSearchSelect({
                  query: item.query,
                  year: item.year,
                  judge: item.judge,
                  type: item.type
                })
              }
            >
              <strong>{item.query}</strong>
              {item.year && ` | Year: ${item.year}`}
              {item.judge && ` | Judge: ${item.judge}`}
              {item.type && ` | Type: ${item.type}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentSearches;
