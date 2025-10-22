#!/bin/bash

echo "🔍 Verifying Deployment Fix..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

checks_passed=0
checks_failed=0

# Check 1: Workspace dependency removed
echo -n "1. Checking workspace dependency removed... "
if grep -q "@noobblog/database.*workspace" package.json; then
    echo -e "${RED}❌ FAILED${NC}"
    echo "   Workspace dependency still exists in package.json"
    ((checks_failed++))
else
    echo -e "${GREEN}✅ PASSED${NC}"
    ((checks_passed++))
fi

# Check 2: pnpm-workspace.yaml removed
echo -n "2. Checking pnpm-workspace.yaml removed... "
if [ -f "pnpm-workspace.yaml" ]; then
    echo -e "${RED}❌ FAILED${NC}"
    echo "   pnpm-workspace.yaml still exists"
    ((checks_failed++))
else
    echo -e "${GREEN}✅ PASSED${NC}"
    ((checks_passed++))
fi

# Check 3: TypeScript path alias added
echo -n "3. Checking TypeScript path alias... "
if grep -q "@noobblog/database" tsconfig.json; then
    echo -e "${GREEN}✅ PASSED${NC}"
    ((checks_passed++))
else
    echo -e "${RED}❌ FAILED${NC}"
    echo "   Path alias not found in tsconfig.json"
    ((checks_failed++))
fi

# Check 4: .env.local exists
echo -n "4. Checking .env.local exists... "
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✅ PASSED${NC}"
    ((checks_passed++))
else
    echo -e "${YELLOW}⚠️  WARNING${NC}"
    echo "   .env.local not found (needed for local dev)"
fi

# Check 5: .gitignore exists
echo -n "5. Checking .gitignore exists... "
if [ -f ".gitignore" ] && grep -q ".env.local" .gitignore; then
    echo -e "${GREEN}✅ PASSED${NC}"
    ((checks_passed++))
else
    echo -e "${RED}❌ FAILED${NC}"
    echo "   .gitignore missing or doesn't protect .env.local"
    ((checks_failed++))
fi

# Check 6: .env.example is safe
echo -n "6. Checking .env.example has no real credentials... "
if grep -q "npg_fKoj69ErPxXi" .env.example; then
    echo -e "${RED}❌ FAILED - SECURITY RISK!${NC}"
    echo "   Real database password found in .env.example"
    ((checks_failed++))
else
    echo -e "${GREEN}✅ PASSED${NC}"
    ((checks_passed++))
fi

# Check 7: Prisma postinstall hook
echo -n "7. Checking Prisma postinstall hook... "
if grep -q "postinstall.*prisma generate" package.json; then
    echo -e "${GREEN}✅ PASSED${NC}"
    ((checks_passed++))
else
    echo -e "${RED}❌ FAILED${NC}"
    echo "   Postinstall hook not found"
    ((checks_failed++))
fi

# Check 8: Vercel config updated
echo -n "8. Checking vercel.json configuration... "
if [ -f "vercel.json" ] && ! grep -q "apps/web" vercel.json; then
    echo -e "${GREEN}✅ PASSED${NC}"
    ((checks_passed++))
else
    echo -e "${RED}❌ FAILED${NC}"
    echo "   vercel.json still points to apps/web"
    ((checks_failed++))
fi

# Check 9: next.config.js updated
echo -n "9. Checking next.config.js (no transpilePackages)... "
if ! grep -q "transpilePackages" next.config.js; then
    echo -e "${GREEN}✅ PASSED${NC}"
    ((checks_passed++))
else
    echo -e "${YELLOW}⚠️  WARNING${NC}"
    echo "   transpilePackages still in next.config.js (may cause issues)"
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "Results: ${GREEN}${checks_passed} passed${NC}"
if [ $checks_failed -gt 0 ]; then
    echo -e "         ${RED}${checks_failed} failed${NC}"
    echo ""
    echo "⚠️  Please fix the failed checks before deploying"
    exit 1
else
    echo ""
    echo -e "${GREEN}🎉 All checks passed! Ready to deploy!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Add environment variables to Vercel dashboard"
    echo "2. Push code to GitHub or run 'vercel' command"
    echo "3. Deploy and celebrate! 🚀"
fi
