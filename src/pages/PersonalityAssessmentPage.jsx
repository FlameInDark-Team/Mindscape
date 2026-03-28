import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const personalityQuestions = [
  {
    id: 1,
    category: 'Social Energy',
    question: 'When you feel stressed, do you prefer to:',
    options: [
      { text: 'Spend time alone to recharge', value: 'I', trait: 'Introversion' },
      { text: 'Be around friends and talk it out', value: 'E', trait: 'Extraversion' }
    ]
  },
  {
    id: 2,
    category: 'Coping Style',
    question: 'When facing a problem, you tend to:',
    options: [
      { text: 'Focus on practical, concrete solutions', value: 'S', trait: 'Sensing' },
      { text: 'Explore possibilities and big-picture thinking', value: 'N', trait: 'Intuition' }
    ]
  },
  {
    id: 3,
    category: 'Decision Making',
    question: 'When making important decisions, you rely more on:',
    options: [
      { text: 'Logic and objective analysis', value: 'T', trait: 'Thinking' },
      { text: 'Personal values and how it affects others', value: 'F', trait: 'Feeling' }
    ]
  },
  {
    id: 4,
    category: 'Lifestyle Preference',
    question: 'You feel more comfortable when your day is:',
    options: [
      { text: 'Planned and organized', value: 'J', trait: 'Judging' },
      { text: 'Flexible and spontaneous', value: 'P', trait: 'Perceiving' }
    ]
  },
  {
    id: 5,
    category: 'Stress Response',
    question: 'Under pressure, you are more likely to:',
    options: [
      { text: 'Stay calm and think things through', value: 'T', trait: 'Thinking' },
      { text: 'Feel emotions strongly and seek support', value: 'F', trait: 'Feeling' }
    ]
  },
  {
    id: 6,
    category: 'Social Interaction',
    question: 'In social situations, you:',
    options: [
      { text: 'Prefer deep conversations with a few people', value: 'I', trait: 'Introversion' },
      { text: 'Enjoy meeting new people and group activities', value: 'E', trait: 'Extraversion' }
    ]
  },
  {
    id: 7,
    category: 'Information Processing',
    question: 'You learn best by:',
    options: [
      { text: 'Following step-by-step instructions', value: 'S', trait: 'Sensing' },
      { text: 'Understanding concepts and theories', value: 'N', trait: 'Intuition' }
    ]
  },
  {
    id: 8,
    category: 'Work Style',
    question: 'You prefer to:',
    options: [
      { text: 'Complete tasks ahead of deadlines', value: 'J', trait: 'Judging' },
      { text: 'Work best under time pressure', value: 'P', trait: 'Perceiving' }
    ]
  }
]

const personalityTypes = {
  'ISTJ': { name: 'The Inspector', description: 'Practical, fact-minded, and reliable. You value order and tradition.' },
  'ISFJ': { name: 'The Protector', description: 'Warm, responsible, and caring. You are dedicated to helping others.' },
  'INFJ': { name: 'The Counselor', description: 'Insightful, idealistic, and principled. You seek meaning and connection.' },
  'INTJ': { name: 'The Mastermind', description: 'Strategic, independent, and analytical. You value competence and knowledge.' },
  'ISTP': { name: 'The Craftsman', description: 'Practical, observant, and adaptable. You excel at hands-on problem-solving.' },
  'ISFP': { name: 'The Composer', description: 'Gentle, caring, and artistic. You live in the present moment.' },
  'INFP': { name: 'The Healer', description: 'Idealistic, loyal, and empathetic. You seek authenticity and meaning.' },
  'INTP': { name: 'The Architect', description: 'Logical, innovative, and curious. You love exploring ideas and theories.' },
  'ESTP': { name: 'The Dynamo', description: 'Energetic, pragmatic, and spontaneous. You thrive on action and excitement.' },
  'ESFP': { name: 'The Performer', description: 'Outgoing, friendly, and fun-loving. You bring joy to others.' },
  'ENFP': { name: 'The Champion', description: 'Enthusiastic, creative, and sociable. You inspire and motivate others.' },
  'ENTP': { name: 'The Visionary', description: 'Innovative, clever, and curious. You love debating ideas.' },
  'ESTJ': { name: 'The Supervisor', description: 'Organized, practical, and decisive. You value efficiency and order.' },
  'ESFJ': { name: 'The Provider', description: 'Caring, social, and popular. You create harmony and help others.' },
  'ENFJ': { name: 'The Teacher', description: 'Charismatic, inspiring, and empathetic. You lead with compassion.' },
  'ENTJ': { name: 'The Commander', description: 'Bold, strategic, and confident. You are a natural leader.' }
}

export default function PersonalityAssessmentPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [personalityType, setPersonalityType] = useState(null)
  const navigate = useNavigate()

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [currentQuestion]: value }
    setAnswers(newAnswers)

    if (currentQuestion < personalityQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculatePersonality(newAnswers)
    }
  }

  const calculatePersonality = (finalAnswers) => {
    const counts = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }
    
    Object.values(finalAnswers).forEach(value => {
      counts[value] = (counts[value] || 0) + 1
    })

    const type = 
      (counts.E > counts.I ? 'E' : 'I') +
      (counts.S > counts.N ? 'S' : 'N') +
      (counts.T > counts.F ? 'T' : 'F') +
      (counts.J > counts.P ? 'J' : 'P')

    setPersonalityType(type)
    setShowResults(true)

    // Save to localStorage
    localStorage.setItem('mindscape_personality_type', type)
    localStorage.setItem('mindscape_personality_date', new Date().toISOString())
  }

  const restartTest = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setPersonalityType(null)
  }

  const progress = ((currentQuestion + 1) / personalityQuestions.length) * 100

  if (showResults && personalityType) {
    const typeInfo = personalityTypes[personalityType]
    
    return (
      <div className="page-container" style={{ position: 'relative' }}>
        <div className="aurora-background">
          <div className="aurora" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}
        >
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <div className="icon-bubble icon-bubble-primary" style={{ margin: '0 auto 1.5rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>psychology</span>
            </div>
            <h2>Your Personality Type</h2>
            <p>Discover insights about your mental wellness style</p>
          </div>

          <div className="card border-glow" style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              <h1 style={{ 
                fontSize: '4rem', 
                margin: '0 0 1rem', 
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold'
              }}>
                {personalityType}
              </h1>
              <h3 style={{ margin: '0 0 1rem', color: 'var(--primary)' }}>{typeInfo.name}</h3>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: 'var(--space-xl)' }}>
                {typeInfo.description}
              </p>
            </motion.div>

            <div className="card-tonal" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)', textAlign: 'left' }}>
              <h4 style={{ marginTop: 0 }}>Your Wellness Strengths:</h4>
              <ul style={{ lineHeight: 1.8 }}>
                {personalityType.includes('I') && <li>You recharge through solitude and reflection</li>}
                {personalityType.includes('E') && <li>You gain energy from social connections</li>}
                {personalityType.includes('S') && <li>You excel at practical, grounded approaches</li>}
                {personalityType.includes('N') && <li>You see possibilities and future potential</li>}
                {personalityType.includes('T') && <li>You make logical, objective decisions</li>}
                {personalityType.includes('F') && <li>You prioritize empathy and harmony</li>}
                {personalityType.includes('J') && <li>You thrive with structure and planning</li>}
                {personalityType.includes('P') && <li>You adapt well to change and spontaneity</li>}
              </ul>
            </div>

            <div className="card-tonal" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)', textAlign: 'left' }}>
              <h4 style={{ marginTop: 0 }}>Recommended Wellness Strategies:</h4>
              <ul style={{ lineHeight: 1.8 }}>
                {personalityType.includes('I') && <li>Schedule regular alone time for self-care</li>}
                {personalityType.includes('E') && <li>Join group activities and support networks</li>}
                {personalityType.includes('S') && <li>Use concrete, step-by-step stress management techniques</li>}
                {personalityType.includes('N') && <li>Explore creative outlets and visualization exercises</li>}
                {personalityType.includes('T') && <li>Track your progress with data and metrics</li>}
                {personalityType.includes('F') && <li>Connect with others through shared experiences</li>}
                {personalityType.includes('J') && <li>Create structured routines and schedules</li>}
                {personalityType.includes('P') && <li>Stay flexible and try varied wellness approaches</li>}
              </ul>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button onClick={restartTest} className="btn btn-outline">
                <span className="material-symbols-outlined">refresh</span>
                Retake Test
              </button>
              <button onClick={() => navigate('/trends')} className="btn btn-primary">
                <span className="material-symbols-outlined">trending_up</span>
                View My Trends
              </button>
              <button onClick={() => navigate('/resources')} className="btn btn-secondary">
                <span className="material-symbols-outlined">menu_book</span>
                Explore Resources
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  const question = personalityQuestions[currentQuestion]

  return (
    <div className="page-container" style={{ position: 'relative' }}>
      <div className="orb-background">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ position: 'relative', zIndex: 1, maxWidth: '700px', margin: '0 auto' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <div className="icon-bubble icon-bubble-primary" style={{ margin: '0 auto 1.5rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>psychology</span>
          </div>
          <h2>Personality & Wellness Assessment</h2>
          <p>Discover your unique mental wellness style</p>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              Question {currentQuestion + 1} of {personalityQuestions.length}
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div style={{
            height: '8px',
            background: 'var(--surface-container-high)',
            borderRadius: '999px',
            overflow: 'hidden'
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                borderRadius: '999px'
              }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="card border-glow" style={{ padding: 'var(--space-2xl)' }}>
              <div className="chip" style={{ marginBottom: 'var(--space-lg)' }}>
                {question.category}
              </div>
              
              <h3 style={{ marginBottom: 'var(--space-xl)', fontSize: '1.5rem', lineHeight: 1.4 }}>
                {question.question}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {question.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(option.value)}
                    className="card card-glow"
                    style={{
                      padding: 'var(--space-lg)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      border: '2px solid transparent',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'var(--primary-container)',
                        color: 'var(--on-primary-container)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        flexShrink: 0
                      }}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: '1rem', fontWeight: 500 }}>
                          {option.text}
                        </p>
                      </div>
                      <span className="material-symbols-outlined" style={{ color: 'var(--primary)', opacity: 0.5 }}>
                        arrow_forward
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {currentQuestion > 0 && (
          <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
            <button
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              className="btn btn-outline btn-sm"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Previous Question
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
