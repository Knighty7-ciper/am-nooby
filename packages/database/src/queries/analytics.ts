import { prisma } from '../index';

/**
 * Get analytics for a date range
 */
export async function getAnalytics(startDate: Date, endDate: Date) {
  return await prisma.analytics.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { date: 'asc' },
  });
}

/**
 * Record daily analytics
 */
export async function recordDailyAnalytics(date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const [views, users, comments, likes, posts, subscribers] = await Promise.all([
    prisma.view.count({
      where: {
        createdAt: { gte: startOfDay, lte: endOfDay },
      },
    }),
    prisma.user.count({
      where: {
        createdAt: { gte: startOfDay, lte: endOfDay },
      },
    }),
    prisma.comment.count({
      where: {
        createdAt: { gte: startOfDay, lte: endOfDay },
      },
    }),
    prisma.like.count({
      where: {
        createdAt: { gte: startOfDay, lte: endOfDay },
      },
    }),
    prisma.post.count({
      where: {
        publishedAt: { gte: startOfDay, lte: endOfDay },
      },
    }),
    prisma.newsletter.count({
      where: {
        subscribedAt: { gte: startOfDay, lte: endOfDay },
      },
    }),
  ]);
  
  // Get unique visitors (approximate)
  const uniqueVisitors = await prisma.view.groupBy({
    by: ['ipAddress'],
    where: {
      createdAt: { gte: startOfDay, lte: endOfDay },
      ipAddress: { not: null },
    },
    _count: true,
  });
  
  return await prisma.analytics.upsert({
    where: { date: startOfDay },
    create: {
      date: startOfDay,
      totalViews: views,
      uniqueVisitors: uniqueVisitors.length,
      totalPosts: posts,
      totalComments: comments,
      totalLikes: likes,
      newUsers: users,
      newSubscribers: subscribers,
    },
    update: {
      totalViews: views,
      uniqueVisitors: uniqueVisitors.length,
      totalPosts: posts,
      totalComments: comments,
      totalLikes: likes,
      newUsers: users,
      newSubscribers: subscribers,
    },
  });
}

/**
 * Get top posts by views
 */
export async function getTopPostsByViews(limit = 10, days = 30) {
  const dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() - days);
  
  return await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      publishedAt: { gte: dateFrom },
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
        },
      },
      _count: {
        select: {
          views: true,
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: { viewCount: 'desc' },
    take: limit,
  });
}

/**
 * Get dashboard stats
 */
export async function getDashboardStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const [totalUsers, totalPosts, totalComments, todayViews, activeUsers] = await Promise.all([
    prisma.user.count(),
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.comment.count(),
    prisma.view.count({ where: { createdAt: { gte: today } } }),
    prisma.user.count({
      where: {
        lastLoginAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
    }),
  ]);
  
  return {
    totalUsers,
    totalPosts,
    totalComments,
    todayViews,
    activeUsers,
  };
}
