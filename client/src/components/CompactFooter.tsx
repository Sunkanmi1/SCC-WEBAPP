import React from 'react';
import '../styles/CompactFooter.css';

interface CompactFooterProps {
  onNavigateToAbout?: () => void;
  onNavigateToHome?: () => void;
}

const CompactFooter: React.FC<CompactFooterProps> = ({ onNavigateToAbout, onNavigateToHome }) => {
  const handleAboutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onNavigateToAbout) {
      onNavigateToAbout();
    } else {
      window.dispatchEvent(new CustomEvent('navigateToAbout'));
    }
  };

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onNavigateToHome) {
      onNavigateToHome();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <footer className="compact-footer">
      <div className="compact-footer-content">
        {/* Left: Brand & Description */}
        <div className="compact-footer-section-left">
          <div className="compact-footer-brand">
            <div className="compact-footer-logo-text">
              <span className="compact-footer-logo-icon">⚖️</span>
              <span className="compact-footer-logo-acronym">SCC</span>
            </div>
            <h2 className="compact-footer-brand-title">Ghana Supreme Cases</h2>
          </div>
          <p className="compact-footer-description">
            Open-source searchable database of Ghana Supreme Court cases for legal professionals, students, and the public.
          </p>
          <div className="compact-footer-license-badge">
            <span className="compact-footer-cc-icon">CC</span>
            <span className="compact-footer-license-text">CC BY-SA 4.0</span>
          </div>
        </div>

        {/* Right: Quick Links */}
        <nav className="compact-footer-quick-links">
          <a href="#" onClick={handleHomeClick} className="compact-footer-quick-link">
            <i className="fas fa-home"></i>
            <span>Home</span>
          </a>
          <a href="#" onClick={handleAboutClick} className="compact-footer-quick-link">
            <i className="fas fa-info-circle"></i>
            <span>About</span>
          </a>
          <a href="#contribute" className="compact-footer-quick-link">
            <i className="fas fa-heart"></i>
            <span>Contribute</span>
          </a>
          <a href="#contact" className="compact-footer-quick-link">
            <i className="fas fa-envelope"></i>
            <span>Contact</span>
          </a>
        </nav>
      </div>

      {/* Footer Bottom: Copyright */}
      <div className="compact-footer-bottom">
        <p className="compact-footer-copyright">© 2025 Ghana Supreme Cases. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default CompactFooter;
