import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

export default function AdminLoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const ADMIN_EMAIL = 'usertest2021subhradeep@gmail.com'

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true)
      setError('')

      // Decode the JWT token to get user info
      const decoded = jwtDecode(credentialResponse.credential)
      
      // Check if the email matches the admin email
      if (decoded.email !== ADMIN_EMAIL) {
        setError(`Access denied. Only ${ADMIN_EMAIL} can access the admin panel.`)
        setLoading(false)
        return
      }

      // Send to backend for admin verification
      const res = await fetch('http://localhost:3001/api/admin/google-auth', {
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
        sessionStorage.setItem('mindscape_admin_token', data.token)
        sessionStorage.setItem('mindscape_admin_email', data.email)
        sessionStorage.setItem('mindscape_admin_name', data.name)
        navigate('/admin/dashboard')
      } else {
        setError(data.error || 'Admin authentication failed')
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
            <span className="material-symbols-outlined" style={{ fontSize: '1.75rem' }}>admin_panel_settings</span>
          </div>
          <h2>Admin Portal</h2>
          <p style={{ fontSize: '0.95rem' }}>Institutional well-being dashboard</p>
        </div>

        <div className="card border-glow shimmer" style={{ padding: 'var(--space-2xl)' }}>
          <div style={{ marginBottom: 'var(--space-lg)', textAlign: 'center' }}>
            <p style={{ fontSize: '0.9rem', marginBottom: 'var(--space-lg)', color: 'var(--on-surface-variant)' }}>
              Sign in with your authorized Google account
            </p>
            
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
          </div>

          {error && (
            <div style={{ 
              padding: 'var(--space-md)', 
              background: 'var(--error-container)', 
              color: 'var(--on-error-container)', 
              borderRadius: 'var(--radius-md)',
              marginTop: 'var(--space-lg)',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '0.85rem', margin: 0 }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.25rem' }}>error</span>
                {error}
              </p>
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
              <div className="loading-spinner" style={{ margin: '0 auto' }} />
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: 'var(--on-surface-variant)' }}>
                Verifying credentials...
              </p>
            </div>
          )}

          <div className="card-tonal" style={{ marginTop: 'var(--space-lg)', padding: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', margin: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '0.9rem', verticalAlign: 'middle', marginRight: '0.25rem', color: 'var(--tertiary)' }}>shield</span>
              Access restricted to: {ADMIN_EMAIL}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
