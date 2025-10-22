#!/bin/bash

# NoobBlog Database Setup Script
# This sets up your Neon PostgreSQL database via Prisma

echo "🗄️  NoobBlog Database Setup"
echo "================================"

echo ""
echo "📋 Step 1: Checking environment variables..."
if [ -f .env.local ]; then
    echo "✅ .env.local found"
    if grep -q "DATABASE_URL" .env.local; then
        echo "✅ DATABASE_URL is configured"
    else
        echo "❌ DATABASE_URL not found in .env.local"
        echo "Please add your Neon database URL to .env.local"
        exit 1
    fi
else
    echo "⚠️  .env.local not found"
    echo "Copying from .env.example..."
    cp .env.example .env.local
    echo "⚠️  Please edit .env.local and add your DATABASE_URL"
    exit 1
fi

echo ""
echo "📦 Step 2: Installing dependencies..."
pnpm install

echo ""
echo "🔧 Step 3: Generating Prisma Client..."
cd packages/database
pnpm db:generate

echo ""
echo "🚀 Step 4: Pushing schema to Neon database..."
echo "This will create all 16 tables in your Neon database"
pnpm db:push

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ DATABASE SETUP COMPLETE!"
    echo ""
    echo "Your Neon database now has:"
    echo "  • 16 tables (User, Post, Comment, etc.)"
    echo "  • All indexes and relations configured"
    echo "  • Ready for production use"
    echo ""
    echo "🎯 Next steps:"
    echo "  1. Run 'pnpm dev:web' to start the blog"
    echo "  2. Run 'pnpm dev:admin' to start the admin dashboard"
    echo "  3. (Optional) Run 'pnpm db:seed' to add sample data"
    echo "  4. (Optional) Run 'pnpm db:studio' to view data in browser"
else
    echo ""
    echo "❌ Database setup failed"
    echo "Please check your DATABASE_URL in .env.local"
    exit 1
fi
