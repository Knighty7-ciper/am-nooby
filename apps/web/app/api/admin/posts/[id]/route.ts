import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/session'
import prisma from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(['ADMIN'])
    
    const { action } = await request.json()
    const postId = params.id

    let updateData: any = {}

    if (action === 'publish') {
      updateData = {
        status: 'PUBLISHED',
        publishedAt: new Date(),
      }
    } else if (action === 'unpublish') {
      updateData = {
        status: 'DRAFT',
      }
    } else if (action === 'feature') {
      const post = await prisma.post.findUnique({ where: { id: postId } })
      updateData = {
        featured: !post?.featured,
      }
    }

    const post = await prisma.post.update({
      where: { id: postId },
      data: updateData,
    })

    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(['ADMIN'])

    await prisma.post.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
