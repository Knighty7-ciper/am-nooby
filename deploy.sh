#!/bin/bash

# Deployment Script - Push fixes to trigger Netlify deployment
# This script commits and pushes all the TypeScript fixes

echo "🚀 Deploying fixes to Netlify..."
echo ""

# Change to project directory
cd project/am-nooby

# Check git status
echo "📋 Checking git status..."
git status

echo ""
echo "📦 Staging changes..."
git add -A

echo ""
echo "💬 Committing changes..."
git commit -m "Fix TypeScript errors: Replace 'email' with 'primaryEmail' for Stack Auth types

- Fix stackUser.email to stackUser.primaryEmail in admin setup route
- Fix user.email to user.primaryEmail in session management  
- Resolves TypeScript compilation error preventing Netlify deployment
- Maintains automatic admin setup functionality for bknglabs.dev@gmail.com"

echo ""
echo "⬆️  Pushing to trigger Netlify deployment..."
git push origin main

echo ""
echo "✅ Deployment initiated! Netlify will now build and deploy."
echo ""
echo "🔍 Next steps:"
echo "1. Check Netlify build logs for success"
echo "2. Test admin sign-in with bknglabs.dev@gmail.com"
echo "3. Verify admin dashboard at /admino77"
echo ""
echo "📖 See DEPLOYMENT_VERIFICATION_GUIDE.md for detailed testing steps"