// API Configuration for Production/Development
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Google OAuth Client ID
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

// Environment check
export const isDevelopment = import.meta.env.DEV
export const isProduction = import.meta.env.PROD
