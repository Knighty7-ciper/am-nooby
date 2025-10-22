import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@noobblog/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')
    const type = searchParams.get('type') || 'all' // all, posts, users, tags

    if (!q) {
      return NextResponse.json({ error: 'Search query required' }, { status: 400 })
    }

    const results: any = {}

    if (type === 'all' || type === 'posts') {
      results.posts = await prisma.post.findMany({
        where: {
          AND: [
            { status: 'PUBLISHED' },
            {
              OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { excerpt: { contains: q, mode: 'insensitive' } },
                { content: { contains: q, mode: 'insensitive' } },
              ],
            },
          ],
        },
        include: {
          author: true,
          category: true,
        },
        take: 20,
        orderBy: { viewCount: 'desc' },
      })
    }

    if (type === 'all' || type === 'users') {
      results.users = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { username: { contains: q, mode: 'insensitive' } },
            { bio: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 10,
      })
    }

    if (type === 'all' || type === 'tags') {
      results.tags = await prisma.tag.findMany({
        where: {
          name: { contains: q, mode: 'insensitive' },
        },
        take: 10,
      })
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}