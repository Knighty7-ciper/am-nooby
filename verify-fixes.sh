#!/bin/bash

echo "🔍 Verifying Deployment Fixes..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check 1: Stack Auth package in root package.json
echo "1. Checking root package.json for correct Stack Auth package..."
if grep -q '"@stackframe/stack"' package.json; then
    echo -e "${GREEN}✓${NC} Found @stackframe/stack"
else
    echo -e "${RED}✗${NC} Missing @stackframe/stack"
fi

# Check 2: No old package references
echo "2. Checking for old @stack-auth/next references..."
OLD_REFS=$(grep -r "@stack-auth/next" --include="*.{ts,tsx,js,jsx,json}" 2>/dev/null | wc -l)
if [ "$OLD_REFS" -eq 0 ]; then
    echo -e "${GREEN}✓${NC} No old package references found"
else
    echo -e "${RED}✗${NC} Found $OLD_REFS old references"
    grep -r "@stack-auth/next" --include="*.{ts,tsx,js,jsx,json}" 2>/dev/null
fi

# Check 3: Vercel config uses pnpm
echo "3. Checking Vercel configuration..."
if grep -q '"installCommand": "pnpm install"' vercel.json; then
    echo -e "${GREEN}✓${NC} Vercel configured for pnpm"
else
    echo -e "${RED}✗${NC} Vercel not configured for pnpm"
fi

# Check 4: Layout has full implementation
echo "4. Checking app/layout.tsx..."
if grep -q "export default function RootLayout" app/layout.tsx; then
    echo -e "${GREEN}✓${NC} Layout has full implementation"
else
    echo -e "${RED}✗${NC} Layout still using re-export"
fi

# Check 5: Page has full implementation
echo "5. Checking app/page.tsx..."
if grep -q "export default async function Home" app/page.tsx; then
    echo -e "${GREEN}✓${NC} Page has full implementation"
else
    echo -e "${RED}✗${NC} Page still using re-export"
fi

# Check 6: Stack provider has full implementation
echo "6. Checking components/stack-provider.tsx..."
if grep -q "'use client'" components/stack-provider.tsx; then
    echo -e "${GREEN}✓${NC} Stack provider has full implementation"
else
    echo -e "${RED}✗${NC} Stack provider still using re-export"
fi

echo ""
echo "✅ Verification Complete!"
echo ""
echo "If all checks passed, you're ready to deploy! 🚀"
echo "Run: git add . && git commit -m 'fix: deployment issues' && git push"
