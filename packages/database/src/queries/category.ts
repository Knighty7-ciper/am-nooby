import { prisma } from '../index';

/**
 * Get all categories with post counts
 */
export async function getAllCategories() {
  return await prisma.category.findMany({
    orderBy: { postCount: 'desc' },
    include: {
      _count: {
        select: {
          posts: {
            where: {
              status: 'PUBLISHED',
            },
          },
        },
      },
    },
  });
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string) {
  return await prisma.category.findUnique({
    where: { slug },
    include: {
      _count: {
        select: {
          posts: {
            where: {
              status: 'PUBLISHED',
            },
          },
        },
      },
    },
  });
}

/**
 * Create a category
 */
export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
}) {
  return await prisma.category.create({
    data,
  });
}

/**
 * Update a category
 */
export async function updateCategory(id: string, data: Partial<{
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
}>) {
  return await prisma.category.update({
    where: { id },
    data,
  });
}

/**
 * Delete a category
 */
export async function deleteCategory(id: string) {
  return await prisma.category.delete({
    where: { id },
  });
}
