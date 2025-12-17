import React, { useState } from 'react';
import '../styles/FilterButton.css';

export interface FilterOptions {
  yearFrom: string;
  yearTo: string;
  country: string;
  judge: string;
  keywords: string;
}

interface FilterButtonProps {
  onApplyFilters: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

const FilterButton: React.FC<FilterButtonProps> = ({ onApplyFilters, currentFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  const currentYear = new Date().getFullYear();
  const hasActiveFilters = 
    filters.yearFrom !== '' || 
    filters.yearTo !== '' || 
    filters.country !== '' || 
    filters.judge !== '' || 
    filters.keywords !== '';

  const handleInputChange = (field: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    console.log('🎯 FilterButton: Apply clicked with filters:', filters);
    onApplyFilters(filters);
    setIsOpen(false);
  };

  const handleClear = () => {
    const clearedFilters: FilterOptions = {
      yearFrom: '',
      yearTo: '',
      country: '',
      judge: '',
      keywords: ''
    };
    setFilters(clearedFilters);
    onApplyFilters(clearedFilters);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button 
        type="button"
        className={`filter-button ${hasActiveFilters ? 'active' : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label="Open filters"
      >
        <i className="fas fa-filter"></i>
        <span className="filter-text">Filters</span>
        {hasActiveFilters && <span className="filter-badge"></span>}
      </button>

      {isOpen && (
        <div className="filter-modal-overlay" onClick={handleClose}>
          <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
            <div className="filter-modal-header">
              <h3>
                <i className="fas fa-filter"></i>
                Advanced Search Filters
              </h3>
              <button 
                className="close-button" 
                onClick={handleClose}
                aria-label="Close filters"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="filter-modal-body">
              {/* Year Range Filter */}
              <div className="filter-group">
                <label className="filter-label">
                  <i className="fas fa-calendar-alt"></i>
                  Year Range
                </label>
                <div className="year-range-inputs">
                  <input
                    type="number"
                    placeholder="From (e.g., 1960)"
                    value={filters.yearFrom}
                    onChange={(e) => handleInputChange('yearFrom', e.target.value)}
                    min="1960"
                    max={currentYear}
                    className="filter-input year-input"
                  />
                  <span className="year-separator">to</span>
                  <input
                    type="number"
                    placeholder={`To (e.g., ${currentYear})`}
                    value={filters.yearTo}
                    onChange={(e) => handleInputChange('yearTo', e.target.value)}
                    min="1960"
                    max={currentYear}
                    className="filter-input year-input"
                  />
                </div>
                <p className="filter-hint">Filter cases by year of decision</p>
              </div>

              {/* Country/Jurisdiction Filter */}
              <div className="filter-group">
                <label className="filter-label">
                  <i className="fas fa-globe-africa"></i>
                  Country/Jurisdiction
                </label>
                <select
                  value={filters.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="filter-input filter-select"
                  disabled
                >
                  <option value="">Ghana (Only)</option>
                  <option value="Ghana">Ghana</option>
                </select>
                <p className="filter-hint">Currently showing cases from Ghana only</p>
              </div>

              {/* Judge Filter */}
              <div className="filter-group">
                <label className="filter-label">
                  <i className="fas fa-user-tie"></i>
                  Judge Name
                </label>
                <input
                  type="text"
                  placeholder="Enter judge's name (e.g., Akuffo)"
                  value={filters.judge}
                  onChange={(e) => handleInputChange('judge', e.target.value)}
                  className="filter-input"
                />
                <p className="filter-hint">Filter by presiding or contributing judge</p>
              </div>

              {/* Keywords Filter */}
              <div className="filter-group">
                <label className="filter-label">
                  <i className="fas fa-tags"></i>
                  Legal Keywords/Topics
                </label>
                <input
                  type="text"
                  placeholder="Enter keywords (e.g., human rights, constitution)"
                  value={filters.keywords}
                  onChange={(e) => handleInputChange('keywords', e.target.value)}
                  className="filter-input"
                />
                <p className="filter-hint">Enter relevant legal terms or topics</p>
              </div>
            </div>

            <div className="filter-modal-footer">
              <button 
                className="filter-action-button clear-button"
                onClick={handleClear}
              >
                <i className="fas fa-undo"></i>
                Clear All
              </button>
              <button 
                className="filter-action-button apply-button"
                onClick={handleApply}
              >
                <i className="fas fa-check"></i>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterButton;
