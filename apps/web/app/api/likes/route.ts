import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@noobblog/database'
import { stackServerApp } from '@/lib/stack-server'

// Toggle like on a post
export async function POST(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { postId } = await request.json()

    if (!postId) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 })
    }

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId,
        },
      },
    })

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: { id: existingLike.id },
      })
      
      await prisma.post.update({
        where: { id: postId },
        data: { likeCount: { decrement: 1 } },
      })

      return NextResponse.json({ liked: false })
    } else {
      // Like
      await prisma.like.create({
        data: {
          userId: user.id,
          postId,
        },
      })

      await prisma.post.update({
        where: { id: postId },
        data: { likeCount: { increment: 1 } },
      })

      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error('Like toggle error:', error)
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 })
  }
}

// Get user's liked posts
export async function GET(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const likes = await prisma.like.findMany({
      where: { userId: user.id },
      include: {
        post: {
          include: {
            author: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ likes })
  } catch (error) {
    console.error('Likes fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch likes' }, { status: 500 })
  }
}