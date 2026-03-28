<<<<<<< HEAD
# 🧠 MindScape - Mental Health Check-in Platform

A comprehensive anonymous mental health check-in platform for college students with AI-powered support, gamification, and institutional analytics.

## 🌟 Features

### Core Features
- **Anonymous Daily Check-ins**: Track mood (1-10 scale) with emoji feedback
- **Stress Tracking**: Tag stressors (academics, social, financial, etc.)
- **Personal Trends**: Visualize mood patterns over time
- **Early Warning System**: 4-level alert system (Severe, Moderate, Mild, Burnout)
- **Resource Library**: Curated mental health resources and guides
- **Admin Dashboard**: Real-time institutional analytics and alerts

### Advanced Features
- **🎮 Gamification**: Achievement system with 12 badges and points
- **🌱 Mood Garden**: Interactive garden with 10 unlockable plants
- **🤖 AI Chatbot**: Groq-powered mental health companion (LLaMA 3.3 70B)
- **📊 AI Insights**: Pattern detection and personalized recommendations
- **🎵 Mood Recommendations**: Adaptive music and activity suggestions

### Authentication
- **Google OAuth**: Sign in with any Google account
- **Email/Password**: Traditional authentication option
- **Anonymous Mode**: Use platform without registration
- **Admin Access**: Restricted to specific Google account

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Google OAuth Client ID (for Google Sign-in)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/morningstarxcdcode/Mindscape.git
cd Mindscape
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy .env.example to .env and fill in your values
cp .env.example .env
```

Required environment variables:
```env
GROQ_API_KEY=your_groq_api_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
ADMIN_EMAIL=your_admin_email@gmail.com
PORT=3001
```

4. Start the servers:
```bash
# Terminal 1 - Backend
node server/server.js

# Terminal 2 - Frontend
npm run dev
```

5. Open http://localhost:5173

## 📖 Documentation

- **[Quick Start Guide](QUICK_START_GOOGLE_AUTH.md)** - 5-minute setup
- **[Google OAuth Setup](GOOGLE_OAUTH_SETUP.md)** - Detailed OAuth configuration
- **[User Login & Chatbot Guide](USER_LOGIN_CHATBOT_GUIDE.md)** - Authentication features
- **[Testing Guide](TESTING_GUIDE.md)** - How to test the platform
- **[Requirements Compliance](REQUIREMENTS_COMPLIANCE.md)** - Feature checklist

## 🏗️ Tech Stack

### Frontend
- React 18 + Vite
- Framer Motion (animations)
- Chart.js (data visualization)
- React Router (navigation)
- Google OAuth (@react-oauth/google)

### Backend
- Express.js
- better-sqlite3 (database)
- Groq SDK (AI chatbot)
- dotenv (environment config)

### AI/ML
- Groq API with LLaMA 3.3 70B Versatile
- Pattern detection algorithms
- Sentiment analysis

## 📊 Database Schema

### Tables
- `mood_entries` - Anonymous check-in data
- `users` - Registered user accounts
- `alerts` - System-generated alerts
- `resources` - Mental health resources
- `admin_users` - Admin credentials

## 🔒 Security Features

- SHA-256 password hashing
- Token-based authentication
- Email-restricted admin access
- Anonymous session IDs (UUID)
- Server-side validation
- Crisis detection in AI responses

## 🎯 Early Warning System

### Alert Levels
1. **Severe** (≤3): Consistently low scores, immediate support needed
2. **Moderate** (≤4.5): Lower than usual, support recommended
3. **Mild** (declining trend): Proactive intervention suggested
4. **Burnout** (14-day avg <5.5): Sustained moderate-low scores

## 🎮 Gamification System

### Achievements (12 Badges)
- First Steps (10 pts) - Complete first check-in
- Week Warrior (50 pts) - 7-day streak
- Month Master (200 pts) - 30-day streak
- Mood Explorer (30 pts) - Try all mood levels
- Resource Seeker (25 pts) - Visit resources page
- Garden Starter (40 pts) - Unlock first plant
- And more...

### Mood Garden (10 Plants)
- Seedling → Sprout → Flower → Tree progression
- Unlocked based on check-ins and mood scores
- Visual representation of mental health journey

## 🤖 AI Chatbot Features

- Empathetic mental health support
- Evidence-based coping strategies
- Crisis detection and resource recommendations
- Conversation history (last 10 messages)
- Quick prompts for common concerns
- Powered by Groq's LLaMA 3.3 70B

## 📱 Mobile Responsive

- Touch-optimized UI (44px minimum targets)
- Slide-out navigation menu
- Safe area insets for notched devices
- Landscape mode support
- Reduced motion support

## 🎨 UI/UX Features

- Light/Dark theme toggle
- Orb backgrounds with floating animations
- Soft aurora gradient effects
- Border glow on hover
- Shimmer animations
- Scroll-to-top button
- Loading states and transitions

## 🔧 API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `POST /api/checkin` - Submit anonymous check-in
- `GET /api/resources` - Get resources
- `GET /api/personal/trends` - Get personal trends
- `GET /api/personal/stats` - Get personal statistics

### User Endpoints
- `POST /api/user/register` - Register new user
- `POST /api/user/login` - User login
- `POST /api/user/google-auth` - Google OAuth login
- `POST /api/chat` - AI chatbot (requires auth)

### Admin Endpoints
- `POST /api/admin/google-auth` - Admin Google OAuth
- `GET /api/admin/dashboard` - Dashboard data (requires auth)
- `GET /api/admin/alerts` - Get alerts (requires auth)
- `POST /api/admin/alerts/:id/resolve` - Resolve alert (requires auth)

## 🚦 Getting Started for Development

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Problem Statement 4 from Constructor Hackathon
- Groq for AI API
- Google for OAuth services
- ReactBits.dev for UI inspiration

## 📧 Contact

For questions or support, please open an issue on GitHub.

## ⚠️ Disclaimer

This platform provides supportive guidance but is NOT a replacement for professional mental health care. If you're in crisis, please contact:
- 988 (Suicide & Crisis Lifeline - US)
- 741741 (Crisis Text Line - text "HELLO")
- Campus counseling services
- Emergency services (911)

---

Made with ❤️ for college student mental wellness
=======
# Mindscape Web

Mindscape is a production-oriented pilot web app for college early support. It combines anonymous daily pulse check-ins, a weekly PHQ-2/GAD-2 screener, and an explicit opt-in counselor follow-up flow with institution-level cohort analytics.

It now also includes a research knowledge layer derived from `mindscape_research_reference.docx`, plus a research assistant route that answers from that reference with optional Groq synthesis.

## Stack

- Hono + JSX on a Cloudflare-compatible runtime
- TypeScript
- HTMX for partial updates
- Cloudflare D1 production persistence with in-memory fallback when `DB` is not bound
- Resend-ready magic-link auth
- Groq-ready optional reflection tagging

## Quick start

```bash
pnpm install
cp .dev.vars.example .dev.vars
pnpm dev
```

Open `http://127.0.0.1:8787`.

If you bind `DB` in `wrangler.toml`, the app initializes D1 tables on first use and stores:

- student daily pulses
- weekly screeners
- support requests
- risk events
- admin magic tokens
- research reference entries
- assistant question history

## Demo paths

- `/` marketing + architecture landing page
- `/research` local research reference page
- `/assistant` research-backed assistant page
- `/check-in/demo-university` student portal with daily pulse, weekly screener, and support request
- `/admin/login` admin magic-link login
- `/admin` admin dashboard
- `/admin/cohorts/:id` cohort detail page
- `/api/health` runtime status

## Backend docs

- [Backend architecture](./docs/backend-architecture.md)
- [Backend operations](./docs/backend-operations.md)

## Demo admin emails

- `counselor@mindscape.demo`
- `dean@mindscape.demo`

If `RESEND_API_KEY` is not configured, the magic link is shown in preview mode on the login page.

## Storage

- Without `DB`, the app runs from seeded in-memory demo data.
- With `DB`, the runtime uses D1-backed persistence and seeds the demo institution plus the research reference idempotently.
- `schema.sql` mirrors the production D1 schema, including `research_entries` and `assistant_questions`.

## Product model

- Anonymous by default: daily pulse and weekly screeners are stored against a pseudonymous device hash.
- Identifiable only by request: name, email, and phone only enter the system if a student explicitly submits the support request form.
- Rules-based risk logic: daily pulse evaluates mood, stress, energy, sleep, connectedness, and safety status; weekly screens use PHQ-2/GAD-2 totals and thresholds.
- Reflection AI is not the primary risk engine. It is limited to theme extraction and resource routing.
- Research assistant answers are grounded in the local research reference shipped with the app. If `GROQ_API_KEY` is configured, answers are synthesized from retrieved local sections; otherwise the app falls back to deterministic local retrieval output.

## Checks

```bash
pnpm lint
pnpm test
```
>>>>>>> b2993a445bf5f1684865b3dd7097aa829fac5783
