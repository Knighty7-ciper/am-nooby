import { prisma } from '../index';
import type { User, UserRole, UserStatus } from '@prisma/client';

/**
 * Get user by ID with related data
 */
export async function getUserById(id: string, includeStats = true) {
  return await prisma.user.findUnique({
    where: { id },
    include: includeStats ? {
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },
    } : undefined,
  });
}

/**
 * Get user by username
 */
export async function getUserByUsername(username: string) {
  return await prisma.user.findUnique({
    where: { username },
    include: {
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },
    },
  });
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

/**
 * Update user profile
 */
export async function updateUserProfile(id: string, data: Partial<User>) {
  return await prisma.user.update({
    where: { id },
    data,
  });
}

/**
 * Get user's posts with pagination
 */
export async function getUserPosts(userId: string, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { authorId: userId, status: 'PUBLISHED' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        category: true,
        _count: {
          select: {
            likes: true,
            comments: true,
            bookmarks: true,
          },
        },
      },
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.post.count({
      where: { authorId: userId, status: 'PUBLISHED' },
    }),
  ]);
  
  return {
    posts,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get top authors by post count
 */
export async function getTopAuthors(limit = 10) {
  return await prisma.user.findMany({
    where: {
      role: { in: ['AUTHOR', 'EDITOR', 'ADMIN'] },
      status: 'ACTIVE',
    },
    orderBy: { postCount: 'desc' },
    take: limit,
    select: {
      id: true,
      name: true,
      username: true,
      avatar: true,
      bio: true,
      postCount: true,
      followerCount: true,
    },
  });
}

/**
 * Check if user is following another user
 */
export async function isFollowing(followerId: string, followingId: string) {
  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });
  return !!follow;
}

/**
 * Follow a user
 */
export async function followUser(followerId: string, followingId: string) {
  return await prisma.$transaction([
    prisma.follow.create({
      data: { followerId, followingId },
    }),
    prisma.user.update({
      where: { id: followerId },
      data: { followingCount: { increment: 1 } },
    }),
    prisma.user.update({
      where: { id: followingId },
      data: { followerCount: { increment: 1 } },
    }),
  ]);
}

/**
 * Unfollow a user
 */
export async function unfollowUser(followerId: string, followingId: string) {
  return await prisma.$transaction([
    prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    }),
    prisma.user.update({
      where: { id: followerId },
      data: { followingCount: { decrement: 1 } },
    }),
    prisma.user.update({
      where: { id: followingId },
      data: { followerCount: { decrement: 1 } },
    }),
  ]);
}
