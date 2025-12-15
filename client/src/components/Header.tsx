import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Github } from 'lucide-react';
import '../styles/Header.css';

interface HeaderProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
  onNavigateToAbout?: () => void;
  selectedCountryQid?: string;
  onCountryChange?: (qid: string) => void;
}

const COUNTRIES = [
  { qid: 'Q117', label: 'Ghana', flag: '🇬🇭' },
  { qid: 'Q1033', label: 'Nigeria', flag: '🇳🇬' },
  { qid: 'Q114', label: 'Kenya', flag: '🇰🇪' },
  { qid: 'Q258', label: 'South Africa', flag: '🇿🇦' },
  { qid: 'Q1036', label: 'Uganda', flag: '🇺🇬' }
];

const Header: React.FC<HeaderProps> = ({ showBackButton = false, onBackClick, onNavigateToAbout, selectedCountryQid = 'Q117', onCountryChange }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate('/');
    }
  };

  const handleAboutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onNavigateToAbout) {
      onNavigateToAbout();
    } else {
      navigate('/about');
    }
  };

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      // Fallback navigation if onBackClick is not provided
      navigate('/');
    }
  };

  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-left">
          <Link to="/" onClick={handleLogoClick} className="logo-link" title="Home">
            <div className="logo">
              <span className="logo-icon">⚖</span>
              <span className="logo-text">SCC</span>
            </div>
          </Link>
        </div>
        
        <div className="nav-right">
          <div className="country-selector">
            <select
              className="country-select"
              value={selectedCountryQid}
              onChange={(e) => onCountryChange && onCountryChange(e.target.value)}
              aria-label="Select country"
              title="Filter cases by country"
            >
              {COUNTRIES.map((c) => (
                <option key={c.qid} value={c.qid}>
                  {c.flag} {c.label}
                </option>
              ))}
            </select>
          </div>
          {!showBackButton && (
            <>
              <Link to="/about" onClick={handleAboutClick} className="nav-link" title="About this project">
                About Us
              </Link>
              <a 
                href="https://github.com/Sunkanmi1/SCC-WEBAPP.git" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="nav-link github-link"
                title="View on GitHub"
              >
                <Github size={20} />
              </a>
            </>
          )}
          {showBackButton && (
            <button onClick={handleBackClick} className="back-button" title="Back to home search">
              <i className="fas fa-arrow-left"></i>
              <span>Back to Search</span>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;