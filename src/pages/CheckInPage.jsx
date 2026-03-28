import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const moods = [
  { score: 1, emoji: '😞', label: 'Terrible' },
  { score: 2, emoji: '😰', label: 'Very Low' },
  { score: 3, emoji: '😔', label: 'Low' },
  { score: 4, emoji: '🙁', label: 'Down' },
  { score: 5, emoji: '😐', label: 'Neutral' },
  { score: 6, emoji: '🙂', label: 'Okay' },
  { score: 7, emoji: '😊', label: 'Good' },
  { score: 8, emoji: '😄', label: 'Great' },
  { score: 9, emoji: '🤩', label: 'Amazing' },
  { score: 10, emoji: '🥳', label: 'Fantastic' }
]

const stressorOptions = ['Exams', 'Assignments', 'Social', 'Sleep', 'Finances', 'Relationships', 'Health', 'Loneliness', 'Family', 'Career']
const departments = ['CSE', 'Mech', 'Civil', 'EE', 'Arts', 'Commerce', 'Science', 'Other']

// Get or create anonymous session ID
function getSessionId() {
  let sid = localStorage.getItem('mindscape_session_id')
  if (!sid) {
    sid = 'ms-' + crypto.randomUUID()
    localStorage.setItem('mindscape_session_id', sid)
  }
  return sid
}

export default function CheckInPage() {
  const [score, setScore] = useState(null)
  const [selectedStressors, setSelectedStressors] = useState([])
  const [text, setText] = useState('')
  const [department, setDepartment] = useState(() => localStorage.getItem('mindscape_dept') || '')
  const [step, setStep] = useState('mood') // mood | details | done
  const [showNudge, setShowNudge] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const toggleStressor = (s) => {
    setSelectedStressors(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  const submitCheckin = async () => {
    setSubmitting(true)
    setSubmitError(null)

    const sessionId = getSessionId()
    const payload = {
      score,
      text,
      stressors: selectedStressors,
      session_id: sessionId,
      department: department || 'General'
    }

    // Remember department choice for next time
    if (department) {
      localStorage.setItem('mindscape_dept', department)
    }

    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to submit check-in')
      }

      // Also save to localStorage as a cache for personal trends
      const entries = JSON.parse(localStorage.getItem('mindscape_entries') || '[]')
      entries.push({ score, stressors: selectedStressors, text, department, date: new Date().toISOString() })
      localStorage.setItem('mindscape_entries', JSON.stringify(entries))

      if (score <= 4) {
        setShowNudge(true)
      } else {
        setStep('done')
      }
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-container" style={{ maxWidth: '48rem', position: 'relative' }}>
      {/* Orb Background */}
      <div className="orb-background">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>
      {/* Badge */}
      <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)', position: 'relative', zIndex: 1 }}>
        <span className="chip" style={{ background: 'var(--primary-container)', color: 'var(--on-primary-container)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>lock</span>
          Anonymous
        </span>
      </div>

      <AnimatePresence mode="wait">
        {step === 'mood' && (
          <motion.div key="mood" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="page-hero" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-lg)' }}>
              <h1>How are you <span style={{ color: 'var(--primary)' }}>feeling</span> today?</h1>
              <p>Tap the emoji that best describes your mood right now</p>
            </div>

            {/* Emoji Grid */}
            <div className="card border-glow" style={{ marginBottom: 'var(--space-xl)', padding: 'var(--space-2xl)' }}>
              <div className="emoji-grid">
                {moods.map((m) => (
                  <motion.button
                    key={m.score}
                    className={`emoji-btn ${score === m.score ? 'selected' : ''}`}
                    onClick={() => setScore(m.score)}
                    whileTap={{ scale: 0.92 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span style={{ fontSize: '1.8rem' }}>{m.emoji}</span>
                    <span className="emoji-label">{m.label}</span>
                  </motion.button>
                ))}
              </div>

              {score && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}
                >
                  <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--on-surface)' }}>
                    {score}/10 — {moods.find(m => m.score === score)?.label}
                  </p>
                  <button className="btn btn-primary" style={{ marginTop: 'var(--space-md)' }} onClick={() => setStep('details')}>
                    Continue
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {step === 'details' && (
          <motion.div key="details" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="page-hero" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-lg)' }}>
              <h2>What's on your mind? <span style={{ opacity: 0.5 }}>(optional)</span></h2>
            </div>

            <div className="card border-glow" style={{ marginBottom: 'var(--space-xl)', padding: 'var(--space-2xl)' }}>
              {/* Department Selection */}
              <div style={{ marginBottom: 'var(--space-xl)' }}>
                <h4 style={{ marginBottom: 'var(--space-md)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem', marginRight: '0.5rem', verticalAlign: 'middle', color: 'var(--secondary)' }}>school</span>
                  Your Department
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {departments.map(d => (
                    <button
                      key={d}
                      className={`chip ${department === d ? 'active' : ''}`}
                      onClick={() => setDepartment(d)}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stressor Tags */}
              <div style={{ marginBottom: 'var(--space-xl)' }}>
                <h4 style={{ marginBottom: 'var(--space-md)' }}>What's contributing?</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {stressorOptions.map(s => (
                    <button
                      key={s}
                      className={`chip ${selectedStressors.includes(s) ? 'active' : ''}`}
                      onClick={() => toggleStressor(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input */}
              <div style={{ marginBottom: 'var(--space-xl)' }}>
                <h4 style={{ marginBottom: 'var(--space-md)' }}>Want to share more?</h4>
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value.slice(0, 280))}
                  placeholder="280 chars max, completely anonymous"
                  rows={4}
                />
                <p style={{ textAlign: 'right', fontSize: '0.75rem', marginTop: '0.25rem' }}>{text.length}/280</p>
              </div>

              {submitError && (
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <p style={{ color: 'var(--error)', fontSize: '0.85rem' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.25rem' }}>error</span>
                    {submitError}
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="btn btn-outline" onClick={() => setStep('mood')}>Back</button>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={submitCheckin}
                  disabled={submitting}
                  style={{ opacity: submitting ? 0.7 : 1 }}
                >
                  {submitting ? 'Submitting...' : 'Submit Check-In'}
                  <span className="material-symbols-outlined">{submitting ? 'hourglass_top' : 'check_circle'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'done' && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', paddingTop: 'var(--space-3xl)' }}>
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              style={{
                width: '6rem', height: '6rem', borderRadius: '50%',
                background: 'var(--primary-container)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto var(--space-xl)'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--primary)' }}>check_circle</span>
            </motion.div>
            <h2>Check-in complete!</h2>
            <p style={{ margin: '1rem 0 2rem', fontSize: '1.1rem' }}>Thank you for taking a moment to reflect.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/trends" className="btn btn-primary">View My Trends</Link>
              <Link to="/" className="btn btn-secondary">Back to Home</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resource Nudge Modal */}
      <AnimatePresence>
        {showNudge && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-content" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
              <div style={{ textAlign: 'center' }}>
                <div className="icon-bubble icon-bubble-tertiary" style={{ margin: '0 auto 1.5rem', width: '3.5rem', height: '3.5rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.75rem' }}>favorite</span>
                </div>
                <h3 style={{ marginBottom: '0.5rem' }}>We're here for you</h3>
                <p style={{ marginBottom: '1.5rem' }}>It sounds like things are tough. Here are some resources that might help.</p>

                <div className="card-tonal" style={{ textAlign: 'left', padding: '1.25rem', marginBottom: '1rem' }}>
                  <h4 style={{ color: 'var(--primary)', marginBottom: '0.25rem' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', marginRight: '0.5rem' }}>self_improvement</span>
                    Try a breathing exercise
                  </h4>
                  <p style={{ fontSize: '0.9rem', margin: 0 }}>4-7-8 technique can calm your nervous system in 60 seconds</p>
                </div>

                <div className="card-tonal" style={{ textAlign: 'left', padding: '1.25rem', marginBottom: '1.5rem' }}>
                  <h4 style={{ color: 'var(--tertiary)', marginBottom: '0.25rem' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', marginRight: '0.5rem' }}>call</span>
                    iCall: 9152987821 (24/7)
                  </h4>
                  <p style={{ fontSize: '0.9rem', margin: 0 }}>Talk to a trained counselor anytime, for free</p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <Link to="/resources" className="btn btn-primary">View Resources</Link>
                  <button className="btn btn-outline" onClick={() => { setShowNudge(false); setStep('done') }}>Close</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
