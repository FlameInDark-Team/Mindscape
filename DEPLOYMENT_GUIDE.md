# 🚀 MindScape Deployment Guide

## Overview

This guide covers deploying MindScape to various cloud platforms. Choose the one that best fits your needs.

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:
- ✅ GitHub repository set up
- ✅ Groq API key
- ✅ Google OAuth Client ID (with production URLs)
- ✅ Admin email configured
- ✅ All code tested locally

## 🌟 Recommended: Vercel + Railway (Easiest & Free)

### Why This Combo?
- **Vercel**: Perfect for React frontend (free tier)
- **Railway**: Great for Node.js backend + SQLite (free $5 credit)
- **Total Cost**: Free for small projects
- **Setup Time**: 15 minutes

---

## Option 1: Vercel (Frontend) + Railway (Backend) ⭐ RECOMMENDED

### Part A: Deploy Backend to Railway

#### Step 1: Sign Up for Railway
1. Go to https://railway.app
2. Sign up with GitHub
3. You get $5 free credit (no credit card needed)

#### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `Mindscape` repository
4. Railway will detect it's a Node.js app

#### Step 3: Configure Backend
1. Click on your service
2. Go to "Variables" tab
3. Add environment variables:
   ```
   GROQ_API_KEY=your_groq_api_key
   ADMIN_EMAIL=usertest2021subhradeep@gmail.com
   PORT=3001
   NODE_ENV=production
   ```

#### Step 4: Add Start Command
1. Go to "Settings" tab
2. Set "Start Command": `node server/server.js`
3. Set "Root Directory": `/` (leave as root)

#### Step 5: Generate Domain
1. Go to "Settings" tab
2. Click "Generate Domain"
3. You'll get a URL like: `mindscape-backend.up.railway.app`
4. **Copy this URL** - you'll need it for frontend

#### Step 6: Configure Database Persistence
1. Railway automatically handles SQLite
2. Database will persist in `/app/server/mindscape.db`

### Part B: Deploy Frontend to Vercel

#### Step 1: Sign Up for Vercel
1. Go to https://vercel.com
2. Sign up with GitHub
3. Free tier is perfect for this project

#### Step 2: Import Project
1. Click "Add New..." → "Project"
2. Import your `Mindscape` repository
3. Vercel will auto-detect it's a Vite app

#### Step 3: Configure Build Settings
1. **Framework Preset**: Vite
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. **Install Command**: `npm install`

#### Step 4: Add Environment Variables
1. Go to "Environment Variables" section
2. Add these variables:
   ```
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   VITE_API_URL=https://mindscape-backend.up.railway.app
   ```

#### Step 5: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. You'll get a URL like: `mindscape.vercel.app`

#### Step 6: Update Backend URL in Code
You need to update the API calls to use the Railway backend URL.

Create a new file: `src/config.js`
```javascript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
```

Then update all fetch calls to use this URL (see detailed instructions below).

### Part C: Update Google OAuth for Production

1. Go to https://console.cloud.google.com/apis/credentials
2. Edit your OAuth Client
3. Add authorized origins:
   ```
   https://mindscape.vercel.app
   https://mindscape-backend.up.railway.app
   ```
4. Add authorized redirect URIs:
   ```
   https://mindscape.vercel.app
   https://mindscape.vercel.app/login
   https://mindscape.vercel.app/admin
   ```
5. Save changes

---

## Option 2: Render (Full Stack) 🎯 SIMPLE

### Why Render?
- Deploy both frontend and backend together
- Free tier available
- Easy setup
- Good for beginners

#### Step 1: Sign Up
1. Go to https://render.com
2. Sign up with GitHub

#### Step 2: Create Web Service (Backend)
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: mindscape-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server/server.js`
   - **Plan**: Free

#### Step 3: Add Environment Variables (Backend)
```
GROQ_API_KEY=your_groq_api_key
ADMIN_EMAIL=usertest2021subhradeep@gmail.com
PORT=3001
```

#### Step 4: Create Static Site (Frontend)
1. Click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: mindscape-frontend
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

#### Step 5: Add Environment Variables (Frontend)
```
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_URL=https://mindscape-backend.onrender.com
```

#### Step 6: Deploy
Both services will deploy automatically. You'll get URLs like:
- Backend: `https://mindscape-backend.onrender.com`
- Frontend: `https://mindscape-frontend.onrender.com`

---

## Option 3: Netlify (Frontend) + Heroku (Backend)

### Part A: Deploy Backend to Heroku

#### Step 1: Install Heroku CLI
```bash
npm install -g heroku
```

#### Step 2: Login and Create App
```bash
heroku login
heroku create mindscape-backend
```

#### Step 3: Add Buildpack
```bash
heroku buildpacks:set heroku/nodejs
```

#### Step 4: Set Environment Variables
```bash
heroku config:set GROQ_API_KEY=your_groq_api_key
heroku config:set ADMIN_EMAIL=usertest2021subhradeep@gmail.com
heroku config:set NODE_ENV=production
```

#### Step 5: Create Procfile
Create `Procfile` in root:
```
web: node server/server.js
```

#### Step 6: Deploy
```bash
git push heroku main
```

### Part B: Deploy Frontend to Netlify

#### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### Step 2: Build and Deploy
```bash
npm run build
netlify deploy --prod
```

#### Step 3: Configure Environment Variables
In Netlify dashboard:
```
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_URL=https://mindscape-backend.herokuapp.com
```

---

## 🔧 Code Changes for Production

### 1. Create API Configuration File

Create `src/config.js`:
```javascript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
```

### 2. Update All API Calls

Replace all instances of `http://localhost:3001` with `API_URL`:

**Example in `src/pages/UserLoginPage.jsx`:**
```javascript
import { API_URL } from '../config'

// Change from:
const res = await fetch('http://localhost:3001/api/user/login', {

// To:
const res = await fetch(`${API_URL}/api/user/login`, {
```

### 3. Update CORS in Backend

In `server/server.js`, update CORS:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
```

Add to Railway environment variables:
```
FRONTEND_URL=https://mindscape.vercel.app
```

### 4. Update Database Path for Production

In `server/db.js`:
```javascript
const dbPath = process.env.DATABASE_PATH || join(__dirname, 'mindscape.db')
export const db = new Database(dbPath)
```

---

## 📝 Post-Deployment Checklist

After deployment:
- [ ] Test user registration
- [ ] Test user login
- [ ] Test Google OAuth
- [ ] Test anonymous check-in
- [ ] Test admin login (with correct email)
- [ ] Test AI chatbot
- [ ] Test all pages load correctly
- [ ] Check mobile responsiveness
- [ ] Verify database persistence
- [ ] Test early warning system
- [ ] Check achievement system

---

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` to GitHub
- Use platform-specific environment variable settings
- Rotate API keys regularly

### Database
- Railway/Render provide persistent storage
- Set up regular backups
- Consider upgrading to PostgreSQL for production

### HTTPS
- All platforms provide free SSL certificates
- Ensure all API calls use HTTPS in production
- Update Google OAuth to use HTTPS URLs

---

## 💰 Cost Comparison

| Platform | Frontend | Backend | Database | Total/Month |
|----------|----------|---------|----------|-------------|
| Vercel + Railway | Free | $5 credit | Included | $0-5 |
| Render | Free | Free | Included | $0 |
| Netlify + Heroku | Free | $7 | Included | $7 |
| AWS/Azure | ~$5 | ~$10 | ~$5 | ~$20 |

**Recommendation**: Start with Vercel + Railway (free tier)

---

## 🆘 Troubleshooting

### "Cannot connect to backend"
- Check backend URL is correct in frontend env vars
- Verify backend is running (check Railway/Render logs)
- Check CORS settings

### "Google OAuth not working"
- Verify production URLs are added to Google Console
- Check VITE_GOOGLE_CLIENT_ID is set correctly
- Ensure using HTTPS URLs

### "Database not persisting"
- Check platform provides persistent storage
- Verify database path is correct
- Consider using PostgreSQL for production

### "AI Chatbot not responding"
- Verify GROQ_API_KEY is set in backend
- Check backend logs for API errors
- Ensure API key has sufficient credits

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

## 🎉 Quick Start: Deploy in 15 Minutes

**Fastest way to deploy:**

1. **Backend (Railway)**:
   - Sign up → New Project → Connect GitHub
   - Add env vars → Deploy
   - Copy backend URL

2. **Frontend (Vercel)**:
   - Sign up → Import Project
   - Add env vars (including backend URL)
   - Deploy

3. **Update Google OAuth**:
   - Add production URLs
   - Test login

Done! Your app is live! 🚀
