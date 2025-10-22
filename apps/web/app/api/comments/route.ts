import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@noobblog/database'
import { z } from 'zod'
import { stackServerApp } from '@/lib/stack-server'

const commentSchema = z.object({
  content: z.string().min(1).max(5000),
  postId: z.string(),
  parentId: z.string().optional(),
})

// Create comment
export async function POST(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = commentSchema.parse(body)

    const comment = await prisma.comment.create({
      data: {
        ...data,
        authorId: user.id,
      },
      include: {
        author: true,
        replies: true,
      },
    })

    // Increment comment count on post
    await prisma.post.update({
      where: { id: data.postId },
      data: { commentCount: { increment: 1 } },
    })

    return NextResponse.json({ comment }, { status: 201 })
  } catch (error) {
    console.error('Comment creation error:', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}

// Get comments for a post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')
    const parentId = searchParams.get('parentId')

    if (!postId) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 })
    }

    const where: any = { postId }
    
    if (parentId) {
      where.parentId = parentId
    } else {
      where.parentId = null // Only top-level comments
    }

    const comments = await prisma.comment.findMany({
      where,
      include: {
        author: true,
        replies: {
          include: {
            author: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ comments })
  } catch (error) {
    console.error('Comments fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}