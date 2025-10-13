import React from 'react';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

          <img src="/logo.png" alt="Logo" className="footer-logo" />
          <img src="wikidata.png" alt="Wikidata logo" className="footer-logo" />


        <div className="footer-license">
          <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">
            CC BY-SA 4.0
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
