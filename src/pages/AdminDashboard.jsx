import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler } from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler)

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }

const API_BASE = '/api'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('7-day')
  const [lastRefresh, setLastRefresh] = useState(null)
  const navigate = useNavigate()

  const token = sessionStorage.getItem('mindscape_admin_token')

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.status === 401) {
        sessionStorage.removeItem('mindscape_admin_token')
        navigate('/admin')
        return
      }
      if (!res.ok) throw new Error('Failed to fetch dashboard data')
      const json = await res.json()
      setData(json)
      setLastRefresh(new Date())
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [token, navigate])

  useEffect(() => {
    if (!token) {
      navigate('/admin')
      return
    }
    fetchDashboard()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboard, 30000)
    return () => clearInterval(interval)
  }, [fetchDashboard, token, navigate])

  const handleResolveAlert = async (alertId) => {
    try {
      await fetch(`${API_BASE}/admin/alerts/${alertId}/resolve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      fetchDashboard()
    } catch {}
  }

  const handleLogout = () => {
    sessionStorage.removeItem('mindscape_admin_token')
    navigate('/admin')
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="page-container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
            <div className="icon-bubble icon-bubble-primary" style={{ margin: '0 auto 1.5rem', width: '4rem', height: '4rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>monitoring</span>
            </div>
            <h3>Loading Dashboard...</h3>
            <p style={{ fontSize: '0.9rem' }}>Aggregating real-time campus data</p>
          </motion.div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: 'var(--space-4xl)' }}>
        <div className="icon-bubble icon-bubble-tertiary" style={{ margin: '0 auto 1.5rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.75rem' }}>error</span>
        </div>
        <h3>Dashboard Error</h3>
        <p>{error}</p>
        <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={fetchDashboard}>Retry</button>
      </div>
    )
  }

  if (!data) return null

  // ── Chart data from real API response ──
  const trendData = tab === '30-day' ? (data.monthlyTrend || []) : (data.weeklyTrend || [])
  const trendLabels = trendData.map(d => {
    const date = new Date(d.date + 'T00:00:00')
    return date.toLocaleDateString('en', { month: 'short', day: 'numeric' })
  })

  const trendChart = {
    labels: trendLabels,
    datasets: [{
      data: trendData.map(d => parseFloat(d.avg_score?.toFixed(1) || 0)),
      borderColor: '#2a6868',
      backgroundColor: 'rgba(176, 238, 237, 0.2)',
      fill: true, tension: 0.4, pointRadius: 4,
      pointBackgroundColor: '#2a6868', pointBorderColor: '#fff', pointBorderWidth: 2
    }]
  }

  const deptChart = {
    labels: (data.departments || []).map(d => d.name),
    datasets: [{
      data: (data.departments || []).map(d => d.score),
      backgroundColor: ['#2a6868', '#46655e', '#1b5c5c', '#765a28', '#42615b', '#3d6b5e', '#8a6d3b'],
      borderRadius: 8, barThickness: 40
    }]
  }

  const dist = data.moodDistribution || { positive: 0, mid: 0, low: 0 }
  const donutChart = {
    labels: ['Positive (7-10)', 'Mid (5-6)', 'Needs Attention (1-4)'],
    datasets: [{
      data: [dist.positive, dist.mid, dist.low],
      backgroundColor: ['#2a6868', '#fed799', '#a83836'],
      borderWidth: 0, cutout: '70%'
    }]
  }

  const chartOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { min: 0, max: 10, grid: { color: 'rgba(173,180,172,0.15)' }, ticks: { color: '#5a615b', font: { family: 'Inter' } } },
      x: { grid: { display: false }, ticks: { color: '#5a615b', font: { family: 'Inter' } } }
    }
  }

  const barOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { min: 0, max: 10, grid: { color: 'rgba(173,180,172,0.15)' }, ticks: { color: '#5a615b' } },
      x: { grid: { display: false }, ticks: { color: '#5a615b' } }
    }
  }

  const departments = data.departments || []
  const alerts = data.alerts || []
  const wordCloud = data.wordCloud || []
  const topStressors = data.topStressors || []
  const moodChange = data.campusMoodChange || 0

  // Generate AI digest from real data
  const generateDigest = () => {
    if (data.totalCheckins === 0 && data.allTimeTotalCheckins === 0) {
      return "No check-in data available yet. Encourage students to submit their first wellness check-in to begin building campus insights."
    }

    const parts = []
    const today = new Date().toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })

    parts.push(`As of ${today}: Campus mood score is ${data.campusMood}/10 with ${data.totalCheckins} check-in${data.totalCheckins !== 1 ? 's' : ''} today from ${data.uniqueUsersToday} unique user${data.uniqueUsersToday !== 1 ? 's' : ''}.`)

    if (moodChange !== 0) {
      parts.push(`This is ${moodChange > 0 ? '↑' : '↓'} ${Math.abs(moodChange).toFixed(1)} compared to yesterday.`)
    }

    if (departments.length > 0) {
      const lowest = departments.reduce((a, b) => a.score < b.score ? a : b)
      const highest = departments.reduce((a, b) => a.score > b.score ? a : b)
      if (lowest.name !== highest.name) {
        parts.push(`${highest.name} shows the highest well-being (${highest.score}/10) while ${lowest.name} needs attention (${lowest.score}/10).`)
      }
    }

    if (topStressors.length > 0) {
      const top3 = topStressors.slice(0, 3).map(s => s.name.toLowerCase())
      parts.push(`Top reported stressors this week: ${top3.join(', ')}.`)
    }

    if (alerts.length > 0) {
      parts.push(`⚠️ ${alerts.length} active alert${alerts.length !== 1 ? 's' : ''} requiring attention.`)
    }

    parts.push(`Total platform usage: ${data.allTimeTotalCheckins} check-ins from ${data.allTimeUniqueUsers} unique users.`)

    return parts.join(' ')
  }

  const generateRecommendation = () => {
    const recs = []
    if (departments.length > 0) {
      const atRisk = departments.filter(d => d.score < 5)
      if (atRisk.length > 0) {
        recs.push(`Deploy targeted wellness outreach for ${atRisk.map(d => d.name).join(', ')}.`)
      }
      const thriving = departments.filter(d => d.score >= 7)
      if (thriving.length > 0) {
        recs.push(`${thriving.map(d => d.name).join(', ')} ${thriving.length > 1 ? 'show' : 'shows'} strong well-being — consider peer-mentoring collaboration.`)
      }
    }
    if (topStressors.some(s => s.name.toLowerCase().includes('exam'))) {
      recs.push('Exam-related stress is prominent. Consider scheduling de-stress sessions before exam periods.')
    }
    if (topStressors.some(s => s.name.toLowerCase().includes('sleep'))) {
      recs.push('Sleep issues are being reported frequently. Evaluate hostel/dorm quiet-hours policies.')
    }
    if (data.totalCheckins === 0) {
      recs.push('Increase platform awareness through department announcements and orientation sessions.')
    }
    return recs.length > 0 ? recs.join(' ') : 'Continue monitoring trends and maintain regular check-in prompts.'
  }

  return (
    <div className="page-container" style={{ position: 'relative' }}>
      {/* Aurora Background */}
      <div className="aurora-background">
        <div className="aurora" />
      </div>
      {/* Header */}
      <motion.div initial="hidden" animate="show" variants={fadeUp}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)', flexWrap: 'wrap', gap: '1rem', position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h2 style={{ margin: 0 }}>MindScape — Admin</h2>
            <span className="chip" style={{ background: 'var(--primary-container)', color: 'var(--on-primary-container)', fontSize: '0.7rem' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2a6868', display: 'inline-block', marginRight: 4, animation: 'pulse-soft 2s infinite' }} />
              Live
            </span>
          </div>
          {lastRefresh && (
            <p style={{ fontSize: '0.75rem', margin: '0.25rem 0 0', color: 'var(--on-surface-variant)' }}>
              Last updated: {lastRefresh.toLocaleTimeString()} · Auto-refreshes every 30s
            </p>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn btn-outline btn-sm" onClick={fetchDashboard}>
            <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>refresh</span> Refresh
          </button>
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </motion.div>

      {/* Top Bento Row */}
      <motion.div className="grid-bento" style={{ marginBottom: 'var(--space-lg)', position: 'relative', zIndex: 1 }} initial="hidden" animate="show" variants={stagger}>
        {/* Hero Card — Campus Mood */}
        <motion.div variants={fadeUp} className="bento-hero pulse-glow" style={{ gridColumn: 'span 5', position: 'relative' }}>
          <div className="orb-background">
            <div className="orb orb-3" style={{ width: '200px', height: '200px', top: '20%', left: '50%' }} />
          </div>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.8 }}>
            Campus Mood Score Today
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.75rem 0' }}>
            <span style={{ fontSize: '3.5rem', fontWeight: 800, fontFamily: 'var(--font-headline)' }}>
              {data.campusMood || '—'}
            </span>
            <span style={{ fontSize: '1.5rem', opacity: 0.7 }}>/10</span>
          </div>
          <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '1.25rem', color: 'var(--on-primary)' }}>
            {moodChange !== 0 ? (moodChange > 0 ? '↑' : '↓') + ' ' + Math.abs(moodChange).toFixed(1) + ' from yesterday' : 'No comparison data yet'}
            {' · '}{data.totalCheckins} check-in{data.totalCheckins !== 1 ? 's' : ''} today
          </p>
          {data.totalCheckins > 0 && (
            <>
              <div className="mood-bar" style={{ maxWidth: '100%' }}>
                <div className="mood-bar-low" style={{ width: `${dist.low}%` }} />
                <div className="mood-bar-mid" style={{ width: `${dist.mid}%` }} />
                <div className="mood-bar-high" style={{ width: `${dist.positive}%` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', opacity: 0.7 }}>
                <span>Low ({dist.low}%)</span><span>Mid ({dist.mid}%)</span><span>Positive ({dist.positive}%)</span>
              </div>
            </>
          )}
          {data.totalCheckins === 0 && (
            <p style={{ fontSize: '0.85rem', opacity: 0.6, fontStyle: 'italic' }}>
              No check-ins yet today. Data will appear as students submit their wellness reports.
            </p>
          )}
        </motion.div>

        {/* Alerts Card */}
        <motion.div variants={fadeUp} className="bento-card border-glow" style={{ gridColumn: 'span 4' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--on-surface-variant)' }}>
            Active Alerts
          </span>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-headline)', color: alerts.length > 0 ? 'var(--error)' : 'var(--primary)', margin: '0.5rem 0 1rem' }}>
            {alerts.length}
          </div>
          {alerts.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>
              No active alerts. The system automatically creates alerts when burnout patterns or low engagement are detected.
            </p>
          ) : (
            alerts.slice(0, 4).map((a) => (
              <div key={a.id} className="alert-item" style={{ position: 'relative' }}>
                <div className={`alert-dot alert-dot-${a.level}`} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.85rem', margin: 0 }}>{a.message}</p>
                  <p style={{ fontSize: '0.7rem', margin: '0.25rem 0 0', color: 'var(--on-surface-variant)' }}>
                    {new Date(a.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleResolveAlert(a.id)}
                  className="btn btn-outline btn-sm"
                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem' }}
                >
                  Resolve
                </button>
              </div>
            ))
          )}
        </motion.div>

        {/* Participation / All-time Stats */}
        <motion.div variants={fadeUp} className="bento-card border-glow" style={{ gridColumn: 'span 3' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--on-surface-variant)' }}>
            Platform Stats
          </span>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-headline)', margin: '0.5rem 0' }}>
            {data.allTimeUniqueUsers}
          </div>
          <p style={{ fontSize: '0.8rem', margin: '0 0 1rem' }}>
            unique users · {data.allTimeTotalCheckins} total check-ins
          </p>
          {data.totalCheckins > 0 ? (
            <div style={{ height: '120px' }}>
              <Doughnut data={donutChart} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            </div>
          ) : (
            <p style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', fontStyle: 'italic' }}>
              Mood distribution chart will appear when today's check-ins are recorded.
            </p>
          )}
        </motion.div>
      </motion.div>

      {/* Bottom Row: Trend + Dept Scores */}
      <motion.div className="grid-bento" initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true }}>
        {/* Trend Chart */}
        <motion.div variants={fadeUp} className="bento-card" style={{ gridColumn: 'span 8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['7-day', '30-day', 'By dept'].map(t => (
                <button key={t} className={`chip ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
              ))}
            </div>
          </div>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--on-surface-variant)', marginBottom: '0.75rem' }}>
            {tab === 'By dept' ? 'Department Comparison' : `Mood Trend — Campus Average (${tab})`}
          </div>
          <div style={{ height: '260px' }}>
            {trendData.length === 0 && tab !== 'By dept' ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: '0.5rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: 'var(--on-surface-variant)', opacity: 0.4 }}>show_chart</span>
                <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>Trend data will appear after check-ins are submitted</p>
              </div>
            ) : tab === 'By dept' ? (
              departments.length > 0
                ? <Bar data={deptChart} options={barOpts} />
                : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <p style={{ color: 'var(--on-surface-variant)' }}>No department data yet</p>
                  </div>
            ) : <Line data={trendChart} options={chartOpts} />}
          </div>
        </motion.div>

        {/* Department Scores */}
        <motion.div variants={fadeUp} className="bento-card" style={{ gridColumn: 'span 4' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--on-surface-variant)', display: 'block', marginBottom: 'var(--space-lg)' }}>
            Dept Scores
          </span>
          {departments.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', fontStyle: 'italic' }}>
              Department scores appear when students select their department during check-in.
            </p>
          ) : (
            departments.map((d, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.75rem 0', borderBottom: i < departments.length - 1 ? '1px solid var(--surface-container-high)' : 'none'
              }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 700 }}>{d.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginLeft: '0.5rem' }}>{d.students} users</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {d.change !== 0 && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: d.change > 0 ? 'var(--primary)' : 'var(--error)' }}>
                      {d.change > 0 ? '↑' : '↓'}{Math.abs(d.change).toFixed(1)}
                    </span>
                  )}
                  <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '1.1rem',
                    color: d.score < 5 ? 'var(--error)' : d.score < 6.5 ? 'var(--tertiary)' : 'var(--primary)' }}>
                    {d.score}
                  </span>
                </div>
              </div>
            ))
          )}
        </motion.div>

        {/* Word Cloud */}
        <motion.div variants={fadeUp} className="bento-card" style={{ gridColumn: 'span 5' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--on-surface-variant)', display: 'block', marginBottom: 'var(--space-lg)' }}>
            This Week's Themes
          </span>
          {wordCloud.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', fontStyle: 'italic', textAlign: 'center', padding: '2rem 0' }}>
              Word themes will appear when students share thoughts in their check-ins.
            </p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', padding: '1rem 0' }}>
              {wordCloud.map((w, i) => (
                <motion.span key={i} className="word-tag" whileHover={{ scale: 1.08 }}
                  style={{ fontSize: `${w.size}rem` }}
                  title={`mentioned ${w.count} time${w.count !== 1 ? 's' : ''}`}>
                  {w.word}
                </motion.span>
              ))}
            </div>
          )}
        </motion.div>

        {/* AI Digest */}
        <motion.div variants={fadeUp} className="bento-card" style={{ gridColumn: 'span 7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--on-surface-variant)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.25rem', color: 'var(--primary)' }}>smart_toy</span>
              Insights Digest
            </span>
          </div>
          <div className="card-tonal" style={{ padding: 'var(--space-lg)', lineHeight: 1.7 }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--on-surface)' }}>
              <strong>Summary:</strong> {generateDigest()}
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--on-surface)', marginTop: '0.75rem' }}>
              <strong>Recommendation:</strong> {generateRecommendation()}
            </p>
          </div>
        </motion.div>

        {/* Top Stressors */}
        {topStressors.length > 0 && (
          <motion.div variants={fadeUp} className="bento-card" style={{ gridColumn: 'span 12' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--on-surface-variant)', display: 'block', marginBottom: 'var(--space-lg)' }}>
              Top Stressors This Week
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {topStressors.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 600, flex: '0 0 5rem', fontSize: '0.85rem' }}>{s.name}</span>
                  <div style={{ flex: 1, height: '0.4rem', borderRadius: 'var(--radius-full)', background: 'var(--surface-container-high)' }}>
                    <div style={{
                      width: `${(s.count / topStressors[0].count) * 100}%`,
                      height: '100%', borderRadius: 'var(--radius-full)',
                      background: 'linear-gradient(90deg, var(--primary), var(--tertiary))',
                      transition: 'width 1s ease'
                    }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', fontWeight: 600, minWidth: '1.5rem' }}>{s.count}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
