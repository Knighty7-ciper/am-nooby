import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@noobblog/database'
import { stackServerApp } from '@/lib/stack-server'

export const dynamic = 'force-dynamic'

// Toggle bookmark on a post
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

    // Check if already bookmarked
    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId,
        },
      },
    })

    if (existing) {
      // Remove bookmark
      await prisma.bookmark.delete({
        where: { id: existing.id },
      })

      return NextResponse.json({ bookmarked: false })
    } else {
      // Add bookmark
      await prisma.bookmark.create({
        data: {
          userId: user.id,
          postId,
        },
      })

      return NextResponse.json({ bookmarked: true })
    }
  } catch (error) {
    console.error('Bookmark toggle error:', error)
    return NextResponse.json({ error: 'Failed to toggle bookmark' }, { status: 500 })
  }
}

// Get user's bookmarked posts
export async function GET(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const bookmarks = await prisma.bookmark.findMany({
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

    return NextResponse.json({ bookmarks })
  } catch (error) {
    console.error('Bookmarks fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 })
  }
}
