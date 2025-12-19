import React, { useState, useEffect, useRef } from 'react';
import { SearchSuggestion } from '../utils/searchSuggestions';
import '../styles/SearchAutocomplete.css';

interface SearchAutocompleteProps {
  query: string;
  suggestions: SearchSuggestion[];
  isVisible: boolean;
  onSelectSuggestion: (suggestion: string) => void;
  onClose: () => void;
  searchHistory?: string[];
  onClearHistory?: () => void;
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  query,
  suggestions,
  isVisible,
  onSelectSuggestion,
  onClose,
  searchHistory = [],
  onClearHistory,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [query, suggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isVisible, onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isVisible || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          onSelectSuggestion(suggestions[selectedIndex].text);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };

  const highlightText = (text: string, highlight: string = '') => {
    if (!highlight) return text;
    
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="suggestion-highlight">{part}</mark>
      ) : (
        part
      )
    );
  };

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'recent':
        return 'fa-clock';
      case 'popular':
        return 'fa-fire';
      default:
        return 'fa-lightbulb';
    }
  };

  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="search-autocomplete"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="autocomplete-header">
        <span className="autocomplete-title">
          <i className="fas fa-search"></i>
          Suggestions
        </span>
      </div>
      <ul className="autocomplete-list" role="listbox">
        {suggestions.map((suggestion, index) => (
          <li
            key={`${suggestion.text}-${index}`}
            className={`autocomplete-item ${index === selectedIndex ? 'autocomplete-item-selected' : ''}`}
            onClick={() => onSelectSuggestion(suggestion.text)}
            onMouseEnter={() => setSelectedIndex(index)}
            role="option"
            aria-selected={index === selectedIndex}
          >
            <i className={`fas ${getSuggestionIcon(suggestion.type)}`}></i>
            <span className="autocomplete-text">
              {highlightText(suggestion.text, suggestion.highlight || query)}
            </span>
            {suggestion.type === 'recent' && (
              <span className="autocomplete-badge">Recent</span>
            )}
            {suggestion.type === 'popular' && (
              <span className="autocomplete-badge popular">Popular</span>
            )}
          </li>
        ))}
      </ul>
      {searchHistory.length > 0 && onClearHistory && (
        <div className="autocomplete-footer">
          <button
            className="autocomplete-clear-history"
            onClick={() => {
              onClearHistory();
              onClose();
            }}
          >
            <i className="fas fa-trash"></i>
            Clear History
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;

