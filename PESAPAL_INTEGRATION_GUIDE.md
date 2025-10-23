# PesaPal Payment Integration Guide

## Overview

PesaPal is integrated into NoobBlog to handle Pro subscription payments. This guide will help you configure and test the payment system.

## 🔑 Environment Variables Setup

### Step 1: Add PesaPal Credentials to Netlify

You mentioned having issues adding the PesaPal keys to your env file. Here's the **correct way** to add them:

1. **Go to Netlify Dashboard** → Your Site → Site Settings → Environment Variables

2. **Add these THREE variables** (click "Add a variable" for each):

```bash
# Variable 1
Key:   PESAPAL_CONSUMER_KEY
Value: tQofl7BAKu8QUx7oD1kMg/qmfUzITnMg

# Variable 2
Key:   PESAPAL_CONSUMER_SECRET
Value: Q4XAb5j1TWPRv8qHySWf0r9muBM=

# Variable 3
Key:   PESAPAL_ENVIRONMENT
Value: sandbox
```

**IMPORTANT**: 
- Don't wrap values in quotes
- Copy-paste exactly as shown
- The `=` sign in the secret is part of the value
- After adding all three, click "Save" or "Deploy"

### Step 2: Local Development (.env.local)

For local testing, create/update `apps/web/.env.local`:

```bash
# PesaPal Configuration
PESAPAL_CONSUMER_KEY="tQofl7BAKu8QUx7oD1kMg/qmfUzITnMg"
PESAPAL_CONSUMER_SECRET="Q4XAb5j1TWPRv8qHySWf0r9muBM="
PESAPAL_ENVIRONMENT="sandbox"
```

**NOTE**: Use quotes in `.env.local` to handle special characters like `=`.

### Step 3: Test Configuration

Create a test file to verify the keys are loaded:

```typescript
// Test in your terminal or create a test route
console.log('PesaPal Keys:', {
  key: process.env.PESAPAL_CONSUMER_KEY,
  secret: process.env.PESAPAL_CONSUMER_SECRET?.substring(0, 5) + '...', // Only show first 5 chars
  env: process.env.PESAPAL_ENVIRONMENT,
})
```

## 📋 Implementation Status

### ✅ Completed
1. **Feature Gating System** - `lib/features.ts`
2. **Subscription Schema** - Database has `subscriptionPlan`, `subscriptionStatus`, `subscriptionEndsAt`
3. **Post Limit Enforcement** - Write page checks monthly limits
4. **Upgrade UI** - Beautiful upgrade page with your aesthetic images
5. **PesaPal Library** - `lib/pesapal.ts` with OAuth signature generation

### 🔨 To Implement (Next Steps)

#### 1. Payment API Route

Create `apps/web/app/api/subscribe/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/session'
import { initializePayment, getSubscriptionPrice, generatePaymentReference } from '@/lib/pesapal'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const amount = getSubscriptionPrice()
    const reference = generatePaymentReference(user.id)
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback`

    const paymentData = await initializePayment({
      userId: user.id,
      userEmail: user.email,
      userName: user.name || user.username,
      amount,
      reference,
      description: 'NoobBlog Pro Subscription - Monthly',
      callbackUrl,
    })

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

    return NextResponse.json({ paymentUrl: paymentData.url, reference })
  } catch (error) {
    console.error('Payment initialization error:', error)
    return NextResponse.json({ error: 'Failed to initialize payment' }, { status: 500 })
  }
}
```

#### 2. Payment Callback Route

Create `apps/web/app/api/payment/callback/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { verifyPayment } from '@/lib/pesapal'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const reference = searchParams.get('pesapal_merchant_reference')
  const trackingId = searchParams.get('pesapal_transaction_tracking_id')

  if (!reference || !trackingId) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/pricing?error=invalid`)
  }

  try {
    // Verify payment with PesaPal
    const verification = await verifyPayment(reference, trackingId)
    
    // TODO: Parse verification response and check status
    // If COMPLETED, update user subscription
    
    const payment = await prisma.payment.findFirst({
      where: { reference },
      include: { user: true },
    })

    if (!payment) {
      throw new Error('Payment not found')
    }

    // Update payment and user
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
          subscriptionEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      }),
    ])

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=subscribed`)
  } catch (error) {
    console.error('Payment callback error:', error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/pricing?error=verification`)
  }
}
```

#### 3. Add Payment Model to Prisma Schema

Add to `packages/database/prisma/schema.prisma`:

```prisma
enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

enum PaymentProvider {
  PESAPAL
  STRIPE
  PAYPAL
}

model Payment {
  id          String          @id @default(cuid())
  userId      String
  reference   String          @unique
  trackingId  String?
  amount      Float
  currency    String          @default("KES")
  status      PaymentStatus   @default(PENDING)
  provider    PaymentProvider @default(PESAPAL)
  
  createdAt   DateTime        @default(now())
  completedAt DateTime?
  
  user        User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([reference])
  @@index([status])
}
```

Then add to User model:
```prisma
model User {
  // ... existing fields
  payments    Payment[]
}
```

#### 4. Update Pricing Page

Add a "Subscribe Now" button that calls the payment API:

```typescript
'use client'

const handleSubscribe = async () => {
  try {
    const response = await fetch('/api/subscribe', { method: 'POST' })
    const data = await response.json()
    
    if (data.paymentUrl) {
      // Redirect to PesaPal payment page
      window.location.href = data.paymentUrl
    }
  } catch (error) {
    console.error('Subscription error:', error)
  }
}
```

## 🧪 Testing

### Sandbox Mode (Current)
1. Use the sandbox credentials you provided
2. Test payments won't charge real money
3. Use PesaPal test card numbers (check their documentation)

### Production Mode
1. Change `PESAPAL_ENVIRONMENT` to `production`
2. Update credentials to production keys
3. Test with small real transactions first

## 🔒 Security Best Practices

1. **Never expose secrets in frontend code**
2. **Always verify payments server-side**
3. **Use webhook callbacks for payment confirmation**
4. **Log all payment attempts**
5. **Implement retry logic for failed verifications**

## 📚 Resources

- [PesaPal API Documentation](https://developer.pesapal.com/)
- [PesaPal Test Environment](https://demo.pesapal.com/)
- [OAuth 1.0 Signature Guide](https://oauth.net/core/1.0a/)

## ⚠️ Important Notes

- **Currency**: Currently set to KES (Kenyan Shillings). Pro plan is 1,299 KES (~$9.99 USD)
- **Subscription Duration**: 30 days (monthly)
- **Auto-renewal**: Not implemented yet - requires webhook setup
- **Cancellation**: Users keep Pro until `subscriptionEndsAt` date

## 🆘 Troubleshooting

### Error: "Environment variable not defined"
- Verify variables are added in Netlify dashboard
- Redeploy your site after adding variables
- Check for typos in variable names

### Error: "Invalid OAuth signature"
- Verify consumer key and secret are correct
- Check for extra spaces or quotes
- Ensure timestamp is within 5 minutes of PesaPal server time

### Payment stuck at "PENDING"
- Check PesaPal dashboard for transaction status
- Verify callback URL is publicly accessible
- Check server logs for callback errors

---

**Next Steps**: Implement the payment routes and update the Prisma schema, then test the full payment flow!
