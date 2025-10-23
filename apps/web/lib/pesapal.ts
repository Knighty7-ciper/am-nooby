import crypto from 'crypto'

/**
 * PesaPal Configuration
 * Handles payment processing for Pro subscriptions
 */

interface PesaPalConfig {
  consumerKey: string
  consumerSecret: string
  environment: 'sandbox' | 'production'
}

const config: PesaPalConfig = {
  consumerKey: process.env.PESAPAL_CONSUMER_KEY || '',
  consumerSecret: process.env.PESAPAL_CONSUMER_SECRET || '',
  environment: (process.env.PESAPAL_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
}

const PESAPAL_URLS = {
  sandbox: 'https://demo.pesapal.com/api',
  production: 'https://www.pesapal.com/api',
}

/**
 * Generate OAuth signature for PesaPal API requests
 */
function generateOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>
): string {
  const baseString = Object.keys(params)
    .sort()
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join('&')

  const signatureBaseString = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(baseString)}`

  const signingKey = `${encodeURIComponent(config.consumerSecret)}&`

  const signature = crypto
    .createHmac('sha1', signingKey)
    .update(signatureBaseString)
    .digest('base64')

  return signature
}

/**
 * Initialize payment with PesaPal
 */
export async function initializePayment({
  userId,
  userEmail,
  userName,
  amount,
  reference,
  description,
  callbackUrl,
}: {
  userId: string
  userEmail: string
  userName: string
  amount: number
  reference: string
  description: string
  callbackUrl: string
}) {
  const baseUrl = PESAPAL_URLS[config.environment]
  
  const params = {
    oauth_consumer_key: config.consumerKey,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_version: '1.0',
    oauth_callback: callbackUrl,
    pesapal_request_data: JSON.stringify({
      Amount: amount,
      Description: description,
      Type: 'MERCHANT',
      Reference: reference,
      Email: userEmail,
      FirstName: userName.split(' ')[0] || userName,
      LastName: userName.split(' ')[1] || '',
      Currency: 'KES', // Kenyan Shillings - adjust as needed
    }),
  }

  const signature = generateOAuthSignature('POST', `${baseUrl}/PostPesapalDirectOrderV4`, params)
  params['oauth_signature'] = signature

  return {
    url: `${baseUrl}/PostPesapalDirectOrderV4`,
    params,
    reference,
  }
}

/**
 * Verify payment status
 */
export async function verifyPayment(reference: string, trackingId: string) {
  const baseUrl = PESAPAL_URLS[config.environment]

  const params = {
    oauth_consumer_key: config.consumerKey,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_version: '1.0',
    pesapal_merchant_reference: reference,
    pesapal_transaction_tracking_id: trackingId,
  }

  const signature = generateOAuthSignature(
    'GET',
    `${baseUrl}/QueryPaymentStatus`,
    params
  )
  params['oauth_signature'] = signature

  return {
    url: `${baseUrl}/QueryPaymentStatus`,
    params,
  }
}

/**
 * Get subscription price
 * KES 150/month - Perfect starting price for Kenyan market
 */
export function getSubscriptionPrice(): number {
  return 150 // KES
}

/**
 * Generate unique payment reference
 */
export function generatePaymentReference(userId: string): string {
  return `PRO-${userId}-${Date.now()}`
}
