# Deployment Guide

## Overview

This guide will help you deploy NoobBlog to Netlify.

> **📘 Detailed Guide**: See <filepath>NETLIFY_DEPLOYMENT.md</filepath> for comprehensive step-by-step instructions.

## Prerequisites

- GitHub account
- Netlify account (free)
- Neon PostgreSQL database
- Stack Auth project

## Quick Start

### Step 1: Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/noobblog.git
git push -u origin main
```

### Step 2: Deploy to Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository
4. Netlify will auto-detect Next.js settings
5. Click "Deploy site"

### Step 3: Configure Environment Variables

In Netlify Dashboard → Site settings → Environment variables, add:

```env
# Database (from Neon)
DATABASE_URL=your_database_connection_string

# Auth (from Stack Auth)
NEXT_PUBLIC_STACK_PROJECT_ID=your_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_publishable_key
STACK_SECRET_SERVER_KEY=your_secret_key

# Site URLs (update after first deploy)
NEXT_PUBLIC_APP_URL=https://your-site-name.netlify.app
NEXT_PUBLIC_ADMIN_URL=https://your-admin-site.netlify.app
```

> **⚠️ Important**: Use placeholder values from `.env.example`, NOT real credentials in this file.

### Step 4: Update Stack Auth URLs

After deployment:

1. Note your Netlify URL (e.g., `https://your-site-name.netlify.app`)
2. Go to [Stack Auth Dashboard](https://app.stack-auth.com/)
3. Add your Netlify URL to **Allowed Domains**
4. Update environment variables with your actual Netlify URL

### Step 5: Initialize Database

From your local machine:

```bash
cd packages/database
pnpm db:push
pnpm db:seed
```

This creates:
- Database schema
- Sample data
- Admin user

## Automatic Deployments

Netlify automatically deploys:
- **Production**: On push to `main` branch
- **Deploy Previews**: On pull requests

## Configuration Files

### `netlify.toml`

```toml
[build]
  command = "pnpm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "22"
  NETLIFY_USE_PNPM = "true"
```

### `.npmrc`

Required for monorepo setup:

```ini
auto-install-peers=true
shamefully-hoist=true
node-linker=hoisted
public-hoist-pattern[]=*prisma*
```

## Troubleshooting

### Build Failures

**Issue**: Prisma client generation fails
**Solution**: Ensure `prisma generate` is in build script

**Issue**: Module not found errors
**Solution**: Check `transpilePackages` in `next.config.js`

**Issue**: Environment variables not working
**Solution**: Verify they're set in Netlify dashboard, not in code

### Runtime Errors

**Issue**: Database connection fails
**Solution**: Check `DATABASE_URL` format and permissions

**Issue**: Authentication not working  
**Solution**: Verify Stack Auth URLs and credentials

**Issue**: 500 errors on API routes
**Solution**: Check Netlify function logs in dashboard

## Performance Optimization

### Image Optimization

Use Next.js Image component:

```tsx
import Image from 'next/image'

<Image
  src="/image.jpg"
  width={800}
  height={600}
  alt="Description"
/>
```

### Caching

Configure revalidation for static pages:

```typescript
export const revalidate = 60 // Revalidate every 60 seconds
```

### Edge Functions

For better performance:

```javascript
export const config = {
  runtime: 'edge',
}
```

## Monitoring

### Analytics

1. Netlify Analytics (built-in)
2. Google Analytics (optional)
3. Vercel Analytics (if migrating)

### Error Tracking

Integrate Sentry:

```bash
pnpm add @sentry/nextjs
```

## Scaling

### Database

Neon PostgreSQL scales automatically. Monitor usage in Neon dashboard.

### Serverless Functions

Netlify Functions scale automatically. No configuration needed.

### CDN

Netlify uses global CDN. Content is distributed worldwide automatically.

## Backup

### Database Backups

Neon provides automatic backups. Configure in Neon dashboard.

### Code Backups

Your code is backed up in GitHub. Enable branch protection:

1. Repository Settings → Branches
2. Add rule for `main`
3. Enable "Require pull request reviews"

## Security Best Practices

1. **Environment Variables**: Never commit `.env` file
2. **API Keys**: Rotate keys regularly
3. **Database**: Use connection pooling
4. **HTTPS**: Enabled by default on Netlify
5. **CSP**: Configure Content Security Policy headers

### Security Headers

Add to `netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

## Support

If you need help:
- 📖 [Netlify Documentation](https://docs.netlify.com/)
- 📖 [Neon Documentation](https://neon.tech/docs)
- 📖 [Stack Auth Documentation](https://docs.stack-auth.com/)
- 💬 Open an issue on GitHub

## Additional Resources

- <filepath>NETLIFY_DEPLOYMENT.md</filepath> - Detailed deployment guide
- <filepath>.env.example</filepath> - Environment variables template
- <filepath>README.md</filepath> - Project overview
