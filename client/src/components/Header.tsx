import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

interface HeaderProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
  onNavigateToAbout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ showBackButton = false, onBackClick, onNavigateToAbout }) => {
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
          {!showBackButton && (
            <Link to="/about" onClick={handleAboutClick} className="nav-link">
              About Us
            </Link>
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