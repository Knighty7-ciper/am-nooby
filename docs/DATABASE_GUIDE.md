# 🗄️ Database Setup Guide - NoobBlog

## 📋 **TL;DR - No SQL Files Needed!**

**This project uses Prisma ORM**, which means:
- ❌ No manual SQL files
- ❌ No SQL queries to write
- ✅ Everything is TypeScript
- ✅ Database is managed via `schema.prisma`
- ✅ Neon PostgreSQL is your cloud database

---

## 🔗 **How It All Connects**

\`\`\`
┌─────────────────────────────────────────────────┐
│  1. schema.prisma                               │
│     Define models in TypeScript-like syntax     │
│     ↓                                           │
│  2. Prisma CLI                                  │
│     Converts schema to SQL automatically        │
│     ↓                                           │
│  3. Neon PostgreSQL (Cloud)                     │
│     Serverless database (already created)       │
│     ↓                                           │
│  4. Prisma Client                               │
│     Generated TypeScript code for queries       │
│     ↓                                           │
│  5. Your App (Next.js)                          │
│     Use type-safe queries without SQL           │
└─────────────────────────────────────────────────┘
\`\`\`

---

## 🚀 **Quick Setup (3 Steps)**

### **Method 1: Use the Setup Script**

\`\`\`bash
# Linux/Mac
bash setup-database.sh

# Windows
setup-database.bat
\`\`\`

### **Method 2: Manual Setup**

\`\`\`bash
# 1. Install dependencies
pnpm install

# 2. Generate Prisma Client
cd packages/database
pnpm db:generate

# 3. Create tables in Neon
pnpm db:push
\`\`\`

**That's it!** Your database is ready.

---

## 🧐 **What Happens Behind the Scenes**

### **When you run `pnpm db:push`:**

1. **Prisma reads your schema:**
   \`\`\`prisma
   model User {
     id       String @id @default(cuid())
     email    String @unique
     username String @unique
   }
   \`\`\`

2. **Generates SQL automatically:**
   \`\`\`sql
   CREATE TABLE "User" (
     "id" TEXT PRIMARY KEY,
     "email" TEXT UNIQUE NOT NULL,
     "username" TEXT UNIQUE NOT NULL
   );
   
   CREATE INDEX "User_email_idx" ON "User"("email");
   CREATE INDEX "User_username_idx" ON "User"("username");
   \`\`\`

3. **Executes on Neon database:**
   - Connects to your Neon PostgreSQL instance
   - Creates all 16 tables
   - Sets up indexes, foreign keys, constraints
   - Ready to use!

---

## 📊 **Your Database Structure**

### **16 Tables Created Automatically:**

1. **User** - User accounts and profiles
2. **Post** - Blog posts with SEO fields
3. **Category** - Post categories
4. **Tag** - Post tags
5. **PostTag** - Post-Tag relationships
6. **Series** - Post series
7. **Comment** - Nested comments
8. **Like** - Post likes
9. **Bookmark** - User bookmarks
10. **Follow** - User follows
11. **View** - Post view tracking
12. **Notification** - User notifications
13. **Newsletter** - Newsletter subscribers
14. **Analytics** - Daily analytics
15. **PostVersion** - Post version history
16. **SiteSetting** - Site configuration

### **All with:**
- ✅ Primary keys
- ✅ Foreign keys
- ✅ Indexes for performance
- ✅ Unique constraints
- ✅ Default values
- ✅ Cascade deletions

---

## 🌐 **About Neon PostgreSQL**

### **What is Neon?**

Neon is a **serverless PostgreSQL** database provider:
- ☁️ **Fully managed** - No server setup needed
- ⚡ **Serverless** - Scales automatically
- 🚀 **Fast** - Connection pooling built-in
- 💰 **Free tier** - Generous limits for development
- 🔐 **Secure** - SSL connections by default

### **Your Neon Database:**

From your `.env.local`:
\`\`\`bash
DATABASE_URL="postgresql://neondb_owner:npg_fKoj69ErPxXi@ep-shiny-math-ahr6vjv4-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
\`\`\`

**What this means:**
- `neondb_owner` - Your database user
- `ep-shiny-math-ahr6vjv4-pooler` - Your database endpoint (pooled)
- `neondb` - Your database name
- `sslmode=require` - Secure connection

### **Neon Features You're Using:**
- ✅ Connection pooling (fast performance)
- ✅ Automatic backups
- ✅ Zero cold starts
- ✅ Branching (create dev/staging databases)

---

## 💻 **How to Use in Your Code**

### **No SQL Queries Needed!**

**Old way (SQL):**
\`\`\`typescript
// ❌ DON'T do this
const result = await db.query(`
  SELECT * FROM posts 
  WHERE status = 'PUBLISHED' 
  ORDER BY created_at DESC
`);
\`\`\`

**New way (Prisma):**
\`\`\`typescript
// ✅ DO this instead
import { prisma } from '@noobblog/database';

const posts = await prisma.post.findMany({
  where: { status: 'PUBLISHED' },
  orderBy: { createdAt: 'desc' },
  include: { author: true },
});
\`\`\`

### **Or Use Query Helpers:**
\`\`\`typescript
import { getPublishedPosts } from '@noobblog/database';

const { posts, pagination } = await getPublishedPosts({
  page: 1,
  limit: 10,
  categoryId: 'tech',
});
\`\`\`

---

## 🛠️ **Common Database Commands**

### **Development**

\`\`\`bash
# Generate Prisma Client (after schema changes)
pnpm db:generate

# Push schema to database (creates/updates tables)
pnpm db:push

# Open Prisma Studio (visual database editor)
pnpm db:studio
# Then open: http://localhost:5555

# Seed database with sample data
pnpm db:seed
\`\`\`

### **Production**

\`\`\`bash
# Create a migration (for production)
pnpm db:migrate

# This creates a SQL migration file for version control
# Example: packages/database/prisma/migrations/20231201_init/migration.sql
\`\`\`

---

## 🔍 **Viewing Your Database**

### **Option 1: Prisma Studio (Recommended)**

\`\`\`bash
cd packages/database
pnpm db:studio
\`\`\`

- Opens at http://localhost:5555
- Visual interface to browse/edit data
- No SQL knowledge needed

### **Option 2: Neon Dashboard**

1. Go to https://console.neon.tech
2. Login with your account
3. Select your database
4. Use SQL Editor or Tables view

### **Option 3: DBeaver / TablePlus**

Connect using your `DATABASE_URL_UNPOOLED`:
\`\`\`
Host: ep-shiny-math-ahr6vjv4.c-3.us-east-1.aws.neon.tech
Port: 5432
Database: neondb
User: neondb_owner
Password: npg_fKoj69ErPxXi
SSL: Required
\`\`\`

---

## 📝 **Making Schema Changes**

### **Example: Add a new field**

1. **Edit schema.prisma:**
\`\`\`prisma
model Post {
  id      String @id
  title   String
  views   Int    @default(0)  // ← Add this
}
\`\`\`

2. **Push to database:**
\`\`\`bash
pnpm db:push
\`\`\`

3. **Prisma automatically:**
   - Adds the column to the database
   - Regenerates TypeScript types
   - Updates Prisma Client

4. **Use in code immediately:**
\`\`\`typescript
const post = await prisma.post.update({
  where: { id: '123' },
  data: { views: { increment: 1 } },  // ← TypeScript knows about 'views'
});
\`\`\`

---

## 🔐 **Database Migrations (Production)**

### **Development vs Production**

**Development (what we're using):**
\`\`\`bash
pnpm db:push  # Quick, no migration files
\`\`\`

**Production (recommended):**
\`\`\`bash
pnpm db:migrate  # Creates migration files
\`\`\`

### **Why use migrations in production?**

1. **Version control** - Track database changes in git
2. **Rollback** - Revert changes if needed
3. **Team sync** - Everyone has same database structure
4. **Safety** - Migrations are reviewed before deployment

### **Migration workflow:**

\`\`\`bash
# 1. Make schema changes
# Edit schema.prisma

# 2. Create migration
pnpm db:migrate dev --name add_views_to_posts
# Creates: packages/database/prisma/migrations/20231201_add_views_to_posts/migration.sql

# 3. Review the SQL
cat packages/database/prisma/migrations/*/migration.sql

# 4. Commit to git
git add packages/database/prisma/migrations
git commit -m "Add views counter to posts"

# 5. Deploy (migrations run automatically on Vercel)
vercel --prod
\`\`\`

---

## 🚨 **Troubleshooting**

### **Error: "Can't reach database server"**

**Fix:**
\`\`\`bash
# Check your DATABASE_URL in .env.local
echo $DATABASE_URL

# Make sure you're using the pooled URL
# Should end with: -pooler.c-3.us-east-1.aws.neon.tech
\`\`\`

### **Error: "Table doesn't exist"**

**Fix:**
\`\`\`bash
# Push schema to create tables
cd packages/database
pnpm db:push
\`\`\`

### **Error: "Prisma Client is not generated"**

**Fix:**
\`\`\`bash
# Generate Prisma Client
cd packages/database
pnpm db:generate
\`\`\`

### **Error: "Column doesn't exist"**

**Fix:**
\`\`\`bash
# Schema and database are out of sync
pnpm db:push  # Updates database to match schema
\`\`\`

---

## 📚 **Learn More**

- **Prisma Docs:** https://www.prisma.io/docs
- **Neon Docs:** https://neon.tech/docs
- **Schema Reference:** `packages/database/prisma/schema.prisma`
- **Query Helpers:** `packages/database/src/queries/`

---

## ✅ **Summary**

### **What you have:**
- ✅ 16 tables in Neon PostgreSQL
- ✅ Type-safe database queries
- ✅ No SQL needed in your code
- ✅ Automatic migrations
- ✅ Visual database editor (Prisma Studio)
- ✅ Production-ready setup

### **Quick reference:**
\`\`\`bash
pnpm db:generate  # Generate Prisma Client
pnpm db:push      # Update database schema
pnpm db:studio    # View/edit data visually
pnpm db:seed      # Add sample data
\`\`\`

**Your database is ready! No SQL files needed! 🎉**
