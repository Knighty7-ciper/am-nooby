#!/bin/bash

echo "🔒 Security Verification Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

passed=0
failed=0

# Test 1: Check for exposed credentials in .md files
echo -n "1. Checking markdown files for exposed credentials... "
if grep -rq "npg_fKoj69ErPxXi\|b9d83c23-8940-4835-8323-a13649ca0e56\|pck_q4f2q777frjx8f9vdzgvcdt2nz0v15pbqavcykk811gj8\|ssk_b2f0mysbrtcr73rq86aye7ebgkw6tf9gq6xdyb97tq4x8" --include="*.md" .; then
    echo -e "${RED}❌ FAILED - Real credentials found!${NC}"
    ((failed++))
else
    echo -e "${GREEN}✅ PASSED${NC}"
    ((passed++))
fi

# Test 2: Check .env.local has real credentials
echo -n "2. Checking .env.local has real credentials... "
if [ -f ".env.local" ] && grep -q "npg_fKoj69ErPxXi" .env.local; then
    echo -e "${GREEN}✅ PASSED${NC}"
    ((passed++))
else
    echo -e "${RED}❌ FAILED - .env.local missing or incomplete${NC}"
    ((failed++))
fi

# Test 3: Check .env.example has placeholders
echo -n "3. Checking .env.example has placeholder values... "
if [ -f ".env.example" ] && grep -q "your_database_password\|your-stack-project-id" .env.example; then
    echo -e "${GREEN}✅ PASSED${NC}"
    ((passed++))
else
    echo -e "${RED}❌ FAILED - .env.example has real credentials${NC}"
    ((failed++))
fi

# Test 4: Check .gitignore protects .env.local
echo -n "4. Checking .gitignore protects .env.local... "
if [ -f ".gitignore" ] && grep -q ".env.local" .gitignore; then
    echo -e "${GREEN}✅ PASSED${NC}"
    ((passed++))
else
    echo -e "${RED}❌ FAILED - .env.local not protected${NC}"
    ((failed++))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "Results: ${GREEN}${passed} passed${NC}, ${RED}${failed} failed${NC}"

if [ $failed -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 All security checks passed!${NC}"
    echo "Your credentials are properly protected."
    exit 0
else
    echo ""
    echo -e "${RED}⚠️  Some security checks failed!${NC}"
    echo "Please review and fix the issues above."
    exit 1
fi
