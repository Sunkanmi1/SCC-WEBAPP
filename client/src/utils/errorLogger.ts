/**
 * Error Logging Utility
 * Logs errors for debugging and monitoring
 */

export interface ErrorLog {
  error: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  userId?: string;
  context?: Record<string, any>;
}

class ErrorLogger {
  private logs: ErrorLog[] = [];
  private maxLogs = 50; // Keep last 50 errors in memory

  /**
   * Log an error
   */
  logError(error: ErrorLog): void {
    // Add to in-memory logs
    this.logs.push(error);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', error);
    }

    // In production, you could send to error tracking service
    // Example: Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'production') {
      // Uncomment and configure your error tracking service
      // this.sendToErrorService(error);
    }

    // Store in localStorage for persistence
    try {
      const storedLogs = this.getStoredLogs();
      storedLogs.push(error);
      // Keep only last 20 in localStorage
      const recentLogs = storedLogs.slice(-20);
      localStorage.setItem('scc_error_logs', JSON.stringify(recentLogs));
    } catch (e) {
      // localStorage might be full or disabled
      console.warn('Failed to store error log:', e);
    }
  }

  /**
   * Get stored logs from localStorage
   */
  getStoredLogs(): ErrorLog[] {
    try {
      const stored = localStorage.getItem('scc_error_logs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Get all logs (in-memory + stored)
   */
  getAllLogs(): ErrorLog[] {
    const stored = this.getStoredLogs();
    return [...this.logs, ...stored];
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
    try {
      localStorage.removeItem('scc_error_logs');
    } catch {
      // Ignore
    }
  }

  /**
   * Send error to external error tracking service
   * Uncomment and configure as needed
   */
  // private sendToErrorService(error: ErrorLog): void {
  //   // Example: Send to Sentry
  //   // if (window.Sentry) {
  //   //   window.Sentry.captureException(new Error(error.error), {
  //   //     extra: error.context,
  //   //   });
  //   // }
  // }
}

export const errorLogger = new ErrorLogger();

// Make available globally for ErrorBoundary
if (typeof window !== 'undefined') {
  (window as any).errorLogger = errorLogger;
}

