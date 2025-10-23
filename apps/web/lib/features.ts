import { SubscriptionPlan } from '@prisma/client'
import prisma from '@/lib/prisma'

/**
 * Feature definitions for different subscription plans
 */
export const FEATURES = {
  // Post limits
  FREE_POST_LIMIT: 10, // per month
  PRO_POST_LIMIT: -1, // unlimited
  
  // Feature flags
  canSchedulePosts: (plan: SubscriptionPlan) => plan === 'PRO',
  canCreateSeries: (plan: SubscriptionPlan) => plan === 'PRO',
  canAccessAnalytics: (plan: SubscriptionPlan) => plan === 'PRO',
  canCustomizeProfile: (plan: SubscriptionPlan) => plan === 'PRO',
  canUsePremiumContent: (plan: SubscriptionPlan) => plan === 'PRO',
  canExportContent: (plan: SubscriptionPlan) => plan === 'PRO',
} as const

/**
 * Check if user has access to a specific feature
 */
export function hasFeature(
  plan: SubscriptionPlan,
  feature: keyof typeof FEATURES
): boolean {
  const featureCheck = FEATURES[feature]
  
  if (typeof featureCheck === 'function') {
    return featureCheck(plan)
  }
  
  return false
}

/**
 * Get monthly post limit for a plan
 */
export function getPostLimit(plan: SubscriptionPlan): number {
  return plan === 'PRO' ? FEATURES.PRO_POST_LIMIT : FEATURES.FREE_POST_LIMIT
}

/**
 * Calculate remaining posts for current month
 */
export async function getRemainingPosts(
  userId: string,
  plan: SubscriptionPlan
): Promise<{ remaining: number; total: number; used: number }> {
  const limit = getPostLimit(plan)
  
  // If unlimited (PRO), return special values
  if (limit === -1) {
    return { remaining: -1, total: -1, used: 0 }
  }
  
  // Get first day of current month
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  
  // Count posts created this month
  const postsThisMonth = await prisma.post.count({
    where: {
      authorId: userId,
      createdAt: {
        gte: firstDayOfMonth,
      },
    },
  })
  
  const remaining = Math.max(0, limit - postsThisMonth)
  
  return {
    remaining,
    total: limit,
    used: postsThisMonth,
  }
}

/**
 * Check if user can create a new post
 */
export async function canCreatePost(
  userId: string,
  plan: SubscriptionPlan
): Promise<{ allowed: boolean; reason?: string }> {
  const { remaining } = await getRemainingPosts(userId, plan)
  
  if (remaining === -1) {
    return { allowed: true }
  }
  
  if (remaining <= 0) {
    return {
      allowed: false,
      reason: 'Monthly post limit reached. Upgrade to Pro for unlimited posts.',
    }
  }
  
  return { allowed: true }
}

/**
 * Get feature comparison for pricing page
 */
export function getFeatureComparison() {
  return {
    FREE: {
      name: 'Free',
      price: 0,
      features: [
        'Up to 10 posts per month',
        'Basic analytics',
        'Community support',
        'Standard editor',
      ],
    },
    PRO: {
      name: 'Pro',
      price: 9.99,
      features: [
        'Unlimited posts',
        'Advanced analytics',
        'Post scheduling',
        'Series & collections',
        'Premium content support',
        'Profile customization',
        'Content export',
        'Priority support',
      ],
    },
  }
}
