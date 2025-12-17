import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

interface FooterProps {
  onNavigateToAbout?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigateToAbout }) => {
  const handleAboutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onNavigateToAbout) {
      onNavigateToAbout();
    } else {
      window.dispatchEvent(new CustomEvent('navigateToAbout'));
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logos">
          <img src="/logo.png" alt="Logo" className="footer-logo" />

          <a
            href="https://www.wikidata.org/wiki/Wikidata:Introduction"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="wikidata.png"
              alt="Wikidata logo"
              className="footer-logo"
            />
          </a>
        </div>

        <div className="footer-content">
          <nav className="footer-nav">
            <div className="footer-nav-links">
              <Link
                to="/about"
                onClick={handleAboutClick}
                className="footer-link"
              >
                About Us
              </Link>
            </div>
          </nav>

          <div className="footer-external">
            <a
              href="https://creativecommons.org/licenses/by-sa/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link footer-link-external"
            >
              CC BY-SA 4.0
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;