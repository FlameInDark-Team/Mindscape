import { motion } from 'framer-motion'

export default function AIInsights({ stats, trends }) {
  if (!stats || !trends || trends.length < 3) return null

  // AI-powered pattern detection
  const generateInsights = () => {
    const insights = []
    const avgScore = stats.avgScore || 0
    const streak = stats.streak || 0
    const topStressors = stats.topStressors || []
    
    // Analyze trends
    const recentTrends = trends.slice(-7)
    const scores = recentTrends.map(t => t.avg_score).filter(s => s !== null)
    
    if (scores.length >= 3) {
      const firstHalf = scores.slice(0, Math.floor(scores.length / 2))
      const secondHalf = scores.slice(Math.floor(scores.length / 2))
      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
      const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length
      
      if (secondAvg > firstAvg + 1) {
        insights.push({
          type: 'positive',
          icon: '📈',
          title: 'Upward Trend Detected',
          message: `Your mood has improved by ${(secondAvg - firstAvg).toFixed(1)} points recently. Whatever you're doing, keep it up!`,
          color: 'var(--primary)'
        })
      } else if (secondAvg < firstAvg - 1) {
        insights.push({
          type: 'warning',
          icon: '📉',
          title: 'Declining Pattern Noticed',
          message: `Your scores have dropped by ${(firstAvg - secondAvg).toFixed(1)} points. Consider reaching out for support or trying stress-relief activities.`,
          color: 'var(--tertiary)'
        })
      }
    }

    // Streak insights
    if (streak >= 7) {
      insights.push({
        type: 'achievement',
        icon: '🔥',
        title: 'Consistency Champion',
        message: `You've maintained a ${streak}-day streak! Daily check-ins help build self-awareness and emotional resilience.`,
        color: 'var(--primary)'
      })
    } else if (streak === 0 && stats.totalCheckins > 5) {
      insights.push({
        type: 'motivation',
        icon: '💪',
        title: 'Restart Your Streak',
        message: 'You\'ve checked in before. Starting a new streak can help you stay connected with your mental health journey.',
        color: 'var(--secondary)'
      })
    }

    // Stressor patterns
    if (topStressors.length > 0) {
      const topStressor = topStressors[0]
      const stressorInsights = {
        'Exams': 'Consider using the Pomodoro technique and taking regular breaks. Your brain needs rest to retain information effectively.',
        'Sleep': 'Sleep quality directly impacts mood. Try maintaining a consistent sleep schedule and avoiding screens before bed.',
        'Social': 'Social connections are vital for mental health. Consider joining a campus group or reaching out to a friend.',
        'Assignments': 'Break large tasks into smaller, manageable chunks. Celebrate small wins along the way.',
        'Finances': 'Financial stress is common among students. Check if your campus offers financial counseling or emergency funds.',
        'Relationships': 'Healthy relationships require communication. Consider talking to a counselor if you need support navigating relationship challenges.',
        'Health': 'Physical and mental health are interconnected. Regular exercise, even a short walk, can significantly improve mood.',
        'Loneliness': 'You\'re not alone in feeling lonely. Campus counseling services and support groups can help you connect with others.',
        'Family': 'Family stress can be challenging while away at school. Remember that setting boundaries is healthy and necessary.',
        'Career': 'Career anxiety is normal. Your campus career center can help you explore options and reduce uncertainty.'
      }
      
      if (stressorInsights[topStressor.name]) {
        insights.push({
          type: 'advice',
          icon: '💡',
          title: `Managing ${topStressor.name} Stress`,
          message: stressorInsights[topStressor.name],
          color: 'var(--tertiary)'
        })
      }
    }

    // Score-based insights
    if (avgScore >= 8) {
      insights.push({
        type: 'celebration',
        icon: '🌟',
        title: 'Thriving Well-being',
        message: `Your average score of ${avgScore}/10 indicates strong mental well-being. You're doing an excellent job taking care of yourself!`,
        color: 'var(--primary)'
      })
    } else if (avgScore >= 6 && avgScore < 8) {
      insights.push({
        type: 'neutral',
        icon: '🎯',
        title: 'Steady Progress',
        message: `You're maintaining a ${avgScore}/10 average. Small daily improvements can lead to significant long-term gains in well-being.`,
        color: 'var(--secondary)'
      })
    }

    // Day of week patterns (if we have enough data)
    if (trends.length >= 7) {
      const dayScores = {}
      trends.forEach(t => {
        const date = new Date(t.date + 'T00:00:00')
        const day = date.toLocaleDateString('en', { weekday: 'long' })
        if (!dayScores[day]) dayScores[day] = []
        if (t.avg_score) dayScores[day].push(t.avg_score)
      })
      
      let lowestDay = null
      let lowestAvg = 10
      Object.entries(dayScores).forEach(([day, scores]) => {
        if (scores.length >= 2) {
          const avg = scores.reduce((a, b) => a + b, 0) / scores.length
          if (avg < lowestAvg) {
            lowestAvg = avg
            lowestDay = day
          }
        }
      })
      
      if (lowestDay && lowestAvg < avgScore - 1) {
        insights.push({
          type: 'pattern',
          icon: '📅',
          title: 'Weekly Pattern Detected',
          message: `Your mood tends to be lower on ${lowestDay}s. Plan self-care activities or lighter workloads for this day.`,
          color: 'var(--tertiary)'
        })
      }
    }

    // Personalized recommendations
    if (avgScore < 6 && topStressors.length > 2) {
      insights.push({
        type: 'recommendation',
        icon: '🎯',
        title: 'Prioritize Self-Care',
        message: 'You\'re juggling multiple stressors. Focus on one thing at a time and don\'t hesitate to ask for help. You don\'t have to handle everything alone.',
        color: 'var(--error)'
      })
    }

    return insights.slice(0, 4) // Limit to 4 insights
  }

  const insights = generateInsights()

  if (insights.length === 0) {
    return (
      <div className="card" style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '2rem', opacity: 0.3 }}>psychology</span>
        <p style={{ margin: '0.5rem 0 0', opacity: 0.7 }}>
          Keep checking in to unlock AI-powered insights about your mental health patterns.
        </p>
      </div>
    )
  }

  return (
    <div className="card border-glow" style={{ padding: 'var(--space-2xl)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-lg)' }}>
        <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>psychology</span>
        <h3 style={{ margin: 0 }}>AI-Powered Insights</h3>
        <span className="chip" style={{ fontSize: '0.65rem', padding: '0.25rem 0.5rem', background: 'var(--primary-container)', color: 'var(--on-primary-container)' }}>
          BETA
        </span>
      </div>

      <p style={{ fontSize: '0.85rem', marginBottom: 'var(--space-lg)', opacity: 0.8 }}>
        Based on your check-in patterns, here are personalized insights to support your well-being:
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {insights.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-tonal"
            style={{
              padding: 'var(--space-lg)',
              borderLeft: `4px solid ${insight.color}`,
              background: `linear-gradient(90deg, ${insight.color}10, transparent)`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
              <div style={{ fontSize: '2rem', flexShrink: 0 }}>{insight.icon}</div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 0.5rem', color: insight.color, fontSize: '0.95rem' }}>
                  {insight.title}
                </h4>
                <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {insight.message}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="card-tonal" style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-md)', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.7 }}>
          <span className="material-symbols-outlined" style={{ fontSize: '0.9rem', verticalAlign: 'middle', marginRight: '0.25rem' }}>info</span>
          These insights are generated using pattern recognition algorithms and are meant to complement, not replace, professional mental health support.
        </p>
      </div>
    </div>
  )
}
