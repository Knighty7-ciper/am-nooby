import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireRole } from '@/lib/session'

// GET single guide
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(['ADMIN'])
    
    const guide = await prisma.guide.findUnique({
      where: { id: params.id },
    })
    
    if (!guide) {
      return NextResponse.json(
        { error: 'Guide not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(guide)
  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
}

// PATCH - Update guide
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(['ADMIN'])
    
    const body = await req.json()
    
    const guide = await prisma.guide.update({
      where: { id: params.id },
      data: body,
    })
    
    return NextResponse.json(guide)
  } catch (error) {
    console.error('Update guide error:', error)
    return NextResponse.json(
      { error: 'Failed to update guide' },
      { status: 500 }
    )
  }
}

// DELETE - Delete guide
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(['ADMIN'])
    
    await prisma.guide.delete({
      where: { id: params.id },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete guide error:', error)
    return NextResponse.json(
      { error: 'Failed to delete guide' },
      { status: 500 }
    )
  }
}
