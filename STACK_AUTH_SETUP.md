# 🔐 Stack Auth Configuration Guide

## ❌ Issue: "REDIRECT_URL_NOT_WHITELISTED"

This error occurs because your deployment URL isn't whitelisted in Stack Auth dashboard.

## ✅ Fix: Add Trusted Domains

### Step 1: Go to Stack Auth Dashboard
1. Visit: https://app.stack-auth.com/
2. Login to your Stack Auth account
3. Select your project (NoobBlog)

### Step 2: Configure OAuth Providers

#### For Google Sign-In:
1. Go to **"Authentication" → "OAuth Providers"**
2. Find **Google** provider
3. Add these redirect URLs:
   ```
   https://noobblog.netlify.app/handler/callback
   https://noobblog.netlify.app/handler/auth/callback
   http://localhost:3000/handler/callback (for local testing)
   ```

#### Remove GitHub Provider:
1. In **"OAuth Providers"** section
2. Find **GitHub** provider
3. Click **"Disable"** or **"Remove"**

### Step 3: Configure Trusted Domains
1. Go to **"Settings" → "Domains"** (or "Trusted Domains")
2. Add your deployment URL:
   ```
   https://noobblog.netlify.app
   http://localhost:3000 (for development)
   ```
3. Click **"Save"**

### Step 4: Environment Variables

Make sure your `.env` has:
```env
NEXT_PUBLIC_APP_URL=https://noobblog.netlify.app
NEXT_PUBLIC_STACK_PROJECT_ID=your-project-id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your-publishable-key
STACK_SECRET_SERVER_KEY=your-secret-key
```

### Step 5: Redeploy

After updating Stack Auth settings:
```bash
git add .
git commit -m "Update Stack Auth configuration"
git push origin main
```

---

## 🎯 Quick Checklist

- [ ] Added deployment URL to Trusted Domains
- [ ] Configured Google OAuth redirect URLs
- [ ] Disabled/Removed GitHub OAuth provider
- [ ] Verified environment variables
- [ ] Redeployed the application
- [ ] Tested Google sign-in

---

## 🆘 Still Having Issues?

1. **Clear browser cache** and try again
2. **Check Stack Auth logs** in the dashboard
3. **Verify redirect URL format** (must match exactly)
4. **Wait 5-10 minutes** after saving settings for changes to propagate

---

**Note**: The redirect URL error is a security feature. Stack Auth only allows authentication from pre-approved domains.
