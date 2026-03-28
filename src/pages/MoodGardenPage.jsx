import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }

// Achievement definitions
const ACHIEVEMENTS = [
  { id: 'first_checkin', name: 'First Step', icon: '🌱', description: 'Complete your first check-in', requirement: 1 },
  { id: 'streak_3', name: 'Consistent', icon: '🔥', description: '3-day check-in streak', requirement: 3 },
  { id: 'streak_7', name: 'Dedicated', icon: '⭐', description: '7-day check-in streak', requirement: 7 },
  { id: 'streak_30', name: 'Champion', icon: '👑', description: '30-day check-in streak', requirement: 30 },
  { id: 'checkin_10', name: 'Explorer', icon: '🗺️', description: 'Complete 10 check-ins', requirement: 10 },
  { id: 'checkin_50', name: 'Veteran', icon: '🎖️', description: 'Complete 50 check-ins', requirement: 50 },
  { id: 'checkin_100', name: 'Legend', icon: '🏆', description: 'Complete 100 check-ins', requirement: 100 },
  { id: 'positive_week', name: 'Sunshine', icon: '☀️', description: '7 days with scores above 7', requirement: 7 },
  { id: 'resource_explorer', name: 'Seeker', icon: '📚', description: 'Visit resources page 5 times', requirement: 5 },
  { id: 'garden_master', name: 'Gardener', icon: '🌺', description: 'Grow 5 different flowers', requirement: 5 }
]

// Plant growth stages based on check-ins
const getPlantStage = (checkins) => {
  if (checkins === 0) return { stage: 0, name: 'Empty', emoji: '🌍', color: '#8B7355' }
  if (checkins < 3) return { stage: 1, name: 'Seed', emoji: '🌱', color: '#90EE90' }
  if (checkins < 7) return { stage: 2, name: 'Sprout', emoji: '🌿', color: '#7CFC00' }
  if (checkins < 14) return { stage: 3, name: 'Growing', emoji: '🪴', color: '#32CD32' }
  if (checkins < 30) return { stage: 4, name: 'Blooming', emoji: '🌸', color: '#FF69B4' }
  if (checkins < 50) return { stage: 5, name: 'Flourishing'