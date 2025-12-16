import React, { useState, useEffect } from 'react';
import Tooltip from './Tooltip';
import '../styles/FilterPanel.css';

export interface FilterOptions {
  year: string;
  judge: string;
  keyword: string;
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  availableYears: string[];
  availableJudges: string[];
  currentFilters: FilterOptions;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  availableYears,
  availableJudges,
  currentFilters
}) => {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClear = () => {
    const emptyFilters: FilterOptions = { year: '', judge: '', keyword: '' };
    setFilters(emptyFilters);
    onApplyFilters(emptyFilters);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="filter-overlay" onClick={onClose}></div>
      <div className="filter-panel">
        <div className="filter-header">
          <h3>
            <i className="fas fa-filter"></i>
            Filter Cases
          </h3>
          <button className="filter-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="filter-body">
          {/* Year Filter */}
          <div className="filter-group">
            <label htmlFor="year-filter">
              <i className="fas fa-calendar-alt"></i>
              Year
              <Tooltip content="Filter cases by the year the decision was made. Select a specific year to narrow down your results.">
                <span className="tooltip-icon">
                  <i className="fas fa-question-circle"></i>
                </span>
              </Tooltip>
            </label>
            <select
              id="year-filter"
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              className="filter-select"
            >
              <option value="">All Years</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Judge Filter */}
          <div className="filter-group">
            <label htmlFor="judge-filter">
              <i className="fas fa-gavel"></i>
              Judge
              <Tooltip content="Filter cases by a specific judge or justice who presided over the case. This helps you find decisions by particular judges.">
                <span className="tooltip-icon">
                  <i className="fas fa-question-circle"></i>
                </span>
              </Tooltip>
            </label>
            <select
              id="judge-filter"
              value={filters.judge}
              onChange={(e) => setFilters({ ...filters, judge: e.target.value })}
              className="filter-select"
            >
              <option value="">All Judges</option>
              {availableJudges.map((judge) => (
                <option key={judge} value={judge}>
                  {judge}
                </option>
              ))}
            </select>
          </div>

          {/* Keyword Filter */}
          <div className="filter-group">
            <label htmlFor="keyword-filter">
              <i className="fas fa-key"></i>
              Keyword
              <Tooltip content="Search for specific words or phrases within the current results. This filters across titles, descriptions, citations, and other case details.">
                <span className="tooltip-icon">
                  <i className="fas fa-question-circle"></i>
                </span>
              </Tooltip>
            </label>
            <input
              type="text"
              id="keyword-filter"
              value={filters.keyword}
              onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
              placeholder="Search in results..."
              className="filter-input"
            />
          </div>
        </div>

        <div className="filter-footer">
          <button className="filter-btn filter-btn-clear" onClick={handleClear}>
            <i className="fas fa-eraser"></i>
            Clear All
          </button>
          <button className="filter-btn filter-btn-apply" onClick={handleApply}>
            <i className="fas fa-check"></i>
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;
