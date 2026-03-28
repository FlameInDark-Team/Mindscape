import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from 'chart.js'
import { Line } from 'react-chartjs-2'
import MoodGarden from '../components/MoodGarden'
import AchievementSystem from '../components/AchievementSystem'
import AIInsights from '../components/AIInsights'
import MoodRecommendations from '../components/MoodRecommendations'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler)

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

function getSessionId() {
  return localStorage.getItem('mindscape_session_id') || null
}

export default function PersonalTrendsPage() {
  const [stats, setStats] = useState(null)
  const [trends, setTrends] = useState([])
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState(7)

  const sessionId = getSessionId()

  useEffect(() => {
    if (!sessionId) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        const [statsRes, trendsRes] = await Promise.all([
          fetch(`/api/personal/stats?session_id=${encodeURIComponent(sessionId)}`),
          fetch(`/api/personal/trends?session_id=${encodeURIComponent(sessionId)}&days=${range}`)
        ])

        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData)
        }
        if (trendsRes.ok) {
          const trendsData = await trendsRes.json()
          setTrends(trendsData)
        }
      } catch (err) {
        console.error('Failed to fetch personal trends:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [sessionId, range])

  // Build chart from the trend data
  const buildChartData = () => {
    // Fill in all days in the range, including days with no entries
    const days = []
    for (let i = range - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      const found = trends.find(t => t.date === key)
      days.push({
        label: d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' }),
        avg: found ? parseFloat(found.avg_score.toFixed(1)) : null,
        count: found ? found.count : 0
      })
    }
    return days
  }

  const chartDays = buildChartData()

  const chartData = {
    labels: chartDays.map(d => d.label),
    datasets: [{
      data: chartDays.map(d => d.avg),
      borderColor: '#2a6868',
      backgroundColor: 'rgba(176, 238, 237, 0.3)',
      fill: true,
      tension: 0.4,
      pointRadius: 5,
      pointBackgroundColor: '#2a6868',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      spanGaps: true
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { min: 0, max: 10, grid: { color: 'rgba(173, 180, 172, 0.2)' }, ticks: { color: '#5a615b', font: { family: 'Inter' } } },
      x: { grid: { display: false }, ticks: { color: '#5a615b', font: { family: 'Inter' }, maxRotation: 45 } }
    }
  }

  const hasData = stats && stats.totalCheckins > 0

  if (loading) {
    return (
      <div className="page-container" style={{ maxWidth: '56rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
            <div className="icon-bubble icon-bubble-primary" style={{ margin: '0 auto 1.5rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.75rem' }}>trending_up</span>
            </div>
            <h3>Loading your trends...</h3>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container" style={{ maxWidth: '56rem', position: 'relative' }}>
      {/* Aurora Background */}
      <div className="aurora-background">
        <div className="aurora" />
      </div>
      <motion.div className="page-hero" style={{ paddingBottom: 'var(--space-xl)', position: 'relative', zIndex: 1 }} initial="hidden" animate="show" variants={fadeUp}>
        <span className="label-uppercase">Your Journey</span>
        <h1 style={{ marginTop: '0.5rem' }}>Personal <span style={{ color: 'var(--primary)' }}>Trends</span></h1>
        <p>Your mood patterns, tracked securely. Only you can see this data.</p>
      </motion.div>

      {!hasData ? (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
          <div className="icon-bubble icon-bubble-primary" style={{ margin: '0 auto 1.5rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.75rem' }}>edit_note</span>
          </div>
          <h3 style={{ marginBottom: '0.5rem' }}>No entries yet</h3>
          <p style={{ marginBottom: '1.5rem' }}>Complete your first check-in to start tracking your trends.</p>
          <Link to="/checkin" className="btn btn-primary">Start Check-In</Link>
        </div>
      ) : (
        <>
          {/* Early Warning Alert */}
          {stats.earlyWarning && stats.earlyWarning.level !== 'none' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`card ${stats.earlyWarning.level === 'severe' ? 'pulse-glow' : 'border-glow'}`}
              style={{
                marginBottom: 'var(--space-xl)',
                padding: 'var(--space-xl)',
                background: stats.earlyWarning.level === 'severe'
                  ? 'linear-gradient(135deg, rgba(168, 56, 54, 0.1), rgba(168, 56, 54, 0.05))'
                  : stats.earlyWarning.level === 'moderate'
                  ? 'linear-gradient(135deg, rgba(118, 90, 40, 0.1), rgba(118, 90, 40, 0.05))'
                  : 'linear-gradient(135deg, rgba(42, 104, 104, 0.1), rgba(42, 104, 104, 0.05))',
                border: `2px solid ${
                  stats.earlyWarning.level === 'severe' ? 'var(--error)' :
                  stats.earlyWarning.level === 'moderate' ? 'var(--tertiary)' :
                  'var(--primary)'
                }`,
                position: 'relative',
                zIndex: 1
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                <div className="icon-bubble" style={{
                  background: stats.earlyWarning.level === 'severe' ? 'var(--error-container)' :
                    stats.earlyWarning.level === 'moderate' ? 'var(--tertiary-container)' :
                    'var(--primary-container)',
                  color: stats.earlyWarning.level === 'severe' ? 'var(--error)' :
                    stats.earlyWarning.level === 'moderate' ? 'var(--tertiary)' :
                    'var(--primary)',
                  flexShrink: 0
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.75rem' }}>
                    {stats.earlyWarning.level === 'severe' ? 'emergency' : 'notifications_active'}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: '250px' }}>
                  <h3 style={{ margin: '0 0 0.5rem', color: 'var(--on-surface)' }}>
                    {stats.earlyWarning.level === 'severe' ? '⚠️ Immediate Support Recommended' :
                     stats.earlyWarning.level === 'moderate' ? '💛 Check-in Recommended' :
                     '💙 Proactive Care Suggestion'}
                  </h3>
                  <p style={{ margin: '0 0 var(--space-md)', fontSize: '0.95rem' }}>
                    {stats.earlyWarning.message}
                  </p>
                  {stats.earlyWarning.burnoutRisk && (
                    <p style={{ margin: '0 0 var(--space-md)', fontSize: '0.85rem', fontStyle: 'italic', opacity: 0.8 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.25rem' }}>info</span>
                      Burnout risk detected based on your recent patterns
                    </p>
                  )}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
                    {stats.earlyWarning.suggestedActions.map((action, i) => (
                      <Link
                        key={i}
                        to="/resources"
                        className="btn btn-sm"
                        style={{
                          background: stats.earlyWarning.level === 'severe' ? 'var(--error)' :
                            stats.earlyWarning.level === 'moderate' ? 'var(--tertiary)' :
                            'var(--primary)',
                          color: 'white'
                        }}
                      >
                        {action.text}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Positive Reinforcement */}
          {stats.earlyWarning && stats.earlyWarning.level === 'none' && stats.avgScore >= 7 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-tonal"
              style={{
                marginBottom: 'var(--space-xl)',
                padding: 'var(--space-lg)',
                background: 'linear-gradient(135deg, rgba(42, 104, 104, 0.1), rgba(176, 238, 237, 0.1))',
                textAlign: 'center',
                position: 'relative',
                zIndex: 1
              }}
            >
              <span style={{ fontSize: '2rem' }}>🌟</span>
              <h4 style={{ margin: '0.5rem 0 0.25rem', color: 'var(--primary)' }}>You're doing great!</h4>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                Your recent check-ins show positive well-being. Keep up the good work!
              </p>
            </motion.div>
          )}

          {/* Stats Row */}
          <motion.div className="grid-3" style={{ marginBottom: 'var(--space-xl)', position: 'relative', zIndex: 1 }} initial="hidden" animate="show" variants={fadeUp}>
            <div className="card card-glow" style={{ textAlign: 'center' }}>
              <div className="stat-value">{stats.avgScore}</div>
              <div className="stat-label">Average Score</div>
            </div>
            <div className="card card-glow pulse-glow" style={{ textAlign: 'center' }}>
              <div className="stat-value">{stats.streak}</div>
              <div className="stat-label">Day Streak 🔥</div>
            </div>
            <div className="card card-glow" style={{ textAlign: 'center' }}>
              <div className="stat-value">{stats.totalCheckins}</div>
              <div className="stat-label">Total Check-ins</div>
            </div>
          </motion.div>

          {/* Range Selector */}
          <motion.div style={{ display: 'flex', gap: '0.5rem', marginBottom: 'var(--space-lg)' }} initial="hidden" animate="show" variants={fadeUp}>
            {[7, 14, 30].map(r => (
              <button key={r} className={`chip ${range === r ? 'active' : ''}`} onClick={() => setRange(r)}>
                {r} days
              </button>
            ))}
          </motion.div>

          {/* Mood Chart */}
          <motion.div className="card border-glow" style={{ marginBottom: 'var(--space-xl)', padding: 'var(--space-2xl)', position: 'relative', zIndex: 1 }} initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once: true }}>
            <h3 style={{ marginBottom: 'var(--space-lg)', color: 'var(--on-surface)' }}>
              <span className="material-symbols-outlined" style={{ marginRight: '0.5rem', color: 'var(--primary)' }}>trending_up</span>
              {range}-Day Mood Trend
            </h3>
            <div style={{ height: '280px' }}>
              {trends.length > 0 ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: '0.5rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '2rem', opacity: 0.3 }}>show_chart</span>
                  <p style={{ color: 'var(--on-surface-variant)' }}>No data in this range. Try a longer period.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Score Range */}
          <motion.div className="grid-2" style={{ marginBottom: 'var(--space-xl)' }} initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once: true }}>
            <div className="card-tonal" style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-headline)', color: 'var(--error)' }}>{stats.lowest}</div>
              <div className="stat-label">Lowest Score</div>
            </div>
            <div className="card-tonal" style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-headline)', color: 'var(--primary)' }}>{stats.highest}</div>
              <div className="stat-label">Highest Score</div>
            </div>
          </motion.div>

          {/* Top Stressors */}
          {stats.topStressors && stats.topStressors.length > 0 && (
            <motion.div className="card" style={{ padding: 'var(--space-2xl)' }} initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once: true }}>
              <h3 style={{ marginBottom: 'var(--space-lg)' }}>
                <span className="material-symbols-outlined" style={{ marginRight: '0.5rem', color: 'var(--tertiary)' }}>psychology</span>
                Your Top Stressors
              </h3>
              {stats.topStressors.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 600, flex: '0 0 6rem', fontSize: '0.9rem' }}>{s.name}</span>
                  <div style={{ flex: 1, height: '0.5rem', borderRadius: 'var(--radius-full)', background: 'var(--surface-container-high)' }}>
                    <div style={{
                      width: `${(s.count / stats.topStressors[0].count) * 100}%`,
                      height: '100%',
                      borderRadius: 'var(--radius-full)',
                      background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                      transition: 'width 1s ease'
                    }} />
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', fontWeight: 600 }}>{s.count}</span>
                </div>
              ))}
            </motion.div>
          )}

          {/* Nudge if average is low */}
          {stats.avgScore > 0 && stats.avgScore <= 4 && (
            <motion.div className="card-tonal" style={{ marginTop: 'var(--space-xl)', padding: 'var(--space-xl)', textAlign: 'center' }}
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <div className="icon-bubble icon-bubble-tertiary" style={{ margin: '0 auto 1rem', width: '3rem', height: '3rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>favorite</span>
              </div>
              <h4 style={{ marginBottom: '0.5rem' }}>We notice you've been having a tough time</h4>
              <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                Your average score is {stats.avgScore}/10. Remember, reaching out is a sign of strength.
              </p>
              <Link to="/resources" className="btn btn-primary">View Wellness Resources</Link>
            </motion.div>
          )}

          {/* Mood Garden */}
          <motion.div style={{ marginTop: 'var(--space-xl)' }} initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once: true }}>
            <MoodGarden stats={stats} />
          </motion.div>

          {/* Achievement System */}
          <motion.div style={{ marginTop: 'var(--space-xl)' }} initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once: true }}>
            <AchievementSystem stats={stats} />
          </motion.div>

          {/* AI Insights */}
          <motion.div style={{ marginTop: 'var(--space-xl)' }} initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once: true }}>
            <AIInsights stats={stats} trends={trends} />
          </motion.div>

          {/* Mood Recommendations */}
          <motion.div style={{ marginTop: 'var(--space-xl)' }} initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once: true }}>
            <MoodRecommendations stats={stats} />
          </motion.div>
        </>
      )}
    </div>
  )
}
