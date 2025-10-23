# ✅ Stack Auth Redirect Fix Applied

## 🔧 Problem Fixed:

**Error:** `Redirect URL https://noobblog.netlify.app is not trusted; should be relative.`

**Root Cause:** Stack Auth configuration was using **absolute URLs** instead of **relative paths** for redirects.

---

## ✅ Changes Made:

### 1. **Fixed `apps/web/lib/stack-server.ts`**

**BEFORE:**
```typescript
export const stackServerApp = new StackServerApp({
  tokenStore: 'nextjs-cookie',
  urls: {
    home: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
})
```

**AFTER:**
```typescript
export const stackServerApp = new StackServerApp({
  tokenStore: 'nextjs-cookie',
  urls: {
    home: '/',
    signIn: '/handler/sign-in',
    signUp: '/handler/sign-up',
    afterSignIn: '/',
    afterSignUp: '/',
  },
})
```

### 2. **Fixed `apps/web/components/stack-provider.tsx`**

**BEFORE:**
```typescript
const stackClientApp = new StackClientApp({
  tokenStore: 'nextjs-cookie',
  urls: {
    home: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
})
```

**AFTER:**
```typescript
const stackClientApp = new StackClientApp({
  tokenStore: 'nextjs-cookie',
  urls: {
    home: '/',
    signIn: '/handler/sign-in',
    signUp: '/handler/sign-up',
    afterSignIn: '/',
    afterSignUp: '/',
  },
})
```

---

## 🌐 Stack Auth Dashboard Configuration

### **CRITICAL:** Enable Both Sign-Up and Sign-In

Go to: **https://app.stack-auth.com/**

### Step 1: Select Your Project
- Project ID: `819019f5-01ce-4077-b9b5-c5354d33a247`

### Step 2: Enable Sign-Up Methods

1. Go to **Authentication** → **Sign-In Methods**
2. **Enable at least one method:**
   - ✅ **Email/Password** (Recommended)
   - ✅ **OAuth Providers** (Google, GitHub, etc.)

3. **Check "Allow Sign-Ups"** setting:
   - Make sure **"Allow new users to sign up"** is **ENABLED**
   - If this is disabled, users clicking "Sign Up" will be redirected to "Sign In"

### Step 3: Verify Redirect URLs

1. Go to **Settings** → **Redirect URLs** (or **Allowed Origins**)
2. Make sure these are added:
   - `https://noobblog.netlify.app`
   - `https://noobblog.netlify.app/*`
   - `http://localhost:3000` (for local dev)

3. **Add these callback URLs:**
   - `https://noobblog.netlify.app/handler/sign-in`
   - `https://noobblog.netlify.app/handler/sign-up`
   - `https://noobblog.netlify.app/handler/*`

### Step 4: Check Email Verification Settings

1. Go to **Authentication** → **Email Verification**
2. Options:
   - **Disabled:** Users can sign up and in immediately (fastest for testing)
   - **Optional:** Users can sign in without verifying, but get a reminder
   - **Required:** Users must verify email before they can sign in

**Recommended for now:** Set to **"Disabled"** or **"Optional"** for testing.

---

## 🚀 Deploy the Fix:

```bash
cd project/am-nooby
git add .
git commit -m "Fix: Stack Auth redirect errors - use relative URLs"
git push origin main
```

**Wait for Netlify to deploy** (2-3 minutes)

---

## ✅ Test Sign-Up/Sign-In:

### Test Sign-Up:
1. Go to: `https://noobblog.netlify.app/handler/sign-up`
2. Enter a **new email** (one you haven't used before)
3. Enter a password (8+ characters)
4. Click **Sign Up**
5. ✅ Should redirect to homepage (`/`)

### Test Sign-In:
1. Go to: `https://noobblog.netlify.app/handler/sign-in`
2. Enter your email and password
3. Click **Sign In**
4. ✅ Should redirect to homepage (`/`)

---

## 🐛 If Issues Persist:

### Issue: Still redirecting from Sign-Up to Sign-In
**Cause:** Sign-up is disabled in Stack Auth dashboard
**Fix:** Go to Stack Auth → Settings → Enable "Allow new users to sign up"

### Issue: "Email already exists" error
**This is normal!** It means:
- The email is already registered
- Use **Sign In** instead, or
- Try a different email for testing

### Issue: Still getting redirect errors
**Fix:**
1. Clear your browser cache (Ctrl+Shift+Delete)
2. Try in **Incognito/Private mode**
3. Check browser console for new errors

---

## 📝 Summary:

✅ **Fixed:** Redirect URL errors (changed to relative paths)
✅ **Added:** Proper sign-in/sign-up URL configuration
✅ **Ready:** Both sign-up and sign-in should now work!

**Next:** Deploy the fix and check your Stack Auth dashboard settings!
