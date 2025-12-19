import React, { useState } from 'react';
import '../styles/FilterPanel.css';

export interface FilterValues {
  keyword: string;
  year: string;
  judge: string;
  caseType: string;
}

interface FilterPanelProps {
  onApplyFilters: (filters: FilterValues) => void;
  onResetFilters: () => void;
  isLoading?: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  onApplyFilters, 
  onResetFilters,
  isLoading = false 
}) => {
  const [filters, setFilters] = useState<FilterValues>({
    keyword: '',
    year: '',
    judge: '',
    caseType: ''
  });

  const handleInputChange = (field: keyof FilterValues, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilters(filters);
  };

  const handleReset = () => {
    setFilters({
      keyword: '',
      year: '',
      judge: '',
      caseType: ''
    });
    onResetFilters();
  };

  const hasActiveFilters = filters.keyword || filters.year || filters.judge || filters.caseType;

  // Generate year options (1960 to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1959 }, (_, i) => currentYear - i);

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3 className="filter-title">
          <i className="fas fa-filter"></i>
          Filter Results
        </h3>
      </div>

      <form className="filter-form" onSubmit={handleApply}>
        <div className="filter-grid">
          {/* Keyword Filter */}
          <div className="filter-group">
            <label htmlFor="keyword" className="filter-label">
              <i className="fas fa-search"></i>
              Keyword
            </label>
            <input
              type="text"
              id="keyword"
              value={filters.keyword}
              onChange={(e) => handleInputChange('keyword', e.target.value)}
              placeholder="Search in title, description..."
              className="filter-input"
            />
          </div>

          {/* Year Filter */}
          <div className="filter-group">
            <label htmlFor="year" className="filter-label">
              <i className="fas fa-calendar-alt"></i>
              Year
            </label>
            <select
              id="year"
              value={filters.year}
              onChange={(e) => handleInputChange('year', e.target.value)}
              className="filter-select"
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Judge Filter */}
          <div className="filter-group">
            <label htmlFor="judge" className="filter-label">
              <i className="fas fa-user-gavel"></i>
              Judge
            </label>
            <input
              type="text"
              id="judge"
              value={filters.judge}
              onChange={(e) => handleInputChange('judge', e.target.value)}
              placeholder="Enter judge name..."
              className="filter-input"
            />
          </div>

          {/* Case Type Filter */}
          <div className="filter-group">
            <label htmlFor="caseType" className="filter-label">
              <i className="fas fa-gavel"></i>
              Case Type
            </label>
            <select
              id="caseType"
              value={filters.caseType}
              onChange={(e) => handleInputChange('caseType', e.target.value)}
              className="filter-select"
            >
              <option value="">All Types</option>
              <option value="criminal">Criminal</option>
              <option value="civil">Civil</option>
              <option value="constitutional">Constitutional</option>
              <option value="administrative">Administrative</option>
              <option value="commercial">Commercial</option>
              <option value="family">Family</option>
              <option value="labor">Labor</option>
              <option value="property">Property</option>
            </select>
          </div>
        </div>

        <div className="filter-actions">
          <button 
            type="submit" 
            className="filter-button filter-button-apply"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Applying...
              </>
            ) : (
              <>
                <i className="fas fa-check"></i>
                Apply Filters
              </>
            )}
          </button>
          
          <button 
            type="button" 
            onClick={handleReset}
            className="filter-button filter-button-reset"
            disabled={isLoading || !hasActiveFilters}
          >
            <i className="fas fa-redo"></i>
            Reset
          </button>
        </div>

        {hasActiveFilters && (
          <div className="active-filters">
            <span className="active-filters-label">Active Filters:</span>
            <div className="active-filters-tags">
              {filters.keyword && (
                <span className="filter-tag">
                  Keyword: {filters.keyword}
                  <button 
                    type="button"
                    onClick={() => handleInputChange('keyword', '')}
                    className="filter-tag-remove"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.year && (
                <span className="filter-tag">
                  Year: {filters.year}
                  <button 
                    type="button"
                    onClick={() => handleInputChange('year', '')}
                    className="filter-tag-remove"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.judge && (
                <span className="filter-tag">
                  Judge: {filters.judge}
                  <button 
                    type="button"
                    onClick={() => handleInputChange('judge', '')}
                    className="filter-tag-remove"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.caseType && (
                <span className="filter-tag">
                  Type: {filters.caseType}
                  <button 
                    type="button"
                    onClick={() => handleInputChange('caseType', '')}
                    className="filter-tag-remove"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default FilterPanel;

