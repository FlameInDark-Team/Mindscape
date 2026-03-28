# 🚀 MindScape Project is Running!

## ✅ Server Status

### Backend Server
- **Status**: ✅ Running
- **URL**: http://localhost:3001
- **Database**: Initialized (SQLite)
- **API**: Ready to accept requests

### Frontend Server  
- **Status**: ✅ Running
- **URL**: http://localhost:5173
- **Framework**: Vite + React 18
- **Hot Reload**: Enabled

## 🌐 Access the Application

### Main Application
**Open in browser**: http://localhost:5173

### Available Pages

1. **Landing Page**
   - URL: http://localhost:5173/
   - Features: Platform overview, call-to-action

2. **User Login**
   - URL: http://localhost:5173/login
   - Features: Email/password login, Google Sign-In, Anonymous mode

3. **Check-In Page**
   - URL: http://localhost:5173/checkin
   - Features: Daily mood tracking, stress tags, anonymous submission

4. **Personal Trends**
   - URL: http://localhost:5173/trends
   - Features: Mood charts, statistics, early warnings, achievements, mood garden

5. **Resources**
   - URL: http://localhost:5173/resources
   - Features: Mental health resources, articles, guides

6. **User Dashboard** (requires login)
   - URL: http://localhost:5173/dashboard
   - Features: AI chatbot, quick actions, personalized insights

7. **Admin Login**
   - URL: http://localhost:5173/admin
   - Features: Google Sign-In (restricted to specific email)

8. **Admin Dashboard** (requires admin login)
   - URL: http://localhost:5173/admin/dashboard
   - Features: Campus mood analytics, alerts, department breakdown

## 🧪 Quick Test Flow

### Test Anonymous Check-In
1. Go to http://localhost:5173/checkin
2. Select a mood (1-10)
3. Add optional text and stressors
4. Submit
5. View trends at http://localhost:5173/trends

### Test User Registration & Login
1. Go to http://localhost:5173/login
2. Click "Don't have an account? Sign up"
3. Enter name, email, password
4. Click "Create Account"
5. You'll be redirected to dashboard

### Test Google Sign-In (User)
⚠️ **Requires Google OAuth Client ID in .env**
1. Go to http://localhost:5173/login
2. Click "Sign in with Google"
3. Select any Google account
4. You'll be redirected to dashboard

### Test Admin Access
⚠️ **Requires Google OAuth Client ID in .env**
1. Go to http://localhost:5173/admin
2. Click "Sign in with Google"
3. Sign in with: usertest2021subhradeep@gmail.com
4. You'll be redirected to admin dashboard

### Test AI Chatbot (requires login)
1. Login as a user
2. Go to http://localhost:5173/dashboard
3. Click "Open Chat"
4. Try quick prompts or type a message
5. AI will respond with mental health support

## 🔧 API Endpoints Available

### Public Endpoints
- `GET http://localhost:3001/api/health` - Health check
- `POST http://localhost:3001/api/checkin` - Submit check-in
- `GET http://localhost:3001/api/resources` - Get resources
- `GET http://localhost:3001/api/personal/trends?session_id=xxx` - Get trends
- `GET http://localhost:3001/api/personal/stats?session_id=xxx` - Get stats

### User Endpoints
- `POST http://localhost:3001/api/user/register` - Register
- `POST http://localhost:3001/api/user/login` - Login
- `POST http://localhost:3001/api/user/google-auth` - Google login
- `POST http://localhost:3001/api/chat` - AI chatbot (requires auth)

### Admin Endpoints
- `POST http://localhost:3001/api/admin/google-auth` - Admin Google login
- `GET http://localhost:3001/api/admin/dashboard` - Dashboard data
- `GET http://localhost:3001/api/admin/alerts` - Get alerts
- `POST http://localhost:3001/api/admin/alerts/:id/resolve` - Resolve alert

## 📊 Features to Test

### ✅ Core Features
- [x] Anonymous mood check-ins
- [x] Stress tracking with tags
- [x] Personal trend visualization
- [x] Early warning system (4 levels)
- [x] Resource library
- [x] Admin dashboard with analytics

### ✅ Advanced Features
- [x] Achievement system (12 badges)
- [x] Mood garden (10 plants)
- [x] AI-powered insights
- [x] Mood-based recommendations
- [x] AI chatbot (Groq LLaMA 3.3 70B)

### ✅ Authentication
- [x] Email/password registration
- [x] Email/password login
- [x] Google OAuth (users)
- [x] Google OAuth (admin - restricted)
- [x] Anonymous mode

### ✅ UI/UX
- [x] Light/Dark theme toggle
- [x] Mobile responsive
- [x] Orb backgrounds
- [x] Aurora effects
- [x] Smooth animations
- [x] Loading states

## ⚠️ Important Notes

### Google OAuth Setup
For Google Sign-In to work, you need to:
1. Get Google OAuth Client ID from Google Cloud Console
2. Add it to .env file: `VITE_GOOGLE_CLIENT_ID=your_client_id`
3. Restart servers

See **QUICK_START_GOOGLE_AUTH.md** for detailed instructions.

### Admin Access
- Only `usertest2021subhradeep@gmail.com` can access admin panel
- Can be changed in .env: `ADMIN_EMAIL=your_email@gmail.com`

### AI Chatbot
- Requires Groq API key in .env: `GROQ_API_KEY=your_key`
- Uses LLaMA 3.3 70B Versatile model
- Provides mental health support and coping strategies

## 🛑 Stop Servers

If you need to stop the servers:
1. Press `Ctrl+C` in each terminal
2. Or use the process manager to stop them

## 🔄 Restart Servers

If you make changes to .env or server code:
```bash
# Stop current servers (Ctrl+C)
# Then restart:

# Terminal 1 - Backend
node server/server.js

# Terminal 2 - Frontend  
npm run dev
```

## 📱 Mobile Testing

To test on mobile devices on the same network:
1. Find your computer's IP address
2. Update Vite config to expose network
3. Access from mobile: http://YOUR_IP:5173

## 🐛 Troubleshooting

### "Cannot connect to server"
- Check if backend is running on port 3001
- Check terminal for error messages

### "Google Sign-In doesn't work"
- Verify VITE_GOOGLE_CLIENT_ID is set in .env
- Restart servers after updating .env
- Check browser console for errors

### "Admin access denied"
- Verify you're using the exact email in ADMIN_EMAIL
- Check .env file has correct admin email

### "AI Chatbot not responding"
- Verify GROQ_API_KEY is set in .env
- Check backend terminal for API errors
- Ensure you're logged in as a user

## 📚 Documentation

- README.md - Full project documentation
- QUICK_START_GOOGLE_AUTH.md - OAuth setup
- TESTING_GUIDE.md - Comprehensive testing guide
- USER_LOGIN_CHATBOT_GUIDE.md - Authentication features

---

## 🎉 Enjoy Testing MindScape!

The platform is fully functional and ready to use. Explore all features and test the complete user journey from anonymous check-ins to AI-powered support!
