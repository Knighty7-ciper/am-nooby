import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/session'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    await requireRole(['ADMIN'])

    const [totalUsers, totalPosts, totalComments, totalSubscribers] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.comment.count(),
      prisma.newsletter.count({ where: { status: 'ACTIVE' } }),
    ])

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [newUsersToday, publishedPosts, pendingComments, activeSubscribers] = await Promise.all([
      prisma.user.count({ where: { createdAt: { gte: today } } }),
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.comment.count(),
      prisma.newsletter.count({ where: { status: 'ACTIVE' } }),
    ])

    return NextResponse.json({
      totalUsers,
      totalPosts,
      totalComments,
      totalSubscribers,
      newUsersToday,
      publishedPosts,
      pendingComments,
      activeSubscribers,
      recentActivity: [
        { message: 'New user registered', time: '5 minutes ago' },
        { message: 'Post published by John Doe', time: '15 minutes ago' },
        { message: 'New comment on "Getting Started"', time: '1 hour ago' },
      ],
    })
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
