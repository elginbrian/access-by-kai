"use client";

import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
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

export default ErrorBoundary;
