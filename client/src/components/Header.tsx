import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import CountryNav from './CountryNav';
import '../styles/Header.css';

interface HeaderProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
  onNavigateToAbout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ showBackButton = false, onBackClick, onNavigateToAbout }) => {
  const navigate = useNavigate();
  const location = useLocation();

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

  // Extract country code from URL if on country page
  const countryMatch = location.pathname.match(/\/country\/([a-z]{2})/i);
  const currentCountry = countryMatch ? countryMatch[1].toUpperCase() : 'GH';

  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-left">
          <Link to="/" onClick={handleLogoClick} className="logo-link">
            <div className="logo">
              <span className="logo-icon">⚖</span>
              <span className="logo-text">SCC</span>
            </div>
          </Link>
        </div>
        
        <div className="nav-right">
          <CountryNav currentCountry={currentCountry} />
          {!showBackButton && (
            <Link to="/about" onClick={handleAboutClick} className="nav-link">
              About Us
            </Link>
          )}
          {showBackButton && (
            <button onClick={handleBackClick} className="back-button">
              <i className="fas fa-arrow-left"></i>
              <span>Back to Search</span>
            </button>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Header;