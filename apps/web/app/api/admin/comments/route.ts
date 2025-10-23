import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/session'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    await requireRole(['ADMIN'])

    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        user: {
          select: {
            name: true,
            username: true,
            avatar: true,
          },
        },
        post: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    })

    return NextResponse.json(comments)
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
