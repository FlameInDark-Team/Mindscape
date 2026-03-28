import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }

export default function UserLoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showAuthForm, setShowAuthForm] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [organizations, setOrganizations] = useState([])
  const [selectedOrganization, setSelectedOrganization] = useState('')
  const [orgSearch, setOrgSearch] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [orgsLoading, setOrgsLoading] = useState(true)
  const navigate = useNavigate()

  // Fetch organizations on mount
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const res = await fetch('/api/organizations')
        if (res.ok) {
          const data = await res.json()
          setOrganizations(data)
        }
      } catch (err) {
        console.error('Failed to fetch organizations:', err)
      } finally {
        setOrgsLoading(false)
      }
    }
    fetchOrganizations()
  }, [])

  const filteredOrgs = organizations.filter(org =>
    org.name.toLowerCase().includes(orgSearch.toLowerCase()) ||
    (org.description && org.description.toLowerCase().includes(orgSearch.toLowerCase()))
  )

  const handleOrgSelect = (orgId) => {
    // Navigate to survey/checkin with this org context (anonymous)
    localStorage.setItem('mindscape_survey_org_id', orgId)
    const org = organizations.find(o => o.id === orgId)
    if (org) localStorage.setItem('mindscape_survey_org_name', org.name)
    navigate('/checkin')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = isLogin ? '/api/user/login' : '/api/user/register'
      const payload = isLogin
        ? { email, password }
        : { email, password, name, organizationId: selectedOrganization || null }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (res.ok && data.success) {
        localStorage.setItem('mindscape_user_token', data.token)
        localStorage.setItem('mindscape_user_name', data.name)
        localStorage.setItem('mindscape_user_email', data.email)
        if (data.organizationId) {
          localStorage.setItem('mindscape_user_org_id', data.organizationId)
          localStorage.setItem('mindscape_user_org_name', data.organizationName)
        }
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

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true)
      setError('')
      const decoded = jwtDecode(credentialResponse.credential)

      const res = await fetch('/api/user/google-auth', {
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
        if (data.picture) localStorage.setItem('mindscape_user_picture', data.picture)
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
    <div className="page-container" style={{ position: 'relative', maxWidth: '72rem' }}>
      {/* Aurora Background */}
      <div className="aurora-background">
        <div className="aurora" />
      </div>

      {/* Hero Header */}
      <motion.div
        className="page-hero"
        style={{ paddingBottom: 'var(--space-xl)', position: 'relative', zIndex: 1 }}
        initial="hidden" animate="show" variants={fadeUp}
      >
        <span className="label-uppercase">Welcome to MindScape</span>
        <h1 style={{ marginTop: '0.5rem' }}>
          Your Mental <span className="gradient-text">Wellness Journey</span>
        </h1>
        <p>Select an organization to take a wellness survey, or sign in for personalized features</p>
      </motion.div>

      {/* ─── Organization Cards Section ─── */}
      <motion.section
        initial="hidden" animate="show" variants={stagger}
        style={{ position: 'relative', zIndex: 1, marginBottom: 'var(--space-2xl)' }}
      >
        <motion.div variants={fadeUp} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
              <span className="material-symbols-outlined" style={{ marginRight: '0.5rem', color: 'var(--primary)', verticalAlign: 'middle' }}>apartment</span>
              Organizations
            </h2>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
              Pick any organization to anonymously participate in their wellness survey
            </p>
          </div>
          {organizations.length > 4 && (
            <div style={{ position: 'relative', minWidth: '220px' }}>
              <span className="material-symbols-outlined" style={{
                position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                fontSize: '1.2rem', color: 'var(--on-surface-variant)', pointerEvents: 'none'
              }}>search</span>
              <input
                type="text"
                value={orgSearch}
                onChange={(e) => setOrgSearch(e.target.value)}
                placeholder="Search organizations..."
                style={{ paddingLeft: '2.5rem', fontSize: '0.9rem' }}
              />
            </div>
          )}
        </motion.div>

        {orgsLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: 'var(--space-md)' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton" style={{ height: '160px', borderRadius: 'var(--radius-lg)' }} />
            ))}
          </div>
        ) : filteredOrgs.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: 'var(--space-md)' }}>
            {filteredOrgs.map((org, i) => (
              <motion.button
                key={org.id}
                variants={fadeUp}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOrgSelect(org.id)}
                className="card-glow border-glow"
                style={{
                  padding: 'var(--space-xl)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  border: 'none',
                  width: '100%',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: 'var(--radius-full)',
                    background: `linear-gradient(135deg, hsl(${(i * 47) % 360}, 45%, 45%), hsl(${(i * 47 + 40) % 360}, 50%, 55%))`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.25rem', color: 'white', fontWeight: 700, flexShrink: 0
                  }}>
                    {org.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ margin: '0 0 0.25rem', color: 'var(--on-surface)', fontSize: '1.05rem' }}>{org.name}</h4>
                    {org.description && (
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--on-surface-variant)', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {org.description}
                      </p>
                    )}
                  </div>
                </div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginTop: 'var(--space-md)', paddingTop: 'var(--space-sm)',
                  borderTop: '1px solid var(--outline-variant)', opacity: 0.8
                }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>assignment</span>
                    Take Survey
                  </span>
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: 'var(--primary)' }}>arrow_forward</span>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <motion.div variants={fadeUp} className="card-tonal" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
            <div className="icon-bubble icon-bubble-secondary" style={{ margin: '0 auto 1rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.75rem' }}>domain_add</span>
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>
              {orgSearch ? 'No matching organizations' : 'No organizations yet'}
            </h3>
            <p style={{ marginBottom: 'var(--space-lg)' }}>
              {orgSearch
                ? 'Try a different search term'
                : 'Organizations will appear here once they register. You can still take the survey anonymously!'}
            </p>
            <button onClick={() => navigate('/checkin')} className="btn btn-primary">
              <span className="material-symbols-outlined">assignment</span>
              Take Anonymous Survey
            </button>
          </motion.div>
        )}

        {/* Anonymous survey button when orgs exist */}
        {filteredOrgs.length > 0 && (
          <motion.div variants={fadeUp} style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
            <button onClick={() => navigate('/checkin')} className="btn btn-outline">
              <span className="material-symbols-outlined">visibility_off</span>
              Or take the survey without an organization
            </button>
          </motion.div>
        )}
      </motion.section>

      {/* ─── Divider ─── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        style={{ position: 'relative', textAlign: 'center', margin: 'var(--space-xl) 0', zIndex: 1 }}
      >
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--outline-variant)', opacity: 0.3 }} />
        <span style={{
          position: 'relative', background: 'var(--surface)', padding: '0 1.5rem',
          fontSize: '0.85rem', color: 'var(--on-surface-variant)', fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.1em'
        }}>
          Or sign in for enhanced features
        </span>
      </motion.div>

      {/* ─── Auth Section ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{ maxWidth: '28rem', margin: '0 auto', position: 'relative', zIndex: 1 }}
      >
        {!showAuthForm ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', alignItems: 'center' }}>
            <button
              onClick={() => setShowAuthForm(true)}
              className="btn btn-primary"
              style={{ width: '100%', maxWidth: '20rem' }}
            >
              <span className="material-symbols-outlined">person</span>
              Sign In / Create Account
            </button>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text="signin_with"
                shape="rectangular"
                theme="outline"
                size="large"
              />
            </div>

            <div className="card-tonal" style={{ padding: '1rem', textAlign: 'center', width: '100%', maxWidth: '20rem' }}>
              <p style={{ fontSize: '0.8rem', margin: 0 }}>
                <span className="material-symbols-outlined" style={{ fontSize: '0.9rem', verticalAlign: 'middle', marginRight: '0.25rem', color: 'var(--primary)' }}>info</span>
                Registered users get AI chatbot access and personalized dashboard
              </p>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card border-glow shimmer"
            style={{ padding: 'var(--space-2xl)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
              <h3 style={{ margin: 0 }}>{isLogin ? 'Sign In' : 'Create Account'}</h3>
              <button
                onClick={() => setShowAuthForm(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', color: 'var(--on-surface-variant)' }}
                aria-label="Close"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <>
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

                  {organizations.length > 0 && (
                    <div style={{ marginBottom: 'var(--space-lg)' }}>
                      <label style={{ fontFamily: 'var(--font-headline)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                        Join Organization (Optional)
                      </label>
                      <select
                        value={selectedOrganization}
                        onChange={e => setSelectedOrganization(e.target.value)}
                        style={{ width: '100%' }}
                      >
                        <option value="">No organization</option>
                        {organizations.map(org => (
                          <option key={org.id} value={org.id}>{org.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
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
                onClick={() => { setIsLogin(!isLogin); setError('') }}
                style={{
                  background: 'none', border: 'none', color: 'var(--primary)',
                  cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'underline'
                }}
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>

            <div style={{ position: 'relative', textAlign: 'center', margin: 'var(--space-md) 0' }}>
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--outline-variant)', opacity: 0.3 }} />
              <span style={{ position: 'relative', background: 'var(--surface-container-lowest)', padding: '0 1rem', fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>OR</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                text={isLogin ? "signin_with" : "signup_with"}
                shape="rectangular"
                theme="outline"
                size="large"
              />
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Back to Home */}
      <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)', position: 'relative', zIndex: 1 }}>
        <Link to="/" style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem', textDecoration: 'none' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.25rem' }}>arrow_back</span>
          Back to Home
        </Link>
      </div>
    </div>
  )
}
