import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to console only in development
    if (import.meta.env.DEV) {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    // In production, you could send to error tracking service like Sentry
    // Example: Sentry.captureException(error);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
            color: '#fff',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            padding: '2rem',
          }}
        >
          <div
            style={{
              maxWidth: '500px',
              textAlign: 'center',
              padding: '3rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div
              style={{
                fontSize: '4rem',
                marginBottom: '1rem',
              }}
            >
              ⚠️
            </div>
            <h1
              style={{
                fontSize: '2rem',
                marginBottom: '1rem',
                fontWeight: '600',
              }}
            >
              Oops! Something went wrong
            </h1>
            <p
              style={{
                fontSize: '1.1rem',
                marginBottom: '2rem',
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: '1.6',
              }}
            >
              The application encountered an unexpected error. Don't worry, your data is safe.
            </p>
            <button
              onClick={this.handleReload}
              style={{
                padding: '1rem 2rem',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#fff',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)';
              }}
            >
              Reload Page
            </button>
            {import.meta.env.DEV && this.state.error && (
              <details
                style={{
                  marginTop: '2rem',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  color: 'rgba(255, 255, 255, 0.5)',
                }}
              >
                <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                  Error Details (Dev Only)
                </summary>
                <pre
                  style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    padding: '1rem',
                    borderRadius: '8px',
                    overflow: 'auto',
                    maxHeight: '200px',
                  }}
                >
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
