/**
 * Offline Detection Utility
 * Detects when the user goes offline/online and provides hooks for components
 */

import React from 'react';

export interface OnlineStatus {
  isOnline: boolean;
  wasOffline: boolean;
}

class OfflineDetector {
  private listeners: Set<(isOnline: boolean) => void> = new Set();
  private wasOffline: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
      // Check initial status
      this.wasOffline = !navigator.onLine;
    }
  }

  private handleOnline = () => {
    this.wasOffline = true;
    this.notifyListeners(true);
  };

  private handleOffline = () => {
    this.notifyListeners(false);
  };

  private notifyListeners = (isOnline: boolean) => {
    this.listeners.forEach(listener => listener(isOnline));
  };

  public isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  public getStatus(): OnlineStatus {
    return {
      isOnline: this.isOnline(),
      wasOffline: this.wasOffline,
    };
  }

  public subscribe(callback: (isOnline: boolean) => void): () => void {
    this.listeners.add(callback);
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  public cleanup() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline);
      window.removeEventListener('offline', this.handleOffline);
    }
    this.listeners.clear();
  }
}

// Singleton instance
export const offlineDetector = new OfflineDetector();

/**
 * React Hook for offline detection
 */
export function useOfflineDetection(): OnlineStatus {
  const [status, setStatus] = React.useState<OnlineStatus>(
    offlineDetector.getStatus()
  );

  React.useEffect(() => {
    const unsubscribe = offlineDetector.subscribe((isOnline) => {
      setStatus(offlineDetector.getStatus());
    });

    return unsubscribe;
  }, []);

  return status;
}

