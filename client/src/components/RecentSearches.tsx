import React, { useEffect, useRef, useState } from "react";
import "../styles/RecentSearches.css";

interface RecentSearch {
  caseId: string;
  query: string;
  title: string;
  judges: string;
  date: string;
}

interface RecentSearchesProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (title: string) => void;
}

const RecentSearches: React.FC<RecentSearchesProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const [searches, setSearches] = useState<RecentSearch[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);


    const fetchRecentSearches = async () => {
    
    
    setIsLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "https://tools.wmflabs.org/ghanasupremecases";
      const res = await fetch(`${apiBase}/search`);
      const json = await res.json();

      if (json.success) {
        const filtered = json.results
          .slice(0, 50)
          .filter((item: RecentSearch) => !deletedIds.includes(item.caseId));
        setSearches(filtered);
      }
    } catch (error) {
      console.error("Failed to fetch recent searches:", error);
      setSearches([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchRecentSearches();
    }
  }, [visible, deletedIds]);

  const handleDeleteSimulated = (caseId: string) => {
    setDeletedIds((prev) => [...prev, caseId]);

    setSearches((prev) => prev.filter((item) => item.caseId !== caseId));
  };

  if (!visible) return null;

  return (
    <div ref={containerRef} className="recent-dropdown">
      {isLoading && (
        <div className="recent-loading">
          <div className="loading-spinner"></div>
          <span>Loading recent searches...</span>
        </div>
      )}
      {!isLoading && searches.length === 0 && (
        <div className="recent-empty">No recent searches</div>
      )}

      {!isLoading && searches.map((item, index) => (
        <div key={index} className="recent-row">
          <div
            className="recent-item-info"
            onClick={() => {
              onSelect(item.title);
              onClose();
            }}
          >
            <div className="recent-title">
              {item.title} <span className="recent-date">{item.date}</span>
            </div>
            <div className="recent-details">
              <span className="recent-judges">{item.judges}</span>
            </div>
          </div>
          <button
            className="recent-delete"
            onClick={() => handleDeleteSimulated(item.caseId)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default RecentSearches;
