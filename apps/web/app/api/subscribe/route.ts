import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/session'
import { getSubscriptionPrice, generatePaymentReference, initializePayment } from '@/lib/pesapal'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user already has an active Pro subscription
    if (user.subscriptionPlan === 'PRO' && user.subscriptionStatus === 'ACTIVE') {
      return NextResponse.json(
        { error: 'You already have an active Pro subscription' },
        { status: 400 }
      )
    }

    const amount = getSubscriptionPrice()
    const reference = generatePaymentReference(user.id)
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback`

    // Store pending payment in database
    await prisma.payment.create({
      data: {
        userId: user.id,
        reference,
        amount,
        status: 'PENDING',
        provider: 'PESAPAL',
      },
    })

    // Make actual API call to PesaPal to get checkout URL
    const paymentResult = await initializePayment({
      userId: user.id,
      userEmail: user.email,
      userName: user.name || user.email,
      amount,
      reference,
      description: `Pro Subscription - ${user.email}`,
      callbackUrl,
    })

    console.log(`Payment initialized for user ${user.id}, reference: ${reference}`)

    // Return the actual PesaPal checkout URL
    return NextResponse.json({ 
      paymentUrl: paymentResult.checkoutUrl,
      reference: paymentResult.reference,
    })
  } catch (error) {
    console.error('Payment initialization error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to initialize payment' },
      { status: 500 }
    )
  }
}
