import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } }
const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } } }

const features = [
  { icon: 'no_accounts', title: 'No login required', desc: 'Access support instantly. We believe mental wellness shouldn\'t have hurdles.', color: 'primary' },
  { icon: 'lock', title: 'Identity never tracked', desc: 'Your data remains yours. We use high-level encryption to ensure total anonymity.', color: 'secondary' },
  { icon: 'school', title: 'Student led', desc: 'Built by students, for students. We understand the unique pressures of campus life.', color: 'tertiary' }
]

const steps = [
  { num: '01', title: 'Open MindScape', desc: 'No login, no email, no name needed.' },
  { num: '02', title: 'Tap your mood', desc: 'Pick an emoji that describes how you feel.' },
  { num: '03', title: 'Add context', desc: 'Tag stressors and add a note if you want.' },
  { num: '04', title: 'Track your growth', desc: 'Watch patterns emerge over days and weeks.' }
]

export default function LandingPage() {
  return (
    <div className="page-container" style={{ position: 'relative' }}>
      {/* Aurora Background */}
      <div className="aurora-background">
        <div className="aurora" />
      </div>

      {/* Hero Section */}
      <motion.section className="page-hero" initial="hidden" animate="show" variants={stagger} style={{ position: 'relative', zIndex: 1 }}>
        <motion.h1 variants={fadeUp} className="gradient-text">
          How are you feeling today?
        </motion.h1>
        <motion.p variants={fadeUp} style={{ marginBottom: '2.5rem' }}>
          Anonymous. Private. Takes 10 seconds.
        </motion.p>
        <motion.div variants={fadeUp} style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', width: '100%' }}>
          <Link to="/checkin" className="btn btn-primary btn-lg" style={{ flex: '1 1 auto', minWidth: '200px', maxWidth: '300px' }}>
            Start Check-In
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
          <Link to="/resources" className="btn btn-secondary btn-lg" style={{ flex: '1 1 auto', minWidth: '200px', maxWidth: '300px' }}>
            Learn More
          </Link>
        </motion.div>
      </motion.section>

      {/* Hero Image */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{ marginBottom: 'var(--space-3xl)' }}
      >
        <div className="image-card" style={{ height: '400px', position: 'relative' }}>
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_hHGT0p81MA4wGtHIJW0JVdXZagJQPHfR-e0BMYvgH_TChoRhhQWPF_5xbWdqsbhziN1ClIC8s5EENRMBGw18afgJqqsWp8KTZ0OuGPj9Hui0MCn-CqjPg3dOjPikoQaVBI3UTe4DMo7d3BVj47paN8NBjJiYWAD7_NSaTRGq46dG8Jxu-CbG1oN5tFvyMpxXzLeJB1GZXManqWZeXbtC6PV9rH2fDi3Aw3imU9rqeafNku4C0Q50FHKmAbbyQ_zv78BPcYqiy652"
            alt="Calming mountain landscape at sunrise"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(248,250,245,0.9) 0%, rgba(248,250,245,0.2) 40%, transparent 100%)'
          }} />
          <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', zIndex: 2 }}>
            <div className="card-glass" style={{ maxWidth: '24rem', padding: '1.25rem' }}>
              <span className="label-uppercase" style={{ marginBottom: '0.5rem', display: 'block' }}>Daily Focus</span>
              <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 600, color: 'var(--on-surface)', margin: 0, fontSize: '1rem' }}>
                "Your mind is a sanctuary. Take a moment to breathe and reflect."
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Trust Indicators */}
      <motion.section
        className="grid-3"
        style={{ marginBottom: 'var(--space-3xl)' }}
        initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
      >
        {features.map((f, i) => (
          <motion.div key={i} variants={fadeUp} className="card-glow border-glow" style={{ textAlign: 'center', padding: '2.5rem' }}>
            <div className={`icon-bubble icon-bubble-${f.color}`} style={{ margin: '0 auto 1.5rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.75rem' }}>{f.icon}</span>
            </div>
            <h3 style={{ marginBottom: '0.75rem' }}>{f.title}</h3>
            <p>{f.desc}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* Asymmetric Section */}
      <motion.section
        className="asymmetric-section"
        initial="hidden" whileInView="show" viewport={{ once: true }}
        variants={stagger}
      >
        <motion.div variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <span className="label-uppercase">Our Philosophy</span>
          <h2>A space built for breathing room.</h2>
          <p style={{ fontSize: '1.1rem' }}>
            Most tools feel like a chore. MindScape is designed to feel like a premium wellness journal. No clutter, no noise, just you and your thoughts.
          </p>
          <div className="stats-row" style={{ marginTop: '0.5rem' }}>
            <div className="stat-item">
              <span className="stat-value">10s</span>
              <span className="stat-label">Fast Check-in</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">100%</span>
              <span className="stat-label">Privacy Rate</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">0</span>
              <span className="stat-label">Data Sharing</span>
            </div>
          </div>
        </motion.div>
        <motion.div variants={fadeUp} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="image-card" style={{ height: '20rem', marginTop: '3rem' }}>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgFfG54gdslZTBZy74wpUHdJDxVFE0mrarMGwqiIPA74JPDzhowWtyj7WoxdQGmPkgH5vdxJZHg_fmFYGMU07QtEEMJlbuWzsNlUzqzq_RE5hpO-HRSXj_gB83hHQebHxEACuNvQT0Ol0KoWnaHbBhBFjX_IdlKtsL-nih1KsxBp44bMcWVO7qFQ28fYUIW9ujENqDrKlsWcqxZ9vxCDlcXCm66e5anf5kbpgiWXhydSDE9of1KGUTn_QSTyGh4uLyAlcqWjy9eBKY"
              alt="Calming stone in hand"
            />
          </div>
          <div className="image-card" style={{ height: '20rem' }}>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVlTduc6kBaoM0qqoahi-Tqjug8HCJ_2qqi9aVhU5wvfdb7X3kzk_Bm9YIZxBiMG91wsxetDk_K_6-5WW1tB-QA-v9c29-4qx858Q8S5z-b8zps3E9FklYSqT3EFEQ33JgIoHVZwe3iT0_3kgbvgrZIubKiEtKQJ6kVpnAlWi1nscLieKrMzXXAQsR9gQNxDI8prBqznpmqu7doWOhIpgtSsWiPwLBde9TbxXPNTHURGdN0zpJrQ_FSw6VfGGAAtRcPTtZDStFtPcJ"
              alt="Minimalist meditation space"
            />
          </div>
        </motion.div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        style={{ marginBottom: 'var(--space-3xl)', padding: 'var(--space-3xl) 0' }}
        initial="hidden" whileInView="show" viewport={{ once: true }}
        variants={stagger}
      >
        <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <span className="label-uppercase">How It Works</span>
          <h2 style={{ marginTop: '0.75rem' }}>Four simple steps to wellness</h2>
        </motion.div>
        <div className="grid-2" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {steps.map((s, i) => (
            <motion.div key={i} variants={fadeUp} className="card-tonal" style={{ textAlign: 'center', padding: '2rem' }}>
              <span style={{
                fontFamily: 'var(--font-headline)', fontSize: '2.5rem', fontWeight: 800,
                color: 'var(--primary-container)', lineHeight: 1
              }}>{s.num}</span>
              <h4 style={{ margin: '1rem 0 0.5rem' }}>{s.title}</h4>
              <p style={{ fontSize: '0.9rem' }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Banner */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="cta-banner pulse-glow" style={{ position: 'relative' }}>
          <div className="orb-background">
            <div className="orb orb-1" />
            <div className="orb orb-2" />
          </div>
          <div className="cta-orb cta-orb-1" />
          <div className="cta-orb cta-orb-2" />
          <h2 style={{ position: 'relative', zIndex: 1, marginBottom: '1rem' }}>Ready for your moment of calm?</h2>
          <p style={{ position: 'relative', zIndex: 1, fontSize: '1.1rem', maxWidth: '36rem', margin: '0 auto 2rem' }}>
            Join thousands of students who start their day with a mindful check-in. It's free, it's fast, and it stays between us.
          </p>
          <Link to="/checkin" className="btn btn-primary btn-lg" style={{ position: 'relative', zIndex: 1 }}>
            Begin Sanctuary Check-In
          </Link>
        </div>
      </motion.section>
    </div>
  )
}
