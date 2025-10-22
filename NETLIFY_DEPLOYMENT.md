# 🚀 NoobBlog - Netlify Deployment Guide

## Prerequisites

- ✅ GitHub repository with your NoobBlog code
- ✅ [Netlify account](https://app.netlify.com/signup) (free tier works)
- ✅ [Neon PostgreSQL database](https://console.neon.tech/)
- ✅ [Stack Auth project](https://app.stack-auth.com/)

---

## Step 1: Prepare Your Repository

### 1.1 Resolve Any Merge Conflicts

```bash
cd noobblog

# Check for conflicts
git status

# If conflicts exist, resolve them
# Then commit
git add .
git commit -m "fix: Resolve merge conflicts"
git push
```

### 1.2 Verify Required Files

Make sure these files exist:
- ✅ `netlify.toml` - Netlify configuration
- ✅ `.npmrc` - pnpm configuration
- ✅ `package.json` - No `postinstall` script
- ✅ `packages/database/prisma/schema.prisma` - Correct output path

---

## Step 2: Configure Netlify

### 2.1 Connect Repository

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click **"Add new site" → "Import an existing project"**
3. Choose **GitHub** and authorize Netlify
4. Select your **noobblog** repository

### 2.2 Build Settings

Netlify should auto-detect from `netlify.toml`, but verify:

```
Build command:  pnpm run build
Publish directory: .next
Node version: 22
```

**Click "Deploy site"** (it will fail first - that's expected!)

---

## Step 3: Add Environment Variables

### 3.1 Navigate to Environment Variables

1. In your Netlify site dashboard
2. Go to **"Site configuration" → "Environment variables"**
3. Click **"Add a variable"**

### 3.2 Add These Variables

#### **Database (from Neon)**
```bash
DATABASE_URL
postgresql://neondb_owner:YOUR_PASSWORD@ep-your-db.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

#### **Stack Auth**
```bash
NEXT_PUBLIC_STACK_PROJECT_ID
your-stack-project-id

NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY
pck_your_publishable_key

STACK_SECRET_SERVER_KEY
ssk_your_secret_key
```

#### **Site URL (Update after first deploy)**
```bash
NEXT_PUBLIC_APP_URL
https://your-site-name.netlify.app

NEXTAUTH_URL
https://your-site-name.netlify.app
```

**Important:** For the initial deployment, you can use placeholder URLs. Update them after you get your Netlify URL.

---

## Step 4: Configure Neon Database

### 4.1 Get Connection String

1. Go to [Neon Console](https://console.neon.tech/)
2. Select your project
3. Go to **"Dashboard" → "Connection Details"**
4. Copy the **"Pooled connection"** string
5. Add it as `DATABASE_URL` in Netlify

### 4.2 Whitelist Netlify IPs (Optional)

Neon should accept connections from Netlify by default. If you have IP restrictions:
- Neon's free tier allows all IPs
- For paid tiers, see [Neon IP allowlist docs](https://neon.tech/docs/manage/projects#configure-ip-allow)

---

## Step 5: Setup Stack Auth

### 5.1 Configure Allowed URLs

1. Go to [Stack Auth Dashboard](https://app.stack-auth.com/)
2. Select your project
3. Navigate to **"Settings" → "Domains"**
4. Add your Netlify URLs:
   - `https://your-site-name.netlify.app`
   - `http://localhost:3000` (for local dev)

### 5.2 Get API Keys

1. In Stack dashboard, go to **"API Keys"**
2. Copy these values:
   - **Project ID** → `NEXT_PUBLIC_STACK_PROJECT_ID`
   - **Publishable Key** → `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`
   - **Secret Key** → `STACK_SECRET_SERVER_KEY`
3. Add them to Netlify environment variables

---

## Step 6: Deploy Database Schema

### 6.1 Push Schema to Neon

```bash
# In your local repository
cd noobblog

# Generate Prisma client
pnpm db:generate

# Push schema to your Neon database
pnpm db:push

# (Optional) Seed with sample data
pnpm db:seed
```

### 6.2 Verify Database

```bash
# Open Prisma Studio to verify tables were created
pnpm db:studio
```

You should see all 16 tables (User, Post, Comment, etc.)

---

## Step 7: Trigger Deployment

### 7.1 Redeploy

1. Go to Netlify dashboard → **"Deploys"**
2. Click **"Trigger deploy" → "Deploy site"**
3. Monitor the build logs

### 7.2 Expected Build Flow

```
✅ 1. Clone repository from GitHub
✅ 2. Install dependencies with pnpm
✅ 3. Run build command:
   ├── prisma generate (creates Prisma Client)
   └── next build (compiles Next.js app)
✅ 4. Deploy to Netlify CDN
✅ 5. Site goes live!
```

---

## Step 8: Update Site URL

### 8.1 Get Your Netlify URL

After successful deployment:
1. Your site will be live at `https://random-name-12345.netlify.app`
2. Copy this URL

### 8.2 Update Environment Variables

1. Go to **Site configuration → Environment variables**
2. Update:
   - `NEXT_PUBLIC_APP_URL` → your Netlify URL
   - `NEXTAUTH_URL` → your Netlify URL
3. **Trigger a new deploy** for changes to take effect

### 8.3 Update Stack Auth

1. Go to [Stack Auth Dashboard](https://app.stack-auth.com/)
2. Add your Netlify URL to allowed domains

### 8.4 (Optional) Custom Domain

1. In Netlify dashboard, go to **"Domain management"**
2. Click **"Add custom domain"**
3. Follow instructions to configure DNS

---

## Step 9: Verify Deployment

### 9.1 Test the Site

Visit your Netlify URL and verify:

- [ ] ✅ Homepage loads
- [ ] ✅ Posts are visible
- [ ] ✅ Authentication works (sign up/login)
- [ ] ✅ Can create a post (if logged in as admin)
- [ ] ✅ Images load correctly
- [ ] ✅ Comments work
- [ ] ✅ Search functions

### 9.2 Check Build Logs

If something doesn't work:
1. Go to **"Deploys" → Click latest deploy**
2. Scroll through **"Deploy log"**
3. Look for errors in:
   - Dependency installation
   - Prisma generation
   - Next.js build

---

## 🎯 Troubleshooting Common Issues

### Issue 1: "Merge conflict in package.json"

**Solution:**
```bash
# Resolve conflicts locally
cd noobblog
git pull
# Fix conflicts in package.json
git add package.json
git commit -m "fix: Resolve conflicts"
git push
```

### Issue 2: "Prisma generate failed"

**Check:**
- ✅ `DATABASE_URL` is set in Netlify env vars
- ✅ `netlify.toml` has `NETLIFY_USE_PNPM = "true"`
- ✅ Prisma schema has correct `output` path

### Issue 3: "Build scripts ignored"

**Solution:** Already fixed in `netlify.toml` and `package.json`
- Build command explicitly runs `prisma generate`
- No reliance on `postinstall` scripts

### Issue 4: "Cannot connect to database"

**Check:**
- ✅ Neon database is running (not paused)
- ✅ Connection string is correct (pooled version)
- ✅ Schema is pushed: `pnpm db:push`

### Issue 5: "Stack Auth errors"

**Check:**
- ✅ All 3 Stack env vars are set
- ✅ Netlify URL is in Stack's allowed domains
- ✅ Keys are from the correct Stack project

---

## 📊 Post-Deployment Checklist

### Performance
- [ ] Test page load times
- [ ] Verify images are optimized
- [ ] Check Lighthouse score (aim for 90+)

### Functionality  
- [ ] Create test user account
- [ ] Publish a test post
- [ ] Test comments and likes
- [ ] Verify search works
- [ ] Test admin dashboard

### SEO
- [ ] Check meta tags with [metatags.io](https://metatags.io/)
- [ ] Verify RSS feed: `/api/feed.xml`
- [ ] Check sitemap: `/api/sitemap.xml`
- [ ] Submit to Google Search Console

### Security
- [ ] All sensitive keys are in environment variables (not code)
- [ ] `.env` file is in `.gitignore`
- [ ] Database credentials are secure

---

## 🚀 Advanced Configuration

### Custom Build Settings

Edit `netlify.toml` for advanced needs:

```toml
[build]
  command = "pnpm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "22"
  NETLIFY_USE_PNPM = "true"
  
# Custom redirects
[[redirects]]
  from = "/old-blog/*"
  to = "/blog/:splat"
  status = 301

# Custom headers for security
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

### Branch Deploys

1. Enable **Deploy Previews** in Netlify settings
2. Each PR will get its own preview URL
3. Great for testing before merging

### Serverless Functions

Next.js API routes automatically become Netlify Functions
- No extra configuration needed
- 125k function invocations/month on free tier

---

## 📚 Additional Resources

- [Netlify Next.js Documentation](https://docs.netlify.com/frameworks/next-js/overview/)
- [Neon Documentation](https://neon.tech/docs/introduction)
- [Stack Auth Docs](https://docs.stack-auth.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## 🆘 Need Help?

If you encounter issues:

1. **Check build logs** in Netlify dashboard
2. **Search issues** in [GitHub repo](https://github.com/yourusername/noobblog/issues)
3. **Ask in discussions** or create a new issue
4. **Review this guide** - most issues are covered in troubleshooting

---

**🎉 Congratulations!** Your NoobBlog is now live on Netlify!

Share your deployed site and start blogging! 🚀
