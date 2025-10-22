#!/bin/bash

# NoobBlog Development Setup Script

echo "🚀 Setting up NoobBlog development environment..."
echo ""

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Installing pnpm..."
    npm install -g pnpm
fi

echo "📦 Installing dependencies..."
pnpm install

echo ""
echo "🗄️  Setting up database..."
cd packages/database
pnpm prisma generate
pnpm prisma db push
cd ../..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Copy .env.example to .env and update values"
echo "2. Run 'pnpm dev:web' to start the main blog"
echo "3. Run 'pnpm dev:admin' to start the admin dashboard"
echo ""
echo "🎉 Happy blogging!"
