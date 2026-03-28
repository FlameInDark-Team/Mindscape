# 🔧 Fix Google OAuth for Production Domain

## Issue
"Google authentication failed. Please try again" on https://www.flameindark.team/

## Root Cause
Your production domain is not added to Google OAuth authorized origins.

---

## ✅ Solution (5 minutes)

### Step 1: Update Google OAuth Console

1. **Go to**: https://console.cloud.google.com/apis/credentials

2. **Find OAuth Client**: `484598065249-o8fm1v9ci8ndpqg6p3ue16kfh9v0b9ns`

3. **Click to Edit**

4. **Add to "Authorized JavaScript origins"**:
   ```
   https://www.flameindark.team
   https://flameindark.team
   https://mindscape-b5oe.onrender.com
   ```
   (Add both with and without www)

5. **Add to "Authorized redirect URIs"**:
   ```
   https://www.flameindark.team
   https://www.flameindark.team/login
   https://www.flameindark.team/admin
   https://www.flameindark.team/dashboard
   https://flameindark.team
   https://flameindark.team/login
   https://flameindark.team/admin
   https://flameindark.team/dashboard
   ```

6. **Click "SAVE"**

7. **Wait 1-2 minutes** for changes to propagate

### Step 2: Update Render Backend CORS

1. **Go to**: https://dashboard.render.com

2. **Click**: Your service `mindscape-b5oe`

3. **Go to**: "Environment" tab

4. **Update `FRONTEND_URL`**:
   ```
   Name: FRONTEND_URL
   Value: https://www.flameindark.team
   ```

5. **Click "Save Changes"**

6. **Wait for redeploy** (1-2 minutes)

### Step 3: Clear Browser Cache

1. Press `Ctrl + Shift + Delete`
2. Select "Cached images and files"
3. Select "Cookies and other site data"
4. Click "Clear data"
5. Close and reopen browser

### Step 4: Test

1. Go to: https://www.flameindark.team/admin
2. Click "Sign in with Google"
3. Select: usertest2021subhradeep@gmail.com
4. Should redirect to admin dashboard ✅

---

## 🎯 Complete OAuth Configuration

After the fix, your Google OAuth should have:

**Authorized JavaScript origins:**
```
http://localhost:5173
http://localhost:3001
https://www.flameindark.team
https://flameindark.team
https://mindscape-b5oe.onrender.com
```

**Authorized redirect URIs:**
```
http://localhost:5173
http://localhost:5173/login
http://localhost:5173/admin
https://www.flameindark.team
https://www.flameindark.team/login
https://www.flameindark.team/admin
https://www.flameindark.team/dashboard
https://flameindark.team
https://flameindark.team/login
https://flameindark.team/admin
https://flameindark.team/dashboard
```

---

## ⚠️ Important Notes

### Why Both www and non-www?
- Some users may access `flameindark.team`
- Others may access `www.flameindark.team`
- Both need to be authorized

### Why Multiple Redirect URIs?
- Different pages may trigger OAuth
- Google needs to know all possible redirect locations
- Better to have all paths authorized

### Wait Time
- Google OAuth changes take 1-2 minutes to propagate
- If it doesn't work immediately, wait and try again
- Clear browser cache if still having issues

---

## 🐛 Still Not Working?

### Check 1: Verify URLs in Google Console
- Make sure URLs are EXACTLY as shown above
- No trailing slashes
- HTTPS (not HTTP) for production
- Both www and non-www versions

### Check 2: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Share any errors you see

### Check 3: Verify Environment Variables
**In Vercel/Your hosting:**
- `VITE_GOOGLE_CLIENT_ID` = `484598065249-o8fm1v9ci8ndpqg6p3ue16kfh9v0b9ns.apps.googleusercontent.com`
- `VITE_API_URL` = `https://mindscape-b5oe.onrender.com`

**In Render:**
- `FRONTEND_URL` = `https://www.flameindark.team`
- `GROQ_API_KEY` = your key
- `ADMIN_EMAIL` = `usertest2021subhradeep@gmail.com`

### Check 4: Test Backend
Open: https://mindscape-b5oe.onrender.com/api/health

Should return:
```json
{
  "status": "ok",
  "timestamp": "...",
  "totalEntries": 0
}
```

---

## 📞 Quick Checklist

- [ ] Added www.flameindark.team to Google OAuth origins
- [ ] Added flameindark.team to Google OAuth origins
- [ ] Added all redirect URIs to Google OAuth
- [ ] Clicked SAVE in Google Console
- [ ] Waited 1-2 minutes
- [ ] Updated FRONTEND_URL in Render
- [ ] Waited for Render redeploy
- [ ] Cleared browser cache
- [ ] Tested on fresh browser/incognito

---

## 🎉 After Fix

Once working, you should be able to:
- ✅ Sign in with Google as regular user
- ✅ Sign in with Google as admin (usertest2021subhradeep@gmail.com)
- ✅ Access all features
- ✅ Use AI chatbot
- ✅ View admin dashboard

---

## 💡 Pro Tip

For future deployments to new domains:
1. Always add the domain to Google OAuth first
2. Add both www and non-www versions
3. Add all redirect URIs
4. Update backend FRONTEND_URL
5. Wait 1-2 minutes
6. Clear cache and test

This will save you troubleshooting time!
