"use client";

import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    this.setState({ errorInfo });

    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, log to error reporting service
    if (process.env.NODE_ENV === "production") {
      // Example: Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } })
    }
  }

  retry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} retry={this.retry} />;
      }

      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-4">We're sorry, but something unexpected happened. Please try refreshing the page.</p>
            {this.state.error && (
              <details className="text-left mb-4">
                <summary className="text-sm text-gray-500 cursor-pointer mb-2">Error details (for developers)</summary>
                <pre className="text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">{this.state.error.message}</pre>
              </details>
            )}
            <button onClick={this.retry} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const TrainErrorFallback: React.FC<{ error: Error; retry: () => void }> = ({ error, retry }) => {
  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="text-purple-600 text-6xl mb-4">🚂</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Train Data Error</h2>
        <p className="text-gray-600 mb-4">We couldn't load the train schedules. This might be due to a connection issue or server maintenance.</p>
        <div className="text-sm text-gray-500 mb-4">
          <p className="font-medium">What you can try:</p>
          <ul className="list-disc list-inside text-left mt-2 space-y-1">
            <li>Check your internet connection</li>
            <li>Refresh the page</li>
            <li>Try searching for a different route</li>
            <li>Contact support if the problem persists</li>
          </ul>
        </div>
        {error.message.includes("Failed to") && <div className="text-xs text-red-600 bg-red-50 p-2 rounded mb-4">Error: {error.message}</div>}
        <div className="flex gap-3 justify-center">
          <button onClick={retry} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Try Again
          </button>
          <button onClick={() => (window.location.href = "/")} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export const BookingErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={({ error, retry }) => (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Kesalahan Pemesanan</h2>
            <p className="text-gray-600 mb-6">Terjadi kesalahan saat memproses pemesanan Anda. Silakan coba lagi atau hubungi customer service.</p>
            <div className="space-y-3">
              <button onClick={retry} className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                Coba Lagi
              </button>
              <button onClick={() => (window.location.href = "/trains")} className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                Cari Kereta Lain
              </button>
            </div>
          </div>
        </div>
      )}
      onError={(error, errorInfo) => {
        console.error("Booking Error:", error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export const PaymentErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={({ error, retry }) => (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Kesalahan Pembayaran</h2>
            <p className="text-gray-600 mb-6">Terjadi kesalahan pada sistem pembayaran. Data pemesanan Anda aman. Silakan coba lagi.</p>
            <div className="space-y-3">
              <button onClick={retry} className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                Coba Lagi
              </button>
              <button onClick={() => window.history.back()} className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                Kembali ke Review
              </button>
            </div>
          </div>
        </div>
      )}
      onError={(error, errorInfo) => {
        console.error("Payment Error:", error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundary;
