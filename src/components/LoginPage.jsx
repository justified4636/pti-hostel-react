import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(false)
    setLoading(true)
    try {
      await login(email.trim(), password)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2">
              <ellipse cx="12" cy="5" rx="9" ry="3"/>
              <path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/>
              <path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6"/>
            </svg>
          </div>
          <h1>PTI Hostel<br/>Defaulters Portal</h1>
          <p>Porter Access Only</p>
        </div>

        <div className="gold-bar"></div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="porter@pti.edu.ng"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="..."
              autoComplete="current-password"
            />
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          {error && (
            <div className="error-msg">
              Incorrect email or password. Please try again.
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
