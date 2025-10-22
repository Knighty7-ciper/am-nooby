# 🔧 Deployment Fix #3: Prisma Build Scripts Issue

## Problem Identified

**Build Error:**
```
Ignored build scripts: @prisma/client, @prisma/engines, esbuild, prisma, sharp, unrs-resolver.
Run "pnpm approve-builds" to pick which dependencies should be allowed to run scripts.

> prisma generate --schema=./packages/database/prisma/schema.prisma
Prisma schema loaded from packages/database/prisma/schema.prisma
Error:
```

## Root Cause

Vercel's pnpm configuration uses security-conscious defaults that **block lifecycle scripts** (install/postinstall) for all packages. This prevents:

1. **@prisma/engines** from downloading required database engine binaries
2. **Prisma Client generation** from completing successfully  
3. **Sharp** and **esbuild** from setting up their native binaries

Without these scripts running, the `prisma generate` command fails because it doesn't have the necessary engine files.

## Solutions Applied

### 1. Created `.npmrc` Configuration

**File:** `noobblogger/.npmrc`

```ini
# Enable lifecycle scripts (required for Prisma, Sharp, etc.)
enable-pre-post-scripts=true

# Hoist dependencies to make them accessible
shamefully-hoist=true
public-hoist-pattern[]=*prisma*
public-hoist-pattern[]=*sharp*
public-hoist-pattern[]=*esbuild*

# Use hoisted node linker
node-linker=hoisted
```

**What this does:**
- ✅ `enable-pre-post-scripts=true` - Allows postinstall/preinstall scripts to run
- ✅ `shamefully-hoist=true` - Hoists all dependencies to root node_modules
- ✅ `public-hoist-pattern[]` - Ensures Prisma, Sharp, and esbuild are accessible
- ✅ `node-linker=hoisted` - Uses traditional hoisted installation (compatible with monorepos)

### 2. Updated Build Script (Failsafe)

**File:** `noobblogger/package.json`

**Before:**
```json
"build": "next build"
```

**After:**
```json
"build": "prisma generate --schema=./packages/database/prisma/schema.prisma && next build"
```

**Why this helps:**
- If `postinstall` is still blocked, the build command will explicitly run Prisma generation
- Ensures Prisma Client is always generated before Next.js builds
- Acts as a safety net for the deployment process

### 3. Prisma Schema Configuration (From Previous Fix)

**File:** `packages/database/prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../../../node_modules/@prisma/client"
}
```

## How It Works Together

### Deployment Flow:

```
1. Clone repository ✅
   ↓
2. pnpm install (reads .npmrc)
   ├─ enable-pre-post-scripts=true → Allows lifecycle scripts
   ├─ Downloads @prisma/engines binaries ✅
   ├─ Downloads sharp binaries ✅
   └─ Runs postinstall → prisma generate ✅
   ↓
3. pnpm run build
   ├─ Runs: prisma generate (failsafe) ✅
   └─ Runs: next build ⏳
   ↓
4. Deploy ⏳
```

## Why This Approach

### **Defense in Depth Strategy:**

1. **Primary:** `.npmrc` enables scripts at install time
2. **Fallback:** Build script explicitly generates Prisma
3. **Configuration:** Schema has proper output path

This ensures Prisma works regardless of which mechanism succeeds.

## Alternative Approaches Considered

❌ **Approach 1:** Modify `vercel.json` installCommand  
   - Doesn't override pnpm's security settings
   - Still blocks scripts

❌ **Approach 2:** Use `.pnpmfile.cjs`  
   - More complex configuration
   - Overkill for this use case

✅ **Chosen Approach:** `.npmrc` + Build script  
   - Simple, standard configuration
   - Works with Vercel's pnpm setup
   - Provides failsafe mechanism

## Files Modified

1. **`.npmrc`** (NEW) - pnpm configuration to enable scripts
2. **`package.json`** - Updated build script with explicit Prisma generation
3. **`packages/database/prisma/schema.prisma`** - Added output path (previous fix)

## Next Steps

**Commit and deploy:**

```bash
cd noobblogger
git add .npmrc package.json packages/database/prisma/schema.prisma
git commit -m "fix: Enable Prisma build scripts and add failsafe generation"
git push
```

## Expected Behavior

With these fixes, you should see in the Vercel logs:

```
✅ Running "install" command: `pnpm install`...
✅ (No "Ignored build scripts" warning)
✅ > prisma generate --schema=./packages/database/prisma/schema.prisma
✅ Prisma schema loaded from packages/database/prisma/schema.prisma
✅ ✔ Generated Prisma Client
✅ Running "build" command: `pnpm run build`...
✅ > prisma generate && next build
✅ (Build proceeds successfully)
```

## Deployment Fixes Summary

### Fix #1: Package Dependencies
- ✅ Replaced `@stack-auth/next` → `@stackframe/stack`
- ✅ Fixed all import statements
- ✅ Removed problematic re-export patterns

### Fix #2: Prisma Configuration  
- ✅ Added output path to schema generator

### Fix #3: Build Scripts (Current)
- ✅ Created `.npmrc` to enable lifecycle scripts
- ✅ Updated build script with explicit generation
- ✅ Configured proper dependency hoisting

🚀 **Your NoobBlog should now deploy successfully!**
