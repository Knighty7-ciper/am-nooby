# 📖 Feature Gating Quick Reference

Quick copy-paste examples for implementing feature gates throughout your app.

---

## 📊 Import Statement

Add this to any file where you need feature gating:

```typescript
import { hasFeature, getRemainingPosts, canCreatePost } from '@/lib/features'
import { getCurrentUser } from '@/lib/session'
```

---

## 🛡️ Server Component Examples

### Check if User Can Access Feature

```typescript
// In any server component
export default async function MyPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/handler/signin')
  }
  
  // Check specific feature
  const canSchedule = hasFeature(user.subscriptionPlan, 'canSchedulePosts')
  
  if (!canSchedule) {
    return <UpgradeToPro variant="feature-locked" />
  }
  
  // Show the feature
  return <SchedulePostUI />
}
```

### Show Different UI Based on Plan

```typescript
export default async function DashboardPage() {
  const user = await getCurrentUser()
  const canAccessAnalytics = hasFeature(user.subscriptionPlan, 'canAccessAnalytics')
  
  return (
    <div>
      {canAccessAnalytics ? (
        <AdvancedAnalytics />
      ) : (
        <div>
          <BasicAnalytics />
          <UpgradePrompt feature="Advanced Analytics" />
        </div>
      )}
    </div>
  )
}
```

### Check Post Limits

```typescript
export default async function WritePage() {
  const user = await getCurrentUser()
  const { remaining, total, used } = await getRemainingPosts(
    user.id,
    user.subscriptionPlan
  )
  
  if (remaining === 0) {
    return (
      <UpgradeToPro
        variant="post-limit"
        reason={`You've used all ${total} posts this month. Upgrade for unlimited posts!`}
      />
    )
  }
  
  return (
    <div>
      {remaining !== -1 && remaining <= 3 && (
        <WarningBanner remaining={remaining} />
      )}
      <Editor />
    </div>
  )
}
```

---

## 🎨 Client Component Examples

### Conditional Button Rendering

```typescript
'use client'

import { SubscriptionPlan } from '@prisma/client'
import { hasFeature } from '@/lib/features'

interface Props {
  userPlan: SubscriptionPlan
}

export function PostActions({ userPlan }: Props) {
  const canSchedule = hasFeature(userPlan, 'canSchedulePosts')
  
  return (
    <div className="flex gap-2">
      <button onClick={saveDraft}>Save Draft</button>
      <button onClick={publish}>Publish Now</button>
      
      {canSchedule ? (
        <button onClick={schedulePost}>Schedule</button>
      ) : (
        <button onClick={() => showUpgradeModal()}
                className="opacity-50">
          Schedule (Pro)
        </button>
      )}
    </div>
  )
}
```

### Lock Feature with Modal

```typescript
'use client'

import { useState } from 'react'
import { hasFeature } from '@/lib/features'

export function SeriesButton({ userPlan }) {
  const [showModal, setShowModal] = useState(false)
  const canCreateSeries = hasFeature(userPlan, 'canCreateSeries')
  
  const handleClick = () => {
    if (!canCreateSeries) {
      setShowModal(true)
      return
    }
    // Create series logic
  }
  
  return (
    <>
      <button onClick={handleClick}>
        Create Series {!canCreateSeries && '🔒'}
      </button>
      
      {showModal && (
        <UpgradeModal 
          feature="Series & Collections"
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
```

---

## 📝 API Route Examples

### Protect API Endpoint

```typescript
// app/api/schedule-post/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/session'
import { hasFeature } from '@/lib/features'

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  if (!hasFeature(user.subscriptionPlan, 'canSchedulePosts')) {
    return NextResponse.json(
      { error: 'Upgrade to Pro to schedule posts' },
      { status: 403 }
    )
  }
  
  // Proceed with scheduling
  const data = await request.json()
  // ... schedule post logic
  
  return NextResponse.json({ success: true })
}
```

### Check Post Limit Before Creating

```typescript
// app/api/posts/route.ts
import { canCreatePost } from '@/lib/features'

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  
  // Check if user can create post
  const { allowed, reason } = await canCreatePost(
    user.id,
    user.subscriptionPlan
  )
  
  if (!allowed) {
    return NextResponse.json(
      { error: reason },
      { status: 403 }
    )
  }
  
  // Create the post
  // ...
}
```

---

## 🎭 UI Component Patterns

### Feature Badge

```typescript
function FeatureBadge({ feature }: { feature: string }) {
  return (
    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
      PRO
    </span>
  )
}

// Usage
<button>
  Advanced Analytics <FeatureBadge feature="analytics" />
</button>
```

### Locked Feature Card

```typescript
function FeatureCard({ title, locked, userPlan }: Props) {
  const isLocked = locked && userPlan === 'FREE'
  
  return (
    <div className={`card ${isLocked ? 'opacity-50' : ''}`}>
      <div className="flex justify-between items-start">
        <h3>{title}</h3>
        {isLocked && <Lock className="w-4 h-4" />}
      </div>
      
      {isLocked ? (
        <div>
          <p className="text-sm text-gray-600">Upgrade to unlock</p>
          <Button size="sm" asChild>
            <Link href="/pricing">Upgrade</Link>
          </Button>
        </div>
      ) : (
        <div>
          {/* Feature content */}
        </div>
      )}
    </div>
  )
}
```

### Inline Upgrade Prompt

```typescript
function InlineUpgradePrompt({ feature }: { feature: string }) {
  return (
    <div className="border-2 border-primary/20 rounded-lg p-6 bg-primary/5">
      <div className="flex items-start gap-4">
        <Sparkles className="w-8 h-8 text-primary flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-bold mb-2">Unlock {feature}</h3>
          <p className="text-sm text-gray-600 mb-4">
            Upgrade to Pro to access this powerful feature
          </p>
          <Button asChild>
            <Link href="/pricing">View Plans</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
```

---

## 🧩 Reusable Components to Create

### 1. UpgradeModal Component

```typescript
// components/upgrade-modal.tsx
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import Link from 'next/link'

interface UpgradeModalProps {
  open: boolean
  onClose: () => void
  feature: string
}

export function UpgradeModal({ open, onClose, feature }: UpgradeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Upgrade to Pro
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4">
            <strong>{feature}</strong> is a Pro feature.
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Upgrade now to unlock this feature and many more!
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Maybe Later
            </Button>
            <Button asChild className="flex-1">
              <Link href="/pricing">View Plans</Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

### 2. PlanBadge Component

```typescript
// components/plan-badge.tsx
import { SubscriptionPlan } from '@prisma/client'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Zap } from 'lucide-react'

interface PlanBadgeProps {
  plan: SubscriptionPlan
}

export function PlanBadge({ plan }: PlanBadgeProps) {
  if (plan === 'PRO') {
    return (
      <Badge className="bg-primary">
        <Zap className="w-3 h-3 mr-1" />
        Pro
      </Badge>
    )
  }
  
  return (
    <Badge variant="secondary">
      <Sparkles className="w-3 h-3 mr-1" />
      Free
    </Badge>
  )
}
```

### 3. PostLimitIndicator Component

```typescript
// components/post-limit-indicator.tsx
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'

interface PostLimitIndicatorProps {
  used: number
  total: number
  remaining: number
}

export function PostLimitIndicator({ used, total, remaining }: PostLimitIndicatorProps) {
  if (total === -1) return null // PRO user, no limit
  
  const percentage = (used / total) * 100
  const isLow = remaining <= 3
  
  return (
    <div className={`p-4 rounded-lg ${
      isLow ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'
    }`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">
          Posts this month: {used} / {total}
        </span>
        {isLow && (
          <Link href="/pricing" className="text-sm text-primary hover:underline">
            Upgrade
          </Link>
        )}
      </div>
      <Progress value={percentage} className="h-2" />
      {isLow && (
        <p className="text-xs text-orange-700 mt-2">
          Only {remaining} post{remaining !== 1 ? 's' : ''} remaining
        </p>
      )}
    </div>
  )
}
```

---

## 📊 Dashboard Integration Example

```typescript
// app/dashboard/page.tsx
import { getCurrentUser } from '@/lib/session'
import { getRemainingPosts } from '@/lib/features'
import { PostLimitIndicator } from '@/components/post-limit-indicator'
import { PlanBadge } from '@/components/plan-badge'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  const { used, total, remaining } = await getRemainingPosts(
    user.id,
    user.subscriptionPlan
  )
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}!</p>
        </div>
        <PlanBadge plan={user.subscriptionPlan} />
      </div>
      
      {user.subscriptionPlan === 'FREE' && (
        <PostLimitIndicator 
          used={used} 
          total={total} 
          remaining={remaining} 
        />
      )}
      
      {/* Rest of dashboard */}
    </div>
  )
}
```

---

## 🔑 Available Features Reference

```typescript
// From lib/features.ts

FEATURES = {
  // Post limits
  FREE_POST_LIMIT: 10,
  PRO_POST_LIMIT: -1, // unlimited
  
  // Feature checks (all return boolean)
  canSchedulePosts: (plan) => plan === 'PRO',
  canCreateSeries: (plan) => plan === 'PRO',
  canAccessAnalytics: (plan) => plan === 'PRO',
  canCustomizeProfile: (plan) => plan === 'PRO',
  canUsePremiumContent: (plan) => plan === 'PRO',
  canExportContent: (plan) => plan === 'PRO',
}
```

---

## ✨ Pro Tips

1. **Always check features server-side** for security
2. **Use client checks for UX** (hiding buttons, showing locks)
3. **Be generous with upgrade prompts** but not annoying
4. **Show value** when asking users to upgrade
5. **Make free tier useful** - 10 posts/month is generous
6. **Test both plans** thoroughly before launch

---

## 🛠️ Testing Checklist

- [ ] FREE user can create 10 posts
- [ ] FREE user sees warning at 3 remaining
- [ ] FREE user blocked at 11th post
- [ ] PRO user has unlimited posts
- [ ] Editing doesn't count against limit
- [ ] Locked features show upgrade prompts
- [ ] PRO features work for PRO users
- [ ] Dashboard shows correct plan badge
- [ ] Post limit indicator accurate

---

Copy these patterns and adapt them to your needs! 🚀
