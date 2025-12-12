import React from 'react';
import '../styles/Header.css';

interface HeaderProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
  onNavigateToAbout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ showBackButton = false, onBackClick, onNavigateToAbout }) => {
  const handleLogoClick = () => {
    if (onBackClick) {
      onBackClick();
    } else if (onNavigateToAbout === undefined) {
      window.location.href = '/';
    }
  };

  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-left">
          <div className="logo" onClick={handleLogoClick} role="button" tabIndex={0} onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleLogoClick();
            }
          }}>
            <span className="logo-icon">⚖</span>
            <span className="logo-text">SCC</span>
          </div>
        </div>
        
        <div className="nav-right">
          {!showBackButton && onNavigateToAbout && (
            <button onClick={onNavigateToAbout} className="nav-link">
              About Us
            </button>
          )}
          {showBackButton && (
            <button onClick={onBackClick} className="back-button">
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