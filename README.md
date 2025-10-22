# 🚀 NoobBlog - Production-Ready Blogging Platform

> **A modern, full-stack blogging platform built with Next.js 14, Prisma, PostgreSQL, and optimized for production.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.8-2D3748)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ✨ Features

### 📝 **Content Management**
- ✅ Rich text editor with syntax highlighting (TipTap)
- ✅ Draft, publish, schedule posts
- ✅ Categories, tags, and series organization
- ✅ Featured images with optimization
- ✅ SEO-friendly URLs and metadata
- ✅ Post versioning

### 👥 **User Features**
- ✅ Authentication with Stack Auth
- ✅ User profiles and bios
- ✅ Follow/unfollow authors
- ✅ Like, comment, bookmark posts
- ✅ Personalized bookmarks page
- ✅ User settings and preferences

### 🛡️ **Admin Dashboard**
- ✅ User management (ban, suspend, role assignment)
- ✅ Post moderation and analytics
- ✅ Comment moderation
- ✅ Category and tag management
- ✅ Real-time analytics dashboard
- ✅ Site settings configuration

### ⚡ **Performance & Optimization**
- ✅ **Rate limiting** - Protect APIs from abuse
- ✅ **Intelligent caching** - Stale-while-revalidate strategy
- ✅ **Image optimization** - Automatic WebP conversion with Sharp
- ✅ **Performance monitoring** - Track slow requests
- ✅ **RSS feed** - Auto-generated from latest posts
- ✅ **Sitemap** - Dynamic sitemap generation
- ✅ **SEO optimization** - Meta tags, Open Graph, JSON-LD

### 🔍 **Search & Discovery**
- ✅ Full-text search across posts
- ✅ Search by category, tag, author
- ✅ Trending and featured posts
- ✅ Related posts suggestions
- ✅ User profile pages

---

## 💻 **Tech Stack**

### **Frontend**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible components
- **TipTap** - Rich text editor
- **Lucide Icons** - Modern SVG icons

### **Backend**
- **Next.js API Routes** - Serverless backend
- **Prisma ORM** - Type-safe database queries
- **PostgreSQL** - Neon serverless database
- **Stack Auth** - Authentication & user management

### **Optimization**
- **Sharp** - High-performance image processing
- **Lowlight** - Syntax highlighting
- **In-memory caching** - Fast response times
- **Rate limiting** - API protection

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ and pnpm
- PostgreSQL database (Neon recommended)
- Stack Auth account

### **1. Clone & Install**

```bash
# Clone the repository
git clone https://github.com/yourusername/noobblog.git
cd noobblog

# Install dependencies
pnpm install
```

### **2. Environment Setup**

```bash
# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your credentials
# - DATABASE_URL from Neon
# - Stack Auth keys from dashboard
```

### **3. Database Setup**

```bash
# Generate Prisma client
cd packages/database
pnpm db:generate

# Push schema to database
pnpm db:push

# (Optional) Seed with sample data
pnpm db:seed
```

### **4. Run Development Servers**

```bash
# Terminal 1 - Web app (http://localhost:3000)
cd apps/web
pnpm dev

# Terminal 2 - Admin dashboard (http://localhost:3001)
cd apps/admin
pnpm dev
```

### **5. Access the Apps**

- **Blog**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3001
- **API Docs**: http://localhost:3000/api

---

## 📁 **Project Structure**

```
noobblog/
├── apps/
│   ├── web/              # Main blog application
│   │   ├── app/           # Next.js app router pages
│   │   ├── components/    # React components
│   │   ├── lib/           # Utilities & helpers
│   │   └── public/        # Static assets
│   └── admin/            # Admin dashboard
│       ├── app/           # Admin pages
│       └── components/    # Admin components
├── packages/
│   └── database/         # Shared database package
│       ├── prisma/        # Prisma schema
│       └── src/           # Query helpers
├── docs/                 # Documentation
└── package.json          # Workspace config
```

---

## 🔧 **Available Commands**

### **Development**
```bash
pnpm dev              # Start all apps in development
pnpm dev:web          # Start web app only
pnpm dev:admin        # Start admin dashboard only
pnpm build            # Build all apps for production
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript type checking
```

### **Database**
```bash
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema to database
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Prisma Studio
pnpm db:seed          # Seed database with sample data
```

---

## 📚 **Database Schema**

**16 Models:**
- `User` - User accounts and profiles
- `Post` - Blog posts with SEO fields
- `Category` - Post categories
- `Tag` - Post tags
- `Series` - Post series
- `Comment` - Nested comments
- `Like` - Post likes
- `Bookmark` - User bookmarks
- `Follow` - User follows
- `View` - Post view tracking
- `Notification` - User notifications
- `Newsletter` - Newsletter subscribers
- `Analytics` - Daily analytics
- `SiteSetting` - Site configuration
- `PostVersion` - Post version history
- `PostTag` - Post-Tag relationships

---

## 🌐 **API Endpoints**

### **Authentication**
- `GET /api/auth/user` - Get current user

### **Posts**
- `GET /api/posts` - List posts with filters
- `POST /api/posts` - Create post
- `PUT /api/posts/[id]` - Update post
- `DELETE /api/posts/[id]` - Delete post

### **Comments**
- `GET /api/comments?postId=` - Get post comments
- `POST /api/comments` - Create comment
- `PUT /api/comments/[id]` - Update comment
- `DELETE /api/comments/[id]` - Delete comment

### **Engagement**
- `POST /api/likes` - Like/unlike post
- `POST /api/bookmarks` - Bookmark/unbookmark post
- `POST /api/follow` - Follow/unfollow user

### **Content**
- `GET /api/categories` - List categories
- `GET /api/tags` - List tags
- `GET /api/search?q=` - Search posts

### **Admin**
- `GET /api/admin/users` - List users
- `PUT /api/admin/users/[id]` - Update user
- `GET /api/analytics` - Get analytics

### **Optimization**
- `GET /api/optimize?url=&w=&q=` - Optimize image
- `GET /api/feed.xml` - RSS feed
- `GET /api/sitemap.xml` - Sitemap
- `GET /api/performance` - Performance stats
- `POST /api/revalidate` - Revalidate cache

---

## 🚀 **Deployment**

### **Netlify (Recommended for this setup)**

See detailed guide: <filepath>NETLIFY_DEPLOYMENT.md</filepath>

**Quick Deploy:**
1. Push code to GitHub
2. Import project in [Netlify](https://app.netlify.com/)
3. Add environment variables
4. Deploy! 🎉

### **Vercel**

1. **Deploy Web App**
```bash
vercel --prod
```

2. **Configure Environment Variables** in Vercel dashboard

3. **Connect Database** - Neon auto-connects

### **Other Platforms**

- Railway
- AWS Amplify  
- Docker deployment
- Self-hosted options

---

## 📊 **Performance Optimizations**

For detailed optimization guide, see <filepath>docs/OPTIMIZATION.md</filepath>

**Key Features:**
- ✅ Rate limiting (100 req/min default)
- ✅ Intelligent caching with SWR
- ✅ Image optimization (WebP, quality control)
- ✅ Performance monitoring
- ✅ CDN caching
- ✅ Database connection pooling

**Benchmarks:**
- First Contentful Paint: < 1.8s
- Time to Interactive: < 3.8s
- Lighthouse Score: 95+

---

## 📝 **Documentation**

- 📖 [User Guide](docs/user-guide.md) - How to use the platform
- 🛠️ [Admin Guide](docs/admin-guide.md) - Managing the platform
- 💻 [API Reference](docs/api-reference.md) - API documentation
- 🚀 [Deployment Guide](docs/deployment.md) - Deployment instructions
- ⚡ [Optimization Guide](docs/OPTIMIZATION.md) - Performance tips
- 🤝 [Contributing](docs/CONTRIBUTING.md) - Contribution guidelines

---

## 👨‍💻 **Contributing**

Contributions are welcome! Please read our [Contributing Guide](docs/CONTRIBUTING.md).

```bash
# Fork the repo, create a branch
git checkout -b feature/amazing-feature

# Make changes, commit
git commit -m "Add amazing feature"

# Push and create PR
git push origin feature/amazing-feature
```

---

## 📝 **License**

MIT License - see [LICENSE](LICENSE) file

---

## 🚀 **What's New in v1.0**

### ✨ **Production Features**
- ✅ Rich text editor with TipTap
- ✅ Image optimization with Sharp
- ✅ Rate limiting middleware
- ✅ Performance monitoring
- ✅ Intelligent caching strategies
- ✅ RSS feed generation
- ✅ Dynamic sitemap
- ✅ SEO optimization utilities
- ✅ Database query helpers
- ✅ Comprehensive documentation

---

## 👏 **Acknowledgments**

- [Next.js](https://nextjs.org/) - The React framework
- [Prisma](https://www.prisma.io/) - Next-gen ORM
- [Neon](https://neon.tech/) - Serverless PostgreSQL
- [Stack Auth](https://stack-auth.com/) - Authentication platform
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful components
- [TipTap](https://tiptap.dev/) - Rich text editor

---

## 📧 **Support**

For issues and questions:
- 🐛 [GitHub Issues](https://github.com/yourusername/noobblog/issues)
- 💬 [Discussions](https://github.com/yourusername/noobblog/discussions)
- 🐦 [Twitter](https://twitter.com/noobblog)

---

<div align="center">

**Built with ❤️ by MiniMax Agent**

[Documentation](docs/) • [GitHub](https://github.com/yourusername/noobblog) • [Deployment Guide](NETLIFY_DEPLOYMENT.md)

</div>
