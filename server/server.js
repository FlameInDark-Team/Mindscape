import express from 'express'
import cors from 'cors'
import crypto from 'crypto'
import Groq from 'groq-sdk'
import dotenv from 'dotenv'
import { initDB, db } from './db.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// CORS configuration for production
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.json())

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

// Initialize database
initDB()

// ─────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

function generateToken() {
  return 'msu-' + Date.now() + '-' + crypto.randomBytes(16).toString('hex')
}

// ─────────────────────────────────────────────
// HEALTH CHECK
// ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const entryCount = db.prepare('SELECT COUNT(*) as c FROM mood_entries').get()
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    totalEntries: entryCount.c
  })
})

// ─────────────────────────────────────────────
// SUBMIT CHECK-IN (anonymous, with session_id)
// ─────────────────────────────────────────────
app.post('/api/checkin', (req, res) => {
  try {
    const { score, text, stressors, session_id, department } = req.body

    if (!score || score < 1 || score > 10) {
      return res.status(400).json({ error: 'Score must be between 1 and 10' })
    }
    if (!session_id) {
      return res.status(400).json({ error: 'session_id is required' })
    }

    const dept = department || 'General'
    const safeText = (text || '').slice(0, 280)
    const safeStressors = JSON.stringify(stressors || [])

    const stmt = db.prepare(`
      INSERT INTO mood_entries (session_id, score, text, stressors, department, created_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `)
    const result = stmt.run(session_id, score, safeText, safeStressors, dept)

    // Run alert detection after each check-in
    checkAlerts(dept)

    res.json({
      success: true,
      message: 'Check-in recorded',
      id: result.lastInsertRowid
    })
  } catch (err) {
    console.error('Check-in error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─────────────────────────────────────────────
// GET RESOURCES (from database)
// ─────────────────────────────────────────────
app.get('/api/resources', (req, res) => {
  try {
    const resources = db.prepare('SELECT * FROM resources ORDER BY category, title').all()
    res.json(resources)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─────────────────────────────────────────────
// PERSONAL TRENDS (for a specific anonymous session)
// ─────────────────────────────────────────────
app.get('/api/personal/trends', (req, res) => {
  try {
    const { session_id, days } = req.query
    if (!session_id) {
      return res.status(400).json({ error: 'session_id is required' })
    }

    const numDays = Math.min(Math.max(parseInt(days) || 30, 1), 90)

    const trends = db.prepare(`
      SELECT
        date(created_at) as date,
        AVG(score) as avg_score,
        COUNT(*) as count,
        MIN(score) as min_score,
        MAX(score) as max_score
      FROM mood_entries
      WHERE session_id = ? AND created_at >= datetime('now', ? || ' days')
      GROUP BY date(created_at)
      ORDER BY date(created_at)
    `).all(session_id, `-${numDays}`)

    res.json(trends)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─────────────────────────────────────────────
// PERSONAL STATS (average, streak, top stressors)
// ─────────────────────────────────────────────
app.get('/api/personal/stats', (req, res) => {
  try {
    const { session_id } = req.query
    if (!session_id) {
      return res.status(400).json({ error: 'session_id is required' })
    }

    // Overall stats
    const stats = db.prepare(`
      SELECT
        COUNT(*) as total_checkins,
        AVG(score) as avg_score,
        MIN(score) as lowest,
        MAX(score) as highest
      FROM mood_entries
      WHERE session_id = ?
    `).get(session_id)

    // Streak calculation
    let streak = 0
    for (let i = 0; i < 60; i++) {
      const dayEntry = db.prepare(`
        SELECT COUNT(*) as c FROM mood_entries
        WHERE session_id = ? AND date(created_at) = date('now', ? || ' days')
      `).get(session_id, `-${i}`)
      if (dayEntry.c > 0) streak++
      else break
    }

    // Top stressors
    const entries = db.prepare(`
      SELECT stressors FROM mood_entries
      WHERE session_id = ? AND stressors != '[]'
    `).all(session_id)

    const stressorCounts = {}
    entries.forEach(e => {
      try {
        const parsed = JSON.parse(e.stressors)
        parsed.forEach(s => { stressorCounts[s] = (stressorCounts[s] || 0) + 1 })
      } catch {}
    })
    const topStressors = Object.entries(stressorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }))

    // Recent entries for chart
    const recentEntries = db.prepare(`
      SELECT score, date(created_at) as date, created_at
      FROM mood_entries
      WHERE session_id = ?
      ORDER BY created_at DESC
      LIMIT 50
    `).all(session_id)

    // ── EARLY WARNING DETECTION ──
    // Check last 7 days for declining trend
    const last7Days = db.prepare(`
      SELECT score, date(created_at) as date
      FROM mood_entries
      WHERE session_id = ? AND created_at >= datetime('now', '-7 days')
      ORDER BY created_at DESC
    `).all(session_id)

    let warningLevel = 'none' // none, mild, moderate, severe
    let warningMessage = null
    let suggestedActions = []

    if (last7Days.length >= 3) {
      const avgLast3 = last7Days.slice(0, 3).reduce((sum, e) => sum + e.score, 0) / Math.min(3, last7Days.length)
      const avgLast7 = last7Days.reduce((sum, e) => sum + e.score, 0) / last7Days.length
      
      // Declining trend detection
      const first3Avg = last7Days.slice(-3).reduce((sum, e) => sum + e.score, 0) / Math.min(3, last7Days.slice(-3).length)
      const isDecreasing = avgLast3 < first3Avg - 1

      if (avgLast3 <= 3) {
        warningLevel = 'severe'
        warningMessage = 'Your recent check-ins show consistently low scores. This may indicate you need immediate support.'
        suggestedActions = [
          { type: 'crisis', text: 'Talk to a counselor now', action: 'contact_counselor' },
          { type: 'resource', text: 'View crisis resources', action: 'view_crisis_resources' },
          { type: 'exercise', text: 'Try a calming exercise', action: 'breathing_exercise' }
        ]
      } else if (avgLast3 <= 4.5) {
        warningLevel = 'moderate'
        warningMessage = 'Your mood has been lower than usual. Consider reaching out for support.'
        suggestedActions = [
          { type: 'resource', text: 'Explore wellness resources', action: 'view_resources' },
          { type: 'counselor', text: 'Schedule a counseling session', action: 'contact_counselor' },
          { type: 'exercise', text: 'Practice mindfulness', action: 'breathing_exercise' }
        ]
      } else if (isDecreasing && avgLast3 < 6) {
        warningLevel = 'mild'
        warningMessage = 'We noticed your mood trending downward. Taking proactive steps now can help.'
        suggestedActions = [
          { type: 'resource', text: 'Read stress management tips', action: 'view_resources' },
          { type: 'exercise', text: 'Try a 5-minute breathing exercise', action: 'breathing_exercise' },
          { type: 'social', text: 'Connect with campus support', action: 'view_resources' }
        ]
      }
    }

    // Check for burnout patterns (consistent moderate-low scores)
    const last14Days = db.prepare(`
      SELECT AVG(score) as avg_score, COUNT(*) as count
      FROM mood_entries
      WHERE session_id = ? AND created_at >= datetime('now', '-14 days')
    `).get(session_id)

    let burnoutRisk = false
    if (last14Days.count >= 7 && last14Days.avg_score < 5.5) {
      burnoutRisk = true
      if (warningLevel === 'none') {
        warningLevel = 'moderate'
        warningMessage = 'Your scores suggest possible burnout. Consider taking preventive action.'
        suggestedActions = [
          { type: 'resource', text: 'Learn about burnout prevention', action: 'view_resources' },
          { type: 'counselor', text: 'Talk to a wellness counselor', action: 'contact_counselor' },
          { type: 'self-care', text: 'Explore self-care strategies', action: 'view_resources' }
        ]
      }
    }

    res.json({
      totalCheckins: stats.total_checkins || 0,
      avgScore: stats.avg_score ? parseFloat(stats.avg_score.toFixed(1)) : 0,
      lowest: stats.lowest || 0,
      highest: stats.highest || 0,
      streak,
      topStressors,
      recentEntries,
      // Early warning system
      earlyWarning: {
        level: warningLevel,
        message: warningMessage,
        suggestedActions,
        burnoutRisk,
        last7DayAvg: last7Days.length > 0 ? parseFloat((last7Days.reduce((sum, e) => sum + e.score, 0) / last7Days.length).toFixed(1)) : 0
      }
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─────────────────────────────────────────────
// ORGANIZATION REGISTRATION
// ─────────────────────────────────────────────
app.post('/api/organization/register', (req, res) => {
  try {
    const { name, email, password, description } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    // Check if organization already exists
    const existing = db.prepare('SELECT id FROM organizations WHERE email = ?').get(email)
    if (existing) {
      return res.status(400).json({ error: 'Organization email already registered' })
    }

    // Create organization
    const passwordHash = hashPassword(password)
    const stmt = db.prepare(`
      INSERT INTO organizations (name, email, password_hash, description, created_at, last_login)
      VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
    `)
    const result = stmt.run(name, email, passwordHash, description || '')

    const token = generateToken()

    res.json({
      success: true,
      token,
      organizationId: result.lastInsertRowid,
      name,
      email
    })
  } catch (err) {
    console.error('Organization registration error:', err.message)
    res.status(500).json({ error: 'Registration failed' })
  }
})

// ─────────────────────────────────────────────
// ORGANIZATION LOGIN
// ─────────────────────────────────────────────
app.post('/api/organization/login', (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const passwordHash = hashPassword(password)
    const org = db.prepare('SELECT * FROM organizations WHERE email = ? AND password_hash = ?').get(email, passwordHash)

    if (!org) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Update last login
    db.prepare('UPDATE organizations SET last_login = datetime("now") WHERE id = ?').run(org.id)

    const token = generateToken()

    res.json({
      success: true,
      token,
      organizationId: org.id,
      name: org.name,
      email: org.email,
      description: org.description
    })
  } catch (err) {
    console.error('Organization login error:', err.message)
    res.status(500).json({ error: 'Login failed' })
  }
})

// ─────────────────────────────────────────────
// GET ALL ORGANIZATIONS (for user selection)
// ─────────────────────────────────────────────
app.get('/api/organizations', (req, res) => {
  try {
    const organizations = db.prepare('SELECT id, name, description FROM organizations ORDER BY name').all()
    res.json(organizations)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─────────────────────────────────────────────
// USER REGISTRATION
// ─────────────────────────────────────────────
app.post('/api/user/register', (req, res) => {
  try {
    const { email, password, name, organizationId } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    // Check if user already exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    // Create user
    const passwordHash = hashPassword(password)
    const stmt = db.prepare(`
      INSERT INTO users (email, password_hash, name, organization_id, created_at, last_login)
      VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
    `)
    const result = stmt.run(email, passwordHash, name, organizationId || null)

    const token = generateToken()

    // Get organization name if provided
    let organizationName = null
    if (organizationId) {
      const org = db.prepare('SELECT name FROM organizations WHERE id = ?').get(organizationId)
      organizationName = org?.name
    }

    res.json({
      success: true,
      token,
      email,
      name,
      userId: result.lastInsertRowid,
      organizationId: organizationId || null,
      organizationName
    })
  } catch (err) {
    console.error('Registration error:', err.message)
    res.status(500).json({ error: 'Registration failed' })
  }
})

// ─────────────────────────────────────────────
// USER LOGIN
// ─────────────────────────────────────────────
app.post('/api/user/login', (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const passwordHash = hashPassword(password)
    const user = db.prepare('SELECT * FROM users WHERE email = ? AND password_hash = ?').get(email, passwordHash)

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Update last login
    db.prepare('UPDATE users SET last_login = datetime("now") WHERE id = ?').run(user.id)

    const token = generateToken()

    res.json({
      success: true,
      token,
      email: user.email,
      name: user.name,
      userId: user.id
    })
  } catch (err) {
    console.error('Login error:', err.message)
    res.status(500).json({ error: 'Login failed' })
  }
})

// ─────────────────────────────────────────────
// GOOGLE AUTHENTICATION (User)
// ─────────────────────────────────────────────
app.post('/api/user/google-auth', (req, res) => {
  try {
    const { email, name, picture } = req.body

    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' })
    }

    // Check if user exists
    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)

    if (!user) {
      // Create new user with Google auth (no password needed)
      const stmt = db.prepare(`
        INSERT INTO users (email, password_hash, name, created_at, last_login)
        VALUES (?, ?, ?, datetime('now'), datetime('now'))
      `)
      const result = stmt.run(email, 'GOOGLE_AUTH', name)
      user = { id: result.lastInsertRowid, email, name }
    } else {
      // Update last login
      db.prepare('UPDATE users SET last_login = datetime("now") WHERE id = ?').run(user.id)
    }

    const token = generateToken()

    res.json({
      success: true,
      token,
      email: user.email,
      name: user.name || name,
      picture,
      userId: user.id
    })
  } catch (err) {
    console.error('Google auth error:', err.message)
    res.status(500).json({ error: 'Google authentication failed' })
  }
})

// ─────────────────────────────────────────────
// GOOGLE AUTHENTICATION (Admin)
// ─────────────────────────────────────────────
app.post('/api/admin/google-auth', (req, res) => {
  try {
    const { email, name } = req.body
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'usertest2021subhradeep@gmail.com'

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    // Check if email matches admin email
    if (email !== ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Access denied. You are not authorized to access the admin panel.' })
    }

    const token = 'msa-' + Date.now() + '-' + crypto.randomBytes(16).toString('hex')

    res.json({
      success: true,
      token,
      email,
      name: name || 'Admin'
    })
  } catch (err) {
    console.error('Admin Google auth error:', err.message)
    res.status(500).json({ error: 'Admin authentication failed' })
  }
})

// ─────────────────────────────────────────────
// AI CHATBOT (Groq Integration) - Authenticated Users
// ─────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token || !token.startsWith('msu-')) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { message, history } = req.body

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' })
    }

    // Build conversation history for Groq
    const messages = [
      {
        role: 'system',
        content: `You are a compassionate AI mental health companion for college students using MindScape, a mental wellness platform. Your role is to:

1. Provide empathetic, supportive responses to students dealing with stress, anxiety, burnout, and other mental health challenges
2. Offer evidence-based coping strategies, mindfulness techniques, and self-care advice
3. Encourage healthy habits like sleep hygiene, exercise, social connection, and time management
4. Recognize when someone may need professional help and gently suggest they reach out to counselors or crisis resources
5. Never diagnose conditions or replace professional mental health care
6. Be warm, understanding, and non-judgmental
7. Keep responses concise (2-4 paragraphs) and actionable
8. Use encouraging language and validate their feelings

IMPORTANT: If someone expresses suicidal thoughts or severe crisis, immediately encourage them to:
- Call 988 (Suicide & Crisis Lifeline) in the US
- Text "HELLO" to 741741 (Crisis Text Line)
- Contact campus counseling services
- Go to the nearest emergency room

Remember: You're a supportive companion, not a therapist. Focus on practical wellness strategies and emotional support.`
      }
    ]

    // Add conversation history (last 10 messages)
    if (history && Array.isArray(history)) {
      history.slice(-10).forEach(msg => {
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })
      })
    }

    // Add current message
    messages.push({
      role: 'user',
      content: message
    })

    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 800,
      top_p: 0.9
    })

    const response = completion.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.'

    res.json({
      success: true,
      response
    })
  } catch (err) {
    console.error('Chat error:', err.message)
    res.status(500).json({ error: 'Failed to process chat message' })
  }
})

// ─────────────────────────────────────────────
// AI CHATBOT (Anonymous) - For All Users
// ─────────────────────────────────────────────
app.post('/api/chat/anonymous', async (req, res) => {
  try {
    const { message, history } = req.body

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' })
    }

    // Build conversation history for Groq
    const messages = [
      {
        role: 'system',
        content: `You are a compassionate AI mental health companion for college students using MindScape, a mental wellness platform. Your role is to:

1. Provide empathetic, supportive responses to students dealing with stress, anxiety, burnout, and other mental health challenges
2. Offer evidence-based coping strategies, mindfulness techniques, and self-care advice
3. Encourage healthy habits like sleep hygiene, exercise, social connection, and time management
4. Recognize when someone may need professional help and gently suggest they reach out to counselors or crisis resources
5. Never diagnose conditions or replace professional mental health care
6. Be warm, understanding, and non-judgmental
7. Keep responses concise (2-4 paragraphs) and actionable
8. Use encouraging language and validate their feelings

IMPORTANT: If someone expresses suicidal thoughts or severe crisis, immediately encourage them to:
- Call 988 (Suicide & Crisis Lifeline) in the US
- Text "HELLO" to 741741 (Crisis Text Line)
- Contact campus counseling services
- Go to the nearest emergency room

Remember: You're a supportive companion, not a therapist. Focus on practical wellness strategies and emotional support.`
      }
    ]

    // Add conversation history (last 10 messages)
    if (history && Array.isArray(history)) {
      history.slice(-10).forEach(msg => {
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })
      })
    }

    // Add current message
    messages.push({
      role: 'user',
      content: message
    })

    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 800,
      top_p: 0.9
    })

    const response = completion.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.'

    res.json({
      success: true,
      response
    })
  } catch (err) {
    console.error('Anonymous chat error:', err.message)
    res.status(500).json({ error: 'Failed to process chat message' })
  }
})

// ─────────────────────────────────────────────
// ADMIN LOGIN
// ─────────────────────────────────────────────
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body
  // Production credentials — change for deployment
  if (username === 'admin' && password === 'mindscape2024') {
    const token = 'ms-' + Date.now() + '-' + Math.random().toString(36).slice(2)
    res.json({ success: true, token })
  } else {
    res.status(401).json({ error: 'Invalid credentials' })
  }
})

// Simple auth middleware
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token || (!token.startsWith('ms-') && !token.startsWith('msa-'))) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

// ─────────────────────────────────────────────
// ADMIN DASHBOARD — All real-time computed data
// ─────────────────────────────────────────────
app.get('/api/admin/dashboard', requireAuth, (req, res) => {
  try {
    // ── Today's aggregate stats ──
    const today = db.prepare(`
      SELECT
        AVG(score) as avg_score,
        COUNT(*) as total_checkins,
        COUNT(DISTINCT session_id) as unique_users,
        SUM(CASE WHEN score <= 4 THEN 1 ELSE 0 END) as low_count,
        SUM(CASE WHEN score BETWEEN 5 AND 6 THEN 1 ELSE 0 END) as mid_count,
        SUM(CASE WHEN score >= 7 THEN 1 ELSE 0 END) as high_count
      FROM mood_entries
      WHERE date(created_at) = date('now')
    `).get()

    // ── Yesterday for comparison ──
    const yesterday = db.prepare(`
      SELECT AVG(score) as avg_score, COUNT(*) as total_checkins
      FROM mood_entries
      WHERE date(created_at) = date('now', '-1 day')
    `).get()

    // ── All-time stats ──
    const allTime = db.prepare(`
      SELECT COUNT(*) as total, COUNT(DISTINCT session_id) as unique_users
      FROM mood_entries
    `).get()

    // ── 7-day trend ──
    const weeklyTrend = db.prepare(`
      SELECT
        date(created_at) as date,
        AVG(score) as avg_score,
        COUNT(*) as count
      FROM mood_entries
      WHERE created_at >= datetime('now', '-7 days')
      GROUP BY date(created_at)
      ORDER BY date(created_at)
    `).all()

    // ── 30-day trend ──
    const monthlyTrend = db.prepare(`
      SELECT
        date(created_at) as date,
        AVG(score) as avg_score,
        COUNT(*) as count
      FROM mood_entries
      WHERE created_at >= datetime('now', '-30 days')
      GROUP BY date(created_at)
      ORDER BY date(created_at)
    `).all()

    // ── Department breakdown ──
    const departments = db.prepare(`
      SELECT
        department as name,
        COUNT(DISTINCT session_id) as students,
        AVG(score) as score,
        COUNT(*) as checkins
      FROM mood_entries
      WHERE created_at >= datetime('now', '-7 days')
      GROUP BY department
      ORDER BY score ASC
    `).all()

    // Calculate per-department change (7-day vs prior 7-day)
    const deptWithChange = departments.map(d => {
      const prior = db.prepare(`
        SELECT AVG(score) as avg_score
        FROM mood_entries
        WHERE department = ? AND created_at >= datetime('now', '-14 days') AND created_at < datetime('now', '-7 days')
      `).get(d.name)

      const change = prior?.avg_score
        ? parseFloat((d.score - prior.avg_score).toFixed(1))
        : 0

      return {
        name: d.name,
        students: d.students,
        score: parseFloat(d.score.toFixed(1)),
        checkins: d.checkins,
        change
      }
    })

    // ── Word frequency from today's texts ──
    const texts = db.prepare(`
      SELECT text FROM mood_entries
      WHERE created_at >= datetime('now', '-7 days') AND text != '' AND text IS NOT NULL
    `).all()

    const stopWords = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'i', 'me', 'my',
      'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'it', 'this', 'that', 'so', 'not', 'no', 'am', 'been', 'be', 'have',
      'has', 'had', 'do', 'does', 'did', 'just', 'very', 'really', 'about',
      'can', 'too', 'some', 'all', 'more', 'much', 'than',
      'im', "i'm", 'dont', "don't", 'cant', "can't", 'its', "it's"])

    const wordCounts = {}
    texts.forEach(t => {
      const words = t.text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/)
      words.forEach(w => {
        if (w.length > 2 && !stopWords.has(w)) {
          wordCounts[w] = (wordCounts[w] || 0) + 1
        }
      })
    })
    const wordCloud = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([word, count]) => ({ word, count, size: 0.8 + (count / Math.max(...Object.values(wordCounts))) * 0.6 }))

    // ── Active alerts ──
    const alerts = db.prepare('SELECT * FROM alerts WHERE resolved = 0 ORDER BY created_at DESC').all()

    // ── Stressor distribution (this week) ──
    const stressorEntries = db.prepare(`
      SELECT stressors FROM mood_entries
      WHERE created_at >= datetime('now', '-7 days') AND stressors != '[]'
    `).all()

    const stressorCounts = {}
    stressorEntries.forEach(e => {
      try {
        JSON.parse(e.stressors).forEach(s => { stressorCounts[s] = (stressorCounts[s] || 0) + 1 })
      } catch {}
    })
    const topStressors = Object.entries(stressorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }))

    // ── Build response ──
    const totalToday = today.total_checkins || 0
    const avgToday = today.avg_score || 0
    const avgYesterday = yesterday.avg_score || 0

    res.json({
      campusMood: parseFloat(avgToday.toFixed(1)),
      campusMoodChange: parseFloat((avgToday - avgYesterday).toFixed(1)),
      totalCheckins: totalToday,
      uniqueUsersToday: today.unique_users || 0,
      allTimeTotalCheckins: allTime.total || 0,
      allTimeUniqueUsers: allTime.unique_users || 0,
      moodDistribution: {
        low: totalToday ? Math.round(((today.low_count || 0) / totalToday) * 100) : 0,
        mid: totalToday ? Math.round(((today.mid_count || 0) / totalToday) * 100) : 0,
        positive: totalToday ? Math.round(((today.high_count || 0) / totalToday) * 100) : 0
      },
      weeklyTrend,
      monthlyTrend,
      departments: deptWithChange,
      wordCloud,
      alerts,
      topStressors,
      lastUpdated: new Date().toISOString()
    })
  } catch (err) {
    console.error('Dashboard error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─────────────────────────────────────────────
// ADMIN — Get alerts
// ─────────────────────────────────────────────
app.get('/api/admin/alerts', requireAuth, (req, res) => {
  try {
    const alerts = db.prepare('SELECT * FROM alerts WHERE resolved = 0 ORDER BY created_at DESC').all()
    res.json(alerts)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─────────────────────────────────────────────
// ADMIN — Resolve an alert
// ─────────────────────────────────────────────
app.post('/api/admin/alerts/:id/resolve', requireAuth, (req, res) => {
  try {
    const { id } = req.params
    db.prepare('UPDATE alerts SET resolved = 1 WHERE id = ?').run(id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─────────────────────────────────────────────
// TREND DETECTION — Automated alerts
// ─────────────────────────────────────────────
function checkAlerts(department) {
  try {
    // Check if average of last 3 days for this department is below 4
    const recent = db.prepare(`
      SELECT AVG(score) as avg_score, COUNT(*) as cnt
      FROM mood_entries
      WHERE created_at >= datetime('now', '-3 days')
        AND department = ?
    `).get(department)

    if (recent.cnt >= 3 && recent.avg_score && recent.avg_score < 4) {
      // Don't create duplicate alerts for same dept on same day
      const existing = db.prepare(`
        SELECT id FROM alerts
        WHERE type = 'burnout' AND department = ? AND resolved = 0
        AND date(created_at) = date('now')
      `).get(department)

      if (!existing) {
        db.prepare(`
          INSERT INTO alerts (type, message, level, department, created_at, resolved)
          VALUES ('burnout', ?, 'critical', ?, datetime('now'), 0)
        `).run(
          `${department} — 3-day average at ${recent.avg_score.toFixed(1)}/10, possible burnout trend detected`,
          department
        )
      }
    }

    // Check for low engagement — if a department has fewer than expected check-ins
    const engagement = db.prepare(`
      SELECT COUNT(DISTINCT session_id) as users, COUNT(*) as checkins
      FROM mood_entries
      WHERE department = ? AND created_at >= datetime('now', '-7 days')
    `).get(department)

    const overallAvg = db.prepare(`
      SELECT COUNT(DISTINCT session_id) as total_users
      FROM mood_entries
      WHERE created_at >= datetime('now', '-7 days')
    `).get()

    // If department has very few users relative to overall
    if (overallAvg.total_users > 10 && engagement.users < overallAvg.total_users * 0.1) {
      const existing = db.prepare(`
        SELECT id FROM alerts
        WHERE type = 'engagement' AND department = ? AND resolved = 0
        AND date(created_at) = date('now')
      `).get(department)

      if (!existing) {
        db.prepare(`
          INSERT INTO alerts (type, message, level, department, created_at, resolved)
          VALUES ('engagement', ?, 'warning', ?, datetime('now'), 0)
        `).run(
          `${department} — low engagement, only ${engagement.users} unique users this week`,
          department
        )
      }
    }
  } catch (err) {
    console.error('Alert check error:', err.message)
  }
}

app.listen(PORT, () => {
  console.log(`🧠 MindScape API server running on http://localhost:${PORT}`)
  console.log(`   Production mode — real data only, no demo seeding`)
})
