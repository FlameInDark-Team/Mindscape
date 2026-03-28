import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function MoodRecommendations({ stats }) {
  if (!stats) return null

  const avgScore = stats.avgScore || 0
  const topStressors = stats.topStressors || []
  const recentEntries = stats.recentEntries || []

  // Get most recent score
  const latestScore = recentEntries.length > 0 ? recentEntries[0].score : avgScore

  // Generate recommendations based on mood
  const getRecommendations = () => {
    const recommendations = []

    // Music recommendations
    if (latestScore <= 4) {
      recommendations.push({
        category: 'Music',
        icon: '🎵',
        title: 'Calming Sounds',
        items: [
          { name: 'Lo-fi Beats', description: 'Gentle instrumental music', emoji: '🎹' },
          { name: 'Nature Sounds', description: 'Rain, ocean waves, forest', emoji: '🌊' },
          { name: 'Classical Piano', description: 'Peaceful compositions', emoji: '🎼' }
        ],
        color: 'var(--primary)'
      })
    } else if (latestScore >= 7) {
      recommendations.push({
        category: 'Music',
        icon: '🎵',
        title: 'Uplifting Vibes',
        items: [
          { name: 'Feel-Good Pop', description: 'Energetic and positive', emoji: '🎤' },
          { name: 'Indie Favorites', description: 'Upbeat indie tracks', emoji: '🎸' },
          { name: 'Dance Energy', description: 'Get moving!', emoji: '💃' }
        ],
        color: 'var(--primary)'
      })
    } else {
      recommendations.push({
        category: 'Music',
        icon: '🎵',
        title: 'Focus Sounds',
        items: [
          { name: 'Study Beats', description: 'Concentration music', emoji: '📚' },
          { name: 'Ambient Soundscapes', description: 'Background atmosphere', emoji: '🌌' },
          { name: 'Acoustic Chill', description: 'Relaxed vibes', emoji: '🎸' }
        ],
        color: 'var(--primary)'
      })
    }

    // Activity recommendations
    if (latestScore <= 4) {
      recommendations.push({
        category: 'Activities',
        icon: '🎯',
        title: 'Gentle Self-Care',
        items: [
          { name: 'Take a Walk', description: '10-minute nature break', emoji: '🚶' },
          { name: 'Call a Friend', description: 'Connect with someone', emoji: '📞' },
          { name: 'Journaling', description: 'Express your thoughts', emoji: '📝' },
          { name: 'Breathing Exercise', description: '5 minutes of calm', emoji: '🧘', link: '/resources' }
        ],
        color: 'var(--secondary)'
      })
    } else if (latestScore >= 7) {
      recommendations.push({
        category: 'Activities',
        icon: '🎯',
        title: 'Energize & Thrive',
        items: [
          { name: 'Workout Session', description: 'Channel that energy!', emoji: '💪' },
          { name: 'Social Activity', description: 'Meet up with friends', emoji: '👥' },
          { name: 'Creative Project', description: 'Start something new', emoji: '🎨' },
          { name: 'Help Someone', description: 'Spread the positivity', emoji: '🤝' }
        ],
        color: 'var(--secondary)'
      })
    } else {
      recommendations.push({
        category: 'Activities',
        icon: '🎯',
        title: 'Balanced Routine',
        items: [
          { name: 'Study Session', description: 'Productive focus time', emoji: '📖' },
          { name: 'Light Exercise', description: 'Yoga or stretching', emoji: '🧘' },
          { name: 'Organize Space', description: 'Clear mind, clear space', emoji: '🧹' },
          { name: 'Meal Prep', description: 'Nourish your body', emoji: '🥗' }
        ],
        color: 'var(--secondary)'
      })
    }

    // Stressor-specific recommendations
    if (topStressors.length > 0) {
      const topStressor = topStressors[0].name
      const stressorRecs = {
        'Exams': {
          category: 'Study Tips',
          icon: '📚',
          title: 'Exam Success Strategies',
          items: [
            { name: 'Pomodoro Technique', description: '25 min focus, 5 min break', emoji: '⏰' },
            { name: 'Study Groups', description: 'Learn together', emoji: '👥' },
            { name: 'Practice Tests', description: 'Test yourself', emoji: '📝' },
            { name: 'Sleep Well', description: 'Rest before exam', emoji: '😴' }
          ],
          color: 'var(--tertiary)'
        },
        'Sleep': {
          category: 'Sleep Hygiene',
          icon: '😴',
          title: 'Better Sleep Tonight',
          items: [
            { name: 'Screen-Free Hour', description: 'No devices before bed', emoji: '📵' },
            { name: 'Consistent Schedule', description: 'Same bedtime daily', emoji: '⏰' },
            { name: 'Cool & Dark Room', description: 'Optimal environment', emoji: '🌙' },
            { name: 'Relaxation Routine', description: 'Wind down ritual', emoji: '🧘' }
          ],
          color: 'var(--tertiary)'
        },
        'Social': {
          category: 'Social Connection',
          icon: '👥',
          title: 'Build Connections',
          items: [
            { name: 'Join a Club', description: 'Find your community', emoji: '🎯' },
            { name: 'Coffee Chat', description: 'One-on-one time', emoji: '☕' },
            { name: 'Group Study', description: 'Academic + social', emoji: '📚' },
            { name: 'Campus Events', description: 'Try something new', emoji: '🎉' }
          ],
          color: 'var(--tertiary)'
        },
        'Assignments': {
          category: 'Productivity',
          icon: '✅',
          title: 'Tackle Your Tasks',
          items: [
            { name: 'Break It Down', description: 'Small, manageable steps', emoji: '📋' },
            { name: 'Time Blocking', description: 'Schedule dedicated time', emoji: '📅' },
            { name: 'Eliminate Distractions', description: 'Focus mode on', emoji: '🔕' },
            { name: 'Reward Progress', description: 'Celebrate small wins', emoji: '🎉' }
          ],
          color: 'var(--tertiary)'
        }
      }

      if (stressorRecs[topStressor]) {
        recommendations.push(stressorRecs[topStressor])
      }
    }

    // Mindfulness recommendation (always relevant)
    recommendations.push({
      category: 'Mindfulness',
      icon: '🧘',
      title: 'Present Moment Practice',
      items: [
        { name: '4-7-8 Breathing', description: 'Instant calm', emoji: '🌬️', link: '/resources' },
        { name: '5-Minute Meditation', description: 'Quick reset', emoji: '🧘' },
        { name: 'Gratitude List', description: '3 things you\'re grateful for', emoji: '🙏' },
        { name: 'Body Scan', description: 'Release tension', emoji: '💆' }
      ],
      color: 'var(--primary)'
    })

    return recommendations.slice(0, 3) // Show top 3 categories
  }

  const recommendations = getRecommendations()

  return (
    <div className="card border-glow" style={{ padding: 'var(--space-2xl)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-md)' }}>
        <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>recommend</span>
        <h3 style={{ margin: 0 }}>Personalized for You</h3>
      </div>

      <p style={{ fontSize: '0.85rem', marginBottom: 'var(--space-xl)', opacity: 0.8 }}>
        Based on your current mood ({latestScore}/10), here are some recommendations:
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
        {recommendations.map((rec, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-md)' }}>
              <span style={{ fontSize: '1.5rem' }}>{rec.icon}</span>
              <h4 style={{ margin: 0, fontSize: '1rem', color: rec.color }}>{rec.title}</h4>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-sm)' }}>
              {rec.items.map((item, j) => (
                item.link ? (
                  <Link
                    key={j}
                    to={item.link}
                    className="card-tonal"
                    style={{
                      padding: 'var(--space-md)',
                      textDecoration: 'none',
                      display: 'block',
                      transition: 'all 0.3s',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>{item.emoji}</span>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--on-surface)' }}>{item.name}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.7 }}>{item.description}</p>
                  </Link>
                ) : (
                  <div
                    key={j}
                    className="card-tonal"
                    style={{
                      padding: 'var(--space-md)',
                      transition: 'all 0.3s',
                      cursor: 'default'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>{item.emoji}</span>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--on-surface)' }}>{item.name}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.7 }}>{item.description}</p>
                  </div>
                )
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="card-tonal" style={{ marginTop: 'var(--space-xl)', padding: 'var(--space-md)', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: '0.8rem' }}>
          💡 <strong>Pro Tip:</strong> Try one recommendation today and see how it affects your next check-in!
        </p>
      </div>
    </div>
  )
}
