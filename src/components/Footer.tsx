import React from 'react';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h4 className="footer-title">A PROJECT BY</h4>
        <div className="footer-logo">
          <div className="goif-logo-placeholder">
            <span>GOiF</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;