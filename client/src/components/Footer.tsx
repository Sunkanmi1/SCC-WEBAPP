import React from "react";
import { Link } from "react-router-dom";
import { Home, BookOpen, Info, Mail } from "lucide-react";

import "../styles/Footer.css";

interface FooterProps {
  onNavigateToAbout?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigateToAbout }) => {
  const handleAboutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onNavigateToAbout) {
      e.preventDefault();
      onNavigateToAbout();
    }
  };

  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Logos */}
        <div className="footer-logos">
          <img src="/logo.png" alt="Logo" className="footer-logo" />

          <a
            href="https://www.wikidata.org/wiki/Wikidata:Introduction"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/wikidata.png"
              alt="Wikidata logo"
              className="footer-logo"
            />
          </a>
        </div>

        {/* Main Content */}
        <div className="footer-content">
          <nav className="footer-nav">
            <Link
              to="/about"
              onClick={handleAboutClick}
              className="footer-link"
            >
              About Us
            </Link>
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

            <p className="license-text">
              Content licensed under CC BY-SA 4.0 unless otherwise noted.
            </p>

            <div className="powered-by-logos">
              <a
                href="https://www.wikimedia.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/svgs/wikimedia-button.svg"
                  alt="Wikimedia"
                  className="footer-svg-logo"
                />
              </a>

              <a
                href="https://www.mediawiki.org/wiki/MediaWiki"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/svgs/poweredby_mediawiki.svg"
                  alt="Powered by MediaWiki"
                  className="footer-svg-logo"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Policies */}
        <div className="footer-col policies-col">
          <h3>Policies</h3>
          <p>
            Files are available under licenses specified on their description
            page. Structured data is under CC0; unstructured text is under
            CC BY-SA. Additional terms may apply.
          </p>
          <p>
            By using this site, you agree to the{" "}
            <Link to="/terms">Terms of Use</Link> and{" "}
            <Link to="/privacy">Privacy Policy</Link>.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-col links-col">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link to="/">
                <Home size={16} /> Home
              </Link>
            </li>
            <li>
              <Link to="/browse">
                <BookOpen size={16} /> Contribute
              </Link>
            </li>
            <li>
              <Link to="/about">
                <Info size={16} /> About GSC
              </Link>
            </li>
            <li>
              <Link to="/contact">
                <Mail size={16} /> Contact Team
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Ghana Supreme Cases. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;