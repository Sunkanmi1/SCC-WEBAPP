import React from 'react';
import '../styles/LoadingSpinner.css';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-container flex flex-col items-center justify-center h-screen">
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
      <p className="loading-text">Searching Supreme Court cases...</p>
    </div>
  );
};

export default LoadingSpinner;