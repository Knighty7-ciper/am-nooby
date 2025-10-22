# @noobblog/database

Shared database package for NoobBlog monorepo.

## Features

- ✅ Prisma ORM with PostgreSQL
- ✅ Type-safe database queries
- ✅ Reusable query helpers
- ✅ Database migrations
- ✅ Seed data support

## Usage

```typescript
import { prisma, getUserByUsername, getPublishedPosts } from '@noobblog/database';

// Direct Prisma access
const users = await prisma.user.findMany();

// Use query helpers
const user = await getUserByUsername('john');
const { posts, pagination } = await getPublishedPosts({ page: 1, limit: 10 });
```

## Commands

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Run migrations
pnpm db:migrate

# Open Prisma Studio
pnpm db:studio

# Seed database
pnpm db:seed
```

## Query Helpers

### User Queries
- `getUserById(id)` - Get user by ID
- `getUserByUsername(username)` - Get user by username
- `getUserPosts(userId, page, limit)` - Get user's posts with pagination
- `getTopAuthors(limit)` - Get top authors
- `followUser(followerId, followingId)` - Follow a user
- `unfollowUser(followerId, followingId)` - Unfollow a user

### Post Queries
- `getPostBySlug(slug)` - Get post by slug
- `getPublishedPosts(filters)` - Get published posts with filters
- `getTrendingPosts(limit)` - Get trending posts
- `getRelatedPosts(postId, limit)` - Get related posts
- `createPost(data)` - Create a new post
- `updatePost(id, data)` - Update a post
- `deletePost(id)` - Delete a post

### Comment Queries
- `getPostComments(postId)` - Get comments for a post
- `createComment(data)` - Create a comment
- `updateComment(id, content)` - Update a comment
- `deleteComment(id)` - Delete a comment

### Category Queries
- `getAllCategories()` - Get all categories
- `getCategoryBySlug(slug)` - Get category by slug
- `createCategory(data)` - Create a category
- `updateCategory(id, data)` - Update a category
- `deleteCategory(id)` - Delete a category

### Analytics Queries
- `getAnalytics(startDate, endDate)` - Get analytics for date range
- `recordDailyAnalytics(date)` - Record daily analytics
- `getTopPostsByViews(limit, days)` - Get top posts by views
- `getDashboardStats()` - Get dashboard statistics
