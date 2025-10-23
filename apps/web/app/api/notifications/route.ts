import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    const notifications = await prisma.notification.findMany({
      where: { recipientId: user.id },
      include: {
        sender: {
          select: {
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json(notifications)
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    await prisma.notification.updateMany({
      where: { read: false },
      data: { read: true },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to mark as read' }, { status: 500 })
  }
}
