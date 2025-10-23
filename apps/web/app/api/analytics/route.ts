import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/session'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    await requireRole(['AUTHOR', 'EDITOR', 'ADMIN'])
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const range = searchParams.get('range') || '30d'
    const role = searchParams.get('role')

    // Calculate date range
    const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Build where clause
    const where: any = {
      publishedAt: { gte: startDate },
      status: 'PUBLISHED',
    }
    
    if (role !== 'ADMIN' && userId) {
      where.authorId = userId
    }

    // Get stats
    const posts = await prisma.post.findMany({
      where,
      select: {
        viewCount: true,
        likeCount: true,
        commentCount: true,
      },
    })

    const totalViews = posts.reduce((sum, p) => sum + p.viewCount, 0)
    const totalLikes = posts.reduce((sum, p) => sum + p.likeCount, 0)
    const totalComments = posts.reduce((sum, p) => sum + p.commentCount, 0)

    // Get top posts
    const topPosts = await prisma.post.findMany({
      where,
      orderBy: { viewCount: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        slug: true,
        viewCount: true,
        likeCount: true,
        commentCount: true,
      },
    })

    // Admin-specific metrics
    let adminMetrics = {}
    if (role === 'ADMIN') {
      const totalUsers = await prisma.user.count()
      const newUsers = await prisma.user.count({
        where: { createdAt: { gte: startDate } },
      })
      const activeAuthors = await prisma.post.groupBy({
        by: ['authorId'],
        where: { publishedAt: { gte: startDate } },
      })
      
      adminMetrics = {
        totalUsers,
        newUsers,
        activeAuthors: activeAuthors.length,
        avgEngagement: totalViews > 0 
          ? Math.round(((totalLikes + totalComments) / totalViews) * 100)
          : 0,
      }
    }

    return NextResponse.json({
      stats: {
        totalViews,
        totalLikes,
        totalComments,
        totalPosts: posts.length,
        viewsChange: 12, // Mock data - would calculate from previous period
        likesChange: 8,
        commentsChange: 15,
        postsChange: 5,
        ...adminMetrics,
      },
      topPosts,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
