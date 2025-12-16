import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Country, getEnabledCountries, getCountryByCode } from '../config/countries';
import '../styles/CountryNav.css';

interface CountryNavProps {
  currentCountry?: string;
}

const CountryNav: React.FC<CountryNavProps> = ({ currentCountry = 'GH' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(
    getCountryByCode(currentCountry)
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const enabledCountries = getEnabledCountries();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    // Navigate to country-specific page
    navigate(`/country/${country.code.toLowerCase()}`);
  };

  return (
    <div className="country-nav" ref={dropdownRef}>
      <button 
        className="country-nav-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select country"
        aria-expanded={isOpen}
      >
        <span className="country-flag">{selectedCountry?.flag}</span>
        <span className="country-name">{selectedCountry?.name}</span>
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
      </button>

      {isOpen && (
        <div className="country-dropdown">
          <div className="country-dropdown-header">
            <i className="fas fa-globe-africa"></i>
            <span>Select Country</span>
          </div>
          <ul className="country-list">
            {enabledCountries.map((country) => (
              <li key={country.code}>
                <button
                  className={`country-item ${selectedCountry?.code === country.code ? 'active' : ''}`}
                  onClick={() => handleCountrySelect(country)}
                >
                  <span className="country-flag">{country.flag}</span>
                  <span className="country-name">{country.name}</span>
                  {selectedCountry?.code === country.code && (
                    <i className="fas fa-check country-check"></i>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <div className="country-dropdown-footer">
            <span className="coming-soon-text">
              <i className="fas fa-plus-circle"></i>
              More countries coming soon
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryNav;
