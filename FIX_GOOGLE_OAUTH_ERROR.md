# 🔧 Fix Google OAuth Error 401: invalid_client

## Error Details
- **Error**: Access blocked: Authorization Error
- **Error Code**: 401: invalid_client
- **Message**: no registered origin

## Root Cause
The Google Client ID exists, but `http://localhost:5173` is not registered as an authorized JavaScript origin in Google Cloud Console.

## ✅ Solution: Add Authorized Origins

### Step 1: Go to Google Cloud Console
1. Open: https://console.cloud.google.com/apis/credentials
2. Sign in with your Google account

### Step 2: Find Your OAuth Client
1. Look for your OAuth 2.0 Client ID in the list
2. The Client ID should be: `484598065249-o8fm1v9ci8ndpqg6p3ue16kfh9v0b9ns.apps.googleusercontent.com`
3. Click on the client name to edit it

### Step 3: Add Authorized JavaScript Origins
1. Scroll down to **"Authorized JavaScript origins"** section
2. Click **"+ ADD URI"**
3. Add these URIs:
   ```
   http://localhost:5173
   http://localhost:3001
   ```
4. Click **"SAVE"** at the bottom

### Step 4: Add Authorized Redirect URIs (Optional but Recommended)
1. Scroll to **"Authorized redirect URIs"** section
2. Click **"+ ADD URI"**
3. Add:
   ```
   http://localhost:5173
   http://localhost:5173/login
   http://localhost:5173/admin
   ```
4. Click **"SAVE"**

### Step 5: Wait and Test
1. Wait 1-2 minutes for changes to propagate
2. Clear your browser cache (Ctrl+Shift+Delete)
3. Restart the servers (already done)
4. Try Google Sign-In again

## 🎯 Quick Fix Commands

If you want to restart servers after the Google Console changes:

```bash
# Already done, but if needed:
# Stop servers (Ctrl+C)
# Then restart:
node server/server.js  # Terminal 1
npm run dev            # Terminal 2
```

## 📸 Visual Guide

### What to Add in Google Console:

**Authorized JavaScript origins:**
```
http://localhost:5173
http://localhost:3001
```

**Authorized redirect URIs:**
```
http://localhost:5173
http://localhost:5173/login
http://localhost:5173/admin
```

## ⚠️ Common Mistakes to Avoid

❌ Don't add `https://` - use `http://` for localhost
❌ Don't add trailing slashes: `http://localhost:5173/` (wrong)
✅ Correct format: `http://localhost:5173` (right)
❌ Don't forget the port number: `:5173`

## 🔄 Alternative: Create New OAuth Client

If you can't edit the existing client, create a new one:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click **"+ CREATE CREDENTIALS"**
3. Select **"OAuth client ID"**
4. Application type: **Web application**
5. Name: `MindScape Local Development`
6. Authorized JavaScript origins:
   - `http://localhost:5173`
   - `http://localhost:3001`
7. Authorized redirect URIs:
   - `http://localhost:5173`
8. Click **"CREATE"**
9. Copy the new Client ID
10. Update `.env` file:
    ```env
    VITE_GOOGLE_CLIENT_ID=your_new_client_id_here
    ```
11. Restart servers

## 🧪 Test After Fix

1. Go to http://localhost:5173/login
2. Click "Sign in with Google"
3. Should open Google account selector (no error)
4. Select your account
5. Should redirect to dashboard

## 📞 Still Having Issues?

### Check These:
1. ✅ Client ID is correct in .env
2. ✅ Authorized origins include `http://localhost:5173`
3. ✅ Servers are restarted after .env changes
4. ✅ Browser cache is cleared
5. ✅ Waited 1-2 minutes after Google Console changes

### Debug Steps:
1. Open browser console (F12)
2. Look for detailed error messages
3. Check Network tab for failed requests
4. Verify .env is loaded (check server startup logs)

## 💡 Pro Tip

For production deployment, you'll need to add your production domain:
```
https://yourdomain.com
```

But for now, just add the localhost URLs to get it working locally.

---

## Summary

**The fix is simple:**
1. Go to Google Cloud Console
2. Edit your OAuth client
3. Add `http://localhost:5173` to Authorized JavaScript origins
4. Save and wait 1-2 minutes
5. Clear browser cache
6. Try again

This should resolve the "Error 401: invalid_client" issue! 🎉
