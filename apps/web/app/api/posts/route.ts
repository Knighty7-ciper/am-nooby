import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@noobblog/database'
import { z } from 'zod'

const postSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  coverImage: z.string().url().optional(),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED']).default('DRAFT'),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.array(z.string()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    // TODO: Get user from auth session
    const userId = 'user-id-from-auth' // Replace with actual auth

    const body = await request.json()
    const data = postSchema.parse(body)

    // Calculate reading time
    const wordsPerMinute = 200
    const words = data.content.split(/\s+/).length
    const readingTime = Math.ceil(words / wordsPerMinute)

    // Extract tags from data (many-to-many relation handled separately)
    const { tags, ...postData } = data

    // Create post
    const post = await prisma.post.create({
      data: {
        ...postData,
        authorId: userId,
        readingTime,
        publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
      },
    })

    // Add tags if provided
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        // Find or create tag
        const tag = await prisma.tag.upsert({
          where: { slug: tagName.toLowerCase().replace(/\s+/g, '-') },
          create: {
            name: tagName,
            slug: tagName.toLowerCase().replace(/\s+/g, '-'),
          },
          update: {},
        })

        // Link tag to post
        await prisma.postTag.create({
          data: {
            postId: post.id,
            tagId: tag.id,
          },
        })
      }
    }

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error('Post creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const author = searchParams.get('author')

    const where: any = {
      status: 'PUBLISHED',
    }

    if (category) {
      where.category = { slug: category }
    }

    if (tag) {
      where.tags = {
        some: {
          tag: { slug: tag },
        },
      }
    }

    if (author) {
      where.author = { username: author }
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: true,
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: {
          publishedAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where }),
    ])

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Posts fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}
