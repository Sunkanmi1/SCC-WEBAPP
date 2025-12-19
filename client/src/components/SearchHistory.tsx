import React from 'react';
import { SearchHistoryManager, SearchHistoryItem } from '../utils/searchHistory';
import '../styles/SearchHistory.css';

interface SearchHistoryProps {
  isVisible: boolean;
  onSelectQuery: (query: string) => void;
  onClearHistory: () => void;
  onClose: () => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({
  isVisible,
  onSelectQuery,
  onClearHistory,
  onClose,
}) => {
  const [history, setHistory] = React.useState<SearchHistoryItem[]>([]);

  React.useEffect(() => {
    if (isVisible) {
      setHistory(SearchHistoryManager.getHistory());
    }
  }, [isVisible]);

  const handleClear = () => {
    SearchHistoryManager.clearHistory();
    setHistory([]);
    onClearHistory();
  };

  if (!isVisible || history.length === 0) {
    return null;
  }

  return (
    <div className="search-history">
      <div className="search-history-header">
        <span className="search-history-title">
          <i className="fas fa-history"></i>
          Recent Searches
        </span>
        <button
          className="search-history-clear"
          onClick={handleClear}
          aria-label="Clear search history"
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>
      <ul className="search-history-list">
        {history.map((item, index) => (
          <li
            key={`${item.query}-${item.timestamp}`}
            className="search-history-item"
            onClick={() => onSelectQuery(item.query)}
          >
            <div className="search-history-content">
              <i className="fas fa-clock"></i>
              <span className="search-history-query">{item.query}</span>
              {item.resultCount !== undefined && (
                <span className="search-history-count">
                  {item.resultCount} result{item.resultCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <button
              className="search-history-remove"
              onClick={(e) => {
                e.stopPropagation();
                SearchHistoryManager.removeFromHistory(item.query);
                setHistory(prev => prev.filter(h => h.query !== item.query));
              }}
              aria-label={`Remove ${item.query} from history`}
            >
              <i className="fas fa-times"></i>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchHistory;

