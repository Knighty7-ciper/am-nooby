import { prisma } from '@noobblog/database'
import { z } from 'zod'

export const postInputSchema = z.object({
  title: z.string().trim().min(1).max(255),
  slug: z.string().trim().min(1).max(255).optional(),
  excerpt: z.string().trim().optional(),
  content: z.string().min(1),
  coverImage: z.string().url().optional().or(z.literal('')).transform((value) => value || null),
  categoryId: z.string().trim().min(1).optional().or(z.literal('')).transform((value) => value || null),
  seriesId: z.string().trim().min(1).optional().or(z.literal('')).transform((value) => value || null),
  tags: z.array(z.string().trim().min(1).max(50)).default([]),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED']).default('DRAFT'),
  featured: z.boolean().default(false),
  allowComments: z.boolean().default(true),
  isPremium: z.boolean().default(false),
  scheduledFor: z.string().datetime().optional().or(z.literal('')).transform((value) => value ? new Date(value) : null),
  metaTitle: z.string().trim().max(255).optional(),
  metaDescription: z.string().trim().optional(),
  keywords: z.array(z.string().trim().min(1).max(50)).default([]),
})

export function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function createUniqueSlug(value: string, excludePostId?: string) {
  const baseSlug = toSlug(value) || 'post'
  let suffix = 0

  while (true) {
    const slug = suffix === 0 ? baseSlug : `${baseSlug}-${suffix}`
    const existingPost = await prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!existingPost || existingPost.id === excludePostId) return slug

    suffix += 1
  }
}

export function prepareTags(tags: string[]) {
  const tagsBySlug = new Map<string, string>()

  for (const tag of tags) {
    const name = tag.trim()
    const slug = toSlug(name)

    if (slug) tagsBySlug.set(slug, name)
  }

  return Array.from(tagsBySlug, ([slug, name]) => ({ slug, name }))
}
