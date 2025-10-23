import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { stackServerApp } from '@/lib/stack-server'

// Admin emails that should get automatic admin access
const ADMIN_EMAILS = [
  'bknglabs.dev@gmail.com',
  'admin-free@noobblog.com',
]

// GET: Check admin status and auto-setup if needed
export async function GET(req: NextRequest) {
  try {
    const stackUser = await stackServerApp.getUser()
    
    if (!stackUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const isAdminEmail = ADMIN_EMAILS.includes(stackUser.email || '')

    // Get or create user
    const user = await prisma.user.upsert({
      where: { id: stackUser.id },
      update: {
        email: stackUser.email || '',
        name: stackUser.displayName || stackUser.username || 'User',
        avatar: stackUser.imageUrl || null,
        // Auto-grant admin if it's an admin email
        ...(isAdminEmail && {
          role: 'ADMIN',
          subscriptionPlan: 'PRO',
          subscriptionStatus: 'ACTIVE',
        }),
      },
      create: {
        id: stackUser.id,
        email: stackUser.email || '',
        username: stackUser.username || stackUser.email?.split('@')[0] || `user_${stackUser.id.substring(0, 8)}`,
        name: stackUser.displayName || stackUser.username || 'User',
        avatar: stackUser.imageUrl || null,
        role: isAdminEmail ? 'ADMIN' : 'READER',
        status: 'ACTIVE',
        subscriptionPlan: isAdminEmail ? 'PRO' : 'FREE',
        subscriptionStatus: isAdminEmail ? 'ACTIVE' : 'CANCELED',
      },
    })

    return NextResponse.json({
      success: true,
      message: isAdminEmail && user.role === 'ADMIN' 
        ? 'Welcome admin! ✅' 
        : 'User setup complete',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        subscriptionPlan: user.subscriptionPlan,
        isAdmin: user.role === 'ADMIN',
      },
      isAdminEmail,
    })

  } catch (error) {
    console.error('Admin setup error:', error)
    return NextResponse.json({ error: 'Setup failed' }, { status: 500 })
  }
}

// POST: Manual admin assignment (for emergency use)
export async function POST(req: NextRequest) {
  try {
    const { email, setupKey } = await req.json()
    
    // Optional protection key (can be removed if not needed)
    if (setupKey && setupKey !== 'nooby-admin-setup-2024') {
      return NextResponse.json({ error: 'Invalid setup key' }, { status: 401 })
    }

    if (!email || !ADMIN_EMAILS.includes(email)) {
      return NextResponse.json({ error: 'Only admin emails can be assigned admin role' }, { status: 400 })
    }

    const user = await prisma.user.findFirst({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ 
        error: 'User not found. They need to sign in first.', 
        instructions: 'User should sign up at https://noobblog.netlify.app with this email.' 
      }, { status: 404 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        role: 'ADMIN',
        subscriptionPlan: 'PRO',
        subscriptionStatus: 'ACTIVE',
      },
    })

    return NextResponse.json({
      success: true,
      message: `Admin access granted to ${email}`,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        subscriptionPlan: updatedUser.subscriptionPlan,
      },
    })

  } catch (error) {
    console.error('Manual admin setup error:', error)
    return NextResponse.json({ error: 'Setup failed' }, { status: 500 })
  }
}
