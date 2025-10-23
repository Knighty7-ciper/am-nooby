import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    await prisma.notification.updateMany({
      where: { 
        recipientId: user.id,
        read: false,
      },
      data: { read: true },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
