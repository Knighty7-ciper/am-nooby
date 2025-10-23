import { NextRequest, NextResponse } from 'next/server'
import { verifyPayment } from '@/lib/pesapal'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const reference = searchParams.get('pesapal_merchant_reference')
  const trackingId = searchParams.get('pesapal_transaction_tracking_id')

  if (!reference || !trackingId) {
    console.error('Missing required parameters:', { reference, trackingId })
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/pricing?error=invalid_callback`
    )
  }

  try {
    // Find the payment record
    const payment = await prisma.payment.findFirst({
      where: { reference },
      include: { user: true },
    })

    if (!payment) {
      console.error('Payment not found for reference:', reference)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/pricing?error=payment_not_found`
      )
    }

    // If payment is already completed, redirect to success
    if (payment.status === 'COMPLETED') {
      console.log(`Payment ${reference} already completed, redirecting to success`)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=already_subscribed`
      )
    }

    // Make actual API call to PesaPal to verify payment status
    console.log(`Verifying payment with PesaPal: ${reference}, tracking: ${trackingId}`)
    const verification = await verifyPayment(reference, trackingId)

    console.log(`PesaPal verification result:`, verification)

    // Check if payment was successful
    if (verification.status === 'COMPLETED') {
      // Payment successful - update database in a transaction
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

      console.log(`✅ Payment completed successfully for user ${payment.userId}`)

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=subscribed`
      )
    } else if (verification.status === 'PENDING') {
      // Payment is still pending
      console.log(`Payment ${reference} is still pending`)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/pricing?status=pending`
      )
    } else if (verification.status === 'FAILED' || verification.status === 'INVALID') {
      // Payment failed
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
          trackingId,
        },
      })

      console.log(`❌ Payment ${reference} failed with status: ${verification.status}`)

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/pricing?error=payment_failed`
      )
    } else {
      // Unknown status
      console.error(`Unknown payment status: ${verification.status}`)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/pricing?error=unknown_status`
      )
    }
  } catch (error) {
    console.error('Payment callback error:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/pricing?error=verification_failed`
    )
  }
}
