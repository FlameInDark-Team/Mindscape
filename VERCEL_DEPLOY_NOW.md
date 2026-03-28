# 🚀 Deploy Frontend to Vercel - Quick Guide

## ✅ Your Backend is Live!

**Backend URL**: https://mindscape-b5oe.onrender.com

I tested it and it's working perfectly! ✅

---

## 📋 Deploy to Vercel (5 minutes)

### Step 1: Go to Vercel
Open: https://vercel.com

### Step 2: Sign Up
- Click "Sign Up"
- Choose "Continue with GitHub"
- Authorize Vercel

### Step 3: Import Project
1. Click "Add New..." button (top right)
2. Select "Project"
3. Find: `FlameInDark-Team/Mindscape`
4. Click "Import"

### Step 4: Configure (IMPORTANT!)

Vercel will auto-detect settings. Verify:
- **Framework Preset**: Vite ✅
- **Root Directory**: `./` ✅
- **Build Command**: `npm run build` ✅
- **Output Directory**: `dist` ✅

### Step 5: Add Environment Variables

Click "Environment Variables" and add these TWO variables:

**Variable 1:**
```
Name: VITE_API_URL
Value: https://mindscape-b5oe.onrender.com
```
⚠️ **IMPORTANT**: Copy this EXACTLY (no trailing slash)

**Variable 2:**
```
Name: VITE_GOOGLE_CLIENT_ID  
Value: 484598065249-o8fm1v9ci8ndpqg6p3ue16kfh9v0b9ns.apps.googleusercontent.com
```

### Step 6: Deploy!
1. Click "Deploy" button
2. Wait 2-3 minutes ⏳
3. You'll see "Congratulations! 🎉"

### Step 7: Copy Your Vercel URL
You'll get a URL like:
```
https://mindscape-abc123.vercel.app
```

**SAVE THIS URL** - you'll need it for the next steps!

---

## 🔧 After Vercel Deployment

### Step 1: Update Render Backend (2 minutes)

1. Go to: https://dashboard.render.com
2. Click on your service: `mindscape-b5oe`
3. Click "Environment" tab
4. Click "Add Environment Variable"
5. Add:
   ```
   Name: FRONTEND_URL
   Value: https://your-vercel-url.vercel.app
   ```
   (Replace with YOUR actual Vercel URL from Step 7 above)
6. Click "Save Changes"
7. Wait for redeploy (1-2 minutes)

### Step 2: Update Google OAuth (3 minutes)

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find: `484598065249-o8fm1v9ci8ndpqg6p3ue16kfh9v0b9ns`
3. Click to edit

**Add to "Authorized JavaScript origins":**
```
https://mindscape-b5oe.onrender.com
https://your-vercel-url.vercel.app
```

**Add to "Authorized redirect URIs":**
```
https://your-vercel-url.vercel.app
https://your-vercel-url.vercel.app/login
https://your-vercel-url.vercel.app/admin
```

4. Click "SAVE"
5. Wait 1-2 minutes

---

## ✅ Testing (2 minutes)

### Test 1: Open Your Vercel URL
Should see the MindScape landing page

### Test 2: Test Anonymous Check-In
1. Go to: `https://your-vercel-url.vercel.app/checkin`
2. Select a mood
3. Submit
4. Go to `/trends` - should see your entry

### Test 3: Test User Login
1. Go to `/login`
2. Register with email/password
3. Should redirect to dashboard

### Test 4: Test Google Sign-In
1. Go to `/login`
2. Click "Sign in with Google"
3. Select any Google account
4. Should redirect to dashboard

### Test 5: Test AI Chatbot
1. Login as user
2. Go to `/dashboard`
3. Click "Open Chat"
4. Send: "I'm feeling stressed"
5. Should get AI response

### Test 6: Test Admin
1. Go to `/admin`
2. Click "Sign in with Google"
3. Use: usertest2021subhradeep@gmail.com
4. Should see admin dashboard

---

## 🎉 You're Done!

Once all tests pass, your app is fully deployed and live!

### Your Live URLs:
- **Frontend**: https://your-vercel-url.vercel.app
- **Backend**: https://mindscape-b5oe.onrender.com
- **GitHub**: https://github.com/FlameInDark-Team/Mindscape

### Share with Your Team:
Send them your Vercel URL and they can start using MindScape!

---

## 📱 Bonus: Custom Domain (Optional)

Want a custom domain like `mindscape.yourdomain.com`?

1. Go to Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS setup instructions
5. Update Google OAuth with new domain
6. Free SSL included!

---

## 🆘 Need Help?

### Backend not responding?
- Check Render dashboard for errors
- View logs in Render
- Verify environment variables are set

### Frontend not connecting to backend?
- Check VITE_API_URL in Vercel
- Make sure it's: `https://mindscape-b5oe.onrender.com`
- No trailing slash!

### Google OAuth not working?
- Wait 1-2 minutes after adding URLs
- Clear browser cache
- Check URLs match exactly

### CORS errors?
- Make sure FRONTEND_URL is set in Render
- Must match your Vercel URL exactly
- Redeploy backend after adding

---

## 💡 Pro Tips

1. **Bookmark Your Dashboards**:
   - Render: https://dashboard.render.com
   - Vercel: https://vercel.com/dashboard
   - Google Console: https://console.cloud.google.com

2. **Monitor Your App**:
   - Check Render logs for backend errors
   - Check Vercel analytics for traffic
   - Set up error tracking

3. **Auto-Deploy**:
   - Both platforms auto-deploy on git push
   - Push to `main` branch to update
   - Check deployment status in dashboards

---

## 🚀 Ready to Deploy?

Follow the steps above and you'll be live in 5 minutes!

**Start here**: https://vercel.com

Good luck! 🎉
