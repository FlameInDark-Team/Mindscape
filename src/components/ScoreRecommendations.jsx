import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function ScoreRecommendations({ score, onClose }) {
  // Determine recommendation level based on score
  const getRecommendationLevel = () => {
    if (score >= 7) return 'high'
    if (score >= 4) return 'moderate'
    return 'low'
  }

  const level = getRecommendationLevel()

  const recommendations = {
    high: {
      title: "You're Doing Great! 🌱",
      message: "It seems you're doing well! Keep prioritizing your mental health with healthy habits like regular exercise, balanced diet, and strong social connections.",
      color: 'var(--tertiary)',
      icon: 'celebration',
      strategies: [
        {
          icon: 'self_improvement',
          title: 'Maintain Mindfulness',
          description: 'Continue practicing mindfulness to stay present and grounded.',
          action: 'Try meditation apps like Headspace or Calm'
        },
        {
          icon: 'fitness_center',
          title: 'Stay Active',
          description: 'Regular physical activity helps maintain positive mood.',
          action: 'Aim for 30 minutes of exercise most days'
        },
        {
          icon: 'group',
          title: 'Nurture Connections',
          description: 'Strong social bonds are key to sustained well-being.',
          action: 'Schedule regular time with friends and family'
        },
        {
          icon: 'restaurant',
          title: 'Balanced Nutrition',
          description: 'A healthy diet supports both physical and mental health.',
          action: 'Focus on whole foods, fruits, and vegetables'
        }
      ],
      resources: [
        { text: 'Mindfulness Apps', link: '/resources' },
        { text: 'Stress Management Articles', link: '/resources' },
        { text: 'Wellness Tips', link: '/resources' }
      ]
    },
    moderate: {
      title: "Let's Work Through This Together",
      message: "Your responses indicate some areas where you might be experiencing mild to moderate challenges. Consider exploring these self-help strategies.",
      color: 'var(--secondary)',
      icon: 'psychology',
      strategies: [
        {
          icon: 'self_improvement',
          title: 'Mindfulness & Meditation',
          description: 'Practicing mindfulness can help you stay present and reduce stress.',
          action: 'Try free apps and guided meditations available online'
        },
        {
          icon: 'air',
          title: 'Stress Management Techniques',
          description: 'Learn practical ways to manage daily stressors.',
          action: 'Try deep breathing exercises, progressive muscle relaxation, or journaling'
        },
        {
          icon: 'bed',
          title: 'Healthy Lifestyle',
          description: 'Physical health directly impacts mental well-being.',
          action: 'Ensure adequate sleep, nutritious food, and regular physical activity'
        },
        {
          icon: 'forum',
          title: 'Social Connection',
          description: 'Sharing your feelings can be very helpful.',
          action: 'Reach out to friends or family for support'
        }
      ],
      note: "If these feelings persist or worsen, please consider speaking with a mental health professional.",
      resources: [
        { text: 'Self-Help Strategies', link: '/resources' },
        { text: 'Coping Techniques', link: '/resources' },
        { text: 'Support Resources', link: '/resources' }
      ]
    },
    low: {
      title: "We're Here to Support You",
      message: "Your responses suggest you might be experiencing significant distress. It's important to seek professional support.",
      color: 'var(--error)',
      icon: 'favorite',
      urgent: true,
      professionalHelp: {
        title: 'Professional Support Recommended',
        message: 'We strongly recommend consulting a qualified mental health professional (such as a psychologist or psychiatrist) for a thorough assessment and personalized guidance. They can provide an accurate diagnosis and develop a suitable treatment plan.'
      },
      helplines: [
        {
          name: 'Kiran Mental Health Helpline',
          number: '1800-599-0019',
          hours: '24/7',
          description: 'Toll-free service by Ministry of Social Justice and Empowerment',
          icon: 'call'
        },
        {
          name: 'Vandrevala Foundation',
          number: '1860-2662-345 / 1800-2333-330',
          hours: '24/7',
          description: 'Multi-language mental health support',
          icon: 'support_agent'
        },
        {
          name: 'AASRA',
          number: '022-27546669',
          hours: '24/7',
          description: 'Crisis intervention and suicide prevention',
          icon: 'emergency'
        }
      ],
      findProfessional: [
        {
          icon: 'search',
          title: 'Finding a Professional',
          description: 'You can find qualified psychologists and psychiatrists through:',
          platforms: ['Practo', 'Lybrate', 'Local hospital directories in your city']
        },
        {
          icon: 'groups',
          title: 'Support Groups',
          description: 'Consider joining local support groups for shared experiences and peer support.',
          action: 'Search for mental health support groups in your area'
        }
      ],
      immediateActions: [
        {
          icon: 'call',
          text: 'Call a helpline now',
          urgent: true
        },
        {
          icon: 'person',
          text: 'Talk to someone you trust',
          urgent: true
        },
        {
          icon: 'local_hospital',
          text: 'Visit campus counseling center',
          urgent: true
        }
      ]
    }
  }

  const rec = recommendations[level]

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <div
            className="icon-bubble"
            style={{
              margin: '0 auto 1rem',
              width: '4rem',
              height: '4rem',
              background: rec.color,
              color: 'white'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>
              {rec.icon}
            </span>
          </div>
          <h2 style={{ marginBottom: '0.5rem' }}>{rec.title}</h2>
          <p style={{ fontSize: '1rem', lineHeight: 1.6 }}>{rec.message}</p>
        </div>

        {/* Urgent Banner for Low Scores */}
        {rec.urgent && (
          <div
            className="crisis-banner pulse-glow"
            style={{ marginBottom: 'var(--space-xl)' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '1.5rem', color: 'var(--error)' }}>
              emergency
            </span>
            <div>
              <p style={{ fontWeight: 700, color: 'var(--error)', margin: 0 }}>
                Immediate Support Available
              </p>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>
                If you're in crisis, please reach out now
              </p>
            </div>
          </div>
        )}

        {/* Professional Help Section (Low Scores) */}
        {rec.professionalHelp && (
          <div className="card border-glow" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-md)' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>
                medical_services
              </span>
              {rec.professionalHelp.title}
            </h3>
            <p style={{ lineHeight: 1.6, marginBottom: 0 }}>{rec.professionalHelp.message}</p>
          </div>
        )}

        {/* Helplines (Low Scores) */}
        {rec.helplines && (
          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <h3 style={{ marginBottom: 'var(--space-md)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', marginRight: '0.5rem', verticalAlign: 'middle' }}>
                call
              </span>
              Mental Health Helplines in India
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {rec.helplines.map((helpline, i) => (
                <div key={i} className="card card-glow" style={{ padding: 'var(--space-lg)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
                    <div
                      className="icon-bubble"
                      style={{
                        background: 'var(--error-container)',
                        color: 'var(--on-error-container)',
                        flexShrink: 0
                      }}
                    >
                      <span className="material-symbols-outlined">{helpline.icon}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 0.25rem' }}>{helpline.name}</h4>
                      <p style={{
                        fontFamily: 'var(--font-headline)',
                        fontWeight: 700,
                        fontSize: '1.2rem',
                        color: 'var(--primary)',
                        margin: '0.25rem 0'
                      }}>
                        {helpline.number}
                      </p>
                      <p style={{ fontSize: '0.85rem', margin: '0.25rem 0', opacity: 0.9 }}>
                        {helpline.hours} • {helpline.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Find Professional (Low Scores) */}
        {rec.findProfessional && (
          <div style={{ marginBottom: 'var(--space-xl)' }}>
            {rec.findProfessional.map((item, i) => (
              <div key={i} className="card-tonal" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-md)' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-sm)' }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--secondary)' }}>
                    {item.icon}
                  </span>
                  {item.title}
                </h4>
                <p style={{ marginBottom: item.platforms ? 'var(--space-sm)' : 0, lineHeight: 1.6 }}>
                  {item.description}
                </p>
                {item.platforms && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {item.platforms.map((platform, j) => (
                      <span key={j} className="chip" style={{ background: 'var(--secondary-container)' }}>
                        {platform}
                      </span>
                    ))}
                  </div>
                )}
                {item.action && (
                  <p style={{ fontSize: '0.85rem', marginTop: 'var(--space-sm)', marginBottom: 0, fontStyle: 'italic' }}>
                    💡 {item.action}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Strategies (High & Moderate Scores) */}
        {rec.strategies && (
          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <h3 style={{ marginBottom: 'var(--space-md)' }}>Recommended Strategies</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {rec.strategies.map((strategy, i) => (
                <div key={i} className="card card-glow" style={{ padding: 'var(--space-lg)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
                    <div className="icon-bubble icon-bubble-primary" style={{ flexShrink: 0 }}>
                      <span className="material-symbols-outlined">{strategy.icon}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 0.25rem' }}>{strategy.title}</h4>
                      <p style={{ fontSize: '0.9rem', margin: '0.25rem 0 0.5rem', lineHeight: 1.6 }}>
                        {strategy.description}
                      </p>
                      <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--primary)', fontWeight: 600 }}>
                        💡 {strategy.action}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Note (Moderate Scores) */}
        {rec.note && (
          <div className="card-tonal" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--secondary)' }}>
                info
              </span>
              {rec.note}
            </p>
          </div>
        )}

        {/* Resources Links */}
        {rec.resources && (
          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <h4 style={{ marginBottom: 'var(--space-md)' }}>Helpful Resources</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
              {rec.resources.map((resource, i) => (
                <Link
                  key={i}
                  to={resource.link}
                  className="chip"
                  style={{
                    background: 'var(--primary-container)',
                    color: 'var(--on-primary-container)',
                    textDecoration: 'none'
                  }}
                  onClick={onClose}
                >
                  {resource.text}
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem', marginLeft: '0.25rem' }}>
                    arrow_forward
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Immediate Actions (Low Scores) */}
        {rec.immediateActions && (
          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--error)' }}>
              Take Action Now
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {rec.immediateActions.map((action, i) => (
                <div
                  key={i}
                  className="card"
                  style={{
                    padding: 'var(--space-md)',
                    background: action.urgent ? 'var(--error-container)' : 'var(--surface-container-high)',
                    border: action.urgent ? '2px solid var(--error)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                    <span className="material-symbols-outlined" style={{ color: action.urgent ? 'var(--error)' : 'var(--primary)' }}>
                      {action.icon}
                    </span>
                    <span style={{ fontWeight: 600 }}>{action.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/resources" className="btn btn-primary" onClick={onClose}>
            <span className="material-symbols-outlined">menu_book</span>
            View All Resources
          </Link>
          <button onClick={onClose} className="btn btn-outline">
            Close
          </button>
        </div>

        {/* Disclaimer */}
        <div className="card-tonal" style={{ marginTop: 'var(--space-xl)', padding: 'var(--space-md)', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.9 }}>
            <span className="material-symbols-outlined" style={{ fontSize: '0.85rem', verticalAlign: 'middle', marginRight: '0.25rem' }}>
              info
            </span>
            This is not a diagnostic tool. For professional assessment, please consult a qualified mental health professional.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
