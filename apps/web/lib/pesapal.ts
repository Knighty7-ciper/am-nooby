import crypto from 'crypto'

/**
 * PesaPal Configuration
 * Handles payment processing for Pro subscriptions - Production Ready
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
 * Generate OAuth signature for PesaPal API requests (OAuth 1.0)
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
 * Initialize payment with PesaPal - PRODUCTION VERSION
 * Makes actual API call to PesaPal and returns checkout URL
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
}): Promise<{ checkoutUrl: string; reference: string }> {
  const baseUrl = PESAPAL_URLS[config.environment]
  const endpoint = `${baseUrl}/PostPesapalDirectOrderV4`
  
  const params: Record<string, string> = {
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
      Currency: 'KES',
    }),
  }

  const signature = generateOAuthSignature('POST', endpoint, params)
  params['oauth_signature'] = signature

  // Build the form data for POST request
  const formData = new URLSearchParams(params)

  try {
    // Make actual POST request to PesaPal
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    })

    const responseText = await response.text()

    // PesaPal returns an iframe URL in the response
    // Extract the checkout URL from the response
    if (!responseText || responseText.includes('error')) {
      throw new Error(`PesaPal API error: ${responseText}`)
    }

    // The response is typically an iframe URL or redirect URL
    const checkoutUrl = responseText.trim()

    return {
      checkoutUrl,
      reference,
    }
  } catch (error) {
    console.error('PesaPal initializePayment error:', error)
    throw new Error(`Failed to initialize payment with PesaPal: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Verify payment status - PRODUCTION VERSION
 * Makes actual API call to PesaPal to verify payment status
 */
export async function verifyPayment(
  reference: string,
  trackingId: string
): Promise<{ status: string; method: string; reference: string }> {
  const baseUrl = PESAPAL_URLS[config.environment]
  const endpoint = `${baseUrl}/QueryPaymentStatus`

  const params: Record<string, string> = {
    oauth_consumer_key: config.consumerKey,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_version: '1.0',
    pesapal_merchant_reference: reference,
    pesapal_transaction_tracking_id: trackingId,
  }

  const signature = generateOAuthSignature('GET', endpoint, params)
  params['oauth_signature'] = signature

  // Build query string for GET request
  const queryString = new URLSearchParams(params).toString()
  const fullUrl = `${endpoint}?${queryString}`

  try {
    // Make actual GET request to PesaPal
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/plain',
      },
    })

    const responseText = await response.text()

    // PesaPal returns status in format: pesapal_response_data=<status>&pesapal_transaction_tracking_id=<id>
    // OR just the status directly (COMPLETED, PENDING, FAILED, INVALID)
    const statusMatch = responseText.match(/pesapal_response_data=([^&]+)/)
    const status = statusMatch ? statusMatch[1] : responseText.trim()

    // Extract payment method if available
    const methodMatch = responseText.match(/pesapal_payment_method=([^&]+)/)
    const method = methodMatch ? methodMatch[1] : 'unknown'

    return {
      status: status.toUpperCase(),
      method,
      reference,
    }
  } catch (error) {
    console.error('PesaPal verifyPayment error:', error)
    throw new Error(`Failed to verify payment with PesaPal: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
