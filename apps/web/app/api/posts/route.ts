import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@noobblog/database'
import { canCreatePost } from '@/lib/features'
import { getCurrentUser } from '@/lib/session'
import { createUniqueSlug, postInputSchema, prepareTags } from '@/lib/post-input'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!['AUTHOR', 'EDITOR', 'ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const access = await canCreatePost(user.id, user.subscriptionPlan)

    if (!access.allowed) {
      return NextResponse.json({ error: access.reason }, { status: 403 })
    }

    const data = postInputSchema.parse(await request.json())
    const { tags, slug: requestedSlug, ...postData } = data
    const slug = await createUniqueSlug(requestedSlug || data.title)
    const tagData = prepareTags(tags)
    const readingTime = Math.max(1, Math.ceil(data.content.trim().split(/\s+/).length / 200))

    const post = await prisma.$transaction(async (tx) => {
      const createdPost = await tx.post.create({
        data: {
          ...postData,
          slug,
          authorId: user.id,
          readingTime,
          publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
          tags: {
            create: tagData.map((tag) => ({
              tag: {
                connectOrCreate: {
                  where: { slug: tag.slug },
                  create: tag,
                },
              },
            })),
          },
        },
      })

      await tx.user.update({
        where: { id: user.id },
        data: { postCount: { increment: 1 } },
      })

      if (data.categoryId) {
        await tx.category.update({
          where: { id: data.categoryId },
          data: { postCount: { increment: 1 } },
        })
      }

      if (data.seriesId) {
        await tx.series.update({
          where: { id: data.seriesId },
          data: { postCount: { increment: 1 } },
        })
      }

      for (const tag of tagData) {
        await tx.tag.update({
          where: { slug: tag.slug },
          data: { postCount: { increment: 1 } },
        })
      }

      return createdPost
    })

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error('Post creation error:', error)

    if (error instanceof Error && 'issues' in error) {
      return NextResponse.json({ error: 'Invalid post data' }, { status: 400 })
    }

    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1)
    const limit = Math.min(50, Math.max(1, Number.parseInt(searchParams.get('limit') || '20', 10) || 20))
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const author = searchParams.get('author')
    const featured = searchParams.get('featured') === 'true'
    const sort = searchParams.get('sort')
    const currentUser = author ? await getCurrentUser() : null
    const isOwnPosts = Boolean(author && currentUser?.username === author)
    const where: any = isOwnPosts ? { author: { username: author } } : { status: 'PUBLISHED' }

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

    if (featured) {
      where.featured = true
    }

    const orderBy = sort === 'trending'
      ? [{ viewCount: 'desc' as const }, { likeCount: 'desc' as const }, { publishedAt: 'desc' as const }]
      : isOwnPosts
        ? { updatedAt: 'desc' as const }
        : { publishedAt: 'desc' as const }

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
        orderBy,
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
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}
