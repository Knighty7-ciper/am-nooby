# 🚀 Quick Start Guide

## Installation (5 minutes)

### Option 1: Automatic Setup (Recommended)

**Linux/Mac:**
```bash
bash setup.sh
```

**Windows:**
```bash
setup.bat
```

### Option 2: Manual Setup

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Set up environment**
   ```bash
   cp apps/web/.env.example apps/web/.env.local
   cp apps/admin/.env.example apps/admin/.env.local
   ```

3. **Initialize database**
   ```bash
   cd packages/database
   pnpm db:push
   pnpm db:seed
   cd ../..
   ```

## Running Locally

### Start Main Blog
```bash
pnpm dev:web
```
Visit: http://localhost:3000

### Start Admin Dashboard
```bash
pnpm dev:admin
```
Visit: http://localhost:3001

### Run Both
```bash
pnpm dev
```

## First Steps

1. ✅ Open http://localhost:3000
2. ✅ Create an account
3. ✅ Click "Write" to create your first post
4. ✅ Access admin at http://localhost:3001

## Deploy to Vercel (10 minutes)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/Knighty7-ciper/noobblog.git
git push -u origin main
```

### 2. Deploy Main Site
1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repo
3. Root Directory: `apps/web`
4. Add environment variables (from .env.example)
5. Deploy!

### 3. Deploy Admin Dashboard
1. Import **same** repo again
2. Root Directory: `apps/admin`
3. Add environment variables
4. Deploy!

### 4. Update URLs
Update these in both deployments:
```
NEXT_PUBLIC_APP_URL=https://noobblog.vercel.app
NEXT_PUBLIC_ADMIN_URL=https://noobblog-admin.vercel.app
```

## Common Commands

```bash
# Development
pnpm dev:web          # Start main blog
pnpm dev:admin        # Start admin dashboard
pnpm dev              # Start both

# Building
pnpm build:web        # Build main blog
pnpm build:admin      # Build admin
pnpm build            # Build both

# Database
cd packages/database
pnpm db:push          # Push schema changes
pnpm db:seed          # Seed data
pnpm db:studio        # Open Prisma Studio

# Code Quality
pnpm lint             # Run linter
pnpm format           # Format code
```

## Environment Variables

**Required in both apps/web/.env.local and apps/admin/.env.local:**

```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_STACK_PROJECT_ID="..."
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="..."
STACK_SECRET_SERVER_KEY="..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_ADMIN_URL="http://localhost:3001"
```

## Troubleshooting

### Port Already in Use
```bash
# Change port in package.json
"dev": "next dev -p 3002"
```

### Database Connection Error
- Check DATABASE_URL is correct
- Ensure Neon database is active
- Verify internet connection

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
pnpm install
pnpm build
```

### Module Not Found
```bash
# Regenerate Prisma client
cd packages/database
pnpm db:generate
```

## Getting Help

- **Documentation**: Check `/docs` folder
- **Issues**: https://github.com/Knighty7-ciper/noobblog/issues
- **Email**: support@noobblog.com

## What's Included?

✅ Main blog site
✅ Admin dashboard
✅ User authentication
✅ Rich text editor
✅ Comment system
✅ Like/bookmark features
✅ Categories & tags
✅ Newsletter
✅ Analytics
✅ Dark mode
✅ SEO optimization
✅ Responsive design
✅ Full documentation

## Next Steps

1. Explore the codebase
2. Customize styling in `globals.css`
3. Add your branding
4. Configure custom domain
5. Invite users!

**Ready to build something amazing!** 🚀
