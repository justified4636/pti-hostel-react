import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', background: '#0B1F3A', display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: 24,
        }}>
          <div style={{
            background: 'white', borderRadius: 16, padding: 48, maxWidth: 480,
            textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.16)',
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#0B1F3A', marginBottom: 8 }}>
              Something went wrong
            </h2>
            <p style={{ color: '#9AA5B4', fontSize: 14, marginBottom: 24 }}>
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload() }}
              style={{
                padding: '12px 32px', background: '#0B1F3A', color: 'white',
                border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}
            >
              Reload App
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
