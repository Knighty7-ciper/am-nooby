import { prisma } from '../index';

/**
 * Get comments for a post with nested replies
 */
export async function getPostComments(postId: string) {
  return await prisma.comment.findMany({
    where: {
      postId,
      parentId: null, // Only top-level comments
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
        },
      },
      replies: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            },
          },
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  avatar: true,
                },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Create a comment
 */
export async function createComment(data: {
  content: string;
  postId: string;
  userId: string;
  parentId?: string;
}) {
  return await prisma.$transaction(async (tx) => {
    const comment = await tx.comment.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
    
    // Increment post comment count
    await tx.post.update({
      where: { id: data.postId },
      data: { commentCount: { increment: 1 } },
    });
    
    return comment;
  });
}

/**
 * Delete a comment
 */
export async function deleteComment(id: string) {
  return await prisma.$transaction(async (tx) => {
    const comment = await tx.comment.findUnique({
      where: { id },
      select: { postId: true },
    });
    
    if (!comment) throw new Error('Comment not found');
    
    await tx.comment.delete({ where: { id } });
    
    // Decrement post comment count
    await tx.post.update({
      where: { id: comment.postId },
      data: { commentCount: { decrement: 1 } },
    });
  });
}

/**
 * Update a comment
 */
export async function updateComment(id: string, content: string) {
  return await prisma.comment.update({
    where: { id },
    data: { content },
  });
}
