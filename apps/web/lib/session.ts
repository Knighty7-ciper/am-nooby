import { stackServerApp } from '@/lib/stack-server'
import prisma from '@/lib/prisma'

export async function getCurrentUser() {
  try {
    const user = await stackServerApp.getUser()
    
    if (!user) return null

    // Get user from database with full details
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar: true,
        bio: true,
        role: true,
        status: true,
        followerCount: true,
        followingCount: true,
        postCount: true,
      },
    })

    return dbUser
  } catch (error) {
    console.error('Failed to get current user:', error)
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function requireRole(allowedRoles: string[]) {
  const user = await requireAuth()
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Forbidden')
  }
  return user
}
