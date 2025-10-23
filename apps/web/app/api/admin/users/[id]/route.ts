import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/session'
import prisma from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(['ADMIN'])
    
    const { action, role } = await request.json()
    const userId = params.id

    let updateData: any = {}

    if (action === 'suspend') {
      updateData.status = 'SUSPENDED'
    } else if (action === 'ban') {
      updateData.status = 'BANNED'
    } else if (action === 'activate') {
      updateData.status = 'ACTIVE'
      if (role) {
        updateData.role = role
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    })

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(['ADMIN'])

    await prisma.user.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
