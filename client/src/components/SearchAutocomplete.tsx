import React, { useState, useEffect, useRef, RefObject } from 'react';
import { createPortal } from 'react-dom';
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
  /** Optional anchor element (input) to position the portal next to */
  anchorRef?: RefObject<HTMLElement>;
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  query,
  suggestions,
  isVisible,
  onSelectSuggestion,
  onClose,
  searchHistory = [],
  onClearHistory,
  anchorRef,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement | null>(null);
  const [portalStyle, setPortalStyle] = useState<React.CSSProperties | null>(null);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [query, suggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideContainer = containerRef.current?.contains(target);
      const clickedInsidePortal = portalRef.current?.contains(target);
      if (!clickedInsideContainer && !clickedInsidePortal) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isVisible, onClose]);

  // Position portal relative to anchorRef if provided, otherwise position normally
  useEffect(() => {
    if (!isVisible) return;

    const computePosition = () => {
      const anchor = (anchorRef as any)?.current || containerRef.current?.parentElement;
      const rect = anchor ? anchor.getBoundingClientRect() : null;
      if (rect) {
        setPortalStyle({
          position: 'absolute',
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          zIndex: 9999,
        });
      } else {
        setPortalStyle(null);
      }
    };

    computePosition();
    window.addEventListener('resize', computePosition);
    window.addEventListener('scroll', computePosition, true);
    return () => {
      window.removeEventListener('resize', computePosition);
      window.removeEventListener('scroll', computePosition, true);
    };
  }, [isVisible, query, suggestions]);

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

  const content = (
    <div
      ref={containerRef}
      className="search-autocomplete"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      style={portalStyle || undefined}
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

  // Render into document.body so it overlays all content (including footer)
  if (typeof document !== 'undefined') {
    return createPortal(
      <div ref={(el) => (portalRef.current = el)} style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
        {content}
      </div>,
      document.body
    );
  }

  return content;
};

export default SearchAutocomplete;

