import React from 'react';
import { useOfflineDetection } from '../utils/offlineDetection';
import '../styles/OfflineIndicator.css';

const OfflineIndicator: React.FC = () => {
  const { isOnline, wasOffline } = useOfflineDetection();
  const [showMessage, setShowMessage] = React.useState(false);

  React.useEffect(() => {
    if (!isOnline) {
      setShowMessage(true);
    } else if (wasOffline && isOnline) {
      // Show "back online" message briefly
      setShowMessage(true);
      const timer = setTimeout(() => setShowMessage(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setShowMessage(false);
    }
  }, [isOnline, wasOffline]);

  if (!showMessage) return null;

  return (
    <div className={`offline-indicator ${isOnline ? 'offline-indicator-online' : 'offline-indicator-offline'}`}>
      <div className="offline-indicator-content">
        <i className={`fas ${isOnline ? 'fa-wifi' : 'fa-wifi-slash'}`}></i>
        <span>
          {isOnline 
            ? 'You\'re back online!' 
            : 'You\'re currently offline. Some features may be limited.'}
        </span>
      </div>
    </div>
  );
};

export default OfflineIndicator;

