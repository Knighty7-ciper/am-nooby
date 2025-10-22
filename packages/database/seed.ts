import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@noobblog.com' },
    update: {},
    create: {
      email: 'admin@noobblog.com',
      username: 'admin',
      name: 'Admin User',
      role: UserRole.ADMIN,
      bio: 'Platform administrator',
      emailVerified: true,
    },
  })

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'technology' },
      update: {},
      create: {
        name: 'Technology',
        slug: 'technology',
        description: 'Latest in tech, programming, and innovation',
        icon: '💻',
        color: '#3b82f6',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'web-development' },
      update: {},
      create: {
        name: 'Web Development',
        slug: 'web-development',
        description: 'HTML, CSS, JavaScript, and modern frameworks',
        icon: '🌐',
        color: '#10b981',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'design' },
      update: {},
      create: {
        name: 'Design',
        slug: 'design',
        description: 'UI/UX, graphics, and creative design',
        icon: '🎨',
        color: '#f59e0b',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'career' },
      update: {},
      create: {
        name: 'Career',
        slug: 'career',
        description: 'Career advice, interviews, and growth',
        icon: '💼',
        color: '#8b5cf6',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'productivity' },
      update: {},
      create: {
        name: 'Productivity',
        slug: 'productivity',
        description: 'Tips and tools to boost productivity',
        icon: '⚡',
        color: '#ec4899',
      },
    }),
  ])

  // Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'javascript' },
      update: {},
      create: { name: 'JavaScript', slug: 'javascript' },
    }),
    prisma.tag.upsert({
      where: { slug: 'typescript' },
      update: {},
      create: { name: 'TypeScript', slug: 'typescript' },
    }),
    prisma.tag.upsert({
      where: { slug: 'react' },
      update: {},
      create: { name: 'React', slug: 'react' },
    }),
    prisma.tag.upsert({
      where: { slug: 'nextjs' },
      update: {},
      create: { name: 'Next.js', slug: 'nextjs' },
    }),
    prisma.tag.upsert({
      where: { slug: 'tailwindcss' },
      update: {},
      create: { name: 'Tailwind CSS', slug: 'tailwindcss' },
    }),
  ])

  // Create sample post
  const post = await prisma.post.upsert({
    where: { slug: 'welcome-to-noobblog' },
    update: {},
    create: {
      slug: 'welcome-to-noobblog',
      title: 'Welcome to NoobBlog - Your New Blogging Platform',
      excerpt: 'Discover the features and capabilities of NoobBlog, a modern blogging platform built with cutting-edge technologies.',
      content: `# Welcome to NoobBlog!

We're excited to introduce **NoobBlog**, a professional blogging platform designed for writers, developers, and content creators.

## Features

- **Rich Content Editor**: Write with a beautiful Notion-style editor
- **SEO Optimized**: Built-in SEO tools to boost your visibility
- **Analytics Dashboard**: Track your content performance
- **Community Features**: Engage with readers through comments and reactions
- **Newsletter Integration**: Grow your audience

## Get Started

1. Create your account
2. Write your first post
3. Share with the world

Happy blogging! 🚀`,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      featured: true,
      authorId: admin.id,
      categoryId: categories[0].id,
      readingTime: 2,
    },
  })

  // Link tags to post
  await prisma.postTag.createMany({
    data: [
      { postId: post.id, tagId: tags[0].id },
      { postId: post.id, tagId: tags[3].id },
    ],
    skipDuplicates: true,
  })

  // Create site settings
  await prisma.siteSetting.upsert({
    where: { key: 'site_name' },
    update: {},
    create: { key: 'site_name', value: 'NoobBlog' },
  })

  await prisma.siteSetting.upsert({
    where: { key: 'site_description' },
    update: {},
    create: { key: 'site_description', value: 'A professional blogging platform for everyone' },
  })

  await prisma.siteSetting.upsert({
    where: { key: 'site_logo' },
    update: {},
    create: { key: 'site_logo', value: '/logo.svg' },
  })

  console.log('✅ Database seeded successfully!')
  console.log(`\n📊 Created:`)
  console.log(`- 1 Admin user (admin@noobblog.com)`)
  console.log(`- ${categories.length} Categories`)
  console.log(`- ${tags.length} Tags`)
  console.log(`- 1 Sample post`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
