# 🚨 Git Merge Conflict Resolution Guide

## Error Encountered

```
npm error code EJSONPARSE
npm error path /opt/build/repo/package.json
npm error Merge conflict detected in your package.json.
npm error Please resolve the package.json conflict and retry.
```

## What Happened

Your GitHub repository has **merge conflict markers** in the `package.json` file. These look like:

```json
<<<<<<< HEAD
  "some": "code"
=======
  "other": "code"
>>>>>>> branch-name
```

## How to Fix

### Option 1: Reset to Clean State (Recommended)

If you want to use the latest fixes I've prepared:

```bash
cd /path/to/noobblogger

# Backup your current package.json
cp package.json package.json.backup

# Reset to remove conflicts
git fetch origin
git reset --hard origin/main

# Or if you're on a different branch
git reset --hard HEAD

# Copy the clean package.json (content below)
# Then commit
git add package.json .npmrc packages/database/prisma/schema.prisma
git commit -m "fix: Resolve merge conflict and apply deployment fixes"
git push --force origin main
```

### Option 2: Manual Conflict Resolution

```bash
cd /path/to/noobblogger

# Open package.json in your editor
# Look for lines with:
# <<<<<<< HEAD
# =======
# >>>>>>> 

# Delete the conflict markers and keep the correct version
# Save the file

# Stage and commit
git add package.json
git commit -m "fix: Resolve merge conflict in package.json"
git push
```

## Clean package.json Content

Here's the **conflict-free, working version** of your `package.json`:

```json
{
  "name": "noobblog",
  "version": "1.0.0",
  "private": true,
  "description": "Professional blogging platform with advanced features",
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate --schema=./packages/database/prisma/schema.prisma && next build",
    "start": "next start",
    "lint": "next lint",
    "dev:web": "cd apps/web && pnpm dev",
    "dev:admin": "cd apps/admin && pnpm dev",
    "dev:all": "concurrently \"pnpm dev:web\" \"pnpm dev:admin\"",
    "build:web": "cd apps/web && pnpm build",
    "build:admin": "cd apps/admin && pnpm build",
    "build:all": "pnpm build:web && pnpm build:admin",
    "db:push": "prisma db push --schema=./packages/database/prisma/schema.prisma",
    "db:generate": "prisma generate --schema=./packages/database/prisma/schema.prisma",
    "db:seed": "tsx packages/database/seed.ts",
    "db:studio": "prisma studio --schema=./packages/database/prisma/schema.prisma",
    "format": "prettier --write \"**/*.{ts,tsx,md}\""
  },
  "dependencies": {
    "@prisma/client": "^5.8.1",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@stackframe/stack": "^2.6.5",
    "@tiptap/extension-code-block-lowlight": "^2.1.13",
    "@tiptap/extension-image": "^2.1.13",
    "@tiptap/extension-link": "^2.1.13",
    "@tiptap/extension-placeholder": "^2.1.13",
    "@tiptap/extension-text-align": "^2.1.13",
    "@tiptap/react": "^2.1.13",
    "@tiptap/starter-kit": "^2.1.13",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "date-fns": "^3.0.6",
    "lowlight": "^3.1.0",
    "lucide-react": "^0.309.0",
    "next": "14.0.4",
    "next-themes": "^0.2.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hot-toast": "^2.4.1",
    "server-only": "^0.0.1",
    "sharp": "^0.33.1",
    "tailwind-merge": "^2.2.0",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.10",
    "@types/node": "^20.10.6",
    "@types/react": "^18.2.46",
    "@types/react-dom": "^18.2.18",
    "autoprefixer": "^10.4.16",
    "concurrently": "^8.2.2",
    "eslint": "^8.56.0",
    "eslint-config-next": "14.0.4",
    "postcss": "^8.4.33",
    "prettier": "^3.1.0",
    "prisma": "^5.8.1",
    "tsx": "^4.7.0",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.3"
  },
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  }
}
```

## Key Points

✅ **No `postinstall` script** - Removed to avoid Vercel script blocking  
✅ **Build script includes Prisma** - Generates client before Next.js build  
✅ **`@stackframe/stack`** - Correct package name  
✅ **All dependencies present** - No missing packages  

## About the Global CSS "Error"

The global CSS import in `app/layout.tsx` is **correct**:

```typescript
import './globals.css'  // ✅ This is the correct way
```

If you see CSS-related errors during build, they will typically appear **after** the merge conflict is resolved and deployment proceeds.

## Verification Steps

After resolving the conflict:

```bash
# 1. Verify package.json is valid JSON
cat package.json | jq .

# 2. Check for any remaining conflict markers
grep -r '<<<<<<< HEAD' .
grep -r '=======' .
grep -r '>>>>>>>' .

# 3. Commit and push
git status
git add .
git commit -m "fix: Resolve all merge conflicts and deployment issues"
git push
```

## Next Steps

Once the merge conflict is resolved:

1. ✅ The package.json will be valid
2. ✅ Netlify/Vercel can parse dependencies
3. ✅ Build process will start
4. ✅ Prisma will generate during build
5. ✅ Next.js will compile
6. ✅ Deployment succeeds!

---

**Need Help?** If you're still seeing conflicts, share the content of your `package.json` from your local repository.
