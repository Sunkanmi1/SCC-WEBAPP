import React from 'react';
import '../styles/Footer.css';
import wikimediaLogo from '../Assets/Wikimedia-logo.svg';
import mediaWikiLogo from '../Assets/MediaWikilogo.svg.png';
import goifLogo from '../Assets/goig.png';
import wikidataLogo from '../Assets/wwiki.png';

interface FooterProps {
  onNavigateToAbout?: () => void;
  onNavigateToHome?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigateToAbout, onNavigateToHome }) => {
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
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Column 1: SCC Ghana Supreme Cases */}
          <div className="footer-column">
            <div className="footer-brand">
              <div className="footer-logo-text">
                <span className="footer-logo-icon">⚖️</span>
                <span className="footer-logo-acronym">SCC</span>
              </div>
              <h2 className="footer-brand-title">Ghana Supreme Cases</h2>
              
            </div>
            <p className="footer-description">
              An open-source platform providing a searchable database of Supreme Court cases in Ghana. 
              Designed for legal professionals, students, researchers, and the general public, offering 
              easy access to case details through an intuitive search and filtering system.
            </p>
          </div>

          {/* Column 2: Licensing & Credits */}
          <div className="footer-column">
            <h3 className="footer-column-title">Licensing & Credits</h3>
            <div className="footer-license-badge">
              <span className="footer-cc-icon">CC</span>
              <span className="footer-license-text">CC BY-SA 4.0</span>
            </div>
            <p className="footer-text">
              Content licensed under CC BY-SA 4.0 unless otherwise noted.
            </p>
            <div className="footer-credits-logos">
              <div className="footer-credit-item footer-goif-credit">
                <a 
                  href="https://globalopeninitiative.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer-credit-link"
                >
                  <img 
                    src={goifLogo} 
                    alt="GOIF Logo" 
                    className="footer-goif-logo"
                  />
                </a>
                <a 
                  href="https://www.wikidata.org/wiki/Wikidata:Data_access" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer-credit-link footer-wikidata-link"
                >
                  <img 
                    src={wikidataLogo} 
                    alt="Wikidata Logo" 
                    className="footer-wikidata-logo"
                  />
                </a>
              </div>
              <div className="footer-credit-item">
                <a 
                  href="https://wikimedia.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer-credit-link"
                >
                  <img 
                    src={wikimediaLogo} 
                    alt="Wikimedia" 
                    className="footer-wikimedia-logo"
                  />
                  <span className="footer-credit-text">WIKIMEDIA project</span>
                </a>
              </div>
              
            </div>
          </div>

          {/* Column 3: Policies */}
          <div className="footer-column">
            <h3 className="footer-column-title">Policies</h3>
            <p className="footer-text">
              Files are available under licenses specified on their description page. All structured data 
              from the file namespace is available under the Creative Commons CC BY-SA 4.0; all unstructured 
              text is available under the Creative Commons Attribution-ShareAlike License; additional terms may apply.
            </p>
            <p className="footer-text">
              By using this site, you agree to the{' '}
              <a href="#terms" className="footer-link-inline">Terms of Use</a>
              {' '}and the{' '}
              <a href="#privacy" className="footer-link-inline">Privacy Policy</a>.
            </p>
          </div>

          {/* Column 4: Quick Links */}
          <div className="footer-column">
            <h3 className="footer-column-title">Quick Links</h3>
            <nav className="footer-quick-links">
              <a href="#" onClick={handleHomeClick} className="footer-quick-link">
                <i className="fas fa-home"></i>
                <span>Home</span>
              </a>
              <a href="#contribute" className="footer-quick-link">
                <i className="fas fa-hand-holding-heart"></i>
                <span>Contribute</span>
              </a>
              <a href="#" onClick={handleAboutClick} className="footer-quick-link">
                <i className="fas fa-info-circle"></i>
                <span>About SCC</span>
              </a>
              <a href="#contact" className="footer-quick-link">
                <i className="fas fa-envelope"></i>
                <span>Contact team</span>
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="footer-bottom-links">
            <a href="#docs" className="footer-bottom-link">Docs</a>
            <a href="#contact" className="footer-bottom-link">Contact</a>
            <a href="#cookies" className="footer-bottom-link">Manage cookies</a>
            <a href="#privacy-settings" className="footer-bottom-link">Do not share my personal information</a>
          </div>
          <div className="footer-copyright">
            © 2025 Ghana Supreme Cases. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
