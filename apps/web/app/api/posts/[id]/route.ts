import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@noobblog/database'
import { getCurrentUser } from '@/lib/session'
import { createUniqueSlug, postInputSchema, prepareTags } from '@/lib/post-input'

export const dynamic = 'force-dynamic'

function canManagePost(role: string, authorId: string, userId: string) {
  return role === 'ADMIN' || authorId === userId
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        tags: {
          include: { tag: true },
        },
      },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (!canManagePost(user.role, post.authorId, user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({
      post: {
        ...post,
        tags: post.tags.map(({ tag }) => tag.name),
      },
    })
  } catch (error) {
    console.error('Post fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!['AUTHOR', 'EDITOR', 'ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const existingPost = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        tags: {
          include: { tag: true },
        },
      },
    })

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (!canManagePost(user.role, existingPost.authorId, user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const data = postInputSchema.parse(await request.json())
    const { tags, slug: requestedSlug, ...postData } = data
    const slug = await createUniqueSlug(requestedSlug || data.title, existingPost.id)
    const tagData = prepareTags(tags)
    const previousTagSlugs = new Set(existingPost.tags.map(({ tag }) => tag.slug))
    const nextTagSlugs = new Set(tagData.map(({ slug }) => slug))
    const readingTime = Math.max(1, Math.ceil(data.content.trim().split(/\s+/).length / 200))
    const publishedAt = data.status === 'PUBLISHED' ? existingPost.publishedAt || new Date() : null

    const post = await prisma.$transaction(async (tx) => {
      const updatedPost = await tx.post.update({
        where: { id: existingPost.id },
        data: {
          ...postData,
          slug,
          readingTime,
          publishedAt,
          tags: {
            deleteMany: {},
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

      if (existingPost.categoryId !== data.categoryId) {
        if (existingPost.categoryId) {
          await tx.category.update({
            where: { id: existingPost.categoryId },
            data: { postCount: { decrement: 1 } },
          })
        }

        if (data.categoryId) {
          await tx.category.update({
            where: { id: data.categoryId },
            data: { postCount: { increment: 1 } },
          })
        }
      }

      if (existingPost.seriesId !== data.seriesId) {
        if (existingPost.seriesId) {
          await tx.series.update({
            where: { id: existingPost.seriesId },
            data: { postCount: { decrement: 1 } },
          })
        }

        if (data.seriesId) {
          await tx.series.update({
            where: { id: data.seriesId },
            data: { postCount: { increment: 1 } },
          })
        }
      }

      for (const slug of previousTagSlugs) {
        if (!nextTagSlugs.has(slug)) {
          await tx.tag.update({
            where: { slug },
            data: { postCount: { decrement: 1 } },
          })
        }
      }

      for (const slug of nextTagSlugs) {
        if (!previousTagSlugs.has(slug)) {
          await tx.tag.update({
            where: { slug },
            data: { postCount: { increment: 1 } },
          })
        }
      }

      return updatedPost
    })

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Post update error:', error)

    if (error instanceof Error && 'issues' in error) {
      return NextResponse.json({ error: 'Invalid post data' }, { status: 400 })
    }

    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}
