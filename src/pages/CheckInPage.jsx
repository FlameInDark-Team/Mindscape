import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'

// Personality questions (15 questions covering E/I, S/N, T/F, J/P)
const personalityQuestions = [
  {
    id: 1,
    category: 'Social Energy',
    dimension: 'Extraversion vs Introversion',
    question: 'When you feel stressed, do you prefer to:',
    options: [
      { text: 'Spend time completely alone to recharge and reflect', value: 'I', emoji: '🧘', trait: 'Strong Introversion', weight: 2 },
      { text: 'Have quiet time with one close friend or family member', value: 'I', emoji: '👤', trait: 'Mild Introversion', weight: 1 },
      { text: 'Be around a small group of friends to talk it out', value: 'E', emoji: '👥', trait: 'Mild Extraversion', weight: 1 },
      { text: 'Surround yourself with many people and social activities', value: 'E', emoji: '🎉', trait: 'Strong Extraversion', weight: 2 }
    ]
  },
  {
    id: 2,
    category: 'Social Interaction',
    dimension: 'Extraversion vs Introversion',
    question: 'In social situations, you:',
    options: [
      { text: 'Prefer one-on-one deep conversations exclusively', value: 'I', emoji: '💬', trait: 'Strong Introversion', weight: 2 },
      { text: 'Enjoy small gatherings with close friends', value: 'I', emoji: '🏠', trait: 'Mild Introversion', weight: 1 },
      { text: 'Like meeting new people in group settings', value: 'E', emoji: '🌟', trait: 'Mild Extraversion', weight: 1 },
      { text: 'Thrive in large social events and parties', value: 'E', emoji: '🎊', trait: 'Strong Extraversion', weight: 2 }
    ]
  },
  {
    id: 3,
    category: 'Energy Source',
    dimension: 'Extraversion vs Introversion',
    question: 'After a long day, you feel most recharged by:',
    options: [
      { text: 'Being completely alone with your thoughts and hobbies', value: 'I', emoji: '📚', trait: 'Strong Introversion', weight: 2 },
      { text: 'Relaxing at home with minimal social interaction', value: 'I', emoji: '🛋️', trait: 'Mild Introversion', weight: 1 },
      { text: 'Casual hangout with a few friends', value: 'E', emoji: '☕', trait: 'Mild Extraversion', weight: 1 },
      { text: 'Going out and being around lots of people', value: 'E', emoji: '🌃', trait: 'Strong Extraversion', weight: 2 }
    ]
  },
  {
    id: 4,
    category: 'Coping Style',
    dimension: 'Sensing vs Intuition',
    question: 'When facing a problem, you tend to:',
    options: [
      { text: 'Focus only on immediate, practical solutions', value: 'S', emoji: '🔧', trait: 'Strong Sensing', weight: 2 },
      { text: 'Use proven methods with slight adjustments', value: 'S', emoji: '📋', trait: 'Mild Sensing', weight: 1 },
      { text: 'Consider future implications and possibilities', value: 'N', emoji: '🔮', trait: 'Mild Intuition', weight: 1 },
      { text: 'Explore innovative and unconventional approaches', value: 'N', emoji: '💡', trait: 'Strong Intuition', weight: 2 }
    ]
  },
  {
    id: 5,
    category: 'Information Processing',
    dimension: 'Sensing vs Intuition',
    question: 'You learn best by:',
    options: [
      { text: 'Following detailed step-by-step instructions', value: 'S', emoji: '📝', trait: 'Strong Sensing', weight: 2 },
      { text: 'Using practical examples and demonstrations', value: 'S', emoji: '👩‍🏫', trait: 'Mild Sensing', weight: 1 },
      { text: 'Understanding the overall concept first', value: 'N', emoji: '🎨', trait: 'Mild Intuition', weight: 1 },
      { text: 'Exploring theories and abstract ideas', value: 'N', emoji: '🌐', trait: 'Strong Intuition', weight: 2 }
    ]
  },
  {
    id: 6,
    category: 'Focus Style',
    dimension: 'Sensing vs Intuition',
    question: 'When reading or learning, you pay more attention to:',
    options: [
      { text: 'Specific facts, data, and exact details', value: 'S', emoji: '📊', trait: 'Strong Sensing', weight: 2 },
      { text: 'Concrete information and what is stated', value: 'S', emoji: '📄', trait: 'Mild Sensing', weight: 1 },
      { text: 'Underlying meanings and connections', value: 'N', emoji: '🌈', trait: 'Mild Intuition', weight: 1 },
      { text: 'Abstract patterns and future possibilities', value: 'N', emoji: '🔭', trait: 'Strong Intuition', weight: 2 }
    ]
  },
  {
    id: 7,
    category: 'Problem Solving',
    dimension: 'Sensing vs Intuition',
    question: 'You trust more in:',
    options: [
      { text: 'Only tried-and-true methods with proven results', value: 'S', emoji: '⚙️', trait: 'Strong Sensing', weight: 2 },
      { text: 'Experience combined with some flexibility', value: 'S', emoji: '🛠️', trait: 'Mild Sensing', weight: 1 },
      { text: 'Gut feelings and creative insights', value: 'N', emoji: '✨', trait: 'Mild Intuition', weight: 1 },
      { text: 'Pure intuition and innovative thinking', value: 'N', emoji: '🚀', trait: 'Strong Intuition', weight: 2 }
    ]
  },
  {
    id: 8,
    category: 'Decision Making',
    dimension: 'Thinking vs Feeling',
    question: 'When making important decisions, you rely more on:',
    options: [
      { text: 'Pure logic and objective analysis only', value: 'T', emoji: '🧠', trait: 'Strong Thinking', weight: 2 },
      { text: 'Logical reasoning with some consideration of impact', value: 'T', emoji: '⚖️', trait: 'Mild Thinking', weight: 1 },
      { text: 'Personal values while considering logic', value: 'F', emoji: '💝', trait: 'Mild Feeling', weight: 1 },
      { text: 'Emotions and how it affects everyone involved', value: 'F', emoji: '❤️', trait: 'Strong Feeling', weight: 2 }
    ]
  },
  {
    id: 9,
    category: 'Stress Response',
    dimension: 'Thinking vs Feeling',
    question: 'Under pressure, you are more likely to:',
    options: [
      { text: 'Stay completely detached and analytical', value: 'T', emoji: '🎯', trait: 'Strong Thinking', weight: 2 },
      { text: 'Think logically while managing emotions', value: 'T', emoji: '🧩', trait: 'Mild Thinking', weight: 1 },
      { text: 'Feel emotions but seek rational solutions', value: 'F', emoji: '🤗', trait: 'Mild Feeling', weight: 1 },
      { text: 'Experience strong emotions and need support', value: 'F', emoji: '😢', trait: 'Strong Feeling', weight: 2 }
    ]
  },
  {
    id: 10,
    category: 'Conflict Resolution',
    dimension: 'Thinking vs Feeling',
    question: 'In disagreements, you prioritize:',
    options: [
      { text: 'Finding the absolute truth regardless of feelings', value: 'T', emoji: '⚔️', trait: 'Strong Thinking', weight: 2 },
      { text: 'Being right while being respectful', value: 'T', emoji: '🎓', trait: 'Mild Thinking', weight: 1 },
      { text: 'Understanding all perspectives and feelings', value: 'F', emoji: '🕊️', trait: 'Mild Feeling', weight: 1 },
      { text: 'Maintaining harmony above all else', value: 'F', emoji: '🌸', trait: 'Strong Feeling', weight: 2 }
    ]
  },
  {
    id: 11,
    category: 'Lifestyle Preference',
    dimension: 'Judging vs Perceiving',
    question: 'You feel more comfortable when your day is:',
    options: [
      { text: 'Completely planned with a detailed schedule', value: 'J', emoji: '📅', trait: 'Strong Judging', weight: 2 },
      { text: 'Generally organized with some structure', value: 'J', emoji: '📋', trait: 'Mild Judging', weight: 1 },
      { text: 'Flexible with loose plans', value: 'P', emoji: '🎲', trait: 'Mild Perceiving', weight: 1 },
      { text: 'Completely spontaneous and unplanned', value: 'P', emoji: '🌊', trait: 'Strong Perceiving', weight: 2 }
    ]
  },
  {
    id: 12,
    category: 'Work Style',
    dimension: 'Judging vs Perceiving',
    question: 'You prefer to:',
    options: [
      { text: 'Complete tasks immediately, well before deadlines', value: 'J', emoji: '✅', trait: 'Strong Judging', weight: 2 },
      { text: 'Work steadily and finish ahead of time', value: 'J', emoji: '📊', trait: 'Mild Judging', weight: 1 },
      { text: 'Work closer to deadlines with some pressure', value: 'P', emoji: '⚡', trait: 'Mild Perceiving', weight: 1 },
      { text: 'Thrive on last-minute pressure and urgency', value: 'P', emoji: '🔥', trait: 'Strong Perceiving', weight: 2 }
    ]
  },
  {
    id: 13,
    category: 'Organization',
    dimension: 'Judging vs Perceiving',
    question: 'Your living/work space is usually:',
    options: [
      { text: 'Perfectly organized with everything labeled', value: 'J', emoji: '🗂️', trait: 'Strong Judging', weight: 2 },
      { text: 'Neat and organized with clear systems', value: 'J', emoji: '📚', trait: 'Mild Judging', weight: 1 },
      { text: 'Somewhat messy but functional', value: 'P', emoji: '🎪', trait: 'Mild Perceiving', weight: 1 },
      { text: 'Chaotic but you know where everything is', value: 'P', emoji: '🌀', trait: 'Strong Perceiving', weight: 2 }
    ]
  },
  {
    id: 14,
    category: 'Planning',
    dimension: 'Judging vs Perceiving',
    question: 'When going on a trip, you:',
    options: [
      { text: 'Plan every detail with backup plans', value: 'J', emoji: '🗺️', trait: 'Strong Judging', weight: 2 },
      { text: 'Create a general itinerary with key activities', value: 'J', emoji: '📍', trait: 'Mild Judging', weight: 1 },
      { text: 'Have a rough idea and go with the flow', value: 'P', emoji: '🧭', trait: 'Mild Perceiving', weight: 1 },
      { text: 'Make zero plans and be completely spontaneous', value: 'P', emoji: '🎒', trait: 'Strong Perceiving', weight: 2 }
    ]
  },
  {
    id: 15,
    category: 'Completion',
    dimension: 'Judging vs Perceiving',
    question: 'You feel most satisfied when:',
    options: [
      { text: 'Everything is completed and perfectly organized', value: 'J', emoji: '🎖️', trait: 'Strong Judging', weight: 2 },
      { text: 'Tasks are done and checked off your list', value: 'J', emoji: '✔️', trait: 'Mild Judging', weight: 1 },
      { text: 'You have several options still available', value: 'P', emoji: '🌠', trait: 'Mild Perceiving', weight: 1 },
      { text: 'Everything is open-ended with infinite possibilities', value: 'P', emoji: '🌌', trait: 'Strong Perceiving', weight: 2 }
    ]
  }
]

const personalityTypes = {
  'ISTJ': { name: 'The Inspector', color: '#4A5568', icon: '🛡️' },
  'ISFJ': { name: 'The Protector', color: '#48BB78', icon: '🤲' },
  'INFJ': { name: 'The Counselor', color: '#9F7AEA', icon: '🔮' },
  'INTJ': { name: 'The Mastermind', color: '#4299E1', icon: '🧩' },
  'ISTP': { name: 'The Craftsman', color: '#ED8936', icon: '🔧' },
  'ISFP': { name: 'The Composer', color: '#F687B3', icon: '🎨' },
  'INFP': { name: 'The Healer', color: '#B794F4', icon: '🌸' },
  'INTP': { name: 'The Architect', color: '#4FD1C5', icon: '🏗️' },
  'ESTP': { name: 'The Dynamo', color: '#F56565', icon: '⚡' },
  'ESFP': { name: 'The Performer', color: '#FC8181', icon: '🎭' },
  'ENFP': { name: 'The Champion', color: '#F6AD55', icon: '🌟' },
  'ENTP': { name: 'The Visionary', color: '#63B3ED', icon: '💡' },
  'ESTJ': { name: 'The Supervisor', color: '#718096', icon: '📊' },
  'ESFJ': { name: 'The Provider', color: '#68D391', icon: '🤝' },
  'ENFJ': { name: 'The Teacher', color: '#9AE6B4', icon: '🌱' },
  'ENTJ': { name: 'The Commander', color: '#667EEA', icon: '👑' }
}

export default function CheckInPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [personalityType, setPersonalityType] = useState(null)
  const [hoveredOption, setHoveredOption] = useState(null)
  const navigate = useNavigate()

  const calculatePersonality = (finalAnswers) => {
    const counts = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }
    
    // Calculate weighted scores
    Object.entries(finalAnswers).forEach(([questionIndex, answerIndex]) => {
      const question = personalityQuestions[questionIndex]
      const selectedOption = question.options[answerIndex]
      const value = selectedOption.value
      const weight = selectedOption.weight || 1
      
      counts[value] = (counts[value] || 0) + weight
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

  const handleAnswer = (optionIndex) => {
    const newAnswers = { ...answers, [currentQuestion]: optionIndex }
    setAnswers(newAnswers)

    if (currentQuestion < personalityQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
      }, 300)
    } else {
      setTimeout(() => {
        calculatePersonality(newAnswers)
      }, 300)
    }
  }

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const restartTest = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setPersonalityType(null)
  }

  const progress = ((currentQuestion + 1) / personalityQuestions.length) * 100
  const question = personalityQuestions[currentQuestion]

  if (showResults && personalityType) {
    const typeInfo = personalityTypes[personalityType]
    
    return (
      <div className="page-container" style={{ position: 'relative' }}>
        <div className="aurora-background">
          <div className="aurora" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ position: 'relative', zIndex: 1, maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}
        >
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10, delay: 0.2 }}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${typeInfo.color}, ${typeInfo.color}dd)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-xl)',
              boxShadow: `0 20px 60px ${typeInfo.color}40`
            }}
          >
            <span style={{ fontSize: '4rem' }}>{typeInfo.icon}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 style={{ 
              fontSize: '3.5rem', 
              margin: '0 0 0.5rem',
              background: `linear-gradient(135deg, ${typeInfo.color}, var(--primary))`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}>
              {personalityType}
            </h1>
            <h2 style={{ margin: '0 0 1rem', color: typeInfo.color }}>{typeInfo.name}</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: 'var(--space-2xl)', opacity: 0.9 }}>
              Your personality assessment is complete!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card border-glow"
            style={{ padding: 'var(--space-2xl)', marginBottom: 'var(--space-xl)' }}
          >
            <h3 style={{ marginBottom: 'var(--space-md)' }}>🎉 Assessment Complete!</h3>
            <p style={{ marginBottom: 'var(--space-lg)', lineHeight: 1.6 }}>
              You've discovered your personality type: <strong>{personalityType} - {typeInfo.name}</strong>
            </p>
            <p style={{ marginBottom: 0, lineHeight: 1.6, opacity: 0.9 }}>
              Your unique personality profile has been saved. This will help us provide 
              personalized wellness recommendations tailored to your style.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <button onClick={restartTest} className="btn btn-outline">
              <span className="material-symbols-outlined">refresh</span>
              Retake Test
            </button>
            <Link to="/trends" className="btn btn-secondary">
              <span className="material-symbols-outlined">trending_up</span>
              My Trends
            </Link>
            <Link to="/resources" className="btn btn-secondary">
              <span className="material-symbols-outlined">menu_book</span>
              Resources
            </Link>
            <Link to="/" className="btn btn-primary">
              <span className="material-symbols-outlined">home</span>
              Back to Home
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="card-tonal"
            style={{ marginTop: 'var(--space-xl)', padding: 'var(--space-lg)' }}
          >
            <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.6 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.5rem' }}>
                info
              </span>
              Your personality type has been saved and will be used to personalize your MindScape experience.
            </p>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="page-container" style={{ position: 'relative' }}>
      {/* Animated Background */}
      <div className="orb-background">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="icon-bubble icon-bubble-primary"
            style={{ margin: '0 auto 1.5rem', width: '4rem', height: '4rem' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>psychology</span>
          </motion.div>
          <h1>Personality Assessment</h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
            Discover your unique mental wellness style
          </p>
        </div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card border-glow"
          style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
            <div>
              <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: 'var(--primary)' }}>
                {question.dimension}
              </span>
              <h3 style={{ margin: '0.25rem 0 0', fontSize: '1rem' }}>
                Question {currentQuestion + 1} of {personalityQuestions.length}
              </h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', lineHeight: 1 }}>
                {Math.round(progress)}%
              </div>
              <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Complete</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div style={{
            height: '12px',
            background: 'var(--surface-container-high)',
            borderRadius: '999px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, var(--primary), var(--secondary), var(--tertiary))',
                borderRadius: '999px',
                boxShadow: '0 0 20px var(--primary)40'
              }}
            />
          </div>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <div className="card border-glow shimmer" style={{ padding: 'var(--space-2xl)', marginBottom: 'var(--space-xl)' }}>
              {/* Category Badge */}
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <span className="chip" style={{ 
                  background: 'var(--primary-container)', 
                  color: 'var(--on-primary-container)',
                  fontSize: '0.85rem',
                  padding: '0.5rem 1rem'
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem', marginRight: '0.5rem' }}>
                    category
                  </span>
                  {question.category}
                </span>
              </div>

              {/* Question */}
              <h2 style={{ 
                fontSize: '1.75rem', 
                marginBottom: 'var(--space-2xl)', 
                lineHeight: 1.4,
                fontWeight: 600
              }}>
                {question.question}
              </h2>

              {/* Options - 2x2 Grid for Desktop, Stack for Mobile */}
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))',
                gap: 'var(--space-lg)',
              }}>
                {question.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(index)}
                    onMouseEnter={() => setHoveredOption(index)}
                    onMouseLeave={() => setHoveredOption(null)}
                    className="card card-glow"
                    style={{
                      padding: 'var(--space-lg)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      border: hoveredOption === index ? '3px solid var(--primary)' : '3px solid transparent',
                      transition: 'all 0.3s ease',
                      background: hoveredOption === index ? 'var(--primary-container)' : 'var(--surface-container-high)',
                      position: 'relative',
                      overflow: 'hidden',
                      minHeight: '140px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}
                  >
                    {/* Animated Background */}
                    {hoveredOption === index && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 2, opacity: 0.1 }}
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          width: '100px',
                          height: '100px',
                          borderRadius: '50%',
                          background: 'var(--primary)',
                          transform: 'translate(-50%, -50%)'
                        }}
                      />
                    )}

                    <div style={{ position: 'relative', zIndex: 1 }}>
                      {/* Header with Emoji and Option Label */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                        {/* Emoji Icon */}
                        <div style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          background: hoveredOption === index ? 'var(--primary)' : 'var(--surface-container-highest)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.75rem',
                          flexShrink: 0,
                          transition: 'all 0.3s ease',
                          boxShadow: hoveredOption === index ? '0 8px 20px var(--primary)40' : 'none'
                        }}>
                          {option.emoji}
                        </div>

                        {/* Option Label */}
                        <div style={{ 
                          fontSize: '0.7rem', 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.1em',
                          fontWeight: 700,
                          color: hoveredOption === index ? 'var(--primary)' : 'var(--on-surface-variant)',
                        }}>
                          Option {String.fromCharCode(65 + index)}
                        </div>
                      </div>

                      {/* Text Content */}
                      <p style={{ 
                        margin: '0 0 0.5rem', 
                        fontSize: '0.95rem', 
                        fontWeight: 500,
                        lineHeight: 1.4,
                        color: hoveredOption === index ? 'var(--on-primary-container)' : 'var(--on-surface)'
                      }}>
                        {option.text}
                      </p>

                      {/* Trait Badge */}
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: hoveredOption === index ? 'var(--primary)' : 'var(--on-surface-variant)',
                        fontWeight: 600,
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        background: hoveredOption === index ? 'var(--primary)20' : 'var(--surface-container-highest)'
                      }}>
                        {option.trait}
                      </div>
                    </div>

                    {/* Arrow Icon - Hidden on mobile for cleaner look */}
                    <motion.div
                      animate={{ x: hoveredOption === index ? 5 : 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        position: 'absolute',
                        bottom: 'var(--space-md)',
                        right: 'var(--space-md)',
                        display: 'none'
                      }}
                      className="desktop-only-arrow"
                    >
                      <span className="material-symbols-outlined" style={{ 
                        fontSize: '1.5rem',
                        color: hoveredOption === index ? 'var(--primary)' : 'var(--on-surface-variant)',
                        opacity: hoveredOption === index ? 1 : 0.5
                      }}>
                        arrow_forward
                      </span>
                    </motion.div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', alignItems: 'center' }}>
          {currentQuestion > 0 && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={goBack}
              className="btn btn-outline"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Previous
            </motion.button>
          )}
          
          <Link to="/" className="btn btn-outline">
            <span className="material-symbols-outlined">close</span>
            Exit
          </Link>
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="card-tonal"
          style={{ marginTop: 'var(--space-xl)', padding: 'var(--space-lg)', textAlign: 'center' }}
        >
          <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.5rem' }}>
              info
            </span>
            This assessment helps us understand your unique mental wellness style. 
            Your responses are completely anonymous and secure.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
