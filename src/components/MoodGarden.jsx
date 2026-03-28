import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Garden grows based on check-ins and mood scores
export default function MoodGarden({ stats }) {
  const [selectedPlant, setSelectedPlant] = useState(null)
  
  if (!stats) return null

  // Calculate garden health based on stats
  const avgScore = stats.avgScore || 0
  const streak = stats.streak || 0
  const totalCheckins = stats.totalCheckins || 0

  // Determine garden state
  const getGardenState = () => {
    if (totalCheckins === 0) return 'empty'
    if (avgScore >= 7 && streak >= 7) return 'thriving'
    if (avgScore >= 6 && streak >= 3) return 'growing'
    if (avgScore >= 5) return 'budding'
    if (avgScore >= 4) return 'struggling'
    return 'wilting'
  }

  const gardenState = getGardenState()

  // Plant types based on achievements
  const plants = [
    {
      id: 'seedling',
      name: 'First Seed',
      unlocked: totalCheckins >= 1,
      emoji: '🌱',
      description: 'Your journey begins',
      color: '#7dd4d4'
    },
    {
      id: 'sprout',
      name: 'Growing Sprout',
      unlocked: totalCheckins >= 3,
      emoji: '🌿',
      description: '3 check-ins completed',
      color: '#46655e'
    },
    {
      id: 'flower',
      name: 'Blooming Flower',
      unlocked: streak >= 3,
      emoji: '🌸',
      description: '3-day streak achieved',
      color: '#fed799'
    },
    {
      id: 'sunflower',
      name: 'Radiant Sunflower',
      unlocked: avgScore >= 7 && totalCheckins >= 5,
      emoji: '🌻',
      description: 'Positive well-being',
      color: '#efc98c'
    },
    {
      id: 'tree',
      name: 'Wisdom Tree',
      unlocked: totalCheckins >= 10,
      emoji: '🌳',
      description: '10 check-ins milestone',
      color: '#2a6868'
    },
    {
      id: 'cherry',
      name: 'Cherry Blossom',
      unlocked: streak >= 7,
      emoji: '🌸',
      description: '7-day streak master',
      color: '#f5938f'
    },
    {
      id: 'cactus',
      name: 'Resilient Cactus',
      unlocked: totalCheckins >= 7 && avgScore < 5,
      emoji: '🌵',
      description: 'Perseverance through tough times',
      color: '#46655e'
    },
    {
      id: 'rose',
      name: 'Beautiful Rose',
      unlocked: avgScore >= 8 && streak >= 5,
      emoji: '🌹',
      description: 'Thriving well-being',
      color: '#a83836'
    },
    {
      id: 'lotus',
      name: 'Peaceful Lotus',
      unlocked: totalCheckins >= 15,
      emoji: '🪷',
      description: 'Mindfulness champion',
      color: '#b0eeed'
    },
    {
      id: 'rainbow',
      name: 'Rainbow Garden',
      unlocked: totalCheckins >= 30 && avgScore >= 7,
      emoji: '🌈',
      description: 'Ultimate wellness achievement',
      color: 'linear-gradient(135deg, #2a6868, #fed799, #f5938f)'
    }
  ]

  const unlockedPlants = plants.filter(p => p.unlocked)
  const lockedPlants = plants.filter(p => !p.unlocked)

  const gardenMessages = {
    empty: { text: 'Plant your first seed by checking in!', emoji: '🌱', color: '#5a615b' },
    wilting: { text: 'Your garden needs care. Check in regularly!', emoji: '🥀', color: '#a83836' },
    struggling: { text: 'Keep nurturing your garden with daily check-ins', emoji: '🌿', color: '#765a28' },
    budding: { text: 'Your garden is starting to bloom!', emoji: '🌼', color: '#46655e' },
    growing: { text: 'Beautiful growth! Keep it up!', emoji: '🌺', color: '#2a6868' },
    thriving: { text: 'Your garden is thriving! Amazing work!', emoji: '🌸', color: '#7dd4d4' }
  }

  const message = gardenMessages[gardenState]

  return (
    <div className="card border-glow" style={{ padding: 'var(--space-2xl)', position: 'relative', overflow: 'hidden' }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at 50% 100%, ${message.color}15, transparent 70%)`,
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>yard</span>
            Your Mood Garden
          </h3>
          <span style={{ fontSize: '2rem' }}>{message.emoji}</span>
        </div>

        {/* Garden Status */}
        <div className="card-tonal" style={{ padding: 'var(--space-md)', marginBottom: 'var(--space-lg)', textAlign: 'center' }}>
          <p style={{ margin: 0, fontFamily: 'var(--font-headline)', fontWeight: 600, color: message.color }}>
            {message.text}
          </p>
        </div>

        {/* Unlocked Plants */}
        {unlockedPlants.length > 0 && (
          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: 'var(--space-md)', opacity: 0.7 }}>
              Your Garden ({unlockedPlants.length} plants)
            </h4>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', 
              gap: 'var(--space-md)' 
            }}>
              {unlockedPlants.map((plant, i) => (
                <motion.div
                  key={plant.id}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  onClick={() => setSelectedPlant(plant)}
                  style={{
                    background: 'var(--surface-container-low)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-md)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    border: selectedPlant?.id === plant.id ? `2px solid ${plant.color}` : '2px solid transparent'
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>{plant.emoji}</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--on-surface-variant)' }}>
                    {plant.name}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Locked Plants */}
        {lockedPlants.length > 0 && (
          <div>
            <h4 style={{ fontSize: '0.9rem', marginBottom: 'var(--space-md)', opacity: 0.7 }}>
              Locked Plants ({lockedPlants.length} remaining)
            </h4>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', 
              gap: 'var(--space-md)' 
            }}>
              {lockedPlants.map((plant) => (
                <motion.div
                  key={plant.id}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedPlant(plant)}
                  style={{
                    background: 'var(--surface-container-low)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-md)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    opacity: 0.5,
                    transition: 'all 0.3s',
                    border: selectedPlant?.id === plant.id ? '2px solid var(--outline)' : '2px solid transparent'
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.25rem', filter: 'grayscale(1)' }}>
                    {plant.emoji}
                  </div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--on-surface-variant)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '0.9rem', verticalAlign: 'middle' }}>lock</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Plant Details Modal */}
        <AnimatePresence>
          {selectedPlant && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlant(null)}
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
                  boxShadow: 'var(--shadow-elevated)'
                }}
              >
                <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)' }}>
                  {selectedPlant.emoji}
                </div>
                <h3 style={{ margin: '0 0 var(--space-sm)', color: selectedPlant.color }}>
                  {selectedPlant.name}
                </h3>
                <p style={{ margin: '0 0 var(--space-lg)', fontSize: '0.9rem' }}>
                  {selectedPlant.description}
                </p>
                {!selectedPlant.unlocked && (
                  <div className="card-tonal" style={{ padding: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1.5rem', color: 'var(--tertiary)' }}>lock</span>
                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', fontStyle: 'italic' }}>
                      Keep checking in to unlock this plant!
                    </p>
                  </div>
                )}
                <button
                  onClick={() => setSelectedPlant(null)}
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
    </div>
  )
}
