import { prisma } from '../index';
import type { Post, PostStatus } from '@prisma/client';

/**
 * Get post by slug with full details
 */
export async function getPostBySlug(slug: string) {
  return await prisma.post.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
          bio: true,
        },
      },
      category: true,
      series: true,
      tags: {
        include: {
          tag: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
          bookmarks: true,
          views: true,
        },
      },
    },
  });
}

/**
 * Get published posts with pagination and filters
 */
export async function getPublishedPosts({
  page = 1,
  limit = 10,
  categoryId,
  tagId,
  authorId,
  featured,
  search,
}: {
  page?: number;
  limit?: number;
  categoryId?: string;
  tagId?: string;
  authorId?: string;
  featured?: boolean;
  search?: string;
}) {
  const skip = (page - 1) * limit;
  
  const where: any = {
    status: 'PUBLISHED',
    publishedAt: { lte: new Date() },
  };
  
  if (categoryId) where.categoryId = categoryId;
  if (authorId) where.authorId = authorId;
  if (featured !== undefined) where.featured = featured;
  if (tagId) {
    where.tags = {
      some: { tagId },
    };
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ];
  }
  
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
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
        tags: {
          include: { tag: true },
          take: 5,
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            views: true,
          },
        },
      },
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.post.count({ where }),
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
 * Get trending posts (most views/likes in last 7 days)
 */
export async function getTrendingPosts(limit = 10) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  return await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      publishedAt: { gte: sevenDaysAgo },
    },
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
          views: true,
          comments: true,
        },
      },
    },
    orderBy: [
      { viewCount: 'desc' },
      { likeCount: 'desc' },
    ],
    take: limit,
  });
}

/**
 * Get related posts based on category and tags
 */
export async function getRelatedPosts(postId: string, limit = 5) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: {
      categoryId: true,
      tags: {
        select: { tagId: true },
      },
    },
  });
  
  if (!post) return [];
  
  const tagIds = post.tags.map((t) => t.tagId);
  
  return await prisma.post.findMany({
    where: {
      id: { not: postId },
      status: 'PUBLISHED',
      OR: [
        { categoryId: post.categoryId },
        {
          tags: {
            some: {
              tagId: { in: tagIds },
            },
          },
        },
      ],
    },
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
    },
    take: limit,
    orderBy: { publishedAt: 'desc' },
  });
}

/**
 * Increment post view count
 */
export async function incrementPostViews(postId: string, userId?: string, ipAddress?: string) {
  await prisma.$transaction([
    prisma.post.update({
      where: { id: postId },
      data: { viewCount: { increment: 1 } },
    }),
    prisma.view.create({
      data: {
        postId,
        userId,
        ipAddress,
      },
    }),
  ]);
}

/**
 * Create a new post
 */
export async function createPost(data: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  authorId: string;
  categoryId?: string;
  status?: PostStatus;
  tags?: string[];
}) {
  const { tags, ...postData } = data;
  
  return await prisma.post.create({
    data: {
      ...postData,
      tags: tags ? {
        create: tags.map((tagId) => ({
          tag: { connect: { id: tagId } },
        })),
      } : undefined,
    },
    include: {
      author: true,
      category: true,
      tags: {
        include: { tag: true },
      },
    },
  });
}

/**
 * Update a post
 */
export async function updatePost(id: string, data: Partial<Post>) {
  return await prisma.post.update({
    where: { id },
    data,
  });
}

/**
 * Delete a post
 */
export async function deletePost(id: string) {
  return await prisma.post.delete({
    where: { id },
  });
}
