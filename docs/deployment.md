# Deployment Guide

## Overview

This guide will help you deploy NoobBlog to Vercel for both the main blog site and admin dashboard.

## Prerequisites

- GitHub account
- Vercel account (free)
- Neon PostgreSQL database (provided)
- Stack Auth project (provided)

## Step 1: Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/Knighty7-ciper/noobblog.git
git push -u origin main
```

## Step 2: Deploy Main Blog Site

### 2.1 Import to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `cd ../.. && pnpm build:web`
   - **Output Directory**: `.next`

### 2.2 Environment Variables

Add the following environment variables:

```env
DATABASE_URL=postgresql://neondb_owner:npg_fKoj69ErPxXi@ep-shiny-math-ahr6vjv4-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

NEXT_PUBLIC_STACK_PROJECT_ID=b9d83c23-8940-4835-8323-a13649ca0e56
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=pck_q4f2q777frjx8f9vdzgvcdt2nz0v15pbqavcykk811gj8
STACK_SECRET_SERVER_KEY=ssk_b2f0mysbrtcr73rq86aye7ebgkw6tf9gq6xdyb97tq4x8

NEXT_PUBLIC_APP_URL=https://noobblog.vercel.app
NEXT_PUBLIC_ADMIN_URL=https://noobblog-admin.vercel.app
```

### 2.3 Deploy

Click "Deploy" and wait for the build to complete.

### 2.4 Configure Custom Domain

1. Go to Project Settings → Domains
2. Add `noobblog.vercel.app` or your custom domain
3. Follow Vercel's instructions to configure DNS

## Step 3: Deploy Admin Dashboard

### 3.1 Create New Project

1. Click "Add New..." → "Project"
2. Import the **same** GitHub repository
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/admin`
   - **Build Command**: `cd ../.. && pnpm build:admin`
   - **Output Directory**: `.next`

### 3.2 Environment Variables

```env
DATABASE_URL=postgresql://neondb_owner:npg_fKoj69ErPxXi@ep-shiny-math-ahr6vjv4-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

NEXT_PUBLIC_STACK_PROJECT_ID=b9d83c23-8940-4835-8323-a13649ca0e56
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=pck_q4f2q777frjx8f9vdzgvcdt2nz0v15pbqavcykk811gj8
STACK_SECRET_SERVER_KEY=ssk_b2f0mysbrtcr73rq86aye7ebgkw6tf9gq6xdyb97tq4x8

NEXT_PUBLIC_APP_URL=https://noobblog-admin.vercel.app
```

### 3.3 Deploy

Click "Deploy" and wait for completion.

### 3.4 Configure Domain

Add `noobblog-admin.vercel.app` as the domain.

## Step 4: Initialize Database

### 4.1 Push Schema

From your local machine:

```bash
cd packages/database
pnpm db:push
```

### 4.2 Seed Data

```bash
pnpm db:seed
```

This will create:
- Default admin user
- Sample categories
- Sample tags
- Welcome post

## Step 5: Verify Deployment

1. Visit `https://noobblog.vercel.app`
2. Visit `https://noobblog-admin.vercel.app`
3. Test creating an account
4. Test writing a post

## Automatic Deployments

Vercel will automatically deploy:
- **Production**: On push to `main` branch
- **Preview**: On pull requests

## Troubleshooting

### Build Failures

**Issue**: Build fails with module not found
**Solution**: Ensure `transpilePackages` is configured in `next.config.js`

**Issue**: Database connection fails
**Solution**: Check environment variables are correctly set

### Runtime Errors

**Issue**: 500 errors on API routes
**Solution**: Check Vercel logs in the dashboard

**Issue**: Authentication not working
**Solution**: Verify Stack Auth credentials and URLs

## Performance Optimization

### Enable Edge Functions

For better performance, consider using Vercel Edge Functions:

```javascript
// Add to your API route
export const runtime = 'edge'
```

### Image Optimization

Vercel automatically optimizes images. Use Next.js Image component:

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

## Monitoring

### Analytics

1. Go to Vercel Dashboard → Analytics
2. View real-time traffic and performance
3. Monitor Web Vitals

### Error Tracking

Integrate Sentry for error tracking:

```bash
pnpm add @sentry/nextjs
```

## Scaling

### Database

Neon PostgreSQL scales automatically. Monitor usage in Neon dashboard.

### Serverless Functions

Vercel scales automatically. No configuration needed.

### CDN

Vercel uses a global CDN. Your content is automatically distributed worldwide.

## Backup

### Database Backups

Neon provides automatic backups. Configure in Neon dashboard.

### Code Backups

Your code is backed up in GitHub. Enable branch protection.

## Support

If you need help:
- Check [Vercel Documentation](https://vercel.com/docs)
- Check [Neon Documentation](https://neon.tech/docs)
- Open an issue on GitHub
