
import { useState } from 'react'
import './Login.css'

type User = {
  id: number
  name: string
  email: string
  role: string
}

type LoginProps = {
  onLogin: (token: string, user: User) => void
}

const API_URL = 'http://localhost:8081'

function Login({ onLogin }: LoginProps) {
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const endpoint = isRegister ? '/register' : '/login'

      const body = isRegister
        ? { name, email, password }
        : { email, password }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Request failed')
      }

      if (isRegister) {
        setSuccess('Account created successfully! Please sign in.')
        setIsRegister(false)
        setPassword('')
        setShowPassword(false)
      } else {
        onLogin(data.token, data.user)
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong'
      )
    } finally {
      setLoading(false)
    }
  }

  function switchMode() {
    setIsRegister(!isRegister)
    setError('')
    setSuccess('')
    setPassword('')
    setShowPassword(false)
  }

  return (
    <main className="login-page">
      <section className="login-brand-panel">
        <div className="login-brand">
          <div className="login-brand-mark">B</div>
          <span>Bluehouse <strong>Technology</strong></span>
        </div>

        <div className="login-brand-content">
          <span className="login-brand-label">
            COMPANY & CAREERS PORTAL
          </span>

          <h1>Technology that moves your business forward.</h1>

          <p>
            Discover intelligent digital solutions, explore career
            opportunities and connect with Bluehouse Technology.
          </p>

          <div className="login-feature-list">
            <div className="login-feature">
              <span className="login-feature-icon">✓</span>
              <span>Explore our products and services</span>
            </div>

            <div className="login-feature">
              <span className="login-feature-icon">✓</span>
              <span>Discover exciting career opportunities</span>
            </div>

            <div className="login-feature">
              <span className="login-feature-icon">✓</span>
              <span>Access your personalized workspace</span>
            </div>
          </div>
        </div>

        <div className="login-brand-footer">
          © 2026 Bluehouse Technology. Building what's next.
        </div>
      </section>

      <section className="login-form-panel">
        <div className="login-form-container">
          <div className="login-form-heading">
            <span>{isRegister ? 'GET STARTED' : 'WELCOME BACK'}</span>

            <h2>
              {isRegister
                ? 'Create your account'
                : 'Sign in to Bluehouse'}
            </h2>

            <p>
              {isRegister
                ? 'Create your account to explore opportunities at Bluehouse Technology.'
                : 'Enter your credentials to access your Bluehouse workspace.'}
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {isRegister && (
              <div className="login-field">
                <label htmlFor="name">Full name</label>
                <input
                  id="name"
                  className="login-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />
              </div>
            )}

            <div className="login-field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                className="login-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>

              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  className="login-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete={
                    isRegister ? 'new-password' : 'current-password'
                  }
                  minLength={isRegister ? 8 : undefined}
                  required
                  style={{ paddingRight: '48px' }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? 'Hide password' : 'Show password'
                  }
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    border: 'none',
                    background: 'transparent',
                    color: '#64748b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                  }}
                >
                  {showPassword ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                      <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 8.5 4.5 9 7-.2 1-1 2.2-2.1 3.3" />
                      <path d="M6.2 6.2C3.8 7.7 2.3 10 2 12c.5 2.5 4 7 10 7 1.1 0 2.1-.2 3-.5" />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            {success && (
              <p style={{ color: '#15803d', fontSize: 14 }}>
                {success}
              </p>
            )}

            <button
              className="login-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? 'Please wait...'
                : isRegister
                  ? 'Create account'
                  : 'Sign in'}
            </button>
          </form>

          <p className="login-bottom-text">
            {isRegister
              ? 'Already have an account?'
              : "Don't have an account?"}{' '}

            <button
              type="button"
              onClick={switchMode}
              style={{
                border: 'none',
                background: 'none',
                color: '#2563eb',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: 'inherit',
              }}
            >
              {isRegister ? 'Sign in' : 'Create account'}
            </button>
          </p>
        </div>
      </section>
    </main>
  )
}

export default Login
