import { NextRequest, NextResponse } from 'next/server'
import { verifyPayment } from '@/lib/pesapal'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const reference = searchParams.get('pesapal_merchant_reference')
  const trackingId = searchParams.get('pesapal_transaction_tracking_id')

  if (!reference || !trackingId) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/pricing?error=invalid`
    )
  }

  try {
    // Verify payment with PesaPal
    const verification = await verifyPayment(reference, trackingId)
    
    // Find the payment record
    const payment = await prisma.payment.findFirst({
      where: { reference },
      include: { user: true },
    })

    if (!payment) {
      throw new Error('Payment not found')
    }

    // Check verification status
    // PesaPal returns status in verification response
    const paymentStatus = verification.status || verification.payment_status_description
    
    if (paymentStatus === 'COMPLETED' || paymentStatus === 'Completed') {
      // Update payment and user subscription in a transaction
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'COMPLETED',
            trackingId,
            completedAt: new Date(),
          },
        }),
        prisma.user.update({
          where: { id: payment.userId },
          data: {
            subscriptionPlan: 'PRO',
            subscriptionStatus: 'ACTIVE',
            subscriptionEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          },
        }),
      ])

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=subscribed`
      )
    } else if (paymentStatus === 'FAILED' || paymentStatus === 'Failed') {
      // Update payment status to failed
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
          trackingId,
        },
      })

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/pricing?error=payment_failed`
      )
    } else {
      // Payment is still pending or in another status
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/pricing?status=pending`
      )
    }
  } catch (error) {
    console.error('Payment callback error:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/pricing?error=verification`
    )
  }
}
