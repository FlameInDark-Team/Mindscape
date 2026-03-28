# 🤖 Floating AI Chatbot Feature

## Overview

A floating AI chatbot is now available on ALL pages of MindScape, accessible to everyone - no login required!

## ✨ Features

### Accessibility
- ✅ **Available to all users** - Anonymous and logged-in users
- ✅ **No authentication required** - Anyone can use it
- ✅ **Appears on all pages** - Landing, Check-in, Trends, Resources, etc.
- ✅ **Floating button** - Always accessible in bottom-right corner

### Functionality
- ✅ **AI-powered responses** - Uses Groq's LLaMA 3.3 70B model
- ✅ **Mental health support** - Specialized for college student wellness
- ✅ **Conversation history** - Remembers last 10 messages
- ✅ **Quick prompts** - Pre-defined common questions
- ✅ **Crisis detection** - Provides emergency resources when needed
- ✅ **Minimize/Maximize** - Can be minimized while keeping conversation
- ✅ **Mobile responsive** - Works perfectly on all devices

### UI/UX
- ✅ **Smooth animations** - Framer Motion powered
- ✅ **Beautiful design** - Matches MindScape theme
- ✅ **Easy to use** - Intuitive interface
- ✅ **Unobtrusive** - Doesn't block content
- ✅ **Theme-aware** - Works with light/dark mode

## 🎯 How It Works

### For Users

1. **Open Chatbot**:
   - Click the floating AI icon (bottom-right corner)
   - Chatbot window opens

2. **Start Conversation**:
   - Type a message or use quick prompts
   - AI responds with supportive advice

3. **Continue Chatting**:
   - Have a natural conversation
   - AI remembers context from previous messages

4. **Minimize/Close**:
   - Minimize to keep conversation but save space
   - Close when done (conversation is cleared)

### Quick Prompts

Pre-defined prompts for common concerns:
- 😰 "I'm feeling stressed"
- 💪 "I need motivation"
- 😟 "Help with anxiety"
- 😴 "Sleep tips"

## 🔧 Technical Implementation

### Frontend Component

**File**: `src/components/FloatingChatbot.jsx`

**Features**:
- React component with hooks
- Framer Motion animations
- Message history management
- API integration
- Responsive design

### Backend Endpoint

**Endpoint**: `POST /api/chat/anonymous`

**Features**:
- No authentication required
- Groq API integration
- Conversation history support
- Error handling
- Crisis detection

### API Configuration

**File**: `src/config.js`

Automatically uses correct API URL:
- Development: `http://localhost:3001`
- Production: Your Render backend URL

## 📊 Comparison: Anonymous vs Authenticated Chat

| Feature | Anonymous Chatbot | User Dashboard Chatbot |
|---------|------------------|----------------------|
| **Access** | All users | Logged-in users only |
| **Location** | Floating on all pages | Dashboard page only |
| **Authentication** | Not required | Required |
| **History Persistence** | Session only | Could be saved to DB |
| **Endpoint** | `/api/chat/anonymous` | `/api/chat` |

## 🚀 Deployment

### Backend (Render)

The anonymous chat endpoint is already deployed:
```
https://mindscape-b5oe.onrender.com/api/chat/anonymous
```

**Environment Variables Required**:
- `GROQ_API_KEY` - Your Groq API key

### Frontend (Vercel/Your hosting)

The FloatingChatbot component is automatically included in all pages.

**Environment Variables Required**:
- `VITE_API_URL` - Your backend URL

## 🧪 Testing

### Test Anonymous Chatbot

1. **Open any page** on your website
2. **Look for floating AI button** (bottom-right)
3. **Click to open** chatbot
4. **Send a message**: "I'm feeling stressed"
5. **Verify AI responds** with supportive advice

### Test on Different Pages

- ✅ Landing page
- ✅ Check-in page
- ✅ Trends page
- ✅ Resources page
- ✅ Login page
- ✅ Admin page

### Test Features

- [ ] Floating button appears
- [ ] Chatbot opens on click
- [ ] Welcome message displays
- [ ] Quick prompts work
- [ ] Custom messages work
- [ ] AI responds appropriately
- [ ] Minimize/maximize works
- [ ] Close button works
- [ ] Mobile responsive
- [ ] Theme compatibility

## 💡 Use Cases

### For Anonymous Users
- Get mental health support without creating account
- Ask questions about stress management
- Learn coping strategies
- Get resource recommendations
- Access crisis information

### For All Users
- Quick access to AI support from any page
- Don't need to navigate to dashboard
- Can chat while browsing other content
- Immediate help when needed

## 🔒 Privacy & Security

### Data Handling
- ✅ No user identification required
- ✅ Conversations not stored in database
- ✅ Session-based only (cleared on close)
- ✅ No personal data collected
- ✅ HTTPS encrypted communication

### Crisis Detection
- AI detects crisis keywords
- Provides emergency resources:
  - 988 (Suicide & Crisis Lifeline)
  - 741741 (Crisis Text Line)
  - Campus counseling services
  - Emergency room information

## 📱 Mobile Experience

### Responsive Design
- Adapts to screen size
- Touch-optimized buttons
- Scrollable message area
- Keyboard-friendly input
- Safe area insets for notched devices

### Mobile-Specific Features
- Full-width on small screens
- Optimized touch targets (44px minimum)
- Smooth animations
- Auto-scroll to latest message

## 🎨 Customization

### Styling
The chatbot uses CSS variables from your theme:
- `--primary` - Header gradient
- `--secondary` - Header gradient
- `--surface-container-*` - Background colors
- `--on-surface` - Text colors

### Positioning
Default: Bottom-right corner
Can be customized in `FloatingChatbot.jsx`:
```javascript
style={{
  position: 'fixed',
  bottom: '2rem',  // Change this
  right: '2rem',   // Change this
  ...
}}
```

## 🐛 Troubleshooting

### Chatbot not appearing
- Check if FloatingChatbot is imported in App.jsx
- Verify component is rendered
- Check browser console for errors

### AI not responding
- Verify GROQ_API_KEY is set in backend
- Check backend logs for API errors
- Test backend endpoint directly
- Verify Groq API key is valid

### CORS errors
- Ensure FRONTEND_URL is set in Render
- Check CORS configuration in server.js
- Verify API_URL in frontend config

### Slow responses
- Normal for Groq API (2-5 seconds)
- Check internet connection
- Verify backend is running

## 📈 Future Enhancements

Potential improvements:
- [ ] Save conversation history for logged-in users
- [ ] Export chat transcript
- [ ] Voice input/output
- [ ] Multi-language support
- [ ] Sentiment analysis
- [ ] Usage analytics
- [ ] Custom quick prompts
- [ ] Typing indicators
- [ ] Read receipts

## 🎉 Benefits

### For Users
- ✅ Immediate access to mental health support
- ✅ No barriers (no login required)
- ✅ Available 24/7
- ✅ Private and anonymous
- ✅ Evidence-based advice
- ✅ Crisis resources when needed

### For Institution
- ✅ Increased engagement
- ✅ Lower barrier to entry
- ✅ Scalable support
- ✅ Complements human counselors
- ✅ Data-driven insights (if analytics added)

## 📞 Support

If users have issues with the chatbot:
1. Check browser console for errors
2. Verify internet connection
3. Try refreshing the page
4. Clear browser cache
5. Contact support if issue persists

---

## 🚀 Quick Start

The chatbot is already live! Just:
1. Visit any page on your website
2. Look for the AI icon (bottom-right)
3. Click and start chatting!

**No setup required for users - it just works!** 🎉
