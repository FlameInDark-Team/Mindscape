import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const personalityQuestions = [
  // Energy & Social Interaction (E/I)
  {
    id: 1,
    category: 'Social Energy',
    question: 'When you feel stressed, do you prefer to:',
    options: [
      { text: 'Spend time alone to recharge and reflect', value: 'I', trait: 'Introversion' },
      { text: 'Be around friends and talk it out', value: 'E', trait: 'Extraversion' }
    ]
  },
  {
    id: 2,
    category: 'Social Interaction',
    question: 'In social situations, you:',
    options: [
      { text: 'Prefer deep conversations with a few close people', value: 'I', trait: 'Introversion' },
      { text: 'Enjoy meeting new people and group activities', value: 'E', trait: 'Extraversion' }
    ]
  },
  {
    id: 3,
    category: 'Energy Source',
    question: 'After a long day, you feel most recharged by:',
    options: [
      { text: 'Having quiet time alone with your thoughts', value: 'I', trait: 'Introversion' },
      { text: 'Going out and socializing with others', value: 'E', trait: 'Extraversion' }
    ]
  },
  
  // Information Processing (S/N)
  {
    id: 4,
    category: 'Coping Style',
    question: 'When facing a problem, you tend to:',
    options: [
      { text: 'Focus on practical, concrete solutions that work now', value: 'S', trait: 'Sensing' },
      { text: 'Explore possibilities and think about future implications', value: 'N', trait: 'Intuition' }
    ]
  },
  {
    id: 5,
    category: 'Information Processing',
    question: 'You learn best by:',
    options: [
      { text: 'Following step-by-step instructions and examples', value: 'S', trait: 'Sensing' },
      { text: 'Understanding concepts, theories, and the big picture', value: 'N', trait: 'Intuition' }
    ]
  },
  {
    id: 6,
    category: 'Focus Style',
    question: 'When reading or learning, you pay more attention to:',
    options: [
      { text: 'Facts, details, and what is actually said', value: 'S', trait: 'Sensing' },
      { text: 'Meanings, patterns, and what could be implied', value: 'N', trait: 'Intuition' }
    ]
  },
  {
    id: 7,
    category: 'Problem Solving',
    question: 'You trust more in:',
    options: [
      { text: 'Experience and proven methods', value: 'S', trait: 'Sensing' },
      { text: 'Intuition and innovative approaches', value: 'N', trait: 'Intuition' }
    ]
  },
  
  // Decision Making (T/F)
  {
    id: 8,
    category: 'Decision Making',
    question: 'When making important decisions, you rely more on:',
    options: [
      { text: 'Logic, objective analysis, and what makes sense', value: 'T', trait: 'Thinking' },
      { text: 'Personal values and how it affects people', value: 'F', trait: 'Feeling' }
    ]
  },
  {
    id: 9,
    category: 'Stress Response',
    question: 'Under pressure, you are more likely to:',
    options: [
      { text: 'Stay calm, detached, and think things through logically', value: 'T', trait: 'Thinking' },
      { text: 'Feel emotions strongly and seek emotional support', value: 'F', trait: 'Feeling' }
    ]
  },
  {
    id: 10,
    category: 'Conflict Resolution',
    question: 'In disagreements, you prioritize:',
    options: [
      { text: 'Being right and finding the truth', value: 'T', trait: 'Thinking' },
      { text: 'Maintaining harmony and understanding feelings', value: 'F', trait: 'Feeling' }
    ]
  },
  
  // Lifestyle & Organization (J/P)
  {
    id: 11,
    category: 'Lifestyle Preference',
    question: 'You feel more comfortable when your day is:',
    options: [
      { text: 'Planned, organized, and structured', value: 'J', trait: 'Judging' },
      { text: 'Flexible, spontaneous, and open to change', value: 'P', trait: 'Perceiving' }
    ]
  },
  {
    id: 12,
    category: 'Work Style',
    question: 'You prefer to:',
    options: [
      { text: 'Complete tasks well ahead of deadlines', value: 'J', trait: 'Judging' },
      { text: 'Work best under time pressure and last-minute', value: 'P', trait: 'Perceiving' }
    ]
  },
  {
    id: 13,
    category: 'Organization',
    question: 'Your living/work space is usually:',
    options: [
      { text: 'Neat, organized, and everything has its place', value: 'J', trait: 'Judging' },
      { text: 'Flexible, with organized chaos that works for you', value: 'P', trait: 'Perceiving' }
    ]
  },
  {
    id: 14,
    category: 'Planning',
    question: 'When going on a trip, you:',
    options: [
      { text: 'Plan everything in advance with a detailed itinerary', value: 'J', trait: 'Judging' },
      { text: 'Prefer to be spontaneous and see where the day takes you', value: 'P', trait: 'Perceiving' }
    ]
  },
  {
    id: 15,
    category: 'Completion',
    question: 'You feel most satisfied when:',
    options: [
      { text: 'Tasks are completed and checked off your list', value: 'J', trait: 'Judging' },
      { text: 'You have multiple options and possibilities open', value: 'P', trait: 'Perceiving' }
    ]
  }
]

const personalityTypes = {
  'ISTJ': { 
    name: 'The Inspector', 
    description: 'Practical, fact-minded, and reliable. You value order, tradition, and responsibility.',
    strengths: ['Organized', 'Responsible', 'Practical', 'Detail-oriented', 'Loyal'],
    weaknesses: ['Inflexible', 'Judgmental', 'Insensitive', 'Resistant to change'],
    careers: ['Accountant', 'Administrator', 'Engineer', 'Military Officer', 'Auditor'],
    relationships: 'Values stability and commitment. Prefers clear expectations and traditional roles.',
    stressManagement: 'Create structured routines, use checklists, maintain order in your environment'
  },
  'ISFJ': { 
    name: 'The Protector', 
    description: 'Warm, responsible, and caring. You are dedicated to helping and protecting others.',
    strengths: ['Supportive', 'Reliable', 'Patient', 'Practical', 'Observant'],
    weaknesses: ['Overly humble', 'Takes things personally', 'Reluctant to change', 'Overloaded'],
    careers: ['Nurse', 'Teacher', 'Social Worker', 'Counselor', 'Administrator'],
    relationships: 'Deeply caring and committed. Shows love through actions and service.',
    stressManagement: 'Set boundaries, practice self-care, allow time for personal needs'
  },
  'INFJ': { 
    name: 'The Counselor', 
    description: 'Insightful, idealistic, and principled. You seek meaning, connection, and purpose.',
    strengths: ['Insightful', 'Principled', 'Passionate', 'Creative', 'Inspiring'],
    weaknesses: ['Sensitive', 'Perfectionistic', 'Private', 'Burnout-prone'],
    careers: ['Counselor', 'Psychologist', 'Writer', 'Teacher', 'Social Worker'],
    relationships: 'Seeks deep, meaningful connections. Values authenticity and emotional intimacy.',
    stressManagement: 'Journal your thoughts, engage in creative activities, protect your alone time'
  },
  'INTJ': { 
    name: 'The Mastermind', 
    description: 'Strategic, independent, and analytical. You value competence, knowledge, and efficiency.',
    strengths: ['Strategic', 'Independent', 'Determined', 'Innovative', 'Confident'],
    weaknesses: ['Arrogant', 'Dismissive', 'Overly critical', 'Combative'],
    careers: ['Scientist', 'Engineer', 'Programmer', 'Analyst', 'Strategist'],
    relationships: 'Values intellectual connection. Prefers depth over breadth in relationships.',
    stressManagement: 'Break problems into logical steps, engage in strategic planning, pursue knowledge'
  },
  'ISTP': { 
    name: 'The Craftsman', 
    description: 'Practical, observant, and adaptable. You excel at hands-on problem-solving.',
    strengths: ['Practical', 'Flexible', 'Logical', 'Spontaneous', 'Resourceful'],
    weaknesses: ['Insensitive', 'Private', 'Stubborn', 'Risk-prone'],
    careers: ['Mechanic', 'Engineer', 'Pilot', 'Forensic Scientist', 'Athlete'],
    relationships: 'Values independence and action. Shows care through practical help.',
    stressManagement: 'Engage in physical activities, work with your hands, solve practical problems'
  },
  'ISFP': { 
    name: 'The Composer', 
    description: 'Gentle, caring, and artistic. You live in the present moment and value harmony.',
    strengths: ['Charming', 'Sensitive', 'Imaginative', 'Passionate', 'Curious'],
    weaknesses: ['Fiercely independent', 'Unpredictable', 'Easily stressed', 'Overly competitive'],
    careers: ['Artist', 'Designer', 'Musician', 'Chef', 'Veterinarian'],
    relationships: 'Warm and supportive. Expresses love through actions and creative gestures.',
    stressManagement: 'Express yourself creatively, spend time in nature, practice mindfulness'
  },
  'INFP': { 
    name: 'The Healer', 
    description: 'Idealistic, loyal, and empathetic. You seek authenticity, meaning, and personal growth.',
    strengths: ['Empathetic', 'Idealistic', 'Creative', 'Open-minded', 'Passionate'],
    weaknesses: ['Unrealistic', 'Self-isolating', 'Unfocused', 'Emotionally vulnerable'],
    careers: ['Writer', 'Counselor', 'Psychologist', 'Artist', 'Teacher'],
    relationships: 'Deeply romantic and loyal. Seeks authentic emotional connection.',
    stressManagement: 'Write or journal, engage in creative pursuits, connect with your values'
  },
  'INTP': { 
    name: 'The Architect', 
    description: 'Logical, innovative, and curious. You love exploring ideas, theories, and systems.',
    strengths: ['Analytical', 'Original', 'Open-minded', 'Curious', 'Objective'],
    weaknesses: ['Disconnected', 'Insensitive', 'Dissatisfied', 'Condescending'],
    careers: ['Scientist', 'Programmer', 'Mathematician', 'Philosopher', 'Analyst'],
    relationships: 'Values intellectual stimulation. May struggle with emotional expression.',
    stressManagement: 'Analyze problems logically, learn new concepts, engage in intellectual debates'
  },
  'ESTP': { 
    name: 'The Dynamo', 
    description: 'Energetic, pragmatic, and spontaneous. You thrive on action, excitement, and results.',
    strengths: ['Bold', 'Rational', 'Practical', 'Original', 'Perceptive'],
    weaknesses: ['Insensitive', 'Impatient', 'Risk-prone', 'Unstructured'],
    careers: ['Entrepreneur', 'Sales', 'Paramedic', 'Detective', 'Athlete'],
    relationships: 'Fun-loving and spontaneous. Prefers action over deep emotional talks.',
    stressManagement: 'Stay active, take on challenges, engage in competitive activities'
  },
  'ESFP': { 
    name: 'The Performer', 
    description: 'Outgoing, friendly, and fun-loving. You bring joy, energy, and enthusiasm to others.',
    strengths: ['Bold', 'Original', 'Practical', 'Observant', 'Excellent people skills'],
    weaknesses: ['Sensitive', 'Conflict-averse', 'Easily bored', 'Poor long-term focus'],
    careers: ['Entertainer', 'Event Planner', 'Sales', 'Teacher', 'Social Worker'],
    relationships: 'Warm and generous. Loves making others happy and creating fun experiences.',
    stressManagement: 'Socialize with friends, engage in fun activities, stay in the present moment'
  },
  'ENFP': { 
    name: 'The Champion', 
    description: 'Enthusiastic, creative, and sociable. You inspire and motivate others with your passion.',
    strengths: ['Curious', 'Observant', 'Energetic', 'Enthusiastic', 'Excellent communicator'],
    weaknesses: ['Unfocused', 'Disorganized', 'Overly accommodating', 'Overly optimistic'],
    careers: ['Counselor', 'Teacher', 'Writer', 'Entrepreneur', 'Psychologist'],
    relationships: 'Passionate and supportive. Seeks deep emotional connections and growth.',
    stressManagement: 'Explore new possibilities, connect with others, pursue creative projects'
  },
  'ENTP': { 
    name: 'The Visionary', 
    description: 'Innovative, clever, and curious. You love debating ideas and challenging the status quo.',
    strengths: ['Knowledgeable', 'Quick thinker', 'Original', 'Charismatic', 'Energetic'],
    weaknesses: ['Argumentative', 'Insensitive', 'Intolerant', 'Difficulty focusing'],
    careers: ['Entrepreneur', 'Lawyer', 'Scientist', 'Inventor', 'Consultant'],
    relationships: 'Intellectually stimulating. Enjoys playful debates and mental challenges.',
    stressManagement: 'Engage in intellectual debates, explore new ideas, challenge yourself'
  },
  'ESTJ': { 
    name: 'The Supervisor', 
    description: 'Organized, practical, and decisive. You value efficiency, order, and getting things done.',
    strengths: ['Dedicated', 'Strong-willed', 'Direct', 'Honest', 'Loyal'],
    weaknesses: ['Inflexible', 'Uncomfortable with unconventional', 'Judgmental', 'Difficult to relax'],
    careers: ['Manager', 'Administrator', 'Judge', 'Military Officer', 'Business Executive'],
    relationships: 'Traditional and committed. Values stability and clear expectations.',
    stressManagement: 'Create action plans, organize your environment, take charge of situations'
  },
  'ESFJ': { 
    name: 'The Provider', 
    description: 'Caring, social, and popular. You create harmony, help others, and build community.',
    strengths: ['Strong practical skills', 'Loyal', 'Sensitive', 'Warm', 'Good at connecting'],
    weaknesses: ['Worried about social status', 'Inflexible', 'Reluctant to innovate', 'Needy'],
    careers: ['Teacher', 'Nurse', 'Social Worker', 'Event Coordinator', 'Office Manager'],
    relationships: 'Warm and caring. Shows love through acts of service and attention.',
    stressManagement: 'Help others, maintain social connections, create harmonious environments'
  },
  'ENFJ': { 
    name: 'The Teacher', 
    description: 'Charismatic, inspiring, and empathetic. You lead with compassion and bring out the best in others.',
    strengths: ['Tolerant', 'Reliable', 'Charismatic', 'Altruistic', 'Natural leader'],
    weaknesses: ['Overly idealistic', 'Too selfless', 'Too sensitive', 'Fluctuating self-esteem'],
    careers: ['Teacher', 'Counselor', 'Coach', 'HR Manager', 'Politician'],
    relationships: 'Deeply caring and supportive. Invests heavily in relationships and growth.',
    stressManagement: 'Help others grow, lead group activities, express your feelings openly'
  },
  'ENTJ': { 
    name: 'The Commander', 
    description: 'Bold, strategic, and confident. You are a natural leader who excels at organizing and directing.',
    strengths: ['Efficient', 'Energetic', 'Self-confident', 'Strong-willed', 'Strategic'],
    weaknesses: ['Stubborn', 'Intolerant', 'Impatient', 'Arrogant', 'Poor handling of emotions'],
    careers: ['CEO', 'Lawyer', 'Judge', 'Business Consultant', 'Entrepreneur'],
    relationships: 'Direct and honest. Values growth, competence, and intellectual connection.',
    stressManagement: 'Set and achieve goals, lead projects, engage in strategic planning'
  }
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
          style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto' }}
        >
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <div className="icon-bubble icon-bubble-primary" style={{ margin: '0 auto 1.5rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>psychology</span>
            </div>
            <h2>Your Personality Profile</h2>
            <p>Comprehensive insights about your mental wellness style</p>
          </div>

          {/* Main Type Display */}
          <div className="card border-glow" style={{ padding: 'var(--space-2xl)', textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
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
              <p style={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: 0 }}>
                {typeInfo.description}
              </p>
            </motion.div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid-2" style={{ marginBottom: 'var(--space-xl)' }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card card-glow"
              style={{ padding: 'var(--space-xl)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-md)' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>
                  star
                </span>
                <h4 style={{ margin: 0 }}>Your Strengths</h4>
              </div>
              <ul style={{ lineHeight: 1.8, paddingLeft: '1.5rem' }}>
                {typeInfo.strengths.map((strength, i) => (
                  <li key={i} style={{ marginBottom: '0.5rem' }}>{strength}</li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card card-glow"
              style={{ padding: 'var(--space-xl)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-md)' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--secondary)', fontSize: '1.5rem' }}>
                  trending_up
                </span>
                <h4 style={{ margin: 0 }}>Growth Areas</h4>
              </div>
              <ul style={{ lineHeight: 1.8, paddingLeft: '1.5rem' }}>
                {typeInfo.weaknesses.map((weakness, i) => (
                  <li key={i} style={{ marginBottom: '0.5rem' }}>{weakness}</li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Career Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card border-glow"
            style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-md)' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--tertiary)', fontSize: '1.5rem' }}>
                work
              </span>
              <h4 style={{ margin: 0 }}>Ideal Career Paths</h4>
            </div>
            <p style={{ marginBottom: 'var(--space-md)', opacity: 0.9 }}>
              Based on your personality type, you may thrive in these careers:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
              {typeInfo.careers.map((career, i) => (
                <span key={i} className="chip" style={{ background: 'var(--tertiary-container)', color: 'var(--on-tertiary-container)' }}>
                  {career}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Relationships */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card card-glow"
            style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-md)' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>
                favorite
              </span>
              <h4 style={{ margin: 0 }}>Relationships & Social Style</h4>
            </div>
            <p style={{ lineHeight: 1.6, margin: 0 }}>
              {typeInfo.relationships}
            </p>
          </motion.div>

          {/* Stress Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card-tonal"
            style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-md)' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--secondary)', fontSize: '1.5rem' }}>
                self_improvement
              </span>
              <h4 style={{ margin: 0 }}>Personalized Stress Management</h4>
            </div>
            <p style={{ lineHeight: 1.6, margin: 0 }}>
              {typeInfo.stressManagement}
            </p>
          </motion.div>

          {/* Wellness Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="card border-glow"
            style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}
          >
            <h4 style={{ marginTop: 0 }}>Your Wellness Toolkit</h4>
            <div className="grid-2" style={{ gap: 'var(--space-md)' }}>
              <div>
                <h5 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-sm)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>battery_charging_full</span>
                  Energy Management
                </h5>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                  {personalityType.includes('I') 
                    ? 'Schedule regular alone time for self-care and reflection. Recharge in quiet environments.'
                    : 'Maintain social connections and group activities. Recharge through interaction with others.'}
                </p>
              </div>
              <div>
                <h5 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-sm)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>psychology</span>
                  Mental Approach
                </h5>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                  {personalityType.includes('S') 
                    ? 'Use concrete, step-by-step stress management techniques. Focus on practical solutions.'
                    : 'Explore creative outlets and visualization exercises. Think about possibilities and meanings.'}
                </p>
              </div>
              <div>
                <h5 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-sm)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>favorite</span>
                  Emotional Processing
                </h5>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                  {personalityType.includes('T') 
                    ? 'Track your progress with data and metrics. Analyze situations logically and objectively.'
                    : 'Connect with others through shared experiences. Honor your emotions and seek support.'}
                </p>
              </div>
              <div>
                <h5 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-sm)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>calendar_month</span>
                  Organization Style
                </h5>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                  {personalityType.includes('J') 
                    ? 'Create structured routines and schedules. Plan ahead and maintain organization.'
                    : 'Stay flexible and try varied wellness approaches. Embrace spontaneity and adaptability.'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
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

          {/* Disclaimer */}
          <div className="card-tonal" style={{ marginTop: 'var(--space-xl)', padding: 'var(--space-lg)', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.25rem' }}>info</span>
              This assessment is for self-discovery and wellness guidance. It is not a clinical diagnostic tool.
            </p>
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
