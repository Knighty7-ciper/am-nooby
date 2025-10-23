import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  console.log('🗑️  Clearing existing data...')
  await prisma.postTag.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.like.deleteMany()
  await prisma.bookmark.deleteMany()
  await prisma.view.deleteMany()
  await prisma.follow.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.post.deleteMany()
  await prisma.category.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  console.log('👤 Creating users...')
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john@example.com',
        username: 'john_doe',
        name: 'John Doe',
        bio: 'Full-stack developer and tech enthusiast. Love writing about web development and software engineering.',
        role: 'AUTHOR',
        status: 'ACTIVE',
        followerCount: 150,
        postCount: 5,
      },
    }),
    prisma.user.create({
      data: {
        email: 'jane@example.com',
        username: 'jane_smith',
        name: 'Jane Smith',
        bio: 'UX designer passionate about creating delightful user experiences.',
        role: 'AUTHOR',
        status: 'ACTIVE',
        followerCount: 230,
        postCount: 8,
      },
    }),
    prisma.user.create({
      data: {
        email: 'alex@example.com',
        username: 'alex_dev',
        name: 'Alex Johnson',
        bio: 'DevOps engineer sharing insights about cloud infrastructure and automation.',
        role: 'AUTHOR',
        status: 'ACTIVE',
        followerCount: 89,
        postCount: 3,
      },
    }),
  ])

  // Create categories
  console.log('📁 Creating categories...')
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Technology',
        slug: 'technology',
        description: 'Latest tech trends and innovations',
        color: '#3b82f6',
        postCount: 8,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Design',
        slug: 'design',
        description: 'UI/UX design and creative workflows',
        color: '#8b5cf6',
        postCount: 5,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Development',
        slug: 'development',
        description: 'Programming tutorials and best practices',
        color: '#10b981',
        postCount: 12,
      },
    }),
    prisma.category.create({
      data: {
        name: 'DevOps',
        slug: 'devops',
        description: 'Cloud, CI/CD, and infrastructure',
        color: '#f59e0b',
        postCount: 4,
      },
    }),
  ])

  // Create tags
  console.log('🏷️  Creating tags...')
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'JavaScript', slug: 'javascript', postCount: 6 } }),
    prisma.tag.create({ data: { name: 'React', slug: 'react', postCount: 8 } }),
    prisma.tag.create({ data: { name: 'TypeScript', slug: 'typescript', postCount: 5 } }),
    prisma.tag.create({ data: { name: 'Next.js', slug: 'nextjs', postCount: 7 } }),
    prisma.tag.create({ data: { name: 'CSS', slug: 'css', postCount: 4 } }),
    prisma.tag.create({ data: { name: 'Tailwind', slug: 'tailwind', postCount: 5 } }),
    prisma.tag.create({ data: { name: 'Node.js', slug: 'nodejs', postCount: 3 } }),
    prisma.tag.create({ data: { name: 'UI Design', slug: 'ui-design', postCount: 4 } }),
  ])

  // Create posts
  console.log('📝 Creating posts...')
  const posts = [
    {
      title: 'Getting Started with Next.js 14',
      slug: 'getting-started-with-nextjs-14',
      excerpt: 'Learn how to build modern web applications with Next.js 14 and the App Router.',
      content: `# Getting Started with Next.js 14

Next.js 14 introduces powerful new features that make building web applications easier than ever.

## Key Features

- **Server Components**: Build faster, more efficient applications
- **App Router**: New routing system with layouts and templates
- **Turbopack**: Lightning-fast bundler for development

## Installation

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

This will create a new Next.js application with all the latest features.

## Conclusion

Next.js 14 is a game-changer for web development!`,
      authorId: users[0].id,
      categoryId: categories[2].id,
      status: 'PUBLISHED' as const,
      featured: true,
      publishedAt: new Date('2024-01-15'),
      viewCount: 1250,
      likeCount: 89,
      commentCount: 12,
      readingTime: 5,
    },
    {
      title: 'Modern CSS Techniques for 2024',
      slug: 'modern-css-techniques-2024',
      excerpt: 'Explore the latest CSS features and techniques that will transform your web designs.',
      content: `# Modern CSS Techniques for 2024

CSS has evolved significantly. Here are the techniques you should know.

## Container Queries

Responsive design just got better with container queries.

## CSS Grid Mastery

Create complex layouts with ease using modern CSS Grid.

## Custom Properties

Dynamic theming has never been easier!`,
      authorId: users[1].id,
      categoryId: categories[1].id,
      status: 'PUBLISHED' as const,
      featured: true,
      publishedAt: new Date('2024-01-18'),
      viewCount: 890,
      likeCount: 67,
      commentCount: 8,
      readingTime: 4,
    },
    {
      title: 'Building Scalable APIs with Node.js',
      slug: 'building-scalable-apis-nodejs',
      excerpt: 'Best practices for creating robust and scalable REST APIs using Node.js and Express.',
      content: `# Building Scalable APIs with Node.js

Learn how to build production-ready APIs.

## Architecture

A well-structured API is crucial for maintainability.

## Security

Never compromise on security - implement proper authentication and validation.

## Performance

Optimize your API for speed and efficiency.`,
      authorId: users[0].id,
      categoryId: categories[2].id,
      status: 'PUBLISHED' as const,
      featured: false,
      publishedAt: new Date('2024-01-20'),
      viewCount: 654,
      likeCount: 45,
      commentCount: 6,
      readingTime: 7,
    },
    {
      title: 'The Power of TypeScript',
      slug: 'the-power-of-typescript',
      excerpt: 'Why TypeScript has become the go-to language for modern web development.',
      content: `# The Power of TypeScript

TypeScript brings type safety to JavaScript.

## Benefits

- Better IDE support
- Fewer runtime errors
- Improved code quality

## Getting Started

It's easier than you think!`,
      authorId: users[2].id,
      categoryId: categories[2].id,
      status: 'PUBLISHED' as const,
      featured: false,
      publishedAt: new Date('2024-01-22'),
      viewCount: 432,
      likeCount: 34,
      commentCount: 5,
      readingTime: 3,
    },
    {
      title: 'UX Design Principles Every Developer Should Know',
      slug: 'ux-design-principles',
      excerpt: 'Bridge the gap between design and development with these essential UX principles.',
      content: `# UX Design Principles

Good UX is not just for designers.

## User-Centered Design

Always put the user first.

## Accessibility

Make your products usable for everyone.

## Consistency

Consistent interfaces reduce cognitive load.`,
      authorId: users[1].id,
      categoryId: categories[1].id,
      status: 'PUBLISHED' as const,
      featured: true,
      publishedAt: new Date('2024-01-25'),
      viewCount: 1100,
      likeCount: 92,
      commentCount: 15,
      readingTime: 6,
    },
  ]

  const createdPosts = []
  for (const postData of posts) {
    const post = await prisma.post.create({
      data: postData,
    })
    createdPosts.push(post)
  }

  // Add tags to posts
  console.log('🔗 Linking tags to posts...')
  await prisma.postTag.createMany({
    data: [
      { postId: createdPosts[0].id, tagId: tags[3].id }, // Next.js
      { postId: createdPosts[0].id, tagId: tags[1].id }, // React
      { postId: createdPosts[0].id, tagId: tags[2].id }, // TypeScript
      { postId: createdPosts[1].id, tagId: tags[4].id }, // CSS
      { postId: createdPosts[1].id, tagId: tags[5].id }, // Tailwind
      { postId: createdPosts[2].id, tagId: tags[6].id }, // Node.js
      { postId: createdPosts[2].id, tagId: tags[0].id }, // JavaScript
      { postId: createdPosts[3].id, tagId: tags[2].id }, // TypeScript
      { postId: createdPosts[3].id, tagId: tags[0].id }, // JavaScript
      { postId: createdPosts[4].id, tagId: tags[7].id }, // UI Design
    ],
  })

  console.log('✅ Database seeded successfully!')
  console.log(`   👤 Created ${users.length} users`)
  console.log(`   📁 Created ${categories.length} categories`)
  console.log(`   🏷️  Created ${tags.length} tags`)
  console.log(`   📝 Created ${createdPosts.length} posts`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
