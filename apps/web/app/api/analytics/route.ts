import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@noobblog/database'
import { stackServerApp } from '@/lib/stack-server'

export const dynamic = 'force-dynamic'

// Track a view
export async function POST(request: NextRequest) {
  try {
    const { postId } = await request.json()

    if (!postId) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 })
    }

    // Get user ID if authenticated
    const user = await stackServerApp.getUser().catch(() => null)

    // Create view record
    await prisma.view.create({
      data: {
        postId,
        userId: user?.id,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    // Increment view count on post
    await prisma.post.update({
      where: { id: postId },
      data: { viewCount: { increment: 1 } },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('View tracking error:', error)
    return NextResponse.json({ error: 'Failed to track view' }, { status: 500 })
  }
}

// Get analytics for a post
export async function GET(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')

    if (!postId) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 })
    }

    // Check if user owns the post or is admin
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
    })

    if (post?.authorId !== user.id && userProfile?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get view analytics
    const views = await prisma.view.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' },
    })

    // Group by date
    const viewsByDate = views.reduce((acc: any, view) => {
      const date = view.createdAt.toISOString().split('T')[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {})

    return NextResponse.json({
      total: views.length,
      viewsByDate,
      recentViews: views.slice(0, 100),
    })
  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
