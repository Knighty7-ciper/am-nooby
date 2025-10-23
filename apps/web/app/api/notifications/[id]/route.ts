import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import prisma from '@/lib/prisma'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth()
    const { read } = await request.json()

    const notification = await prisma.notification.update({
      where: { 
        id: params.id,
        recipientId: user.id,
      },
      data: { read },
    })

    return NextResponse.json(notification)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth()

    await prisma.notification.delete({
      where: { 
        id: params.id,
        recipientId: user.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
