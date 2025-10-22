import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@noobblog/database'
import { stackServerApp } from '@/lib/stack-server'

export const dynamic = 'force-dynamic'

// Update category
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await stackServerApp.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
    })

    if (userProfile?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const updated = await prisma.category.update({
      where: { id: params.id },
      data: body,
    })

    return NextResponse.json({ category: updated })
  } catch (error) {
    console.error('Category update error:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

// Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await stackServerApp.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
    })

    if (userProfile?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.category.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Category deletion error:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
