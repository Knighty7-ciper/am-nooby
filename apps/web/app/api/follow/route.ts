import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    const body = await request.json()
    const { followingId } = body

    const user = await requireAuth()

    // Create follow relationship
    await prisma.follow.create({
      data: {
        followerId: user.id,
        followingId,
      },
    })

    // Update counts
    await Promise.all([
      prisma.user.update({
        where: { id: user.id },
        data: { followingCount: { increment: 1 } },
      }),
      prisma.user.update({
        where: { id: followingId },
        data: { followerCount: { increment: 1 } },
      }),
    ])

    // Create notification
    await prisma.notification.create({
      data: {
        type: 'FOLLOW',
        title: 'New Follower',
        message: `${user.name} started following you`,
        link: `/${user.username}`,
        recipientId: followingId,
        senderId: user.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to follow' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth()
    const { followingId } = await request.json()

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId,
        },
      },
    })

    // Update counts
    await Promise.all([
      prisma.user.update({
        where: { id: user.id },
        data: { followingCount: { decrement: 1 } },
      }),
      prisma.user.update({
        where: { id: followingId },
        data: { followerCount: { decrement: 1 } },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to unfollow' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type') // 'following' or 'followers'

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    if (type === 'following') {
      const following = await prisma.follow.findMany({
        where: { followerId: userId },
        include: {
          following: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
              bio: true,
              postCount: true,
              followerCount: true,
            },
          },
        },
      })
      return NextResponse.json(following.map(f => f.following))
    } else {
      const followers = await prisma.follow.findMany({
        where: { followingId: userId },
        include: {
          follower: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
              bio: true,
              postCount: true,
              followerCount: true,
            },
          },
        },
      })
      return NextResponse.json(followers.map(f => f.follower))
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
