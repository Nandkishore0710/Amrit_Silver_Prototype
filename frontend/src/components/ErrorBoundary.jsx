import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-dark-900 px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">⚠️</div>
            <h1 className="font-serif text-3xl text-gold-400 mb-4">Something went wrong</h1>
            <p className="text-silver-400 mb-6">An unexpected error occurred. Please refresh the page.</p>
            {process.env.NODE_ENV === 'development' && (
              <pre className="text-left text-xs text-red-400 bg-dark-800 p-4 rounded-xl mb-6 overflow-auto">
                {this.state.error?.toString()}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
