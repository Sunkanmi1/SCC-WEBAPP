import React, { useState, useRef, useEffect } from 'react';
import { useTheme, countryThemes, CountryTheme } from '../contexts/ThemeContext';
import '../styles/ThemeSwitcher.css';

const ThemeSwitcher: React.FC = () => {
  const { currentTheme, themeConfig, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleThemeSelect = (theme: CountryTheme) => {
    setTheme(theme);
    setIsOpen(false);
  };

  return (
    <div className="theme-switcher" ref={dropdownRef}>
      <button
        className="theme-switcher-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change country theme"
        aria-expanded={isOpen}
      >
        <span className="theme-flag">{themeConfig.flag}</span>
        <span className="theme-name">{themeConfig.name}</span>
        <span className={`theme-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="theme-dropdown">
          {availableThemes.map((theme) => {
            const configForTheme = countryThemes[theme];
            
            return (
              <button
                key={theme}
                className={`theme-option ${currentTheme === theme ? 'active' : ''}`}
                onClick={() => handleThemeSelect(theme)}
              >
                <span className="theme-flag">{configForTheme.flag}</span>
                <span className="theme-name">{configForTheme.name}</span>
                {currentTheme === theme && <span className="theme-check">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;

