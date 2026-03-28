# Google OAuth Setup Guide

## Overview
MindScape now supports Google Sign-In for both users and admin access.

## Features
- **User Login**: Any Google account can sign in
- **Admin Access**: Only `usertest2021subhradeep@gmail.com` can access admin panel
- **No Passwords**: Secure authentication via Google OAuth 2.0

## Setup Instructions

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Configure OAuth consent screen if prompted:
   - User Type: External
   - App name: MindScape
   - User support email: Your email
   - Developer contact: Your email
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: MindScape Web Client
   - Authorized JavaScript origins:
     - `http://localhost:5173`
     - `http://localhost:3001`
   - Authorized redirect URIs:
     - `http://localhost:5173`
7. Click **Create**
8. Copy the **Client ID** (looks like: `xxxxx.apps.googleusercontent.com`)

### Step 2: Configure Environment Variables

1. Open `.env` file in the project root
2. Replace `YOUR_GOOGLE_CLIENT_ID_HERE` with your actual Client ID:

```env
VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
```

3. Verify admin email is set:
```env
ADMIN_EMAIL=usertest2021subhradeep@gmail.com
```

### Step 3: Restart Servers

Stop and restart both servers to load the new environment variables:

```bash
# Stop current servers (Ctrl+C)
# Then restart:
node server/server.js
npm run dev
```

## How It Works

### User Authentication Flow
1. User clicks "Sign in with Google" button
2. Google OAuth popup appears
3. User selects Google account
4. Backend receives Google token
5. Backend creates/updates user in database
6. User redirected to dashboard

### Admin Authentication Flow
1. Admin clicks "Sign in with Google" button
2. Google OAuth popup appears
3. Admin signs in with `usertest2021subhradeep@gmail.com`
4. Backend verifies email matches admin email
5. If match: Admin redirected to dashboard
6. If no match: Access denied error shown

## Security Features

- **Email Verification**: Admin email is hardcoded and verified server-side
- **Token-Based Auth**: Secure tokens generated for sessions
- **No Password Storage**: Google handles authentication
- **One-Tap Sign-In**: Faster login experience for returning users

## Testing

### Test User Login
1. Go to http://localhost:5173/login
2. Click "Sign in with Google"
3. Sign in with any Google account
4. Should redirect to /dashboard

### Test Admin Login
1. Go to http://localhost:5173/admin
2. Click "Sign in with Google"
3. Sign in with `usertest2021subhradeep@gmail.com`
4. Should redirect to /admin/dashboard
5. Try with different email - should show access denied

## Troubleshooting

### "Google Sign-In failed"
- Check if VITE_GOOGLE_CLIENT_ID is set correctly in .env
- Verify servers are restarted after .env changes
- Check browser console for detailed errors

### "Access denied" for admin
- Verify you're signing in with exact email: `usertest2021subhradeep@gmail.com`
- Check ADMIN_EMAIL in .env matches

### "Unauthorized JavaScript origin"
- Add `http://localhost:5173` to authorized origins in Google Console
- Wait a few minutes for changes to propagate

## API Endpoints

### User Google Auth
```
POST /api/user/google-auth
Body: { token, email, name, picture }
Response: { success, token, email, name, picture, userId }
```

### Admin Google Auth
```
POST /api/admin/google-auth
Body: { token, email, name }
Response: { success, token, email, name }
```

## Production Deployment

For production, update authorized origins and redirect URIs:
1. Add your production domain to Google Console
2. Update .env with production URLs
3. Ensure HTTPS is enabled

## Notes

- Google OAuth requires HTTPS in production
- Client ID is public and safe to expose
- Never expose Client Secret in frontend code
- Admin email can be changed in .env file
