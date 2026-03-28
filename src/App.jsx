import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import LandingPage from './pages/LandingPage'
import CheckInPage from './pages/CheckInPage'
import PersonalTrendsPage from './pages/PersonalTrendsPage'
import ResourcesPage from './pages/ResourcesPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboard from './pages/AdminDashboard'
import UserLoginPage from './pages/UserLoginPage'
import UserDashboard from './pages/UserDashboard'
import FloatingChatbot from './components/FloatingChatbot'

function ThemeToggle({ theme, setTheme }) {
  return (
    <button
      className="theme-toggle"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="theme-toggle-track">
        <div className="theme-toggle-thumb">
          <span className="material-symbols-outlined">
            {theme === 'light' ? 'light_mode' : 'dark_mode'}
          </span>
        </div>
      </div>
    </button>
  )
}

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const { pathname } = useLocation()

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="scroll-to-top"
          aria-label="Scroll to top"
        >
          <span className="material-symbols-outlined">arrow_upward</span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

function MobileMenu({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 150,
              backdropFilter: 'blur(4px)'
            }}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '80%',
              maxWidth: '320px',
              background: 'var(--surface-container-lowest)',
              zIndex: 200,
              padding: 'var(--space-xl)',
              boxShadow: 'var(--shadow-elevated)',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
              <h3 style={{ margin: 0, color: 'var(--primary)' }}>Menu</h3>
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  color: 'var(--on-surface)'
                }}
                aria-label="Close menu"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>close</span>
              </button>
            </div>
            
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <NavLink
                to="/"
                onClick={onClose}
                className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'}
                style={{
                  padding: 'var(--space-md)',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: 'var(--on-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.3s'
                }}
              >
                <span className="material-symbols-outlined">home</span>
                Home
              </NavLink>
              
              <NavLink
                to="/checkin"
                onClick={onClose}
                className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'}
                style={{
                  padding: 'var(--space-md)',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: 'var(--on-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.3s'
                }}
              >
                <span className="material-symbols-outlined">psychology</span>
                Personality Test
              </NavLink>
              
              <NavLink
                to="/trends"
                onClick={onClose}
                className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'}
                style={{
                  padding: 'var(--space-md)',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: 'var(--on-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.3s'
                }}
              >
                <span className="material-symbols-outlined">trending_up</span>
                My Trends
              </NavLink>
              
              <NavLink
                to="/resources"
                onClick={onClose}
                className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'}
                style={{
                  padding: 'var(--space-md)',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: 'var(--on-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.3s'
                }}
              >
                <span className="material-symbols-outlined">menu_book</span>
                Resources
              </NavLink>
              
              <div style={{ height: '1px', background: 'var(--outline-variant)', margin: 'var(--space-md) 0', opacity: 0.3 }} />
              
              <NavLink
                to="/login"
                onClick={onClose}
                className="btn btn-outline"
                style={{ width: '100%' }}
              >
                <span className="material-symbols-outlined">person</span>
                User Login
              </NavLink>
              
              <NavLink
                to="/admin"
                onClick={onClose}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                <span className="material-symbols-outlined">admin_panel_settings</span>
                Organization Admin
              </NavLink>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function AppContent() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('mindscape_theme') || 'light'
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('mindscape_theme', theme)
  }, [theme])

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          <NavLink to="/" className="navbar-brand">MindScape</NavLink>
          <ul className="navbar-links">
            <li><NavLink to="/checkin" className={({isActive}) => isActive ? 'active' : ''}>Personality Test</NavLink></li>
            <li><NavLink to="/trends" className={({isActive}) => isActive ? 'active' : ''}>My Trends</NavLink></li>
            <li><NavLink to="/resources" className={({isActive}) => isActive ? 'active' : ''}>Resources</NavLink></li>
          </ul>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <NavLink to="/login" className="btn btn-outline btn-sm hide-mobile">
            <span className="material-symbols-outlined">person</span>
            Login
          </NavLink>
          <NavLink to="/admin" className="btn btn-primary btn-sm hide-mobile">
            <span className="material-symbols-outlined">admin_panel_settings</span>
            Organization
          </NavLink>
          <button
            className="navbar-mobile-menu"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>menu</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Scroll to Top */}
      <ScrollToTop />

      {/* Floating AI Chatbot - Available on all pages */}
      <FloatingChatbot />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/checkin" element={<CheckInPage />} />
        <Route path="/trends" element={<PersonalTrendsPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/login" element={<UserLoginPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="footer-brand">MindScape</div>
            <p className="footer-copy" style={{ marginTop: '0.5rem' }}>
              © 2024 MindScape Digital Sanctuary. All rights reserved.
            </p>
          </div>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Support</a>
          </div>
        </div>
      </footer>
    </>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
