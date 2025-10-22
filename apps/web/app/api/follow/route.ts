import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@noobblog/database'
import { stackServerApp } from '@/lib/stack-server'

// Follow/Unfollow a user
export async function POST(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { targetUserId } = await request.json()

    if (!targetUserId || targetUserId === user.id) {
      return NextResponse.json({ error: 'Invalid target user' }, { status: 400 })
    }

    // Check if already following
    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: targetUserId,
        },
      },
    })

    if (existing) {
      // Unfollow
      await prisma.follow.delete({
        where: { id: existing.id },
      })

      return NextResponse.json({ following: false })
    } else {
      // Follow
      await prisma.follow.create({
        data: {
          followerId: user.id,
          followingId: targetUserId,
        },
      })

      return NextResponse.json({ following: true })
    }
  } catch (error) {
    console.error('Follow toggle error:', error)
    return NextResponse.json({ error: 'Failed to toggle follow' }, { status: 500 })
  }
}

// Get user's followers/following
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type') // 'followers' or 'following'

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    if (type === 'followers') {
      const followers = await prisma.follow.findMany({
        where: { followingId: userId },
        include: {
          follower: true,
        },
      })
      return NextResponse.json({ followers })
    } else {
      const following = await prisma.follow.findMany({
        where: { followerId: userId },
        include: {
          following: true,
        },
      })
      return NextResponse.json({ following })
    }
  } catch (error) {
    console.error('Follow fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch follows' }, { status: 500 })
  }
}