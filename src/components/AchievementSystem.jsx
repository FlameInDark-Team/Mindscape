import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AchievementSystem({ stats }) {
  const [selectedBadge, setSelectedBadge] = useState(null)
  const [showNewBadge, setShowNewBadge] = useState(null)

  if (!stats) return null

  const achievements = [
    {
      id: 'first_step',
      name: 'First Step',
      description: 'Complete your first check-in',
      icon: '🎯',
      unlocked: stats.totalCheckins >= 1,
      rarity: 'common',
      points: 10
    },
    {
      id: 'three_day',
      name: 'Three Day Warrior',
      description: 'Maintain a 3-day streak',
      icon: '🔥',
      unlocked: stats.streak >= 3,
      rarity: 'common',
      points: 25
    },
    {
      id: 'week_strong',
      name: 'Week Strong',
      description: 'Maintain a 7-day streak',
      icon: '💪',
      unlocked: stats.streak >= 7,
      rarity: 'rare',
      points: 50
    },
    {
      id: 'dedicated',
      name: 'Dedicated Mind',
      description: 'Complete 10 check-ins',
      icon: '⭐',
      unlocked: stats.totalCheckins >= 10,
      rarity: 'rare',
      points: 50
    },
    {
      id: 'month_master',
      name: 'Month Master',
      description: 'Maintain a 30-day streak',
      icon: '👑',
      unlocked: stats.streak >= 30,
      rarity: 'epic',
      points: 200
    },
    {
      id: 'wellness_champion',
      name: 'Wellness Champion',
      description: 'Maintain average score above 7',
      icon: '🏆',
      unlocked: stats.avgScore >= 7 && stats.totalCheckins >= 5,
      rarity: 'rare',
      points: 75
    },
    {
      id: 'resilient',
      name: 'Resilient Spirit',
      description: 'Continue checking in during tough times',
      icon: '💎',
      unlocked: stats.totalCheckins >= 5 && stats.lowest <= 3,
      rarity: 'epic',
      points: 100
    },
    {
      id: 'explorer',
      name: 'Resource Explorer',
      description: 'Visit the resources page',
      icon: '🗺️',
      unlocked: localStorage.getItem('visited_resources') === 'true',
      rarity: 'common',
      points: 15
    },
    {
      id: 'mindful',
      name: 'Mindful Soul',
      description: 'Complete 20 check-ins',
      icon: '🧘',
      unlocked: stats.totalCheckins >= 20,
      rarity: 'epic',
      points: 100
    },
    {
      id: 'legend',
      name: 'Wellness Legend',
      description: 'Complete 50 check-ins',
      icon: '🌟',
      unlocked: stats.totalCheckins >= 50,
      rarity: 'legendary',
      points: 500
    },
    {
      id: 'perfect_week',
      name: 'Perfect Week',
      description: 'Maintain average score above 8 for a week',
      icon: '✨',
      unlocked: stats.earlyWarning?.last7DayAvg >= 8 && stats.streak >= 7,
      rarity: 'epic',
      points: 150
    },
    {
      id: 'comeback',
      name: 'Comeback Story',
      description: 'Improve from low to high scores',
      icon: '📈',
      unlocked: stats.lowest <= 4 && stats.highest >= 8 && stats.totalCheckins >= 10,
      rarity: 'rare',
      points: 75
    }
  ]

  const unlockedAchievements = achievements.filter(a => a.unlocked)
  const lockedAchievements = achievements.filter(a => !a.unlocked)
  
  const totalPoints = unlockedAchievements.reduce((sum, a) => sum + a.points, 0)
  const completionRate = Math.round((unlockedAchievements.length / achievements.length) * 100)

  const rarityColors = {
    common: '#5a615b',
    rare: '#2a6868',
    epic: '#765a28',
    legendary: '#a83836'
  }

  const rarityLabels = {
    common: 'Common',
    rare: 'Rare',
    epic: 'Epic',
    legendary: 'Legendary'
  }

  return (
    <div className="card border-glow" style={{ padding: 'var(--space-2xl)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>emoji_events</span>
          Achievements
        </h3>
        <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
          <div className="chip" style={{ background: 'var(--primary-container)', color: 'var(--on-primary-container)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>stars</span>
            {totalPoints} pts
          </div>
          <div className="chip">
            {completionRate}% Complete
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <div style={{ 
          height: '8px', 
          background: 'var(--surface-container-high)', 
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden'
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, var(--primary), var(--tertiary))',
              borderRadius: 'var(--radius-full)'
            }}
          />
        </div>
        <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', textAlign: 'center', opacity: 0.7 }}>
          {unlockedAchievements.length} of {achievements.length} achievements unlocked
        </p>
      </div>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <h4 style={{ fontSize: '0.9rem', marginBottom: 'var(--space-md)', opacity: 0.7 }}>
            Unlocked ({unlockedAchievements.length})
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 'var(--space-md)' }}>
            {unlockedAchievements.map((achievement, i) => (
              <motion.div
                key={achievement.id}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 200 }}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => setSelectedBadge(achievement)}
                style={{
                  background: `linear-gradient(135deg, ${rarityColors[achievement.rarity]}20, ${rarityColors[achievement.rarity]}10)`,
                  border: `2px solid ${rarityColors[achievement.rarity]}`,
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-md)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>{achievement.icon}</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--on-surface)' }}>
                  {achievement.name}
                </div>
                <div style={{ fontSize: '0.65rem', color: rarityColors[achievement.rarity], fontWeight: 700, marginTop: '0.25rem' }}>
                  {achievement.points} pts
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div>
          <h4 style={{ fontSize: '0.9rem', marginBottom: 'var(--space-md)', opacity: 0.7 }}>
            Locked ({lockedAchievements.length})
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 'var(--space-md)' }}>
            {lockedAchievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedBadge(achievement)}
                style={{
                  background: 'var(--surface-container-low)',
                  border: '2px solid var(--outline-variant)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-md)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  opacity: 0.5,
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.25rem', filter: 'grayscale(1)' }}>
                  {achievement.icon}
                </div>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--on-surface-variant)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '0.9rem', verticalAlign: 'middle' }}>lock</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Badge Details Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBadge(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: 'var(--space-lg)'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--surface-container-lowest)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-2xl)',
                maxWidth: '400px',
                width: '100%',
                textAlign: 'center',
                boxShadow: 'var(--shadow-elevated)',
                border: `3px solid ${rarityColors[selectedBadge.rarity]}`
              }}
            >
              <div style={{ fontSize: '5rem', marginBottom: 'var(--space-md)' }}>
                {selectedBadge.icon}
              </div>
              <div style={{ 
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                background: rarityColors[selectedBadge.rarity],
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 700,
                marginBottom: 'var(--space-sm)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                {rarityLabels[selectedBadge.rarity]}
              </div>
              <h3 style={{ margin: '0 0 var(--space-sm)', color: rarityColors[selectedBadge.rarity] }}>
                {selectedBadge.name}
              </h3>
              <p style={{ margin: '0 0 var(--space-md)', fontSize: '0.9rem' }}>
                {selectedBadge.description}
              </p>
              <div className="chip" style={{ marginBottom: 'var(--space-lg)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>stars</span>
                {selectedBadge.points} points
              </div>
              {!selectedBadge.unlocked && (
                <div className="card-tonal" style={{ padding: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.5rem', color: 'var(--tertiary)' }}>lock</span>
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', fontStyle: 'italic' }}>
                    Keep going to unlock this achievement!
                  </p>
                </div>
              )}
              <button
                onClick={() => setSelectedBadge(null)}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
