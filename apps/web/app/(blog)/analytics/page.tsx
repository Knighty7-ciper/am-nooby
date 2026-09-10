import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/session'
import { AnalyticsDashboard } from '@/components/analytics-dashboard'

export const metadata: Metadata = {
  title: 'Analytics | Blog',
  description: 'Track your content performance',
}

export default async function AnalyticsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/handler/sign-in')
  }

  // Only authors, editors, and admins can view analytics
  if (!['AUTHOR', 'EDITOR', 'ADMIN'].includes(user.role)) {
    redirect('/?error=insufficient_permissions')
  }

  return <AnalyticsDashboard userId={user.id} role={user.role} />
}
