import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

export default function UserLoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = isLogin ? '/api/user/login' : '/api/user/register'
      const payload = isLogin 
        ? { email, password }
        : { email, password, name }

      const res = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (res.ok && data.success) {
        localStorage.setItem('mindscape_user_token', data.token)
        localStorage.setItem('mindscape_user_name', data.name)
        localStorage.setItem('mindscape_user_email', data.email)
        navigate('/dashboard')
      } else {
        setError(data.error || 'Authentication failed')
      }
    } catch (err) {
      setError('Connection failed. Please ensure the server is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleAnonymous = () => {
    navigate('/checkin')
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true)
      setError('')

      // Decode the JWT token to get user info
      const decoded = jwtDecode(credentialResponse.credential)
      
      // Send to backend for verification and user creation/login
      const res = await fetch('http://localhost:3001/api/user/google-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: credentialResponse.credential,
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture
        })
      })

      const data = await res.json()

      if (res.ok && data.success) {
        localStorage.setItem('mindscape_user_token', data.token)
        localStorage.setItem('mindscape_user_name', data.name)
        localStorage.setItem('mindscape_user_email', data.email)
        if (data.picture) {
          localStorage.setItem('mindscape_user_picture', data.picture)
        }
        navigate('/dashboard')
      } else {
        setError(data.error || 'Google authentication failed')
      }
    } catch (err) {
      setError('Google authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleError = () => {
    setError('Google sign-in was cancelled or failed')
  }

  return (
    <div className="page-container" style={{ maxWidth: '28rem', paddingTop: 'var(--space-4xl)', position: 'relative' }}>
      {/* Orb Background */}
      <div className="orb-background">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <div className="icon-bubble icon-bubble-primary" style={{ margin: '0 auto 1.5rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.75rem' }}>person</span>
          </div>
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p style={{ fontSize: '0.95rem' }}>
            {isLogin ? 'Sign in to access your personalized dashboard' : 'Join MindScape for enhanced features'}
          </p>
        </div>

        <div className="card border-glow shimmer" style={{ padding: 'var(--space-2xl)' }}>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <label style={{ fontFamily: 'var(--font-headline)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); setError('') }}
                  placeholder="Enter your name"
                  required={!isLogin}
                  autoComplete="name"
                />
              </div>
            )}

            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <label style={{ fontFamily: 'var(--font-headline)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                placeholder="Enter your email"
                required
                autoComplete="email"
              />
            </div>

            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <label style={{ fontFamily: 'var(--font-headline)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                placeholder="••••••••"
                required
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
            </div>

            {error && (
              <p style={{ color: 'var(--error)', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.25rem' }}>error</span>
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {loading ? (isLogin ? 'Signing in...' : 'Creating account...') : (isLogin ? 'Sign In' : 'Create Account')}
              <span className="material-symbols-outlined">{loading ? 'hourglass_top' : 'arrow_forward'}</span>
            </button>
          </form>

          <div style={{ textAlign: 'center', margin: 'var(--space-lg) 0' }}>
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 600,
                textDecoration: 'underline'
              }}
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>

          <div style={{ position: 'relative', textAlign: 'center', margin: 'var(--space-lg) 0' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--outline-variant)', opacity: 0.3 }} />
            <span style={{ position: 'relative', background: 'var(--surface-container-lowest)', padding: '0 1rem', fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>
              OR
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-lg)' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              text={isLogin ? "signin_with" : "signup_with"}
              shape="rectangular"
              theme="outline"
              size="large"
              width="100%"
            />
          </div>

          <div style={{ position: 'relative', textAlign: 'center', margin: 'var(--space-lg) 0' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--outline-variant)', opacity: 0.3 }} />
            <span style={{ position: 'relative', background: 'var(--surface-container-lowest)', padding: '0 1rem', fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>
              OR
            </span>
          </div>

          <button
            onClick={handleAnonymous}
            className="btn btn-outline"
            style={{ width: '100%' }}
          >
            <span className="material-symbols-outlined">visibility_off</span>
            Continue Anonymously
          </button>

          <div className="card-tonal" style={{ marginTop: 'var(--space-lg)', padding: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', margin: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '0.9rem', verticalAlign: 'middle', marginRight: '0.25rem', color: 'var(--primary)' }}>info</span>
              {isLogin 
                ? 'Registered users get access to AI chatbot and enhanced features'
                : 'Your data is encrypted and secure. You can always use anonymous mode.'}
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
          <Link to="/" style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem', textDecoration: 'none' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.25rem' }}>arrow_back</span>
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
