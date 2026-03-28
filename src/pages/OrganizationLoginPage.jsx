import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function OrganizationLoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = isLogin ? '/api/organization/login' : '/api/organization/register'
      const payload = isLogin 
        ? { email, password }
        : { name, email, password, description }

      const res = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (res.ok && data.success) {
        localStorage.setItem('mindscape_org_token', data.token)
        localStorage.setItem('mindscape_org_name', data.name)
        localStorage.setItem('mindscape_org_email', data.email)
        localStorage.setItem('mindscape_org_id', data.organizationId)
        // Redirect to organization dashboard (you can create this later)
        navigate('/admin/dashboard') // Using admin dashboard for now
      } else {
        setError(data.error || 'Authentication failed')
      }
    } catch (err) {
      setError('Connection failed. Please ensure the server is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container" style={{ maxWidth: '32rem', paddingTop: 'var(--space-4xl)', position: 'relative' }}>
      {/* Orb Background */}
      <div className="orb-background">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <div className="icon-bubble icon-bubble-secondary" style={{ margin: '0 auto 1.5rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.75rem' }}>business</span>
          </div>
          <h2>{isLogin ? 'Organization Login' : 'Register Organization'}</h2>
          <p style={{ fontSize: '0.95rem' }}>
            {isLogin ? 'Access your organization dashboard' : 'Create an organization account'}
          </p>
        </div>

        <div className="card border-glow shimmer" style={{ padding: 'var(--space-2xl)' }}>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <label style={{ fontFamily: 'var(--font-headline)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                  Organization Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); setError('') }}
                  placeholder="Enter organization name"
                  required={!isLogin}
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
                placeholder="organization@example.com"
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

            {!isLogin && (
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <label style={{ fontFamily: 'var(--font-headline)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Brief description of your organization"
                  rows={3}
                />
              </div>
            )}

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
              {loading ? (isLogin ? 'Signing in...' : 'Creating account...') : (isLogin ? 'Sign In' : 'Create Organization')}
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
              {isLogin ? "Don't have an account? Register" : 'Already registered? Sign in'}
            </button>
          </div>

          <div className="card-tonal" style={{ marginTop: 'var(--space-lg)', padding: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', margin: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '0.9rem', verticalAlign: 'middle', marginRight: '0.25rem', color: 'var(--secondary)' }}>info</span>
              Organizations can manage their members and access aggregated wellness data
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)', display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
          <Link to="/login" style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem', textDecoration: 'none' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.25rem' }}>person</span>
            User Login
          </Link>
          <span style={{ color: 'var(--outline-variant)' }}>|</span>
          <Link to="/" style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem', textDecoration: 'none' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.25rem' }}>home</span>
            Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
