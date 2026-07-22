import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', fontFamily: 'monospace', background: '#1e1e2e', color: '#f38ba8', minHeight: '100vh', whiteSpace: 'pre-wrap' }}>
          <h1 style={{ color: '#f38ba8', marginBottom: '16px' }}>React Error Caught:</h1>
          <pre style={{ color: '#fab387', fontSize: '14px' }}>{this.state.error?.message}</pre>
          <pre style={{ color: '#a6adc8', fontSize: '12px', marginTop: '16px' }}>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
