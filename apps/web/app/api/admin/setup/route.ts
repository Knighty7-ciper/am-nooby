import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { stackServerApp } from '@/lib/stack-server'

// This endpoint sets the currently logged-in user as admin
// Security: Should be disabled after first use or protected by a secret key
export async function POST(req: NextRequest) {
  try {
    const { setupKey } = await req.json()
    
    // Simple setup key protection - change this to a strong secret
    if (setupKey !== 'nooby-admin-setup-2024') {
      return NextResponse.json(
        { error: 'Invalid setup key' },
        { status: 401 }
      )
    }
    
    // Get current user from Stack Auth
    const stackUser = await stackServerApp.getUser()
    
    if (!stackUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    // Update user to admin role
    const user = await prisma.user.upsert({
      where: { id: stackUser.id },
      update: {
        role: 'ADMIN',
        email: stackUser.primaryEmail || '',
        emailVerified: stackUser.primaryEmailVerified,
      },
      create: {
        id: stackUser.id,
        email: stackUser.primaryEmail || '',
        username: stackUser.primaryEmail?.split('@')[0] || 'user',
        role: 'ADMIN',
        status: 'ACTIVE',
        emailVerified: stackUser.primaryEmailVerified,
      },
    })
    
    return NextResponse.json({
      success: true,
      message: 'User promoted to admin successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Admin setup error:', error)
    return NextResponse.json(
      { error: 'Failed to set up admin user' },
      { status: 500 }
    )
  }
}
