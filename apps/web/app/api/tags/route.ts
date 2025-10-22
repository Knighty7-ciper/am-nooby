import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@noobblog/database'
import { z } from 'zod'
import { stackServerApp } from '@/lib/stack-server'

export const dynamic = 'force-dynamic'

const tagSchema = z.object({
  name: z.string().min(1).max(50),
  slug: z.string().min(1).max(50),
})

// Get all tags
export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ tags })
  } catch (error) {
    console.error('Tags fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 })
  }
}

// Create tag
export async function POST(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = tagSchema.parse(body)

    const tag = await prisma.tag.create({
      data,
    })

    return NextResponse.json({ tag }, { status: 201 })
  } catch (error) {
    console.error('Tag creation error:', error)
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 })
  }
}
