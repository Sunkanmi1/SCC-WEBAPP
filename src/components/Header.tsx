import React from 'react';
import '../styles/Header.css';

interface HeaderProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ showBackButton = false, onBackClick }) => {
  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-left">
          <div className="logo">
            <span className="logo-icon">⚖</span>
            <span className="logo-text">SCC</span>
          </div>
        </div>
        
        {showBackButton && (
          <div className="nav-right">
            <button onClick={onBackClick} className="back-button">
              <i className="fas fa-arrow-left"></i>
              <span>Back to Search</span>
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;