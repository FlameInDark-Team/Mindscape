import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

const features = [
  { icon: 'monitoring', title: 'Live Analytics', desc: 'Real-time campus mood tracking with trend detection' },
  { icon: 'smart_toy', title: 'AI Insights', desc: 'Automated wellness digests and recommendations' },
  { icon: 'notifications_active', title: 'Smart Alerts', desc: 'Burnout detection and engagement monitoring' },
  { icon: 'group', title: 'Department View', desc: 'Compare wellness across departments' }
]

export default function AdminLoginPage() {
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

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (res.ok && data.success) {
        sessionStorage.setItem('mindscape_admin_token', data.token)
        sessionStorage.setItem('mindscape_admin_name', data.name)
        sessionStorage.setItem('mindscape_admin_email', data.email)
        sessionStorage.setItem('mindscape_org_id', data.organizationId)
        navigate('/admin/dashboard')
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
    <div className="page-container" style={{ position: 'relative', maxWidth: '72rem', paddingTop: 'var(--space-2xl)' }}>
      {/* Aurora Background */}
      <div className="aurora-background">
        <div className="aurora" />
      </div>

      <motion.div
        initial="hidden" animate="show" variants={fadeUp}
        className="admin-login-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 0,
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-elevated)',
          position: 'relative',
          zIndex: 1,
          minHeight: '600px'
        }}
      >
        {/* ─── Left Panel: Branding ─── */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary), var(--primary-dim), var(--secondary))',
          padding: 'var(--space-2xl)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative orbs */}
          <div className="orb-background">
            <div className="orb orb-1" style={{ opacity: 0.2 }} />
            <div className="orb orb-2" style={{ opacity: 0.15 }} />
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <motion.div variants={fadeUp}>
              <span style={{
                fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.2em', color: 'var(--on-primary)', opacity: 0.8
              }}>
                Organization Admin
              </span>
              <h1 style={{
                color: 'var(--on-primary)', marginTop: '0.5rem',
                fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', lineHeight: 1.2
              }}>
                MindScape<br />Admin Panel
              </h1>
              <p style={{
                color: 'var(--on-primary)', opacity: 0.85, fontSize: '1rem',
                marginTop: 'var(--space-md)', lineHeight: 1.6, maxWidth: '24rem'
              }}>
                Manage your organization's wellness data, monitor student well-being, and access powerful analytics.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: 'var(--space-md)', marginTop: 'var(--space-2xl)'
              }}
            >
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-md)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <span className="material-symbols-outlined" style={{
                    fontSize: '1.25rem', color: 'var(--on-primary)', marginBottom: '0.5rem', display: 'block'
                  }}>{f.icon}</span>
                  <h4 style={{ color: 'var(--on-primary)', margin: '0 0 0.25rem', fontSize: '0.85rem' }}>{f.title}</h4>
                  <p style={{ color: 'var(--on-primary)', opacity: 0.75, margin: 0, fontSize: '0.75rem', lineHeight: 1.4 }}>{f.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ─── Right Panel: Form ─── */}
        <div style={{
          background: 'var(--surface-container-lowest)',
          padding: 'var(--space-2xl)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <motion.div variants={fadeUp}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
              <div className="icon-bubble icon-bubble-primary" style={{ margin: '0 auto 1rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.75rem' }}>
                  {isLogin ? 'lock_open' : 'domain_add'}
                </span>
              </div>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
                {isLogin ? 'Welcome Back' : 'Register Organization'}
              </h2>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem' }}>
                {isLogin ? 'Sign in to your organization dashboard' : 'Create a new organization account'}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <>
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
                      autoComplete="organization"
                    />
                  </div>

                  <div style={{ marginBottom: 'var(--space-lg)' }}>
                    <label style={{ fontFamily: 'var(--font-headline)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                      Description (Optional)
                    </label>
                    <textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Brief description of your organization"
                      rows={3}
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                </>
              )}

              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <label style={{ fontFamily: 'var(--font-headline)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                  Organization Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  placeholder="admin@organization.com"
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
                {loading
                  ? (isLogin ? 'Signing in...' : 'Creating organization...')
                  : (isLogin ? 'Sign In as Admin' : 'Create Organization')}
                <span className="material-symbols-outlined">{loading ? 'hourglass_top' : 'arrow_forward'}</span>
              </button>
            </form>

            <div style={{ textAlign: 'center', margin: 'var(--space-lg) 0' }}>
              <button
                onClick={() => { setIsLogin(!isLogin); setError('') }}
                style={{
                  background: 'none', border: 'none', color: 'var(--primary)',
                  cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'underline'
                }}
              >
                {isLogin ? "Don't have an organization? Register" : 'Already registered? Sign in'}
              </button>
            </div>

            <div className="card-tonal" style={{ padding: '0.75rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.78rem', margin: 0, lineHeight: 1.6 }}>
                <span className="material-symbols-outlined" style={{ fontSize: '0.9rem', verticalAlign: 'middle', marginRight: '0.25rem', color: 'var(--primary)' }}>info</span>
                Once registered, your organization will be listed for users to take wellness surveys anonymously
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Navigation links */}
      <div style={{
        textAlign: 'center', marginTop: 'var(--space-xl)',
        display: 'flex', gap: 'var(--space-md)', justifyContent: 'center',
        flexWrap: 'wrap', position: 'relative', zIndex: 1
      }}>
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
    </div>
  )
}
