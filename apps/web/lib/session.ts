import { stackServerApp } from '@/lib/stack-server'
import prisma from '@/lib/prisma'

// Admin emails that should get automatic admin access
const ADMIN_EMAILS = [
  'bknglabs.dev@gmail.com',
  'admin-free@noobblog.com',
]

export async function getCurrentUser() {
  try {
    const user = await stackServerApp.getUser()
    
    if (!user) return null

    // Check if user exists in database, if not create them
    let dbUser = await prisma.user.findUnique({
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
        subscriptionPlan: true,
        subscriptionStatus: true,
        subscriptionEndsAt: true,
      },
    })

    // If user doesn't exist in database, create them
    if (!dbUser) {
      const isAdmin = ADMIN_EMAILS.includes(user.primaryEmail || '')
      
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.primaryEmail || '',
          username: user.username || `user_${user.id.substring(0, 8)}`,
          name: user.displayName || user.username || 'User',
          avatar: user.imageUrl || null,
          role: isAdmin ? 'ADMIN' : 'READER',
          status: 'ACTIVE',
          followerCount: 0,
          followingCount: 0,
          postCount: 0,
          subscriptionPlan: isAdmin ? 'PRO' : 'FREE',
          subscriptionStatus: isAdmin ? 'ACTIVE' : 'CANCELED',
        },
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
          subscriptionPlan: true,
          subscriptionStatus: true,
          subscriptionEndsAt: true,
        },
      })

      console.log(`Created ${isAdmin ? 'ADMIN' : 'READER'} user: ${dbUser.email}`)
    }

    // Check if user should be admin but isn't yet
    const shouldBeAdmin = ADMIN_EMAILS.includes(dbUser.email) && dbUser.role !== 'ADMIN'
    
    if (shouldBeAdmin) {
      console.log(`Granting admin access to: ${dbUser.email}`)
      
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          role: 'ADMIN',
          subscriptionPlan: 'PRO',
          subscriptionStatus: 'ACTIVE',
        },
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
          subscriptionPlan: true,
          subscriptionStatus: true,
          subscriptionEndsAt: true,
        },
      })

      console.log(`✅ Admin access granted to: ${dbUser.email}`)
    }

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
