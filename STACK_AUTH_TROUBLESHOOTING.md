# 🔧 Stack Auth Sign-Up/Sign-In Troubleshooting Guide

## ❌ Issue: Cannot Sign Up or Sign In

---

## 🔍 Step 1: Check Environment Variables in Netlify

**CRITICAL:** These MUST be set in your Netlify dashboard:

1. Go to: **Netlify Dashboard → Site Settings → Environment Variables**
2. Verify these 3 variables exist:

```bash
NEXT_PUBLIC_STACK_PROJECT_ID=""
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=""
STACK_SECRET_SERVER_KEY=""
```

**If they're missing:** Add them NOW!

---

## 🌐 Step 2: Check Stack Auth Dashboard Configuration

### Go to: https://app.stack-auth.com/

1. **Select your project:** `819019f5-01ce-4077-b9b5-c5354d33a247`

2. **Check Allowed Domains:**
   - Click on **Settings** or **Domains**
   - Make sure these domains are whitelisted:
     - `noobblog.netlify.app`
     - `*.netlify.app` (for preview deployments)
     - `localhost:3000` (for local dev)

3. **Check Redirect URLs:**
   - Verify these are configured:
     - `https://noobblog.netlify.app/handler/sign-in`
     - `https://noobblog.netlify.app/handler/sign-up`
     - `https://noobblog.netlify.app/*`

4. **Enable Sign-Up Methods:**
   - Make sure at least one method is enabled:
     - ✅ Email/Password
     - ✅ OAuth (Google, GitHub, etc.)

---

## 🚀 Step 3: Redeploy After Fixing

**After adding environment variables:**

1. Go to Netlify → Deploys
2. Click **Trigger Deploy → Clear cache and deploy site**
3. Wait for build to complete

---

## 🐛 Step 4: Check Browser Console

1. Open your site: `https://noobblog.netlify.app/handler/sign-up`
2. Press **F12** (or right-click → Inspect)
3. Go to **Console** tab
4. Try to sign up/in again
5. **Look for errors** (red text)

### Common Console Errors:

#### ❌ "Invalid project ID" or "Unauthorized"
→ **Fix:** Environment variables not set or incorrect

#### ❌ "Origin not allowed" or "CORS error"
→ **Fix:** Domain not whitelisted in Stack Auth dashboard

#### ❌ "Network error" or fetch failed
→ **Fix:** Check Stack Auth service status

---

## 🔄 Step 5: Test the Auth Flow

### Test Sign-Up:
1. Go to: `https://noobblog.netlify.app/handler/sign-up`
2. Enter a test email: `test@example.com`
3. Enter a password (8+ chars)
4. Click Sign Up

### What should happen:
- ✅ Form submits
- ✅ You get a verification email OR you're logged in
- ✅ You're redirected to the homepage

### What might be wrong:
- ❌ Nothing happens → Check console for errors
- ❌ "Invalid credentials" → Email already exists, try Sign In
- ❌ Page reloads without error → Environment variables missing

---

## 🛠️ Quick Fixes

### Fix #1: Missing Environment Variables
```bash
# In Netlify dashboard, add:
NEXT_PUBLIC_STACK_PROJECT_ID=""
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=""
STACK_SECRET_SERVER_KEY=""
```

### Fix #2: Domain Not Whitelisted
1. Go to Stack Auth dashboard
2. Settings → Allowed Origins
3. Add: `https://noobblog.netlify.app`

### Fix #3: Clear Browser Cache
```
1. Press Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
2. Select "Cached images and files"
3. Click "Clear data"
4. Try again
```

---

## 📸 What to Check

**Send me this info to help diagnose:**

1. **Are you testing on:**
   - [ ] Deployed site (noobblog.netlify.app)
   - [ ] Localhost
   - [ ] Netlify preview URL

2. **What happens when you try to sign up:**
   - [ ] Form doesn't load at all
   - [ ] Form loads but button doesn't work
   - [ ] Error message appears (send exact message)
   - [ ] Page reloads/redirects to wrong place

3. **Browser Console Errors:**
   - Copy and paste any red error messages

4. **Environment Variables Status:**
   - [ ] I've added all 3 Stack Auth variables to Netlify
   - [ ] I've redeployed after adding them
   - [ ] Build succeeded

---

## 🎯 Most Likely Causes (In Order):

1. **Environment variables not set in Netlify** (90% of cases)
2. **Domain not whitelisted in Stack Auth dashboard** (8%)
3. **Stack Auth project disabled or expired** (1%)
4. **Code issue** (1%)

---

## 💡 Need More Help?

Tell me:
1. What URL you're testing on
2. What happens when you click Sign Up
3. Any error messages from browser console (F12)
4. Screenshot if possible

I'll help you fix it! 🚀
