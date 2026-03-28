# MindScape - Testing & Demo Guide

## 🚀 Quick Start

### Prerequisites
- Node.js installed
- Both servers running (frontend + backend)

### Start Servers
```bash
npm start
```

This starts:
- Frontend: http://localhost:5173/
- Backend API: http://localhost:3001

---

## 🧪 TESTING SCENARIOS

### Scenario 1: New Student First Check-In
**Objective**: Test anonymous check-in flow

1. Open http://localhost:5173/
2. Click "Start Check-In"
3. Select a mood emoji (try 😊 - score 7)
4. Click "Continue"
5. Select department (e.g., "CSE")
6. Add stressors (e.g., "Exams", "Sleep")
7. Add optional text: "Feeling good but tired"
8. Click "Submit Check-In"
9. ✅ Should see success confirmation
10. Click "View My Trends"
11. ✅ Should see your first data point

**Expected Result**: Check-in recorded, session ID created in localStorage

---

### Scenario 2: Trigger Early Warning (Mild)
**Objective**: Test proactive nudge system

1. Complete 3 check-ins with declining scores:
   - Day 1: Score 7 (😊)
   - Day 2: Score 5 (😐)
   - Day 3: Score 4 (🙁)

2. Go to "My Trends" page
3. ✅ Should see **BLUE alert** (Mild warning)
4. ✅ Message: "We noticed your mood trending downward..."
5. ✅ Suggested actions displayed
6. Click on suggested action
7. ✅ Should navigate to resources

**Expected Result**: Proactive nudge appears before crisis

---

### Scenario 3: Trigger Moderate Warning
**Objective**: Test moderate intervention

1. Complete 3 check-ins with low scores:
   - Check-in 1: Score 4 (🙁)
   - Check-in 2: Score 4 (🙁)
   - Check-in 3: Score 4 (🙁)

2. Go to "My Trends" page
3. ✅ Should see **YELLOW alert** (Moderate warning)
4. ✅ Message: "Your mood has been lower than usual..."
5. ✅ Counseling and resource options displayed

**Expected Result**: Moderate warning with support recommendations

---

### Scenario 4: Trigger Severe Warning (Crisis)
**Objective**: Test crisis intervention

1. Complete 3 check-ins with very low scores:
   - Check-in 1: Score 2 (😰)
   - Check-in 2: Score 3 (😔)
   - Check-in 3: Score 2 (😰)

2. Go to "My Trends" page
3. ✅ Should see **RED alert** (Severe warning)
4. ✅ Pulsing glow animation
5. ✅ Message: "Your recent check-ins show consistently low scores..."
6. ✅ Crisis resources prominently displayed
7. ✅ "Talk to a counselor now" button

**Expected Result**: Immediate intervention alert with crisis resources

---

### Scenario 5: Burnout Detection
**Objective**: Test long-term pattern detection

1. Complete 7+ check-ins over 14 days with scores 4-5
2. Go to "My Trends" page
3. ✅ Should see burnout risk indicator
4. ✅ Message: "Burnout risk detected based on your recent patterns"
5. ✅ Preventive resources suggested

**Expected Result**: Burnout warning even without crisis-level scores

---

### Scenario 6: Positive Reinforcement
**Objective**: Test positive feedback

1. Complete 3+ check-ins with high scores (7-10)
2. Go to "My Trends" page
3. ✅ Should see **GREEN positive message**
4. ✅ "🌟 You're doing great!"
5. ✅ Encouraging message displayed

**Expected Result**: Positive reinforcement for good mental health

---

### Scenario 7: Personal Trends Dashboard
**Objective**: Test personal analytics

1. Complete 5+ check-ins over several days
2. Go to "My Trends" page
3. ✅ Should see:
   - Average score
   - Streak counter (🔥)
   - Total check-ins
   - Mood trend chart
   - Lowest/highest scores
   - Top stressors bar chart

4. Try different time ranges (7/14/30 days)
5. ✅ Chart updates accordingly

**Expected Result**: Comprehensive personal analytics

---

### Scenario 8: Admin Dashboard - Real-Time Metrics
**Objective**: Test institutional dashboard

1. Open http://localhost:5173/admin
2. Login:
   - Username: `admin`
   - Password: `mindscape2024`
3. ✅ Should see admin dashboard
4. ✅ Campus mood score displayed
5. ✅ Today's check-ins count
6. ✅ Unique users count
7. ✅ Mood distribution pie chart

**Expected Result**: Real-time campus metrics visible

---

### Scenario 9: Department Analytics
**Objective**: Test department-level insights

1. Complete check-ins from different departments:
   - 3 check-ins as "CSE" (scores: 7, 8, 7)
   - 3 check-ins as "Mech" (scores: 3, 4, 3)
   - 3 check-ins as "Arts" (scores: 6, 6, 5)

2. Go to Admin Dashboard
3. ✅ Should see department breakdown
4. ✅ Mech should show lowest score (red)
5. ✅ CSE should show highest score (green)
6. ✅ Week-over-week changes displayed

**Expected Result**: Department comparison with at-risk identification

---

### Scenario 10: Alert System
**Objective**: Test automated alert generation

1. Complete 3 check-ins in "Mech" department with scores 2, 3, 2
2. Go to Admin Dashboard
3. ✅ Should see active alert
4. ✅ Alert message: "Mech — 3-day average at X/10, possible burnout trend detected"
5. ✅ Alert level: "critical"
6. Click "Resolve" button
7. ✅ Alert should be marked as resolved

**Expected Result**: Automated alert creation and resolution

---

### Scenario 11: Word Cloud Analysis
**Objective**: Test text analysis

1. Complete 5+ check-ins with text:
   - "Feeling stressed about exams"
   - "Worried about assignments"
   - "Stressed about deadlines"
   - "Exam anxiety is high"
   - "Stressed but managing"

2. Go to Admin Dashboard
3. ✅ Should see word cloud
4. ✅ "stressed" and "exam" should be prominent
5. ✅ Size reflects frequency

**Expected Result**: Common themes identified

---

### Scenario 12: Resources Page
**Objective**: Test resource library

1. Go to http://localhost:5173/resources
2. ✅ Should see crisis banner at top
3. ✅ 24/7 helpline numbers displayed
4. ✅ Interactive breathing exercise
5. Click breathing circle
6. ✅ Should animate: Inhale → Hold → Exhale
7. ✅ Repeats 3 times
8. Scroll down
9. ✅ Should see 10+ resource cards
10. ✅ Categorized (Mindfulness, Sleep, Stress, etc.)
11. ✅ Counselor contact cards

**Expected Result**: Comprehensive resource library

---

### Scenario 13: Mobile Responsiveness
**Objective**: Test mobile experience

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select "iPhone 12 Pro" or similar
4. Navigate through all pages
5. ✅ Mobile menu appears (hamburger icon)
6. Click hamburger menu
7. ✅ Slide-out menu appears
8. ✅ All navigation links work
9. ✅ Layouts adapt to mobile
10. ✅ Touch targets are large enough
11. ✅ Scroll-to-top button appears when scrolling

**Expected Result**: Fully functional mobile experience

---

### Scenario 14: Dark Mode
**Objective**: Test theme switching

1. Click theme toggle (sun/moon icon) in navbar
2. ✅ Should switch to dark mode
3. ✅ All colors invert appropriately
4. ✅ Orbs and aurora effects adapt
5. ✅ Charts remain readable
6. Click toggle again
7. ✅ Should switch back to light mode
8. Refresh page
9. ✅ Theme preference persists

**Expected Result**: Smooth theme switching with persistence

---

### Scenario 15: Streak Counter
**Objective**: Test gamification

1. Complete check-ins on consecutive days:
   - Day 1: One check-in
   - Day 2: One check-in
   - Day 3: One check-in

2. Go to "My Trends" page
3. ✅ Should see streak: 3 🔥
4. ✅ Streak card has pulse glow effect

**Expected Result**: Streak counter encourages daily use

---

## 🎯 KEY FEATURES TO DEMONSTRATE

### 1. Anonymity
- No login required
- No personal information collected
- Session ID is random UUID
- Check localStorage: `mindscape_session_id`

### 2. Speed
- Check-in takes ~10 seconds
- Emoji selection is instant
- Form is minimal and focused

### 3. Early Warning
- Multi-level detection (Mild/Moderate/Severe)
- Proactive nudges before crisis
- Burnout pattern recognition

### 4. Resources
- 24/7 crisis helplines
- Interactive breathing exercise
- 10+ self-help articles
- Counselor contacts

### 5. Analytics
- Personal trends dashboard
- Institutional aggregate view
- Department-level insights
- Word cloud analysis
- Stressor tracking

### 6. Design
- Beautiful modern UI
- Orb backgrounds
- Aurora effects
- Border glows
- Smooth animations
- Dark mode

### 7. Mobile
- Fully responsive
- Touch-optimized
- Slide-out menu
- Scroll-to-top button
- Safe area insets

---

## 🐛 TESTING EDGE CASES

### Edge Case 1: No Check-Ins Yet
1. Clear localStorage
2. Go to "My Trends"
3. ✅ Should show empty state
4. ✅ "Start Check-In" button displayed

### Edge Case 2: Single Check-In
1. Complete only 1 check-in
2. Go to "My Trends"
3. ✅ Should show stats
4. ✅ No warning (insufficient data)

### Edge Case 3: Long Text Input
1. Try entering 300+ characters
2. ✅ Should limit to 280 characters
3. ✅ Character counter shows 280/280

### Edge Case 4: No Stressors Selected
1. Complete check-in without selecting stressors
2. ✅ Should still submit successfully
3. ✅ Stressors are optional

### Edge Case 5: Admin Without Data
1. Login to admin dashboard
2. Before any check-ins
3. ✅ Should show 0 values
4. ✅ No errors
5. ✅ Empty state messages

---

## 📊 DATA VERIFICATION

### Check Database
```bash
# View all check-ins
sqlite3 server/mindscape.db "SELECT * FROM mood_entries ORDER BY created_at DESC LIMIT 10;"

# View alerts
sqlite3 server/mindscape.db "SELECT * FROM alerts WHERE resolved = 0;"

# View resources
sqlite3 server/mindscape.db "SELECT title, category FROM resources;"
```

### Check API Endpoints
```bash
# Health check
curl http://localhost:3001/api/health

# Get resources
curl http://localhost:3001/api/resources

# Personal stats (replace SESSION_ID)
curl "http://localhost:3001/api/personal/stats?session_id=SESSION_ID"
```

---

## ✅ ACCEPTANCE CRITERIA

### Must Pass
- [ ] Anonymous check-in works without login
- [ ] Early warning system triggers correctly
- [ ] Resources page displays all content
- [ ] Admin dashboard shows real-time data
- [ ] Mobile responsive on all pages
- [ ] Dark mode works correctly
- [ ] Alerts generate automatically
- [ ] Personal trends display accurately
- [ ] Department analytics work
- [ ] Word cloud generates from text

### Should Pass
- [ ] Animations are smooth
- [ ] No console errors
- [ ] Fast page loads (<2s)
- [ ] Touch targets are adequate (44px)
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Print styles work

---

## 🎬 DEMO SCRIPT

### 5-Minute Demo Flow

**Minute 1: Introduction**
- "MindScape is an anonymous mental health check-in platform"
- "No login required, completely private"
- "Takes 10 seconds to check in"

**Minute 2: Student Experience**
- Show check-in page
- Select mood emoji
- Add stressors
- Submit
- Show personal trends

**Minute 3: Early Warning System**
- Show example of declining trend
- Demonstrate proactive nudge
- Show resource recommendations
- Highlight crisis support

**Minute 4: Institutional Value**
- Login to admin dashboard
- Show real-time campus metrics
- Demonstrate department analytics
- Show alert system
- Explain anonymity preservation

**Minute 5: Additional Features**
- Show mobile responsiveness
- Demonstrate dark mode
- Show breathing exercise
- Highlight beautiful UI
- Emphasize production-ready status

---

## 📝 TESTING CHECKLIST

### Functional Testing
- [ ] Check-in submission
- [ ] Trend calculation
- [ ] Alert generation
- [ ] Resource display
- [ ] Admin authentication
- [ ] Dashboard metrics
- [ ] Department analytics
- [ ] Word cloud generation
- [ ] Stressor tracking
- [ ] Streak counter

### UI/UX Testing
- [ ] Responsive layouts
- [ ] Mobile menu
- [ ] Theme switching
- [ ] Animations
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Success messages

### Performance Testing
- [ ] Page load times
- [ ] API response times
- [ ] Database query speed
- [ ] Animation smoothness
- [ ] Mobile performance

### Security Testing
- [ ] No PII stored
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CORS configuration
- [ ] Admin authentication

---

## 🏆 SUCCESS METRICS

### Student Engagement
- Check-in completion rate
- Daily active users
- Streak maintenance
- Resource access rate

### Early Intervention
- Warnings triggered
- Crisis alerts generated
- Resource clicks from nudges
- Trend improvement after intervention

### Institutional Value
- Department insights accuracy
- Alert resolution time
- Data-driven decisions made
- Resource allocation optimization

---

**Ready to test? Start at: http://localhost:5173/**
