import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireRole } from '@/lib/session'

// GET all guides (admin)
export async function GET() {
  try {
    await requireRole(['ADMIN'])
    
    const guides = await prisma.guide.findMany({
      orderBy: { order: 'asc' },
    })
    
    return NextResponse.json(guides)
  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
}

// POST - Create new guide (admin only)
export async function POST(req: NextRequest) {
  try {
    await requireRole(['ADMIN'])
    
    const body = await req.json()
    const { title, description, videoUrl, thumbnail, duration, level } = body
    
    const guide = await prisma.guide.create({
      data: {
        title,
        description,
        videoUrl,
        thumbnail,
        duration,
        level,
      },
    })
    
    return NextResponse.json(guide)
  } catch (error) {
    console.error('Create guide error:', error)
    return NextResponse.json(
      { error: 'Failed to create guide' },
      { status: 500 }
    )
  }
}
