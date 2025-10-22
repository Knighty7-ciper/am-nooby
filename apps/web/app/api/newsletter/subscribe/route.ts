import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@noobblog/database'
import { z } from 'zod'

const subscribeSchema = z.object({
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = subscribeSchema.parse(body)

    // Check if already subscribed
    const existing = await prisma.newsletter.findUnique({
      where: { email },
    })

    if (existing) {
      if (existing.status === 'ACTIVE') {
        return NextResponse.json(
          { error: 'Already subscribed' },
          { status: 400 }
        )
      }
      
      // Reactivate subscription
      await prisma.newsletter.update({
        where: { email },
        data: { status: 'ACTIVE' },
      })
      
      return NextResponse.json({ message: 'Subscription reactivated' })
    }

    // Create new subscription
    await prisma.newsletter.create({
      data: { email },
    })

    return NextResponse.json({ message: 'Successfully subscribed' })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}
