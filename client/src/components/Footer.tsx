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
      // Dispatch custom event for navigation when prop is not available
      window.dispatchEvent(new CustomEvent("navigateToAbout"));
    }
  };

const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
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
              <svg width="20" height="20" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="11"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <text
                  x="12"
                  y="16"
                  fontSize="12"
                  textAnchor="middle"
                  fill="currentColor"
                >
                  CC
                </text>
              </svg>
              CC BY-SA 4.0
            </a>
          </p>
          <p>Content licensed under CC BY-SA 4.0 unless otherwise noted.</p>

          <div className="powered-by-logos">
            <a
              href="https://www.wikimedia.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="svgs/wikimedia-button.svg"
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
                src="svgs/poweredby_mediawiki.svg"
                alt="Powered by MediaWiki"
                className="footer-svg-logo"
              />
            </a>
          </div>
        </div>

        {/* Policies Column */}
        <div className="footer-col policies-col">
          <h3>Policies</h3>
          <p className="policies-text">
            Files are available under licenses specified on their description
            page. All structured data from the file namespace is available under
            the Creative Commons CC0 License; all unstructured text is available
            under the Creative Commons Attribution-ShareAlike License;
            additional terms may apply.
          </p>
          <p className="policies-text">
            By using this site, you agree to the{" "}
            <a href="/terms">Terms of Use</a> and the{" "}
            <a href="/privacy">Privacy Policy</a>.
          </p>
        </div>

        {/* Quick Links Column */}
        <div className="footer-col links-col">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a href="/">
                <Home size={16} /> Home
              </a>
            </li>
            <li>
              <a href="/browse">
                <BookOpen size={16} /> Contribute
              </a>
            </li>
            <li>
              <a href="/about">
                <Info size={16} /> About GSC
              </a>
            </li>
            <li>
              <a href="/contact">
                <Mail size={16} /> Contact team
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Ghana Supreme Cases. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;