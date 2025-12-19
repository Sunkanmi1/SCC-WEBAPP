import React from 'react';
import '../styles/SortOptions.css';

export type SortOption = 'relevance' | 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc';

interface SortOptionsProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalResults: number;
}

const SortOptions: React.FC<SortOptionsProps> = ({
  currentSort,
  onSortChange,
  totalResults,
}) => {
  const sortOptions: Array<{ value: SortOption; label: string; icon: string }> = [
    { value: 'relevance', label: 'Relevance', icon: 'fa-star' },
    { value: 'date-desc', label: 'Newest First', icon: 'fa-calendar-alt' },
    { value: 'date-asc', label: 'Oldest First', icon: 'fa-calendar' },
    { value: 'title-asc', label: 'Title (A-Z)', icon: 'fa-sort-alpha-down' },
    { value: 'title-desc', label: 'Title (Z-A)', icon: 'fa-sort-alpha-up' },
  ];

  return (
    <div className="sort-options-container">
      <div className="sort-info">
        <span className="sort-results-count">
          <i className="fas fa-list"></i>
          {totalResults} case{totalResults !== 1 ? 's' : ''} found
        </span>
      </div>
      <div className="sort-controls">
        <label htmlFor="sort-select" className="sort-label">
          <i className="fas fa-sort"></i>
          Sort by:
        </label>
        <select
          id="sort-select"
          className="sort-select"
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          aria-label="Sort results"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SortOptions;

