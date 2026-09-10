import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@noobblog/database'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/session'

export const dynamic = 'force-dynamic'

const profileSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  username: z.string().trim().min(3).max(50).regex(/^[a-zA-Z0-9_-]+$/).optional(),
  bio: z.string().trim().max(500).optional(),
  avatar: z.string().url().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  location: z.string().trim().max(100).optional(),
  twitter: z.string().trim().max(50).optional(),
  github: z.string().trim().max(50).optional(),
  linkedin: z.string().trim().max(100).optional(),
  newsletter: z.boolean().optional(),
  darkMode: z.boolean().optional(),
})

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        _count: {
          select: {
            posts: true,
            comments: true,
            followers: true,
            following: true,
          },
        },
      },
    })

    return NextResponse.json({ user: profile })
  } catch (error) {
    console.error('User fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = profileSchema.parse(await request.json())
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...data,
        avatar: data.avatar || null,
        website: data.website || null,
      },
    })

    return NextResponse.json({ user: updated })
  } catch (error) {
    console.error('User update error:', error)

    if (error instanceof Error && 'issues' in error) {
      return NextResponse.json({ error: 'Invalid profile data' }, { status: 400 })
    }

    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}
