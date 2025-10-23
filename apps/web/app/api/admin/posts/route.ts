import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/session'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    await requireRole(['ADMIN'])

    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        author: {
          select: {
            name: true,
            username: true,
          },
        },
      },
    })

    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
