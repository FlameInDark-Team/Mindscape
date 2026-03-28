# 🚀 Quick Start: Google Authentication

## ⚠️ IMPORTANT: Setup Required

The Google Sign-In buttons won't work until you complete this setup!

## 5-Minute Setup

### Step 1: Get Google Client ID (3 minutes)

1. Open: https://console.cloud.google.com/apis/credentials
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. If prompted, configure consent screen:
   - App name: `MindScape`
   - User support email: Your email
   - Click Save
4. Create OAuth Client:
   - Application type: **Web application**
   - Name: `MindScape`
   - Authorized JavaScript origins: `http://localhost:5173`
   - Click **Create**
5. **Copy the Client ID** (looks like: `123456-abc.apps.googleusercontent.com`)

### Step 2: Update .env File (1 minute)

1. Open `.env` file in project root
2. Find this line:
   ```
   VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
   ```
3. Replace with your actual Client ID:
   ```
   VITE_GOOGLE_CLIENT_ID=123456-abc.apps.googleusercontent.com
   ```
4. Save the file

### Step 3: Restart Servers (1 minute)

In your terminal:
```bash
# Stop servers (Ctrl+C if running)
# Then start:
node server/server.js
npm run dev
```

## ✅ You're Done!

Now test it:

### Test User Login
- Go to: http://localhost:5173/login
- Click "Sign in with Google"
- Sign in with ANY Google account
- You'll be redirected to your dashboard

### Test Admin Login
- Go to: http://localhost:5173/admin
- Click "Sign in with Google"
- Sign in with: `usertest2021subhradeep@gmail.com`
- You'll be redirected to admin dashboard

### Test Admin Security
- Go to: http://localhost:5173/admin
- Click "Sign in with Google"
- Sign in with a DIFFERENT email
- You'll see: "Access denied"

## 🎉 Features

✅ **User Login**: Any Google account works
✅ **Admin Login**: Only usertest2021subhradeep@gmail.com
✅ **No Passwords**: Secure Google authentication
✅ **One-Tap Sign-In**: Fast login for returning users
✅ **Profile Pictures**: Automatically imported from Google

## 🔧 Troubleshooting

### "Google Sign-In button doesn't appear"
- Check if VITE_GOOGLE_CLIENT_ID is set in .env
- Make sure you restarted the servers after updating .env
- Check browser console for errors

### "Popup blocked"
- Allow popups for localhost:5173
- Try clicking the button again

### "Invalid Client ID"
- Double-check the Client ID in .env
- Make sure there are no extra spaces
- Verify you copied the entire Client ID

### "Access denied" for admin
- You MUST use exactly: usertest2021subhradeep@gmail.com
- No other email will work (this is by design)

## 📚 More Info

- Full setup guide: `GOOGLE_OAUTH_SETUP.md`
- Implementation details: `GOOGLE_AUTH_IMPLEMENTATION.md`

## 🆘 Need Help?

If you get stuck:
1. Check the browser console (F12) for errors
2. Check the server terminal for errors
3. Verify .env file has correct Client ID
4. Make sure servers are restarted after .env changes
