# 🚀 Your Deployment Configuration

## Backend (Render) ✅ DEPLOYED

**URL**: https://mindscape-b5oe.onrender.com

### Test Backend
Open this URL to verify backend is working:
```
https://mindscape-b5oe.onrender.com/api/health
```

You should see:
```json
{
  "status": "ok",
  "timestamp": "...",
  "totalEntries": 0
}
```

---

## Frontend (Vercel) - NEXT STEP

### Step 1: Deploy to Vercel

1. **Go to**: https://vercel.com
2. **Sign up** with GitHub
3. **Click**: "Add New..." → "Project"
4. **Import**: FlameInDark-Team/Mindscape
5. **Configure**:
   - Framework: Vite (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Step 2: Add Environment Variables in Vercel

Add these EXACT variables:

**Variable 1:**
```
Name: VITE_API_URL
Value: https://mindscape-b5oe.onrender.com
```

**Variable 2:**
```
Name: VITE_GOOGLE_CLIENT_ID
Value: 484598065249-o8fm1v9ci8ndpqg6p3ue16kfh9v0b9ns.apps.googleusercontent.com
```

### Step 3: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes
3. Copy your Vercel URL (e.g., `https://mindscape-xyz.vercel.app`)

---

## After Vercel Deployment

### Step 1: Update Render Backend

1. Go to Render dashboard: https://dashboard.render.com
2. Click on your `mindscape-b5oe` service
3. Go to "Environment" tab
4. Add new environment variable:
   ```
   Name: FRONTEND_URL
   Value: https://your-vercel-url.vercel.app
   ```
   (Replace with YOUR actual Vercel URL)
5. Click "Save Changes"
6. Wait for automatic redeploy (1-2 minutes)

### Step 2: Update Google OAuth

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find OAuth Client: `484598065249-o8fm1v9ci8ndpqg6p3ue16kfh9v0b9ns`
3. Click to edit

**Add Authorized JavaScript origins:**
```
https://mindscape-b5oe.onrender.com
https://your-vercel-url.vercel.app
```

**Add Authorized redirect URIs:**
```
https://your-vercel-url.vercel.app
https://your-vercel-url.vercel.app/login
https://your-vercel-url.vercel.app/admin
https://your-vercel-url.vercel.app/dashboard
```

4. Click "SAVE"
5. Wait 1-2 minutes

---

## Testing Checklist

Once both are deployed, test:

### 1. Backend Health
```
https://mindscape-b5oe.onrender.com/api/health
```
Should return JSON with status "ok"

### 2. Frontend Pages
- [ ] Landing page loads
- [ ] /checkin page works
- [ ] /login page loads
- [ ] /admin page loads

### 3. Anonymous Check-In
- [ ] Go to /checkin
- [ ] Submit mood entry
- [ ] View in /trends

### 4. User Registration
- [ ] Register with email/password
- [ ] Login works
- [ ] Dashboard accessible

### 5. Google Sign-In
- [ ] User login with Google works
- [ ] Admin login with usertest2021subhradeep@gmail.com works

### 6. AI Chatbot
- [ ] Login as user
- [ ] Open chatbot
- [ ] Send message
- [ ] Receive response

---

## Quick Reference

### Your URLs
- **Backend**: https://mindscape-b5oe.onrender.com
- **Frontend**: (Add after Vercel deployment)
- **GitHub**: https://github.com/FlameInDark-Team/Mindscape

### Environment Variables

**Render (Backend):**
```
GROQ_API_KEY=your_groq_api_key
ADMIN_EMAIL=usertest2021subhradeep@gmail.com
PORT=3001
NODE_ENV=production
FRONTEND_URL=your_vercel_url
```

**Vercel (Frontend):**
```
VITE_API_URL=https://mindscape-b5oe.onrender.com
VITE_GOOGLE_CLIENT_ID=484598065249-o8fm1v9ci8ndpqg6p3ue16kfh9v0b9ns.apps.googleusercontent.com
```

---

## Troubleshooting

### Backend is slow on first request
- Normal for Render free tier
- Service spins down after 15 min inactivity
- First request takes 30-60 seconds to wake up

### CORS errors
- Make sure FRONTEND_URL is set in Render
- Must match your Vercel URL exactly
- Redeploy backend after adding variable

### Google OAuth not working
- Verify URLs in Google Console
- Wait 1-2 minutes after adding URLs
- Clear browser cache

---

## Next Steps

1. ✅ Backend deployed to Render
2. ⏳ Deploy frontend to Vercel (follow Step 1 above)
3. ⏳ Update Render with Vercel URL
4. ⏳ Update Google OAuth
5. ⏳ Test everything

**You're almost done! Just deploy to Vercel now!** 🚀
