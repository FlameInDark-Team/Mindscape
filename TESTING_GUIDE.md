# Testing Guide - New Features

## 🚀 Quick Start

**Servers Running:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

---

## 1️⃣ Test Score-Based Recommendations

### Test High Score (7-10):
1. Go to http://localhost:5173/checkin
2. Select mood: 😊 (7) or higher
3. Add optional details
4. Click "Submit Check-In"
5. **Expected**: 
   - Personality prompt appears (if first time)
   - After closing: Green "You're Doing Great! 🌱" message
   - 4 maintenance strategies shown
   - Resources for mindfulness, stress management

### Test Moderate Score (4-6):
1. Go to http://localhost:5173/checkin
2. Select mood: 😐 (5) or � (4)
3. Add optional details
4. Click "Submit Check-In"
5. **Expected**:
   - Yellow "Let's Work Through This Together" message
   - 4 self-help strategies (mindfulness, stress management, lifestyle, social)
   - Note about seeking professional help if needed

### Test Low Score (1-3):
1. Go to http://localhost:5173/checkin
2. Select mood: 😞 (1) or 😰 (2)
3. Add optional details
4. Click "Submit Check-In"
5. **Expected**:
   - Red "We're Here to Support You" message
   - Urgent crisis banner
   - Professional help recommendation
   - **3 India Helplines**:
     - Kiran: 1800-599-0019
     - Vandrevala: 1860-2662-345 / 1800-2333-330
     - AASRA: 022-27546669
   - Finding professional help section (Practo, Lybrate)
   - Support groups information
   - Immediate action items

---

## 2️⃣ Test Organization System

### Register Organization:
1. Go to http://localhost:5173/admin
2. Click "Don't have an account? Register organization"
3. Fill in:
   - Organization Name: "Test University"
   - Description: "A test educational institution"
   - Email: "admin@testuniversity.edu"
   - Password: "test123456"
4. Click "Create Organization"
5. **Expected**: Redirected to admin dashboard

### Login as Organization:
1. Go to http://localhost:5173/admin
2. Enter:
   - Email: "admin@testuniversity.edu"
   - Password: "test123456"
3. Click "Sign In as Admin"
4. **Expected**: Access to admin dashboard with organization name

---

## 3️⃣ Test User-Organization Link

### Register User with Organization:
1. Go to http://localhost:5173/login
2. Click "Don't have an account? Sign up"
3. Fill in:
   - Full Name: "Test Student"
   - **Select Organization**: Choose "Test University" from dropdown
   - Email: "student@test.com"
   - Password: "test123456"
4. **Expected**: 
   - Organization dropdown shows registered organizations
   - Description appears below dropdown when selected
5. Click "Create Account"
6. **Expected**: Redirected to user dashboard

### Register User without Organization:
1. Go to http://localhost:5173/login
2. Click "Don't have an account? Sign up"
3. Fill in details
4. Leave organization as "No organization"
5. Click "Create Account"
6. **Expected**: User created without organization link

---

## 4️⃣ Test Merged Check-in & Personality Flow

### First Time Check-in:
1. Clear localStorage: `localStorage.clear()` in browser console
2. Go to http://localhost:5173/checkin
3. Complete check-in with any score
4. **Expected**:
   - Personality assessment prompt appears
   - Shows benefits: personality type, stress strategies, career paths
   - Two buttons: "Take Assessment" and "Maybe Later"

### Click "Take Assessment":
1. Click "Take Assessment" button
2. **Expected**: Redirected to http://localhost:5173/personality
3. Complete 15-question assessment
4. **Expected**: View personality results

### Click "Maybe Later":
1. Click "Maybe Later" button
2. **Expected**: 
   - Personality prompt closes
   - Score-based recommendations appear
   - Can proceed to "Done" screen

### Second Time Check-in:
1. Go to http://localhost:5173/checkin
2. Complete another check-in
3. **Expected**:
   - Personality prompt does NOT appear
   - Goes directly to score-based recommendations
   - (Because personality type is already saved)

---

## 5️⃣ Test Navigation

### Desktop Navigation:
1. Check navbar has:
   - Check In
   - Personality
   - My Trends
   - Resources
   - Login (user)
   - Organization (admin)

### Mobile Navigation:
1. Resize browser to mobile width
2. Click hamburger menu
3. **Expected**: All navigation items visible including:
   - User Login button
   - Organization Admin button

---

## 6️⃣ Test Recommendations Modal Features

### Test All Sections:
1. Complete check-in with low score (1-3)
2. In recommendations modal, verify:
   - ✅ Urgent crisis banner at top
   - ✅ Professional help section
   - ✅ All 3 helplines with correct numbers
   - ✅ Finding professional help section
   - ✅ Support groups section
   - ✅ Immediate action items
   - ✅ "View All Resources" button works
   - ✅ "Close" button works
   - ✅ Modal scrolls if content is long
   - ✅ Mobile responsive

---

## 🐛 Common Issues & Solutions

### Issue: "Connection failed"
**Solution**: Ensure backend server is running on port 3001

### Issue: Organizations dropdown is empty
**Solution**: Register at least one organization first at `/admin`

### Issue: Personality prompt appears every time
**Solution**: Check localStorage - `mindscape_personality_type` should be set after taking assessment

### Issue: Database errors
**Solution**: Database was recreated. Old data is lost. This is expected.

---

## ✅ Success Criteria

All features working if:
- [ ] High/moderate/low score recommendations show correctly
- [ ] All 3 India helplines display with correct numbers
- [ ] Organizations can register and login
- [ ] Users can select organization during registration
- [ ] Personality prompt appears on first check-in only
- [ ] "Take Assessment" redirects to personality page
- [ ] "Maybe Later" shows recommendations
- [ ] No console errors
- [ ] Mobile responsive
- [ ] All navigation links work

---

## 📸 Screenshots to Verify

1. High score recommendations (green theme)
2. Moderate score recommendations (yellow theme)
3. Low score recommendations (red theme with helplines)
4. Organization registration page
5. User registration with organization dropdown
6. Personality assessment prompt
7. Mobile navigation menu

---

## 🎯 Key Testing Points

### Recommendations:
- Verify color coding matches severity
- Check all helpline numbers are correct
- Ensure "View All Resources" redirects properly
- Test modal close functionality

### Organization System:
- Test duplicate email prevention
- Verify password requirements (min 6 chars)
- Check admin dashboard access
- Verify organization name displays

### Merged Flow:
- Confirm personality prompt timing
- Test localStorage persistence
- Verify smooth transitions
- Check "Maybe Later" functionality

---

**Happy Testing! 🎉**

If you find any issues, check the browser console for errors and verify both servers are running.
