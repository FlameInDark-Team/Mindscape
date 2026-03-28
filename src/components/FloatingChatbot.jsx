import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { API_URL } from '../config'

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Welcome message
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: "Hi! 👋 I'm your MindScape AI companion. I'm here to support your mental wellness journey. How are you feeling today?",
        timestamp: new Date()
      }])
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
      const res = await fetch(`${API_URL}/api/chat/anonymous`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: inputMessage,
          history: messages.slice(-10)
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
    { text: "Sleep tips", emoji: "😴" }
  ]

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              border: 'none',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              color: 'white'
            }}
            aria-label="Open AI Chatbot"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>
              smart_toy
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              width: 'min(400px, calc(100vw - 2rem))',
              height: isMinimized ? 'auto' : 'min(600px, calc(100vh - 4rem))',
              background: 'var(--surface-container-lowest)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              border: '1px solid var(--outline-variant)'
            }}
          >
            {/* Header */}
            <div style={{
              padding: 'var(--space-md)',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="material-symbols-outlined">smart_toy</span>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem' }}>AI Wellness Companion</h4>
                  <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.9 }}>Powered by Groq</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}
                  aria-label={isMinimized ? 'Maximize' : 'Minimize'}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>
                    {isMinimized ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}
                  aria-label="Close"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>close</span>
                </button>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <>
                {/* Messages */}
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: 'var(--space-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-sm)'
                }}>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        display: 'flex',
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <div style={{
                        maxWidth: '80%',
                        padding: 'var(--space-sm) var(--space-md)',
                        borderRadius: 'var(--radius-md)',
                        background: msg.role === 'user' 
                          ? 'var(--primary)' 
                          : 'var(--surface-container-high)',
                        color: msg.role === 'user' 
                          ? 'var(--on-primary)' 
                          : 'var(--on-surface)'
                      }}>
                        <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>
                          {msg.content}
                        </p>
                        <p style={{ 
                          margin: '0.25rem 0 0', 
                          fontSize: '0.7rem', 
                          opacity: 0.7 
                        }}>
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{ display: 'flex', justifyContent: 'flex-start' }}
                    >
                      <div style={{
                        padding: 'var(--space-sm) var(--space-md)',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--surface-container-high)'
                      }}>
                        <div className="loading-spinner" style={{ width: '20px', height: '20px' }} />
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts */}
                {messages.length <= 1 && (
                  <div style={{ 
                    padding: '0 var(--space-md) var(--space-sm)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 'var(--space-xs)'
                  }}>
                    {quickPrompts.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setInputMessage(prompt.text)
                          setTimeout(() => sendMessage(), 100)
                        }}
                        className="chip"
                        style={{ 
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          padding: '0.4rem 0.8rem'
                        }}
                        disabled={loading}
                      >
                        <span style={{ marginRight: '0.25rem' }}>{prompt.emoji}</span>
                        {prompt.text}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div style={{
                  padding: 'var(--space-md)',
                  borderTop: '1px solid var(--outline-variant)',
                  display: 'flex',
                  gap: 'var(--space-sm)'
                }}>
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
                    disabled={loading}
                    style={{ 
                      flex: 1,
                      fontSize: '0.9rem',
                      padding: '0.6rem'
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    className="btn btn-primary"
                    disabled={loading || !inputMessage.trim()}
                    style={{
                      padding: '0.6rem 1rem',
                      minWidth: 'auto'
                    }}
                  >
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </div>

                {/* Disclaimer */}
                <div style={{
                  padding: '0.5rem var(--space-md)',
                  background: 'var(--surface-container-low)',
                  fontSize: '0.7rem',
                  textAlign: 'center',
                  color: 'var(--on-surface-variant)',
                  borderTop: '1px solid var(--outline-variant)'
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '0.8rem', verticalAlign: 'middle' }}>info</span>
                  {' '}AI provides support but is not a replacement for professional care
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
