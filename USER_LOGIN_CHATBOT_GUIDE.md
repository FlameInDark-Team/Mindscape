# User Login & AI Chatbot Guide

## Overview
MindScape now includes user authentication and an AI-powered chatbot using Groq's LLaMA 3.3 70B model.

## Features Added

### 1. User Authentication
- **Registration**: Create account with email, password, and name
- **Login**: Secure authentication with token-based sessions
- **Password Security**: SHA-256 hashed passwords stored in database

### 2. AI Chatbot (Groq Integration)
- **Model**: LLaMA 3.3 70B Versatile (fast and capable)
- **Purpose**: Mental health companion for college students
- **Features**:
  - Empathetic responses to stress, anxiety, burnout
  - Evidence-based coping strategies
  - Crisis detection and resource recommendations
  - Conversation history (last 10 messages for context)
  - Quick prompts for common concerns

### 3. User Dashboard
- Quick access to Check-In, Trends, and Resources
- Integrated AI chatbot interface
- Minimizable chat window
- Real-time message streaming

## How to Use

### For Users:
1. Visit http://localhost:5173/login
2. Create an account or sign in
3. Access your personalized dashboard at /dashboard
4. Chat with the AI companion for mental health support
5. Use quick prompts or type custom messages

### Anonymous Mode:
- Users can still use the platform anonymously
- Click "Continue Anonymously" on the login page
- Access all core features without registration

## API Endpoints

### User Authentication
- `POST /api/user/register` - Create new user account
- `POST /api/user/login` - Authenticate user

### AI Chatbot
- `POST /api/chat` - Send message to AI chatbot (requires auth token)

## Database Schema

### users table
- id (PRIMARY KEY)
- email (UNIQUE, NOT NULL)
- password_hash (NOT NULL)
- name (NOT NULL)
- created_at (NOT NULL)
- last_login

## Configuration

### Environment Variables (.env)
```
GROQ_API_KEY=your_groq_api_key_here
PORT=3001
```

## Security Features
- Password hashing with SHA-256
- Token-based authentication
- Authorization checks on protected endpoints
- Crisis detection in chatbot responses

## Crisis Handling
The AI chatbot is programmed to:
- Detect suicidal thoughts or severe crisis
- Immediately recommend emergency resources:
  - 988 (Suicide & Crisis Lifeline)
  - 741741 (Crisis Text Line)
  - Campus counseling services
  - Emergency room

## Technical Stack
- **Backend**: Express.js + better-sqlite3
- **AI**: Groq SDK with LLaMA 3.3 70B
- **Frontend**: React 18 + Framer Motion
- **Auth**: Token-based with crypto module

## Notes
- Chatbot is supportive but NOT a replacement for professional care
- All user data is encrypted and secure
- Anonymous check-ins remain completely separate from user accounts
