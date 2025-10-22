# 🏛️ NoobBlog Architecture

## 🗺️ **Complete System Architecture**

\`\`\`
┌────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                            │
│────────────────────────────────────────────────────────────────│
│                                                                  │
│  ┌────────────────────────┐    ┌─────────────────────────┐  │
│  │   Web App (Port 3000)    │    │  Admin Dashboard (3001)  │  │
│  │  Next.js 14 + React 18  │    │   Next.js 14 + React 18  │  │
│  │                          │    │                          │  │
│  │  • Home, Posts, Search   │    │  • Users, Posts, Stats  │  │
│  │  • User Profiles         │    │  • Analytics Dashboard  │  │
│  │  • Categories, Tags      │    │  • Moderation Tools     │  │
│  │  • Rich Text Editor      │    │  • Site Settings        │  │
│  └────────────────────────┘    └─────────────────────────┘  │
│          ↓                              ↓                    │
└────────────────────────────────────────────────────────────────┘
          ↓                              ↓
┌────────────────────────────────────────────────────────────────┐
│                         API LAYER                                │
│────────────────────────────────────────────────────────────────│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Next.js API Routes (24 endpoints)            │  │
│  │                                                             │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  Middleware Layer                                │  │  │
│  │  │  • Rate Limiting (100 req/min)                   │  │  │
│  │  │  • Performance Monitoring                        │  │  │
│  │  │  • Caching (Stale-While-Revalidate)             │  │  │
│  │  │  • Authentication (Stack Auth)                  │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │                                                             │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  API Endpoints                                   │  │  │
│  │  │  • /api/posts - CRUD operations                  │  │  │
│  │  │  • /api/comments - Comment management             │  │  │
│  │  │  • /api/likes - Engagement tracking               │  │  │
│  │  │  • /api/search - Full-text search                 │  │  │
│  │  │  • /api/optimize - Image optimization             │  │  │
│  │  │  • /api/feed.xml - RSS feed                       │  │  │
│  │  │  • /api/sitemap.xml - SEO sitemap                 │  │  │
│  │  │  • /api/admin/* - Admin operations                │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────┘  │
│                            ↓                                  │
└────────────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                              │
│────────────────────────────────────────────────────────────────│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Prisma ORM (Type-Safe Database Queries)              │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Query Helpers (@noobblog/database)              │  │  │
│  │  │  • getUserByUsername()                          │  │  │
│  │  │  • getPublishedPosts()                          │  │  │
│  │  │  • createComment()                              │  │  │
│  │  │  • followUser() / unfollowUser()                │  │  │
│  │  │  • getTrendingPosts()                           │  │  │
│  │  │  • 40+ optimized query functions                │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Schema Definition (schema.prisma)               │  │  │
│  │  │  16 Models:                                      │  │  │
│  │  │  User, Post, Comment, Category, Tag,             │  │  │
│  │  │  Like, Bookmark, Follow, View, Series,           │  │  │
│  │  │  Notification, Newsletter, Analytics, etc.       │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────┘  │
│                            ↓                                  │
└────────────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────────┐
│                    NEON POSTGRESQL                               │
│                  (Serverless Database)                          │
│────────────────────────────────────────────────────────────────│
│                                                                  │
│  Database: neondb                                                │
│  Region: US East (AWS)                                           │
│  Connection: Pooled (for performance)                            │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  16 Tables (Created automatically by Prisma)         │  │
│  │                                                           │  │
│  │  • Users (with roles, stats, social links)             │  │
│  │  • Posts (with SEO, versioning, stats)                 │  │
│  │  • Comments (nested/threaded)                          │  │
│  │  • Categories, Tags, Series                            │  │
│  │  • Likes, Bookmarks, Follows                           │  │
│  │  • Views, Notifications, Analytics                    │  │
│  │  • All with indexes, foreign keys, constraints        │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Features:                                                        │
│  ✅ Auto-scaling                                                 │
│  ✅ Connection pooling                                          │
│  ✅ Automatic backups                                           │
│  ✅ SSL encryption                                              │
│  ✅ Database branching (dev/staging/prod)                       │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
│────────────────────────────────────────────────────────────────│
│                                                                  │
│  ┌──────────────────────────┐  ┌──────────────────────────┐  │
│  │    Stack Auth          │  │   Sharp (Server)     │  │
│  │  Authentication      │  │  Image Processing   │  │
│  │  & User Management   │  │  WebP Conversion    │  │
│  └──────────────────────────┘  └──────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
\`\`\`

---

## 🔄 **Data Flow Example: Creating a Post**

\`\`\`
1. User clicks "Publish" in Rich Text Editor
   ↓
2. Frontend (Next.js) sends POST to /api/posts
   ↓
3. API Route applies middleware:
   - Rate limiting check (passed)
   - Authentication check (user logged in)
   - Performance monitoring starts
   ↓
4. API Route calls Prisma query:
   createPost({ title, content, authorId })
   ↓
5. Prisma generates SQL:
   INSERT INTO "Post" (id, title, content, author_id) ...
   ↓
6. SQL executes on Neon PostgreSQL
   - Row inserted in "Post" table
   - Indexes updated automatically
   - Foreign key validated (authorId exists)
   ↓
7. Neon returns data to Prisma
   ↓
8. Prisma returns typed object to API
   ↓
9. API returns JSON to frontend
   - Performance monitoring logs duration
   - Cache headers set for optimization
   ↓
10. Frontend updates UI with new post
\`\`\`

---

## 🔑 **Key Points**

### **❌ What You DON'T Need:**
- SQL files
- Manual database setup
- SQL queries in code
- Database migration scripts (Prisma handles it)
- Connection pool management

### **✅ What You HAVE:**
- Type-safe queries
- Automatic SQL generation
- Cloud PostgreSQL (Neon)
- Connection pooling
- Automatic migrations
- Visual database editor (Prisma Studio)

---

## 🚀 **Getting Started**

\`\`\`bash
# 1. Setup database (ONE TIME)
bash setup-database.sh

# 2. Start developing
pnpm dev:web

# 3. View database visually (optional)
pnpm db:studio
\`\`\`

**That's it!** No SQL knowledge required! 🎉
