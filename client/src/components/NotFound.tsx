import React from 'react';
import Header from './Header';
import Footer from './Footer';
import '../styles/NotFound.css';

interface NotFoundProps {
  onNavigateToHome?: () => void;
}

const NotFound: React.FC<NotFoundProps> = ({ onNavigateToHome }) => {
  const handleGoHome = () => {
    if (onNavigateToHome) {
      onNavigateToHome();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="not-found-page">
      <Header showBackButton={false} />
      
      <main className="not-found-content">
        <div className="not-found-container">
          <div className="not-found-icon">
            <i className="fas fa-search"></i>
          </div>
          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-subtitle">Page Not Found</h2>
          <p className="not-found-message">
            The page you're looking for doesn't exist or has been moved.
            <br />
            Let's get you back to searching Supreme Court cases.
          </p>
          
          <div className="not-found-actions">
            <button 
              onClick={handleGoHome}
              className="not-found-button not-found-button-primary"
            >
              <i className="fas fa-home"></i>
              Go to Home
            </button>
            <button 
              onClick={() => window.history.back()}
              className="not-found-button not-found-button-secondary"
            >
              <i className="fas fa-arrow-left"></i>
              Go Back
            </button>
          </div>

          <div className="not-found-suggestions">
            <h3>You might be looking for:</h3>
            <ul>
              <li>
                <a href="/" onClick={(e) => { e.preventDefault(); handleGoHome(); }}>
                  <i className="fas fa-home"></i>
                  Home - Search Cases
                </a>
              </li>
              <li>
                <a href="/about" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('navigateToAbout')); }}>
                  <i className="fas fa-info-circle"></i>
                  About Us
                </a>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer onNavigateToHome={onNavigateToHome} />
    </div>
  );
};

export default NotFound;

