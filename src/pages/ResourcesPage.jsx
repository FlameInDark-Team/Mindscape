import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }

const counselors = [
  { name: 'iCall', phone: '9152987821', hours: '24/7', desc: 'Free telephone counseling' },
  { name: 'Vandrevala Foundation', phone: '1860-2662-345', hours: '24/7', desc: 'Multi-language support' },
  { name: 'Campus Wellness Center', phone: '(Internal)', hours: '9 AM – 5 PM', desc: 'Walk-in appointments available' }
]

// Map categories to Material icons
const categoryIcons = {
  'Mindfulness': 'self_improvement',
  'Sleep': 'bed',
  'Stress': 'fitness_center',
  'Social': 'group',
  'Wellness': 'restaurant',
  'Lifestyle': 'phone_android'
}

export default function ResourcesPage() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [breathing, setBreathing] = useState(false)
  const [breathPhase, setBreathPhase] = useState('Ready')
  const timerRef = useRef(null)

  // Mark resources as visited for achievement
  useEffect(() => {
    localStorage.setItem('visited_resources', 'true')
  }, [])

  // Fetch resources from API
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch('/api/resources')
        if (res.ok) {
          const data = await res.json()
          setResources(data)
        }
      } catch (err) {
        console.error('Failed to fetch resources:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchResources()
  }, [])

  const startBreathing = () => {
    setBreathing(true)
    let cycle = 0
    const phases = [
      { label: 'Inhale...', duration: 4000, css: 'inhale' },
      { label: 'Hold...', duration: 7000, css: 'hold' },
      { label: 'Exhale...', duration: 8000, css: 'exhale' }
    ]

    const runPhase = (i) => {
      if (cycle >= 3) { setBreathing(false); setBreathPhase('Ready'); return }
      const phase = phases[i % 3]
      setBreathPhase(phase.label)
      document.querySelector('.breath-circle')?.classList.remove('inhale', 'hold', 'exhale')
      document.querySelector('.breath-circle')?.classList.add(phase.css)
      timerRef.current = setTimeout(() => {
        if (i % 3 === 2) cycle++
        runPhase(i + 1)
      }, phase.duration)
    }
    runPhase(0)
  }

  useEffect(() => () => clearTimeout(timerRef.current), [])

  return (
    <div className="page-container" style={{ position: 'relative' }}>
      {/* Orb Background */}
      <div className="orb-background">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>
      <motion.div className="page-hero" initial="hidden" animate="show" variants={fadeUp} style={{ position: 'relative', zIndex: 1 }}>
        <span className="label-uppercase">Wellness Hub</span>
        <h1 style={{ marginTop: '0.5rem' }}>Support & <span style={{ color: 'var(--primary)' }}>Resources</span></h1>
        <p>Curated tools and contacts to support your mental well-being</p>
      </motion.div>

      {/* Crisis Banner */}
      <motion.div className="crisis-banner pulse-glow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ position: 'relative', zIndex: 1 }}>
        <span className="material-symbols-outlined" style={{ fontSize: '1.75rem', color: 'var(--error)' }}>emergency</span>
        <div>
          <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, color: 'var(--error)', margin: 0, fontSize: '0.95rem' }}>
            If you're in crisis, please reach out now
          </p>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>
            iCall: 9152987821 (24/7) · Vandrevala Foundation: 1860-2662-345 (24/7)
          </p>
        </div>
      </motion.div>

      {/* Breathing Exercise */}
      <motion.div className="card border-glow" style={{ textAlign: 'center', padding: 'var(--space-2xl)', marginBottom: 'var(--space-xl)', position: 'relative', zIndex: 1 }}
        initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once: true }}>
        <h3 style={{ marginBottom: '0.5rem' }}>
          <span className="material-symbols-outlined" style={{ marginRight: '0.5rem', color: 'var(--primary)' }}>air</span>
          4-7-8 Breathing Exercise
        </h3>
        <p style={{ marginBottom: 'var(--space-xl)', fontSize: '0.95rem' }}>
          Inhale for 4s, hold for 7s, exhale for 8s. Repeat 3 times.
        </p>
        <div
          className={`breath-circle ${breathing ? '' : ''}`}
          onClick={!breathing ? startBreathing : undefined}
          style={{ cursor: breathing ? 'default' : 'pointer' }}
        >
          <span>{breathPhase}</span>
        </div>
        {!breathing && (
          <p style={{ fontSize: '0.8rem', marginTop: '1rem', color: 'var(--on-surface-variant)' }}>Tap to begin</p>
        )}
      </motion.div>

      {/* Articles Grid — from API */}
      <motion.div initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true }} style={{ position: 'relative', zIndex: 1 }}>
        <h2 style={{ marginBottom: 'var(--space-lg)' }}>
          <span className="material-symbols-outlined" style={{ marginRight: '0.5rem', color: 'var(--secondary)' }}>menu_book</span>
          Self-Help Library
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
            <p style={{ color: 'var(--on-surface-variant)' }}>Loading resources...</p>
          </div>
        ) : (
          <div className="grid-3" style={{ marginBottom: 'var(--space-2xl)' }}>
            {resources.map((r) => (
              <motion.a
                key={r.id}
                variants={fadeUp}
                className="card-glow border-glow"
                href={r.url || '#'}
                target={r.url ? '_blank' : undefined}
                rel={r.url ? 'noopener noreferrer' : undefined}
                style={{ padding: 'var(--space-xl)', textDecoration: 'none', display: 'block', cursor: r.url ? 'pointer' : 'default' }}
              >
                <div className="icon-bubble icon-bubble-primary" style={{ marginBottom: '1rem', width: '3rem', height: '3rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>
                    {categoryIcons[r.category] || 'article'}
                  </span>
                </div>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700, color: 'var(--tertiary)' }}>{r.category}</span>
                <h4 style={{ margin: '0.5rem 0 0.4rem', color: 'var(--on-surface)' }}>{r.title}</h4>
                <p style={{ fontSize: '0.9rem', margin: 0 }}>{r.description}</p>
                {r.url && (
                  <p style={{ fontSize: '0.75rem', margin: '0.75rem 0 0', color: 'var(--primary)', fontWeight: 600 }}>
                    Read more →
                  </p>
                )}
              </motion.a>
            ))}
          </div>
        )}
      </motion.div>

      {/* Counselor Contacts */}
      <motion.div initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once: true }} style={{ position: 'relative', zIndex: 1 }}>
        <h2 style={{ marginBottom: 'var(--space-lg)' }}>
          <span className="material-symbols-outlined" style={{ marginRight: '0.5rem', color: 'var(--tertiary)' }}>support_agent</span>
          Talk to Someone
        </h2>
        <div className="grid-3">
          {counselors.map((c, i) => (
            <div key={i} className="card card-glow" style={{ padding: 'var(--space-xl)' }}>
              <div className="icon-bubble icon-bubble-secondary" style={{ marginBottom: '1rem', width: '3rem', height: '3rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>call</span>
              </div>
              <h4>{c.name}</h4>
              <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem', margin: '0.25rem 0' }}>{c.phone}</p>
              <p style={{ fontSize: '0.85rem', margin: 0 }}>{c.hours} · {c.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
