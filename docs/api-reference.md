# API Reference

## Overview

NoobBlog provides a REST API for programmatic access to platform features.

**Base URL**: `https://noobblog.vercel.app/api`

## Authentication

Most endpoints require authentication using Stack Auth tokens.

### Getting Token

```javascript
import { useStackApp } from '@stack-auth/next'

const { user } = useStackApp()
const token = await user?.getAuthToken()
```

### Using Token

```javascript
fetch('/api/posts', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

## Endpoints

### Posts

#### Get All Posts

```http
GET /api/posts
```

**Query Parameters**:
- `page` (number): Page number (default: 1)
- `limit` (number): Posts per page (default: 20)
- `category` (string): Filter by category slug
- `tag` (string): Filter by tag slug
- `author` (string): Filter by author username

**Response**:
```json
{
  "posts": [
    {
      "id": "...",
      "title": "Post Title",
      "slug": "post-title",
      "excerpt": "...",
      "coverImage": "https://...",
      "author": { ... },
      "category": { ... },
      "tags": [ ... ],
      "publishedAt": "2025-01-01T00:00:00Z",
      "viewCount": 100,
      "likeCount": 10
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

#### Create Post

```http
POST /api/posts
```

**Auth Required**: Yes

**Request Body**:
```json
{
  "title": "Post Title",
  "slug": "post-title",
  "excerpt": "Brief description",
  "content": "<p>Post content</p>",
  "coverImage": "https://...",
  "categoryId": "...",
  "tags": ["javascript", "tutorial"],
  "status": "DRAFT",
  "metaTitle": "SEO Title",
  "metaDescription": "SEO Description",
  "keywords": ["keyword1", "keyword2"]
}
```

**Response**:
```json
{
  "post": { ... }
}
```

#### Get Single Post

```http
GET /api/posts/[slug]
```

**Response**:
```json
{
  "post": { ... }
}
```

#### Update Post

```http
PUT /api/posts/[id]
```

**Auth Required**: Yes (must be author or admin)

**Request Body**: Same as create

#### Delete Post

```http
DELETE /api/posts/[id]
```

**Auth Required**: Yes (must be author or admin)

### Comments

#### Get Comments

```http
GET /api/posts/[postId]/comments
```

**Response**:
```json
{
  "comments": [
    {
      "id": "...",
      "content": "Great post!",
      "user": { ... },
      "createdAt": "...",
      "likeCount": 5
    }
  ]
}
```

#### Create Comment

```http
POST /api/posts/[postId]/comments
```

**Auth Required**: Yes

**Request Body**:
```json
{
  "content": "Great post!",
  "parentId": "..." // optional, for replies
}
```

### Likes

#### Like Post

```http
POST /api/posts/[postId]/like
```

**Auth Required**: Yes

#### Unlike Post

```http
DELETE /api/posts/[postId]/like
```

**Auth Required**: Yes

### Bookmarks

#### Bookmark Post

```http
POST /api/posts/[postId]/bookmark
```

**Auth Required**: Yes

#### Remove Bookmark

```http
DELETE /api/posts/[postId]/bookmark
```

**Auth Required**: Yes

### Newsletter

#### Subscribe

```http
POST /api/newsletter/subscribe
```

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

#### Unsubscribe

```http
POST /api/newsletter/unsubscribe
```

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

### Users

#### Get User Profile

```http
GET /api/users/[username]
```

**Response**:
```json
{
  "user": {
    "id": "...",
    "username": "johndoe",
    "name": "John Doe",
    "avatar": "https://...",
    "bio": "...",
    "postCount": 10,
    "followerCount": 100
  }
}
```

#### Follow User

```http
POST /api/users/[userId]/follow
```

**Auth Required**: Yes

#### Unfollow User

```http
DELETE /api/users/[userId]/follow
```

**Auth Required**: Yes

### Categories

#### Get All Categories

```http
GET /api/categories
```

**Response**:
```json
{
  "categories": [
    {
      "id": "...",
      "name": "Technology",
      "slug": "technology",
      "postCount": 50
    }
  ]
}
```

### Tags

#### Get All Tags

```http
GET /api/tags
```

**Response**:
```json
{
  "tags": [
    {
      "id": "...",
      "name": "JavaScript",
      "slug": "javascript",
      "postCount": 25
    }
  ]
}
```

### Search

#### Search Content

```http
GET /api/search?q=query
```

**Query Parameters**:
- `q` (string): Search query
- `type` (string): `posts`, `users`, or `all`

**Response**:
```json
{
  "results": {
    "posts": [ ... ],
    "users": [ ... ]
  }
}
```

## Error Handling

### Error Response Format

```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Server Error

## Rate Limiting

- **Unauthenticated**: 100 requests/hour
- **Authenticated**: 1000 requests/hour
- **Admin**: No limit

## Webhooks

Receive real-time updates for events.

### Available Events

- `post.created`
- `post.published`
- `comment.created`
- `user.registered`

### Setup

1. Go to Admin Dashboard → Settings → Webhooks
2. Add webhook URL
3. Select events
4. Save

### Payload Example

```json
{
  "event": "post.published",
  "timestamp": "2025-01-01T00:00:00Z",
  "data": {
    "post": { ... }
  }
}
```

## SDK

### JavaScript/TypeScript

Install:
```bash
npm install @noobblog/sdk
```

Usage:
```javascript
import { NoobBlog } from '@noobblog/sdk'

const client = new NoobBlog({
  apiKey: 'your-api-key'
})

const posts = await client.posts.list()
```

## Support

Questions about the API?
- Email: api@noobblog.com
- Discord: /discord
