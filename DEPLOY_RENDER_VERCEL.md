# 🚀 Deploy MindScape: Render (Backend) + Vercel (Frontend)

## Overview
- **Backend**: Render (Node.js + SQLite)
- **Frontend**: Vercel (React + Vite)
- **Time**: 20 minutes
- **Cost**: Free tier available

---

## Part 1: Deploy Backend to Render (10 minutes)

### Step 1: Sign Up for Render
1. Go to https://render.com
2. Click "Get Started"
3. Sign up with GitHub (recommended)
4. Authorize Render to access your GitHub

### Step 2: Create New Web Service
1. Click "New +" button (top right)
2. Select "Web Service"
3. Click "Connect account" if needed
4. Find and select your repository: `FlameInDark-Team/Mindscape`
5. Click "Connect"

### Step 3: Configure Web Service

Fill in the following settings:

**Basic Settings:**
- **Name**: `mindscape-backend` (or any name you prefer)
- **Region**: Choose closest to your users (e.g., Oregon, Frankfurt)
- **Branch**: `main`
- **Root Directory**: Leave empty (use repository root)
- **Runtime**: `Node`

**Build & Deploy:**
- **Build Command**: `npm install`
- **Start Command**: `node server/server.js`

**Instance Type:**
- Select **"Free"** (perfect for testing and small projects)
- Note: Free tier has 750 hours/month (enough for 24/7 operation)

### Step 4: Add Environment Variables

Scroll down to "Environment Variables" section and click "Add Environment Variable"

Add these variables one by one:

```
GROQ_API_KEY
Value: your_groq_api_key_here
```

```
ADMIN_EMAIL
Value: usertest2021subhradeep@gmail.com
```

```
PORT
Value: 3001
```

```
NODE_ENV
Value: production
```

**Important**: Click "Add" after each variable!

### Step 5: Deploy

1. Scroll to bottom
2. Click "Create Web Service"
3. Render will start building and deploying
4. Wait 3-5 minutes for deployment to complete

### Step 6: Get Your Backend URL

1. Once deployed, you'll see "Your service is live 🎉"
2. Copy your backend URL (looks like: `https://mindscape-backend.onrender.com`)
3. **Save this URL** - you'll need it for frontend deployment

### Step 7: Test Backend

Open your backend URL in browser:
```
https://mindscape-backend.onrender.com/api/health
```

You should see:
```json
{
  "status": "ok",
  "timestamp": "2026-03-28T...",
  "totalEntries": 0
}
```

✅ Backend is live!

---

## Part 2: Deploy Frontend to Vercel (10 minutes)

### Step 1: Sign Up for Vercel
1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub

### Step 2: Import Project
1. Click "Add New..." button
2. Select "Project"
3. Find your repository: `FlameInDark-Team/Mindscape`
4. Click "Import"

### Step 3: Configure Project

Vercel will auto-detect settings, verify they match:

**Framework Preset:**
- Should auto-detect as "Vite"
- If not, select "Vite" from dropdown

**Root Directory:**
- Leave as `./` (repository root)

**Build and Output Settings:**
- **Build Command**: `npm run build` (auto-filled)
- **Output Directory**: `dist` (auto-filled)
- **Install Command**: `npm install` (auto-filled)

### Step 4: Add Environment Variables

Click "Environment Variables" section and add:

**Variable 1:**
```
Name: VITE_GOOGLE_CLIENT_ID
Value: 484598065249-o8fm1v9ci8ndpqg6p3ue16kfh9v0b9ns.apps.googleusercontent.com
```

**Variable 2:**
```
Name: VITE_API_URL
Value: https://mindscape-backend.onrender.com
```
(Replace with YOUR actual Render backend URL from Part 1, Step 6)

**Important**: Make sure to use your actual Render URL!

### Step 5: Deploy

1. Click "Deploy"
2. Vercel will build and deploy your frontend
3. Wait 2-3 minutes
4. You'll see "Congratulations! 🎉"

### Step 6: Get Your Frontend URL

1. Copy your Vercel URL (looks like: `https://mindscape-abc123.vercel.app`)
2. You can also set a custom domain later
3. **Save this URL** - you'll need it for Google OAuth

### Step 7: Test Frontend

1. Open your Vercel URL in browser
2. You should see the MindScape landing page
3. Try navigating to different pages

---

## Part 3: Update Backend CORS (5 minutes)

### Step 1: Add Frontend URL to Render

1. Go back to Render dashboard
2. Click on your `mindscape-backend` service
3. Go to "Environment" tab
4. Click "Add Environment Variable"
5. Add:
   ```
   Name: FRONTEND_URL
   Value: https://mindscape-abc123.vercel.app
   ```
   (Use YOUR actual Vercel URL)
6. Click "Save Changes"
7. Render will automatically redeploy (wait 1-2 minutes)

---

## Part 4: Update Google OAuth (5 minutes)

### Step 1: Go to Google Cloud Console
1. Open https://console.cloud.google.com/apis/credentials
2. Sign in with your Google account

### Step 2: Edit OAuth Client
1. Find your OAuth 2.0 Client ID: `484598065249-o8fm1v9ci8ndpqg6p3ue16kfh9v0b9ns`
2. Click on it to edit

### Step 3: Add Production URLs

**Authorized JavaScript origins:**
Click "+ ADD URI" and add these URLs:
```
https://mindscape-abc123.vercel.app
https://mindscape-backend.onrender.com
```
(Replace with YOUR actual URLs)

**Authorized redirect URIs:**
Click "+ ADD URI" and add these URLs:
```
https://mindscape-abc123.vercel.app
https://mindscape-abc123.vercel.app/login
https://mindscape-abc123.vercel.app/admin
https://mindscape-abc123.vercel.app/dashboard
```
(Replace with YOUR actual Vercel URL)

### Step 4: Save Changes
1. Scroll to bottom
2. Click "SAVE"
3. Wait 1-2 minutes for changes to propagate

---

## Part 5: Final Testing (5 minutes)

### Test Checklist

Visit your Vercel URL and test:

1. **Landing Page**
   - [ ] Page loads correctly
   - [ ] All sections visible
   - [ ] Navigation works

2. **Anonymous Check-In**
   - [ ] Go to /checkin
   - [ ] Submit a mood entry
   - [ ] Check /trends to see the entry

3. **User Registration**
   - [ ] Go to /login
   - [ ] Click "Sign up"
   - [ ] Register with email/password
   - [ ] Should redirect to dashboard

4. **Google Sign-In (User)**
   - [ ] Go to /login
   - [ ] Click "Sign in with Google"
   - [ ] Select any Google account
   - [ ] Should redirect to dashboard

5. **AI Chatbot**
   - [ ] Login as user
   - [ ] Go to /dashboard
   - [ ] Click "Open Chat"
   - [ ] Send a message
   - [ ] AI should respond

6. **Admin Login**
   - [ ] Go to /admin
   - [ ] Click "Sign in with Google"
   - [ ] Sign in with: usertest2021subhradeep@gmail.com
   - [ ] Should redirect to admin dashboard

7. **Admin Dashboard**
   - [ ] Check campus mood metrics
   - [ ] View department breakdown
   - [ ] Check alerts system

8. **Mobile Responsive**
   - [ ] Open on mobile device
   - [ ] Test navigation menu
   - [ ] Test all features

---

## 🎉 Deployment Complete!

### Your Live URLs

**Frontend (Vercel):**
```
https://your-app.vercel.app
```

**Backend (Render):**
```
https://mindscape-backend.onrender.com
```

**GitHub Repository:**
```
https://github.com/FlameInDark-Team/Mindscape
```

---

## 📊 Platform Features

### Render (Backend)
- ✅ Free tier: 750 hours/month
- ✅ Automatic SSL certificates
- ✅ Auto-deploy on git push
- ✅ Built-in logging and monitoring
- ✅ SQLite database persistence
- ✅ Environment variable management

### Vercel (Frontend)
- ✅ Unlimited bandwidth (fair use)
- ✅ Automatic SSL certificates
- ✅ Auto-deploy on git push
- ✅ Edge network (fast globally)
- ✅ Preview deployments for PRs
- ✅ Analytics dashboard

---

## 🔄 Updating Your Deployment

### Update Backend
1. Push changes to GitHub
2. Render auto-deploys from `main` branch
3. Check deployment logs in Render dashboard

### Update Frontend
1. Push changes to GitHub
2. Vercel auto-deploys from `main` branch
3. Check deployment logs in Vercel dashboard

### Manual Redeploy
**Render:**
- Go to service → Click "Manual Deploy" → Select branch

**Vercel:**
- Go to project → Deployments → Click "Redeploy"

---

## ⚠️ Important Notes

### Render Free Tier Limitations
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month (enough for 24/7 if only one service)
- Upgrade to paid plan ($7/month) for always-on

### Database Persistence
- Render provides persistent disk storage
- SQLite database is saved automatically
- Data persists across deployments
- Consider PostgreSQL for production scale

### Environment Variables
- Never commit `.env` to GitHub
- Always use platform environment variable settings
- Update variables in Render/Vercel dashboards
- Redeploy after changing variables

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to backend"
**Solution:**
1. Check VITE_API_URL in Vercel matches your Render URL
2. Verify Render service is running (check dashboard)
3. Check Render logs for errors
4. Test backend health endpoint directly

### Issue: "CORS error"
**Solution:**
1. Verify FRONTEND_URL is set in Render
2. Check it matches your Vercel URL exactly
3. Redeploy backend after adding variable
4. Clear browser cache

### Issue: "Google OAuth not working"
**Solution:**
1. Verify production URLs in Google Console
2. Wait 1-2 minutes after adding URLs
3. Clear browser cache and cookies
4. Check VITE_GOOGLE_CLIENT_ID in Vercel

### Issue: "Backend is slow on first request"
**Solution:**
- This is normal for Render free tier
- Service spins down after 15 min inactivity
- First request wakes it up (30-60 seconds)
- Upgrade to paid plan for always-on

### Issue: "AI Chatbot not responding"
**Solution:**
1. Check GROQ_API_KEY in Render environment
2. View Render logs for API errors
3. Verify Groq API key is valid and has credits
4. Test backend /api/health endpoint

### Issue: "Database not persisting"
**Solution:**
1. Render provides persistent disk by default
2. Check Render dashboard → Service → Disk
3. Verify database path is correct in code
4. Check Render logs for database errors

---

## 💰 Cost Breakdown

### Free Tier (Recommended for Testing)
- **Render**: Free (750 hours/month)
- **Vercel**: Free (unlimited for personal)
- **Total**: $0/month

### Paid Tier (Recommended for Production)
- **Render**: $7/month (always-on, more resources)
- **Vercel**: Free (or $20/month for team features)
- **Total**: $7-27/month

---

## 🔒 Security Checklist

- [ ] All API keys in environment variables (not in code)
- [ ] HTTPS enabled (automatic on both platforms)
- [ ] CORS configured correctly
- [ ] Google OAuth restricted to production URLs
- [ ] Admin access restricted to specific email
- [ ] Database backups configured
- [ ] Error logging enabled

---

## 📈 Monitoring & Analytics

### Render Monitoring
1. Go to service dashboard
2. View "Metrics" tab for:
   - CPU usage
   - Memory usage
   - Request count
   - Response times

### Vercel Analytics
1. Go to project dashboard
2. View "Analytics" tab for:
   - Page views
   - Unique visitors
   - Performance metrics
   - Geographic distribution

---

## 🎯 Next Steps

1. **Custom Domain** (Optional)
   - Add custom domain in Vercel
   - Update Google OAuth with new domain
   - Free SSL included

2. **Database Upgrade** (For Production)
   - Consider PostgreSQL for better performance
   - Render offers managed PostgreSQL
   - Easy migration from SQLite

3. **Monitoring** (Recommended)
   - Set up error tracking (Sentry)
   - Configure uptime monitoring
   - Set up email alerts

4. **Backups** (Important)
   - Set up automated database backups
   - Export data regularly
   - Test restore procedures

---

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **GitHub Issues**: https://github.com/FlameInDark-Team/Mindscape/issues
- **Google OAuth**: https://console.cloud.google.com

---

## ✅ Deployment Summary

**Time Spent**: ~20 minutes
**Platforms Used**: Render + Vercel
**Cost**: Free tier
**Status**: ✅ Live and accessible worldwide!

**Your app is now deployed and ready to use!** 🎉

Share your Vercel URL with your team and start using MindScape!
