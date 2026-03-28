import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'

export default function UserDashboard() {
  const [userName, setUserName] = useState('')
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const messagesEndRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('mindscape_user_token')
    const name = localStorage.getItem('mindscape_user_name')
    
    if (!token) {
      navigate('/login')
      return
    }
    
    setUserName(name || 'User')
    
    // Welcome message
    setMessages([{
      role: 'assistant',
      content: `Hi ${name || 'there'}! 👋 I'm your MindScape AI companion. I'm here to support your mental wellness journey. How are you feeling today?`,
      timestamp: new Date()
    }])
  }, [navigate])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleLogout = () => {
    localStorage.removeItem('mindscape_user_token')
    localStorage.removeItem('mindscape_user_name')
    localStorage.removeItem('mindscape_user_email')
    navigate('/login')
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading) return

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('mindscape_user_token')}`
        },
        body: JSON.stringify({
          message: inputMessage,
          history: messages.slice(-10) // Send last 10 messages for context
        })
      })

      const data = await res.json()

      if (res.ok && data.response) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        }])
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'I apologize, but I encountered an error. Please try again or contact support if the issue persists.',
          timestamp: new Date()
        }])
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Connection error. Please check your internet connection and try again.',
        timestamp: new Date()
      }])
    } finally {
      setLoading(false)
    }
  }

  const quickPrompts = [
    { text: "I'm feeling stressed", emoji: "😰" },
    { text: "I need motivation", emoji: "💪" },
    { text: "Help with anxiety", emoji: "😟" },
    { text: "Sleep tips", emoji: "😴" },
    { text: "Study advice", emoji: "📚" },
    { text: "Feeling lonely", emoji: "😔" }
  ]

  return (
    <div className="page-container" style={{ position: 'relative' }}>
      {/* Aurora Background */}
      <div className="aurora-background">
        <div className="aurora" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-xl)',
          flexWrap: 'wrap',
          gap: 'var(--space-md)',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Welcome back, {userName}! 👋</h2>
          <p style={{ margin: '0.5rem 0 0', opacity: 0.8 }}>Your personalized wellness dashboard</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <button onClick={handleLogout} className="btn btn-outline btn-sm">
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid-3"
        style={{ marginBottom: 'var(--space-xl)', position: 'relative', zIndex: 1 }}
      >
        <Link to="/checkin" className="card card-glow" style={{ textAlign: 'center', padding: 'var(--space-xl)', textDecoration: 'none' }}>
          <div className="icon-bubble icon-bubble-primary" style={{ margin: '0 auto 1rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.75rem' }}>edit_note</span>
          </div>
          <h4 style={{ margin: '0 0 0.5rem', color: 'var(--on-surface)' }}>Daily Check-In</h4>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>Track your mood today</p>
        </Link>

        <Link to="/trends" className="card card-glow" style={{ textAlign: 'center', padding: 'var(--space-xl)', textDecoration: 'none' }}>
          <div className="icon-bubble icon-bubble-secondary" style={{ margin: '0 auto 1rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.75rem' }}>trending_up</span>
          </div>
          <h4 style={{ margin: '0 0 0.5rem', color: 'var(--on-surface)' }}>My Trends</h4>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>View your progress</p>
        </Link>

        <Link to="/resources" className="card card-glow" style={{ textAlign: 'center', padding: 'var(--space-xl)', textDecoration: 'none' }}>
          <div className="icon-bubble icon-bubble-tertiary" style={{ margin: '0 auto 1rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.75rem' }}>menu_book</span>
          </div>
          <h4 style={{ margin: '0 0 0.5rem', color: 'var(--on-surface)' }}>Resources</h4>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>Wellness library</p>
        </Link>
      </motion.div>

      {/* AI Chatbot Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card border-glow"
        style={{ padding: 'var(--space-2xl)', position: 'relative', zIndex: 1 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>smart_toy</span>
            <h3 style={{ margin: 0 }}>AI Wellness Companion</h3>
            <span className="chip" style={{ fontSize: '0.65rem', padding: '0.25rem 0.5rem', background: 'var(--primary-container)', color: 'var(--on-primary-container)' }}>
              Powered by Groq
            </span>
          </div>
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="btn btn-sm btn-outline"
          >
            {chatOpen ? 'Minimize' : 'Open Chat'}
          </button>
        </div>

        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Chat Messages */}
              <div
                style={{
                  height: '400px',
                  overflowY: 'auto',
                  background: 'var(--surface-container-low)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-lg)',
                  marginBottom: 'var(--space-md)'
                }}
              >
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      display: 'flex',
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      marginBottom: 'var(--space-md)'
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '70%',
                        padding: 'var(--space-md)',
                        borderRadius: 'var(--radius-md)',
                        background: msg.role === 'user' ? 'var(--primary)' : 'var(--surface-container-highest)',
                        color: msg.role === 'user' ? 'var(--on-primary)' : 'var(--on-surface)'
                      }}
                    >
                      <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6 }}>{msg.content}</p>
                      <p style={{ margin: '0.5rem 0 0', fontSize: '0.7rem', opacity: 0.7 }}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 'var(--space-md)' }}
                  >
                    <div
                      style={{
                        padding: 'var(--space-md)',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--surface-container-highest)'
                      }}
                    >
                      <div className="loading-spinner" style={{ width: '20px', height: '20px' }} />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts */}
              <div style={{ marginBottom: 'var(--space-md)' }}>
                <p style={{ fontSize: '0.8rem', marginBottom: 'var(--space-sm)', opacity: 0.7 }}>Quick prompts:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                  {quickPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInputMessage(prompt.text)
                        setTimeout(() => sendMessage(), 100)
                      }}
                      className="chip"
                      style={{ cursor: 'pointer' }}
                      disabled={loading}
                    >
                      <span style={{ marginRight: '0.25rem' }}>{prompt.emoji}</span>
                      {prompt.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  disabled={loading}
                  style={{ flex: 1 }}
                />
                <button
                  onClick={sendMessage}
                  className="btn btn-primary"
                  disabled={loading || !inputMessage.trim()}
                >
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!chatOpen && (
          <div className="card-tonal" style={{ padding: 'var(--space-lg)', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              💬 Chat with our AI companion for personalized mental health support, coping strategies, and wellness advice.
            </p>
          </div>
        )}
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-tonal"
        style={{ marginTop: 'var(--space-xl)', padding: 'var(--space-lg)', textAlign: 'center', position: 'relative', zIndex: 1 }}
      >
        <p style={{ margin: 0, fontSize: '0.85rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.25rem', color: 'var(--primary)' }}>info</span>
          The AI chatbot provides supportive guidance but is not a replacement for professional mental health care. If you're in crisis, please contact emergency services or call a crisis helpline.
        </p>
      </motion.div>
    </div>
  )
}
